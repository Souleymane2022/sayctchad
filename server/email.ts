import nodemailer from "nodemailer";

// Create a transporter using SMTP
// For Gmail, you should use an App Password instead of your regular password
// in the SMTP_PASS environment variable.
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for 587
    tls: {
        rejectUnauthorized: false
    },

    auth: {
        user: process.env.SMTP_USER || "sayctchad@gmail.com",
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Sends an email notification to the SAYC team (sayctchad@gmail.com)
 */
export async function sendNotificationEmail(subject: string, text: string, html?: string) {
    try {
        if (!process.env.SMTP_PASS) {
            console.warn("SMTP_PASS is not configured. Email notification skipped.");
            return false;
        }

        const defaultHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="background-color: #0d47a1; color: #fff; padding: 20px; text-align: center; border-bottom: 4px solid #f9a825;">
                    <h2 style="margin: 0; font-size: 22px;">Nouvelle Notification SAYC Tchad</h2>
                </div>
                <div style="padding: 25px; background-color: #fcfcfc;">
                    <p style="font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${text}</p>
                </div>
                <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                    <p style="margin: 0;">Cet email est généré automatiquement depuis le site web sayctchad.org</p>
                </div>
            </div>
        `;

        const info = await transporter.sendMail({
            from: `"Site SAYC Tchad" <${process.env.SMTP_USER || "sayctchad@gmail.com"}>`,
            to: process.env.SMTP_USER || "sayctchad@gmail.com",
            subject,
            text,
            html: html || defaultHtml,
        });

        console.log("Email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}

/**
 * Sends an auto-reply HTML confirmation email to the user
 */
export async function sendAutoReplyEmail(to: string, subject: string, messageBody: string, includeSada: boolean = true) {
    try {
        if (!process.env.SMTP_PASS) return false;

        const sadaBanner = includeSada ? `
        <div style="margin-top: 30px; padding: 20px; background-color: #e3f2fd; border-left: 4px solid #1976d2; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #0d47a1; font-size: 18px;">💡 Formez-vous avec SADA !</h3>
            <p style="font-size: 14px; line-height: 1.5; color: #333;">
                Connaissez-vous la <strong>Smart Africa Digital Academy (SADA)</strong> ?<br>
                C'est une plateforme panafricaine dédiée au développement des compétences numériques pour tous (entrepreneurs, jeunes, décideurs).
            </p>
            <p style="margin-bottom: 0;">
                <a href="https://sada.smart.africa" target="_blank" style="display: inline-block; padding: 10px 18px; background-color: #1976d2; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; font-size: 14px;">Découvrir les formations gratuites SADA</a>
            </p>
        </div>
        ` : '';

        const htmlTemplate = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="background-color: #1a365d; color: #ffffff; padding: 25px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">SAYC Tchad</h1>
                    <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Smart Africa Youth Chapter - Tchad</p>
                </div>
                
                <div style="padding: 30px; background-color: #ffffff;">
                    <div style="font-size: 16px; line-height: 1.6; color: #444;">
                        ${messageBody.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')}
                    </div>
                    
                    ${sadaBanner}
                </div>
                
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
                    <p style="margin: 0; font-size: 13px; color: #666;">
                        <strong>SAYC Tchad</strong><br>
                        N'Djamena, Tchad<br>
                        <a href="https://sayctchad.org" style="color: #1976d2; text-decoration: none;">sayctchad.org</a>
                    </p>
                </div>
            </div>
        `;

        const info = await transporter.sendMail({
            from: `"SAYC Tchad" <${process.env.SMTP_USER || "sayctchad@gmail.com"}>`,
            to,
            subject,
            text: messageBody, // Fallback text version
            html: htmlTemplate,
        });

        console.log("Auto-reply sent to %s: %s", to, info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending auto-reply email:", error);
        return false;
    }
}

export async function debugSmtpConnection() {
    try {
        if (!process.env.SMTP_PASS) {
            return { success: false, error: "SMTP_PASS is missing in Vercel Environment Variables" };
        }

        const info = await transporter.sendMail({
            from: process.env.SMTP_USER || "sayctchad@gmail.com",
            to: process.env.SMTP_USER || "sayctchad@gmail.com",
            subject: "Vercel Diagnostic Test",
            text: "Testing Vercel Serverless Outbound SMTP"
        });
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        return { success: false, error: error.message || String(error), stack: error.stack, code: error.code };
    }
}
