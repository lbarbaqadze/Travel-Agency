const BRAND_NAME = 'Info Voyager'
const BRAND_COLOR = '#111111'

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

function baseLayout({ preheader, title, bodyHtml }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f3f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="padding:28px 32px 12px;text-align:center;background-color:${BRAND_COLOR};">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:600;letter-spacing:0.04em;">${BRAND_NAME}</p>
              <p style="margin:8px 0 0;color:#d1d5db;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Travel with confidence</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #f3f4f6;background-color:#fafafa;">
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;text-align:center;">
                This is an automated message from ${BRAND_NAME}. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function codeBlock(code) {
    return `<div style="margin:24px 0;text-align:center;">
  <span style="display:inline-block;padding:16px 28px;background-color:#f9fafb;border:1px dashed #d1d5db;border-radius:12px;font-size:32px;font-weight:700;letter-spacing:0.35em;color:${BRAND_COLOR};font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">${escapeHtml(code)}</span>
</div>`
}

export function verificationEmail({ name, code }) {
    const safeName = escapeHtml(name)
    const subject = `${code} is your ${BRAND_NAME} verification code`

    const text = [
        `Hi ${name},`,
        '',
        `Welcome to ${BRAND_NAME}! Use the verification code below to complete your registration:`,
        '',
        code,
        '',
        'This code expires in 10 minutes.',
        '',
        'If you did not create an account, you can safely ignore this email.',
        '',
        `— ${BRAND_NAME}`,
    ].join('\n')

    const html = baseLayout({
        preheader: `Your verification code is ${code}. It expires in 10 minutes.`,
        title: subject,
        bodyHtml: `
          <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#111827;">Verify your email</h1>
          <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#4b5563;">Hi ${safeName},</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#4b5563;">
            Thanks for joining ${BRAND_NAME}. Enter this code on the verification page to activate your account:
          </p>
          ${codeBlock(code)}
          <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;text-align:center;">
            This code expires in <strong>10 minutes</strong>.
          </p>
          <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#9ca3af;">
            If you did not request this, you can ignore this email. No changes will be made to your account.
          </p>
        `,
    })

    return { subject, text, html }
}

export function passwordResetEmail({ name, code }) {
    const safeName = escapeHtml(name)
    const subject = `${code} is your ${BRAND_NAME} password reset code`

    const text = [
        `Hi ${name},`,
        '',
        `We received a request to reset your ${BRAND_NAME} password. Use the code below:`,
        '',
        code,
        '',
        'This code expires in 15 minutes.',
        '',
        'If you did not request a password reset, you can safely ignore this email.',
        '',
        `— ${BRAND_NAME}`,
    ].join('\n')

    const html = baseLayout({
        preheader: `Your password reset code is ${code}. It expires in 15 minutes.`,
        title: subject,
        bodyHtml: `
          <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#111827;">Reset your password</h1>
          <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#4b5563;">Hi ${safeName},</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#4b5563;">
            Use the code below to reset your ${BRAND_NAME} password:
          </p>
          ${codeBlock(code)}
          <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;text-align:center;">
            This code expires in <strong>15 minutes</strong>.
          </p>
          <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#9ca3af;">
            If you did not request this, please ignore this email. Your password will remain unchanged.
          </p>
        `,
    })

    return { subject, text, html }
}
