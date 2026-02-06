import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, subject, message } = await req.json();

        const data = await resend.emails.send({
            from: 'SkillTwin Contact <onboarding@resend.dev>',
            to: ['ahalyajena28@gmail.com'],
            subject: `New Contact Form Submission: ${subject}`,
            html: `
        <h1>New Message from SkillTwin Contact Form</h1>
        <p><strong>From:</strong> ${firstName} ${lastName} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
