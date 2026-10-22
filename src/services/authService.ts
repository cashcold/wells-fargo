import { BankAccount, UserProfile, EnrollmentFormData } from '../types/banking';
import { apiFetch, apiUrl } from '../utils/api';
import { FRANK_AVATAR_BASE64 } from '../data/frankAvatar';

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
    this.syncFromServer();
  }

  private initDatabase() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.users = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse stored bank database from localStorage:', e);
    }

    // Seed default registered users if not present
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

    if (!this.users['usr-customer-01']) {
      this.users['usr-customer-01'] = {
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
      };
    }

    if (!this.users['usr-johndoe-02']) {
      this.users['usr-johndoe-02'] = {
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
      };
    }

    // Registered MongoDB Atlas User: frank9999 / henry8
    const frankId = 'usr-1792312020672-632';

    // Strictly ensure frank9999 has certified verified photo ID and live balances in both web and mobile APK
    const frankAccounts: BankAccount[] = [
      {
        id: 'checking-5776',
        name: 'EVERYDAY CHECKING',
        accountNumber: '..5776',
        routingNumber: '061000227',
        type: 'checking',
        availableBalance: 54354521.0,
        currentBalance: 54354521.0,
        transactions: [],
      },
      {
        id: 'savings-4685',
        name: 'WAY2SAVE SAVINGS',
        accountNumber: '..4685',
        routingNumber: '061000227',
        type: 'savings',
        availableBalance: 33254.0,
        currentBalance: 33254.0,
        transactions: [],
      },
    ];

    this.users[frankId] = {
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
        ficoUpdatedDate: '10/22/2026',
        unreadNotifications: 1,
        bonusCode: 'JA23OU',
        accounts: frankAccounts,
        bills: [],
        recentDeposits: [],
        treasuryHoldings: [],
        voiceNotes: [],
        registrationData: {
          c1FullName: 'frank Ainoo',
          c1StreetAddress: 'Community 9 Cemetary, Tema, Ghana',
          c1City: 'Accra Ghana',
          c1State: 'CA',
          c1Zip: '002233',
          c1Country: 'USA',
          c1Tin: '638471468476768',
          c1HomePhone: '0268253787',
          c1Employer: 'capgain',
          c1BusinessPhone: '0268253787',
          c1PrimaryIdDesc: "Driver's License",
          c1PrimaryIdState: 'CA',
          accountType: 'Checking & Savings Bundle',
          initialDeposit: '0.00',
          offerCode: 'JA23OU',
          bankName: 'Wells Fargo Bank, N.A.',
          idPhotoUrl: FRANK_AVATAR_BASE64,
          selfieUrl: FRANK_AVATAR_BASE64,
        } as any,
      },
    };

    this.save();
  }

  public async syncFromServer() {
    try {
      const res = await apiFetch(`/api/user/frank9999?_ts=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          this.syncUserFromServer(data.user);
        }
      }
    } catch {
      // safe fallback if offline or unreachable
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users));
    } catch (e) {
      console.warn('Failed to persist bank database to localStorage:', e);
    }
  }

  public findUserById(id: string): StoredUser | undefined {
    return this.users[id] || Object.values(this.users).find((u) => u.id === id);
  }

  public findUserByUsername(username: string): StoredUser | undefined {
    if (!username || !username.trim()) return undefined;
    const clean = username.trim().toLowerCase();
    const cleanAlpha = clean.replace(/[^a-z0-9]/g, '');

    // 1. Direct match on username, email, name, or id
    const direct = Object.values(this.users).find(
      (u) =>
        (u.username && u.username.toLowerCase() === clean) ||
        (u.email && u.email.toLowerCase() === clean) ||
        (u.name && u.name.toLowerCase() === clean) ||
        u.id === username.trim()
    );
    if (direct) return direct;

    // 2. Normalized match (without spaces or special characters)
    const normalized = Object.values(this.users).find(
      (u) =>
        (u.username && u.username.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanAlpha) ||
        (u.name && u.name.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanAlpha)
    );
    if (normalized) return normalized;

    // 3. Flexible aliases for Frank Ainoo ("frank", "frank9999", "frank ainoo", "ainoo")
    if (cleanAlpha.includes('frank') || cleanAlpha.includes('ainoo')) {
      const frank =
        this.users['usr-1792312020672-632'] ||
        Object.values(this.users).find(
          (u) =>
            u.id === 'usr-1792312020672-632' ||
            u.username?.toLowerCase() === 'frank9999' ||
            u.name?.toLowerCase().includes('ainoo')
        );
      if (frank) return frank;
    }

    return undefined;
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
      const res = await apiFetch('/api/auth/login', {
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
      const res = await apiFetch('/api/auth/register', {
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

    // Banking KYC compliance: Customer cannot change photo once set after opening account
    const existingPhoto =
      user.profile.idPhotoUrl ||
      user.profile.avatarUrl ||
      user.profile.registrationData?.idPhotoUrl;

    const newPhoto =
      updatedProfile.idPhotoUrl ||
      updatedProfile.avatarUrl ||
      updatedProfile.registrationData?.idPhotoUrl;

    // If an existing photo is already registered and a different photo is provided by non-admin
    if (existingPhoto && newPhoto && newPhoto !== existingPhoto) {
      console.warn('Customer photo is locked per KYC regulations. Retaining verified photo on file.');
      delete updatedProfile.idPhotoUrl;
      delete updatedProfile.avatarUrl;
      if (updatedProfile.registrationData) {
        updatedProfile.registrationData.idPhotoUrl = existingPhoto;
      }
    }

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
      await apiFetch(`/api/user/${encodeURIComponent(user.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: user.profile }),
      });
    } catch {
      // offline fallback
    }

    return user.profile;
  }

  /**
   * Dedicated Admin Override to update customer identification photo
   */
  public async adminUpdateUserPhoto(
    userIdOrUsername: string,
    photoUrl: string,
    adminKey = ADMIN_PASSWORD
  ): Promise<boolean> {
    const user = this.findUserById(userIdOrUsername) || this.findUserByUsername(userIdOrUsername);
    if (!user) return false;

    user.profile.idPhotoUrl = photoUrl;
    user.profile.avatarUrl = photoUrl;
    if (user.profile.registrationData) {
      user.profile.registrationData.idPhotoUrl = photoUrl;
      user.profile.registrationData.selfieUrl = photoUrl;
    }
    this.save();

    try {
      const res = await apiFetch(`/api/admin/users/${encodeURIComponent(user.id)}/photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ photoUrl, adminKey }),
      });
      return res.ok;
    } catch {
      return true;
    }
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
      apiFetch(`/api/user/${encodeURIComponent(existing.id)}`, {
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

    apiFetch('/api/auth/register', {
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
