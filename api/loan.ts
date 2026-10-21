export default function handler(req: any, res: any) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const query = req.query || {};

  const amount = Number(body.amount ?? query.amount ?? 3000);
  const termMonths = Number(body.termMonths ?? query.termMonths ?? 60);
  const loanType = String(body.loanType ?? query.loanType ?? 'commercial');

  const MIN_LOAN = 700;
  const MAX_LOAN = 100000000;

  if (isNaN(amount) || amount < MIN_LOAN) {
    return res.status(400).json({
      error: `Loan amount must be at least $${MIN_LOAN.toLocaleString()} USD`,
      minAmount: MIN_LOAN,
    });
  }

  if (amount > MAX_LOAN) {
    return res.status(400).json({
      error: `Loan amount cannot exceed $${MAX_LOAN.toLocaleString()} USD`,
      maxAmount: MAX_LOAN,
    });
  }

  let apr = 5.49;
  if (loanType === 'personal') apr = 6.99;
  else if (loanType === 'real-estate') apr = 5.99;
  else if (loanType === 'corporate') apr = 4.99;

  const monthlyRate = apr / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (amount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)
      : amount / termMonths;

  const totalRepayment = monthlyPayment * termMonths;
  const totalInterest = Math.max(0, totalRepayment - amount);

  return res.status(200).json({
    success: true,
    loanAmount: amount,
    termMonths,
    apr,
    loanType,
    minLimit: MIN_LOAN,
    maxLimit: MAX_LOAN,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    disclosures: {
      regulation: 'Truth in Lending Act (Regulation Z)',
      formCode: 'TILA-WF-2026',
      prepaymentPenalty: false,
    },
  });
}
