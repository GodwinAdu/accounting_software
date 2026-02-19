import nodemailer from "nodemailer";

interface EmailProps {
  to: string[];
  subject: string;
  html: string;
  organization?: any;
}

export async function sendEmail(values: EmailProps) {
  try {
    const { to, subject, html, organization } = values;
    
    // Use organization email settings if available, otherwise use env
    const smtpHost = organization?.emailSettings?.smtpHost || process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = organization?.emailSettings?.smtpPort || parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = organization?.emailSettings?.smtpUsername || process.env.SMTP_USER;
    const smtpPass = organization?.emailSettings?.smtpPassword || process.env.SMTP_PASS;
    const fromName = organization?.emailSettings?.fromName || organization?.name || process.env.SMTP_FROM_NAME || "PayFlow";
    const fromEmail = organization?.emailSettings?.fromEmail || organization?.email || smtpUser;
    const replyTo = organization?.emailSettings?.replyToEmail || fromEmail;

    if (!smtpUser || !smtpPass) {
      throw new Error("SMTP credentials are not configured");
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      replyTo: replyTo,
      to: to.join(", "),
      subject,
      html,
    });

    console.log(`✅ Email Sent Successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`❌ Email Error: ${error.message || error}`);
    throw error;
  }
}
