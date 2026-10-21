export type GradeLevel = 'X' | 'XI' | 'XII';

export type DepartmentCode = 'NKPI' | 'TKPI' | 'APPL' | 'APHP';

export type AssessmentType = 'Diagnostik' | 'Formatif' | 'Sumatif';

export type InstrumentType = 
  | 'Pilihan Ganda'
  | 'Esai/Uraian'
  | 'Praktik/Unjuk Kerja'
  | 'Observasi'
  | 'Campuran';

export type SoloTaxonomyLevel = 
  | 'Prastruktural'
  | 'Unistruktural'
  | 'Multistruktural'
  | 'Relasional'
  | 'Abstrak Diperluas';

export interface AssessmentFormData {
  schoolName: string; // 'SUPM TEGAL' (fixed)
  teacherName: string;
  subject: string;
  level: string; // 'SMK' (fixed)
  grade: GradeLevel;
  department: DepartmentCode;
  assessmentType: AssessmentType;
  topic: string;
  learningObjectives: string;
  learningCompetencies?: string; // Capaian / Indikator tambahan
  instrumentType: InstrumentType;
  questionCount: number;
  cognitiveLevels: SoloTaxonomyLevel[];
  additionalInstructions?: string;
}

export interface KisiKisiItem {
  no: number;
  learningObjective: string;
  topic: string;
  indicator: string;
  cognitiveLevel: SoloTaxonomyLevel | string;
  instrumentType: string;
  questionNumber: string;
  scoreWeight: number | string;
}

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
}

export interface QuestionImage {
  title?: string;
  caption?: string;
  description?: string;
  svgDiagram?: string; // Kode SVG diagram teknis/vektor
  imageUrl?: string; // URL gambar
}

export interface QuestionItem {
  number: number;
  type: string;
  cognitiveLevel: string;
  stimulus?: string; // Konteks kasus maritim/perikanan/skenario
  questionText: string;
  options?: QuestionOption[]; // WAJIB A-E untuk pilihan ganda
  instructions?: string; // Untuk esai/praktik/observasi
  allocatedScore?: number;
  image?: QuestionImage; // Gambar/diagram pelengkap soal
}

export interface AnswerKeyItem {
  questionNumber: number;
  questionType: string;
  correctAnswer: string; // Misal "C" atau poin jawaban esai/praktik
  explanation: string; // Pembahasan ilmiah & konseptual
  expectedKeyPoints?: string[]; // Indikator kinerja / poin penting
}

export interface RubricLevelCriteria {
  levelName: string; // e.g. "Sangat Baik / Mahir (4)", "Baik (3)", dst.
  score: number;
  description: string;
}

export interface RubricAspect {
  aspectName: string;
  weight: number;
  criteria: RubricLevelCriteria[];
}

export interface QualityCheck {
  totalQuestionsValid: boolean;
  totalQuestionsCount: number;
  hasAllFiveOptions: boolean;
  consistencyCheckStatus: 'Sesuai' | 'Perlu Penyesuaian Guru';
  alignmentSummary: string;
  teacherVerificationNotes: string[];
}

export interface AssessmentResult {
  id: string;
  metadata: {
    schoolName: string;
    teacherName: string;
    subject: string;
    level: string;
    grade: GradeLevel;
    department: DepartmentCode;
    departmentFullName: string;
    assessmentType: AssessmentType;
    instrumentType: InstrumentType;
    topic: string;
    questionCount: number;
    generatedAt: string;
  };
  kisiKisi: KisiKisiItem[];
  naskahSoal: {
    studentInstructions: string[];
    questions: QuestionItem[];
  };
  kunciJawaban: AnswerKeyItem[];
  rubrikDanPenskoran: {
    scoringRuleSummary: string;
    maxScore: number;
    scoreFormula: string;
    aspects: RubricAspect[];
    followUpGuidance: string; // Tindak lanjut sesuai jenis asesmen
    qualitativeInterpretation: string; // Interpretasi hasil asesmen
  };
  qualityCheck: QualityCheck;
}
