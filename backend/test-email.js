require('dotenv').config();
const nodemailer = require('nodemailer');

async function runTest() {
  console.log('🧪 Starting Brevo SMTP Diagnostics...');
  console.log('----------------------------------------');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL || process.env.ADMIN_EMAIL);
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
  console.log('EMAIL_PASS Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
  console.log('----------------------------------------');

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true, // Enable debug logs in console
    logger: true // Enable SMTP handshake logging
  });

  try {
    console.log('🔌 Connecting to Brevo SMTP...');
    await transporter.verify();
    console.log('✅ Connection verification successful!');

    console.log('📧 Sending diagnostics email...');
    const info = await transporter.sendMail({
      from: `"ShipGod Diagnostics" <${process.env.SENDER_EMAIL || process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: '🧪 ShipGod SMTP Test Email',
      text: 'If you are reading this, your Brevo SMTP is fully working!',
      html: '<h3>✅ Brevo SMTP Connection Working!</h3><p>Your ShipGod performance optimization and transactional email relay is fully configured and ready for production.</p>'
    });

    console.log('🎉 Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Envelope:', info.envelope);
  } catch (err) {
    console.error('❌ Diagnostics failed with error:');
    console.error(err);
  }
}

runTest();
