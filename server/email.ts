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
 * Sends an email notification to sayctchad@gmail.com
 */
export async function sendNotificationEmail(subject: string, text: string, html?: string) {
    try {
        // Only attempt to send if SMTP_PASS is configured
        if (!process.env.SMTP_PASS) {
            console.warn("SMTP_PASS is not configured. Email notification skipped.");
            return false;
        }

        const info = await transporter.sendMail({
            from: process.env.SMTP_USER || "sayctchad@gmail.com",
            to: "sayctchad@gmail.com", // The destination email
            subject,
            text,
            html: html || text,
        });

        console.log("Email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}

/**
 * Sends an auto-reply confirmation email to the user
 */
export async function sendAutoReplyEmail(to: string, subject: string, text: string, html?: string) {
    try {
        if (!process.env.SMTP_PASS) return false;

        const info = await transporter.sendMail({
            from: `"SAYC Tchad" <${process.env.SMTP_USER || "sayctchad@gmail.com"}>`,
            to,
            subject,
            text,
            html: html || text,
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
