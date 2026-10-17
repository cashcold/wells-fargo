import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import fargoHandler from './api/fargo.ts';
import healthHandler from './api/health.ts';
import loanHandler from './api/loan.ts';
import ratesHandler from './api/rates.ts';
import { bankDb } from './api/database.ts';
import {
  saveUserToMongo,
  getUserFromMongo,
  getAllUsersFromMongo,
  saveDepositToMongo,
  getAllDepositsFromMongo,
  updateDepositActionInMongo,
} from './api/mongo.ts';

dotenv.config();

const ADMIN_PASSWORD = 'admin12345@';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // --- INITIAL MONGODB ATLAS SYNCHRONIZATION ---
  try {
    await bankDb.syncWithMongo();
    console.log('MongoDB Atlas: Initial sync completed successfully.');
  } catch (err: any) {
    console.warn('MongoDB Atlas initial sync warning:', err.message);
  }

  // Live Heartbeat Sync: Keep memory and MongoDB Atlas in sync every 5 seconds
  setInterval(async () => {
    try {
      await bankDb.syncWithMongo();
    } catch {
      // safe heartbeat sync
    }
  }, 5000);

  // Mount existing API endpoints
  app.all('/api/fargo', (req, res) => fargoHandler(req, res));
  app.all('/api/health', (req, res) => healthHandler(req, res));
  app.all('/api/loan', (req, res) => loanHandler(req, res));
  app.all('/api/rates', (req, res) => ratesHandler(req, res));

  // --- REAL-WORLD BANKING DATABASE & AUTH ENDPOINTS ---

  // User Registration (Stores credentials, personal info, and opens $0.00 accounts in database & MongoDB Atlas)
  app.post('/api/auth/register', async (req, res) => {
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

      // Check if username is already taken in memory or MongoDB Atlas
      const localExisting = bankDb.findUserByUsername(regUsername);
      const mongoExisting = await getUserFromMongo(regUsername);
      if (localExisting && !mongoExisting) {
        // user exists locally
      }

      const user = bankDb.registerUser(regUsername, regPassword, registrationData);

      // Immediately persist to MongoDB Atlas cloud database
      await saveUserToMongo(user);

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
  });

  // Strict User Sign-On / Login (Only registered users with exact matching password can log in)
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body || {};
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

      // Normal User Lookup in local memory or MongoDB Atlas
      let user = bankDb.findUserByUsername(cleanUsername);
      if (!user) {
        const mongoUser = await getUserFromMongo(cleanUsername);
        if (mongoUser) {
          bankDb.registerUser(mongoUser.username, mongoUser.password, mongoUser.profile?.registrationData);
          user = bankDb.findUserByUsername(cleanUsername);
          if (user && mongoUser.profile) {
            user.profile = mongoUser.profile;
          }
        }
      }

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
  });

  // Get User Profile by ID or Username (MongoDB as heartbeat + local cache)
  app.get('/api/user/:userId', async (req, res) => {
    const { userId } = req.params;

    // First check MongoDB Atlas directly for freshest data
    try {
      const mongoUser = await getUserFromMongo(userId);
      if (mongoUser && mongoUser.profile) {
        // Keep bankDb in sync
        const local = bankDb.findUserByUsername(mongoUser.username) || bankDb.findUserById(mongoUser.id);
        if (local) {
          local.profile = mongoUser.profile;
          local.name = mongoUser.name || local.name;
        }
        return res.status(200).json({
          success: true,
          user: {
            id: mongoUser.id || mongoUser._id,
            username: mongoUser.username,
            name: mongoUser.name,
            role: mongoUser.role || 'customer',
            profile: mongoUser.profile,
          },
        });
      }
    } catch (e) {
      console.warn('MongoDB user lookup fallback to memory:', e);
    }

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
  });

  // Update User Profile (Writes to both local bankDb and MongoDB Atlas)
  app.put('/api/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const updated = bankDb.updateUserProfile(userId, req.body.profile || req.body);
    if (updated) {
      await saveUserToMongo(updated);
      return res.status(200).json({ success: true, user: updated });
    }

    // Try updating directly in MongoDB if not in memory
    const mongoUser = await getUserFromMongo(userId);
    if (mongoUser) {
      mongoUser.profile = { ...(mongoUser.profile || {}), ...(req.body.profile || req.body) };
      await saveUserToMongo(mongoUser);
      return res.status(200).json({ success: true, user: mongoUser });
    }

    return res.status(404).json({ error: 'User not found' });
  });

  // Submit Mobile Check / Funds Deposit (Status defaults to 'PENDING' review)
  app.post('/api/deposits', async (req, res) => {
    try {
      const { userId, userName, targetAccountId, targetAccountName, amount, frontImage, backImage } = req.body || {};

      if (!targetAccountId || !amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: 'Target account and valid amount are required' });
      }

      const numAmount = parseFloat(amount);
      const effectiveUserId = userId || 'usr-demo-01';
      const effectiveUserName = userName || 'Account Holder';

      const deposit = bankDb.addDeposit({
        userId: effectiveUserId,
        userName: effectiveUserName,
        targetAccountId,
        targetAccountName: targetAccountName || 'Checking Account',
        amount: numAmount,
        frontImage,
        backImage,
      });

      // Persist to MongoDB Atlas
      await saveDepositToMongo(deposit);

      return res.status(201).json({
        success: true,
        message: 'Deposit submitted successfully. Status is PENDING bank administrator approval.',
        deposit,
      });
    } catch (err: any) {
      console.error('Deposit error:', err);
      return res.status(500).json({ error: 'Failed to submit deposit' });
    }
  });

  // Get Deposits (Used by user or admin portal)
  app.get('/api/deposits', async (req, res) => {
    const mongoDeposits = await getAllDepositsFromMongo();
    const localDeposits = bankDb.getDeposits();
    const map = new Map<string, any>();
    localDeposits.forEach((d) => map.set(d.id, d));
    mongoDeposits.forEach((d) => map.set(d.id, { ...(map.get(d.id) || {}), ...d }));
    return res.status(200).json({ success: true, deposits: Array.from(map.values()) });
  });

  // --- ADMIN PORTAL ENDPOINTS (Secured with password: "admin12345@") ---

  // Admin Verification Route
  app.post('/api/admin/verify', (req, res) => {
    const { password } = req.body || {};
    if (password === ADMIN_PASSWORD) {
      return res.status(200).json({ success: true, message: 'Admin verified' });
    }
    return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  });

  // Get All Deposits for Admin Portal (Merged with MongoDB Atlas)
  app.get('/api/admin/deposits', async (req, res) => {
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
    if (adminKey !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized: Admin password required' });
    }

    const mongoDeposits = await getAllDepositsFromMongo();
    const localDeposits = bankDb.getDeposits();
    const map = new Map<string, any>();
    localDeposits.forEach((d) => map.set(d.id, d));
    mongoDeposits.forEach((d) => map.set(d.id, { ...(map.get(d.id) || {}), ...d }));

    return res.status(200).json({ success: true, deposits: Array.from(map.values()) });
  });

  // Approve or Reject Deposit (Changes status, and if approved credits the user's account in database & MongoDB Atlas)
  app.post('/api/admin/deposits/:depositId/action', async (req, res) => {
    const adminKey = req.headers['x-admin-key'] || req.body.adminKey;
    if (adminKey !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized: Admin password required' });
    }

    const { depositId } = req.params;
    const { action, note } = req.body || {};

    if (action === 'APPROVE') {
      const result = bankDb.approveDeposit(depositId, note || 'Approved by Bank Administrator');
      await updateDepositActionInMongo(depositId, 'APPROVED', note || 'Approved by Bank Administrator');
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json({
        success: true,
        message: `Deposit approved! $${result.deposit?.amount.toFixed(2)} credited to account.`,
        deposit: result.deposit,
        user: result.user,
      });
    } else if (action === 'REJECT') {
      const result = bankDb.rejectDeposit(depositId, note || 'Administrative verification rejected');
      await updateDepositActionInMongo(depositId, 'REJECTED', note || 'Administrative verification rejected');
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json({
        success: true,
        message: 'Deposit rejected by administrator.',
        deposit: result.deposit,
      });
    }

    return res.status(400).json({ error: 'Invalid action. Expected APPROVE or REJECT.' });
  });

  // Admin View All Registered Users in Database (Reads from MongoDB Atlas heartbeat + memory)
  app.get('/api/admin/users', async (req, res) => {
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
    if (adminKey !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized: Admin password required' });
    }

    // Read directly from MongoDB Atlas as primary heartbeat
    const mongoUsers = await getAllUsersFromMongo();
    const localUsers = bankDb.getAllUsers();

    const map = new Map<string, any>();
    localUsers.forEach((u) => {
      const key = (u.username || u.id).toLowerCase();
      map.set(key, u);
    });
    mongoUsers.forEach((u) => {
      const key = (u.username || u.id).toLowerCase();
      const existing = map.get(key);
      map.set(key, { ...existing, ...u });
    });

    return res.status(200).json({ success: true, users: Array.from(map.values()), source: 'mongodb_heartbeat' });
  });

  // Execute Transfer between accounts
  app.post('/api/transfers', async (req, res) => {
    try {
      const { userId, fromAccountId, toAccountId, amount, memo } = req.body || {};
      const result = bankDb.transferFunds(userId, fromAccountId, toAccountId, parseFloat(amount), memo);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      if (result.user) {
        await saveUserToMongo(result.user);
      }
      return res.status(200).json({ success: true, user: result.user });
    } catch (err: any) {
      return res.status(500).json({ error: 'Transfer failed' });
    }
  });

  // Submit Treasury Bill Tender (Debits account, saves holding)
  app.post('/api/treasury/tender', async (req, res) => {
    try {
      const { userId, order } = req.body || {};
      const result = bankDb.addTreasuryTender(userId, order);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      if (result.user) {
        await saveUserToMongo(result.user);
      }
      return res.status(200).json({ success: true, user: result.user });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to process Treasury tender' });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wells Fargo Bank Server running on http://localhost:${PORT}`);
  });
}

startServer();
