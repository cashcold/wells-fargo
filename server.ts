import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import fargoHandler from './api/fargo.ts';
import healthHandler from './api/health.ts';
import loanHandler from './api/loan.ts';
import ratesHandler from './api/rates.ts';
import { bankDb } from './api/database.ts';

dotenv.config();

const ADMIN_PASSWORD = 'admin12345@';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // Mount existing API endpoints
  app.all('/api/fargo', (req, res) => fargoHandler(req, res));
  app.all('/api/health', (req, res) => healthHandler(req, res));
  app.all('/api/loan', (req, res) => loanHandler(req, res));
  app.all('/api/rates', (req, res) => ratesHandler(req, res));

  // --- REAL-WORLD BANKING DATABASE & AUTH ENDPOINTS ---

  // User Registration (Stores credentials, personal info, and opens $0.00 accounts in database)
  app.post('/api/auth/register', (req, res) => {
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
  });

  // Strict User Sign-On / Login (Only registered users with exact matching password can log in)
  app.post('/api/auth/login', (req, res) => {
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
  });

  // Get User Profile by ID or Username
  app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params;
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

  // Update User Profile
  app.put('/api/user/:userId', (req, res) => {
    const { userId } = req.params;
    const updated = bankDb.updateUserProfile(userId, req.body.profile || req.body);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ success: true, user: updated });
  });

  // Submit Mobile Check / Funds Deposit (Status defaults to 'PENDING' review)
  app.post('/api/deposits', (req, res) => {
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
  app.get('/api/deposits', (req, res) => {
    const deposits = bankDb.getDeposits();
    return res.status(200).json({ success: true, deposits });
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

  // Get All Deposits for Admin Portal
  app.get('/api/admin/deposits', (req, res) => {
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
    if (adminKey !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized: Admin password required' });
    }

    const deposits = bankDb.getDeposits();
    return res.status(200).json({ success: true, deposits });
  });

  // Approve or Reject Deposit (Changes status, and if approved credits the user's account in database)
  app.post('/api/admin/deposits/:depositId/action', (req, res) => {
    const adminKey = req.headers['x-admin-key'] || req.body.adminKey;
    if (adminKey !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized: Admin password required' });
    }

    const { depositId } = req.params;
    const { action, note } = req.body || {};

    if (action === 'APPROVE') {
      const result = bankDb.approveDeposit(depositId, note || 'Approved by Bank Administrator');
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

  // Admin View All Registered Users in Database
  app.get('/api/admin/users', (req, res) => {
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
    if (adminKey !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized: Admin password required' });
    }

    const users = bankDb.getAllUsers();
    return res.status(200).json({ success: true, users });
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
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
