import { transporter } from '../config/mailer.js'

const BRAND_NAME = 'Info Voyager'

const sendEmail = async ({ email, subject, text, html }) => {
    const fromAddress = process.env.EMAIL_USER
    const fromName = process.env.EMAIL_FROM_NAME || BRAND_NAME

    const mailOptions = {
        from: `"${fromName}" <${fromAddress}>`,
        to: email,
        subject,
        text,
        html: html || undefined
    }

    const info = await transporter.sendMail(mailOptions)

    if (process.env.NODE_ENV === 'development') {
        console.log(`Email sent to ${email}: ${info.messageId}`)
    }
}

export default sendEmail
