import { bankDb } from '../database.ts';

const ADMIN_PASSWORD = 'admin12345@';

export default function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const adminKey =
    req.headers['x-admin-key'] ||
    (req.headers.authorization || '').replace('Bearer ', '').trim() ||
    req.query.adminKey ||
    req.query.key;

  if (adminKey !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Admin credentials required' });
  }

  try {
    const deposits = bankDb.getDeposits();
    return res.status(200).json({ success: true, deposits });
  } catch (err: any) {
    console.error('Failed to get deposits for admin:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve deposits' });
  }
}
