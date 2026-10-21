import React, { useState } from 'react';
import { QuestionImage, DepartmentCode } from '../types/assessment';
import { Image as ImageIcon, ZoomIn, ZoomOut, Compass, Radio, Gauge, Waves, Fish, ShieldAlert, Cpu } from 'lucide-react';

// Generates specialized vocational SVG diagrams for maritime & fishery topics
export function generateVocationalDiagramSvg(
  topic: string,
  questionText: string,
  department?: DepartmentCode | string
): string {
  const textLower = (topic + ' ' + questionText).toLowerCase();

  // 1. RADAR / PPI DISPLAY (NKPI)
  if (textLower.includes('radar') || textLower.includes('cpa') || textLower.includes('tcpa') || textLower.includes('p2tl') || textLower.includes('tubrukan') || textLower.includes('baringan')) {
    return `
      <svg viewBox="0 0 450 320" xmlns="http://www.w3.org/2000/svg" style="background:#091422; border-radius:12px; font-family:monospace;">
        <!-- Radar Scope Outer Ring -->
        <circle cx="200" cy="160" r="130" fill="#04111d" stroke="#00e5ff" stroke-width="2.5" />
        <circle cx="200" cy="160" r="95" fill="none" stroke="#00e5ff" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
        <circle cx="200" cy="160" r="60" fill="none" stroke="#00e5ff" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
        <circle cx="200" cy="160" r="25" fill="none" stroke="#00e5ff" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
        
        <!-- Crosshairs & Degree Marks -->
        <line x1="200" y1="20" x2="200" y2="300" stroke="#00e5ff" stroke-width="1" opacity="0.4"/>
        <line x1="60" y1="160" x2="340" y2="160" stroke="#00e5ff" stroke-width="1" opacity="0.4"/>
        
        <!-- Degree labels -->
        <text x="200" y="24" fill="#00e5ff" font-size="10" text-anchor="middle" font-weight="bold">000° (U)</text>
        <text x="340" y="164" fill="#00e5ff" font-size="10" text-anchor="start">090° (T)</text>
        <text x="200" y="306" fill="#00e5ff" font-size="10" text-anchor="middle">180° (S)</text>
        <text x="56" y="164" fill="#00e5ff" font-size="10" text-anchor="end">270° (B)</text>
        
        <!-- Own Ship (Center) -->
        <circle cx="200" cy="160" r="4" fill="#ffeb3b" />
        <!-- Heading vector 000° -->
        <line x1="200" y1="160" x2="200" y2="70" stroke="#ffeb3b" stroke-width="2" stroke-dasharray="4,2"/>
        <polygon points="200,65 196,73 204,73" fill="#ffeb3b"/>
        <text x="208" y="105" fill="#ffeb3b" font-size="9">Haluan Kapal Sendiri (000°)</text>
        
        <!-- Target Ship A (Crossing from starboard) -->
        <circle cx="250" cy="100" r="6" fill="#ff5252" />
        <!-- Target vector -->
        <line x1="250" y1="100" x2="190" y2="150" stroke="#ff5252" stroke-width="2" stroke-dasharray="3,2"/>
        <polygon points="190,150 196,143 200,149" fill="#ff5252"/>
        <text x="260" y="98" fill="#ff5252" font-size="10" font-weight="bold">Target "A"</text>
        <text x="260" y="112" fill="#ff8a80" font-size="8">Baringan: 045° | Jarak: 4.8 NM</text>
        
        <!-- Target Ship B (Overtaking or Astern) -->
        <circle cx="160" cy="235" r="5" fill="#69f0ae" />
        <line x1="160" y1="235" x2="168" y2="195" stroke="#69f0ae" stroke-width="1.5"/>
        <text x="95" y="240" fill="#69f0ae" font-size="9">Target "B" (1.9 NM)</text>

        <!-- Right Side Data Info Panel -->
        <rect x="345" y="30" width="95" height="150" fill="#0c1e33" rx="6" stroke="#00e5ff" stroke-width="1"/>
        <text x="352" y="48" fill="#00e5ff" font-size="9" font-weight="bold">RADAR ARPA</text>
        <text x="352" y="66" fill="#b0bec5" font-size="8">RANGE: 6 NM</text>
        <text x="352" y="80" fill="#b0bec5" font-size="8">RINGS: 1.5 NM</text>
        <text x="352" y="94" fill="#ffeb3b" font-size="8">SPEED: 10.2 Kts</text>
        <text x="352" y="108" fill="#ff5252" font-size="8">CPA: 0.3 NM</text>
        <text x="352" y="122" fill="#ff5252" font-size="8">TCPA: 8.5 Menit</text>
        <text x="352" y="138" fill="#69f0ae" font-size="8">MODE: North-Up</text>
        <text x="352" y="156" fill="#ff8a80" font-size="8">RISK: BERSILANGAN</text>
        
        <text x="200" y="315" fill="#78909c" font-size="8" text-anchor="middle">Layar Radar Navigasi Maritim - SUPM TEGAL</text>
      </svg>
    `;
  }

  // 2. DIESEL ENGINE / PERMESINAN (TKPI)
  if (textLower.includes('mesin') || textLower.includes('diesel') || textLower.includes('torak') || textLower.includes('piston') || textLower.includes('silinder') || textLower.includes('injektor') || textLower.includes('refrigerasi') || textLower.includes('kompresor')) {
    return `
      <svg viewBox="0 0 450 320" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; font-family:sans-serif;">
        <!-- Header -->
        <rect x="15" y="12" width="420" height="25" fill="#1e293b" rx="4"/>
        <text x="225" y="29" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">DIAGRAM SKEMATIK SILINDER MESIN DIESEL 4-TAK KAPAL</text>
        
        <!-- Cylinder Block -->
        <rect x="140" y="60" width="170" height="210" fill="#1e293b" stroke="#64748b" stroke-width="3" rx="6"/>
        <rect x="155" y="70" width="140" height="170" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        
        <!-- Valves -->
        <!-- Intake Valve (Left) -->
        <line x1="175" y1="50" x2="185" y2="78" stroke="#38bdf8" stroke-width="4"/>
        <polygon points="180,78 190,78 185,84" fill="#38bdf8"/>
        <text x="110" y="55" fill="#38bdf8" font-size="9" font-weight="bold">Katup Isap (Udara)</text>
        <path d="M140,55 Q160,55 178,70" stroke="#38bdf8" stroke-width="2" fill="none" stroke-dasharray="3,2"/>
        
        <!-- Fuel Injector (Center) -->
        <rect x="218" y="42" width="14" height="34" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" rx="2"/>
        <polygon points="225,76 220,84 230,84" fill="#ef4444"/>
        <text x="225" y="38" fill="#f59e0b" font-size="9" font-weight="bold" text-anchor="middle">Injektor Bahan Bakar</text>
        
        <!-- Exhaust Valve (Right) -->
        <line x1="275" y1="50" x2="265" y2="78" stroke="#f87171" stroke-width="4"/>
        <polygon points="260,78 270,78 265,84" fill="#f87171"/>
        <text x="325" y="55" fill="#f87171" font-size="9" font-weight="bold">Katup Buang</text>
        <path d="M268,70 Q290,55 310,55" stroke="#f87171" stroke-width="2" fill="none" stroke-dasharray="3,2"/>
        
        <!-- Piston -->
        <rect x="160" y="115" width="130" height="60" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2" rx="4"/>
        <!-- Piston Rings -->
        <line x1="160" y1="125" x2="290" y2="125" stroke="#334155" stroke-width="2"/>
        <line x1="160" y1="133" x2="290" y2="133" stroke="#334155" stroke-width="2"/>
        <line x1="160" y1="141" x2="290" y2="141" stroke="#334155" stroke-width="2"/>
        <text x="225" y="152" fill="#0f172a" font-size="10" font-weight="bold" text-anchor="middle">TORAK / PISTON</text>
        
        <!-- Connecting Rod (Batang Piston) -->
        <line x1="225" y1="160" x2="225" y2="235" stroke="#cbd5e1" stroke-width="12" stroke-linecap="round"/>
        <circle cx="225" cy="160" r="6" fill="#475569"/>
        <circle cx="225" cy="235" r="9" fill="#475569"/>
        <text x="270" y="205" fill="#94a3b8" font-size="9">Batang Penghubung</text>
        
        <!-- Crankshaft (Poros Engkol) -->
        <circle cx="225" cy="265" r="24" fill="none" stroke="#64748b" stroke-width="3" stroke-dasharray="4,3"/>
        <circle cx="225" cy="265" r="5" fill="#f59e0b"/>
        <path d="M210,250 A20,20 0 0,1 245,265" fill="none" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="225" y="302" fill="#cbd5e1" font-size="9" text-anchor="middle">Poros Engkol (Crankshaft)</text>
        
        <!-- Chamber Label -->
        <text x="75" y="105" fill="#e2e8f0" font-size="9">Ruang Bakar</text>
        <line x1="110" y1="102" x2="160" y2="95" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2"/>
        
        <text x="70" y="145" fill="#e2e8f0" font-size="9">Cincin Torak (Ring)</text>
        <line x1="125" y1="140" x2="158" y2="133" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2,2"/>
      </svg>
    `;
  }

  // 3. WATER QUALITY / AQUACULTURE (APPL)
  if (textLower.includes('air') || textLower.includes('udang') || textLower.includes('tambak') || textLower.includes('oksigen') || textLower.includes('do') || textLower.includes('ph') || textLower.includes('salinitas') || textLower.includes('amoniak') || textLower.includes('benur')) {
    return `
      <svg viewBox="0 0 450 320" xmlns="http://www.w3.org/2000/svg" style="background:#0c1a24; border-radius:12px; font-family:sans-serif;">
        <!-- Title -->
        <rect x="20" y="12" width="410" height="26" fill="#132e3d" rx="6"/>
        <text x="225" y="29" fill="#2dd4bf" font-size="11" font-weight="bold" text-anchor="middle">KURVA FLUKTUASI OKSIGEN TERLARUT (DO) & pH TAMBAK UDANG (24 JAM)</text>
        
        <!-- Graph Box -->
        <rect x="55" y="55" width="365" height="190" fill="#08141c" stroke="#1e3a4b" stroke-width="1.5"/>
        
        <!-- Grid lines & Horizontals -->
        <line x1="55" y1="95" x2="420" y2="95" stroke="#163344" stroke-width="1" stroke-dasharray="2,2"/>
        <line x1="55" y1="135" x2="420" y2="135" stroke="#163344" stroke-width="1" stroke-dasharray="2,2"/>
        <line x1="55" y1="175" x2="420" y2="175" stroke="#163344" stroke-width="1" stroke-dasharray="2,2"/>
        <line x1="55" y1="215" x2="420" y2="215" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2"/>
        <text x="360" y="211" fill="#ef4444" font-size="8" font-weight="bold">Batas Kritis DO (3.0 ppm)</text>
        
        <!-- Y-Axis Labels (DO) -->
        <text x="48" y="65" fill="#38bdf8" font-size="9" text-anchor="end" font-weight="bold">DO (ppm)</text>
        <text x="48" y="98" fill="#94a3b8" font-size="8" text-anchor="end">8.0</text>
        <text x="48" y="138" fill="#94a3b8" font-size="8" text-anchor="end">6.0</text>
        <text x="48" y="178" fill="#94a3b8" font-size="8" text-anchor="end">4.0</text>
        <text x="48" y="218" fill="#ef4444" font-size="8" text-anchor="end">3.0</text>
        
        <!-- X-Axis Labels (Hours) -->
        <text x="55" y="260" fill="#94a3b8" font-size="8" text-anchor="middle">00:00</text>
        <text x="115" y="260" fill="#f87171" font-size="8" text-anchor="middle">04:00 (Kritis)</text>
        <text x="175" y="260" fill="#94a3b8" font-size="8" text-anchor="middle">08:00</text>
        <text x="240" y="260" fill="#fbbf24" font-size="8" text-anchor="middle">12:00 (Maks)</text>
        <text x="305" y="260" fill="#94a3b8" font-size="8" text-anchor="middle">16:00</text>
        <text x="370" y="260" fill="#94a3b8" font-size="8" text-anchor="middle">20:00</text>
        <text x="415" y="260" fill="#94a3b8" font-size="8" text-anchor="middle">24:00</text>
        
        <!-- DO Curve (Blue) -->
        <path d="M55,205 C90,225 115,228 145,195 C185,150 220,75 250,75 C280,75 320,110 360,165 C390,200 410,210 420,212" 
              fill="none" stroke="#38bdf8" stroke-width="3"/>
              
        <!-- pH Curve (Teal dashed) -->
        <path d="M55,160 C115,175 185,150 250,110 C310,120 370,150 420,165" 
              fill="none" stroke="#2dd4bf" stroke-width="2" stroke-dasharray="4,3"/>
              
        <!-- Aerator Action Marker -->
        <rect x="95" y="210" width="40" height="20" fill="#ef4444" opacity="0.3" rx="4"/>
        <text x="115" y="195" fill="#ef4444" font-size="8" font-weight="bold" text-anchor="middle">Titik Kritis Aerasi</text>
        <line x1="115" y1="198" x2="115" y2="225" stroke="#ef4444" stroke-width="1"/>

        <!-- Legend Footer -->
        <rect x="55" y="275" width="365" height="35" fill="#132e3d" rx="6"/>
        <line x1="70" y1="292" x2="95" y2="292" stroke="#38bdf8" stroke-width="3"/>
        <text x="102" y="295" fill="#e2e8f0" font-size="9">Oksigen Terlarut (DO)</text>
        
        <line x1="210" y1="292" x2="235" y2="292" stroke="#2dd4bf" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="242" y="295" fill="#e2e8f0" font-size="9">pH Air Tambak</text>
        
        <circle cx="340" cy="292" r="4" fill="#ef4444"/>
        <text x="350" y="295" fill="#fca5a5" font-size="8">Fase Respirasi Malam</text>
      </svg>
    `;
  }

  // 4. HACCP / MUTU & OLAHAN HASIL TANGKAPAN (APHP)
  if (textLower.includes('haccp') || textLower.includes('ikan') || textLower.includes('mutu') || textLower.includes('rantai dingin') || textLower.includes('cold chain') || textLower.includes('suhu') || textLower.includes('surimi') || textLower.includes('higien')) {
    return `
      <svg viewBox="0 0 450 320" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; font-family:sans-serif;">
        <!-- Header -->
        <rect x="20" y="12" width="410" height="26" fill="#1e293b" rx="6"/>
        <text x="225" y="29" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">ALUR PROSES RANTAI DINGIN (COLD CHAIN) & TITIK KENDALI KRITIS (CCP)</text>
        
        <!-- Flow Steps Boxes -->
        <!-- Step 1: Penerimaan -->
        <rect x="25" y="65" width="90" height="70" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="6"/>
        <text x="70" y="85" fill="#38bdf8" font-size="9" font-weight="bold" text-anchor="middle">1. Penerimaan</text>
        <text x="70" y="100" fill="#94a3b8" font-size="8" text-anchor="middle">Bahan Baku Tuna</text>
        <rect x="35" y="112" width="70" height="16" fill="#ef4444" rx="3"/>
        <text x="70" y="124" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">CCP 1: T ≤ 4.4°C</text>
        
        <!-- Arrow 1 -->
        <line x1="115" y1="100" x2="135" y2="100" stroke="#64748b" stroke-width="2"/>
        <polygon points="135,100 128,96 128,104" fill="#64748b"/>
        
        <!-- Step 2: Penyiangan / Deheading -->
        <rect x="135" y="65" width="90" height="70" fill="#1e293b" stroke="#64748b" stroke-width="1.5" rx="6"/>
        <text x="180" y="85" fill="#e2e8f0" font-size="9" font-weight="bold" text-anchor="middle">2. Penyiangan</text>
        <text x="180" y="100" fill="#94a3b8" font-size="8" text-anchor="middle">Pembuangan Insang</text>
        <text x="180" y="115" fill="#94a3b8" font-size="8" text-anchor="middle">& Isi Perut</text>
        <text x="180" y="127" fill="#38bdf8" font-size="7">Air Es (0-2°C)</text>
        
        <!-- Arrow 2 -->
        <line x1="225" y1="100" x2="245" y2="100" stroke="#64748b" stroke-width="2"/>
        <polygon points="245,100 238,96 238,104" fill="#64748b"/>
        
        <!-- Step 3: Pencucian & Sortasi -->
        <rect x="245" y="65" width="90" height="70" fill="#1e293b" stroke="#64748b" stroke-width="1.5" rx="6"/>
        <text x="290" y="85" fill="#e2e8f0" font-size="9" font-weight="bold" text-anchor="middle">3. Pencucian</text>
        <text x="290" y="100" fill="#94a3b8" font-size="8" text-anchor="middle">Klorin 5-10 ppm</text>
        <text x="290" y="115" fill="#94a3b8" font-size="8" text-anchor="middle">Higiene Standar</text>
        
        <!-- Arrow 3 -->
        <line x1="335" y1="100" x2="355" y2="100" stroke="#64748b" stroke-width="2"/>
        <polygon points="355,100 348,96 348,104" fill="#64748b"/>
        
        <!-- Step 4: Pembekuan (Freezing) -->
        <rect x="355" y="65" width="80" height="70" fill="#1e293b" stroke="#ef4444" stroke-width="2" rx="6"/>
        <text x="395" y="85" fill="#f87171" font-size="9" font-weight="bold" text-anchor="middle">4. Pembekuan</text>
        <text x="395" y="100" fill="#94a3b8" font-size="8" text-anchor="middle">Air Blast Freezing</text>
        <rect x="360" y="112" width="70" height="16" fill="#ef4444" rx="3"/>
        <text x="395" y="124" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">CCP 2: ≤ -18°C</text>
        
        <!-- Organoleptic / Freshness Sensory Scale below -->
        <rect x="25" y="155" width="410" height="145" fill="#1e293b" rx="8" stroke="#334155" stroke-width="1"/>
        <text x="40" y="175" fill="#38bdf8" font-size="10" font-weight="bold">STANDAR UJI ORGANOLEPTIK IKAN SEGAR (SNI 2729:2021)</text>
        
        <line x1="25" y1="185" x2="435" y2="185" stroke="#334155" stroke-width="1"/>
        
        <text x="40" y="205" fill="#94a3b8" font-size="9" font-weight="bold">Parameter</text>
        <text x="140" y="205" fill="#4ade80" font-size="9" font-weight="bold">Ikan Sangat Segar (Skor 9)</text>
        <text x="300" y="205" fill="#f87171" font-size="9" font-weight="bold">Ikan Busuk / Ditolak (Skor &lt; 5)</text>
        
        <text x="40" y="225" fill="#cbd5e1" font-size="8">• Mata</text>
        <text x="140" y="225" fill="#cbd5e1" font-size="8">Cembung, kornea jernih, pupil hitam cerah</text>
        <text x="300" y="225" fill="#cbd5e1" font-size="8">Cekung, kornea keruh kemerahan</text>
        
        <text x="40" y="245" fill="#cbd5e1" font-size="8">• Insang</text>
        <text x="140" y="245" fill="#cbd5e1" font-size="8">Merah tua cemerlang, tanpa lendir keruh</text>
        <text x="300" y="245" fill="#cbd5e1" font-size="8">Cokelat kelabu, lendir tebal berbau busuk</text>
        
        <text x="40" y="265" fill="#cbd5e1" font-size="8">• Daging</text>
        <text x="140" y="265" fill="#cbd5e1" font-size="8">Kenyal padat, bekas jari segera kembali</text>
        <text x="300" y="265" fill="#cbd5e1" font-size="8">Lembek, berbekas permanen saat ditekan</text>

        <text x="40" y="285" fill="#cbd5e1" font-size="8">• Histamin</text>
        <text x="140" y="285" fill="#4ade80" font-size="8">&lt; 20 ppm (Aman konsumsi)</text>
        <text x="300" y="285" fill="#ef4444" font-size="8">&gt; 100 ppm (Batas bahaya racun)</text>
      </svg>
    `;
  }

  // 5. DEFAULT MARITIME COMPASS & VESSEL (ALL DEPARTMENTS)
  return `
    <svg viewBox="0 0 450 300" xmlns="http://www.w3.org/2000/svg" style="background:#09192b; border-radius:12px; font-family:sans-serif;">
      <!-- Title -->
      <rect x="25" y="12" width="400" height="25" fill="#122a44" rx="4"/>
      <text x="225" y="29" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">MAWAR PEDOMAN & PENGUKURAN SUDUT BARINGAN KAPAL</text>
      
      <!-- Compass Rose -->
      <circle cx="225" cy="160" r="95" fill="#0c1f33" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="225" cy="160" r="70" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
      
      <!-- North Pointer -->
      <polygon points="225,75 235,160 225,150 215,160" fill="#ef4444"/>
      <!-- South Pointer -->
      <polygon points="225,245 235,160 225,170 215,160" fill="#94a3b8"/>
      <!-- East Pointer -->
      <polygon points="310,160 225,150 235,160 225,170" fill="#94a3b8"/>
      <!-- West Pointer -->
      <polygon points="140,160 225,150 215,160 225,170" fill="#94a3b8"/>
      
      <circle cx="225" cy="160" r="5" fill="#fbbf24"/>
      
      <!-- Cardinal texts -->
      <text x="225" y="70" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">UTARA (000°)</text>
      <text x="325" y="164" fill="#38bdf8" font-size="10" font-weight="bold">TIMUR (090°)</text>
      <text x="225" y="260" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">SELATAN (180°)</text>
      <text x="125" y="164" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="end">BARAT (270°)</text>
      
      <!-- Ship Heading Indicator line -->
      <line x1="225" y1="160" x2="295" y2="105" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="5,2"/>
      <circle cx="295" cy="105" r="4" fill="#fbbf24"/>
      <text x="305" y="105" fill="#fbbf24" font-size="9" font-weight="bold">Garis Baringan Target (052°)</text>
      
      <text x="225" y="285" fill="#64748b" font-size="8" text-anchor="middle">Sistem Navigasi Maritim SUPM TEGAL</text>
    </svg>
  `;
}

interface QuestionImageDisplayProps {
  image?: QuestionImage;
  questionNumber: number;
  questionText: string;
  topic: string;
  department?: DepartmentCode | string;
}

export const QuestionImageDisplay: React.FC<QuestionImageDisplayProps> = ({
  image,
  questionNumber,
  questionText,
  topic,
  department,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Determine what to display: provided image URL, provided SVG, or auto-generated vocational diagram
  const hasImageUrl = Boolean(image?.imageUrl);
  const hasProvidedSvg = Boolean(image?.svgDiagram);

  const finalSvg = hasProvidedSvg
    ? image!.svgDiagram!
    : generateVocationalDiagramSvg(topic, questionText, department);

  const title = image?.title || `Gambar ${questionNumber}: Ilustrasi Stimulus Instrumen`;
  const caption = image?.caption || image?.description || `Diagram teknis penunjang soal nomor ${questionNumber}`;

  return (
    <div className="my-3 rounded-xl border border-slate-200 bg-slate-900/5 p-3 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <ImageIcon className="w-3.5 h-3.5 text-blue-900" />
          <span>{title}</span>
        </div>
        <button
          type="button"
          onClick={() => setIsZoomed(!isZoomed)}
          className="text-[11px] text-blue-800 hover:text-blue-950 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs"
        >
          {isZoomed ? (
            <>
              <ZoomOut className="w-3 h-3" />
              <span>Perkecil</span>
            </>
          ) : (
            <>
              <ZoomIn className="w-3 h-3" />
              <span>Perbesar</span>
            </>
          )}
        </button>
      </div>

      {/* Media Container */}
      <div
        className={`relative flex items-center justify-center rounded-lg overflow-hidden transition-all ${
          isZoomed ? 'max-h-[550px]' : 'max-h-[320px]'
        }`}
      >
        {hasImageUrl ? (
          <img
            src={image!.imageUrl}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full max-h-[450px] object-contain rounded-lg"
          />
        ) : (
          <div
            className="w-full flex justify-center [&>svg]:w-full [&>svg]:max-w-xl [&>svg]:h-auto [&>svg]:rounded-lg [&>svg]:shadow"
            dangerouslySetInnerHTML={{ __html: finalSvg }}
          />
        )}
      </div>

      {/* Caption */}
      {caption && (
        <div className="mt-2 text-center text-[11px] text-slate-600 italic">
          {caption}
        </div>
      )}
    </div>
  );
};
