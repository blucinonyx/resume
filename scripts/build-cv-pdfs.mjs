import { mdToPdf } from 'md-to-pdf';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Profile photo lives in `resume.file/` (gitignored). Embed it as a base64
// data-URI so Puppeteer doesn't need `file://` access from inside the PDF
// render. The placeholder line in each canonical .md is swapped for the
// <img> at runtime — canonical files stay text-only.
const PHOTO_PATH = resolve(root, 'resume.file/profile-photo.jpeg');
const photoBuffer = await readFile(PHOTO_PATH);
const PHOTO_DATA_URI = `data:image/jpeg;base64,${photoBuffer.toString('base64')}`;
// Marker comment in canonical/.md that gets swapped for the <img> here
// at runtime — keeps the source files free of bulky base64 or stale placeholder copy.
const PHOTO_PLACEHOLDER_RE = /<!--\s*@cv-photo\s*-->/;

const SOURCES = [
  { md: 'resume.file/canonical/resume.en.md', pdf: 'public/cv-shmakov-en.pdf', alt: 'Olexander Shmakov' },
  { md: 'resume.file/canonical/resume.ua.md', pdf: 'public/cv-shmakov-ua.pdf', alt: 'Олександр Шмаков' },
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
  .cv-photo {
    float: right;
    width: 96pt;
    height: 96pt;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 0 8pt 16pt;
    border: 2pt solid #0284c7;
    shape-outside: circle();
  }
`;

async function generate({ md, pdf, alt }) {
  const mdPath = resolve(root, md);
  const pdfPath = resolve(root, pdf);
  await mkdir(dirname(pdfPath), { recursive: true });

  const rawMd = await readFile(mdPath, 'utf-8');
  const photoTag = `<img class="cv-photo" src="${PHOTO_DATA_URI}" alt="${alt}" />`;
  const content = rawMd.replace(PHOTO_PLACEHOLDER_RE, photoTag);

  const out = await mdToPdf(
    { content },
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
