import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Zoho SMTP Credentials & Configuration for SmarterASP.NET
  const SMTP_USER = process.env.SMTP_USER || 'web@uniqtechsolutions.com';
  const SMTP_PASS = process.env.SMTP_PASS || 'Web@281989#';
  const SMTP_HOST = process.env.SMTP_HOST || 'smtp.zoho.com';
  const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'harshill.barot@gmail.com';

  console.log(`[SMTP Config] Initialized Zoho SMTP for sender: ${SMTP_USER} -> Recipient: ${ADMIN_EMAIL}`);

  // Create primary Zoho SSL Transporter (Port 465) - SmarterASP.NET Compatible
  const zohoTransporterSSL = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // SSL on 465
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Required for SmarterASP.NET
      minVersion: 'TLSv1.2',
    },
    connectionTimeout: 20000,
    greetingTimeout: 15000,
    logger: console,
    debug: false,
  });

  // Create fallback Zoho TLS Transporter (Port 587) - SmarterASP.NET Fallback
  const zohoTransporterTLS = nodemailer.createTransport({
    host: SMTP_HOST,
    port: 587,
    secure: false, // TLS
    requireTLS: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Required for SmarterASP.NET
      minVersion: 'TLSv1.2',
    },
    connectionTimeout: 20000,
    greetingTimeout: 15000,
    logger: console,
    debug: false,
  });

  // API endpoint for automatic background inquiry dispatch via Zoho SMTP
  app.post('/api/send-inquiry', async (req, res) => {
    const inquiry = req.body;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tiara Sports Club Inquiry</title>
      </head>
      <body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f1f5f9; table-layout: fixed;">
          <tr>
            <td align="center" style="padding: 12px 0;">
              <!-- Main Card Container (Red & White) -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 620px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
                
                <!-- Red Header Banner -->
                <tr>
                  <td style="background-color: #dc2626; padding: 28px 24px; text-align: center;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="center">
                          <h1 style="margin: 0; color: #ffffff !important; font-size: 22px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            TIARA SPORTS CLUB
                          </h1>
                          <p style="margin: 6px 0 0 0; color: #fee2e2 !important; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600;">
                            Sama-Savli Road · Vadodara, Gujarat
                          </p>
                          <div style="margin-top: 10px; display: inline-block; background-color: rgba(255,255,255,0.2); padding: 4px 14px; border-radius: 20px; color: #ffffff !important; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;">
                            NEW ONLINE INQUIRY NOTIFICATION
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Email Content Body (White Background) -->
                <tr>
                  <td style="padding: 28px 24px; background-color: #ffffff;">
                    
                    <!-- Meta Reference & Time Bar (Table Based, No Flexbox) -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">
                      <tr>
                        <td align="left" style="vertical-align: middle;">
                          <span style="background-color: #fee2e2; color: #dc2626 !important; padding: 5px 12px; border-radius: 4px; font-family: monospace; font-size: 12px; font-weight: 700; border: 1px solid #fca5a5; display: inline-block;">
                            REF: ${inquiry.inquiryId || 'TIARA-INQ'}
                          </span>
                        </td>
                        <td align="right" style="vertical-align: middle; font-size: 12px; color: #64748b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          Submitted: <strong style="color: #334155;">${inquiry.submittedAt || new Date().toLocaleTimeString()}</strong>
                        </td>
                      </tr>
                    </table>

                    <!-- Main Inquiry Details Table -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; margin-bottom: 24px;">
                      
                      <!-- Sport / Facility -->
                      <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td width="150" style="padding: 12px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; vertical-align: top;">
                          SPORT / FACILITY:
                        </td>
                        <td style="padding: 12px 8px; font-size: 15px; font-weight: 800; color: #dc2626; vertical-align: top;">
                          ${inquiry.facilityName || inquiry.category || 'General Sports Inquiry'}
                        </td>
                      </tr>

                      <!-- Date & Time Slot -->
                      <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 12px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; vertical-align: top;">
                          DATE & TIME SLOT:
                        </td>
                        <td style="padding: 12px 8px; font-size: 14px; font-weight: 700; color: #0f172a; vertical-align: top;">
                          ${inquiry.date || 'Today'} · ${inquiry.timeSlot || 'General Hours'}
                        </td>
                      </tr>

                      <!-- Inquirer Name -->
                      <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 12px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; vertical-align: top;">
                          INQUIRER NAME:
                        </td>
                        <td style="padding: 12px 8px; font-size: 14px; font-weight: 700; color: #0f172a; vertical-align: top;">
                          ${inquiry.name || 'Member Guest'}
                        </td>
                      </tr>

                      <!-- Email Address -->
                      <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 12px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; vertical-align: top;">
                          EMAIL ADDRESS:
                        </td>
                        <td style="padding: 12px 8px; font-size: 14px; font-weight: 600; vertical-align: top;">
                          <a href="mailto:${inquiry.email}" style="color: #dc2626 !important; text-decoration: none; font-weight: 600;">
                            ${inquiry.email}
                          </a>
                        </td>
                      </tr>

                      <!-- Phone / WhatsApp -->
                      <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 12px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; vertical-align: top;">
                          PHONE / WHATSAPP:
                        </td>
                        <td style="padding: 12px 8px; font-size: 14px; font-weight: 700; color: #0f172a; vertical-align: top;">
                          <a href="tel:${inquiry.phone}" style="color: #0f172a !important; text-decoration: none; font-weight: 700;">
                            ${inquiry.phone}
                          </a>
                        </td>
                      </tr>

                      <!-- Category -->
                      <tr>
                        <td style="padding: 12px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; vertical-align: top;">
                          INQUIRY CATEGORY:
                        </td>
                        <td style="padding: 12px 8px; font-size: 13px; font-weight: 600; color: #475569; vertical-align: top;">
                          ${inquiry.category || 'Slot Availability & Booking'}
                        </td>
                      </tr>
                    </table>

                    <!-- Client Written Query Box (Clean Red Accent & Soft Warm Tint) -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #fff1f2; border: 1px solid #fecdd3; border-left: 4px solid #dc2626; border-radius: 4px; margin-bottom: 26px;">
                      <tr>
                        <td style="padding: 16px;">
                          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #991b1b; letter-spacing: 0.5px; margin-bottom: 6px;">
                            INQUIRY DETAILS / USER MESSAGE:
                          </div>
                          <div style="font-size: 14px; color: #1e293b; line-height: 1.6; font-style: italic;">
                            "${inquiry.query || inquiry.message || 'No additional message provided.'}"
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- ACTION BUTTONS: BULLETPROOF TABLE LAYOUT (NO OVERLAPS, STRICT WHITE TEXT) -->
                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 10px auto;">
                      <tr>
                        <!-- Reply via Email Button -->
                        <td align="center" style="padding: 6px 8px;">
                          <a href="mailto:${inquiry.email}?subject=RE: Tiara Sports Club Inquiry [${inquiry.inquiryId || ''}]"
                             target="_blank"
                             style="background-color: #dc2626; color: #ffffff !important; text-decoration: none !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: bold; padding: 13px 26px; border-radius: 4px; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #b91c1c; text-align: center;">
                            <span style="color: #ffffff !important; text-decoration: none !important; font-weight: bold; font-size: 13px; letter-spacing: 0.5px;">
                              REPLY TO USER
                            </span>
                          </a>
                        </td>

                        ${inquiry.phone ? `
                        <!-- WhatsApp Chat Button -->
                        <td align="center" style="padding: 6px 8px;">
                          <a href="https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inquiry.name || '')}%2C%20greetings%20from%20Tiara%20Sports%20Club%20Vadodara.%20Regarding%20your%20inquiry%20%5B${inquiry.inquiryId || ''}%5D"
                             target="_blank"
                             style="background-color: #16a34a; color: #ffffff !important; text-decoration: none !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: bold; padding: 13px 26px; border-radius: 4px; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #15803d; text-align: center;">
                            <span style="color: #ffffff !important; text-decoration: none !important; font-weight: bold; font-size: 13px; letter-spacing: 0.5px;">
                              WHATSAPP CHAT
                            </span>
                          </a>
                        </td>
                        ` : ''}
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Clean Footer (Natural Gray & Red Accent) -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.6;">
                    Dispatched automatically via Zoho Mail SMTP (${SMTP_USER}) to Club Administration (${ADMIN_EMAIL})<br>
                    <strong>Tiara Sports Club</strong> · Sama-Savli Road (besides Red Coral greens, opposite Nayara petrol pump), Vadodara, Gujarat<br>
                    Club Helpline: <a href="tel:+919825088900" style="color: #dc2626 !important; text-decoration: none; font-weight: 600;">+91 98250 88900</a>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Tiara Sports Club" <${SMTP_USER}>`,
      to: ADMIN_EMAIL,
      replyTo: inquiry.email ? `"${inquiry.name || 'Customer'}" <${inquiry.email}>` : SMTP_USER,
      subject: `[Tiara Club Inquiry] ${inquiry.facilityName || inquiry.category || 'New Inquiry'} - ${inquiry.name} (${inquiry.inquiryId || 'REF'})`,
      text: `New Tiara Club Inquiry:\nID: ${inquiry.inquiryId}\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone}\nFacility: ${inquiry.facilityName}\nSlot: ${inquiry.date} ${inquiry.timeSlot}\nMessage: ${inquiry.query || inquiry.message}`,
      html: htmlContent,
    };

    console.log(`[Zoho SMTP] Attempting to dispatch email for inquiry ${inquiry.inquiryId} to ${ADMIN_EMAIL}...`);

    let sentSuccessfully = false;
    let messageId = null;
    let lastError: any = null;

    // Try SSL on Port 465 first
    try {
      const info = await zohoTransporterSSL.sendMail(mailOptions);
      sentSuccessfully = true;
      messageId = info.messageId;
      console.log(`[Zoho SMTP SSL (465) SUCCESS] Dispatched to ${ADMIN_EMAIL}. MessageId: ${messageId}`);
    } catch (sslErr: any) {
      console.warn(`[Zoho SMTP SSL (465) Warning] Failed: ${sslErr.message}. Trying TLS (587)...`);
      lastError = sslErr;

      // Try TLS on Port 587
      try {
        const infoTLS = await zohoTransporterTLS.sendMail(mailOptions);
        sentSuccessfully = true;
        messageId = infoTLS.messageId;
        console.log(`[Zoho SMTP TLS (587) SUCCESS] Dispatched to ${ADMIN_EMAIL}. MessageId: ${messageId}`);
      } catch (tlsErr: any) {
        console.error(`[Zoho SMTP TLS (587) Error] Failed: ${tlsErr.message}`);
        lastError = tlsErr;
      }
    }

    res.json({
      success: true,
      deliveredViaZoho: sentSuccessfully,
      messageId: messageId || null,
      adminEmail: ADMIN_EMAIL,
      sender: SMTP_USER,
      inquiryId: inquiry.inquiryId,
      error: sentSuccessfully ? null : lastError?.message,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(join(__dirname, 'dist')));
    app.get('*', (_, res) => {
      res.sendFile(join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
