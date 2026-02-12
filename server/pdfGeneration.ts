import puppeteer from "puppeteer";
import { marked } from "marked";
import { storagePut } from "./storage";
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";

const IMOTION_LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="; // Placeholder

interface PDFOptions {
  title: string;
  author?: string;
  subject?: string;
  keywords?: string;
}

/**
 * Convert Markdown to styled HTML with IMOTION branding
 */
export async function markdownToHTML(markdown: string, options: PDFOptions): Promise<string> {
  // Configure marked for better rendering
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true,
  });

  const htmlContent = await marked(markdown);

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title}</title>
  <style>
    @page {
      size: A4;
      margin: 25mm 20mm;
      @top-center {
        content: "${options.title}";
        font-size: 10px;
        color: #666;
      }
      @bottom-right {
        content: "Page " counter(page) " sur " counter(pages);
        font-size: 10px;
        color: #666;
      }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.8;
      color: #1f2937;
      font-size: 11pt;
      background: white;
    }

    /* Cover Page */
    .cover-page {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      text-align: center;
      page-break-after: always;
      background: linear-gradient(135deg, #d8232a 0%, #ff4d54 100%);
      color: white;
      padding: 60px 40px;
    }

    .cover-logo {
      width: 200px;
      height: auto;
      margin-bottom: 40px;
      filter: brightness(0) invert(1);
    }

    .cover-title {
      font-size: 42pt;
      font-weight: 800;
      margin-bottom: 20px;
      text-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    }

    .cover-subtitle {
      font-size: 18pt;
      font-weight: 300;
      margin-bottom: 60px;
      opacity: 0.95;
    }

    .cover-info {
      margin-top: auto;
      font-size: 11pt;
      opacity: 0.9;
    }

    .cover-info p {
      margin: 8px 0;
    }

    /* Typography */
    h1 {
      font-size: 28pt;
      font-weight: 800;
      color: #d8232a;
      margin: 40px 0 20px 0;
      padding-bottom: 12px;
      border-bottom: 4px solid #d8232a;
      page-break-after: avoid;
    }

    h2 {
      font-size: 20pt;
      font-weight: 700;
      color: #d8232a;
      margin: 32px 0 16px 0;
      page-break-after: avoid;
    }

    h3 {
      font-size: 16pt;
      font-weight: 600;
      color: #fb923c;
      margin: 24px 0 12px 0;
      page-break-after: avoid;
    }

    h4 {
      font-size: 13pt;
      font-weight: 600;
      color: #374151;
      margin: 20px 0 10px 0;
      page-break-after: avoid;
    }

    p {
      margin: 12px 0;
      text-align: justify;
      orphans: 3;
      widows: 3;
    }

    /* Lists */
    ul, ol {
      margin: 16px 0;
      padding-left: 30px;
    }

    li {
      margin: 8px 0;
      line-height: 1.6;
    }

    ul li {
      list-style-type: none;
      position: relative;
      padding-left: 20px;
    }

    ul li::before {
      content: "▸";
      position: absolute;
      left: 0;
      color: #d8232a;
      font-weight: bold;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }

    thead {
      background: linear-gradient(135deg, #d8232a 0%, #ff4d54 100%);
      color: white;
    }

    th {
      padding: 14px 12px;
      text-align: left;
      font-weight: 600;
      border: none;
    }

    td {
      padding: 12px;
      border: 1px solid #e5e7eb;
    }

    tbody tr:nth-child(even) {
      background-color: #fef2f2;
    }

    tbody tr:hover {
      background-color: #fee2e2;
    }

    /* Code blocks */
    code {
      background-color: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 10pt;
      color: #d8232a;
    }

    pre {
      background-color: #1f2937;
      color: #f9fafb;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 20px 0;
      page-break-inside: avoid;
    }

    pre code {
      background: none;
      color: inherit;
      padding: 0;
    }

    /* Blockquotes */
    blockquote {
      border-left: 4px solid #d8232a;
      padding-left: 20px;
      margin: 20px 0;
      font-style: italic;
      color: #4b5563;
      background-color: #fef2f2;
      padding: 16px 20px;
      border-radius: 0 8px 8px 0;
    }

    /* Horizontal rules */
    hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 32px 0;
    }

    /* Links */
    a {
      color: #d8232a;
      text-decoration: none;
      border-bottom: 1px solid #d8232a;
    }

    a:hover {
      color: #b01d23;
    }

    /* Strong and emphasis */
    strong {
      font-weight: 700;
      color: #d8232a;
    }

    em {
      font-style: italic;
      color: #6b7280;
    }

    /* Page breaks */
    .page-break {
      page-break-after: always;
    }

    /* Callout boxes */
    .callout {
      background-color: #fef2f2;
      border-left: 4px solid #d8232a;
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
      page-break-inside: avoid;
    }

    .callout-warning {
      background-color: #fffbeb;
      border-left-color: #f59e0b;
    }

    .callout-info {
      background-color: #eff6ff;
      border-left-color: #3b82f6;
    }

    .callout-success {
      background-color: #f0fdf4;
      border-left-color: #10b981;
    }

    /* Footer */
    .document-footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 9pt;
      color: #6b7280;
    }

    .document-footer strong {
      color: #d8232a;
    }

    /* Print optimization */
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="cover-page">
    <div class="cover-title">${options.title}</div>
    <div class="cover-subtitle">${options.subject || 'Document généré par IMOTION Discovery Pro'}</div>
    <div class="cover-info">
      <p><strong>IMOTION Conseil</strong></p>
      <p>Solutions IA & No-Code</p>
      <p>📧 contact@imotion-conseil.fr</p>
      <p>🌐 www.imotion-conseil.fr</p>
      <p style="margin-top: 20px;">Date de génération: ${new Date().toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</p>
    </div>
  </div>

  <div class="content">
    ${htmlContent}
  </div>

  <div class="document-footer">
    <p><strong>Document confidentiel</strong> - Propriété de IMOTION Conseil</p>
    <p>Ce document a été généré automatiquement par <strong>IMOTION Discovery Pro</strong></p>
    <p>Pour toute question, contactez-nous à contact@imotion-conseil.fr</p>
  </div>
</body>
</html>
  `;
}

/**
 * Convert HTML to PDF using Puppeteer
 */
export async function htmlToPDF(html: string): Promise<Buffer> {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '25mm',
        right: '20mm',
        bottom: '25mm',
        left: '20mm',
      },
      displayHeaderFooter: false,
    });

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('[PDFGeneration] Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Generate PDF from Markdown and upload to S3
 */
export async function generatePDFFromMarkdown(
  markdown: string,
  options: PDFOptions,
  projectId: number,
  filename: string
): Promise<string> {
  // Convert Markdown to HTML
  const html = await markdownToHTML(markdown, options);

  // Convert HTML to PDF
  const pdfBuffer = await htmlToPDF(html);

  // Upload to S3
  const randomSuffix = randomBytes(8).toString('hex');
  const fileKey = `projects/${projectId}/documents/${filename}-${randomSuffix}.pdf`;
  
  const { url } = await storagePut(fileKey, pdfBuffer, 'application/pdf');
  
  return url;
}

/**
 * Generate Word document from Markdown (simplified version)
 * In production, use a library like docx or mammoth
 */
export async function generateWordFromMarkdown(
  markdown: string,
  options: PDFOptions,
  projectId: number,
  filename: string
): Promise<string> {
  // For now, we'll generate HTML and save it as .doc (which Word can open)
  // In production, use the docx library for proper .docx generation
  const html = await markdownToHTML(markdown, options);

  const buffer = Buffer.from(html, 'utf-8');
  const randomSuffix = randomBytes(8).toString('hex');
  const fileKey = `projects/${projectId}/documents/${filename}-${randomSuffix}.doc`;
  
  const { url } = await storagePut(fileKey, buffer, 'application/msword');
  
  return url;
}
