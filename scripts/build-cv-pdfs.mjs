import { mdToPdf } from 'md-to-pdf';
import { mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const SOURCES = [
  { md: 'resume.file/canonical/resume.en.md', pdf: 'public/cv-shmakov-en.pdf' },
  { md: 'resume.file/canonical/resume.ua.md', pdf: 'public/cv-shmakov-ua.pdf' },
];

const PDF_CSS = `
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #0f172a;
    line-height: 1.55;
    font-size: 10pt;
    max-width: 760px;
    margin: 0 auto;
    padding: 24pt 28pt;
  }
  h1 {
    font-size: 22pt; font-weight: 800; margin: 0 0 4pt; letter-spacing: -0.02em;
  }
  h1 + p strong { color: #0284c7; font-weight: 700; }
  h2 {
    font-size: 12pt; text-transform: uppercase; letter-spacing: 0.08em;
    color: #0284c7; border-bottom: 1px solid #cbd5e1; padding-bottom: 4pt;
    margin: 18pt 0 8pt;
  }
  h3 {
    font-size: 11pt; margin: 10pt 0 2pt; color: #0f172a;
  }
  p, li { font-size: 10pt; margin: 4pt 0; }
  ul { padding-left: 16pt; margin: 6pt 0 10pt; }
  li { margin-bottom: 3pt; }
  strong { color: #0f172a; font-weight: 700; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 14pt 0; }
  code { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 9pt; color: #0284c7; }
  a { color: #0284c7; text-decoration: none; }
`;

async function generate({ md, pdf }) {
  const mdPath = resolve(root, md);
  const pdfPath = resolve(root, pdf);
  await mkdir(dirname(pdfPath), { recursive: true });

  const out = await mdToPdf(
    { path: mdPath },
    {
      dest: pdfPath,
      css: PDF_CSS,
      pdf_options: {
        format: 'A4',
        margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
        printBackground: true,
      },
    },
  );

  if (!out) throw new Error(`Failed to render ${md}`);
  console.log(`✓ ${pdf}`);
}

for (const src of SOURCES) {
  await generate(src);
}

console.log('\nDone — both CV PDFs regenerated.');
