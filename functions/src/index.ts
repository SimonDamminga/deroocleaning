import { setGlobalOptions } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

// Globale opties voor v2 functies
setGlobalOptions({ maxInstances: 10 });

// Secrets definiëren voor Firebase Cloud
const GMAIL_USER = defineSecret('GMAIL_USER');
const CLIENT_ID = defineSecret('CLIENT_ID');
const CLIENT_SECRET = defineSecret('CLIENT_SECRET');
const REFRESH_TOKEN = defineSecret('REFRESH_TOKEN');

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// HTML Escaping tegen XSS
function escapeHtml(str: string): string {
    if (typeof str !== 'string') return str || '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Transporter Helper
function getTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.GMAIL_USER || GMAIL_USER.value(),
            clientId: process.env.CLIENT_ID || CLIENT_ID.value(),
            clientSecret: process.env.CLIENT_SECRET || CLIENT_SECRET.value(),
            refreshToken: process.env.REFRESH_TOKEN || REFRESH_TOKEN.value(),
        },
    });
}

// Template Builders
function generateEmailHtmlContactForm(data: any): string {
    const name = escapeHtml(data.name);
    const address = escapeHtml(data.address);
    const email = escapeHtml(data.email);
    const phone = escapeHtml(data.phone || 'Niet opgegeven');
    const message = escapeHtml(data.message);

    return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nieuw bericht</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb;">
          <tr>
            <td style="background-color: #2563eb; padding: 24px 32px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Nieuw bericht!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px 0; color: #4b5563;">Er is een nieuw bericht binnengekomen via het contactformulier:</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr><td style="padding: 8px 0; font-weight: bold;">Naam:</td><td>${name}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Adres:</td><td>${address}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">E-mail:</td><td><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Telefoon:</td><td><a href="tel:${phone}">${phone}</a></td></tr>
                <tr><td colspan="2" style="padding-top: 16px; font-weight: bold;">Bericht:</td></tr>
                <tr><td colspan="2" style="padding: 12px; background-color: #f9fafb; border-radius: 6px; white-space: pre-wrap;">${message}</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function generateEmailHtml(data: any): string {
    const selectedExtras = data.options?.selectedExtras || [];
    const extrasHtml = selectedExtras
        .map(
            (extra: any) => `
    <tr>
      <td style="padding: 4px 12px; color: #4b5563;">${escapeHtml(extra.description)}</td>
      <td style="padding: 4px 0; text-align: right; font-weight: 600;">+ €${escapeHtml(extra.price)},-</td>
    </tr>
  `
        )
        .join('');

    const customer = data.customerDetails || {};
    const service = data.service || {};
    const pkg = data.package || {};
    const options = data.options || {};
    const selectedOption = options.selectedOption || {};
    const notes = service.importantNotes || {};

    return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 20px 10px; background-color: #f3f4f6; font-family: sans-serif; color: #242424; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; }
    .header { padding: 24px; border-bottom: 1px solid #f0f0f0; }
    .content { padding: 25px; }
    .price-val { text-align: right; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Aanvraag Bevestiging</span>
      <h1 style="margin: 0; color: #3490ae;">${escapeHtml(service.title)}</h1>
    </div>
    <div class="content">
      <p>Beste <strong>${escapeHtml(customer.firstName)}</strong>,<br>Bedankt voor je aanvraag!</p>
      <h3>Overzicht Bestelling</h3>
      <table width="100%">
        <tr>
          <td>
            <strong>${escapeHtml(service.title)} - ${escapeHtml(pkg.name)}</strong><br>
            <small>Optie: ${escapeHtml(selectedOption.description)}</small>
          </td>
          <td class="price-val">€${escapeHtml(selectedOption.price)},-</td>
        </tr>
        ${extrasHtml}
      </table>
      <div style="background-color: #f9fafb; padding: 16px; margin-top: 16px; border-radius: 8px;">
        <strong>Totaalprijs: €${escapeHtml(data.totalPrice)},-</strong>
      </div>
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #f0f0f0;">
      <h3>Klant & Adresgegevens</h3>
      <p>
        <strong>Naam:</strong> ${escapeHtml(customer.firstName)} ${escapeHtml(customer.lastName)}<br>
        <strong>E-mail:</strong> ${escapeHtml(customer.email)}<br>
        <strong>Adres:</strong> ${escapeHtml(customer.street)} ${escapeHtml(customer.houseNumber)}<br>
        <strong>Postcode & Plaats:</strong> ${escapeHtml(customer.zipCode)} ${escapeHtml(customer.city)}
      </p>
      <div style="background-color: #f0fdf4; border: 1px solid #86efac; padding: 14px; border-radius: 8px;">
        <h4 style="margin: 0 0 6px 0; color: #166534;">Belangrijke informatie</h4>
        <p style="margin: 2px 0; font-size: 13px; color: #166534;">• <strong>Droogtijd:</strong> ${escapeHtml(notes.dryingTime)}</p>
        <p style="margin: 2px 0; font-size: 13px; color: #166534;">• <strong>Minimum order:</strong> ${escapeHtml(notes.minimumOrder)}</p>
        <p style="margin: 2px 0; font-size: 13px; color: #166534;">• ${escapeHtml(notes.resultInfo)}</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// Endpoints

app.post('/send-email-order', async (req: Request, res: Response) => {
    const { service, package: pkg, options, customerDetails, totalPrice } = req.body;

    if (!service || !pkg || !options || !customerDetails || !totalPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const transporter = getTransporter();
        const gmailUser = process.env.GMAIL_USER || GMAIL_USER.value();

        const mailOptions = {
            from: `De Roo Cleaning <${gmailUser}>`,
            to: customerDetails.email,
            subject: 'Bedankt voor je bestelling',
            text: `Beste ${customerDetails.firstName},\n\nBedankt voor je aanvraag voor ${service.title}! We nemen zo snel mogelijk contact met je op.\n\nTotaalprijs: €${totalPrice},-`,
            html: generateEmailHtml(req.body),
        };

        const result = await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Email sent successfully', messageId: result.messageId });
    } catch (error: any) {
        console.error('Error sending order email:', error);
        return res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
});

app.post('/send-email-contact', async (req: Request, res: Response) => {
    const { name, address, email, message } = req.body;

    if (!name || !address || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const transporter = getTransporter();
        const gmailUser = process.env.GMAIL_USER || GMAIL_USER.value();

        const mailOptions = {
            from: `De Roo Cleaning <${gmailUser}>`,
            to: process.env.CONTACT_RECIPIENT_EMAIL || gmailUser,
            subject: `Bericht via contactformulier van ${name}`,
            text: `Nieuw bericht van ${name} (${email}):\n\n${message}`,
            html: generateEmailHtmlContactForm(req.body),
        };

        const result = await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Email sent successfully', messageId: result.messageId });
    } catch (error: any) {
        console.error('Error sending contact email:', error);
        return res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
});

app.get('/get-address', async (req: Request, res: Response) => {
    const { postcode, number } = req.query;
    if (!postcode || !number) {
        return res.status(400).json({ error: 'Postcode en huisnummer zijn verplicht.' });
    }

    const formattedPostcode = (postcode as string).replace(/\s+/g, '').toUpperCase();

    try {
        const apiKey = process.env.POSTCODE_TECH_API_KEY;
        const response = await fetch(
            `https://postcode.tech/api/v1/postcode?postcode=${formattedPostcode}&number=${number}`,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Postcode of huisnummer niet gevonden.' });
        }

        const data = await response.json();

        // Stuur alleen de relevante velden terug naar de frontend
        return res.status(200).json({
            street: data.street,
            city: data.city,
            postcode: data.postcode,
            number: data.number,
        });
    } catch (error) {
        console.error('Fout bij ophalen adresgegevens:', error);
        return res.status(500).json({ error: 'Fout bij ophalen van adresgegevens.' });
    }
});

// Export de Express app als één Firebase HTTPS Function v2
export const api = onRequest(
    {
        secrets: ['GMAIL_USER', 'CLIENT_ID', 'CLIENT_SECRET', 'REFRESH_TOKEN', 'POSTCODE_TECH_API_KEY'],
        maxInstances: 10,
        concurrency: 80,
    },
    app
);
