import { bankDb } from './database.ts';

export default function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      const { userId, userName, targetAccountId, targetAccountName, amount, frontImage, backImage } = req.body || {};

      if (!targetAccountId || !amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: 'Target account and valid amount are required' });
      }

      const deposit = bankDb.addDeposit({
        userId: userId || 'unknown-user',
        userName: userName || 'Account Holder',
        targetAccountId,
        targetAccountName: targetAccountName || 'EVERYDAY CHECKING',
        amount: parseFloat(amount),
        frontImage: frontImage || '',
        backImage: backImage || '',
      });

      return res.status(201).json({
        success: true,
        deposit,
        message: 'Deposit submitted for bank processing. Status is PENDING verification.',
      });
    } catch (err: any) {
      console.error('Deposit error:', err);
      return res.status(500).json({ error: 'Deposit processing failed' });
    }
  }

  if (req.method === 'GET') {
    const deposits = bankDb.getDeposits();
    return res.status(200).json({ deposits });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
