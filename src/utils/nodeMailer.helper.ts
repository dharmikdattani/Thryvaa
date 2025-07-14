import sgMail from '@sendgrid/mail';

type EmailOptions = {
  to: string;
  cc?: string;
  subject: string;
  body: string;
};

export const sendEmail = async ({ to, cc, subject, body }: EmailOptions) => {
  try {

    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const senderEmail = process.env.EMAIL_USER

    if (!sendGridApiKey) {
      throw new Error("SendGrid API key is not set in environment variables.");
    }

    if (!senderEmail) {
      throw new Error("Sender email is not set in environment variables.");
    }

    sgMail.setApiKey(sendGridApiKey);

    const msg: sgMail.MailDataRequired = {
      to,
      from: {
        email: senderEmail,
        name: "Thryaa"
      },
      subject,
      html: body,
      ...(cc && { cc })
    };

    await sgMail.send(msg)

    return { success: true, message: "Email sent successfully via SendGrid." };
  } catch (error) {
    console.error("SendGrid Email Error:", error);
    return { success: false, message: "Error sending email", error };

  }
};