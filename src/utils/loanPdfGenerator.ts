import jsPDF from 'jspdf';

export interface LoanDisclosurePdfParams {
  userName: string;
  userAddress?: string;
  userPhone?: string;
  userEmail?: string;
  userEmployer?: string;
  userDob?: string;
  userTinLast4?: string;
  accountName: string;
  accountNumber: string;
  loanAmount: number;
  apr: number;
  termMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  loanTypeTitle: string;
}

/**
 * Creates and formats an authentic Wells Fargo Truth in Lending Loan Agreement jsPDF document.
 */
export function createLoanDisclosureJsPdf(params: LoanDisclosurePdfParams): { doc: jsPDF; filename: string } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const name = params.userName || 'Account Holder';
  const cleanName = name.replace(/\s+/g, '_');
  const filename = `Wells_Fargo_Loan_Agreement_TILA_${cleanName}_$${Math.round(params.loanAmount)}.pdf`;
  const formattedAmount = params.loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedPayment = params.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedInterest = params.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedTotal = params.totalRepayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const currentDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  const refCode = `WF-LN-${Date.now().toString().slice(-8)}`;

  // Header Banner
  doc.setFillColor(215, 30, 40);
  doc.rect(0, 0, 215.9, 28, 'F');
  doc.setFillColor(255, 204, 0);
  doc.rect(0, 28, 215.9, 2.5, 'F');

  doc.setFont('times', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('WELLS FARGO', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('TRUTH IN LENDING LOAN AGREEMENT', 130, 14);
  doc.text('REGULATION Z • LENDING GROUP • FDIC', 130, 19);

  // Title
  let y = 39;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text('Truth-in-Lending Disclosure & Loan Agreement', 15, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`FORM TILA-WF-2026 | REF: ${refCode} | DATE: ${currentDate}`, 15, y + 5);

  // Fed Box Table (APR, Finance Charge, Amount Financed, Total Payments)
  y += 10;
  const colW = 46.25;
  const colH = 22;

  // Box border
  doc.setDrawColor(215, 30, 40);
  doc.setLineWidth(0.6);
  doc.rect(15, y, 185, colH + 6, 'S');

  // Fed Box Header
  doc.setFillColor(215, 30, 40);
  doc.rect(15, y, 185, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('FEDERAL TRUTH IN LENDING ACT DISCLOSURES (REGULATION Z)', 18, y + 4.2);

  const fedCols = [
    { title: 'ANNUAL PERCENTAGE RATE', val: `${params.apr.toFixed(2)}%`, sub: 'Cost of credit as a yearly rate.' },
    { title: 'FINANCE CHARGE', val: `$${formattedInterest}`, sub: 'Dollar amount credit will cost.' },
    { title: 'AMOUNT FINANCED', val: `$${formattedAmount}`, sub: 'Amount of credit provided.' },
    { title: 'TOTAL OF PAYMENTS', val: `$${formattedTotal}`, sub: 'Total amount after all payments.' },
  ];

  fedCols.forEach((col, idx) => {
    const colX = 15 + idx * colW;
    if (idx > 0) {
      doc.setDrawColor(220, 220, 220);
      doc.line(colX, y + 6, colX, y + colH + 6);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(80, 80, 80);
    doc.text(col.title, colX + 3, y + 10.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text(col.val, colX + 3, y + 17);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(110, 110, 110);
    doc.text(doc.splitTextToSize(col.sub, colW - 5), colX + 3, y + 21);
  });

  // Borrower & Account Details
  y += colH + 11;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 30, 30);
  doc.text('Borrower & Designated Loan Account Details', 15, y);

  y += 3.5;
  const details = [
    ['Borrower Legal Name', name],
    ['Designated Account', `${params.accountName} (${params.accountNumber})`],
    ['Taxpayer ID (SSN/TIN)', `***-**-${params.userTinLast4 || '4321'}`],
    ['Portfolio Classification', params.loanTypeTitle || 'Executive & Personal Credit Line'],
    ['Borrower Address', params.userAddress || '1048 Montgomery St, Apt 4B, San Francisco, CA 94133'],
    ['Borrower Employer', params.userEmployer || 'Apex BioTech Corp'],
    ['Payment Schedule', `${params.termMonths} Monthly Payments of $${formattedPayment} due on the 31st`],
    ['Prepayment Policy', 'If you pay off early, you will not have to pay a penalty.'],
    ['Late Payment Terms', 'A late charge of 5% or $25.00 will be assessed if payment is past 15 days.'],
  ];

  details.forEach(([lbl, val], idx) => {
    const rY = y + idx * 7.5;
    if (idx % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(15, rY - 5, 185, 7.5, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    doc.text(lbl, 18, rY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 20, 20);
    doc.text(String(val), 75, rY);
  });

  // Signature Block
  y += details.length * 7.5 + 8;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, y, 185, 26, 2, 2, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(15, y, 185, 26, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('AUTHORIZED BORROWER ELECTRONIC SIGNATURE & ACKNOWLEDGEMENT', 20, y + 5.5);

  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(15, 35, 65);
  doc.text(name, 20, y + 15);

  doc.setDrawColor(80, 80, 80);
  doc.line(20, y + 17.5, 120, y + 17.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Borrower Digital Signature Verified via Wells Fargo Secure Portal', 20, y + 21.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('DATE EXECUTED:', 135, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(currentDate, 135, y + 16.5);

  // Footer
  doc.setDrawColor(210, 210, 210);
  doc.line(15, 260, 200, 260);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Wells Fargo Bank, N.A. Member FDIC. Equal Housing Lender. © 2026 Wells Fargo Bank, N.A.', 15, 266);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 120, 120);
  doc.text('Official Truth in Lending Disclosure & Consumer Loan Agreement (Regulation Z). Form TILA-WF-2026.', 15, 271);

  return { doc, filename };
}

export function downloadLoanDisclosurePdf(params: LoanDisclosurePdfParams) {
  const { doc, filename } = createLoanDisclosureJsPdf(params);
  
  // Directly trigger download to phone / device
  try {
    doc.save(filename);
  } catch (err) {
    console.warn('Direct PDF download error', err);
  }

  const pdfDataUri = doc.output('datauristring');
  const name = params.userName || 'Account Holder';
  const cleanName = name.replace(/\s+/g, '_');
  const htmlFilename = `Wells_Fargo_Loan_Agreement_${cleanName}_$${Math.round(params.loanAmount)}.html`;
  const formattedAmount = params.loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedPayment = params.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedInterest = params.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedTotal = params.totalRepayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const currentDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  const refCode = `WF-LN-${Date.now().toString().slice(-8)}`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Wells Fargo Loan Agreement & Disclosure - ${name} - $${formattedAmount}</title>
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
      padding: 24px;
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
      font-size: 17px;
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
    .borrower-card {
      border: 1px solid #111;
      background: #fafafa;
      padding: 10px 12px;
      margin-bottom: 14px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
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
      font-size: 12px;
      font-weight: 600;
      color: #000;
    }
    /* Federal Truth in Lending Fed Box */
    .fed-box {
      border: 2px solid #000;
      margin-bottom: 14px;
    }
    .fed-box-header {
      background: #000;
      color: #fff;
      padding: 4px 8px;
      font-size: 10px;
      font-weight: bold;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .fed-box-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border-top: 1px solid #000;
    }
    .fed-col {
      padding: 8px 10px;
      border-right: 1px solid #000;
      text-align: left;
    }
    .fed-col:last-child {
      border-right: none;
    }
    .fed-title {
      font-size: 9px;
      font-weight: bold;
      text-transform: uppercase;
      color: #333;
      margin-bottom: 4px;
    }
    .fed-val {
      font-size: 17px;
      font-weight: bold;
      color: #d71e28;
      font-family: Arial, sans-serif;
      margin-bottom: 4px;
    }
    .fed-desc {
      font-size: 8.5px;
      color: #666;
      line-height: 1.25;
    }
    /* Table */
    .detail-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #111;
      margin-bottom: 14px;
      font-size: 11px;
    }
    .detail-table th {
      background: #eee;
      border: 1px solid #ccc;
      padding: 6px 8px;
      text-align: left;
      font-size: 9.5px;
      text-transform: uppercase;
      font-weight: bold;
    }
    .detail-table td {
      border: 1px solid #ccc;
      padding: 6px 8px;
      vertical-align: top;
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
      <div class="form-title">Truth-in-Lending Disclosure & Loan Agreement</div>
      <div class="form-subtitle">Wells Fargo Bank, N.A. • Consumer & Commercial Lending Group • Equal Housing Lender • Member FDIC</div>
    </div>
    <div class="doc-meta">
      <strong>FORM TILA-WF-2026</strong><br>
      REF: ${refCode}<br>
      DATE: ${currentDate}<br>
      STATUS: APPROVED & CONFIGURED
    </div>
  </div>

  <!-- Borrower Information Card -->
  <div class="borrower-card">
    <div class="grid-2">
      <div>
        <span class="field-label">Borrower Full Legal Name</span>
        <div class="field-value">${name}</div>
        <div style="font-size: 10px; color: #555; margin-top: 2px;">
          Physical Address: ${params.userAddress || '1048 Montgomery St, Apt 4B, San Francisco, CA 94133'}
        </div>
        <div style="font-size: 10px; color: #555; margin-top: 2px;">
          Primary Contact: ${params.userPhone || '(415) 890-2134'} • Taxpayer ID: ***-**-${params.userTinLast4 || '4321'}
        </div>
      </div>
      <div>
        <span class="field-label">Designated Loan Account</span>
        <div class="field-value">${params.accountName} (${params.accountNumber})</div>
        <div style="font-size: 10px; color: #555; margin-top: 2px;">
          Portfolio Classification: <strong>${params.loanTypeTitle}</strong>
        </div>
        <div style="font-size: 10px; color: #555; margin-top: 2px;">
          Borrower Employer: ${params.userEmployer || 'Apex BioTech Corp'}
        </div>
      </div>
    </div>
  </div>

  <!-- Federal Truth in Lending Act (TILA) Fed Box -->
  <div class="fed-box">
    <div class="fed-box-header">Federal Truth in Lending Act Disclosures (Regulation Z)</div>
    <div class="fed-box-grid">
      <div class="fed-col">
        <div class="fed-title">ANNUAL PERCENTAGE RATE</div>
        <div class="fed-val">${params.apr.toFixed(2)}%</div>
        <div class="fed-desc">The cost of your credit as a yearly rate.</div>
      </div>
      <div class="fed-col">
        <div class="fed-title">FINANCE CHARGE</div>
        <div class="fed-val">$${formattedInterest}</div>
        <div class="fed-desc">The dollar amount the credit will cost you over term.</div>
      </div>
      <div class="fed-col">
        <div class="fed-title">Amount Financed</div>
        <div class="fed-val">$${formattedAmount}</div>
        <div class="fed-desc">The amount of credit provided to you or on your behalf.</div>
      </div>
      <div class="fed-col">
        <div class="fed-title">Total of Payments</div>
        <div class="fed-val">$${formattedTotal}</div>
        <div class="fed-desc">The amount you will have paid after all scheduled payments.</div>
      </div>
    </div>
  </div>

  <!-- Repayment Schedule -->
  <div class="section-title">Payment Schedule & Amortization Terms</div>
  <table class="detail-table">
    <thead>
      <tr>
        <th>Number of Payments</th>
        <th>Amount of Payments</th>
        <th>When Payments Are Due</th>
        <th>Total Repayment Term</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-weight: bold;">${params.termMonths} Monthly Payments</td>
        <td style="font-weight: bold; color: #000; font-size: 13px;">$${formattedPayment}</td>
        <td>Monthly on the 31st day, beginning 10/31/2026</td>
        <td>${params.termMonths} Months (${(params.termMonths / 12).toFixed(1)} Years)</td>
      </tr>
    </tbody>
  </table>

  <!-- Itemization of Amount Financed & Terms -->
  <div class="section-title">Itemization of Loan Amount & Lending Terms</div>
  <table class="detail-table">
    <tbody>
      <tr>
        <td style="width: 50%;">
          <span class="field-label">Configured Principal Loan Amount</span>
          <span class="field-value">$${formattedAmount} USD</span>
        </td>
        <td style="width: 50%;">
          <span class="field-label">Allowable Loan Range</span>
          <span class="field-value">Min: $700.00 USD • Highest Limit: $100,000,000.00 USD</span>
        </td>
      </tr>
      <tr>
        <td>
          <span class="field-label">Prepayment Policy</span>
          <span style="font-size: 10px; color: #333;">
            If you pay off early, you <strong>will not have to pay a penalty</strong> and you will not be entitled to a refund of part of the finance charge.
          </span>
        </td>
        <td>
          <span class="field-label">Late Charges & Grace Period</span>
          <span style="font-size: 10px; color: #333;">
            If any payment is more than 15 days late, a late charge of 5.00% of the overdue payment or $29.00 (whichever is greater) may be assessed.
          </span>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <span class="field-label">Security Interest & Collateral</span>
          <span style="font-size: 10px; color: #333;">
            This credit agreement is executed as signature credit or collateralized pursuant to borrower's Master Credit Facility Agreement with Wells Fargo Bank, N.A.
          </span>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Binding Signatures Area -->
  <div class="section-title">Binding Authorization & Borrower Acceptance</div>
  <div class="signature-area">
    <div style="font-size: 10px; color: #444; margin-bottom: 8px;">
      By signing below, the undersigned Borrower acknowledges receipt of this Truth-in-Lending Disclosure Statement, confirms accuracy of the above loan configuration of $${formattedAmount} USD, and agrees to all terms, interest rates (${params.apr.toFixed(2)}%), and repayment conditions established herein.
    </div>

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 14px; align-items: flex-end;">
      <div>
        <span class="field-label">Borrower Digital Signature</span>
        <div class="sig-line">${name}</div>
        <span style="font-size: 9px; color: #666;">Digitally authenticated via Wells Fargo Online Banking</span>
      </div>
      <div>
        <span class="field-label">Date of Execution</span>
        <div style="font-weight: bold; font-size: 13px; border-bottom: 1.5px solid #000; padding-bottom: 4px;">
          ${currentDate}
        </div>
        <span style="font-size: 9px; color: #666;">Timestamp: 10/05/2026 07:00:00 PST</span>
      </div>
    </div>

    <div style="border-top: 1px dashed #bbb; margin-top: 12px; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #555;">
      <div>
        <strong>Wells Fargo Lending Officer:</strong> M. Harrington, VP Consumer Credit
      </div>
      <div>
        <strong>Endorsement:</strong> VALIDATED & APPROVED • ROUTING #061000227
      </div>
    </div>
  </div>

  <div class="footer-note">
    Wells Fargo Bank, N.A. Member FDIC. Equal Housing Lender. © 2026 Wells Fargo Bank, N.A. All rights reserved. Document Code: TILA-WF-2026-DISCLOSURE. This document represents a binding credit disclosure and loan configuration statement rendered from user online banking session.
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
      setTimeout(() => {
        try {
          window.print();
        } catch(e) {}
      }, 500);
    });
  </script>
</body>
</html>`;

  // 1. Trigger file download
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // 2. Open print window for immediate "Save as PDF"
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
