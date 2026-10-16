import { bankDb } from './database.ts';

export default function handler(req: any, res: any) {
  const userId = req.query.userId || req.query.id;
  if (!userId) {
    return res.status(400).json({ error: 'User identifier is required' });
  }

  if (req.method === 'GET') {
    let user = bankDb.findUserById(userId);
    if (!user) {
      user = bankDb.findUserByUsername(userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        profile: user.profile,
      },
    });
  }

  if (req.method === 'PUT') {
    const updated = bankDb.updateUserProfile(userId, req.body?.profile || req.body);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ success: true, user: updated });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
