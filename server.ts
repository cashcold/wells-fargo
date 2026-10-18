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
  getMongoDb,
} from './api/mongo.ts';

dotenv.config();

const ADMIN_PASSWORD = 'admin12345@';

async function startServer() {
  const app = express();

  // Parse port from CLI flags (--port 3000) or process.env.PORT, default to 3000
  let port = 3000;
  if (process.env.PORT) {
    port = parseInt(process.env.PORT, 10);
  }
  const portIndex = process.argv.indexOf('--port');
  if (portIndex !== -1 && process.argv[portIndex + 1]) {
    port = parseInt(process.argv[portIndex + 1], 10);
  }

  app.use(express.json({ limit: '15mb' }));

  // Non-blocking MongoDB connection heartbeat check
  getMongoDb()
    .then(() => console.log('🟢 MongoDB Atlas Heartbeat: Connected to "WellsFargo" database.'))
    .catch((err) => console.warn('⚠️ MongoDB Atlas warning:', err.message));

  // Mount existing API endpoints
  app.all('/api/fargo', (req, res) => fargoHandler(req, res));
  app.all('/api/health', (req, res) => healthHandler(req, res));
  app.all('/api/loan', (req, res) => loanHandler(req, res));
  app.all('/api/rates', (req, res) => ratesHandler(req, res));

  // --- MONGODB ATLAS CLOUD DATA HEARTBEAT ENDPOINTS ---

  // User Registration: Saves directly to MongoDB Atlas
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

      // Check if user already exists in MongoDB Atlas or local store
      const mongoExisting = await getUserFromMongo(regUsername);
      const localExisting = bankDb.findUserByUsername(regUsername);
      if (mongoExisting || localExisting) {
        return res.status(409).json({
          success: false,
          error: `Username "${regUsername}" is already registered. Please sign on with your existing credentials or choose a different username.`,
        });
      }

      // Register user and immediately push to MongoDB Atlas
      const user = bankDb.registerUser(regUsername, regPassword, registrationData);
      await saveUserToMongo(user);

      return res.status(201).json({
        success: true,
        message: 'Account successfully registered and saved to MongoDB Atlas with $0.00 balance',
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

  // User Sign-On / Login: Authenticates against MongoDB Atlas
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

      // Query user from MongoDB Atlas first, then local fallback
      let user = await getUserFromMongo(cleanUsername);
      if (!user) {
        user = bankDb.findUserByUsername(cleanUsername);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          error: `Account not found for "${cleanUsername}". This user is not registered in our database. Please click "Enroll" to register.`,
        });
      }

      if (!user.password || user.password !== cleanPassword) {
        return res.status(401).json({
          success: false,
          error: 'Incorrect password. Please verify your password and try again.',
        });
      }

      return res.status(200).json({
        success: true,
        isAdmin: false,
        user: {
          id: user.id || user._id,
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

  // Get User Profile: Retrieves from MongoDB Atlas
  app.get('/api/user/:userId', async (req, res) => {
    const { userId } = req.params;
    let user = await getUserFromMongo(userId);
    if (!user) {
      user = bankDb.findUserById(userId) || bankDb.findUserByUsername(userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id || user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        profile: user.profile,
      },
    });
  });

  // Update User Profile: Persists to MongoDB Atlas (Customer cannot change photo once set)
  app.put('/api/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const profileUpdate = req.body.profile || req.body;
    const adminKey = req.headers['x-admin-key'];

    // Check if the user already has a verified photo ID
    const existingMongo = await getUserFromMongo(userId);
    const existingLocal = bankDb.findUserById(userId) || bankDb.findUserByUsername(userId);
    const existingUser = existingMongo || existingLocal;

    const existingPhoto =
      existingUser?.profile?.avatarUrl ||
      existingUser?.profile?.idPhotoUrl ||
      existingUser?.profile?.registrationData?.idPhotoUrl;

    const newPhoto =
      profileUpdate.avatarUrl ||
      profileUpdate.idPhotoUrl ||
      profileUpdate.registrationData?.idPhotoUrl;

    // If customer tries to change an already-locked photo without admin authorization
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

    if (existingMongo) {
      existingMongo.profile = { ...(existingMongo.profile || {}), ...profileUpdate };
      await saveUserToMongo(existingMongo);
      return res.status(200).json({ success: true, user: existingMongo });
    }

    return res.status(404).json({ error: 'User not found' });
  });

  // Submit Mobile Check / Funds Deposit: Saves to MongoDB Atlas
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

  // Get Deposits from MongoDB Atlas
  app.get('/api/deposits', async (_req, res) => {
    try {
      const mongoDeposits = await getAllDepositsFromMongo();
      if (mongoDeposits && mongoDeposits.length > 0) {
        return res.status(200).json({ success: true, deposits: mongoDeposits });
      }
      const deposits = bankDb.getDeposits();
      return res.status(200).json({ success: true, deposits });
    } catch {
      return res.status(200).json({ success: true, deposits: bankDb.getDeposits() });
    }
  });

  // --- ADMIN PORTAL ENDPOINTS ---

  app.post('/api/admin/verify', (req, res) => {
    const { password } = req.body || {};
    if (password === ADMIN_PASSWORD) {
      return res.status(200).json({ success: true, message: 'Admin verified' });
    }
    return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  });

  // Admin View All Deposits from MongoDB Atlas
  app.get('/api/admin/deposits', async (req, res) => {
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
    if (adminKey !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized: Admin password required' });
    }

    try {
      const mongoDeposits = await getAllDepositsFromMongo();
      const localDeposits = bankDb.getDeposits();
      const map = new Map<string, any>();
      localDeposits.forEach((d) => map.set(d.id, d));
      mongoDeposits.forEach((d) => map.set(d.id, { ...map.get(d.id), ...d }));
      return res.status(200).json({ success: true, deposits: Array.from(map.values()) });
    } catch {
      return res.status(200).json({ success: true, deposits: bankDb.getDeposits() });
    }
  });

  // Admin Approve or Reject Deposit: Updates MongoDB Atlas directly
  app.post('/api/admin/deposits/:depositId/action', async (req, res) => {
    const adminKey = req.headers['x-admin-key'] || req.body.adminKey;
    if (adminKey !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized: Admin password required' });
    }

    const { depositId } = req.params;
    const { action, note } = req.body || {};

    if (action === 'APPROVE') {
      const result = bankDb.approveDeposit(depositId, note || 'Approved by Bank Administrator');
      await updateDepositActionInMongo(depositId, 'APPROVED', note || 'Approved by Bank Administrator', 'Bank Admin');
      return res.status(200).json({
        success: true,
        message: `Deposit approved! $${result.deposit?.amount.toFixed(2)} credited to account.`,
        deposit: result.deposit,
        user: result.user,
      });
    } else if (action === 'REJECT') {
      const result = bankDb.rejectDeposit(depositId, note || 'Administrative verification rejected');
      await updateDepositActionInMongo(depositId, 'REJECTED', note || 'Administrative verification rejected', 'Bank Admin');
      return res.status(200).json({
        success: true,
        message: 'Deposit rejected by administrator.',
        deposit: result.deposit,
      });
    }

    return res.status(400).json({ error: 'Invalid action. Expected APPROVE or REJECT.' });
  });

  // Admin View All Registered Users: Fetches live directly from MongoDB Atlas
  app.get('/api/admin/users', async (req, res) => {
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
    if (adminKey !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized: Admin password required' });
    }

    try {
      const mongoUsers = await getAllUsersFromMongo();
      const localUsers = bankDb.getAllUsers();
      const map = new Map<string, any>();

      localUsers.forEach((u) => {
        if (u && u.username) map.set(u.username.toLowerCase(), u);
      });
      mongoUsers.forEach((u) => {
        if (u && u.username) {
          const key = u.username.toLowerCase();
          map.set(key, { ...map.get(key), ...u });
        }
      });

      const users = Array.from(map.values()).map((u) => ({
        id: u.id || u._id,
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

      return res.status(200).json({ success: true, users, source: 'mongodb' });
    } catch (err: any) {
      console.error('Failed to load admin users:', err);
      return res.status(200).json({ success: true, users: bankDb.getAllUsers() });
    }
  });

  // Admin Override: Update Customer Identification Photo in MongoDB Atlas
  app.post('/api/admin/users/:userId/photo', async (req, res) => {
    const adminKey = req.headers['x-admin-key'] || req.body.adminKey;
    if (adminKey !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized: Admin password required' });
    }

    const { userId } = req.params;
    const { photoUrl } = req.body || {};
    if (!photoUrl) {
      return res.status(400).json({ error: 'photoUrl is required' });
    }

    const localUser = bankDb.findUserById(userId) || bankDb.findUserByUsername(userId);
    let mongoUser = await getUserFromMongo(userId);
    if (!mongoUser && localUser) {
      mongoUser = await getUserFromMongo(localUser.username);
    }

    const targetUser = mongoUser || localUser;
    if (!targetUser) {
      return res.status(404).json({ error: 'Customer account not found in database' });
    }

    const profileUpdate = {
      avatarUrl: photoUrl,
      idPhotoUrl: photoUrl,
      registrationData: {
        ...(targetUser.profile?.registrationData || {}),
        idPhotoUrl: photoUrl,
      },
    };

    const updatedLocal = bankDb.updateUserProfile(targetUser.id, profileUpdate);
    if (mongoUser) {
      mongoUser.profile = { ...(mongoUser.profile || {}), ...profileUpdate };
      mongoUser.avatarUrl = photoUrl;
      mongoUser.idPhotoUrl = photoUrl;
      await saveUserToMongo(mongoUser);
    } else if (updatedLocal) {
      await saveUserToMongo(updatedLocal);
    }

    return res.status(200).json({
      success: true,
      message: 'Customer photo successfully updated by Administrator and persisted to database.',
      user: mongoUser || updatedLocal,
    });
  });

  // Execute Transfer between accounts
  app.post('/api/transfers', (req, res) => {
    try {
      const { userId, fromAccountId, toAccountId, amount, memo } = req.body || {};
      const result = bankDb.transferFunds(userId, fromAccountId, toAccountId, parseFloat(amount), memo);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json({ success: true, user: result.user });
    } catch (err: any) {
      return res.status(500).json({ error: 'Transfer failed' });
    }
  });

  // Submit Treasury Bill Tender (Debits account, saves holding)
  app.post('/api/treasury/tender', (req, res) => {
    try {
      const { userId, order } = req.body || {};
      const result = bankDb.addTreasuryTender(userId, order);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
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
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Server is running at http://0.0.0.0:${port}`);
  });
}

startServer();
