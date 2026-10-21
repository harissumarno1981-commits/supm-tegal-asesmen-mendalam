import React from 'react';
import {
  Sparkles,
  BookOpen,
  User,
  GraduationCap,
  Layers,
  FileText,
  Compass,
  Anchor,
  HelpCircle,
  Copy,
  Download,
  AlertCircle,
  ChevronDown,
  Wand2,
} from 'lucide-react';
import {
  AssessmentFormData,
  DepartmentCode,
  GradeLevel,
  AssessmentType,
  InstrumentType,
  SoloTaxonomyLevel,
} from '../types/assessment';
import { DEPARTMENT_NAMES, SOLO_TAXONOMY_DESCRIPTIONS } from '../utils/promptGenerator';

interface AssessmentFormProps {
  formData: AssessmentFormData;
  onChange: (data: AssessmentFormData) => void;
  onSubmit: () => void;
  isLoading: boolean;
  loadingStep: string;
  onOpenManualPrompt: () => void;
  onOpenGuide: () => void;
}

const PRESETS = [
  {
    name: '🚢 NKPI: Navigasi Radar & P2TL',
    department: 'NKPI' as DepartmentCode,
    subject: 'Ilmu Navigasi Kapal Penangkap Ikan',
    grade: 'XI' as GradeLevel,
    type: 'Sumatif' as AssessmentType,
    instrument: 'Pilihan Ganda' as InstrumentType,
    count: 10,
    topic: 'Penggunaan Radar Maritim dan Penerapan Aturan Pencegahan Tubrukan di Laut (COLREGs/P2TL)',
    tp: 'Taruna mampu mengidentifikasi target pada layar radar maritim, menentukan aspek pergerakan kapal lain (CPA & TCPA), serta mengambil tindakan manuver olah gerak kapal sesuai aturan P2TL dalam kondisi jarak tampak terbatas.',
    levels: ['Unistruktural', 'Multistruktural', 'Relasional'] as SoloTaxonomyLevel[],
  },
  {
    name: '⚙️ TKPI: Perawatan Mesin Diesel Kapal',
    department: 'TKPI' as DepartmentCode,
    subject: 'Permesinan Kapal Penangkap Ikan',
    grade: 'XII' as GradeLevel,
    type: 'Formatif' as AssessmentType,
    instrument: 'Campuran' as InstrumentType,
    count: 10,
    topic: 'Prosedur Start-Up, Monitoring Suhu/Tekanan, dan Troubleshooting Mesin Induk Diesel Kapal',
    tp: 'Taruna mampu menjelaskan alur sistem bahan bakar dan pelumasan mesin diesel 4-tak, menganalisis gejala overheating atau kehilangan kompresi, serta merumuskan langkah penanganan gangguan di kamar mesin saat berlayar.',
    levels: ['Multistruktural', 'Relasional', 'Abstrak Diperluas'] as SoloTaxonomyLevel[],
  },
  {
    name: '🦐 APPL: Kualitas Air Tambak Vaname',
    department: 'APPL' as DepartmentCode,
    subject: 'Teknik Pembesaran Udang Air Payau',
    grade: 'XI' as GradeLevel,
    type: 'Diagnostik' as AssessmentType,
    instrument: 'Pilihan Ganda' as InstrumentType,
    count: 10,
    topic: 'Pengukuran dan Pengendalian Parameter Kualitas Air (DO, Salinitas, pH, Alkalinitas) Tambak Intensif Udang Vaname',
    tp: 'Mengidentifikasi pemahaman awal dan miskonsepsi taruna mengenai pengaruh fluktuasi Dissolved Oxygen (DO) dan pH terhadap tingkat stres udang vaname, serta tindakan aerasi darurat.',
    levels: ['Prastruktural', 'Unistruktural', 'Multistruktural', 'Relasional'] as SoloTaxonomyLevel[],
  },
  {
    name: '🐟 APHP: HACCP & Mutu Hasil Tangkap',
    department: 'APHP' as DepartmentCode,
    subject: 'Pengendalian Mutu & Higiene Hasil Perikanan',
    grade: 'X' as GradeLevel,
    type: 'Sumatif' as AssessmentType,
    instrument: 'Pilihan Ganda' as InstrumentType,
    count: 10,
    topic: 'Prinsip Rantai Dingin (Cold Chain), Sanitasi Standar SSOP, dan Titik Kendali Kritis (CCP) Pengolahan Tuna',
    tp: 'Taruna mampu menguraikan tahapan penurunan kesegaran ikan, menentukan batas kritis suhu rantai dingin untuk mencegah histamin, dan menerapkan prosedur SSOP pada lini penerimaan bahan baku perikanan.',
    levels: ['Unistruktural', 'Multistruktural', 'Relasional'] as SoloTaxonomyLevel[],
  },
];

const SOLO_LEVELS: SoloTaxonomyLevel[] = [
  'Prastruktural',
  'Unistruktural',
  'Multistruktural',
  'Relasional',
  'Abstrak Diperluas',
];

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
  loadingStep,
  onOpenManualPrompt,
  onOpenGuide,
}) => {
  const handleInputChange = (field: keyof AssessmentFormData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  const handleLevelToggle = (level: SoloTaxonomyLevel) => {
    const current = formData.cognitiveLevels || [];
    if (current.includes(level)) {
      if (current.length > 1) {
        handleInputChange(
          'cognitiveLevels',
          current.filter((l) => l !== level)
        );
      }
    } else {
      handleInputChange('cognitiveLevels', [...current, level]);
    }
  };

  const handleSelectAllLevels = () => {
    handleInputChange('cognitiveLevels', [...SOLO_LEVELS]);
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    onChange({
      ...formData,
      department: preset.department,
      subject: preset.subject,
      grade: preset.grade,
      assessmentType: preset.type,
      instrumentType: preset.instrument,
      questionCount: preset.count,
      topic: preset.topic,
      learningObjectives: preset.tp,
      cognitiveLevels: preset.levels,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Top Banner with Presets */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-4 sm:p-6 text-white border-b border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Anchor className="w-5 h-5 text-cyan-400" />
              Formulir Perangkat Asesmen Pembelajaran
            </h2>
            <p className="text-xs text-slate-300">
              Lengkapi parameter kurikulum di bawah untuk membuat perangkat asesmen otomatis via Gemini AI
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenGuide}
              className="text-xs text-amber-300 hover:text-amber-200 underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Panduan SOLO
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Preset Cepat Jurusan SUPM Tegal (Isi Otomatis):
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="text-left text-xs p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 hover:border-cyan-400/50 transition flex items-center justify-between group"
              >
                <span className="font-medium text-slate-200 group-hover:text-cyan-300 truncate">
                  {p.name}
                </span>
                <span className="text-[10px] text-cyan-300 shrink-0 ml-1 font-mono">Pilih</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="p-5 sm:p-7 space-y-7"
      >
        {/* GROUP 1: IDENTITAS GURU & SEKOLAH */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-100">
            <User className="w-4 h-4 text-blue-900" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
              1. Identitas Guru & Sekolah
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Nama Sekolah (Fixed) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Satuan Pendidikan <span className="text-slate-400 font-normal">(Otomatis/Tetap)</span>
              </label>
              <input
                type="text"
                readOnly
                value="SUPM TEGAL"
                className="w-full text-xs font-bold bg-slate-100 text-slate-700 px-3 py-2.5 rounded-lg border border-slate-200 cursor-not-allowed select-none shadow-inner"
              />
            </div>

            {/* Nama Guru */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Guru Pengampu <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Capt. Budi Santoso, M.Pd."
                value={formData.teacherName}
                onChange={(e) => handleInputChange('teacherName', e.target.value)}
                className="w-full text-xs text-slate-900 bg-white px-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition"
              />
            </div>

            {/* Mata Pelajaran */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mata Pelajaran <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Ilmu Navigasi Kapal Penangkap Ikan"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="w-full text-xs text-slate-900 bg-white px-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition"
              />
            </div>

            {/* Jenjang (Fixed) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenjang Pendidikan
              </label>
              <input
                type="text"
                readOnly
                value="SMK (Sekolah Menengah Kejuruan)"
                className="w-full text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-2.5 rounded-lg border border-slate-200 cursor-not-allowed select-none"
              />
            </div>

            {/* Tingkat / Kelas */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tingkat / Kelas <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value as GradeLevel)}
                  className="w-full appearance-none text-xs text-slate-900 bg-white px-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition pr-8"
                >
                  <option value="X">Kelas X (Tingkat I)</option>
                  <option value="XI">Kelas XI (Tingkat II)</option>
                  <option value="XII">Kelas XII (Tingkat III)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Jurusan / Program Keahlian */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jurusan / Program Keahlian <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value as DepartmentCode)}
                  className="w-full appearance-none text-xs text-slate-900 bg-white px-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition pr-8"
                >
                  <option value="NKPI">NKPI - Nautika Kapal Penangkap Ikan</option>
                  <option value="TKPI">TKPI - Teknika Kapal Penangkap Ikan</option>
                  <option value="APPL">APPL - Agribisnis Perikanan Air Payau & Laut</option>
                  <option value="APHP">APHP - Agribisnis Pengolahan Hasil Perikanan</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* GROUP 2: RANCANGAN ASESMEN */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-100">
            <Layers className="w-4 h-4 text-blue-900" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
              2. Rancangan Asesmen & Taksonomi SOLO
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Jenis Asesmen */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Asesmen <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-2">
                {[
                  {
                    type: 'Diagnostik' as AssessmentType,
                    label: 'Diagnostik',
                    sub: 'Pengetahuan awal, prasyarat, & deteksi miskonsepsi',
                    color: 'peer-checked:border-emerald-600 peer-checked:bg-emerald-50/50',
                  },
                  {
                    type: 'Formatif' as AssessmentType,
                    label: 'Formatif',
                    sub: 'Pantau proses belajar & umpan balik konstruktif segera',
                    color: 'peer-checked:border-blue-600 peer-checked:bg-blue-50/50',
                  },
                  {
                    type: 'Sumatif' as AssessmentType,
                    label: 'Sumatif',
                    sub: 'Ukur ketercapaian akhir TP & penskoran KKTP standar',
                    color: 'peer-checked:border-purple-600 peer-checked:bg-purple-50/50',
                  },
                ].map((item) => (
                  <label
                    key={item.type}
                    className="flex items-start p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition relative"
                  >
                    <input
                      type="radio"
                      name="assessmentType"
                      value={item.type}
                      checked={formData.assessmentType === item.type}
                      onChange={() => handleInputChange('assessmentType', item.type)}
                      className="mt-0.5 text-blue-900 focus:ring-blue-700"
                    />
                    <div className="ml-2.5 text-left">
                      <span className="block text-xs font-bold text-slate-900">{item.label}</span>
                      <span className="block text-[11px] text-slate-500 leading-snug">{item.sub}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Bentuk Instrumen */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bentuk Instrumen <span className="text-rose-500">*</span>
              </label>
              <div className="relative mb-3">
                <select
                  value={formData.instrumentType}
                  onChange={(e) => handleInputChange('instrumentType', e.target.value as InstrumentType)}
                  className="w-full appearance-none text-xs text-slate-900 bg-white px-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition pr-8"
                >
                  <option value="Pilihan Ganda">Pilihan Ganda (Wajib 5 Opsi: A, B, C, D, E)</option>
                  <option value="Esai/Uraian">Esai / Uraian Terstruktur</option>
                  <option value="Praktik/Unjuk Kerja">Praktik / Unjuk Kerja Vokasi</option>
                  <option value="Observasi">Observasi Sikap & Kinerja Lapangan</option>
                  <option value="Campuran">Campuran (Pilihan Ganda & Esai/Praktik)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>

              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                {formData.instrumentType === 'Pilihan Ganda' && (
                  <span>
                    <strong>Standar PG SUPM:</strong> Setiap butir wajib memiliki tepat 5 pilihan opsi (A, B, C, D, E) dengan distraktor/pengecoh kemaritiman yang masuk akal dan tidak ambigu.
                  </span>
                )}
                {formData.instrumentType === 'Esai/Uraian' && (
                  <span>
                    <strong>Standar Esai:</strong> Menyajikan skenario studi kasus teknis perikanan/kelautan, pertanyaan penelusuran, dan rubrik jawaban model yang komprehensif.
                  </span>
                )}
                {formData.instrumentType === 'Praktik/Unjuk Kerja' && (
                  <span>
                    <strong>Standar Praktik:</strong> Memuat lembar instruksi kerja, alat & bahan bengkel/kapal/tambak, SOP keselamatan K3, dan rubrik unjuk kerja.
                  </span>
                )}
                {formData.instrumentType === 'Observasi' && (
                  <span>
                    <strong>Standar Observasi:</strong> Memuat lembar amatan perilaku kerja, ketelitian navigasi, dan ketaatan standar higienitas.
                  </span>
                )}
                {formData.instrumentType === 'Campuran' && (
                  <span>
                    <strong>Standar Campuran:</strong> Mengombinasikan butir pilihan ganda 5 opsi dan tugas esai/praktik terpadu.
                  </span>
                )}
              </div>
            </div>

            {/* Jumlah Soal / Tugas */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Soal / Tugas <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 mb-3">
                {[5, 10, 15, 20, 25, 30, 40].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => handleInputChange('questionCount', count)}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      formData.questionCount === count
                        ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Pilihan saat ini: <strong>{formData.questionCount} butir</strong>. Seluruh butir akan terpetakan lengkap pada Kisi-Kisi, Naskah Soal, dan Kunci Jawaban.
              </p>
            </div>
          </div>

          {/* Target Tingkat Kognitif Taksonomi SOLO */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Tingkat Kognitif Target (Taksonomi SOLO) <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleSelectAllLevels}
                className="text-[11px] text-blue-700 hover:text-blue-900 underline font-medium"
              >
                Pilih Semua Tingkatan
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {SOLO_LEVELS.map((lvl) => {
                const isSelected = formData.cognitiveLevels?.includes(lvl);
                return (
                  <div
                    key={lvl}
                    onClick={() => handleLevelToggle(lvl)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{lvl}</span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-blue-600 focus:ring-0"
                        />
                      </div>
                      <p
                        className={`text-[10px] leading-tight line-clamp-2 ${
                          isSelected ? 'text-blue-100' : 'text-slate-500'
                        }`}
                      >
                        {SOLO_TAXONOMY_DESCRIPTIONS[lvl]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* GROUP 3: MATERI & TUJUAN PEMBELAJARAN */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-100">
            <FileText className="w-4 h-4 text-blue-900" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
              3. Materi & Tujuan Pembelajaran
            </h3>
          </div>

          <div className="space-y-4">
            {/* Materi / Topik */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Materi / Topik Pembelajaran <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="Tuliskan topik pembelajaran secara jelas. Contoh: Olah Gerak Kapal Penangkap Ikan saat Cuaca Buruk dan Menghadapi Gelombang Tinggi..."
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                className="w-full text-xs text-slate-900 bg-white p-3 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition"
              />
            </div>

            {/* Tujuan Pembelajaran */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tujuan Pembelajaran (TP) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Tuliskan tujuan pembelajaran yang ingin diukur. Contoh: Taruna mampu menerapkan prosedur olah gerak kapal untuk memotong gelombang (heaving to) serta menjelaskan risiko sinkronisasi periode olengan kapal..."
                value={formData.learningObjectives}
                onChange={(e) => handleInputChange('learningObjectives', e.target.value)}
                className="w-full text-xs text-slate-900 bg-white p-3 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition"
              />
            </div>

            {/* Capaian Pembelajaran / Indikator Tambahan (Opsional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Capaian Pembelajaran (CP) atau Indikator Tambahan <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Elemen Olah Gerak dan Pengendalian Kapal Penangkap Ikan (Fase F)..."
                value={formData.learningCompetencies || ''}
                onChange={(e) => handleInputChange('learningCompetencies', e.target.value)}
                className="w-full text-xs text-slate-900 bg-white p-3 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition"
              />
            </div>

            {/* Instruksi Tambahan (Opsional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instruksi Tambahan untuk AI <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Tekankan studi kasus perairan Laut Jawa dekat perairan Tegal dan simulasi kapal penangkap ikan 30 GT..."
                value={formData.additionalInstructions || ''}
                onChange={(e) => handleInputChange('additionalInstructions', e.target.value)}
                className="w-full text-xs text-slate-900 bg-white px-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* NOTIFICATION & SUBMIT BUTTON */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Materi dikirim ke Gemini AI secara aman untuk diproses di server SUPM Tegal.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Backup Prompt button */}
            <button
              type="button"
              onClick={onOpenManualPrompt}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition flex items-center justify-center gap-1.5 shadow-sm"
              title="Salin atau unduh teks prompt untuk digunakan manual"
            >
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              <span>Prompt Cadangan (.txt)</span>
            </button>

            {/* Main Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
                isLoading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-900 to-indigo-950 hover:from-blue-800 hover:to-indigo-900 hover:shadow-blue-900/30 active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{loadingStep || 'Menghubungi Gemini AI...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Generate Asesmen ({formData.questionCount} Butir)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
