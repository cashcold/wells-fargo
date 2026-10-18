import { bankDb } from './database.ts';
import { getUserFromMongo, saveUserToMongo } from './mongo.ts';

export default async function handler(req: any, res: any) {
  const userId = req.query.userId || req.query.id;
  if (!userId) {
    return res.status(400).json({ error: 'User identifier is required' });
  }

  if (req.method === 'GET') {
    let user = bankDb.findUserById(userId) || bankDb.findUserByUsername(userId);
    if (!user) {
      user = await getUserFromMongo(userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id || (user as any)._id,
        username: user.username,
        name: user.name,
        role: user.role,
        profile: user.profile,
      },
    });
  }

  if (req.method === 'PUT') {
    const profileUpdate = req.body?.profile || req.body || {};
    const adminKey = req.headers['x-admin-key'];
    const ADMIN_PASSWORD = 'admin12345@';

    const existingLocal = bankDb.findUserById(userId) || bankDb.findUserByUsername(userId);
    let existingMongo = null;
    try {
      existingMongo = await getUserFromMongo(userId);
    } catch {}
    const existingUser = existingMongo || existingLocal;

    const existingPhoto =
      existingUser?.profile?.avatarUrl ||
      existingUser?.profile?.idPhotoUrl ||
      existingUser?.profile?.registrationData?.idPhotoUrl;

    const newPhoto =
      profileUpdate.avatarUrl ||
      profileUpdate.idPhotoUrl ||
      profileUpdate.registrationData?.idPhotoUrl;

    if (existingPhoto && newPhoto && newPhoto !== existingPhoto && adminKey !== ADMIN_PASSWORD) {
      return res.status(403).json({
        success: false,
        error:
          'Verified Customer Photo ID is locked for regulatory compliance. Account holders cannot change identity photos after account creation. Only a Bank Administrator can update this record.',
      });
    }

    const updated = bankDb.updateUserProfile(userId, profileUpdate);
    if (updated) {
      await saveUserToMongo(updated);
      return res.status(200).json({ success: true, user: updated });
    }

    // Try MongoDB directly
    const mongoUser = existingMongo || (await getUserFromMongo(userId));
    if (mongoUser) {
      mongoUser.profile = { ...(mongoUser.profile || {}), ...profileUpdate };
      await saveUserToMongo(mongoUser);
      return res.status(200).json({ success: true, user: mongoUser });
    }

    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
