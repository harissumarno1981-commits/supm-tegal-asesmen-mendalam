import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssessmentResult } from '../types/assessment';
import { ExportSectionType } from './docxBuilder';

export function generatePdfDocument(result: AssessmentResult, section: ExportSectionType): jsPDF {
  // Use A4 portrait
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let cursorY = 16;

  const NAVY: [number, number, number] = [15, 40, 78];
  const GRAY: [number, number, number] = [100, 116, 139];
  const DARK: [number, number, number] = [30, 41, 59];

  // Helper to add header banner
  function renderHeader(titleText: string) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text('KEMENTERIAN KELAUTAN DAN PERIKANAN', pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 5;

    doc.setFontSize(13);
    doc.text('SEKOLAH USAHA PERIKANAN MENENGAH (SUPM) TEGAL', pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 6;

    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    doc.text(titleText, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 4;

    doc.setDrawColor(15, 40, 78);
    doc.setLineWidth(0.6);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 6;

    // Metadata Table
    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2, textColor: [30, 41, 59] },
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 40, 78], fontStyle: 'bold' },
      body: [
        [
          { content: 'Satuan Pendidikan', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
          result.metadata.schoolName,
          { content: 'Kelas / Jurusan', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
          `${result.metadata.grade} / ${result.metadata.department}`,
        ],
        [
          { content: 'Mata Pelajaran', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
          result.metadata.subject,
          { content: 'Jenis Asesmen', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
          `${result.metadata.assessmentType} (${result.metadata.instrumentType})`,
        ],
        [
          { content: 'Guru Pengampu', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
          result.metadata.teacherName || '-',
          { content: 'Tanggal Terbit', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
          result.metadata.generatedAt,
        ],
      ],
    });

    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  // Titles mapping
  const titleMap: Record<ExportSectionType, string> = {
    all: `PERANGKAT ASESMEN LENGKAP - ${result.metadata.assessmentType.toUpperCase()}`,
    'kisi-kisi': `KISI-KISI ASESMEN PEMBELAJARAN - ${result.metadata.assessmentType.toUpperCase()}`,
    soal: `NASKAH SOAL ASESMEN PESERTA DIDIK - ${result.metadata.assessmentType.toUpperCase()}`,
    kunci: `KUNCI JAWABAN & PEMBAHASAN - ${result.metadata.assessmentType.toUpperCase()}`,
    rubrik: `RUBRIK & PEDOMAN PENSKORAN - ${result.metadata.assessmentType.toUpperCase()}`,
  };

  renderHeader(titleMap[section]);

  // Section 1: Kisi-kisi
  if (section === 'all' || section === 'kisi-kisi') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text('BAGIAN A: KISI-KISI ASESMEN PEMBELAJARAN', margin, cursorY);
    cursorY += 4;

    const kisiTableBody = result.kisiKisi.map((k, i) => [
      String(k.no || i + 1),
      k.learningObjective || '',
      k.topic || '',
      k.indicator || '',
      String(k.cognitiveLevel || ''),
      k.instrumentType || '',
      String(k.questionNumber || i + 1),
      String(k.scoreWeight || '-'),
    ]);

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      theme: 'striped',
      head: [['No', 'Tujuan Pembelajaran', 'Materi', 'Indikator Soal/Tugas', 'Level SOLO', 'Bentuk', 'No Butir', 'Bobot']],
      body: kisiTableBody,
      headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
      styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 40 },
        2: { cellWidth: 26 },
        3: { cellWidth: 44 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 12, halign: 'center' },
        7: { cellWidth: 12, halign: 'center' },
      },
    });

    cursorY = (doc as any).lastAutoTable.finalY + 10;
  }

  // Section 2: Naskah Soal
  if (section === 'all' || section === 'soal') {
    if (section === 'all') {
      doc.addPage();
      cursorY = 16;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      doc.text(`SUPM TEGAL - NASKAH SOAL PESERTA DIDIK (${result.metadata.subject})`, margin, cursorY);
      cursorY += 8;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text('BAGIAN B: NASKAH SOAL ASESMEN (LEMBAR PESERTA DIDIK)', margin, cursorY);
    cursorY += 6;

    if (result.naskahSoal.studentInstructions && result.naskahSoal.studentInstructions.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...DARK);
      doc.text('Petunjuk Pengerjaan:', margin, cursorY);
      cursorY += 4;

      doc.setFont('helvetica', 'normal');
      result.naskahSoal.studentInstructions.forEach((inst, idx) => {
        const text = `${idx + 1}. ${inst}`;
        const lines = doc.splitTextToSize(text, pageWidth - margin * 2 - 4);
        doc.text(lines, margin + 4, cursorY);
        cursorY += lines.length * 4;
      });
      cursorY += 4;
    }

    // Render questions
    result.naskahSoal.questions.forEach((q, idx) => {
      // Check if page overflow
      if (cursorY > pageHeight - 30) {
        doc.addPage();
        cursorY = 16;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...DARK);

      const qHeader = `${idx + 1}. `;
      doc.text(qHeader, margin, cursorY);

      if (q.stimulus) {
        doc.setFont('helvetica', 'italic');
        const stimLines = doc.splitTextToSize(q.stimulus, pageWidth - margin * 2 - 8);
        doc.text(stimLines, margin + 8, cursorY);
        cursorY += stimLines.length * 4.2;
      }

      doc.setFont('helvetica', 'bold');
      const qLines = doc.splitTextToSize(q.questionText, pageWidth - margin * 2 - 8);
      doc.text(qLines, margin + 8, cursorY);
      cursorY += qLines.length * 4.4;

      if (q.cognitiveLevel) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(...GRAY);
        doc.text(`[Tingkat SOLO: ${q.cognitiveLevel}]`, margin + 8, cursorY);
        cursorY += 4;
      }

      // Diagram / Image Stimulus Box in PDF
      const imgTitle = q.image?.title || `Gambar ${idx + 1}: Diagram Stimulus Soal`;
      const imgCaption = q.image?.caption || q.image?.description || 'Perhatikan gambar/diagram teknis untuk menjawab soal ini.';
      
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin + 8, cursorY, pageWidth - margin * 2 - 16, 11, 1.5, 1.5, 'FD');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 40, 78);
      doc.text(`[${imgTitle}]`, margin + 11, cursorY + 4.5);
      
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text(imgCaption.substring(0, 80), margin + 11, cursorY + 8.5);
      cursorY += 14;

      // Options
      if (q.options && q.options.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...DARK);
        q.options.forEach((opt) => {
          if (cursorY > pageHeight - 15) {
            doc.addPage();
            cursorY = 16;
          }
          const optText = `${opt.key}. ${opt.text}`;
          const optLines = doc.splitTextToSize(optText, pageWidth - margin * 2 - 12);
          doc.text(optLines, margin + 12, cursorY);
          cursorY += optLines.length * 4.2;
        });
      }

      if (q.instructions) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(...GRAY);
        const instLines = doc.splitTextToSize(`Instruksi: ${q.instructions}`, pageWidth - margin * 2 - 12);
        doc.text(instLines, margin + 12, cursorY);
        cursorY += instLines.length * 4;
      }

      cursorY += 4;
    });

    cursorY += 6;
  }

  // Section 3: Kunci Jawaban Terpisah
  if (section === 'all' || section === 'kunci') {
    if (section === 'all') {
      doc.addPage();
      cursorY = 16;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      doc.text(`SUPM TEGAL - KUNCI JAWABAN & PEMBAHASAN (${result.metadata.subject})`, margin, cursorY);
      cursorY += 8;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text('BAGIAN C: KUNCI JAWABAN TERPISAH & PEMBAHASAN', margin, cursorY);
    cursorY += 4;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text('* Dokumen rahasia untuk guru/asesor dalam pemeriksaan hasil asesmen.', margin, cursorY);
    cursorY += 6;

    result.kunciJawaban.forEach((item, idx) => {
      if (cursorY > pageHeight - 25) {
        doc.addPage();
        cursorY = 16;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...NAVY);
      doc.text(`Nomor ${item.questionNumber || idx + 1}: Kunci = ${item.correctAnswer}`, margin, cursorY);
      cursorY += 4.5;

      if (item.explanation) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...DARK);
        const expLines = doc.splitTextToSize(`Pembahasan: ${item.explanation}`, pageWidth - margin * 2 - 6);
        doc.text(expLines, margin + 6, cursorY);
        cursorY += expLines.length * 4;
      }

      if (item.expectedKeyPoints && item.expectedKeyPoints.length > 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        item.expectedKeyPoints.forEach((kp) => {
          const kpLines = doc.splitTextToSize(`• ${kp}`, pageWidth - margin * 2 - 10);
          doc.text(kpLines, margin + 10, cursorY);
          cursorY += kpLines.length * 3.8;
        });
      }

      cursorY += 3;
    });

    cursorY += 6;
  }

  // Section 4: Rubrik dan Pedoman Penskoran
  if (section === 'all' || section === 'rubrik') {
    if (section === 'all') {
      doc.addPage();
      cursorY = 16;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      doc.text(`SUPM TEGAL - RUBRIK & PEDOMAN PENSKORAN (${result.metadata.subject})`, margin, cursorY);
      cursorY += 8;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text('BAGIAN D: RUBRIK DAN PEDOMAN PENSKORAN', margin, cursorY);
    cursorY += 6;

    const rubric = result.rubrikDanPenskoran;

    if (rubric.scoringRuleSummary) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...DARK);
      doc.text('Aturan Penskoran: ', margin, cursorY);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(rubric.scoringRuleSummary, pageWidth - margin * 2 - 35);
      doc.text(lines, margin + 35, cursorY);
      cursorY += Math.max(lines.length * 4.2, 5);
    }

    if (rubric.scoreFormula) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...DARK);
      doc.text('Rumus Nilai: ', margin, cursorY);
      doc.setTextColor(...NAVY);
      doc.text(rubric.scoreFormula, margin + 35, cursorY);
      cursorY += 6;
    }

    if (rubric.aspects && rubric.aspects.length > 0) {
      rubric.aspects.forEach((asp) => {
        if (cursorY > pageHeight - 35) {
          doc.addPage();
          cursorY = 16;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...DARK);
        doc.text(`Aspek Penilaian: ${asp.aspectName} (Bobot: ${asp.weight}%)`, margin, cursorY);
        cursorY += 4;

        const bodyData = (asp.criteria || []).map((c) => [
          `${c.levelName}\n(Skor: ${c.score})`,
          c.description,
        ]);

        autoTable(doc, {
          startY: cursorY,
          margin: { left: margin, right: margin },
          theme: 'grid',
          head: [['Kriteria / Tingkat', 'Deskripsi Indikator Kinerja']],
          body: bodyData,
          headStyles: { fillColor: [241, 245, 249], textColor: NAVY, fontStyle: 'bold', fontSize: 8 },
          styles: { fontSize: 7.5, cellPadding: 2 },
          columnStyles: {
            0: { cellWidth: 40, fontStyle: 'bold' },
            1: { cellWidth: 'auto' },
          },
        });

        cursorY = (doc as any).lastAutoTable.finalY + 6;
      });
    }

    if (rubric.followUpGuidance) {
      if (cursorY > pageHeight - 25) {
        doc.addPage();
        cursorY = 16;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...DARK);
      doc.text(`Tindak Lanjut Pembelajaran (${result.metadata.assessmentType}):`, margin, cursorY);
      cursorY += 4.5;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(rubric.followUpGuidance, pageWidth - margin * 2);
      doc.text(lines, margin, cursorY);
      cursorY += lines.length * 4 + 4;
    }

    if (rubric.qualitativeInterpretation) {
      if (cursorY > pageHeight - 25) {
        doc.addPage();
        cursorY = 16;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...DARK);
      doc.text('Interpretasi Kualitatif:', margin, cursorY);
      cursorY += 4.5;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(rubric.qualitativeInterpretation, pageWidth - margin * 2);
      doc.text(lines, margin, cursorY);
      cursorY += lines.length * 4 + 4;
    }

    if (result.qualityCheck && result.qualityCheck.teacherVerificationNotes) {
      if (cursorY > pageHeight - 25) {
        doc.addPage();
        cursorY = 16;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...NAVY);
      doc.text('Pemeriksaan Mutu & Catatan Verifikasi Guru:', margin, cursorY);
      cursorY += 4.5;
      doc.setFont('helvetica', 'normal');
      result.qualityCheck.teacherVerificationNotes.forEach((note) => {
        const lines = doc.splitTextToSize(`• ${note}`, pageWidth - margin * 2 - 4);
        doc.text(lines, margin + 4, cursorY);
        cursorY += lines.length * 3.8;
      });
    }
  }

  // Page Numbers Footer
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `SUPM TEGAL • Halaman ${i} dari ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  return doc;
}
