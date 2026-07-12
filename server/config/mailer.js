import nodemailer from 'nodemailer'

function getGmailPass() {
    const pass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || ''
    return pass.replace(/\s/g, '')
}

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: getGmailPass()
    }
})
