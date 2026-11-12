import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let lastY: number | null = null;
      let pageStr = '';

      for (const item of textContent.items) {
        if ('str' in item) {
          // If Y position changed significantly, treat as new line
          const currentY = item.transform ? item.transform[5] : null;
          if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
            pageStr += '\n';
          } else if (pageStr.length > 0 && !pageStr.endsWith(' ') && !pageStr.endsWith('\n')) {
            pageStr += ' ';
          }
          pageStr += item.str;
          lastY = currentY;
        }
      }

      pageTexts.push(pageStr.trim());
    }

    const fullText = pageTexts.join('\n\n').trim();
    if (fullText.length > 20) {
      return fullText;
    }
  } catch (err) {
    console.warn('pdfjs-dist extraction failed, falling back to stream parsing:', err);
  }

  // Fallback: in case worker or corrupted text stream, try simple text extraction
  return extractTextFallback(file);
}

async function extractTextFallback(file: File): Promise<string> {
  const text = await file.text();
  // Filter out PDF stream syntax and extract readable strings inside parentheses or brackets
  const matches = text.match(/\(([^()]+)\)/g);
  if (matches && matches.length > 10) {
    const extracted = matches
      .map((m) => m.slice(1, -1))
      .filter((s) => s.length > 2 && !s.startsWith('\\') && /[a-zA-Z]/.test(s))
      .join(' ');
    if (extracted.length > 50) return extracted;
  }
  return text;
}
