import fs from 'fs';
import path from 'path';
import os from 'os';
import type { BankAccount, UserProfile, CheckDepositRecord, TreasuryTenderOrder, EnrollmentFormData } from '../src/types/banking.ts';
import { FRANK_AVATAR_BASE64 } from '../src/data/frankAvatar.ts';
import {
  saveUserToMongo,
  saveDepositToMongo,
  updateDepositActionInMongo,
  getAllUsersFromMongo,
  getAllDepositsFromMongo,
} from './mongo.ts';

export interface StoredDeposit {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  targetAccountId: string;
  targetAccountName: string;
  amount: number;
  confirmationNumber: string;
  date: string;
  frontImage: string;
  backImage: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  processedAt?: string;
  processedBy?: string;
}

export interface StoredUser {
  id: string;
  username: string;
  password?: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
  role: 'customer' | 'admin';
  profile: UserProfile;
}

export interface DatabaseSchema {
  users: Record<string, StoredUser>;
  deposits: StoredDeposit[];
  version: number;
}

// In Vercel serverless / AWS Lambda, the root is read-only except /tmp
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DB_DIR = isServerless ? os.tmpdir() : path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'bank_database.json');
const ROOT_SEED_FILE = path.resolve(process.cwd(), 'data', 'bank_database.json');

// Helper to create empty zero-balance accounts for a new user
export function createZeroBalanceAccounts(userName: string, offerCode = 'JA23OU'): BankAccount[] {
  const checkingNum = Math.floor(1000 + Math.random() * 9000).toString();
  const savingsNum = Math.floor(1000 + Math.random() * 9000).toString();

  return [
    {
      id: `checking-${checkingNum}`,
      name: 'EVERYDAY CHECKING',
      accountNumber: `..${checkingNum}`,
      routingNumber: '061000227',
      type: 'checking',
      availableBalance: 0.00,
      currentBalance: 0.00,
      transactions: [],
    },
    {
      id: `savings-${savingsNum}`,
      name: 'WAY2SAVE SAVINGS',
      accountNumber: `..${savingsNum}`,
      routingNumber: '061000227',
      type: 'savings',
      availableBalance: 0.00,
      currentBalance: 0.00,
      transactions: [],
    },
  ];
}

export function createZeroBalanceUserProfile(
  name: string,
  registrationData?: EnrollmentFormData
): UserProfile {
  return {
    name: name || 'Account Holder',
    avatarUrl: registrationData?.selfieUrl || registrationData?.idPhotoUrl,
    idPhotoUrl: registrationData?.idPhotoUrl,
    idPhotoBackUrl: registrationData?.idPhotoBackUrl,
    idType: registrationData?.c1PrimaryIdDesc,
    greetingTime: 'afternoon',
    ficoScore: 780,
    ficoChange: 0,
    ficoUpdatedDate: new Date().toLocaleDateString('en-US'),
    unreadNotifications: 1,
    bonusCode: 'JA23OU',
    accounts: createZeroBalanceAccounts(name),
    bills: [],
    recentDeposits: [],
    treasuryHoldings: [],
    voiceNotes: [],
    registrationData,
  };
}

class BankDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }

      // Check seed file in root data directory (for initial serverless deployment)
      if (fs.existsSync(ROOT_SEED_FILE)) {
        const raw = fs.readFileSync(ROOT_SEED_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.saveDatabase(parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Note: Could not read database file, initializing fresh store:', (e as any)?.message);
    }

    // Default clean database schema
    const initial: DatabaseSchema = {
      users: {},
      deposits: [],
      version: 1,
    };

    // Pre-create an initial demo registered user with 0.00 USD balance
    const demoId = 'usr-demo-01';
    const demoAccounts: BankAccount[] = [
      {
        id: 'checking-0987',
        name: 'EVERYDAY CHECKING',
        accountNumber: '..0987',
        routingNumber: '061000227',
        type: 'checking',
        availableBalance: 0.00,
        currentBalance: 0.00,
        transactions: [],
      },
      {
        id: 'savings-3478',
        name: 'WAY2SAVE SAVINGS',
        accountNumber: '..3478',
        routingNumber: '061000227',
        type: 'savings',
        availableBalance: 0.00,
        currentBalance: 0.00,
        transactions: [],
      },
    ];

    initial.users[demoId] = {
      id: demoId,
      username: 'customer',
      password: 'password123',
      name: 'Account Holder',
      createdAt: new Date().toISOString(),
      role: 'customer',
      profile: {
        name: 'Account Holder',
        greetingTime: 'afternoon',
        ficoScore: 780,
        ficoChange: 0,
        ficoUpdatedDate: new Date().toLocaleDateString('en-US'),
        unreadNotifications: 0,
        bonusCode: 'JA23OU',
        accounts: demoAccounts,
        bills: [],
        recentDeposits: [],
        treasuryHoldings: [],
        voiceNotes: [],
      },
    };

    const frankId = 'usr-1792312020672-632';
    initial.users[frankId] = {
      id: frankId,
      username: 'frank9999',
      password: 'henry8',
      name: 'frank Ainoo',
      email: 'frankainoo@gmail.com',
      phone: '0268253787',
      createdAt: '2026-10-18T08:27:00.699Z',
      role: 'customer',
      profile: {
        name: 'frank Ainoo',
        avatarUrl: FRANK_AVATAR_BASE64,
        idPhotoUrl: FRANK_AVATAR_BASE64,
        idType: "Driver's License",
        greetingTime: 'afternoon',
        ficoScore: 780,
        ficoChange: 0,
        ficoUpdatedDate: '10/18/2026',
        unreadNotifications: 1,
        bonusCode: 'JA23OU',
        accounts: [
          {
            id: 'checking-5776',
            name: 'EVERYDAY CHECKING',
            accountNumber: '..5776',
            routingNumber: '061000227',
            type: 'checking',
            availableBalance: 54354521.00,
            currentBalance: 54354521.00,
            transactions: [],
          },
          {
            id: 'savings-4685',
            name: 'WAY2SAVE SAVINGS',
            accountNumber: '..4685',
            routingNumber: '061000227',
            type: 'savings',
            availableBalance: 33254.00,
            currentBalance: 33254.00,
            transactions: [],
          },
        ],
        bills: [],
        recentDeposits: [],
        treasuryHoldings: [],
        voiceNotes: [],
        registrationData: {
          c1FullName: 'frank Ainoo',
          email: 'frankainoo@gmail.com',
          c1HomePhone: '0268253787',
          c1PrimaryIdDesc: "Driver's License",
          accountType: 'Checking & Savings Bundle',
        } as any,
      },
    };

    this.saveDatabase(initial);
    return initial;
  }

  private saveDatabase(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        try {
          fs.mkdirSync(DB_DIR, { recursive: true });
        } catch {
          // ignore directory creation error
        }
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Note: Database file write skipped, keeping in-memory:', (e as any)?.message);
    }
  }

  public getAllUsers(): StoredUser[] {
    return Object.values(this.data.users);
  }

  public upsertUser(user: StoredUser): StoredUser {
    this.data.users[user.id] = user;
    this.saveDatabase();
    return user;
  }

  public findUserById(id: string): StoredUser | undefined {
    return this.data.users[id];
  }

  public findUserByUsername(username: string): StoredUser | undefined {
    const clean = username.trim().toLowerCase();
    return Object.values(this.data.users).find(
      (u) =>
        u.username.toLowerCase() === clean ||
        (u.email && u.email.toLowerCase() === clean)
    );
  }

  public registerUser(
    username: string,
    password: string,
    registrationData?: EnrollmentFormData
  ): StoredUser {
    const cleanUsername = username.trim();
    const existing = this.findUserByUsername(cleanUsername);
    if (existing) {
      if (password) {
        existing.password = password;
      }
      if (registrationData) {
        existing.profile.registrationData = registrationData;
        existing.name = registrationData.c1FullName || existing.name;
        existing.profile.name = existing.name;
        if (registrationData.c1HomePhone) existing.phone = registrationData.c1HomePhone;
        if (registrationData.email) existing.email = registrationData.email;
        if (registrationData.idPhotoUrl) {
          existing.profile.idPhotoUrl = registrationData.idPhotoUrl;
          if (!existing.profile.avatarUrl) {
            existing.profile.avatarUrl = registrationData.idPhotoUrl;
          }
        }
        if (registrationData.selfieUrl) {
          existing.profile.avatarUrl = registrationData.selfieUrl;
        }
        if (registrationData.idPhotoBackUrl) {
          existing.profile.idPhotoBackUrl = registrationData.idPhotoBackUrl;
        }
        if (registrationData.c1PrimaryIdDesc) {
          existing.profile.idType = registrationData.c1PrimaryIdDesc;
        }
      }
      this.saveDatabase();
      saveUserToMongo(existing).catch((e) => console.warn('Mongo user sync:', e.message));
      return existing;
    }

    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const fullName = registrationData?.c1FullName || cleanUsername;
    const profile = createZeroBalanceUserProfile(fullName, registrationData);

    const newUser: StoredUser = {
      id: userId,
      username: cleanUsername,
      password,
      name: fullName,
      email: registrationData?.email || (registrationData?.c1Employer ? `${cleanUsername.toLowerCase()}@example.com` : undefined),
      phone: registrationData?.c1HomePhone,
      createdAt: new Date().toISOString(),
      role: 'customer',
      profile,
    };

    this.data.users[userId] = newUser;
    this.saveDatabase();
    saveUserToMongo(newUser).catch((e) => console.warn('Mongo user sync:', e.message));
    return newUser;
  }

  public updateUserProfile(userIdOrUsername: string, updatedProfile: Partial<UserProfile>): StoredUser | null {
    let user: StoredUser | undefined = this.data.users[userIdOrUsername];
    if (!user) {
      user = this.findUserByUsername(userIdOrUsername);
    }
    if (!user) return null;

    user.profile = {
      ...user.profile,
      ...updatedProfile,
    };

    if (updatedProfile.idPhotoUrl) {
      user.profile.idPhotoUrl = updatedProfile.idPhotoUrl;
      if (!user.profile.avatarUrl) {
        user.profile.avatarUrl = updatedProfile.idPhotoUrl;
      }
      if (user.profile.registrationData) {
        user.profile.registrationData.idPhotoUrl = updatedProfile.idPhotoUrl;
      }
    }

    if (updatedProfile.avatarUrl) {
      user.profile.avatarUrl = updatedProfile.avatarUrl;
    }

    if (updatedProfile.name) {
      user.name = updatedProfile.name;
    }
    this.saveDatabase();
    saveUserToMongo(user).catch((e) => console.warn('Mongo user sync:', e.message));
    return user;
  }

  public addDeposit(depositData: {
    userId: string;
    userName: string;
    targetAccountId: string;
    targetAccountName: string;
    amount: number;
    frontImage?: string;
    backImage?: string;
  }): StoredDeposit {
    const confirmationNumber = `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;
    const now = new Date();
    const formattedDate =
      now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }) +
      ' at ' +
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) +
      ' PT';

    const newDeposit: StoredDeposit = {
      id: `dep-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: depositData.userId,
      userName: depositData.userName,
      targetAccountId: depositData.targetAccountId,
      targetAccountName: depositData.targetAccountName,
      amount: depositData.amount,
      confirmationNumber,
      date: formattedDate,
      frontImage: depositData.frontImage || 'captured_front',
      backImage: depositData.backImage || 'captured_back',
      status: 'PENDING',
    };

    this.data.deposits.unshift(newDeposit);

    // Also update user's profile recentDeposits list as PENDING
    const user = this.data.users[depositData.userId];
    if (user) {
      const record: CheckDepositRecord = {
        id: newDeposit.id,
        confirmationNumber: newDeposit.confirmationNumber,
        date: newDeposit.date,
        targetAccountId: newDeposit.targetAccountId,
        amount: newDeposit.amount,
        frontImage: newDeposit.frontImage,
        backImage: newDeposit.backImage,
        status: 'submitted', // submitted/pending
        creditDate: now.toLocaleDateString('en-US'),
        availableTodayAmount: 0.00, // NOT available until admin approves!
      };
      user.profile.recentDeposits = [record, ...(user.profile.recentDeposits || [])];
    }

    this.saveDatabase();
    saveDepositToMongo(newDeposit).catch((e) => console.warn('Mongo deposit sync:', e.message));
    return newDeposit;
  }

  public getDeposits(): StoredDeposit[] {
    return this.data.deposits;
  }

  public approveDeposit(depositId: string, adminNote = 'Approved by Bank Administrator'): {
    success: boolean;
    deposit?: StoredDeposit;
    user?: StoredUser;
    error?: string;
  } {
    const deposit = this.data.deposits.find((d) => d.id === depositId);
    if (!deposit) {
      return { success: false, error: 'Deposit record not found' };
    }

    if (deposit.status === 'APPROVED') {
      return { success: false, error: 'Deposit is already approved' };
    }

    deposit.status = 'APPROVED';
    deposit.adminNote = adminNote;
    deposit.processedAt = new Date().toISOString();
    deposit.processedBy = 'Bank Admin';

    // Credit target account for the user
    let user = this.data.users[deposit.userId];
    if (!user) {
      // Try finding by username
      user = Object.values(this.data.users).find((u) => u.name === deposit.userName) as StoredUser;
    }

    if (user) {
      const targetAcc = user.profile.accounts.find((a) => a.id === deposit.targetAccountId);
      if (targetAcc) {
        targetAcc.availableBalance = Math.round((targetAcc.availableBalance + deposit.amount) * 100) / 100;
        if (targetAcc.currentBalance !== undefined) {
          targetAcc.currentBalance = Math.round((targetAcc.currentBalance + deposit.amount) * 100) / 100;
        }

        const now = new Date();
        targetAcc.transactions.unshift({
          id: `tx-dep-appr-${Date.now()}`,
          date: now.toLocaleDateString('en-US'),
          description: `MOBILE CHECK DEPOSIT APPROVED - CONF #${deposit.confirmationNumber}`,
          amount: deposit.amount,
          type: 'credit',
          category: 'Income',
        });
      }

      // Update in user.profile.recentDeposits
      if (user.profile.recentDeposits) {
        const depRecord = user.profile.recentDeposits.find(
          (r) => r.id === deposit.id || r.confirmationNumber === deposit.confirmationNumber
        );
        if (depRecord) {
          depRecord.status = 'cleared';
          depRecord.availableTodayAmount = deposit.amount;
        }
      }
    }

    this.saveDatabase();
    updateDepositActionInMongo(depositId, 'APPROVED', adminNote, 'Bank Admin').catch((e) =>
      console.warn('Mongo deposit approval sync:', e.message)
    );
    return { success: true, deposit, user };
  }

  public rejectDeposit(depositId: string, reason = 'Administrative verification rejected'): {
    success: boolean;
    deposit?: StoredDeposit;
    error?: string;
  } {
    const deposit = this.data.deposits.find((d) => d.id === depositId);
    if (!deposit) {
      return { success: false, error: 'Deposit record not found' };
    }

    deposit.status = 'REJECTED';
    deposit.adminNote = reason;
    deposit.processedAt = new Date().toISOString();
    deposit.processedBy = 'Bank Admin';

    const user = this.data.users[deposit.userId];
    if (user && user.profile.recentDeposits) {
      const depRecord = user.profile.recentDeposits.find(
        (r) => r.id === deposit.id || r.confirmationNumber === deposit.confirmationNumber
      );
      if (depRecord) {
        depRecord.status = 'processing'; // rejected marker
      }
    }

    this.saveDatabase();
    updateDepositActionInMongo(depositId, 'REJECTED', reason, 'Bank Admin').catch((e) =>
      console.warn('Mongo deposit reject sync:', e.message)
    );
    return { success: true, deposit };
  }

  public addTreasuryTender(userId: string, order: TreasuryTenderOrder): {
    success: boolean;
    user?: StoredUser;
    error?: string;
  } {
    const user = this.data.users[userId];
    if (!user) return { success: false, error: 'User not found' };

    const fundingAcc = user.profile.accounts.find((a) => a.id === order.fundingAccountId);
    if (!fundingAcc) return { success: false, error: 'Funding account not found' };

    if (fundingAcc.availableBalance < order.discountPrice) {
      return {
        success: false,
        error: `Insufficient funds: Available $${fundingAcc.availableBalance.toFixed(2)}, required $${order.discountPrice.toFixed(2)}`,
      };
    }

    // Debit account
    fundingAcc.availableBalance = Math.round((fundingAcc.availableBalance - order.discountPrice) * 100) / 100;
    fundingAcc.transactions.unshift({
      id: `tx-tbill-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US'),
      description: `U.S. TREASURY AUCTION TENDER - ${order.term} (CUSIP: ${order.cusip})`,
      amount: order.discountPrice,
      type: 'debit',
      category: 'Transfers',
    });

    user.profile.treasuryHoldings = [order, ...(user.profile.treasuryHoldings || [])];
    this.saveDatabase();
    return { success: true, user };
  }

  public transferFunds(
    userId: string,
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    memo?: string
  ): { success: boolean; user?: StoredUser; error?: string } {
    const user = this.data.users[userId];
    if (!user) return { success: false, error: 'User not found' };

    const fromAcc = user.profile.accounts.find((a) => a.id === fromAccountId);
    const toAcc = user.profile.accounts.find((a) => a.id === toAccountId);

    if (!fromAcc || !toAcc) {
      return { success: false, error: 'Source or destination account not found' };
    }

    if (fromAcc.availableBalance < amount) {
      return { success: false, error: 'Insufficient funds for transfer' };
    }

    fromAcc.availableBalance = Math.round((fromAcc.availableBalance - amount) * 100) / 100;
    toAcc.availableBalance = Math.round((toAcc.availableBalance + amount) * 100) / 100;

    const dateStr = new Date().toLocaleDateString('en-US');
    fromAcc.transactions.unshift({
      id: `tx-out-${Date.now()}`,
      date: dateStr,
      description: memo ? `TRANSFER OUT: ${memo}` : `TRANSFER TO ${toAcc.name} ${toAcc.accountNumber}`,
      amount,
      type: 'debit',
      category: 'Transfers',
    });

    toAcc.transactions.unshift({
      id: `tx-in-${Date.now()}`,
      date: dateStr,
      description: memo ? `TRANSFER IN: ${memo}` : `TRANSFER FROM ${fromAcc.name} ${fromAcc.accountNumber}`,
      amount,
      type: 'credit',
      category: 'Transfers',
    });

    this.saveDatabase();
    return { success: true, user };
  }

  public async syncWithMongo() {
    try {
      const mongoUsers = await getAllUsersFromMongo();
      for (const u of mongoUsers) {
        if (!u.id && !u._id) continue;
        const uid = u.id || u._id;
        const existing = this.data.users[uid] || this.findUserByUsername(u.username);
        if (existing) {
          existing.name = u.name || existing.name;
          existing.email = u.email || existing.email;
          existing.phone = u.phone || existing.phone;
          existing.role = u.role || existing.role;
          if (u.password) existing.password = u.password;
          existing.profile = { ...(existing.profile || {}), ...(u.profile || {}) };
          if (u.profile?.accounts && u.profile.accounts.length > 0) {
            existing.profile.accounts = u.profile.accounts;
          }
          if (u.profile?.registrationData) {
            existing.profile.registrationData = u.profile.registrationData;
          }
        } else {
          this.data.users[uid] = {
            id: uid,
            username: u.username,
            password: u.password || 'password123',
            name: u.name || u.username,
            email: u.email,
            phone: u.phone,
            createdAt: u.createdAt || new Date().toISOString(),
            role: u.role || 'customer',
            profile: u.profile,
          };
        }
      }

      const mongoDeposits = await getAllDepositsFromMongo();
      for (const d of mongoDeposits) {
        const did = d.id || d._id;
        const exists = this.data.deposits.some((x) => x.id === did);
        if (!exists) {
          this.data.deposits.unshift(d);
        } else {
          const idx = this.data.deposits.findIndex((x) => x.id === did);
          if (idx !== -1) {
            this.data.deposits[idx] = { ...this.data.deposits[idx], ...d };
          }
        }
      }

      this.saveDatabase();
    } catch (err: any) {
      console.warn('BankDatabase.syncWithMongo warning:', err.message);
    }
  }
}

export const bankDb = new BankDatabase();
