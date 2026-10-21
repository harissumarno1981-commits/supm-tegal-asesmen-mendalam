import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Table,
  HelpCircle,
  KeyRound,
  Award,
  Download,
  Copy,
  Check,
  Printer,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { AssessmentResult } from '../types/assessment';
import { ExportSectionType } from '../utils/docxBuilder';
import {
  downloadAssessmentDocx,
  downloadAssessmentPdf,
  downloadPromptTxt,
} from '../utils/downloadHelpers';
import { AssessmentFormData } from '../types/assessment';
import { QuestionImageDisplay } from '../utils/diagramRenderer';

interface AssessmentResultsProps {
  assessment: AssessmentResult;
  formData: AssessmentFormData;
  onRegenerate: () => void;
  onUpdateAssessment: (updated: AssessmentResult) => void;
  isRegenerating: boolean;
}

type TabType = 'kisi-kisi' | 'naskah-soal' | 'kunci-jawaban' | 'rubrik-penskoran';

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  assessment,
  formData,
  onRegenerate,
  onUpdateAssessment,
  isRegenerating,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('kisi-kisi');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const handleCopySection = async (tab: TabType) => {
    let contentToCopy = '';
    const meta = assessment.metadata;

    if (tab === 'kisi-kisi') {
      contentToCopy = `KISI-KISI ASESMEN - ${meta.schoolName}\nMapel: ${meta.subject} | Kelas: ${meta.grade} ${meta.department}\n\n` +
        assessment.kisiKisi
          .map(
            (k, i) =>
              `${i + 1}. [${k.cognitiveLevel}] ${k.indicator} | Bentuk: ${k.instrumentType} | No: ${k.questionNumber} | Bobot: ${k.scoreWeight}`
          )
          .join('\n');
    } else if (tab === 'naskah-soal') {
      contentToCopy = `NASKAH SOAL ASESMEN - ${meta.schoolName}\nMapel: ${meta.subject} | Jenis: ${meta.assessmentType}\n\n` +
        assessment.naskahSoal.questions
          .map((q, i) => {
            let s = `${i + 1}. ${q.stimulus ? q.stimulus + '\n' : ''}${q.questionText}\n`;
            if (q.options) {
              s += q.options.map((o) => `   ${o.key}. ${o.text}`).join('\n') + '\n';
            }
            if (q.instructions) {
              s += `   Instruksi: ${q.instructions}\n`;
            }
            return s;
          })
          .join('\n');
    } else if (tab === 'kunci-jawaban') {
      contentToCopy = `KUNCI JAWABAN & PEMBAHASAN - ${meta.schoolName}\n\n` +
        assessment.kunciJawaban
          .map(
            (k, i) =>
              `No ${k.questionNumber || i + 1}: Kunci = ${k.correctAnswer}\nPembahasan: ${k.explanation}\n`
          )
          .join('\n');
    } else if (tab === 'rubrik-penskoran') {
      contentToCopy = `RUBRIK & PEDOMAN PENSKORAN - ${meta.schoolName}\nAturan: ${assessment.rubrikDanPenskoran.scoringRuleSummary}\nRumus: ${assessment.rubrikDanPenskoran.scoreFormula}\nTindak Lanjut: ${assessment.rubrikDanPenskoran.followUpGuidance}\n`;
    }

    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (e) {
      console.error('Gagal menyalin:', e);
    }
  };

  const handleDownloadDocx = async (section: ExportSectionType) => {
    setIsExporting(`docx-${section}`);
    try {
      await downloadAssessmentDocx(assessment, section);
    } finally {
      setIsExporting(null);
      setDownloadMenuOpen(false);
    }
  };

  const handleDownloadPdf = async (section: ExportSectionType) => {
    setIsExporting(`pdf-${section}`);
    try {
      await downloadAssessmentPdf(assessment, section);
    } finally {
      setIsExporting(null);
      setDownloadMenuOpen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Solo badge color
  const getSoloBadgeClass = (level: string) => {
    if (level.includes('Prastruktural')) return 'bg-rose-100 text-rose-800 border-rose-300';
    if (level.includes('Unistruktural')) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (level.includes('Multistruktural')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (level.includes('Relasional')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (level.includes('Abstrak Diperluas')) return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-slate-100 text-slate-800 border-slate-300';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Top Header & Actions Bar */}
      <div className="p-4 sm:p-6 bg-slate-900 text-white border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-600/40 text-blue-300 border border-blue-500/30 uppercase">
              {assessment.metadata.assessmentType} ({assessment.metadata.instrumentType})
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {assessment.naskahSoal.questions.length} Butir Soal Terpetakan
            </span>
            <span className="text-[11px] text-slate-400">
              Diterbitkan: {assessment.metadata.generatedAt}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>{assessment.metadata.subject}</span>
            <span className="text-slate-400 font-normal text-sm">
              — Kelas {assessment.metadata.grade} ({assessment.metadata.department})
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Guru: <strong>{assessment.metadata.teacherName || '-'}</strong> | Satuan Pendidikan: <strong>SUPM TEGAL</strong>
          </p>
        </div>

        {/* Action Buttons & Download Menu */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
            title="Cetak tampilan dokumen"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak</span>
          </button>

          {/* Regenerate Button */}
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            title="Generate ulang perangkat asesmen"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Generate Ulang</span>
          </button>

          {/* Main Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Dokumen</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {downloadMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-40 text-slate-800">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Paket Lengkap Asesmen
                </div>
                <div className="px-2 py-1 flex gap-1">
                  <button
                    onClick={() => handleDownloadDocx('all')}
                    disabled={Boolean(isExporting)}
                    className="flex-1 text-left px-2.5 py-2 text-xs font-semibold rounded-lg hover:bg-blue-50 text-blue-900 transition flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-700" />
                    <span>Word (.docx)</span>
                  </button>
                  <button
                    onClick={() => handleDownloadPdf('all')}
                    disabled={Boolean(isExporting)}
                    className="flex-1 text-left px-2.5 py-2 text-xs font-semibold rounded-lg hover:bg-rose-50 text-rose-900 transition flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-rose-700" />
                    <span>PDF (.pdf)</span>
                  </button>
                </div>

                <div className="px-3 pt-2 pb-1 border-t border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Unduh Dokumen Terpisah
                </div>
                <div className="px-2 space-y-0.5">
                  <div className="flex items-center justify-between px-2 py-1 text-xs hover:bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">1. Kisi-Kisi Soal</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDownloadDocx('kisi-kisi')}
                        className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                      >
                        DOCX
                      </button>
                      <button
                        onClick={() => handleDownloadPdf('kisi-kisi')}
                        className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded hover:bg-rose-200"
                      >
                        PDF
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2 py-1 text-xs hover:bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">2. Naskah Peserta Didik</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDownloadDocx('soal')}
                        className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                      >
                        DOCX
                      </button>
                      <button
                        onClick={() => handleDownloadPdf('soal')}
                        className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded hover:bg-rose-200"
                      >
                        PDF
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2 py-1 text-xs hover:bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">3. Kunci Jawaban</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDownloadDocx('kunci')}
                        className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                      >
                        DOCX
                      </button>
                      <button
                        onClick={() => handleDownloadPdf('kunci')}
                        className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded hover:bg-rose-200"
                      >
                        PDF
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2 py-1 text-xs hover:bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">4. Rubrik & Penskoran</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDownloadDocx('rubrik')}
                        className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                      >
                        DOCX
                      </button>
                      <button
                        onClick={() => handleDownloadPdf('rubrik')}
                        className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded hover:bg-rose-200"
                      >
                        PDF
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-3 pt-2 pb-1 border-t border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Cadangan Teks
                </div>
                <div className="px-2 pb-1">
                  <button
                    onClick={() => {
                      downloadPromptTxt(formData);
                      setDownloadMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 text-slate-700 transition flex items-center justify-between"
                  >
                    <span>Unduh Prompt Master (.txt)</span>
                    <span className="text-[10px] font-mono text-slate-400">TXT</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quality Check Bar */}
      <div className="bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-700">Pemeriksaan Mutu AI:</span>
          <span className="text-slate-600">
            {assessment.qualityCheck.alignmentSummary || 'Instrumen selaras dengan TP dan standar SUPM Tegal.'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {assessment.naskahSoal.questions.length} Butir Terpetakan
          </span>
          <span className="text-[11px] font-medium text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
            Kunci Terpisah: 100%
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 bg-slate-100/70 px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-2 pt-2">
        {[
          { id: 'kisi-kisi' as TabType, label: 'A. Kisi-Kisi Soal', icon: Table, count: assessment.kisiKisi.length },
          { id: 'naskah-soal' as TabType, label: 'B. Naskah Soal Peserta Didik', icon: FileText, count: assessment.naskahSoal.questions.length },
          { id: 'kunci-jawaban' as TabType, label: 'C. Kunci Jawaban Terpisah', icon: KeyRound, count: assessment.kunciJawaban.length },
          { id: 'rubrik-penskoran' as TabType, label: 'D. Rubrik & Penskoran', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition flex items-center gap-2 shrink-0 border-t border-l border-r ${
                isActive
                  ? 'bg-white text-blue-950 border-slate-200 shadow-sm relative top-[1px]'
                  : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-900' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-blue-100 text-blue-900' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="p-4 sm:p-7">
        {/* Copy button for current tab */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => handleCopySection(activeTab)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            {copiedTab === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Salin Teks Tab Ini</span>
              </>
            )}
          </button>
        </div>

        {/* TAB 1: KISI-KISI */}
        {activeTab === 'kisi-kisi' && (
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="p-3 w-10 text-center">No</th>
                      <th className="p-3">Tujuan Pembelajaran</th>
                      <th className="p-3">Materi Pokok</th>
                      <th className="p-3">Indikator Soal / Tugas</th>
                      <th className="p-3">Level SOLO</th>
                      <th className="p-3">Bentuk</th>
                      <th className="p-3 text-center">No Soal</th>
                      <th className="p-3 text-center">Bobot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {assessment.kisiKisi.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="p-3 text-center font-bold text-slate-600">{item.no || idx + 1}</td>
                        <td className="p-3 text-slate-800 max-w-xs">{item.learningObjective}</td>
                        <td className="p-3 text-slate-700 font-medium">{item.topic}</td>
                        <td className="p-3 text-slate-700">{item.indicator}</td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getSoloBadgeClass(
                              String(item.cognitiveLevel || '')
                            )}`}
                          >
                            {item.cognitiveLevel}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">{item.instrumentType}</td>
                        <td className="p-3 text-center font-bold text-blue-900">{item.questionNumber || idx + 1}</td>
                        <td className="p-3 text-center font-semibold text-slate-700">{item.scoreWeight || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NASKAH SOAL (LEMBAR PESERTA DIDIK) */}
        {activeTab === 'naskah-soal' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Student Notice Banner */}
            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Lembar Naskah Soal Peserta Didik (Siap Cetak)
                </h4>
                <p className="text-xs text-blue-900 mt-0.5">
                  Bagian ini murni memuat naskah soal taruna/taruni SUPM Tegal. <strong>Tidak ada kunci jawaban yang ditampilkan pada bagian ini</strong> untuk menjaga kerahasiaan dan integritas ujian.
                </p>
              </div>
            </div>

            {/* Student Instructions */}
            {assessment.naskahSoal.studentInstructions && assessment.naskahSoal.studentInstructions.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <h5 className="font-bold text-slate-800 mb-2">Petunjuk Pengerjaan:</h5>
                <ol className="list-decimal list-inside space-y-1 text-slate-700">
                  {assessment.naskahSoal.studentInstructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-6 divide-y divide-slate-100">
              {assessment.naskahSoal.questions.map((q, idx) => (
                <div key={idx} className="pt-5 first:pt-0">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 space-y-2">
                      {/* Stimulus if any */}
                      {q.stimulus && (
                        <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-900 text-xs text-slate-800 italic leading-relaxed">
                          {q.stimulus}
                        </div>
                      )}

                      {/* Question text */}
                      <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                        {q.questionText}
                      </p>

                      {/* Image / Diagram Stimulus */}
                      <QuestionImageDisplay
                        image={q.image}
                        questionNumber={idx + 1}
                        questionText={q.questionText}
                        topic={assessment.metadata.topic}
                        department={assessment.metadata.department}
                      />

                      {/* SOLO Level tag */}
                      {q.cognitiveLevel && (
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getSoloBadgeClass(
                            q.cognitiveLevel
                          )}`}
                        >
                          SOLO: {q.cognitiveLevel}
                        </span>
                      )}

                      {/* Options A-E for multiple choice */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 pt-2">
                          {q.options.map((opt) => (
                            <div
                              key={opt.key}
                              className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition"
                            >
                              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-300">
                                {opt.key}
                              </span>
                              <span className="text-xs text-slate-800 leading-normal">{opt.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Instructions for essay / practice */}
                      {q.instructions && (
                        <div className="mt-2 p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900">
                          <strong className="block text-[11px] uppercase tracking-wider mb-0.5">
                            Instruksi Khusus Tugas / Unjuk Kerja:
                          </strong>
                          {q.instructions}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: KUNCI JAWABAN TERPISAH */}
        {activeTab === 'kunci-jawaban' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 flex items-start gap-3">
              <KeyRound className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Kunci Jawaban & Pembahasan Ilmiah (Dokumen Guru / Asesor)
                </h4>
                <p className="text-xs text-amber-900 mt-0.5">
                  Bagian ini terpisah secara khusus dari naskah taruna. Gunakan sebagai pedoman koreksi, penentuan skor, dan umpan balik reflektif pembelajaran.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {assessment.kunciJawaban.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2 hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">
                      Nomor Butir: <span className="text-blue-900 text-sm font-extrabold">{item.questionNumber || idx + 1}</span>
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-900 text-white shadow-sm">
                      Kunci: {item.correctAnswer}
                    </span>
                  </div>

                  {item.explanation && (
                    <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                      <strong className="block text-slate-900 mb-1">Pembahasan & Landasan Konsep:</strong>
                      <p className="leading-relaxed">{item.explanation}</p>
                    </div>
                  )}

                  {item.expectedKeyPoints && item.expectedKeyPoints.length > 0 && (
                    <div className="text-xs text-slate-700 pt-1">
                      <strong className="block text-slate-800 mb-1">Unsur / Indikator Jawaban yang Diharapkan:</strong>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                        {item.expectedKeyPoints.map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RUBRIK & PENSKORAN */}
        {activeTab === 'rubrik-penskoran' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs">
                <span className="block font-bold text-blue-950 uppercase tracking-wider mb-1">
                  Aturan & Ringkasan Penskoran:
                </span>
                <p className="text-blue-900 leading-relaxed">
                  {assessment.rubrikDanPenskoran.scoringRuleSummary}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs flex flex-col justify-between">
                <div>
                  <span className="block font-bold text-indigo-950 uppercase tracking-wider mb-1">
                    Rumus Perhitungan Nilai:
                  </span>
                  <code className="block font-mono text-xs font-bold text-indigo-900 bg-white/70 p-2 rounded border border-indigo-200 mt-1">
                    {assessment.rubrikDanPenskoran.scoreFormula}
                  </code>
                </div>
                <div className="mt-2 text-[11px] text-indigo-800">
                  Skor Maksimum Instrumen: <strong>{assessment.rubrikDanPenskoran.maxScore} Poin</strong>
                </div>
              </div>
            </div>

            {/* Rubric Aspects */}
            {assessment.rubrikDanPenskoran.aspects && assessment.rubrikDanPenskoran.aspects.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-900" />
                  Kriteria Penilaian Kinerja & Rubrik Berjenjang
                </h4>

                {assessment.rubrikDanPenskoran.aspects.map((asp, aIdx) => (
                  <div key={aIdx} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold">
                      <span>Aspek: {asp.aspectName}</span>
                      <span className="text-cyan-400 font-mono">Bobot: {asp.weight}%</span>
                    </div>

                    <div className="divide-y divide-slate-200">
                      {asp.criteria.map((c, cIdx) => (
                        <div key={cIdx} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50">
                          <div className="sm:w-44 shrink-0">
                            <span className="font-bold text-slate-900 block">{c.levelName}</span>
                            <span className="text-[11px] text-blue-700 font-mono">Skor: {c.score}</span>
                          </div>
                          <div className="text-slate-700 leading-relaxed flex-1">
                            {c.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Follow-up & Qualitative interpretation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessment.rubrikDanPenskoran.followUpGuidance && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                    Panduan Tindak Lanjut ({assessment.metadata.assessmentType}):
                  </h5>
                  <p className="text-slate-700 leading-relaxed">
                    {assessment.rubrikDanPenskoran.followUpGuidance}
                  </p>
                </div>
              )}

              {assessment.rubrikDanPenskoran.qualitativeInterpretation && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                    Interpretasi Hasil & Kesiapan:
                  </h5>
                  <p className="text-slate-700 leading-relaxed">
                    {assessment.rubrikDanPenskoran.qualitativeInterpretation}
                  </p>
                </div>
              )}
            </div>

            {/* Teacher Verification Notes */}
            {assessment.qualityCheck.teacherVerificationNotes && assessment.qualityCheck.teacherVerificationNotes.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-xs space-y-2">
                <h5 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Catatan Verifikasi Guru Sebelum Ujian:
                </h5>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {assessment.qualityCheck.teacherVerificationNotes.map((note, nIdx) => (
                    <li key={nIdx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
