// templates.ts

function escapeHtml(str: string): string {
    if (typeof str !== 'string') return str || '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function generateEmailHtmlContactForm(data: any): string {
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
  <style>
    body { 
      margin: 0; 
      padding: 30px 15px; 
      background-color: #f3f4f6; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      color: #374151; 
      -webkit-font-smoothing: antialiased;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .header { 
      padding: 32px 32px 24px 32px; 
      border-bottom: 1px solid #f3f4f6; 
    }
    .content { 
      padding: 32px; 
    }
    .badge {
      display: inline-block;
      font-size: 11px; 
      font-weight: 700;
      color: #0284c7; 
      background-color: #e0f2fe;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase; 
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    h1 { 
      margin: 0; 
      color: #0f172a; 
      font-size: 24px;
      font-weight: 700;
    }
    p {
      line-height: 1.6;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
    }
    .details-table td {
      padding: 8px 0;
      vertical-align: top;
    }
    .details-label {
      font-weight: 600;
      color: #4b5563;
      width: 140px;
    }
    .message-box {
      background-color: #f8fafc; 
      border: 1px solid #e2e8f0;
      padding: 16px; 
      margin-top: 12px; 
      border-radius: 8px; 
      white-space: pre-wrap;
      color: #1f2937;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Contactformulier</div>
      <h1>Nieuw bericht ontvangen</h1>
    </div>
    <div class="content">
      <p>Er is een nieuw bericht binnengekomen via de website:</p>
      
      <table class="details-table">
        <tr>
          <td class="details-label">Naam:</td>
          <td>${name}</td>
        </tr>
        <tr>
          <td class="details-label">Adres:</td>
          <td>${address}</td>
        </tr>
        <tr>
          <td class="details-label">E-mailadres:</td>
          <td><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <td class="details-label">Telefoon:</td>
          <td><a href="tel:${phone}" style="color: #0284c7; text-decoration: none;">${phone}</a></td>
        </tr>
      </table>

      <div style="margin-top: 24px;">
        <strong style="color: #1f2937; display: block; margin-bottom: 8px;">Bericht:</strong>
        <div class="message-box">${message}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function generateEmailHtmlForCustomer(data: any): string {
    const selectedExtras = data.options?.selectedExtras || [];
    const extrasHtml = selectedExtras
        .map(
            (extra: any) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #4b5563;">
        ${escapeHtml(extra.description)}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600; color: #111827;">
        + €${escapeHtml(extra.price)},-
      </td>
    </tr>
  `
        )
        .join('');

    const customer = data.customerDetails || {};
    const service = data.service || {};
    const pkg = data.package || {};
    const options = data.options || {};
    const selectedOption = options.selectedOption || {};

    return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aanvraag Bevestiging</title>
  <style>
    body { 
      margin: 0; 
      padding: 30px 15px; 
      background-color: #f3f4f6; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      color: #374151; 
      -webkit-font-smoothing: antialiased;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .header { 
      padding: 32px 32px 24px 32px; 
      border-bottom: 1px solid #f3f4f6; 
    }
    .content { 
      padding: 32px; 
    }
    .badge {
      display: inline-block;
      font-size: 11px; 
      font-weight: 700;
      color: #0284c7; 
      background-color: #e0f2fe;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase; 
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    h1 { 
      margin: 0; 
      color: #0f172a; 
      font-size: 24px;
      font-weight: 700;
    }
    h3 {
      font-size: 16px;
      color: #1f2937;
      border-bottom: 2px solid #f3f4f6;
      padding-bottom: 8px;
      margin-top: 32px;
      margin-bottom: 16px;
    }
    p {
      line-height: 1.6;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .note {
      font-size: 13px;
      color: #6b7280;
      font-style: italic;
      background-color: #f8fafc;
      padding: 12px 16px;
      border-left: 3px solid #cbd5e1;
      border-radius: 0 6px 6px 0;
      margin-bottom: 24px;
    }
    .order-table {
      width: 100%;
      border-collapse: collapse;
    }
    .order-table td {
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: top;
    }
    .price-val { 
      text-align: right; 
      font-weight: 600; 
      color: #111827;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
    }
    .details-table td {
      padding: 8px 0;
      vertical-align: top;
    }
    .details-label {
      font-weight: 600;
      color: #4b5563;
      width: 140px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Aanvraag Bevestiging</div>
      <h1>${escapeHtml(service.title)}</h1>
    </div>
    
    <div class="content">
      <p>Beste <strong>${escapeHtml(customer.firstName)}</strong>,</p>
      <p>Bedankt voor je aanvraag! We hebben je gegevens in goede orde ontvangen en nemen zo snel mogelijk contact met je op om de afspraak definitief in te plannen.</p>
      
      <div class="note">
        * Het kan tot 3 werkdagen duren voordat je van ons een reactie ontvangt.
      </div>

      <h3>Overzicht van je aanvraag</h3>
      <table class="order-table">
        <tr>
          <td>
            <strong style="color: #1f2937;">${escapeHtml(service.title)} - ${escapeHtml(pkg.name)}</strong><br>
            <span style="font-size: 13px; color: #6b7280;">Optie: ${escapeHtml(selectedOption.description)}</span>
          </td>
          <td class="price-val">€${escapeHtml(selectedOption.price)},-</td>
        </tr>
        ${extrasHtml}
      </table>

      <!-- Totaalbedrag balk -->
      <table width="100%" style="margin-top: 16px; border-collapse: collapse;">
        <tr>
          <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; font-weight: 600; color: #1f2937;">
            Totaalprijs
          </td>
          <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; font-weight: 700; color: #0284c7; text-align: right; font-size: 18px;">
            €${escapeHtml(data.totalPrice)},-
          </td>
        </tr>
      </table>

      <hr style="margin: 32px 0; border: 0; border-top: 1px solid #e5e7eb;">

      <h3>Doorgegeven gegevens</h3>
      <table class="details-table">
        <tr>
          <td class="details-label">Naam:</td>
          <td>${escapeHtml(customer.firstName)} ${escapeHtml(customer.lastName)}</td>
        </tr>
        <tr>
          <td class="details-label">E-mailadres:</td>
          <td>${escapeHtml(customer.email)}</td>
        </tr>
        <tr>
          <td class="details-label">Adres:</td>
          <td>${escapeHtml(customer.street)} ${escapeHtml(customer.houseNumber)}</td>
        </tr>
        <tr>
          <td class="details-label">Postcode &amp; plaats:</td>
          <td>${escapeHtml(customer.zipCode)} ${escapeHtml(customer.city)}</td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`;
}

// Voeg deze functie toe aan je templates.ts

export function generateEmailHtmlForAdminOrder(data: any): string {
  const selectedExtras = data.options?.selectedExtras || [];
  const extrasHtml = selectedExtras
    .map(
      (extra: any) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #4b5563;">
        ${escapeHtml(extra.description)}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600; color: #111827;">
        + €${escapeHtml(extra.price)},-
      </td>
    </tr>
  `
    )
    .join('');

  const customer = data.customerDetails || {};
  const service = data.service || {};
  const pkg = data.package || {};
  const options = data.options || {};
  const selectedOption = options.selectedOption || {};

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nieuwe Bestelling</title>
  <style>
    body { 
      margin: 0; 
      padding: 30px 15px; 
      background-color: #f3f4f6; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      color: #374151; 
      -webkit-font-smoothing: antialiased;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .header { 
      padding: 32px 32px 24px 32px; 
      border-bottom: 1px solid #f3f4f6; 
    }
    .content { 
      padding: 32px; 
    }
    .badge {
      display: inline-block;
      font-size: 11px; 
      font-weight: 700;
      color: #16a34a; 
      background-color: #dcfce7;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase; 
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    h1 { 
      margin: 0; 
      color: #0f172a; 
      font-size: 24px;
      font-weight: 700;
    }
    h3 {
      font-size: 16px;
      color: #1f2937;
      border-bottom: 2px solid #f3f4f6;
      padding-bottom: 8px;
      margin-top: 32px;
      margin-bottom: 16px;
    }
    p {
      line-height: 1.6;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .order-table {
      width: 100%;
      border-collapse: collapse;
    }
    .order-table td {
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: top;
    }
    .price-val { 
      text-align: right; 
      font-weight: 600; 
      color: #111827;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
    }
    .details-table td {
      padding: 8px 0;
      vertical-align: top;
    }
    .details-label {
      font-weight: 600;
      color: #4b5563;
      width: 140px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Nieuwe Aanvraag</div>
      <h1>${escapeHtml(service.title)}</h1>
    </div>
    
    <div class="content">
      <p>Er is een nieuwe bestelling / aanvraag binnengekomen via de website:</p>

      <h3>Klantgegevens</h3>
      <table class="details-table">
        <tr>
          <td class="details-label">Naam:</td>
          <td>${escapeHtml(customer.firstName)} ${escapeHtml(customer.lastName)}</td>
        </tr>
        <tr>
          <td class="details-label">E-mailadres:</td>
          <td><a href="mailto:${escapeHtml(customer.email)}" style="color: #0284c7; text-decoration: none;">${escapeHtml(customer.email)}</a></td>
        </tr>
        <tr>
          <td class="details-label">Adres:</td>
          <td>${escapeHtml(customer.street)} ${escapeHtml(customer.houseNumber)}</td>
        </tr>
        <tr>
          <td class="details-label">Postcode &amp; plaats:</td>
          <td>${escapeHtml(customer.zipCode)} ${escapeHtml(customer.city)}</td>
        </tr>
      </table>

      <h3>Overzicht van de bestelling</h3>
      <table class="order-table">
        <tr>
          <td>
            <strong style="color: #1f2937;">${escapeHtml(service.title)} - ${escapeHtml(pkg.name)}</strong><br>
            <span style="font-size: 13px; color: #6b7280;">Optie: ${escapeHtml(selectedOption.description)}</span>
          </td>
          <td class="price-val">€${escapeHtml(selectedOption.price)},-</td>
        </tr>
        ${extrasHtml}
      </table>

      <!-- Totaalbedrag balk -->
      <table width="100%" style="margin-top: 16px; border-collapse: collapse;">
        <tr>
          <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; font-weight: 600; color: #1f2937;">
            Totaalprijs
          </td>
          <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; font-weight: 700; color: #16a34a; text-align: right; font-size: 18px;">
            €${escapeHtml(data.totalPrice)},-
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`;
}
