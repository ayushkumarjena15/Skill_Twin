# Resend Email Setup Guide

This guide explains how to set up Resend for sending suggestion emails in SkillTwin.

## What is Resend?

Resend is a modern email API service that makes it easy to send transactional emails. We use it to send user suggestions from the footer form to your email.

## Setup Instructions

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "SkillTwin Production")
5. Copy the API key (it starts with `re_`)

### 3. Add API Key to Environment Variables

The API key is already configured in your `.env.local` file:

```env
RESEND_API_KEY=re_6HYhzCNU_LcccMnTUZ1uokpiFr9XnkSyT
```

**⚠️ Important:** If you need to generate a new API key, replace the value above with your new key.

### 4. Verify Your Domain (Optional but Recommended)

For production use, you should verify your own domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `skilltwin.com`)
4. Follow the DNS verification steps
5. Once verified, update the `from` field in `app/api/send-suggestion/route.ts`:

```typescript
from: "SkillTwin Suggestions <suggestions@yourdomain.com>",
```

### 5. Testing the Email Functionality

#### Development Testing (Using Default Sender)

The current setup uses Resend's default sender (`onboarding@resend.dev`), which works for testing:

1. Start your development server: `npm run dev`
2. Navigate to your website
3. Scroll to the footer
4. Click on **Suggestions** in the Company section
5. Fill out the form and submit
6. Check the email at `ahalyajena28@gmail.com`

#### Production Setup (With Verified Domain)

Once you have a verified domain:

1. Update the `from` field in the API route
2. Test sending emails
3. Check spam folder if emails don't arrive
4. Add SPF, DKIM, and DMARC records for better deliverability

## Email Configuration

### Current Setup

- **Recipient:** `ahalyajena28@gmail.com`
- **Sender:** `onboarding@resend.dev` (Resend default)
- **Reply-To:** User's email (from the form)

### Customization

To change the recipient email, edit `app/api/send-suggestion/route.ts`:

```typescript
to: ["your-new-email@example.com"],
```

## API Limits

### Free Plan
- 100 emails per day
- 3,000 emails per month
- Perfect for testing and small projects

### Paid Plans
- Start at $20/month for 50,000 emails
- See [resend.com/pricing](https://resend.com/pricing) for details

## Troubleshooting

### Emails Not Sending

1. **Check API Key:** Ensure `RESEND_API_KEY` is set correctly in `.env.local`
2. **Check Console:** Look for errors in the browser console and server logs
3. **Verify Resend Dashboard:** Check the Resend dashboard for delivery status
4. **Check Spam Folder:** Emails might be filtered as spam initially

### API Key Invalid

1. Generate a new API key in Resend dashboard
2. Update `.env.local` with the new key
3. Restart your development server

### Rate Limit Exceeded

1. Check your Resend dashboard for usage
2. Upgrade to a paid plan if needed
3. Implement rate limiting on the client side

## Security Best Practices

1. **Never commit `.env.local`** to version control (already in `.gitignore`)
2. **Use different API keys** for development and production
3. **Implement rate limiting** to prevent abuse
4. **Validate input** on both client and server (already implemented)
5. **Monitor usage** in Resend dashboard

## Email Template Customization

The email template is defined in `app/api/send-suggestion/route.ts`. You can customize:

- **Colors:** Change the gradient colors in the header
- **Layout:** Modify the HTML structure
- **Branding:** Add your logo or additional styling
- **Content:** Update the message format

## Support

- **Resend Documentation:** [resend.com/docs](https://resend.com/docs)
- **Resend Support:** support@resend.com
- **SkillTwin Issues:** Contact the development team

## Summary

✅ Resend package installed
✅ API route created at `/api/send-suggestion`
✅ Suggestions dialog component created
✅ Footer updated with Suggestions button
✅ Email template configured
✅ Environment variable set

**Next Steps:**
1. Test the suggestions form
2. (Optional) Verify your domain for production
3. Monitor email delivery in Resend dashboard
