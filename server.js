const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();

const PORT = process.env.PORT || 8080;

// Parse JSON bodies
app.use(express.json());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Zoho SMTP Configuration
const SMTP_USER = process.env.SMTP_USER || 'web@uniqtechsolutions.com';
const SMTP_PASS = process.env.SMTP_PASS || 'Web@281989#';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.zoho.com';
const SMTP_PORT = process.env.SMTP_PORT || 465;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mikir@uniqtechsolutions.com';

console.log(`[SMTP] Configured: ${SMTP_USER} -> ${ADMIN_EMAIL}`);

// Create Zoho transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT),
  secure: parseInt(SMTP_PORT) === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Email API endpoint
app.post('/api/send-inquiry', async (req, res) => {
  try {
    const inquiry = req.body;
    console.log(`[Email] Processing inquiry from ${inquiry.name} (${inquiry.email})`);

    const mailOptions = {
      from: `"Tiara Sports Club" <${SMTP_USER}>`,
      to: ADMIN_EMAIL,
      replyTo: inquiry.email,
      subject: `[Tiara Club] ${inquiry.facilityName || 'Inquiry'} - ${inquiry.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">TIARA SPORTS CLUB</h1>
            <p style="margin: 5px 0;">New Inquiry Notification</p>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #dc2626;">Inquiry Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Name:</td>
                <td style="padding: 10px;">${inquiry.name || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Email:</td>
                <td style="padding: 10px;"><a href="mailto:${inquiry.email}">${inquiry.email || 'N/A'}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Phone:</td>
                <td style="padding: 10px;"><a href="tel:${inquiry.phone}">${inquiry.phone || 'N/A'}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Facility:</td>
                <td style="padding: 10px;">${inquiry.facilityName || inquiry.category || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Date & Time:</td>
                <td style="padding: 10px;">${inquiry.date || 'N/A'} ${inquiry.timeSlot || ''}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message:</td>
                <td style="padding: 10px;">${inquiry.query || inquiry.message || 'No message'}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: #fff; border-left: 4px solid #dc2626;">
              <strong>Quick Actions:</strong><br>
              <a href="mailto:${inquiry.email}" style="display: inline-block; margin: 10px 5px 0 0; padding: 10px 20px; background: #dc2626; color: white; text-decoration: none; border-radius: 4px;">Reply via Email</a>
              ${inquiry.phone ? `<a href="https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}" style="display: inline-block; margin: 10px 5px 0 0; padding: 10px 20px; background: #25D366; color: white; text-decoration: none; border-radius: 4px;">WhatsApp</a>` : ''}
            </div>
          </div>
          <div style="padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>Tiara Sports Club | Sama-Savli Road, Vadodara, Gujarat</p>
            <p>This email was sent automatically from the website contact form.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] ✅ Sent successfully! MessageID: ${info.messageId}`);

    res.json({
      success: true,
      deliveredViaZoho: true,
      messageId: info.messageId,
      adminEmail: ADMIN_EMAIL,
    });
  } catch (error) {
    console.error(`[Email] ❌ Error:`, error);
    res.json({
      success: true, // Still return success to user
      deliveredViaZoho: false,
      error: error.message,
      note: 'Inquiry received but email delivery failed',
    });
  }
});

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📁 Serving from: ${path.join(__dirname, 'dist')}`);
  console.log(`📧 Email API: POST /api/send-inquiry`);
});
