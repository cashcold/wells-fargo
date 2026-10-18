import { BankAccount, UserProfile, EnrollmentFormData } from '../types/banking';

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

const STORAGE_KEY = 'wf_bank_database_v2';
const ADMIN_PASSWORD = 'admin12345@';

export function createZeroBalanceAccounts(userName: string): BankAccount[] {
  const checkingNum = Math.floor(1000 + Math.random() * 9000).toString();
  const savingsNum = Math.floor(1000 + Math.random() * 9000).toString();

  return [
    {
      id: `checking-${checkingNum}`,
      name: 'EVERYDAY CHECKING',
      accountNumber: `..${checkingNum}`,
      routingNumber: '061000227',
      type: 'checking',
      availableBalance: 0.0,
      currentBalance: 0.0,
      transactions: [],
    },
    {
      id: `savings-${savingsNum}`,
      name: 'WAY2SAVE SAVINGS',
      accountNumber: `..${savingsNum}`,
      routingNumber: '061000227',
      type: 'savings',
      availableBalance: 0.0,
      currentBalance: 0.0,
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

class AuthService {
  private users: Record<string, StoredUser> = {};

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.users = JSON.parse(raw);
        return;
      }
    } catch (e) {
      console.warn('Failed to parse stored bank database from localStorage:', e);
    }

    // Seed default registered users
    const defaultAccounts: BankAccount[] = [
      {
        id: 'checking-0987',
        name: 'EVERYDAY CHECKING',
        accountNumber: '..0987',
        routingNumber: '061000227',
        type: 'checking',
        availableBalance: 0.0,
        currentBalance: 0.0,
        transactions: [],
      },
      {
        id: 'savings-3478',
        name: 'WAY2SAVE SAVINGS',
        accountNumber: '..3478',
        routingNumber: '061000227',
        type: 'savings',
        availableBalance: 0.0,
        currentBalance: 0.0,
        transactions: [],
      },
    ];

    this.users = {
      'usr-customer-01': {
        id: 'usr-customer-01',
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
          accounts: defaultAccounts,
          bills: [],
          recentDeposits: [],
          treasuryHoldings: [],
          voiceNotes: [],
        },
      },
      'usr-johndoe-02': {
        id: 'usr-johndoe-02',
        username: 'john_doe',
        password: 'password123',
        name: 'John Doe',
        email: 'john_doe@example.com',
        phone: '(512) 555-0100',
        createdAt: new Date().toISOString(),
        role: 'customer',
        profile: {
          name: 'John Doe',
          greetingTime: 'afternoon',
          ficoScore: 780,
          ficoChange: 0,
          ficoUpdatedDate: new Date().toLocaleDateString('en-US'),
          unreadNotifications: 1,
          bonusCode: 'JA23OU',
          accounts: [
            {
              id: 'checking-3818',
              name: 'EVERYDAY CHECKING',
              accountNumber: '..3818',
              routingNumber: '061000227',
              type: 'checking',
              availableBalance: 500.0,
              currentBalance: 500.0,
              transactions: [
                {
                  id: 'tx-dep-appr-initial',
                  date: '10/15/2026',
                  description: 'MOBILE CHECK DEPOSIT APPROVED - CONF #5167373989427',
                  amount: 500,
                  type: 'credit',
                  category: 'Income',
                },
              ],
            },
            {
              id: 'savings-2714',
              name: 'WAY2SAVE SAVINGS',
              accountNumber: '..2714',
              routingNumber: '061000227',
              type: 'savings',
              availableBalance: 0.0,
              currentBalance: 0.0,
              transactions: [],
            },
          ],
          bills: [],
          recentDeposits: [],
          treasuryHoldings: [],
          voiceNotes: [],
        },
      },
    };

    this.save();
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users));
    } catch (e) {
      console.warn('Failed to persist bank database to localStorage:', e);
    }
  }

  public findUserByUsername(username: string): StoredUser | undefined {
    const clean = username.trim().toLowerCase();
    return Object.values(this.users).find(
      (u) =>
        u.username.toLowerCase() === clean ||
        (u.email && u.email.toLowerCase() === clean)
    );
  }

  public async login(
    username: string,
    password: string
  ): Promise<{
    success: boolean;
    isAdmin?: boolean;
    user?: { id: string; username: string; name: string; profile: UserProfile };
    error?: string;
  }> {
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      return { success: false, error: 'Username is required.' };
    }
    if (!cleanPassword) {
      return { success: false, error: 'Password is required.' };
    }

    // Try backend authentication first if available
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          password: cleanPassword,
        }),
      });

      // Verify response is valid JSON (not an HTML fallback)
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.isAdmin) {
          return { success: true, isAdmin: true };
        }
        if (data.success && data.user) {
          // Sync server user profile into local storage database
          this.syncUserFromServer(data.user);
          return {
            success: true,
            isAdmin: false,
            user: {
              id: data.user.id,
              username: data.user.username,
              name: data.user.name,
              profile: data.user.profile,
            },
          };
        }
        if (data.error) {
          return { success: false, error: data.error };
        }
        if (!res.ok) {
          return {
            success: false,
            error: data.error || 'Authentication failed. Please check your username and password.',
          };
        }
      }
    } catch {
      // Backend offline or unreachable (e.g. mobile APK or static host)
      // Fallback to local persistent database with strict verification
    }

    // Strict Client Database Authentication
    // 1. Check for Admin Login
    if (cleanUsername.toLowerCase() === 'admin') {
      if (cleanPassword === ADMIN_PASSWORD) {
        return { success: true, isAdmin: true };
      }
      return {
        success: false,
        error: 'Invalid administrator credentials. Please check your password.',
      };
    }

    // 2. Lookup user in registered users database
    const user = this.findUserByUsername(cleanUsername);

    // Unregistered user check
    if (!user) {
      return {
        success: false,
        error: `Account not found for "${cleanUsername}". This user is not registered in our database. Please click "Enroll" to register.`,
      };
    }

    // Wrong password check
    if (!user.password || user.password !== cleanPassword) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your password and try again.',
      };
    }

    // Verified Login
    return {
      success: true,
      isAdmin: false,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        profile: user.profile,
      },
    };
  }

  public async register(
    username: string,
    password: string,
    registrationData?: EnrollmentFormData
  ): Promise<{
    success: boolean;
    user?: { id: string; username: string; name: string; profile: UserProfile };
    error?: string;
  }> {
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      return { success: false, error: 'Username is required for registration.' };
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    // Check if username is already registered in local database
    const existing = this.findUserByUsername(cleanUsername);
    if (existing) {
      return {
        success: false,
        error: `Username "${cleanUsername}" is already taken. Please choose another username.`,
      };
    }

    // Try backend registration
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          password: cleanPassword,
          registrationData,
        }),
      });

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.user) {
          this.syncUserFromServer(data.user);
          return {
            success: true,
            user: {
              id: data.user.id,
              username: data.user.username,
              name: data.user.name,
              profile: data.user.profile,
            },
          };
        }
        if (data.error) {
          return { success: false, error: data.error };
        }
        if (!res.ok) {
          return { success: false, error: data.error || 'Registration failed on server database.' };
        }
      }
    } catch {
      // Backend unavailable; continue with local database registration
    }

    // Register into local persistent database
    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const fullName = registrationData?.c1FullName || cleanUsername;
    const profile = createZeroBalanceUserProfile(fullName, registrationData);

    const newUser: StoredUser = {
      id: userId,
      username: cleanUsername,
      password: cleanPassword,
      name: fullName,
      email: registrationData?.email,
      phone: registrationData?.c1HomePhone,
      createdAt: new Date().toISOString(),
      role: 'customer',
      profile,
    };

    this.users[userId] = newUser;
    this.save();

    return {
      success: true,
      user: {
        id: userId,
        username: cleanUsername,
        name: fullName,
        profile,
      },
    };
  }

  public syncUserFromServer(serverUser: any) {
    if (!serverUser || !serverUser.username) return;
    const existing = this.findUserByUsername(serverUser.username);
    if (existing) {
      existing.name = serverUser.name || existing.name;
      existing.profile = serverUser.profile || existing.profile;
      existing.role = serverUser.role || existing.role;
    } else {
      const userId = serverUser.id || `usr-${Date.now()}`;
      this.users[userId] = {
        id: userId,
        username: serverUser.username,
        password: serverUser.password,
        name: serverUser.name || serverUser.username,
        email: serverUser.email,
        phone: serverUser.phone,
        createdAt: new Date().toISOString(),
        role: serverUser.role || 'customer',
        profile: serverUser.profile || createZeroBalanceUserProfile(serverUser.name || serverUser.username),
      };
    }
    this.save();
  }

  public async updateUserProfile(username: string, updatedProfile: Partial<UserProfile>): Promise<UserProfile | null> {
    const user = this.findUserByUsername(username);
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
    this.save();

    try {
      await fetch(`/api/user/${encodeURIComponent(user.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: user.profile }),
      });
    } catch {
      // offline fallback
    }

    return user.profile;
  }

  public recordOrUpdateUser(
    usernameOrName: string,
    profile: UserProfile,
    registrationData?: EnrollmentFormData
  ): StoredUser {
    const clean = (usernameOrName || profile.name || 'Account Holder').trim();
    const username = (registrationData?.username || clean.toLowerCase().replace(/\s+/g, '_')).trim();

    let existing = this.findUserByUsername(username) || this.findUserByUsername(clean);
    if (existing) {
      existing.name = profile.name || existing.name;
      existing.profile = { ...existing.profile, ...profile };
      if (registrationData) {
        existing.profile.registrationData = registrationData;
        if (registrationData.c1HomePhone) existing.phone = registrationData.c1HomePhone;
        if (registrationData.email) existing.email = registrationData.email;
      }
      this.save();
      fetch(`/api/user/${encodeURIComponent(existing.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: existing.profile }),
      }).catch(() => {});
      return existing;
    }

    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newUser: StoredUser = {
      id: userId,
      username,
      password: registrationData?.password || 'password123',
      name: profile.name || clean,
      email: registrationData?.email || `${username.toLowerCase()}@example.com`,
      phone: registrationData?.c1HomePhone || '(555) 019-2834',
      createdAt: new Date().toISOString(),
      role: 'customer',
      profile,
    };

    this.users[userId] = newUser;
    this.save();

    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: newUser.username,
        password: newUser.password,
        registrationData: registrationData || profile.registrationData,
      }),
    }).catch(() => {});

    return newUser;
  }

  public getAllUsers(): StoredUser[] {
    return Object.values(this.users);
  }
}

export const authService = new AuthService();
