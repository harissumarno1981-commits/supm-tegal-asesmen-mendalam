import { AssessmentResult } from '../types/assessment';
import { ExportSectionType, generateDocxBuffer } from './docxBuilder';
import { generatePdfDocument } from './pdfBuilder';
import { generateBackupPromptText } from './promptGenerator';
import { AssessmentFormData } from '../types/assessment';

export async function downloadAssessmentDocx(assessment: AssessmentResult, section: ExportSectionType = 'all') {
  try {
    // Try server-side first
    const response = await fetch('/api/export/docx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessment, section }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = `SUPM_TEGAL_${section}_${assessment.metadata.subject}.docx`;
      if (contentDisposition && contentDisposition.includes('filename=')) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) fileName = match[1];
      }
      triggerBlobDownload(blob, fileName);
      return;
    }
  } catch (err) {
    console.warn('Server docx export failed, using client-side fallback:', err);
  }

  // Client-side fallback
  const buffer = await generateDocxBuffer(assessment, section);
  const blob = new Blob([buffer as any], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  triggerBlobDownload(blob, `SUPM_TEGAL_${section}_${assessment.metadata.subject}.docx`);
}

export async function downloadAssessmentPdf(assessment: AssessmentResult, section: ExportSectionType = 'all') {
  try {
    // Try server-side first
    const response = await fetch('/api/export/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessment, section }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = `SUPM_TEGAL_${section}_${assessment.metadata.subject}.pdf`;
      if (contentDisposition && contentDisposition.includes('filename=')) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) fileName = match[1];
      }
      triggerBlobDownload(blob, fileName);
      return;
    }
  } catch (err) {
    console.warn('Server pdf export failed, using client-side fallback:', err);
  }

  // Client-side fallback
  const doc = generatePdfDocument(assessment, section);
  doc.save(`SUPM_TEGAL_${section}_${assessment.metadata.subject}.pdf`);
}

export function downloadPromptTxt(formData: AssessmentFormData) {
  const promptContent = generateBackupPromptText(formData);
  const blob = new Blob([promptContent], { type: 'text/plain;charset=utf-8' });
  const fileName = `PROMPT_CADANGAN_ASESMEN_SUPM_TEGAL_${formData.department}_${formData.subject || 'Mapel'}.txt`;
  triggerBlobDownload(blob, fileName);
}

export function triggerBlobDownload(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 300);
}
