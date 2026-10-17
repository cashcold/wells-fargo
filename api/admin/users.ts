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
    const users = bankDb.getAllUsers().map((u) => ({
      id: u.id,
      username: u.username,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      createdAt: u.createdAt,
      totalBalance: (u.profile?.accounts || []).reduce(
        (sum: number, a: any) => sum + (Number(a.availableBalance) || 0),
        0
      ),
      accountsCount: (u.profile?.accounts || []).length,
      profile: u.profile,
    }));

    return res.status(200).json({ success: true, users });
  } catch (err: any) {
    console.error('Failed to get users for admin:', err);
    return res.status(500).json({ success: false, error: 'Database query failed' });
  }
}
