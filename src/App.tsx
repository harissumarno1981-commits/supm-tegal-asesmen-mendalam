import React, { useState } from 'react';
import { Header } from './components/Header';
import { AssessmentForm } from './components/AssessmentForm';
import { AssessmentResults } from './components/AssessmentResults';
import { SoloTaxonomyGuideModal } from './components/SoloTaxonomyGuideModal';
import { ManualPromptModal } from './components/ManualPromptModal';
import { AssessmentFormData, AssessmentResult } from './types/assessment';
import { AlertCircle, RefreshCw, Sparkles, CheckCircle2, Anchor, ShieldCheck } from 'lucide-react';

const initialFormData: AssessmentFormData = {
  schoolName: 'SUPM TEGAL',
  teacherName: '',
  subject: 'Ilmu Navigasi Kapal Penangkap Ikan',
  level: 'SMK',
  grade: 'XI',
  department: 'NKPI',
  assessmentType: 'Sumatif',
  topic: 'Penggunaan Radar Maritim dan Penerapan Aturan Pencegahan Tubrukan di Laut (COLREGs/P2TL)',
  learningObjectives: 'Taruna mampu mengidentifikasi target pada layar radar maritim, menentukan aspek pergerakan kapal lain (CPA & TCPA), serta mengambil tindakan manuver olah gerak kapal sesuai aturan P2TL dalam kondisi jarak tampak terbatas.',
  learningCompetencies: 'Elemen Navigasi Elektronik dan Olah Gerak Kapal (Kurikulum Merdeka SMK Maritim Fase F)',
  instrumentType: 'Pilihan Ganda',
  questionCount: 10,
  cognitiveLevels: ['Unistruktural', 'Multistruktural', 'Relasional'],
  additionalInstructions: 'Sertakan stimulus kasus kapal nelayan di perairan Laut Jawa dekat Tegal',
};

export default function App() {
  const [formData, setFormData] = useState<AssessmentFormData>(initialFormData);
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isManualPromptOpen, setIsManualPromptOpen] = useState(false);

  const handleGenerate = async () => {
    // Form validation
    if (!formData.teacherName.trim()) {
      setErrorMessage('Harap isi Nama Guru Pengampu terlebih dahulu.');
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMessage('Harap isi Mata Pelajaran terlebih dahulu.');
      return;
    }
    if (!formData.topic.trim()) {
      setErrorMessage('Harap isi Materi/Topik Pembelajaran terlebih dahulu.');
      return;
    }
    if (!formData.learningObjectives.trim()) {
      setErrorMessage('Harap isi Tujuan Pembelajaran (TP) terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Realistic progress animation
    const steps = [
      'Menghubungi AI Gemini 3.8...',
      'Merancang Kisi-Kisi Asesmen Taksonomi SOLO...',
      'Menuliskan Naskah Soal Peserta Didik (5 Opsi A-E)...',
      'Merumuskan Kunci Jawaban & Pembahasan Ilmiah...',
      'Menyusun Rubrik Penskoran & Validasi Mutu...',
    ];
    let stepIdx = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setLoadingStep(steps[stepIdx]);
    }, 2800);

    try {
      const response = await fetch('/api/generate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghasilkan perangkat asesmen.');
      }

      if (data.data) {
        setAssessment(data.data);
        // Scroll to results smoothly
        setTimeout(() => {
          const resultsElem = document.getElementById('assessment-results-section');
          if (resultsElem) {
            resultsElem.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    } catch (err: any) {
      console.error('Error generating assessment:', err);
      // Retain previous assessment if any as requested!
      setErrorMessage(
        err?.message ||
          'Terjadi kesalahan saat memanggil API. Anda dapat menggunakan "Mode Manual Cadangan" untuk menjalankan prompt secara manual.'
      );
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-cyan-500 selection:text-white">
      {/* Header */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenManualPrompt={() => setIsManualPromptOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Intro Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Sistem Penjaminan Mutu Asesmen Vokasi Kemaritiman
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Generator Perangkat Asesmen SUPM TEGAL
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Susun perangkat asesmen pembelajaran lengkap (Diagnostik, Formatif, Sumatif) berbasis <strong>Taksonomi SOLO</strong> secara otomatis dengan kecerdasan buatan. Menghasilkan <strong>Kisi-Kisi Terpetakan</strong>, <strong>Naskah Soal Peserta Didik (5 Opsi A–E)</strong>, <strong>Kunci Jawaban Terpisah</strong>, serta <strong>Rubrik Penskoran & Tindak Lanjut</strong> siap unduh dalam format Word (.docx) dan PDF.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Validasi 5 Opsi Pilihan Ganda (A-E)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Kunci Jawaban Terpisah 100%
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Unduhan Word & PDF Resmi
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Mode Manual Cadangan (.txt)
              </span>
            </div>
          </div>
        </div>

        {/* Error Banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold uppercase tracking-wider text-rose-950">
                  Kendala Pembuatan Asesmen:
                </strong>
                <p className="text-xs text-rose-800 leading-relaxed mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setIsManualPromptOpen(true)}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-900 text-white hover:bg-rose-800 transition"
              >
                Buka Mode Manual Cadangan
              </button>
            </div>
          </div>
        )}

        {/* Form Section */}
        <section>
          <AssessmentForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleGenerate}
            isLoading={isLoading}
            loadingStep={loadingStep}
            onOpenManualPrompt={() => setIsManualPromptOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        </section>

        {/* Results Section */}
        {assessment && (
          <section id="assessment-results-section" className="scroll-mt-24 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-900" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Hasil Perangkat Asesmen SUPM TEGAL
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Periksa seluruh tab sebelum mengunduh
              </span>
            </div>

            <AssessmentResults
              assessment={assessment}
              formData={formData}
              onRegenerate={handleGenerate}
              onUpdateAssessment={setAssessment}
              isRegenerating={isLoading}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-slate-900 border-t border-slate-800 text-slate-400 py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/Logo_SUPM_Tegal_Transparan_8757f91b.png"
              alt="SUPM Tegal"
              className="h-9 w-auto object-contain opacity-80"
            />
            <div>
              <p className="font-bold text-slate-200">
                SEKOLAH USAHA PERIKANAN MENENGAH (SUPM) TEGAL
              </p>
              <p className="text-[11px] text-slate-400">
                Badan Penyuluhan dan Pengembangan Sumber Daya Manusia Kelautan dan Perikanan (BPPSDM KP)
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-500">
            <p>SUPM TEGAL ASESMEN MENDALAM • Standardized Vocational Assessment</p>
            <p>Kementerian Kelautan dan Perikanan Republik Indonesia</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SoloTaxonomyGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <ManualPromptModal
        isOpen={isManualPromptOpen}
        onClose={() => setIsManualPromptOpen(false)}
        formData={formData}
      />
    </div>
  );
}
