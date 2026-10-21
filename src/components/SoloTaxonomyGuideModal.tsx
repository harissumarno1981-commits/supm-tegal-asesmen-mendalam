import React from 'react';
import { X, CheckCircle2, Layers, BookOpen, Anchor, Compass } from 'lucide-react';

interface SoloTaxonomyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoloTaxonomyGuideModal: React.FC<SoloTaxonomyGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const soloLevels = [
    {
      level: '1. Prastruktural (Prestructural)',
      badge: 'Tingkat 1 - Kesiapan Awal',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      tagColor: 'bg-rose-100 text-rose-700',
      desc: 'Peserta didik belum memiliki pemahaman yang tepat tentang materi, menggunakan informasi yang tidak relevan, atau mengalami miskonsepsi dasar.',
      vokasiExample: 'Contoh Vokasi: Taruna belum dapat membedakan antara kompas magnet dan gyro compass, atau salah mengidentifikasi arah haluan kapal.',
      assessmentRole: 'Sangat cocok untuk Asesmen Diagnostik guna mendeteksi miskonsepsi awal sebelum memulai materi baru.',
    },
    {
      level: '2. Unistruktural (Unistructural)',
      badge: 'Tingkat 2 - Fakta Tunggal',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      tagColor: 'bg-amber-100 text-amber-700',
      desc: 'Peserta didik fokus pada satu aspek atau prosedur tunggal yang relevan secara faktual tanpa mengaitkannya dengan aspek lain.',
      vokasiExample: 'Contoh Vokasi: Menyebutkan satu fungsi radar maritim, atau membaca satu parameter tekanan oli pada mesin diesel kapal.',
      assessmentRole: 'Menguji penguasaan definisi, istilah teknis, nama komponen alat tangkap/mesin, atau standar keselamatan K3 dasar.',
    },
    {
      level: '3. Multistruktural (Multistructural)',
      badge: 'Tingkat 3 - Multi Aspek Terpisah',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      tagColor: 'bg-blue-100 text-blue-700',
      desc: 'Peserta didik memahami beberapa aspek teknis secara terpisah, dapat membuat daftar atau langkah kerja berurutan namun belum menghubungkan keterkaitannya secara menyeluruh.',
      vokasiExample: 'Contoh Vokasi: Menjelaskan 4 tahapan persiapan pengoperasian mesin pendingin kapal (refrigerasi), atau menyebutkan bagian-bagian jaring pukat cincin.',
      assessmentRole: 'Menguji kelengkapan pengetahuan prosedural, SOP keselamatan kerja, dan urutan pemeliharaan peralatan.',
    },
    {
      level: '4. Relasional (Relational)',
      badge: 'Tingkat 4 - Analisis & Integrasi',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      tagColor: 'bg-emerald-100 text-emerald-700',
      desc: 'Peserta didik mengintegrasikan beberapa aspek konsep menjadi satu kesatuan utuh, mampu menganalisis hubungan sebab-akibat, membandingkan, serta memecahkan masalah kontekstual di lapangan.',
      vokasiExample: 'Contoh Vokasi: Menganalisis pengaruh perubahan suhu dan salinitas air payau terhadap tingkat kelangsungan hidup (SR) benur udang vaname di tambak.',
      assessmentRole: 'Sangat penting untuk asesmen Formatif dan Sumatif SMK dalam menguji penalaran kejuruan dan pemecahan masalah teknis di atas kapal/industri.',
    },
    {
      level: '5. Abstrak Diperluas (Extended Abstract)',
      badge: 'Tingkat 5 - Generalisasi & Inovasi',
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      tagColor: 'bg-purple-100 text-purple-700',
      desc: 'Peserta didik mampu menggeneralisasikan struktur konsep ke ranah baru, menyusun hipotesis, mengevaluasi sistem secara kritis, atau merancang strategi/solusi inovatif.',
      vokasiExample: 'Contoh Vokasi: Merancang modifikasi alur rantai dingin (cold chain) pengolahan ikan cakalang untuk meminimalkan pembentukan histamin saat cuaca ekstrem di laut.',
      assessmentRole: 'Mendorong Higher Order Thinking Skills (HOTS), pengujian uji kompetensi keahlian tingkat lanjut, dan kepemimpinan nakhoda/kepala kamar mesin.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Panduan Taksonomi SOLO di SUPM TEGAL</h3>
              <p className="text-xs text-slate-300">
                Structure of the Observed Learning Outcome (Biggs & Collis) untuk Pendidikan Kejuruan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-sm">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex gap-3 items-start">
            <Compass className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <strong>Mengapa Taksonomi SOLO untuk SUPM?</strong> Taksonomi SOLO memungkinkan guru mengukur kualitas pemahaman taruna dari sekadar menghafal fakta tunggal hingga kemampuan mengintegrasikan sistem permesinan, olah gerak kapal, budidaya, atau penjaminan mutu mutu hasil perikanan dalam skenario riil dunia kerja kemaritiman.
            </div>
          </div>

          <div className="space-y-3">
            {soloLevels.map((item, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${item.color} transition-all`}>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-sm">{item.level}</h4>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.tagColor}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs mb-2 leading-relaxed opacity-90">{item.desc}</p>
                <div className="bg-white/80 p-2.5 rounded-lg border border-black/5 text-xs text-slate-800 font-medium mb-1.5">
                  {item.vokasiExample}
                </div>
                <div className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item.assessmentRole}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
