<%@ Page Language="C#" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.Net.Mail" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web.Script.Serialization" %>

<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "application/json";
        Response.AddHeader("Access-Control-Allow-Origin", "*");
        Response.AddHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        Response.AddHeader("Access-Control-Allow-Headers", "Content-Type");

        if (Request.HttpMethod == "OPTIONS")
        {
            Response.StatusCode = 200;
            Response.End();
            return;
        }

        try
        {
            // Read JSON from request body
            string jsonString;
            using (StreamReader reader = new StreamReader(Request.InputStream))
            {
                jsonString = reader.ReadToEnd();
            }

            // Parse JSON
            var serializer = new JavaScriptSerializer();
            var inquiry = serializer.Deserialize<Dictionary<string, object>>(jsonString);

            // Extract inquiry details
            string inquiryId = inquiry.ContainsKey("inquiryId") ? inquiry["inquiryId"].ToString() : "TIARA-INQ";
            string facilityName = inquiry.ContainsKey("facilityName") ? inquiry["facilityName"].ToString() : "General";
            string date = inquiry.ContainsKey("date") ? inquiry["date"].ToString() : DateTime.Now.ToShortDateString();
            string timeSlot = inquiry.ContainsKey("timeSlot") ? inquiry["timeSlot"].ToString() : "General Hours";
            string name = inquiry.ContainsKey("name") ? inquiry["name"].ToString() : "Guest";
            string email = inquiry.ContainsKey("email") ? inquiry["email"].ToString() : "";
            string phone = inquiry.ContainsKey("phone") ? inquiry["phone"].ToString() : "";
            string category = inquiry.ContainsKey("category") ? inquiry["category"].ToString() : "Slot Booking";
            string query = inquiry.ContainsKey("query") ? inquiry["query"].ToString() : "";
            string submittedAt = inquiry.ContainsKey("submittedAt") ? inquiry["submittedAt"].ToString() : DateTime.Now.ToShortTimeString();

            // Zoho SMTP Configuration
            string smtpHost = "smtp.zoho.com";
            int smtpPort = 465;
            string smtpUser = "web@uniqtechsolutions.com";
            string smtpPass = "Web@281989#";
            string adminEmail = "mikir@uniqtechsolutions.com";

            // Build HTML email
            string htmlBody = BuildEmailHTML(inquiryId, facilityName, date, timeSlot, name, email, phone, category, query, submittedAt, smtpUser, adminEmail);

            // Send email via Zoho SMTP
            using (SmtpClient smtp = new SmtpClient(smtpHost, smtpPort))
            {
                smtp.EnableSsl = true;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential(smtpUser, smtpPass);
                smtp.Timeout = 10000;

                MailMessage mail = new MailMessage();
                mail.From = new MailAddress(smtpUser, "Tiara Sports Club");
                mail.To.Add(adminEmail);
                if (!string.IsNullOrEmpty(email))
                {
                    mail.ReplyToList.Add(new MailAddress(email, name));
                }
                mail.Subject = string.Format("[Tiara] {0} - {1} [{2}]", facilityName, name, inquiryId);
                mail.Body = htmlBody;
                mail.IsBodyHtml = true;

                smtp.Send(mail);
            }

            // Return success response
            var response = new Dictionary<string, object>
            {
                { "success", true },
                { "delivered", true },
                { "adminEmail", adminEmail },
                { "sender", smtpUser },
                { "inquiryId", inquiryId }
            };

            Response.Write(serializer.Serialize(response));
        }
        catch (Exception ex)
        {
            Response.StatusCode = 500;
            var errorResponse = new Dictionary<string, object>
            {
                { "success", false },
                { "delivered", false },
                { "error", ex.Message }
            };

            var serializer = new JavaScriptSerializer();
            Response.Write(serializer.Serialize(errorResponse));
        }
    }

    private string BuildEmailHTML(string inquiryId, string facilityName, string date, string timeSlot, 
                                    string name, string email, string phone, string category, string query, 
                                    string submittedAt, string smtpUser, string adminEmail)
    {
        return @"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Tiara Sports Club Inquiry</title>
</head>
<body style='margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif;'>
    <table width='100%' border='0' cellpadding='0' cellspacing='0' style='background-color: #f1f5f9;'>
        <tr>
            <td align='center' style='padding: 12px 0;'>
                <table width='100%' border='0' cellpadding='0' cellspacing='0' style='max-width: 620px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.08);'>
                    
                    <tr>
                        <td style='background-color: #dc2626; padding: 28px 24px; text-align: center;'>
                            <h1 style='margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;'>
                                TIARA SPORTS CLUB
                            </h1>
                            <p style='margin: 6px 0 0 0; color: #fee2e2; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600;'>
                                Vadodara, Gujarat · New Inquiry Notification
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style='padding: 28px 24px; background-color: #ffffff;'>
                            
                            <table width='100%' border='0' cellpadding='0' cellspacing='0' style='margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;'>
                                <tr>
                                    <td align='left'>
                                        <span style='background-color: #fee2e2; color: #dc2626; padding: 5px 12px; border-radius: 4px; font-family: monospace; font-size: 12px; font-weight: 700;'>
                                            REF: " + inquiryId + @"
                                        </span>
                                    </td>
                                    <td align='right' style='font-size: 12px; color: #64748b;'>
                                        Submitted: <strong>" + submittedAt + @"</strong>
                                    </td>
                                </tr>
                            </table>

                            <table width='100%' border='0' cellpadding='0' cellspacing='0' style='margin-bottom: 24px;'>
                                <tr style='border-bottom: 1px solid #f1f5f9;'>
                                    <td width='150' style='padding: 12px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b;'>
                                        FACILITY:
                                    </td>
                                    <td style='padding: 12px 8px; font-size: 15px; font-weight: 800; color: #dc2626;'>
                                        " + facilityName + @"
                                    </td>
                                </tr>
                                <tr style='border-bottom: 1px solid #f1f5f9;'>
                                    <td style='padding: 12px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b;'>
                                        DATE & TIME:
                                    </td>
                                    <td style='padding: 12px 8px; font-size: 14px; font-weight: 700; color: #0f172a;'>
                                        " + date + " · " + timeSlot + @"
                                    </td>
                                </tr>
                                <tr style='border-bottom: 1px solid #f1f5f9;'>
                                    <td style='padding: 12px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b;'>
                                        NAME:
                                    </td>
                                    <td style='padding: 12px 8px; font-size: 14px; font-weight: 700; color: #0f172a;'>
                                        " + name + @"
                                    </td>
                                </tr>
                                <tr style='border-bottom: 1px solid #f1f5f9;'>
                                    <td style='padding: 12px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b;'>
                                        EMAIL:
                                    </td>
                                    <td style='padding: 12px 8px; font-size: 14px; font-weight: 600;'>
                                        <a href='mailto:" + email + @"' style='color: #dc2626; text-decoration: none;'>
                                            " + email + @"
                                        </a>
                                    </td>
                                </tr>
                                <tr style='border-bottom: 1px solid #f1f5f9;'>
                                    <td style='padding: 12px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b;'>
                                        PHONE:
                                    </td>
                                    <td style='padding: 12px 8px; font-size: 14px; font-weight: 700; color: #0f172a;'>
                                        " + phone + @"
                                    </td>
                                </tr>
                            </table>

                            <table width='100%' border='0' cellpadding='0' cellspacing='0' style='background-color: #fff1f2; border-left: 4px solid #dc2626; border-radius: 4px; margin-bottom: 26px;'>
                                <tr>
                                    <td style='padding: 16px;'>
                                        <div style='font-size: 11px; font-weight: 800; text-transform: uppercase; color: #991b1b; margin-bottom: 6px;'>
                                            USER MESSAGE:
                                        </div>
                                        <div style='font-size: 14px; color: #1e293b; line-height: 1.6; font-style: italic;'>
                                            '" + query + @"'
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <table align='center' border='0' cellpadding='0' cellspacing='0'>
                                <tr>
                                    <td align='center' style='padding: 6px 8px;'>
                                        <a href='mailto:" + email + "?subject=RE: Tiara Sports Inquiry [" + inquiryId + @"]'
                                           style='background-color: #dc2626; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: bold; padding: 13px 26px; border-radius: 4px; display: inline-block; text-transform: uppercase;'>
                                            REPLY TO USER
                                        </a>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <tr>
                        <td style='background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;'>
                            Tiara Sports Club · Vadodara<br>
                            Email dispatched via Zoho SMTP (" + smtpUser + @")
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
    }
</script>
