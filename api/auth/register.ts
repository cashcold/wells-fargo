import { bankDb } from '../database';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { username, password, registrationData } = req.body || {};
    const regUsername = (username || registrationData?.username || '').trim();
    const regPassword = (password || registrationData?.password || '').trim();

    if (!regUsername) {
      return res.status(400).json({ success: false, error: 'Online banking username is required' });
    }

    if (!regPassword || regPassword.length < 4) {
      return res.status(400).json({ success: false, error: 'Password must be at least 4 characters long' });
    }

    // Check if username is already taken by another registered customer
    const existing = bankDb.findUserByUsername(regUsername);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `Username "${regUsername}" is already registered. Please sign on with your existing credentials or choose a different username.`,
      });
    }

    const user = bankDb.registerUser(regUsername, regPassword, registrationData);

    return res.status(201).json({
      success: true,
      message: 'Account successfully registered and saved to database with $0.00 balance',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, error: 'Failed to register account in database' });
  }
}
