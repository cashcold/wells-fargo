import { bankDb } from '../database.ts';

const ADMIN_PASSWORD = 'admin12345@';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // use as-is
      }
    }
    const { username, password } = body || {};
    if (!username || !username.trim()) {
      return res.status(400).json({ success: false, error: 'Username is required' });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({ success: false, error: 'Password is required' });
    }

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // Check for Admin Login
    if (cleanUsername.toLowerCase() === 'admin') {
      if (cleanPassword === ADMIN_PASSWORD) {
        return res.status(200).json({
          success: true,
          isAdmin: true,
          role: 'admin',
          message: 'Administrative authentication successful',
        });
      } else {
        return res.status(401).json({
          success: false,
          error: 'Invalid administrator credentials. Please check your password.',
        });
      }
    }

    // Normal User Lookup in database
    const user = bankDb.findUserByUsername(cleanUsername);

    // User does NOT exist in database
    if (!user) {
      return res.status(401).json({
        success: false,
        error: `Account not found for "${cleanUsername}". This user is not registered in our database. Please click "Enroll" to register.`,
      });
    }

    // Password does NOT match
    if (!user.password || user.password !== cleanPassword) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password. Please verify your password and try again.',
      });
    }

    // Successful verified login
    return res.status(200).json({
      success: true,
      isAdmin: false,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Authentication service error' });
  }
}
