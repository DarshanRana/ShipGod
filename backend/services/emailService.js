const sendEmail = async ({ toEmail, toName, subject, html }) => {
  const apiKey = process.env.EMAIL_PASS;
  const isPlaceholder = !apiKey || apiKey === 'your_gmail_app_password_here';

  if (isPlaceholder) {
    // Local Dev Fallback: Ethereal test SMTP account (not blocked on localhost)
    const nodemailer = require('nodemailer');
    console.log('\n📬 [SMTP CONFIG] Placeholder credentials detected. Generating automatic Ethereal test SMTP account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      const info = await transporter.sendMail({
        from: `"ShipGod Sandbox" <no-reply@shipgod.in>`,
        to: toEmail,
        subject,
        html,
      });
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`\n✉️   [SMTP Sandbox] Outgoing email captured!`);
        console.log(`👉  Click here to view fully-rendered HTML email: ${previewUrl}\n`);
      }
    } catch (err) {
      console.error('❌ Ethereal SMTP sandbox failed:', err.message);
    }
    return;
  }

  // Production: Use Brevo HTTP REST API (unblocked by Render firewall!)
  const senderEmail = process.env.SENDER_EMAIL || process.env.ADMIN_EMAIL || 'no-reply@shipgod.in';

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'ShipGod',
        email: senderEmail,
      },
      to: [
        {
          email: toEmail,
          name: toName || toEmail,
        }
      ],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Brevo HTTP API Error: ${response.status} - ${errText}`);
  }

  console.log(`📧 Email sent successfully via Brevo HTTP API to ${toEmail}`);
};

// Email to admin when a new bulk order comes in
const sendAdminAlert = async (order) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #002f56; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">🚚 New Bulk Order Request</h1>
        <p style="color: #a0c4e8; margin: 4px 0 0;">ShipGod — Heavy Machinery Transport</p>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        
        <h3 style="color: #002f56; margin-top: 0;">👤 Customer Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #64748b; width: 140px;">Name</td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${order.name}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Email</td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${order.email}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Phone</td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${order.phone}</td></tr>
          ${order.company ? `<tr><td style="padding: 6px 0; color: #64748b;">Company</td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${order.company}</td></tr>` : ''}
        </table>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

        <h3 style="color: #002f56;">📦 Shipment Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #64748b; width: 140px;">From</td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${order.fromCity}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">To</td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${order.toCity}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Equipment</td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${order.equipmentType}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Weight</td><td style="padding: 6px 0; font-weight: bold; color: #e53e3e;">${order.weightTons} Tons</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Timeline</td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${order.timeline}</td></tr>
        </table>

        ${order.notes ? `
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <h3 style="color: #002f56;">📝 Additional Notes</h3>
        <p style="color: #475569; background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">${order.notes}</p>
        ` : ''}

        <div style="margin-top: 24px; background: #0fa14a; padding: 12px 20px; border-radius: 8px; text-align: center;">
          <p style="color: white; margin: 0; font-weight: bold;">⚡ Action Required: Contact this customer within 24 hours</p>
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    toEmail: process.env.ADMIN_EMAIL,
    toName: 'ShipGod Admin',
    subject: `🚚 New Bulk Order — ${order.weightTons} Tons | ${order.fromCity} → ${order.toCity}`,
    html,
  });
};

// Confirmation email to customer
const sendCustomerConfirmation = async (order) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #002f56; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">✅ Request Received!</h1>
        <p style="color: #a0c4e8; margin: 4px 0 0;">ShipGod — Heavy Machinery Transport</p>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="color: #0f172a; font-size: 16px;">Hi <strong>${order.name}</strong>,</p>
        <p style="color: #475569;">Thank you for reaching out to ShipGod! We've received your bulk shipment request for <strong>${order.weightTons} tons</strong> from <strong>${order.fromCity}</strong> to <strong>${order.toCity}</strong>.</p>
        <p style="color: #475569;">Our expert logistics team will review your requirements and personally contact you within <strong>24 hours</strong> to discuss the best transport solution.</p>
        
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="color: #64748b; font-size: 13px; margin: 0 0 8px;">Your request summary:</p>
          <p style="margin: 4px 0; color: #0f172a;"><strong>Route:</strong> ${order.fromCity} → ${order.toCity}</p>
          <p style="margin: 4px 0; color: #0f172a;"><strong>Equipment:</strong> ${order.equipmentType}</p>
          <p style="margin: 4px 0; color: #0f172a;"><strong>Weight:</strong> ${order.weightTons} Tons</p>
          <p style="margin: 4px 0; color: #0f172a;"><strong>Timeline:</strong> ${order.timeline}</p>
        </div>

        <p style="color: #475569;">For urgent queries, you can also reach us at <strong>+91 1800-SHIPGOD</strong>.</p>
        <p style="color: #475569;">— The ShipGod Team</p>
      </div>
    </div>
  `;

  await sendEmail({
    toEmail: order.email,
    toName: order.name,
    subject: `✅ Bulk Shipment Request Received — ShipGod`,
    html,
  });
};

// Password reset email to user
const sendPasswordResetEmail = async (userEmail, userName, otpCode) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #002f56; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">🔒 One-Time Password (OTP)</h1>
        <p style="color: #a0c4e8; margin: 4px 0 0;">ShipGod — Heavy Machinery Transport</p>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="color: #0f172a; font-size: 16px;">Hi <strong>${userName}</strong>,</p>
        <p style="color: #475569;">We received a request to reset your password. Use the following One-Time Password (OTP) to complete the reset process:</p>
        
        <div style="text-align: center; margin: 32px 0;">
          <div style="background: #002f56; color: white; display: inline-block; padding: 18px 48px; border-radius: 12px; font-weight: 800; font-size: 36px; letter-spacing: 6px; border: 2px solid #0fa14a; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
            ${otpCode}
          </div>
        </div>

        <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 16px;">⏰ This code is valid for <strong>10 minutes</strong> and can only be used once.</p>
        <p style="color: #94a3b8; font-size: 13px; text-align: center;">If you didn't request this, you can safely ignore this email. Your password will remain secure.</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #475569;">— The ShipGod Team</p>
      </div>
    </div>
  `;

  await sendEmail({
    toEmail: userEmail,
    toName: userName,
    subject: `🔒 Reset Your Password — OTP: ${otpCode} — ShipGod`,
    html,
  });
};

// Password reset success confirmation email to user
const sendPasswordResetSuccessEmail = async (userEmail, userName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #002f56; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">🔒 Password Changed Successfully</h1>
        <p style="color: #a0c4e8; margin: 4px 0 0;">ShipGod — Heavy Machinery Transport</p>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="color: #0f172a; font-size: 16px;">Hi <strong>${userName}</strong>,</p>
        <p style="color: #475569;">This is a confirmation that the password for your ShipGod account (<strong>${userEmail}</strong>) was successfully reset.</p>
        
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; border-left: 4px solid #0fa14a;">
          <p style="margin: 0; color: #0fa14a; font-weight: bold;">⚡ If this was you:</p>
          <p style="margin: 4px 0 0; color: #475569; font-size: 14px;">You can safely ignore this email. Your new password is now active, and you can sign in to your account.</p>
        </div>

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; border-left: 4px solid #e53e3e;">
          <p style="margin: 0; color: #e53e3e; font-weight: bold;">⚠️ If this was NOT you:</p>
          <p style="margin: 4px 0 0; color: #475569; font-size: 14px;">Please contact our support team immediately or request a password reset using your email on the sign-in page to secure your account.</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #475569;">— The ShipGod Team</p>
      </div>
    </div>
  `;

  await sendEmail({
    toEmail: userEmail,
    toName: userName,
    subject: `🔒 Security Alert: Your Password Was Reset — ShipGod`,
    html,
  });
};

module.exports = {
  sendAdminAlert,
  sendCustomerConfirmation,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
};
