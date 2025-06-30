import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import PDFDocument from 'pdfkit';
import { createWriteStream, unlinkSync, writeFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({ origin: '*' }));
app.use(express.json());

let latestAssignmentAnswer = '';
let latestAssignmentQuestion = '';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cleanText(text) {
  return text
    .replace(/[*_~`>#]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .replace(/^\d+\.\s*/gm, '• ')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .trim();
}

async function callGroq(prompt) {
  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    }
  );

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices?.[0]?.message?.content || 'No response.';
}

app.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  try {
    const reply = await callGroq(prompt);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Chat failed' });
  }
});

app.post('/assignment', async (req, res) => {
  const { question, revision } = req.body;
  try {
    const input = revision
      ? `Revise this answer with these notes: "${revision}".\n\nAnswer:\n${latestAssignmentAnswer}`
      : question;

    const answer = await callGroq(input);
    latestAssignmentAnswer = answer;
    latestAssignmentQuestion = question;
    res.json({ answer });
  } catch {
    res.status(500).json({ error: 'Assignment failed' });
  }
});

app.post('/generate-pdf', (req, res) => {
  const { name, rollNo, year, question, title } = req.body;
  const assignmentQuestion = question || latestAssignmentQuestion;
  const cleanedAnswer = cleanText(latestAssignmentAnswer);

  if (!cleanedAnswer || !assignmentQuestion) {
    return res.status(400).json({ error: 'Missing answer or question' });
  }

  const doc = new PDFDocument();
  const filename = `assignment-${uuidv4()}.pdf`;
  const filepath = path.join(__dirname, filename);
  const stream = createWriteStream(filepath);
  doc.pipe(stream);

  doc.fontSize(20).text('Assignment Report', { align: 'center' });
  if (title) {
    doc.moveDown().fontSize(16).text(`Title: ${title}`, { align: 'center' });
  }

  doc.moveDown();
  doc.fontSize(14).text(`Name: ${name}`);
  doc.text(`Roll No: ${rollNo}`);
  doc.text(`Academic Year: ${year}`);
  doc.moveDown().fontSize(13).text(`Question:\n${assignmentQuestion}`);
  doc.moveDown().fontSize(12).text(`Answer:`);

  cleanedAnswer.split('\n').forEach((line) => {
    doc.moveDown(0.3).text(line);
  });

  doc.end();

  stream.on('finish', () => {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.sendFile(filepath, () => unlinkSync(filepath));
  });
});

app.post('/generate-docx', async (req, res) => {
  const { name, rollNo, year, question, title } = req.body;
  const assignmentQuestion = question || latestAssignmentQuestion;
  const cleanedAnswer = cleanText(latestAssignmentAnswer);

  if (!cleanedAnswer || !assignmentQuestion) {
    return res.status(400).json({ error: 'Missing answer or question' });
  }

  const children = [
    new Paragraph({
      children: [
        new TextRun({ text: 'Assignment Report', bold: true, size: 36 }),
      ],
      alignment: 'center',
    }),
    ...(title
      ? [
          new Paragraph(''),
          new Paragraph({
            children: [
              new TextRun({ text: `Title: ${title}`, bold: true, size: 28 }),
            ],
            alignment: 'center',
          }),
        ]
      : []),
    new Paragraph(''),
    new Paragraph(`Name: ${name}`),
    new Paragraph(`Roll No: ${rollNo}`),
    new Paragraph(`Academic Year: ${year}`),
    new Paragraph(''),
    new Paragraph({
      children: [new TextRun({ text: 'Question:', bold: true })],
    }),
    ...assignmentQuestion.split('\n').map((q) => new Paragraph(q)),
    new Paragraph(''),
    new Paragraph({ children: [new TextRun({ text: 'Answer:', bold: true })] }),
    ...cleanedAnswer.split('\n').map((line) => new Paragraph(line)),
  ];

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);
  const filename = `assignment-${uuidv4()}.docx`;
  const filepath = path.join(__dirname, filename);
  writeFileSync(filepath, buffer);

  res.download(filepath, filename, (err) => {
    if (err) console.error('DOCX download error:', err);
    fs.unlink(filepath, () => {});
  });
});

app.get('/', (req, res) => {
  res.send('🚀 AcadPilot backend is running!');
});

app.listen(port, () => {
  console.log(`✅ Server ready at http://localhost:${port}`);
});
