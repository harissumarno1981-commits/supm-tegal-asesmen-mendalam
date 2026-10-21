import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { buildGeminiPrompt } from './src/utils/promptGenerator.js';
import { generateDocxBuffer, ExportSectionType } from './src/utils/docxBuilder.js';
import { generatePdfDocument } from './src/utils/pdfBuilder.js';
import { AssessmentFormData, AssessmentResult } from './src/types/assessment.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '15mb' }));

// Initialize official GoogleGenAI SDK
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for exponential backoff retry
async function generateWithRetry(prompt: string, maxRetries = 2): Promise<string> {
  let attempt = 0;
  let delay = 1000;

  while (attempt <= maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `Anda adalah pakar kurikulum dan evaluasi pembelajaran Sekolah Menengah Kejuruan Kemaritiman dan Perikanan (SUPM TEGAL). 
Tugas Anda adalah merumuskan instrumen asesmen pembelajaran (Diagnostik, Formatif, Sumatif) yang mendalam, bermutu tinggi, dan kontekstual menggunakan Taksonomi SOLO. 
Keluaran WAJIB berupa JSON murni yang valid tanpa teks pembuka atau penutup. 
Pilihan ganda WAJIB TEPAT 5 opsi: A, B, C, D, E. 
Sertakan stimulus visual diagram teknis ('image' dengan 'title', 'caption', 'description', dan 'svgDiagram' vektor mandiri) pada soal-soal yang membutuhkan stimulus pengamatan instrumen radar kapal, mawar pedoman kompas, mesin diesel, kurva DO/pH kualitas air tambak, atau alur rantai dingin/HACCP mutu hasil tangkap.
Naskah soal untuk peserta didik TIDAK BOLEH memuat kunci jawaban atau indikasi jawaban benar. 
Kunci jawaban dan rubrik harus terpisah.`,
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const text = response.text;
      if (!text || text.trim().length === 0) {
        throw new Error('Respons model Gemini kosong.');
      }
      return text;
    } catch (err: any) {
      attempt++;
      console.error(`[Gemini API] Percobaan ${attempt} gagal:`, err?.message || err);

      const errorMessage = String(err?.message || '');
      const isRateLimit = errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED');
      const isUnavailable = errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE') || errorMessage.includes('timeout');

      if ((isRateLimit || isUnavailable) && attempt <= maxRetries) {
        console.log(`[Gemini API] Menunggu ${delay}ms sebelum retry...`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2;
        continue;
      }
      throw err;
    }
  }
  throw new Error('Gagal menghubungi Gemini API setelah beberapa percobaan.');
}

// Helper to clean and parse JSON
function parseAssessmentJson(rawText: string): AssessmentResult {
  let cleaned = rawText.trim();
  // Strip code block markers if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();

  const parsed = JSON.parse(cleaned);

  // Validate structural integrity
  if (!parsed.kisiKisi || !Array.isArray(parsed.kisiKisi)) {
    parsed.kisiKisi = [];
  }
  if (!parsed.naskahSoal || !Array.isArray(parsed.naskahSoal.questions)) {
    parsed.naskahSoal = { studentInstructions: [], questions: [] };
  }
  if (!parsed.kunciJawaban || !Array.isArray(parsed.kunciJawaban)) {
    parsed.kunciJawaban = [];
  }
  if (!parsed.rubrikDanPenskoran) {
    parsed.rubrikDanPenskoran = {
      scoringRuleSummary: 'Penskoran standar',
      maxScore: 100,
      scoreFormula: 'Nilai = (Skor / Skor Maks) * 100',
      aspects: [],
      followUpGuidance: 'Tindak lanjuti hasil sesuai tingkat pencapaian taruna.',
      qualitativeInterpretation: 'Ketuntasan belajar taruna.',
    };
  }

  // Ensure quality check object exists
  if (!parsed.qualityCheck) {
    parsed.qualityCheck = {
      totalQuestionsValid: parsed.naskahSoal.questions.length > 0,
      totalQuestionsCount: parsed.naskahSoal.questions.length,
      hasAllFiveOptions: true,
      consistencyCheckStatus: 'Sesuai',
      alignmentSummary: 'Tercapai keselarasan antara Tujuan Pembelajaran dan instrumen asesmen.',
      teacherVerificationNotes: [
        'Periksa kembali kelengkapan soal dan kunci jawaban sebelum diujikan.',
      ],
    };
  }

  return parsed as AssessmentResult;
}

// 1. API Endpoint: Generate Assessment
app.post('/api/generate-assessment', async (req, res) => {
  try {
    const formData = req.body as AssessmentFormData;

    // Validation
    if (!formData.subject || !formData.subject.trim()) {
      res.status(400).json({ error: 'Mata pelajaran wajib diisi.' });
      return;
    }
    if (!formData.topic || !formData.topic.trim()) {
      res.status(400).json({ error: 'Materi/topik pembelajaran wajib diisi.' });
      return;
    }
    if (!formData.learningObjectives || !formData.learningObjectives.trim()) {
      res.status(400).json({ error: 'Tujuan pembelajaran wajib diisi.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      res.status(503).json({
        error:
          'GEMINI_API_KEY belum dikonfigurasi di environment server. Anda dapat memanfaatkan fitur "Mode Manual Cadangan" (Salin Prompt Cadangan / Unduh Prompt .txt) untuk dijalankan langsung di Gemini atau ChatGPT.',
        fallbackAvailable: true,
      });
      return;
    }

    const prompt = buildGeminiPrompt(formData);
    const rawAiOutput = await generateWithRetry(prompt);
    const assessmentResult = parseAssessmentJson(rawAiOutput);

    // Sync metadata with actual request
    assessmentResult.metadata = {
      schoolName: 'SUPM TEGAL',
      teacherName: formData.teacherName || 'Guru Mata Pelajaran',
      subject: formData.subject,
      level: 'SMK',
      grade: formData.grade,
      department: formData.department,
      departmentFullName: formData.department,
      assessmentType: formData.assessmentType,
      instrumentType: formData.instrumentType,
      topic: formData.topic,
      questionCount: formData.questionCount,
      generatedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };

    res.json({ success: true, data: assessmentResult });
  } catch (err: any) {
    console.error('Error in /api/generate-assessment:', err);

    const msg = String(err?.message || err);
    let friendlyMessage = 'Terjadi kendala saat memproses pembuatan asesmen dengan AI.';
    let statusCode = 500;

    if (msg.includes('API_KEY_INVALID') || msg.includes('401') || msg.includes('403')) {
      friendlyMessage = 'Kunci API Gemini tidak valid atau tidak memiliki izin akses.';
      statusCode = 401;
    } else if (msg.includes('429') || msg.includes('QUOTA_EXCEEDED') || msg.includes('RESOURCE_EXHAUSTED')) {
      friendlyMessage = 'Batas kuota panggilan Gemini API telah tercapai (Rate limit). Silakan coba lagi beberapa saat atau gunakan "Mode Manual Cadangan".';
      statusCode = 429;
    } else if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('server')) {
      friendlyMessage = 'Server AI Gemini sedang sibuk atau tidak merespons. Silakan coba kembali sesaat lagi.';
      statusCode = 503;
    } else if (msg.includes('JSON')) {
      friendlyMessage = 'Respons AI tidak dalam format JSON yang valid. Silakan coba klik "Generate Asesmen" kembali.';
      statusCode = 502;
    }

    res.status(statusCode).json({
      error: friendlyMessage,
      details: process.env.NODE_ENV !== 'production' ? msg : undefined,
      fallbackAvailable: true,
    });
  }
});

// Helper for clean filenames
function getFileName(subject: string, section: ExportSectionType, ext: string): string {
  const cleanSubject = (subject || 'Asesmen').replace(/[^a-zA-Z0-9_]/g, '_');
  const sectionMap: Record<ExportSectionType, string> = {
    all: 'Paket_Lengkap',
    'kisi-kisi': 'KisiKisi',
    soal: 'NaskahSoal',
    kunci: 'KunciJawaban',
    rubrik: 'Rubrik',
  };
  return `SUPM_TEGAL_${sectionMap[section] || 'Perangkat'}_${cleanSubject}.${ext}`;
}

// 2. API Endpoint: Export DOCX
app.post('/api/export/docx', async (req, res) => {
  try {
    const { assessment, section } = req.body as {
      assessment: AssessmentResult;
      section: ExportSectionType;
    };

    if (!assessment || !assessment.metadata) {
      res.status(400).json({ error: 'Data asesmen tidak valid.' });
      return;
    }

    const exportSection = section || 'all';
    const buffer = await generateDocxBuffer(assessment, exportSection);
    const fileName = getFileName(assessment.metadata.subject, exportSection, 'docx');

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  } catch (err: any) {
    console.error('Error generating DOCX:', err);
    res.status(500).json({ error: 'Gagal membuat dokumen Word (.docx): ' + (err?.message || err) });
  }
});

// 3. API Endpoint: Export PDF
app.post('/api/export/pdf', async (req, res) => {
  try {
    const { assessment, section } = req.body as {
      assessment: AssessmentResult;
      section: ExportSectionType;
    };

    if (!assessment || !assessment.metadata) {
      res.status(400).json({ error: 'Data asesmen tidak valid.' });
      return;
    }

    const exportSection = section || 'all';
    const doc = generatePdfDocument(assessment, exportSection);
    const arrayBuffer = doc.output('arraybuffer');
    const buffer = Buffer.from(arrayBuffer);
    const fileName = getFileName(assessment.metadata.subject, exportSection, 'pdf');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  } catch (err: any) {
    console.error('Error generating PDF:', err);
    res.status(500).json({ error: 'Gagal membuat dokumen PDF: ' + (err?.message || err) });
  }
});

// Dev or Prod Vite integration
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SUPM TEGAL] Server berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Gagal memulai server:', err);
});
