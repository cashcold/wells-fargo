import express from 'express';
import dotenv from 'dotenv';
import { bankDb } from './database.ts';
import {
  saveUserToMongo,
  getUserFromMongo,
  getAllUsersFromMongo,
  saveDepositToMongo,
  getAllDepositsFromMongo,
  updateDepositActionInMongo,
} from './mongo.ts';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const ADMIN_PASSWORD = 'admin12345@';

export const app = express();

app.use(express.json({ limit: '10mb' }));

// Initial MongoDB sync
bankDb.syncWithMongo().catch((err) => {
  console.warn('Initial MongoDB Atlas sync warning:', err.message);
});

// Live Heartbeat Sync
setInterval(async () => {
  try {
    await bankDb.syncWithMongo();
  } catch {
    // safe background heartbeat
  }
}, 5000);

// --- HEALTH CHECK ---
app.all(['/api/health', '/health'], (_req, res) => {
  return res.status(200).json({
    status: 'ok',
    mode: 'serverless-consolidated',
    provider: 'Vercel Serverless Functions',
    service: 'Wells Fargo Serverless Banking API',
    timestamp: new Date().toISOString(),
  });
});

// --- INTEREST & PRODUCT RATES ---
app.all(['/api/rates', '/rates'], (_req, res) => {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  return res.status(200).json({
    updatedAt: new Date().toISOString(),
    institution: 'Wells Fargo Bank, N.A.',
    fdicInsured: true,
    depositRates: [
      { product: 'Everyday Checking', apy: 0.01, minBalance: 25 },
      { product: 'Way2Save Savings', apy: 0.15, minBalance: 25 },
      { product: 'Platinum Savings', apy: 0.25, minBalance: 10000 },
      { product: 'Time CD (7-Month Special)', apy: 4.50, minBalance: 5000 },
      { product: 'Time CD (11-Month Special)', apy: 4.75, minBalance: 5000 },
    ],
    lendingRates: [
      { product: 'Commercial & Executive Loan', apr: 5.49, minAmount: 700, maxAmount: 100000000 },
      { product: 'Wells Fargo Corporate Line', apr: 4.99, minAmount: 700, maxAmount: 100000000 },
      { product: 'Jumbo Real Estate Mortgage', apr: 5.99, minAmount: 700, maxAmount: 100000000 },
      { product: 'Personal Signature Credit', apr: 6.99, minAmount: 700, maxAmount: 100000 },
    ],
    treasuryRates: [
      { product: '4-Week U.S. Treasury Bill', discountRate: 5.28, investmentYield: 5.39, minPurchase: 1000 },
      { product: '8-Week U.S. Treasury Bill', discountRate: 5.24, investmentYield: 5.35, minPurchase: 1000 },
      { product: '13-Week U.S. Treasury Bill', discountRate: 5.18, investmentYield: 5.32, minPurchase: 1000 },
      { product: '26-Week U.S. Treasury Bill', discountRate: 5.08, investmentYield: 5.27, minPurchase: 1000 },
      { product: '52-Week U.S. Treasury Bill', discountRate: 4.88, investmentYield: 5.13, minPurchase: 1000 },
    ],
  });
});

// --- LOAN CONFIGURATOR ---
app.all(['/api/loan', '/loan'], (req, res) => {
  const body = req.body || {};
  const query = req.query || {};

  const amount = Number(body.amount ?? query.amount ?? 3000);
  const termMonths = Number(body.termMonths ?? query.termMonths ?? 60);
  const loanType = String(body.loanType ?? query.loanType ?? 'commercial');

  const MIN_LOAN = 700;
  const MAX_LOAN = 100000000;

  if (isNaN(amount) || amount < MIN_LOAN) {
    return res.status(400).json({
      error: `Loan amount must be at least $${MIN_LOAN.toLocaleString()} USD`,
      minAmount: MIN_LOAN,
    });
  }

  if (amount > MAX_LOAN) {
    return res.status(400).json({
      error: `Loan amount cannot exceed $${MAX_LOAN.toLocaleString()} USD`,
      maxAmount: MAX_LOAN,
    });
  }

  let apr = 5.49;
  if (loanType === 'personal') apr = 6.99;
  else if (loanType === 'real-estate') apr = 5.99;
  else if (loanType === 'corporate') apr = 4.99;

  const monthlyRate = apr / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (amount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)
      : amount / termMonths;

  const totalRepayment = monthlyPayment * termMonths;
  const totalInterest = Math.max(0, totalRepayment - amount);

  return res.status(200).json({
    success: true,
    loanAmount: amount,
    termMonths,
    apr,
    loanType,
    minLimit: MIN_LOAN,
    maxLimit: MAX_LOAN,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    disclosures: {
      regulation: 'Truth in Lending Act (Regulation Z)',
      formCode: 'TILA-WF-2026',
      prepaymentPenalty: false,
    },
  });
});

// --- FARGO AI ASSISTANT ---
app.all(['/api/fargo', '/fargo'], async (req, res) => {
  const { message, userContext } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are Fargo, Wells Fargo's AI banking assistant.
The customer's name is ${userContext?.name || 'Customer'}.
Available accounts:
- Everyday Checking (balance: $${userContext?.checkingBalance ?? '0.00'})
- Way2Save Savings (balance: $${userContext?.savingsBalance ?? '0.00'})
- Active Cash Credit
- Wells Fargo Auto & Personal Loan

Bank Details:
- Routing number: 061000227
- Loan ranges: Minimum loan starts from $700.00 USD up to $100,000,000.00 USD (100 Million)
- Mobile check deposit: Available 24/7 with a $5,000.00 daily limit and $15,000.00 30-day limit
- Set Aside: Reserves money for upcoming bills

Provide a clear, helpful, professional, and friendly response (under 3 sentences).
User message: "${message}"`;

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini timeout')), 10000)
      );

      const geminiPromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const response: any = await Promise.race([geminiPromise, timeoutPromise]);
      const replyText = response.text || "I'm Fargo, your Wells Fargo virtual assistant. How can I help you today?";

      return res.status(200).json({
        reply: replyText,
        source: 'gemini-serverless',
      });
    } catch (err: any) {
      console.warn('Gemini serverless execution fallback:', err?.message);
    }
  }

  // Rules fallback
  const lower = message.toLowerCase();
  let reply = `Hello ${userContext?.name || 'there'}! I'm Fargo, your Wells Fargo virtual assistant.`;
  let action: any = undefined;

  if (lower.includes('routing') || lower.includes('account number')) {
    reply = `Your Wells Fargo routing number is 061000227. Check your accounts tab for your specific account numbers.`;
    action = { label: 'View Accounts', tab: 'accounts' };
  } else if (lower.includes('loan') || lower.includes('borrow') || lower.includes('credit line') || lower.includes('limit')) {
    reply = `You can configure your Wells Fargo loan starting from $700.00 USD up to our highest allowable facility of $100,000,000.00 USD (100 Million) with instant Truth-in-Lending PDF generation.`;
    action = { label: 'Configure Loans', tab: 'loans' };
  } else if (lower.includes('deposit') || lower.includes('check')) {
    reply = `You can deposit paper checks in seconds using Wells Fargo Mobile Deposit! Deposits are verified and approved by Bank Operations before credit.`;
    action = { label: 'Deposit Checks', tab: 'deposit' };
  } else if (lower.includes('treasury') || lower.includes('t-bill') || lower.includes('tbill') || (lower.includes('bill') && lower.includes('appear')) || lower.includes('auction')) {
    reply = `You can appear for U.S. Treasury Bill auctions (4-wk, 8-wk, 13-wk, 26-wk) directly through Wells Fargo Advisors with $0 commission. Rates currently range from 5.08% to 5.28% and are 100% exempt from state and local taxes.`;
    action = { label: 'Appear for Treasury Bill', tab: 'treasury' };
  } else if (lower.includes('wellstrade') || lower.includes('brokerage') || lower.includes('ira') || lower.includes('roth')) {
    reply = `Choose from WellsTrade Standard Account, Traditional IRA, or Roth IRA with $0 online stock/ETF trades, Treasury bill access, and Brokerage Cash Services.`;
    action = { label: 'Choose WellsTrade Account', tab: 'wellstrade' };
  } else if (lower.includes('bill') || lower.includes('set aside') || lower.includes('save')) {
    reply = `With Set Aside, we automatically reserve funds in your account for upcoming bills so you never accidentally spend what is owed!`;
    action = { label: 'View Set Aside', tab: 'setaside' };
  } else if (lower.includes('balance') || lower.includes('how much')) {
    reply = `Your total available balance across accounts is $${userContext?.totalBalance ?? '0.00'}. Everyday Checking has $${userContext?.checkingBalance ?? '0.00'}.`;
    action = { label: 'View Balances', tab: 'accounts' };
  } else {
    reply = `I can help you review balances, appear for U.S. Treasury Bill auctions, choose a WellsTrade account, manage Set Aside bills, or configure loans (from $700 up to $100M). What would you like to explore?`;
  }

  return res.status(200).json({
    reply,
    action,
    source: 'serverless-rules',
  });
});

// --- USER REGISTRATION ---
app.post(['/api/auth/register', '/auth/register'], async (req, res) => {
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

    const user = bankDb.registerUser(regUsername, regPassword, registrationData);

    // Save directly to MongoDB Atlas
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

// --- USER LOGIN ---
app.post(['/api/auth/login', '/auth/login'], async (req, res) => {
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

    // Admin login
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

    // Lookup user in local memory or MongoDB Atlas
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

// --- USER PROFILE ---
app.get(['/api/user/:userId', '/user/:userId'], async (req, res) => {
  const { userId } = req.params;

  try {
    const mongoUser = await getUserFromMongo(userId);
    if (mongoUser && mongoUser.profile) {
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
    console.warn('MongoDB lookup fallback:', e);
  }

  let user = bankDb.findUserById(userId) || bankDb.findUserByUsername(userId);
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

app.put(['/api/user/:userId', '/user/:userId'], async (req, res) => {
  const { userId } = req.params;
  const updated = bankDb.updateUserProfile(userId, req.body.profile || req.body);
  if (updated) {
    await saveUserToMongo(updated);
    return res.status(200).json({ success: true, user: updated });
  }

  const mongoUser = await getUserFromMongo(userId);
  if (mongoUser) {
    mongoUser.profile = { ...(mongoUser.profile || {}), ...(req.body.profile || req.body) };
    await saveUserToMongo(mongoUser);
    return res.status(200).json({ success: true, user: mongoUser });
  }

  return res.status(404).json({ error: 'User not found' });
});

// --- DEPOSITS ---
app.post(['/api/deposits', '/deposits'], async (req, res) => {
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

app.get(['/api/deposits', '/deposits'], async (_req, res) => {
  const mongoDeposits = await getAllDepositsFromMongo();
  const localDeposits = bankDb.getDeposits();
  const map = new Map<string, any>();
  localDeposits.forEach((d) => map.set(d.id, d));
  mongoDeposits.forEach((d) => map.set(d.id, { ...(map.get(d.id) || {}), ...d }));
  return res.status(200).json({ success: true, deposits: Array.from(map.values()) });
});

// --- ADMIN PORTAL ---
app.post(['/api/admin/verify', '/admin/verify'], (req, res) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASSWORD) {
    return res.status(200).json({ success: true, message: 'Admin verified' });
  }
  return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
});

app.get(['/api/admin/deposits', '/admin/deposits'], async (req, res) => {
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

app.post(['/api/admin/deposits/:depositId/action', '/admin/deposits/:depositId/action'], async (req, res) => {
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

app.get(['/api/admin/users', '/admin/users'], async (req, res) => {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  if (adminKey !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized: Admin password required' });
  }

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

// --- TRANSFERS ---
app.post(['/api/transfers', '/transfers'], async (req, res) => {
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

// --- TREASURY TENDER ---
app.post(['/api/treasury/tender', '/treasury/tender'], async (req, res) => {
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
