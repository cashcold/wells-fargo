import { bankDb } from '../database.ts';
import { getAllUsersFromMongo } from '../mongo.ts';

const ADMIN_PASSWORD = 'admin12345@';

export default async function handler(req: any, res: any) {
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
    // 1. Fetch live from MongoDB Atlas
    let mongoUsers = await getAllUsersFromMongo();

    // 2. Fallback or merge with in-memory bankDb
    const localUsers = bankDb.getAllUsers();
    const userMap = new Map<string, any>();

    localUsers.forEach((u) => {
      if (u && u.username) {
        userMap.set(u.username.toLowerCase(), u);
      }
    });

    mongoUsers.forEach((u) => {
      if (u && u.username) {
        const key = u.username.toLowerCase();
        const existing = userMap.get(key);
        userMap.set(key, { ...existing, ...u });
      }
    });

    const allMerged = Array.from(userMap.values());
    const users = allMerged.map((u) => ({
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

    return res.status(200).json({ success: true, users, source: 'mongodb+memory' });
  } catch (err: any) {
    console.error('Failed to get users for admin:', err);
    return res.status(500).json({ success: false, error: 'Database query failed' });
  }
}
