const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

// Load environment variables with error handling
try {
  require('dotenv').config();
} catch (err) {
  console.log('Warning: dotenv not loaded:', err.message);
}

const app = express();
const PORT = process.env.PORT || 8080;

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ADMIN EMAIL - All inquiries go here
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'harshill.barot@gmail.com';
const SMTP_USER = process.env.SMTP_USER || 'web@uniqtechsolutions.com';
const SMTP_PASS = process.env.SMTP_PASS || 'Web@281989#';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.zoho.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');

// Zoho SMTP Configuration with error handling
let transporter;
try {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  console.log('[Email] SMTP configured successfully');
} catch (err) {
  console.error('[Email] SMTP configuration failed:', err.message);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    adminEmail: ADMIN_EMAIL,
    timestamp: new Date().toISOString()
  });
});

// Send inquiry email
app.post('/api/send-inquiry', async (req, res) => {
  try {
    const inquiry = req.body;
    
    const mailOptions = {
      from: '"Tiara Sports Club" <web@uniqtechsolutions.com>',
      to: ADMIN_EMAIL,
      replyTo: inquiry.email,
      subject: `[Tiara Sports] ${inquiry.category || 'New Inquiry'} - ${inquiry.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tiara Sports Inquiry</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
            <tr>
              <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <!-- Header with Red Background -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
                        🏆 TIARA SPORTS CLUB
                      </h1>
                      <p style="color: #fca5a5; margin: 10px 0 0 0; font-size: 13px; letter-spacing: 0.5px;">
                        Besides Red Coral Greens, Opposite Nayara Petrol Pump<br>Sama-Savli Road, Vadodara, Gujarat
                      </p>
                      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; font-weight: bold; letter-spacing: 1px;">
                        New Inquiry Received
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Inquiry ID Badge -->
                  <tr>
                    <td style="padding: 20px 30px 0 30px;">
                      <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 12px 16px; border-radius: 4px;">
                        <p style="margin: 0; color: #991b1b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                          Reference ID
                        </p>
                        <p style="margin: 5px 0 0 0; color: #dc2626; font-size: 18px; font-weight: bold;">
                          ${inquiry.inquiryId || 'N/A'}
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Customer Information -->
                  <tr>
                    <td style="padding: 30px 30px 20px 30px;">
                      <h2 style="color: #dc2626; margin: 0 0 20px 0; font-size: 20px; font-weight: bold; border-bottom: 2px solid #fca5a5; padding-bottom: 10px;">
                        👤 Customer Information
                      </h2>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">
                            <table width="100%">
                              <tr>
                                <td width="120" style="color: #6b7280; font-size: 14px; font-weight: 600;">Name:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 500;">${inquiry.name}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">
                            <table width="100%">
                              <tr>
                                <td width="120" style="color: #6b7280; font-size: 14px; font-weight: 600;">Email:</td>
                                <td style="color: #dc2626; font-size: 14px; font-weight: 500;">
                                  <a href="mailto:${inquiry.email}" style="color: #dc2626; text-decoration: none;">${inquiry.email}</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">
                            <table width="100%">
                              <tr>
                                <td width="120" style="color: #6b7280; font-size: 14px; font-weight: 600;">Phone:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 500;">
                                  <a href="tel:${inquiry.phone}" style="color: #1f2937; text-decoration: none;">${inquiry.phone}</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Booking Details -->
                  ${inquiry.facilityName || inquiry.date || inquiry.timeSlot ? `
                  <tr>
                    <td style="padding: 20px 30px;">
                      <h2 style="color: #dc2626; margin: 0 0 20px 0; font-size: 20px; font-weight: bold; border-bottom: 2px solid #fca5a5; padding-bottom: 10px;">
                        🏟️ Booking Details
                      </h2>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        ${inquiry.facilityName ? `
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">
                            <table width="100%">
                              <tr>
                                <td width="120" style="color: #6b7280; font-size: 14px; font-weight: 600;">Facility:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 500;">${inquiry.facilityName}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        ` : ''}
                        ${inquiry.date ? `
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">
                            <table width="100%">
                              <tr>
                                <td width="120" style="color: #6b7280; font-size: 14px; font-weight: 600;">Date:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 500;">${inquiry.date}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        ` : ''}
                        ${inquiry.timeSlot ? `
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">
                            <table width="100%">
                              <tr>
                                <td width="120" style="color: #6b7280; font-size: 14px; font-weight: 600;">Time Slot:</td>
                                <td style="color: #1f2937; font-size: 14px; font-weight: 500;">${inquiry.timeSlot}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        ` : ''}
                      </table>
                    </td>
                  </tr>
                  ` : ''}
                  
                  <!-- Message -->
                  ${inquiry.message || inquiry.query ? `
                  <tr>
                    <td style="padding: 20px 30px;">
                      <h2 style="color: #dc2626; margin: 0 0 20px 0; font-size: 20px; font-weight: bold; border-bottom: 2px solid #fca5a5; padding-bottom: 10px;">
                        💬 Message
                      </h2>
                      <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px; border-left: 4px solid #dc2626;">
                        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">
${inquiry.message || inquiry.query}
                        </p>
                      </div>
                    </td>
                  </tr>
                  ` : ''}
                  
                  <!-- Action Button -->
                  <tr>
                    <td style="padding: 30px; text-align: center;">
                      <a href="mailto:${inquiry.email}?subject=Re: Your Inquiry at Tiara Sports Club" 
                         style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-weight: bold; font-size: 16px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);">
                        📧 Reply to Customer
                      </a>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 3px solid #dc2626;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <h3 style="color: #1f2937; font-size: 18px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
                              TIARA SPORTS CLUB
                            </h3>
                            <p style="color: #374151; font-size: 14px; line-height: 1.8; margin: 0 0 15px 0; font-weight: 500;">
                              📍 Besides Red Coral Greens, Opposite Nayara Petrol Pump<br>
                              Sama-Savli Road, Vadodara, Gujarat, India
                            </p>
                            <p style="color: #1f2937; font-size: 14px; line-height: 1.8; margin: 0 0 15px 0;">
                              📞 <strong>Phone:</strong> <a href="tel:+912652988900" style="color: #dc2626; text-decoration: none; font-weight: 600;">+91 (0265) 298-8900</a><br>
                              📱 <strong>Mobile:</strong> <a href="tel:+919825088900" style="color: #dc2626; text-decoration: none; font-weight: 600;">+91 98250 88900</a><br>
                              ✉️ <strong>Email:</strong> <a href="mailto:${ADMIN_EMAIL}" style="color: #dc2626; text-decoration: none; font-weight: 600;">${ADMIN_EMAIL}</a>
                            </p>
                            <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 15px;">
                              <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.6;">
                                🕐 <strong>Timings:</strong> Monday – Sunday: 06:00 AM – 11:00 PM
                              </p>
                              <p style="color: #9ca3af; font-size: 11px; margin: 10px 0 0 0;">
                                This email was automatically sent from Tiara Sports Club website inquiry form
                              </p>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: 'Email sent to ' + ADMIN_EMAIL
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Serve static files from root directory (production build files are copied here)
app.use(express.static(__dirname));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Catch-all route for React Router (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Listen on the port provided by IISNode (SmarterASP.NET requirement)
app.listen(PORT, () => {
  console.log(`[Tiara Sports] Server running on port ${PORT}`);
  console.log(`[Tiara Sports] Admin email: ${ADMIN_EMAIL}`);
  console.log(`[Tiara Sports] Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`[Tiara Sports] Static files served from: ${__dirname}`);
}).on('error', (err) => {
  console.error('[Server Error]', err);
  process.exit(1);
});
