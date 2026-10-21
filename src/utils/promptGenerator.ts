import { AssessmentFormData, DepartmentCode } from '../types/assessment';

export const DEPARTMENT_NAMES: Record<DepartmentCode, string> = {
  NKPI: 'Nautika Kapal Penangkap Ikan (NKPI)',
  TKPI: 'Teknika Kapal Penangkap Ikan (TKPI)',
  APPL: 'Agribisnis Perikanan Air Payau dan Laut (APPL)',
  APHP: 'Agribisnis Pengolahan Hasil Perikanan (APHP)',
};

export const SOLO_TAXONOMY_DESCRIPTIONS = {
  Prastruktural: 'Belum memahami konsep dasar/miskonsepsi; informasi tidak relevan atau acak',
  Unistruktural: 'Memahami satu fakta/prosedur/aspek teknis tunggal yang sederhana',
  Multistruktural: 'Mengetahui beberapa aspek/langkah/komponen secara terpisah tanpa menghubungkannya secara terpadu',
  Relasional: 'Mampu menghubungkan beberapa aspek, menganalisis hubungan sebab-akibat, memecahkan masalah kontekstual maritim/perikanan',
  'Abstrak Diperluas': 'Mampu membuat generalisasi ke ranah baru, menyusun hipotesis, mengevaluasi kritis, atau merancang solusi inovatif',
};

export function buildGeminiPrompt(data: AssessmentFormData): string {
  const deptName = DEPARTMENT_NAMES[data.department] || data.department;
  const cognitiveLevelsStr = data.cognitiveLevels && data.cognitiveLevels.length > 0 
    ? data.cognitiveLevels.join(', ') 
    : 'Semua Tingkatan Taksonomi SOLO secara bergradasi proporsional';

  return `
PERAN & IDENTITAS:
Anda adalah pakar kurikulum pendidikan vokasi kejuruan kemaritiman dan perikanan Indonesia, spesialis perancang asesmen SMK untuk SUPM (Sekolah Usaha Perikanan Menengah) TEGAL.

TUGAS:
Hasilkan perangkat asesmen pembelajaran yang mendalam, kontekstual, terstandar, dan lengkap sesuai format JSON yang ditentukan.

DATA IDENTITAS & RANCANGAN ASESMEN:
- Satuan Pendidikan: SUPM TEGAL
- Nama Guru: ${data.teacherName || 'Guru Mata Pelajaran'}
- Mata Pelajaran: ${data.subject}
- Jenjang: SMK
- Kelas: ${data.grade}
- Program Keahlian / Jurusan: ${deptName}
- Jenis Asesmen: ${data.assessmentType}
- Materi / Topik Pembelajaran: ${data.topic}
- Tujuan Pembelajaran (TP): ${data.learningObjectives}
${data.learningCompetencies ? `- Capaian Pembelajaran / Indikator Tambahan: ${data.learningCompetencies}` : ''}
- Bentuk Instrumen: ${data.instrumentType}
- Jumlah Soal / Tugas: ${data.questionCount} butir
- Tingkat Kognitif Target (Taksonomi SOLO): ${cognitiveLevelsStr}
${data.additionalInstructions ? `- Instruksi Khusus Guru: ${data.additionalInstructions}` : ''}

PEDOMAN LOGIKA JENIS ASESMEN (${data.assessmentType.toUpperCase()}):
${
  data.assessmentType === 'Diagnostik'
    ? `- DIAGNOSTIK: Fokus mengidentifikasi pengetahuan awal, prasyarat belajar, kesiapan mental/teknis taruna/taruni, dan deteksi potensi miskonsepsi dalam kejuruan maritim/perikanan.
- Rubrik dan rekomendasi WAJIB menyajikan pemetaan kelompok kesiapan (misal: Belum Paham, Paham Sebagian, Paham Utuh) serta rencana tindak lanjut diferensiasi pembelajaran.`
    : data.assessmentType === 'Formatif'
    ? `- FORMATIF: Fokus memantau proses belajar selama pembelajaran berlangsung, mengukur efektivitas metode, memberikan umpan balik segera (actionable feedback).
- Rubrik dan kunci menyertakan catatan umpan balik reflektif per butir dan strategi perbaikan pemahaman taruna secara langsung.`
    : `- SUMATIF: Fokus mengukur pencapaian standar kompetensi akhir lingkup materi atau akhir periode belajar dengan reliabilitas dan validitas tinggi.
- Kisi-kisi memiliki bobot terukur, naskah butir standar, kunci jawaban definitif, dan pedoman penskoran kuantitatif dengan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).`
}

SYARAT MUTLAK KONTEN ASESMEN:
1. KISI-KISI SOAL:
   - Harus memetakan tepat ${data.questionCount} butir soal dari nomor 1 hingga ${data.questionCount}.
   - Setiap baris kisi-kisi memuat indikator soal yang spesifik dan operasional, materi, level kognitif Taksonomi SOLO, bentuk instrumen, nomor butir, dan bobot/skor.
2. NASKAH SOAL (PESERTA DIDIK / TARUNA):
   - Siap dicetak untuk taruna/taruni.
   - SANGAT PENTING: JANGAN PERNAH menampilkan kunci jawaban atau tanda jawaban benar di naskah ini!
   - Jika bentuknya Pilihan Ganda (atau bagian pilihan ganda pada bentuk Campuran), SETIAP BUTIR WAJIB MEMILIKI TEPAT 5 OPSI: A, B, C, D, E. Tidak boleh hanya 4 opsi! Opsi harus rasional, pengecoh masuk akal dalam bidang ${data.department}.
   - STIMULUS GAMBAR / DIAGRAM: WAJIB sertakan gambar/diagram teknis pada butir-butir soal yang membutuhkan stimulus visual (misal: layar radar PPI & target kapal, baringan kompas mawar pedoman, konfigurasi lampu navigasi P2TL, potongan mesin diesel/katup/injektor kapal, kurva DO/pH 24 jam tambak udang, atau diagram alur rantai dingin/HACCP). Berikan objek 'image' yang memuat 'title', 'caption', 'description', dan kode 'svgDiagram' mandiri yang valid dan rapi.
   - Gunakan stimulus kontekstual yang nyata di lingkungan kemaritiman/perikanan SUPM Tegal (misal: kapal penangkap ikan, navigasi laut, cuaca perairan, instalasi mesin kamar mesin, tambak udang, higienitas pengolahan hasil tangkapan).
   - Jika Esai / Praktik / Observasi, sertakan skenario kasus, instruksi kerja, format penyajian jawaban, dan kriteria tugas.
3. KUNCI JAWABAN TERPISAH:
   - Berada di bagian terpisah.
   - Memuat nomor butir 1 sampai ${data.questionCount}, jawaban benar / opsi yang tepat (A/B/C/D/E) untuk pilihan ganda, atau pokok jawaban model untuk esai/praktik.
   - Hubungkan pembahasan dengan stimulus gambar jika soal memiliki gambar (misal: "Berdasarkan Gambar 1...").
   - Sertakan pembahasan ilmiah, teknis, dan konseptual mendalam.
4. RUBRIK DAN PEDOMAN PENSKORAN:
   - Disesuaikan dengan bentuk instrumen "${data.instrumentType}".
   - Sertakan aturan penskoran, kriteria pencapaian (misal skor 4, 3, 2, 1), rumus perhitungan nilai akhir (0-100), skor maksimum.
   - Sertakan panduan tindak lanjut (${data.assessmentType}) dan interpretasi kualitatif hasil.
5. PEMERIKSAAN MUTU:
   - Validasi bahwa total butir tepat ${data.questionCount}, opsi pilihan ganda konsisten A-E, keselarasan antara TP, kisi-kisi, naskah soal, kunci, dan rubrik.

FORMAT OUTPUT WAJIB:
Anda WAJIB merespons HANYA dalam format JSON valid (tanpa markdown tambahan di luar blok JSON) dengan skema berikut:
{
  "id": "supm-asesmen-${Date.now()}",
  "metadata": {
    "schoolName": "SUPM TEGAL",
    "teacherName": "${data.teacherName || 'Guru Mata Pelajaran'}",
    "subject": "${data.subject}",
    "level": "SMK",
    "grade": "${data.grade}",
    "department": "${data.department}",
    "departmentFullName": "${deptName}",
    "assessmentType": "${data.assessmentType}",
    "instrumentType": "${data.instrumentType}",
    "topic": "${data.topic}",
    "questionCount": ${data.questionCount},
    "generatedAt": "${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}"
  },
  "kisiKisi": [
    {
      "no": 1,
      "learningObjective": "...",
      "topic": "...",
      "indicator": "...",
      "cognitiveLevel": "...",
      "instrumentType": "...",
      "questionNumber": "1",
      "scoreWeight": "..."
    }
  ],
  "naskahSoal": {
    "studentInstructions": [
      "Petunjuk pengerjaan 1...",
      "Petunjuk pengerjaan 2..."
    ],
    "questions": [
      {
        "number": 1,
        "type": "...",
        "cognitiveLevel": "...",
        "stimulus": "...",
        "image": {
          "title": "Gambar 1: Tampilan Skematis / Diagram Instrumen",
          "caption": "Keterangan gambar penunjang soal",
          "description": "Deskripsi teknis gambar",
          "svgDiagram": "<svg viewBox='0 0 450 280' xmlns='http://www.w3.org/2000/svg'>...</svg>"
        },
        "questionText": "...",
        "options": [
          { "key": "A", "text": "..." },
          { "key": "B", "text": "..." },
          { "key": "C", "text": "..." },
          { "key": "D", "text": "..." },
          { "key": "E", "text": "..." }
        ],
        "instructions": "...",
        "allocatedScore": 10
      }
    ]
  },
  "kunciJawaban": [
    {
      "questionNumber": 1,
      "questionType": "...",
      "correctAnswer": "A / Uraian Jawaban Model",
      "explanation": "Penjelasan konseptual mendalam...",
      "expectedKeyPoints": ["Poin kunci 1", "Poin kunci 2"]
    }
  ],
  "rubrikDanPenskoran": {
    "scoringRuleSummary": "Ringkasan aturan penskoran...",
    "maxScore": 100,
    "scoreFormula": "Nilai Akhir = (Total Skor yang Diperoleh / Skor Maksimum) x 100",
    "aspects": [
      {
        "aspectName": "...",
        "weight": 50,
        "criteria": [
          { "levelName": "Sangat Baik (4)", "score": 4, "description": "..." },
          { "levelName": "Baik (3)", "score": 3, "description": "..." },
          { "levelName": "Cukup (2)", "score": 2, "description": "..." },
          { "levelName": "Perlu Bimbingan (1)", "score": 1, "description": "..." }
        ]
      }
    ],
    "followUpGuidance": "Panduan tindak lanjut spesifik...",
    "qualitativeInterpretation": "Interpretasi rentang nilai atau kategori kesiapan..."
  },
  "qualityCheck": {
    "totalQuestionsValid": true,
    "totalQuestionsCount": ${data.questionCount},
    "hasAllFiveOptions": true,
    "consistencyCheckStatus": "Sesuai",
    "alignmentSummary": "Seluruh butir asesmen selaras dengan Tujuan Pembelajaran dan konteks kemaritiman/perikanan SUPM Tegal.",
    "teacherVerificationNotes": [
      "Verifikasi kesesuaian alat/fasilitas praktik di laboratorium/kapal latih",
      "Periksa kembali kunci jawaban dan rubrik terhadap karakteristik kelas"
    ]
  }
}
`;
}

export function generateBackupPromptText(data: AssessmentFormData): string {
  const deptName = DEPARTMENT_NAMES[data.department] || data.department;
  const cognitiveLevelsStr = data.cognitiveLevels && data.cognitiveLevels.length > 0 
    ? data.cognitiveLevels.join(', ') 
    : 'Semua Tingkatan Taksonomi SOLO (Prastruktural s.d. Abstrak Diperluas)';

  return `================================================================================
PROMPT CADANGAN GENERATOR ASESMEN SUPM TEGAL
(Gunakan prompt ini secara manual di Gemini atau ChatGPT apabila layanan API sedang offline)
================================================================================

Petunjuk Guru:
Salin seluruh teks prompt di bawah garis pemisah ini, lalu tempelkan (paste) langsung ke https://gemini.google.com atau ChatGPT. AI akan menyusun perangkat asesmen lengkap untuk Anda.

---------------------------------- MULAI PROMPT ----------------------------------

Anda adalah pakar kurikulum pendidikan kejuruan kemaritiman dan perikanan Indonesia, yang bertugas merancang perangkat asesmen mendalam untuk SUPM TEGAL (Sekolah Usaha Perikanan Menengah Tegal).

Silakan buatkan perangkat asesmen pembelajaran lengkap berdasarkan data berikut:

IDENTITAS ASESMEN:
- Satuan Pendidikan : SUPM TEGAL
- Nama Guru         : ${data.teacherName || '[Isi Nama Guru]'}
- Mata Pelajaran    : ${data.subject || '[Isi Mata Pelajaran]'}
- Jenjang           : SMK
- Tingkat / Kelas   : Kelas ${data.grade}
- Jurusan           : ${deptName}
- Jenis Asesmen     : ${data.assessmentType} (Diagnostik / Formatif / Sumatif)
- Materi / Topik    : ${data.topic}
- Tujuan Pembelajaran: ${data.learningObjectives}
${data.learningCompetencies ? `- Capaian Pembelajaran / Indikator: ${data.learningCompetencies}` : ''}
- Bentuk Instrumen  : ${data.instrumentType}
- Jumlah Butir Soal : ${data.questionCount} butir
- Tingkat Kognitif  : Taksonomi SOLO (${cognitiveLevelsStr})
${data.additionalInstructions ? `- Instruksi Khusus  : ${data.additionalInstructions}` : ''}

INSTRUKSI KHUSUS & STRUKTUR OUTPUT:
Mohon buatkan dokumen asesmen pembelajaran yang terbagi menjadi 4 BAGIAN TERPISAH secara runtut dan profesional:

BAGIAN 1: KISI-KISI ASESMEN PEMBELAJARAN
Buat tabel kisi-kisi memuat:
- No
- Tujuan Pembelajaran / Indikator
- Materi Pokok
- Indikator Soal / Tugas
- Level Kognitif Taksonomi SOLO (Prastruktural, Unistruktural, Multistruktural, Relasional, Abstrak Diperluas)
- Bentuk Instrumen
- Nomor Butir Soal (1 sampai ${data.questionCount})
- Bobot Skor

BAGIAN 2: NASKAH SOAL (UNTUK PESERTA DIDIK)
- Naskah siap dicetak dan diberikan kepada taruna/taruni.
- PERHATIAN: JANGAN sertakan kunci jawaban atau tanda jawaban benar di bagian naskah ini.
- Untuk Pilihan Ganda: Setiap butir WAJIB memiliki tepat 5 opsi (A, B, C, D, E). Buat stimulus kontekstual yang relevan dengan bidang perikanan/kelautan SUPM Tegal.
- STIMULUS GAMBAR / DIAGRAM: Sertakan gambar, diagram teknis, kurva, atau skema instrumen (misal: layar radar, mawar pedoman kompas, lampu navigasi, komponen mesin diesel, kurva DO/pH tambak, alur sanitasi/HACCP) pada butir-butir soal yang relevan.
- Untuk Esai / Praktik / Observasi: Berikan instruksi kerja terstruktur, skenario kasus, dan format penugasan yang jelas.

BAGIAN 3: KUNCI JAWABAN TERPISAH
- Tempatkan di bagian terpisah.
- Tuliskan nomor soal, kunci jawaban definitif (opsi benar A/B/C/D/E untuk PG, atau kata kunci jawaban model untuk esai/praktik).
- Sertakan pembahasan ilmiah, teknis kemaritiman, dan konseptual mengapa jawaban tersebut benar.

BAGIAN 4: RUBRIK DAN PEDOMAN PENSKORAN
- Berikan pedoman penskoran sesuai bentuk instrumen ${data.instrumentType}.
- Sertakan kriteria kualitas (Skor 4/3/2/1 atau Sangat Mahir/Mahir/Cukup/Perlu Bimbingan).
- Tuliskan rumus perhitungan nilai akhir (skala 0 - 100).
- Berikan panduan tindak lanjut khusus untuk jenis asesmen ${data.assessmentType.toUpperCase()} (misal: rekomendasi diferensiasi / intervensi remedial untuk Diagnostik, atau umpan balik proses untuk Formatif, atau kriteria ketuntasan KKTP untuk Sumatif).
- Catatan verifikasi guru (pemeriksaan mutu instrumen).

Gunakan bahasa Indonesia baku, formal, dan akademis kejuruan kelautan & perikanan SUPM Tegal.

---------------------------------- SELESAI PROMPT ----------------------------------
`;
}
