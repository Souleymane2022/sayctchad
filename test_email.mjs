import { readFileSync } from 'fs';
import nodemailer from 'nodemailer';

// Load .env manually
const envContent = readFileSync('.env', 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^=]+)="?([^"]*)"?/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const SMTP_USER = env.SMTP_USER || 'sayctchad@gmail.com';
const SMTP_PASS = env.SMTP_PASS;

console.log('SMTP_USER:', SMTP_USER);
console.log('SMTP_PASS found:', !!SMTP_PASS);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  tls: { rejectUnauthorized: false },
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

console.log('Vérification de la connexion SMTP...');
try {
  await transporter.verify();
  console.log('✅ Connexion SMTP OK !');

  console.log('Envoi email test...');
  const info = await transporter.sendMail({
    from: `"Test SAYC" <${SMTP_USER}>`,
    to: SMTP_USER,
    subject: '✅ Test Email SAYC Tchad - Diagnostic',
    text: 'Si vous recevez cet email, le système de messagerie fonctionne correctement.',
    html: '<h2>✅ Test Email SAYC Tchad</h2><p>Si vous recevez cet email, le système de messagerie fonctionne correctement.</p>',
  });
  console.log('✅ Email envoyé ! ID:', info.messageId);
} catch (error) {
  console.error('❌ Erreur SMTP:', error.message);
  console.error('Code erreur:', error.code);
}
