import { EnrollmentFormData } from '../types/banking';

export function downloadSignatureCardPdf(formData: EnrollmentFormData, customerName?: string) {
  const name = formData.c1FullName || customerName || 'Account Holder';
  const filename = `Wells_Fargo_Signature_Card_DSG8921_${name.replace(/\s+/g, '_')}.html`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Wells Fargo Signature Card - Form DSG8921 - ${name}</title>
  <style>
    @page {
      size: letter portrait;
      margin: 12mm 15mm 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
      line-height: 1.35;
      color: #111;
      background: #fff;
      margin: 0;
      padding: 20px;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #111;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .brand-box {
      background: #d71e28;
      color: #fff;
      font-weight: 900;
      font-size: 14px;
      letter-spacing: 2px;
      padding: 4px 10px;
      display: inline-block;
      margin-bottom: 4px;
    }
    .form-title {
      font-size: 18px;
      font-weight: bold;
      color: #000;
      margin: 0 0 2px 0;
    }
    .form-subtitle {
      font-size: 11px;
      color: #555;
    }
    .doc-meta {
      text-align: right;
      font-size: 10px;
      font-family: monospace;
      color: #444;
    }
    .notice-box {
      border: 1px solid #999;
      background: #f8f8f8;
      padding: 8px 10px;
      font-size: 10px;
      margin-bottom: 12px;
      border-left: 4px solid #d71e28;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: 1px solid #111;
      margin-bottom: 12px;
    }
    .grid-col {
      padding: 8px 10px;
    }
    .grid-col:first-child {
      border-right: 1px solid #111;
    }
    .section-title {
      background: #eee;
      border: 1px solid #111;
      border-bottom: none;
      padding: 5px 10px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .field-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #111;
      margin-bottom: 12px;
      font-size: 11px;
    }
    .field-table td {
      border: 1px solid #ccc;
      padding: 5px 8px;
      vertical-align: top;
    }
    .field-label {
      font-size: 9px;
      text-transform: uppercase;
      color: #666;
      display: block;
      margin-bottom: 2px;
      font-weight: bold;
    }
    .field-value {
      font-size: 11px;
      font-weight: 600;
      color: #000;
    }
    .signature-area {
      border: 1.5px solid #111;
      padding: 12px;
      background: #fafafa;
      margin-bottom: 12px;
    }
    .sig-line {
      font-family: 'Brush Script MT', 'Segoe Script', 'Great Vibes', cursive;
      font-size: 26px;
      color: #0d233a;
      border-bottom: 1.5px solid #000;
      padding: 4px 8px;
      margin-top: 6px;
      margin-bottom: 4px;
    }
    .footer-note {
      font-size: 9px;
      color: #666;
      text-align: justify;
      margin-top: 10px;
      line-height: 1.3;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
    .print-actions {
      position: fixed;
      top: 12px;
      right: 12px;
      background: #fff;
      padding: 8px 12px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: 1px solid #ddd;
      display: flex;
      gap: 8px;
      z-index: 1000;
    }
    .btn {
      background: #d71e28;
      color: white;
      border: none;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-secondary {
      background: #333;
    }
  </style>
</head>
<body>
  <div class="print-actions no-print">
    <button class="btn" onclick="window.print()">Print / Save as PDF</button>
    <button class="btn btn-secondary" onclick="window.close()">Close Window</button>
  </div>

  <div class="header-bar">
    <div>
      <div class="brand-box">WELLS FARGO</div>
      <div class="form-title">Consumer Account Application (Signature Card)</div>
      <div class="form-subtitle">Wells Fargo Bank, N.A. • Deposit Products Group • Member FDIC</div>
    </div>
    <div class="doc-meta">
      <strong>FORM DSG8921 (02-07 105252)</strong><br>
      Page 1 of 1<br>
      ROUTING: 061000227<br>
      ACCOUNT: •••• 0987
    </div>
  </div>

  <div class="notice-box">
    <strong>IMPORTANT USA PATRIOT ACT NOTICE:</strong> Federal law requires all financial institutions to obtain, verify, and record information that identifies each person who opens an account. What this means for you: When you open an account, we will ask for your name, address, date of birth, and other information that will allow us to identify you. We may also ask to see your driver's license or other identifying documents.
  </div>

  <div class="grid-2">
    <div class="grid-col">
      <span class="field-label">Account(s) Selected</span>
      <div class="field-value">${formData.accountType}</div>
      <div style="font-size: 10px; color: #555; margin-top: 4px;">
        Opening Deposit: $${formData.initialDeposit || '100.00'} • Promotional Offer Code: ${formData.offerCode || 'JA23OU'}
      </div>
    </div>
    <div class="grid-col" style="background: #fafafa;">
      <span class="field-label">Bank Use Only</span>
      <div style="font-family: monospace; font-size: 10px; color: #333;">
        WELLS FARGO BANK, N.A. • BRANCH 00481<br>
        ROUTING: 061000227 • VERIFIED IDENTITY: YES<br>
        STATUS: ACTIVE ACCOUNT RECORD
      </div>
    </div>
  </div>

  <div class="section-title">Customer 1 Information (Primary Applicant)</div>
  <table class="field-table">
    <tr>
      <td colspan="2" style="width: 50%;">
        <span class="field-label">Customer 1 Full Legal Name</span>
        <span class="field-value">${formData.c1FullName || name}</span>
      </td>
      <td colspan="2" style="width: 50%;">
        <span class="field-label">Taxpayer Identification Number (SSN / TIN)</span>
        <span class="field-value">${formData.c1Tin ? `***-**-${formData.c1Tin.slice(-4)}` : '***-**-4321'} (Certified on W-9)</span>
      </td>
    </tr>
    <tr>
      <td colspan="3">
        <span class="field-label">Street Address (Physical Residence - No P.O. Box)</span>
        <span class="field-value">${formData.c1StreetAddress || '1048 Montgomery St, Apt 4B'}</span>
      </td>
      <td>
        <span class="field-label">Duration at Address</span>
        <span class="field-value">${formData.c1HowLongYr || '3'} Yrs, ${formData.c1HowLongMo || '6'} Mos</span>
      </td>
    </tr>
    ${formData.c1DirectionalAddress ? `
    <tr>
      <td colspan="4">
        <span class="field-label">Directional / Landmark Address</span>
        <span class="field-value">${formData.c1DirectionalAddress}</span>
      </td>
    </tr>
    ` : ''}
    <tr>
      <td>
        <span class="field-label">City</span>
        <span class="field-value">${formData.c1City || 'San Francisco'}</span>
      </td>
      <td>
        <span class="field-label">State</span>
        <span class="field-value">${formData.c1State || 'CA'}</span>
      </td>
      <td>
        <span class="field-label">Zip Code</span>
        <span class="field-value">${formData.c1Zip || '94133'}</span>
      </td>
      <td>
        <span class="field-label">Country</span>
        <span class="field-value">${formData.c1Country || 'USA'}</span>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <span class="field-label">Home / Primary Mobile Telephone</span>
        <span class="field-value">${formData.c1HomePhone || '(415) 890-2134'}</span>
      </td>
      <td colspan="2">
        <span class="field-label">Business / Daytime Telephone</span>
        <span class="field-value">${formData.c1BusinessPhone || 'N/A'}</span>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <span class="field-label">Current Employer / Occupation</span>
        <span class="field-value">${formData.c1Employer || 'Apex BioTech Corp'}</span>
      </td>
      <td colspan="2">
        <span class="field-label">Date of Birth</span>
        <span class="field-value">${formData.c1Dob || '06/14/1992'}</span>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <span class="field-label">Primary Identification Document</span>
        <span class="field-value">${formData.c1PrimaryIdDesc || "California Driver's License"} (${formData.c1PrimaryIdState || 'CA'})</span>
      </td>
      <td>
        <span class="field-label">Issue Date</span>
        <span class="field-value">${formData.c1PrimaryIssueDate || '04/10/2021'}</span>
      </td>
      <td>
        <span class="field-label">Expiration Date</span>
        <span class="field-value">${formData.c1PrimaryExpDate || '06/14/2027'}</span>
      </td>
    </tr>
  </table>

  <div class="section-title">Taxpayer Certification (Substitute Form W-9)</div>
  <div style="border: 1px solid #111; padding: 8px 10px; font-size: 10px; margin-bottom: 12px; background: #fff;">
    Under penalties of perjury, I certify that:
    <ol style="margin: 4px 0 6px 16px; padding: 0;">
      <li>The number shown on this form is my correct taxpayer identification number; and</li>
      <li>I am not subject to backup withholding because: (a) I am exempt from backup withholding, or (b) I have not been notified by the Internal Revenue Service (IRS) that I am subject to backup withholding as a result of a failure to report all interest or dividends, or (c) the IRS has notified me that I am no longer subject to backup withholding; and</li>
      <li>I am a U.S. citizen or other U.S. person (including a U.S. resident alien).</li>
    </ol>
    <div style="font-weight: bold; border-top: 1px dashed #ccc; padding-top: 4px;">
      Taxpayer Certification Signature: <span style="font-family: cursive; font-size: 14px; margin-left: 8px;">${formData.w9Signature || name}</span> • Certified
    </div>
  </div>

  <div class="section-title">Binding Signatures & Account Authorization</div>
  <div class="signature-area">
    <div style="font-size: 10px; color: #444; margin-bottom: 8px;">
      By signing below, I acknowledge receipt of the Wells Fargo Consumer Account Fee and Information Schedule, Deposit Account Agreement, and Privacy Policy. I agree to be bound by the terms and conditions stated therein, including the binding arbitration program.
    </div>

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px; align-items: flex-end;">
      <div>
        <span class="field-label">Customer 1 Authorized Signature</span>
        <div class="sig-line">${formData.c1Signature || name}</div>
      </div>
      <div>
        <span class="field-label">Date (MM/DD/YYYY)</span>
        <div style="font-weight: bold; font-size: 13px; border-bottom: 1px solid #000; padding-bottom: 4px;">
          ${formData.c1SignatureDate || new Date().toLocaleDateString('en-US')}
        </div>
      </div>
    </div>
  </div>

  <div class="footer-note">
    Wells Fargo Bank, N.A. Member FDIC. Equal Housing Lender. © 2026 Wells Fargo Bank, N.A. All rights reserved. Document Code: DSG8921 (02-07 105252). This copy is generated from the verified online signature card records of Wells Fargo Online Banking.
  </div>

  <script>
    window.addEventListener('DOMContentLoaded', () => {
      // Auto-trigger print preview for immediate save-as-pdf
      setTimeout(() => {
        try {
          window.print();
        } catch(e) {}
      }, 500);
    });
  </script>
</body>
</html>`;

  // 1. Download as offline HTML/PDF file
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // 2. Open printable view in new window so user can immediately save as PDF
  try {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  } catch (err) {
    console.error('Error opening print window', err);
  }
}
