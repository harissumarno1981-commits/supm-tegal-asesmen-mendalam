import React, { useState } from 'react';
import { X, Copy, Check, Download, Sparkles, AlertCircle } from 'lucide-react';
import { AssessmentFormData } from '../types/assessment';
import { generateBackupPromptText } from '../utils/promptGenerator';
import { downloadPromptTxt } from '../utils/downloadHelpers';

interface ManualPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: AssessmentFormData;
}

export const ManualPromptModal: React.FC<ManualPromptModalProps> = ({
  isOpen,
  onClose,
  formData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const promptText = generateBackupPromptText(formData);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const handleDownload = () => {
    downloadPromptTxt(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Mode Manual Cadangan (Prompt Asesmen Terstruktur)
              </h3>
              <p className="text-xs text-slate-300">
                Gunakan jika Gemini API sedang offline, rate-limited, atau untuk penggunaan manual mandiri
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

        {/* Info Banner */}
        <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Pemberitahuan:</strong> Mode manual ini menghasilkan instruksi prompt lengkap terstruktur berdasarkan formulir yang telah Anda isi. Salin atau unduh teks ini, lalu tempelkan langsung ke{' '}
            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline hover:text-amber-950"
            >
              Gemini Web
            </a>{' '}
            atau ChatGPT untuk memperoleh hasil asesmen secara manual.
          </span>
        </div>

        {/* Content Box */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="relative">
            <textarea
              readOnly
              value={promptText}
              rows={16}
              className="w-full font-mono text-xs p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:outline-none select-all leading-relaxed shadow-inner"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Karakter: {promptText.length.toLocaleString('id-ID')} | Kata: ~{promptText.split(/\s+/).length}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Salin Prompt Cadangan</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Prompt (.txt)</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
