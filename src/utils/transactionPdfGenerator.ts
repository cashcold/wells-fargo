import jsPDF from 'jspdf';
import { BankAccount, Transaction } from '../types/banking';

/**
 * Generates and downloads an authentic Wells Fargo Transaction Receipt as a PDF file.
 */
export function downloadTransactionReceiptPdf(
  tx: Transaction,
  account: BankAccount,
  userName: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const refNumber = `WF-${Math.abs(hashString(tx.id + tx.date)).toString().padStart(10, '0').slice(-10)}`;
  const cleanName = userName || 'Account Holder';
  const isCredit = tx.type === 'credit';
  const formattedAmount = `${isCredit ? '+' : '-'}$${tx.amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USD`;

  // --- BRAND HEADER ---
  // Red Header Bar
  doc.setFillColor(215, 30, 40); // Wells Fargo Red (#d71e28)
  doc.rect(0, 0, 215.9, 28, 'F');

  // Gold Accent Line
  doc.setFillColor(255, 204, 0); // Wells Fargo Gold (#ffcc00)
  doc.rect(0, 28, 215.9, 2.5, 'F');

  // Brand Name
  doc.setFont('times', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('WELLS FARGO', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('ONLINE & MOBILE BANKING', 145, 13);
  doc.text('OFFICIAL TRANSACTION RECEIPT', 145, 18);

  // --- DOCUMENT TITLE & REFERENCE ---
  let y = 42;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text('Transaction Details & Confirmation', 15, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Reference / Confirmation #: ${refNumber}`, 15, y + 6);
  doc.text(`Generated on: ${new Date().toLocaleString('en-US')}`, 140, y + 6);

  // Divider
  y += 12;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(15, y, 200, y);

  // --- HIGHLIGHT AMOUNT CARD ---
  y += 6;
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(15, y, 185, 32, 2, 2, 'F');
  doc.setDrawColor(230, 230, 230);
  doc.roundedRect(15, y, 185, 32, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('TRANSACTION AMOUNT', 22, y + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  if (isCredit) {
    doc.setTextColor(22, 101, 52); // green
  } else {
    doc.setTextColor(30, 30, 30);
  }
  doc.text(formattedAmount, 22, y + 20);

  // Status Badge
  doc.setFillColor(220, 252, 231); // emerald-100
  doc.roundedRect(148, y + 10, 42, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(22, 101, 52);
  doc.text('POSTED & CLEARED', 151, y + 17);

  // --- TRANSACTION METADATA TABLE ---
  y += 40;
  const fields = [
    ['Account Name', account.name],
    ['Account Number', `...${account.accountNumber.replace(/[^0-9]/g, '') || '0987'}`],
    ['Account Type', account.type.toUpperCase()],
    ['Account Holder', cleanName],
    ['Routing Number (ACH / Wire)', '061000227'],
    ['Date & Posting Time', `${tx.date} • Normal Business Posting`],
    ['Description / Payee', tx.description],
    ['Category', tx.category || 'Banking Service'],
    ['Transaction Type', tx.type === 'credit' ? 'CREDIT / DEPOSIT' : 'DEBIT / WITHDRAWAL'],
    ['Available Balance After Tx', `$${account.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`],
  ];

  doc.setFontSize(9.5);
  fields.forEach(([label, value], idx) => {
    const rowY = y + idx * 8.5;
    
    // Zebra background
    if (idx % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(15, rowY - 4.5, 185, 8.5, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(label, 20, rowY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 20, 20);
    doc.text(String(value), 85, rowY);
  });

  // --- CERTIFICATION / SECURITY STATEMENT ---
  y += fields.length * 8.5 + 14;
  doc.setFillColor(254, 243, 199); // amber-50
  doc.roundedRect(15, y, 185, 24, 2, 2, 'F');
  doc.setDrawColor(245, 158, 11); // amber-500
  doc.setLineWidth(0.4);
  doc.roundedRect(15, y, 185, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(146, 64, 14); // amber-800
  doc.text('OFFICIAL BANK RECORD CERTIFICATION', 20, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 53, 15);
  const certText =
    'This receipt confirms that the specified funds have been posted to your Wells Fargo account in accordance with the Wells Fargo Online Access Agreement and applicable federal banking regulations (Regulation E / Regulation CC). For questions or disputes regarding this transaction, contact Wells Fargo 24-Hour Customer Support at 1-800-869-3557.';
  const splitCert = doc.splitTextToSize(certText, 175);
  doc.text(splitCert, 20, y + 11);

  // --- FOOTER ---
  doc.setDrawColor(200, 200, 200);
  doc.line(15, 260, 200, 260);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('Wells Fargo Bank, N.A. Member FDIC. Equal Housing Lender.', 15, 266);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `© 2026 Wells Fargo Bank, N.A. All rights reserved. Document Code: REC-TXN-${tx.id.slice(-6)} • Keep this receipt for your personal tax and financial records.`,
    15,
    271
  );

  // Download PDF
  const filename = `Wells_Fargo_Transaction_Receipt_${tx.id}.pdf`;
  doc.save(filename);
}

/**
 * Generates and downloads an authentic Wells Fargo Account Activity Statement as a PDF file.
 */
export function downloadAccountStatementPdf(
  account: BankAccount,
  userName: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const cleanName = userName || 'Account Holder';
  const currentDate = new Date().toLocaleDateString('en-US');
  const statementPeriod = `September 16, 2026 - ${currentDate}`;
  const totalCredits = account.transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = account.transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  // --- HEADER ---
  doc.setFillColor(215, 30, 40);
  doc.rect(0, 0, 215.9, 28, 'F');
  doc.setFillColor(255, 204, 0);
  doc.rect(0, 28, 215.9, 2.5, 'F');

  doc.setFont('times', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('WELLS FARGO', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('ACCOUNT ACTIVITY STATEMENT', 140, 14);
  doc.text('WELLS FARGO ONLINE BANKING', 140, 19);

  // --- ACCOUNT SUMMARY HEADER ---
  let y = 40;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text(`Account Statement: ${account.name}`, 15, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);
  doc.text(`Account Number: ...${account.accountNumber.replace(/[^0-9]/g, '') || '0987'}  |  Routing Number: 061000227`, 15, y + 5.5);
  doc.text(`Statement Period: ${statementPeriod}`, 15, y + 10.5);
  doc.text(`Primary Customer: ${cleanName}`, 140, y + 5.5);
  doc.text(`Printed: ${currentDate}`, 140, y + 10.5);

  // Divider
  y += 16;
  doc.setDrawColor(220, 220, 220);
  doc.line(15, y, 200, y);

  // --- SUMMARY CARDS ---
  y += 6;
  const cardWidth = 42;
  const cardHeight = 20;

  // Card 1: Available Balance
  drawSummaryCard(doc, 15, y, cardWidth, cardHeight, 'ENDING BALANCE', `$${account.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, '#1e1e1e');
  // Card 2: Total Credits
  drawSummaryCard(doc, 62, y, cardWidth, cardHeight, 'TOTAL DEPOSITS', `+$${totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, '#15803d');
  // Card 3: Total Debits
  drawSummaryCard(doc, 109, y, cardWidth, cardHeight, 'TOTAL WITHDRAWALS', `-$${totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, '#b91c1c');
  // Card 4: Total Transactions
  drawSummaryCard(doc, 156, y, cardWidth, cardHeight, 'TRANSACTIONS', `${account.transactions.length} Total`, '#4b5563');

  // --- TRANSACTION LEDGER TABLE ---
  y += 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text('Transaction Activity', 15, y);

  y += 5;
  // Table Header
  doc.setFillColor(240, 240, 240);
  doc.rect(15, y, 185, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  doc.text('DATE', 18, y + 5.5);
  doc.text('DESCRIPTION / PAYEE', 42, y + 5.5);
  doc.text('CATEGORY', 120, y + 5.5);
  doc.text('TYPE', 155, y + 5.5);
  doc.text('AMOUNT', 180, y + 5.5);

  y += 8;

  if (account.transactions.length === 0) {
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('No transactions recorded during this statement period.', 15, y);
  } else {
    account.transactions.slice(0, 18).forEach((tx, idx) => {
      const rowY = y + idx * 8;
      
      // Page safety check
      if (rowY > 245) return;

      if (idx % 2 === 0) {
        doc.setFillColor(252, 252, 252);
        doc.rect(15, rowY, 185, 8, 'F');
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text(tx.date, 18, rowY + 5.5);

      // Truncate long descriptions
      const desc = tx.description.length > 42 ? tx.description.substring(0, 39) + '...' : tx.description;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(desc, 42, rowY + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(90, 90, 90);
      doc.text(tx.category || 'General', 120, rowY + 5.5);

      doc.text(tx.type === 'credit' ? 'Credit' : 'Debit', 155, rowY + 5.5);

      if (tx.type === 'credit') {
        doc.setTextColor(22, 101, 52);
        doc.setFont('helvetica', 'bold');
        doc.text(`+$${tx.amount.toFixed(2)}`, 180, rowY + 5.5);
      } else {
        doc.setTextColor(30, 30, 30);
        doc.setFont('helvetica', 'bold');
        doc.text(`-$${tx.amount.toFixed(2)}`, 180, rowY + 5.5);
      }
    });
  }

  // --- FOOTER & DISCLOSURES ---
  doc.setDrawColor(200, 200, 200);
  doc.line(15, 256, 200, 256);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('Wells Fargo Bank, N.A. Member FDIC. Equal Housing Lender.', 15, 262);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    'Questions about your statement? Call 1-800-TO-WELLS (1-800-869-3557) or write to Wells Fargo Customer Service, P.O. Box 6995, Portland, OR 97228-6995.',
    15,
    267
  );
  doc.text(
    '© 2026 Wells Fargo Bank, N.A. All rights reserved. Document Code: STMT-ONLINE-2026. This electronic statement is legally equivalent to a paper statement.',
    15,
    271
  );

  const filename = `Wells_Fargo_Statement_${account.name.replace(/\s+/g, '_')}_${account.accountNumber.replace(/[^0-9]/g, '')}.pdf`;
  doc.save(filename);
}

/**
 * Helper to render summary boxes inside jsPDF
 */
function drawSummaryCard(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  value: string,
  valueColor: string
) {
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(x, y, w, h, 1.5, 1.5, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(x, y, w, h, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(title, x + 4, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  // Parse hex color for jsPDF
  const rgb = hexToRgb(valueColor);
  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.text(value, x + 4, y + 14);
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/**
 * Direct print triggering for immediate print dialog and browser "Save as PDF"
 */
export function printTransactionReceiptDirect(
  tx: Transaction,
  account: BankAccount,
  userName: string
) {
  const isCredit = tx.type === 'credit';
  const refNumber = `WF-${Math.abs(hashString(tx.id + tx.date)).toString().padStart(10, '0').slice(-10)}`;
  const cleanName = userName || 'Account Holder';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Wells Fargo Receipt - ${tx.id}</title>
  <style>
    @page { size: letter portrait; margin: 15mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1c1917; margin: 0; padding: 24px; }
    .header { background: #d71e28; color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0; }
    .stripe { height: 4px; background: #ffcc00; }
    .logo { font-size: 20px; font-weight: 900; letter-spacing: 2px; font-family: serif; }
    .content { border: 1px solid #e7e5e4; border-top: none; padding: 28px; border-radius: 0 0 8px 8px; }
    .amount-box { background: #f5f5f4; border: 1px solid #e7e5e4; padding: 20px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .amount { font-size: 28px; font-weight: bold; color: ${isCredit ? '#15803d' : '#1c1917'}; }
    .badge { background: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
    th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #f0edea; }
    th { color: #78716c; font-weight: 600; width: 35%; background: #fafaf9; }
    td { color: #1c1917; font-weight: 500; }
    .notice { background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; font-size: 11px; color: #92400e; border-radius: 4px; margin-bottom: 24px; line-height: 1.5; }
    .footer { font-size: 11px; color: #a8a29e; border-top: 1px solid #e7e5e4; padding-top: 16px; text-align: center; }
    .no-print { margin-bottom: 16px; text-align: right; }
    .print-btn { background: #d71e28; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; }
    @media print { .no-print { display: none !important; } }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="header">
    <div class="logo">WELLS FARGO</div>
    <div style="font-size: 12px; font-weight: 600;">TRANSACTION CONFIRMATION</div>
  </div>
  <div class="stripe"></div>
  <div class="content">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px;">
      <h2 style="margin: 0; font-size: 18px; font-weight: bold;">Transaction Receipt</h2>
      <div style="font-size: 12px; color: #78716c;">Ref: ${refNumber}</div>
    </div>

    <div class="amount-box">
      <div>
        <div style="font-size: 11px; text-transform: uppercase; font-weight: 600; color: #78716c; margin-bottom: 4px;">Transaction Amount</div>
        <div class="amount">${isCredit ? '+' : '-'}$${tx.amount.toFixed(2)} USD</div>
      </div>
      <div class="badge">POSTED & CLEARED</div>
    </div>

    <table>
      <tr><th>Account</th><td>${account.name} (...${account.accountNumber.replace(/[^0-9]/g, '') || '0987'})</td></tr>
      <tr><th>Account Holder</th><td>${cleanName}</td></tr>
      <tr><th>Transaction Date</th><td>${tx.date}</td></tr>
      <tr><th>Description</th><td><strong>${tx.description}</strong></td></tr>
      <tr><th>Category</th><td>${tx.category || 'General Banking'}</td></tr>
      <tr><th>Routing Number</th><td>061000227</td></tr>
      <tr><th>Available Balance</th><td>$${account.availableBalance.toFixed(2)} USD</td></tr>
    </table>

    <div class="notice">
      <strong>OFFICIAL RECORD:</strong> This transaction receipt was generated through Wells Fargo Online Banking.
      Funds have been posted in accordance with federal banking regulations. Keep this document for your personal records.
    </div>

    <div class="footer">
      Wells Fargo Bank, N.A. Member FDIC. Equal Housing Lender. © 2026 Wells Fargo Bank, N.A.
    </div>
  </div>
</body>
</html>`;

  printHtmlContent(html);
}

/**
 * Direct print helper using hidden iframe to prevent popup issues
 */
function printHtmlContent(html: string) {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
    iframe.contentWindow?.focus();
    setTimeout(() => {
      try {
        iframe.contentWindow?.print();
      } catch (e) {
        console.warn('Iframe print error', e);
      }
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {}
      }, 2000);
    }, 400);
  }
}
