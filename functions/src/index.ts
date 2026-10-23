import cors from 'cors';
import express, { Request, Response } from 'express';
import { defineSecret } from 'firebase-functions/params';
import { setGlobalOptions } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import nodemailer from 'nodemailer';

// Importeer nu ook de generateEmailHtmlForAdminOrder
import {
  generateEmailHtmlContactForm,
  generateEmailHtmlForAdminOrder,
  generateEmailHtmlForCustomer,
} from './templates';

setGlobalOptions({ maxInstances: 10 });

const GMAIL_USER = defineSecret('GMAIL_USER');
const GMAIL_APP_PASSWORD = defineSecret('GMAIL_APP_PASSWORD');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

const apiRouter = express.Router();

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || GMAIL_USER.value(),
      pass: process.env.GMAIL_APP_PASSWORD || GMAIL_APP_PASSWORD.value(),
    },
  });
}

// Endpoints

apiRouter.post('/send-email-order', async (req: Request, res: Response) => {
  const { service, package: pkg, options, customerDetails, totalPrice } = req.body;

  if (!service || !pkg || !options || !customerDetails || !totalPrice) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const transporter = getTransporter();
    const gmailUser = process.env.GMAIL_USER || GMAIL_USER.value();

    // 1. Mail naar de klant
    const customerMailOptions = {
      from: `De Roo Cleaning <${gmailUser}>`,
      to: customerDetails.email,
      subject: 'Bedankt voor je bestelling',
      text: `Beste ${customerDetails.firstName},\n\nBedankt voor je aanvraag voor ${service.title}! We nemen zo snel mogelijk contact met je op.\n\nTotaalprijs: €${totalPrice},-`,
      html: generateEmailHtmlForCustomer(req.body),
    };

    // 2. Mail naar jezelf (beheerder)
    const adminMailOptions = {
      from: `De Roo Cleaning <${gmailUser}>`,
      to: gmailUser,
      subject: `Nieuwe bestelling van ${customerDetails.firstName} ${customerDetails.lastName}`,
      text: `Nieuwe aanvraag ontvangen van ${customerDetails.firstName} ${customerDetails.lastName} voor ${service.title}. Totaalprijs: €${totalPrice},-`,
      html: generateEmailHtmlForAdminOrder(req.body),
    };

    // Verstuur beide e-mails tegelijkertijd
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    return res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to send emails', details: error.message });
  }
});

apiRouter.post('/send-email-contact', async (req: Request, res: Response) => {
  const { name, address, email, message } = req.body;

  if (!name || !address || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const transporter = getTransporter();
    const gmailUser = process.env.GMAIL_USER || GMAIL_USER.value();

    const mailOptions = {
      from: `De Roo Cleaning <${gmailUser}>`,
      to: gmailUser,
      subject: `Bericht via contactformulier van ${name}`,
      text: `Nieuw bericht van ${name} (${email}):\n\n${message}`,
      html: generateEmailHtmlContactForm(req.body),
    };

    const result = await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully', messageId: result.messageId });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

apiRouter.get('/get-address', async (req: Request, res: Response) => {
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

    return res.status(200).json({
      street: data.street,
      city: data.city,
      postcode: data.postcode,
      number: data.number,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Fout bij ophalen van adresgegevens.' });
  }
});

app.use('/api', apiRouter);

export const api = onRequest(
  {
    secrets: ['GMAIL_USER', 'GMAIL_APP_PASSWORD', 'POSTCODE_TECH_API_KEY'],
    maxInstances: 10,
    concurrency: 80,
    region: 'europe-west1',
  },
  app
);
