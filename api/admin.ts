import { bankDb } from './database.ts';

const ADMIN_PASSWORD = 'admin12345@';

export default function handler(req: any, res: any) {
  const adminKey =
    req.headers['x-admin-key'] ||
    (req.headers.authorization || '').replace('Bearer ', '').trim() ||
    req.query.adminKey ||
    req.query.key;

  if (adminKey !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }

  const action = req.query.action;
  if (action === 'users') {
    const users = bankDb.getAllUsers().map((u) => ({
      id: u.id,
      username: u.username,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      createdAt: u.createdAt,
      totalBalance: u.profile.accounts.reduce((sum, a) => sum + (a.availableBalance || 0), 0),
      accountsCount: u.profile.accounts.length,
      profile: u.profile,
    }));
    return res.status(200).json({ users });
  }

  if (action === 'deposits') {
    const deposits = bankDb.getDeposits();
    return res.status(200).json({ deposits });
  }

  return res.status(400).json({ error: 'Action parameter (users | deposits) required' });
}
