import jsPDF from 'jspdf';
import { TreasuryTenderOrder } from '../types/banking';

/**
 * Creates and formats an authentic Wells Fargo Advisors Treasury Bill Confirmation jsPDF document.
 */
export function createTreasuryConfirmationJsPdf(
  order: TreasuryTenderOrder,
  userName: string
): { doc: jsPDF; filename: string } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const cleanName = (userName || 'Account_Holder').replace(/\s+/g, '_');
  const filename = `Wells_Fargo_Treasury_Bill_Confirmation_${order.cusip}_${cleanName}.pdf`;

  // Header Banner
  doc.setFillColor(215, 30, 40); // WF Red
  doc.rect(0, 0, 215.9, 28, 'F');
  doc.setFillColor(255, 204, 0); // Gold
  doc.rect(0, 28, 215.9, 2.5, 'F');

  doc.setFont('times', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('WELLS FARGO ADVISORS', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('FIXED INCOME DESK • PRIMARY DEALER TENDER', 115, 14);
  doc.text('OFFICIAL AUCTION CONFIRMATION • SIPC', 115, 19);

  // Document Title
  let y = 39;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text('U.S. Treasury Bill Auction Tender Confirmation', 15, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`CONFIRMATION REF: ${order.confirmationNumber} | DATE: ${order.submittedAt}`, 15, y + 5);

  // Key Value Summary Grid
  y += 10;
  const colW = 46.25;
  const colH = 22;

  doc.setFillColor(248, 249, 250);
  doc.roundedRect(15, y, 185, colH, 2, 2, 'F');
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(15, y, 185, colH, 2, 2, 'S');

  const metricCols = [
    { label: 'PAR VALUE (MATURITY)', val: `$${order.faceValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: [30, 30, 30] },
    { label: 'PURCHASE PRICE', val: `$${order.discountPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: [30, 30, 30] },
    { label: 'TOTAL DISCOUNT RETURN', val: `+$${order.totalDiscount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: [22, 101, 52] },
    { label: 'INVESTMENT YIELD', val: `${order.investmentYield.toFixed(2)}%`, color: [180, 83, 9] },
  ];

  metricCols.forEach((col, idx) => {
    const colX = 15 + idx * colW;
    if (idx > 0) {
      doc.setDrawColor(225, 225, 225);
      doc.line(colX, y + 3, colX, y + colH - 3);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 100, 100);
    doc.text(col.label, colX + 3.5, y + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(col.color[0], col.color[1], col.color[2]);
    doc.text(col.val, colX + 3.5, y + 16);
  });

  // Specifications
  y += colH + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text('Security Specifications & Settlement Schedule', 15, y);

  y += 4;
  const specs = [
    ['Security Description', `United States Treasury Bill (${order.term})`],
    ['CUSIP Identifier', order.cusip],
    ['Tender Order Status', `${order.status.toUpperCase()} (Recorded with Federal Reserve)`],
    ['Funding Source Account', order.fundingAccountName],
    ['Investor / Account Holder', userName || 'Primary Account Holder'],
    ['Issue / Settlement Date', order.settlementDate],
    ['Maturity Settlement Date', order.maturityDate],
    ['Pricing Basis', `$${((order.discountPrice / (order.faceValue || 1)) * 100).toFixed(4)} per $100 face value`],
  ];

  specs.forEach(([lbl, val], idx) => {
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
    doc.text(String(val), 80, rY);
  });

  // Legal Disclosures Box
  y += specs.length * 7.5 + 8;
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(15, y, 185, 24, 2, 2, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, y, 185, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14);
  doc.text('FULL FAITH AND CREDIT OF THE UNITED STATES GOVERNMENT', 20, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(120, 53, 15);
  const legalText = 'Treasury Bills are direct short-term debt obligations issued by the United States Government and backed by its full faith and credit. Income earned is subject to federal income tax but is exempt from state and local income taxes. Submitted via Wells Fargo Clearing Services, LLC (WFCS), Member SIPC.';
  doc.text(doc.splitTextToSize(legalText, 175), 20, y + 10.5);

  // Footer
  doc.setDrawColor(210, 210, 210);
  doc.line(15, 260, 200, 260);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Wells Fargo Advisors · Wells Fargo Clearing Services, LLC · Member FINRA / SIPC', 15, 266);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 120, 120);
  doc.text('Official Treasury Tender Confirmation. Document Code: TBILL-CONF-WFCS. Archived in Client Portfolio.', 15, 271);

  return { doc, filename };
}

export function downloadTreasuryConfirmationPdf(order: TreasuryTenderOrder, userName: string) {
  const { doc, filename } = createTreasuryConfirmationJsPdf(order, userName);
  
  // Directly trigger download to phone / device
  try {
    doc.save(filename);
  } catch (err) {
    console.warn('Direct PDF download error', err);
  }

  const pdfDataUri = doc.output('datauristring');
  const cleanName = (userName || 'Account_Holder').replace(/\s+/g, '_');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Wells Fargo Advisors - U.S. Treasury Bill Tender Confirmation - ${order.cusip}</title>
  <style>
    @page {
      size: letter portrait;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 11px;
      line-height: 1.4;
      color: #1a1a1a;
      background: #ffffff;
      margin: 0;
      padding: 24px;
    }
    .header {
      border-bottom: 3px solid #d71e28;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .logo {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 0.1em;
      color: #d71e28;
      text-transform: uppercase;
      font-family: serif;
    }
    .subhead {
      font-size: 11px;
      color: #555;
      margin-top: 2px;
      font-weight: 500;
    }
    .badge {
      background: #f4f4f4;
      border: 1px solid #ccc;
      padding: 4px 8px;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .doc-title {
      font-size: 16px;
      font-weight: bold;
      color: #111;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .doc-subtitle {
      font-size: 11px;
      color: #666;
      margin-bottom: 16px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .box {
      border: 1px solid #dcdcdc;
      padding: 12px;
      background: #fafafa;
    }
    .box-title {
      font-weight: bold;
      font-size: 11px;
      text-transform: uppercase;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 4px;
      margin-bottom: 8px;
      color: #333;
    }
    .data-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      border-bottom: 1px dashed #eee;
    }
    .data-label {
      color: #666;
    }
    .data-val {
      font-weight: 600;
      color: #111;
    }
    .highlight-box {
      background: #fff8e6;
      border: 1px solid #f2c744;
      padding: 14px;
      margin: 18px 0;
      border-radius: 4px;
    }
    .highlight-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      text-align: center;
      gap: 12px;
    }
    .highlight-grid .num {
      font-size: 16px;
      font-weight: bold;
      color: #8c1d1d;
    }
    .highlight-grid .lbl {
      font-size: 9px;
      text-transform: uppercase;
      color: #555;
      margin-top: 2px;
    }
    .legal {
      margin-top: 24px;
      font-size: 9px;
      color: #666;
      line-height: 1.35;
      border-top: 1px solid #ddd;
      padding-top: 12px;
    }
    .print-btn {
      position: fixed;
      top: 16px;
      right: 16px;
      background: #d71e28;
      color: #fff;
      border: none;
      padding: 8px 16px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 4px;
    }
    @media print {
      .print-btn { display: none; }
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="downloadPdfToDevice()">Print / Save as PDF</button>

  <div class="header">
    <div>
      <div class="logo">WELLS FARGO ADVISORS</div>
      <div class="subhead">Fixed Income Desk · Primary Dealer Tender Confirmation Services</div>
    </div>
    <div style="text-align: right;">
      <div class="badge">Official Confirmation</div>
      <div style="font-size: 10px; color: #555; margin-top: 4px;">Ref: ${order.confirmationNumber}</div>
    </div>
  </div>

  <div class="doc-title">U.S. TREASURY BILL AUCTION TENDER CONFIRMATION</div>
  <div class="doc-subtitle">Bureau of the Fiscal Service · Department of the Treasury · Submitted through Wells Fargo Clearing Services, LLC</div>

  <div class="highlight-box">
    <div class="highlight-grid">
      <div>
        <div class="num">$${order.faceValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div class="lbl">Par Value (Maturity)</div>
      </div>
      <div>
        <div class="num">$${order.discountPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div class="lbl">Settlement Purchase Price</div>
      </div>
      <div>
        <div class="num">+$${order.totalDiscount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div class="lbl">Discount Return (Interest)</div>
      </div>
      <div>
        <div class="num">${order.investmentYield.toFixed(2)}%</div>
        <div class="lbl">Annualized Investment Yield</div>
      </div>
    </div>
  </div>

  <div class="grid-2">
    <div class="box">
      <div class="box-title">Security Specifications</div>
      <div class="data-row">
        <span class="data-label">Security Description</span>
        <span class="data-val">United States Treasury Bill (${order.term})</span>
      </div>
      <div class="data-row">
        <span class="data-label">CUSIP</span>
        <span class="data-val">${order.cusip}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Discount Rate</span>
        <span class="data-val">${order.discountRate.toFixed(2)}%</span>
      </div>
      <div class="data-row">
        <span class="data-label">Investment Yield (CES)</span>
        <span class="data-val">${order.investmentYield.toFixed(2)}%</span>
      </div>
      <div class="data-row">
        <span class="data-label">Tax Exemption</span>
        <span class="data-val">100% Exempt from State/Local Tax</span>
      </div>
      <div class="data-row">
        <span class="data-label">Auto-Roll Reinvestment</span>
        <span class="data-val">${order.autoRoll ? 'Enabled (Auto Reinvest on Maturity)' : 'Disabled (Cash Credited on Maturity)'}</span>
      </div>
    </div>

    <div class="box">
      <div class="box-title">Tender & Settlement Details</div>
      <div class="data-row">
        <span class="data-label">Account Holder</span>
        <span class="data-val">${userName}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Funding Account</span>
        <span class="data-val">${order.fundingAccountName}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Tender Type</span>
        <span class="data-val">${order.tenderType} Tender</span>
      </div>
      <div class="data-row">
        <span class="data-label">Tender Date</span>
        <span class="data-val">${order.submittedAt}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Issue / Settlement Date</span>
        <span class="data-val">${order.settlementDate}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Maturity Date</span>
        <span class="data-val">${order.maturityDate}</span>
      </div>
    </div>
  </div>

  <div class="box" style="margin-bottom: 20px;">
    <div class="box-title">Order Status: ${order.status.toUpperCase()}</div>
    <p style="margin: 0; font-size: 10px; color: #444;">
      Your tender bid has been recorded with the Federal Reserve Bank / U.S. Treasury auction system under confirmation code <strong>${order.orderId}</strong>. On settlement date (${order.settlementDate}), your account ${order.fundingAccountName} will be charged the discounted purchase price of <strong>$${order.discountPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>, and the full par value of <strong>$${order.faceValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> will be credited at maturity on <strong>${order.maturityDate}</strong>.
    </p>
  </div>

  <div class="legal">
    <strong>DISCLOSURE AND DISCLAIMERS:</strong><br />
    Treasury Bills are direct short-term debt obligations issued by the United States Government and backed by its full faith and credit. Income earned is subject to federal income tax but is exempt from state and local income taxes. Investment and Insurance Products are: Not Insured by the FDIC or Any Federal Government Agency · Not a Deposit or Other Obligation of, or Guaranteed by, the Bank or Any Bank Affiliate · Subject to Investment Risks, Including Possible Loss of the Principal Amount Invested.<br />
    Wells Fargo Advisors is a trade name used by Wells Fargo Clearing Services, LLC (WFCS), Member SIPC, a registered broker-dealer and non-bank affiliate of Wells Fargo & Company. PM-09092027-5275964.
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

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
