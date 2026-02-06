import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
    try {
        const { name, email, message } = await req.json()

        // Validate input
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            )
        }

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: "SkillTwin Suggestions <onboarding@resend.dev>", // You'll need to verify your domain
            to: ["ahalyajena28@gmail.com"],
            replyTo: email,
            subject: `New Suggestion from ${name}`,
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .info-box {
                background: white;
                padding: 15px;
                border-left: 4px solid #8b5cf6;
                margin: 15px 0;
              }
              .message-box {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border: 1px solid #e5e7eb;
              }
              .footer {
                text-align: center;
                color: #6b7280;
                font-size: 12px;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">💡 New Suggestion Received</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">SkillTwin Platform</p>
            </div>
            <div class="content">
              <div class="info-box">
                <p style="margin: 0;"><strong>From:</strong> ${name}</p>
              </div>
              <div class="info-box">
                <p style="margin: 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              </div>
              <div class="message-box">
                <h3 style="margin-top: 0; color: #8b5cf6;">Message:</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              <div class="footer">
                <p>This message was sent via the SkillTwin suggestions form.</p>
                <p>© ${new Date().getFullYear()} SkillTwin. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
        })

        if (error) {
            console.error("Resend error:", error)
            return NextResponse.json(
                { error: "Failed to send email" },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { success: true, messageId: data?.id },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error sending suggestion:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
