export default function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).json({
    updatedAt: new Date().toISOString(),
    institution: 'Wells Fargo Bank, N.A.',
    fdicInsured: true,
    depositRates: [
      { product: 'Everyday Checking', apy: 0.01, minBalance: 25 },
      { product: 'Way2Save Savings', apy: 0.15, minBalance: 25 },
      { product: 'Platinum Savings', apy: 0.25, minBalance: 10000 },
      { product: 'Time CD (7-Month Special)', apy: 4.50, minBalance: 5000 },
      { product: 'Time CD (11-Month Special)', apy: 4.75, minBalance: 5000 },
    ],
    lendingRates: [
      { product: 'Commercial & Executive Loan', apr: 5.49, minAmount: 700, maxAmount: 100000000 },
      { product: 'Wells Fargo Corporate Line', apr: 4.99, minAmount: 700, maxAmount: 100000000 },
      { product: 'Jumbo Real Estate Mortgage', apr: 5.99, minAmount: 700, maxAmount: 100000000 },
      { product: 'Personal Signature Credit', apr: 6.99, minAmount: 700, maxAmount: 100000 },
    ],
    treasuryRates: [
      { product: '4-Week U.S. Treasury Bill', discountRate: 5.28, investmentYield: 5.39, minPurchase: 1000 },
      { product: '8-Week U.S. Treasury Bill', discountRate: 5.24, investmentYield: 5.35, minPurchase: 1000 },
      { product: '13-Week U.S. Treasury Bill', discountRate: 5.18, investmentYield: 5.32, minPurchase: 1000 },
      { product: '26-Week U.S. Treasury Bill', discountRate: 5.08, investmentYield: 5.27, minPurchase: 1000 },
      { product: '52-Week U.S. Treasury Bill', discountRate: 4.88, investmentYield: 5.13, minPurchase: 1000 },
    ],
  });
}
