import React from 'react';
import { Anchor, HelpCircle, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onOpenManualPrompt: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide, onOpenManualPrompt }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white shadow-xl sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Identity */}
          <div className="flex items-center space-x-4">
            <div className="relative group flex items-center justify-center p-1 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 shadow-md">
              <img
                src="/assets/aistudio/Logo_SUPM_Tegal_Transparan_8757f91b.png"
                alt="Logo SUPM Tegal"
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <Anchor className="w-3 h-3 text-cyan-400" />
                  Kementerian Kelautan & Perikanan
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  SMK Maritim Vokasi
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 mt-0.5">
                SUPM TEGAL <span className="text-cyan-400 font-extrabold">ASESMEN MENDALAM</span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Generator Perangkat Asesmen Pembelajaran SMK Berbasis Taksonomi SOLO & Kejuruan Maritim
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
              title="Pelajari Panduan Taksonomi SOLO & Standar Asesmen"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Panduan Taksonomi SOLO</span>
            </button>

            <button
              onClick={onOpenManualPrompt}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 transition-all shadow-sm"
              title="Buka Prompt Cadangan untuk dijalankan manual di Gemini atau ChatGPT"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">Mode Manual Cadangan</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
