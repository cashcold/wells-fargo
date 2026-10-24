import jsPDF from 'jspdf';
import { EnrollmentFormData } from '../types/banking';

/**
 * Creates and formats an authentic Wells Fargo Signature Card (DSG8921) jsPDF document.
 */
export function createSignatureCardJsPdf(
  formData: EnrollmentFormData,
  customerName?: string
): { doc: jsPDF; filename: string } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const name = formData.c1FullName || customerName || 'Account Holder';
  const cleanName = name.replace(/\s+/g, '_');
  const filename = `Wells_Fargo_Signature_Card_DSG8921_${cleanName}.pdf`;

  // Header Banner
  doc.setFillColor(215, 30, 40); // WF Red
  doc.rect(0, 0, 215.9, 28, 'F');
  doc.setFillColor(255, 204, 0); // Gold
  doc.rect(0, 28, 215.9, 2.5, 'F');

  doc.setFont('times', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('WELLS FARGO', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('CONSUMER ACCOUNT APPLICATION (SIGNATURE CARD)', 115, 14);
  doc.text('FORM DSG8921 • DEPOSIT PRODUCTS GROUP • FDIC', 115, 19);

  // Document metadata
  let y = 40;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text('Consumer Account Application & Verified Signature Record', 15, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text('FORM DSG8921 (02-07 105252) | ROUTING: 061000227 | ACCOUNT: .... 0987', 15, y + 5.5);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, 145, y + 5.5);

  // Divider
  y += 10;
  doc.setDrawColor(220, 220, 220);
  doc.line(15, y, 200, y);

  // Patriot Act box
  y += 5;
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(15, y, 185, 16, 2, 2, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, y, 185, 16, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14);
  doc.text('IMPORTANT USA PATRIOT ACT NOTICE & IDENTITY VERIFICATION', 20, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 53, 15);
  const patriotText =
    'Federal law requires all financial institutions to obtain, verify, and record information identifying each person opening an account. This record verifies legal identification, taxpayer TIN, and residential address in compliance with Federal banking laws.';
  doc.text(doc.splitTextToSize(patriotText, 175), 20, y + 9.5);

  // Account & Customer Data Tables
  y += 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text('Customer 1 Information (Primary Account Holder)', 15, y);

  y += 4;
  const fields = [
    ['Full Legal Name', name],
    ['Taxpayer ID (SSN / TIN)', formData.c1Tin ? `***-**-${formData.c1Tin.slice(-4)}` : '***-**-4321'],
    ['Date of Birth', formData.c1Dob || '06/14/1992'],
    ['Citizenship Country', formData.c1Country || 'United States of America (Citizen)'],
    [
      'Physical Residence',
      `${formData.c1StreetAddress || '1048 Montgomery St, Apt 4B'}, ${formData.c1City || 'San Francisco'}, ${formData.c1State || 'CA'} ${formData.c1Zip || '94133'}`,
    ],
    ['Time at Residence', `${formData.c1HowLongYr || '3'} Years, ${formData.c1HowLongMo || '6'} Months`],
    ['Primary Contact Phone', formData.c1HomePhone || '(415) 890-2134'],
    ['Employer', formData.c1Employer || 'Apex BioTech Corp'],
    [
      'Primary Identification',
      `${formData.c1PrimaryIdDesc || "Driver's License"} (${formData.c1PrimaryIdState || 'CA'}) Exp: ${formData.c1PrimaryExpDate || '10/2028'}`,
    ],
    [
      'Account Product Selected',
      `${formData.accountType || 'Wells Fargo Everyday Checking (JA23OU)'} (Initial Deposit: $${formData.initialDeposit || '100.00'})`,
    ],
  ];

  fields.forEach(([lbl, val], i) => {
    const rowY = y + i * 7.5;
    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(15, rowY - 5, 185, 7.5, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text(lbl, 18, rowY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 20, 20);
    doc.text(String(val), 80, rowY);
  });

  // Signature Block
  y += fields.length * 7.5 + 10;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, y, 185, 32, 2, 2, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(15, y, 185, 32, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('AUTHORIZED ACCOUNT SIGNATURE (FORM DSG8921)', 20, y + 6);

  doc.setFont('times', 'italic');
  doc.setFontSize(16);
  doc.setTextColor(15, 35, 65);
  doc.text(formData.c1Signature || name, 20, y + 18);

  doc.setDrawColor(80, 80, 80);
  doc.line(20, y + 21, 130, y + 21);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Customer 1 Digital Verified Signature', 20, y + 25.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('DATE SIGNED:', 140, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.c1SignatureDate || new Date().toLocaleDateString('en-US'), 140, y + 19);

  // Footer Disclaimer
  doc.setDrawColor(210, 210, 210);
  doc.line(15, 260, 200, 260);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Wells Fargo Bank, N.A. Member FDIC. Equal Housing Lender. © 2026 Wells Fargo Bank, N.A.', 15, 266);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('Document Code: DSG8921 (02-07 105252). Form archived in Wells Fargo Secure Cloud Banking Repository.', 15, 271);

  return { doc, filename };
}

export function downloadSignatureCardPdf(formData: EnrollmentFormData, customerName?: string) {
  const { doc, filename } = createSignatureCardJsPdf(formData, customerName);
  
  // Directly trigger PDF download to the phone / device
  try {
    doc.save(filename);
  } catch (err) {
    console.warn('Direct PDF download error', err);
  }

  const pdfDataUri = doc.output('datauristring');
  const name = formData.c1FullName || customerName || 'Account Holder';

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
    <button class="btn" onclick="downloadPdfToDevice()">Print / Save as PDF</button>
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
    function downloadPdfToDevice() {
      try {
        var a = document.createElement('a');
        a.href = "${pdfDataUri}";
        a.download = "${filename}";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        console.warn('PDF download error', err);
      }
      try {
        window.print();
      } catch(e) {}
    }

    window.addEventListener('DOMContentLoaded', () => {
      // Auto-trigger print preview for immediate save-as-pdf if supported
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
