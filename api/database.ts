import fs from 'fs';
import path from 'path';
import { BankAccount, UserProfile, CheckDepositRecord, TreasuryTenderOrder, EnrollmentFormData } from '../src/types/banking';

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

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'bank_database.json');

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
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading database file, initializing fresh store:', e);
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

    this.saveDatabase(initial);
    return initial;
  }

  private saveDatabase(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  public getAllUsers(): StoredUser[] {
    return Object.values(this.data.users);
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
      }
      this.saveDatabase();
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
    return newUser;
  }

  public updateUserProfile(userId: string, updatedProfile: Partial<UserProfile>): StoredUser | null {
    const user = this.data.users[userId];
    if (!user) return null;

    user.profile = {
      ...user.profile,
      ...updatedProfile,
    };
    if (updatedProfile.name) {
      user.name = updatedProfile.name;
    }
    this.saveDatabase();
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
}

export const bankDb = new BankDatabase();
