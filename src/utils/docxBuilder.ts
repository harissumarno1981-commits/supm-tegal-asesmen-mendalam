import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  Packer,
} from 'docx';
import { AssessmentResult } from '../types/assessment';

export type ExportSectionType = 'all' | 'kisi-kisi' | 'soal' | 'kunci' | 'rubrik';

const NAVY = '0F284E';
const GRAY_BG = 'F1F5F9';
const BORDER_COLOR = 'CBD5E1';

const thinBorder = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: BORDER_COLOR,
};

const cellBorders = {
  top: thinBorder,
  bottom: thinBorder,
  left: thinBorder,
  right: thinBorder,
};

function createHeaderTable(result: AssessmentResult, title: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { fill: GRAY_BG },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Satuan Pendidikan', bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: result.metadata.schoolName, bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { fill: GRAY_BG },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Kelas / Jurusan', bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${result.metadata.grade} / ${result.metadata.department}`,
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: GRAY_BG },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Mata Pelajaran', bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: result.metadata.subject, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            shading: { fill: GRAY_BG },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Jenis Asesmen', bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${result.metadata.assessmentType} (${result.metadata.instrumentType})`,
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: GRAY_BG },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Guru Pengampu', bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: result.metadata.teacherName || '-', size: 20 })],
              }),
            ],
          }),
          new TableCell({
            shading: { fill: GRAY_BG },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Tanggal Dibuat', bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: result.metadata.generatedAt, size: 20 })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function buildKisiKisiSection(result: AssessmentResult): Paragraph[] | (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: 'BAGIAN A: KISI-KISI ASESMEN PEMBELAJARAN',
          bold: true,
          color: NAVY,
          size: 24,
        }),
      ],
    })
  );

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        shading: { fill: NAVY },
        children: [new Paragraph({ children: [new TextRun({ text: 'No', bold: true, color: 'FFFFFF', size: 18 })] })],
      }),
      new TableCell({
        shading: { fill: NAVY },
        children: [new Paragraph({ children: [new TextRun({ text: 'Tujuan Pembelajaran', bold: true, color: 'FFFFFF', size: 18 })] })],
      }),
      new TableCell({
        shading: { fill: NAVY },
        children: [new Paragraph({ children: [new TextRun({ text: 'Materi', bold: true, color: 'FFFFFF', size: 18 })] })],
      }),
      new TableCell({
        shading: { fill: NAVY },
        children: [new Paragraph({ children: [new TextRun({ text: 'Indikator Soal/Tugas', bold: true, color: 'FFFFFF', size: 18 })] })],
      }),
      new TableCell({
        shading: { fill: NAVY },
        children: [new Paragraph({ children: [new TextRun({ text: 'Level SOLO', bold: true, color: 'FFFFFF', size: 18 })] })],
      }),
      new TableCell({
        shading: { fill: NAVY },
        children: [new Paragraph({ children: [new TextRun({ text: 'Bentuk', bold: true, color: 'FFFFFF', size: 18 })] })],
      }),
      new TableCell({
        shading: { fill: NAVY },
        children: [new Paragraph({ children: [new TextRun({ text: 'No. Soal', bold: true, color: 'FFFFFF', size: 18 })] })],
      }),
      new TableCell({
        shading: { fill: NAVY },
        children: [new Paragraph({ children: [new TextRun({ text: 'Bobot', bold: true, color: 'FFFFFF', size: 18 })] })],
      }),
    ],
  });

  const dataRows = result.kisiKisi.map(
    (item, index) =>
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorders,
            shading: index % 2 === 1 ? { fill: GRAY_BG } : undefined,
            children: [new Paragraph({ children: [new TextRun({ text: String(item.no || index + 1), size: 18 })] })],
          }),
          new TableCell({
            borders: cellBorders,
            shading: index % 2 === 1 ? { fill: GRAY_BG } : undefined,
            children: [new Paragraph({ children: [new TextRun({ text: item.learningObjective || '', size: 18 })] })],
          }),
          new TableCell({
            borders: cellBorders,
            shading: index % 2 === 1 ? { fill: GRAY_BG } : undefined,
            children: [new Paragraph({ children: [new TextRun({ text: item.topic || '', size: 18 })] })],
          }),
          new TableCell({
            borders: cellBorders,
            shading: index % 2 === 1 ? { fill: GRAY_BG } : undefined,
            children: [new Paragraph({ children: [new TextRun({ text: item.indicator || '', size: 18 })] })],
          }),
          new TableCell({
            borders: cellBorders,
            shading: index % 2 === 1 ? { fill: GRAY_BG } : undefined,
            children: [new Paragraph({ children: [new TextRun({ text: String(item.cognitiveLevel || ''), size: 18 })] })],
          }),
          new TableCell({
            borders: cellBorders,
            shading: index % 2 === 1 ? { fill: GRAY_BG } : undefined,
            children: [new Paragraph({ children: [new TextRun({ text: item.instrumentType || '', size: 18 })] })],
          }),
          new TableCell({
            borders: cellBorders,
            shading: index % 2 === 1 ? { fill: GRAY_BG } : undefined,
            children: [new Paragraph({ children: [new TextRun({ text: String(item.questionNumber || index + 1), size: 18 })] })],
          }),
          new TableCell({
            borders: cellBorders,
            shading: index % 2 === 1 ? { fill: GRAY_BG } : undefined,
            children: [new Paragraph({ children: [new TextRun({ text: String(item.scoreWeight || '-'), size: 18 })] })],
          }),
        ],
      })
  );

  elements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...dataRows],
    })
  );

  return elements;
}

function buildNaskahSoalSection(result: AssessmentResult): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: 'BAGIAN B: NASKAH SOAL ASESMEN (LEMBAR PESERTA DIDIK)',
          bold: true,
          color: NAVY,
          size: 24,
        }),
      ],
    })
  );

  // Student instructions
  if (result.naskahSoal.studentInstructions && result.naskahSoal.studentInstructions.length > 0) {
    elements.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [new TextRun({ text: 'Petunjuk Pengerjaan:', bold: true, size: 20 })],
      })
    );
    result.naskahSoal.studentInstructions.forEach((inst, idx) => {
      elements.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: `${idx + 1}. ${inst}`, size: 19 })],
        })
      );
    });
  }

  elements.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

  // Questions
  result.naskahSoal.questions.forEach((q, idx) => {
    // Question header
    const levelLabel = q.cognitiveLevel ? ` [SOLO: ${q.cognitiveLevel}]` : '';
    elements.push(
      new Paragraph({
        spacing: { before: 160, after: 60 },
        children: [
          new TextRun({ text: `${idx + 1}. `, bold: true, size: 20 }),
          new TextRun({ text: q.stimulus ? `${q.stimulus}\n` : '', italics: true, size: 19 }),
          new TextRun({ text: q.questionText, size: 20, bold: true }),
          new TextRun({ text: levelLabel, italics: true, size: 17, color: '64748B' }),
        ],
      })
    );

    // Image / Diagram Stimulus Box
    const imgTitle = q.image?.title || `Gambar ${idx + 1}: Diagram Stimulus Soal`;
    const imgCaption = q.image?.caption || q.image?.description || 'Perhatikan gambar/diagram teknis di atas untuk menjawab soal.';
    elements.push(
      new Paragraph({
        indent: { left: 400 },
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({ text: `[${imgTitle}]`, bold: true, color: NAVY, size: 19 }),
          new TextRun({ text: ` - ${imgCaption}`, italics: true, color: '475569', size: 18 }),
        ],
      })
    );

    // Options A-E
    if (q.options && q.options.length > 0) {
      q.options.forEach((opt) => {
        elements.push(
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 40 },
            children: [
              new TextRun({ text: `${opt.key}. `, bold: true, size: 19 }),
              new TextRun({ text: opt.text, size: 19 }),
            ],
          })
        );
      });
    }

    // Instructions if essay or practice
    if (q.instructions) {
      elements.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { before: 40, after: 60 },
          children: [
            new TextRun({ text: 'Instruksi Pengerjaan: ', bold: true, italics: true, size: 18 }),
            new TextRun({ text: q.instructions, italics: true, size: 18 }),
          ],
        })
      );
    }
  });

  return elements;
}

function buildKunciJawabanSection(result: AssessmentResult): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: 'BAGIAN C: KUNCI JAWABAN & PEMBAHASAN MENDALAM',
          bold: true,
          color: NAVY,
          size: 24,
        }),
      ],
    })
  );

  elements.push(
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: '* Dokumen ini terpisah untuk keperluan guru/asesor dalam pemeriksaan hasil.',
          italics: true,
          color: '64748B',
          size: 18,
        }),
      ],
    })
  );

  result.kunciJawaban.forEach((item, idx) => {
    elements.push(
      new Paragraph({
        spacing: { before: 140, after: 40 },
        children: [
          new TextRun({ text: `Nomor ${item.questionNumber || idx + 1}: `, bold: true, size: 20 }),
          new TextRun({ text: `Kunci Jawaban: ${item.correctAnswer}`, bold: true, color: NAVY, size: 20 }),
        ],
      })
    );

    if (item.explanation) {
      elements.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { after: 40 },
          children: [
            new TextRun({ text: 'Pembahasan: ', bold: true, size: 18 }),
            new TextRun({ text: item.explanation, size: 18 }),
          ],
        })
      );
    }

    if (item.expectedKeyPoints && item.expectedKeyPoints.length > 0) {
      elements.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { after: 40 },
          children: [new TextRun({ text: 'Indikator / Poin Kunci Kinerja:', bold: true, italics: true, size: 18 })],
        })
      );
      item.expectedKeyPoints.forEach((kp) => {
        elements.push(
          new Paragraph({
            indent: { left: 600 },
            spacing: { after: 30 },
            children: [new TextRun({ text: `• ${kp}`, size: 18 })],
          })
        );
      });
    }
  });

  return elements;
}

function buildRubrikSection(result: AssessmentResult): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];
  const rubric = result.rubrikDanPenskoran;

  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: 'BAGIAN D: RUBRIK DAN PEDOMAN PENSKORAN',
          bold: true,
          color: NAVY,
          size: 24,
        }),
      ],
    })
  );

  if (rubric.scoringRuleSummary) {
    elements.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: 'Aturan Penskoran: ', bold: true, size: 20 }),
          new TextRun({ text: rubric.scoringRuleSummary, size: 20 }),
        ],
      })
    );
  }

  if (rubric.scoreFormula) {
    elements.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: 'Rumus Nilai Akhir: ', bold: true, size: 20 }),
          new TextRun({ text: rubric.scoreFormula, size: 20, bold: true, color: NAVY }),
        ],
      })
    );
  }

  // Aspects & criteria tables
  if (rubric.aspects && rubric.aspects.length > 0) {
    elements.push(
      new Paragraph({
        spacing: { before: 100, after: 60 },
        children: [new TextRun({ text: 'Kriteria Penilaian Kinerja & Rubrik SOLO:', bold: true, size: 20 })],
      })
    );

    rubric.aspects.forEach((asp) => {
      elements.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({ text: `Aspek: ${asp.aspectName} (Bobot: ${asp.weight}%)`, bold: true, size: 19 }),
          ],
        })
      );

      const criteriaRows = (asp.criteria || []).map(
        (c) =>
          new TableRow({
            children: [
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                borders: cellBorders,
                shading: { fill: GRAY_BG },
                children: [new Paragraph({ children: [new TextRun({ text: `${c.levelName} (Skor: ${c.score})`, bold: true, size: 18 })] })],
              }),
              new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                borders: cellBorders,
                children: [new Paragraph({ children: [new TextRun({ text: c.description, size: 18 })] })],
              }),
            ],
          })
      );

      if (criteriaRows.length > 0) {
        elements.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: criteriaRows,
          })
        );
      }
    });
  }

  // Follow-up & qualitative interpretation
  if (rubric.followUpGuidance) {
    elements.push(
      new Paragraph({
        spacing: { before: 140, after: 40 },
        children: [new TextRun({ text: `Panduan Tindak Lanjut (${result.metadata.assessmentType}):`, bold: true, size: 20 })],
      })
    );
    elements.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: rubric.followUpGuidance, size: 19 })],
      })
    );
  }

  if (rubric.qualitativeInterpretation) {
    elements.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [new TextRun({ text: 'Interpretasi Hasil Asesmen:', bold: true, size: 20 })],
      })
    );
    elements.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: rubric.qualitativeInterpretation, size: 19 })],
      })
    );
  }

  // Quality check notes
  if (result.qualityCheck && result.qualityCheck.teacherVerificationNotes) {
    elements.push(
      new Paragraph({
        spacing: { before: 140, after: 40 },
        children: [new TextRun({ text: 'Catatan Verifikasi & Pemeriksaan Mutu Guru:', bold: true, size: 20 })],
      })
    );
    result.qualityCheck.teacherVerificationNotes.forEach((note) => {
      elements.push(
        new Paragraph({
          indent: { left: 300 },
          spacing: { after: 30 },
          children: [new TextRun({ text: `• ${note}`, size: 18, color: '334155' })],
        })
      );
    });
  }

  return elements;
}

export async function generateDocxBuffer(result: AssessmentResult, section: ExportSectionType): Promise<Buffer> {
  const children: (Paragraph | Table)[] = [];

  // Title & Header Table
  const titleMap: Record<ExportSectionType, string> = {
    all: `PERANGKAT ASESMEN PEMBELAJARAN LENGKAP (${result.metadata.assessmentType.toUpperCase()})`,
    'kisi-kisi': `KISI-KISI ASESMEN PEMBELAJARAN (${result.metadata.assessmentType.toUpperCase()})`,
    soal: `NASKAH SOAL ASESMEN PESERTA DIDIK (${result.metadata.assessmentType.toUpperCase()})`,
    kunci: `KUNCI JAWABAN & PEMBAHASAN (${result.metadata.assessmentType.toUpperCase()})`,
    rubrik: `RUBRIK & PEDOMAN PENSKORAN (${result.metadata.assessmentType.toUpperCase()})`,
  };

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: 'KEMENTERIAN KELAUTAN DAN PERIKANAN',
          bold: true,
          size: 22,
          color: NAVY,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: 'SEKOLAH USAHA PERIKANAN MENENGAH (SUPM) TEGAL',
          bold: true,
          size: 26,
          color: NAVY,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: titleMap[section] || 'PERANGKAT ASESMEN PEMBELAJARAN',
          bold: true,
          size: 22,
        }),
      ],
    })
  );

  // Meta identity table
  children.push(createHeaderTable(result, titleMap[section]));
  children.push(new Paragraph({ spacing: { after: 160 }, children: [] }));

  if (section === 'all') {
    // 1. Kisi-Kisi
    children.push(...buildKisiKisiSection(result));
    children.push(new Paragraph({ pageBreakBefore: true, children: [] }));

    // 2. Naskah Soal (Strictly no answers!)
    children.push(...buildNaskahSoalSection(result));
    children.push(new Paragraph({ pageBreakBefore: true, children: [] }));

    // 3. Kunci Jawaban (Separated on fresh page!)
    children.push(...buildKunciJawabanSection(result));
    children.push(new Paragraph({ pageBreakBefore: true, children: [] }));

    // 4. Rubrik
    children.push(...buildRubrikSection(result));
  } else if (section === 'kisi-kisi') {
    children.push(...buildKisiKisiSection(result));
  } else if (section === 'soal') {
    children.push(...buildNaskahSoalSection(result));
  } else if (section === 'kunci') {
    children.push(...buildKunciJawabanSection(result));
  } else if (section === 'rubrik') {
    children.push(...buildRubrikSection(result));
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `SUPM TEGAL - ${result.metadata.subject} (${result.metadata.department})`,
                    size: 16,
                    color: '94A3B8',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Halaman ', size: 16 }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16 }),
                  new TextRun({ text: ' dari ', size: 16 }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16 }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
