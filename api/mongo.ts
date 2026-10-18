import { MongoClient, Db, Collection } from 'mongodb';

export const MONGODB_URI = process.env.MONGODB_URI || '';

export const DB_NAME = 'WellsFargo';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let mongoConnectionFailed = false;

/**
 * Returns a connected MongoClient instance, or null if MongoDB is not configured or unreachable.
 */
export async function getMongoClient(): Promise<MongoClient | null> {
  if (!MONGODB_URI || mongoConnectionFailed) {
    return null;
  }

  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });

    await client.connect();
    cachedClient = client;
    return client;
  } catch (err: any) {
    mongoConnectionFailed = true;
    console.warn('[AI Studio] MongoDB not connected or direct TCP blocked — using local in-memory store:', err?.message);
    return null;
  }
}

/**
 * Returns the WellsFargo Db instance or null.
 */
export async function getMongoDb(): Promise<Db | null> {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await getMongoClient();
  if (!client) return null;
  const db = client.db(DB_NAME);
  cachedDb = db;
  return db;
}

export async function getUsersCollection(): Promise<Collection<any> | null> {
  const db = await getMongoDb();
  return db ? db.collection('users') : null;
}

export async function getDepositsCollection(): Promise<Collection<any> | null> {
  const db = await getMongoDb();
  return db ? db.collection('deposits') : null;
}

/**
 * Saves or updates a registered user record in MongoDB Atlas.
 */
export async function saveUserToMongo(user: any): Promise<boolean> {
  try {
    const col = await getUsersCollection();
    if (!col) return false;
    const doc = {
      _id: user.id,
      id: user.id,
      username: user.username,
      password: user.password,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: user.role || 'customer',
      profile: user.profile,
    };

    await col.updateOne({ _id: user.id }, { $set: doc }, { upsert: true });
    return true;
  } catch (err: any) {
    console.error('Failed to save user to MongoDB Atlas:', err.message);
    return false;
  }
}

/**
 * Retrieves a user by username from MongoDB Atlas.
 */
export async function getUserFromMongo(username: string): Promise<any | null> {
  try {
    const col = await getUsersCollection();
    if (!col) return null;
    const clean = username.trim().toLowerCase();
    const doc = await col.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${clean}$`, 'i') } },
        { name: { $regex: new RegExp(`^${clean}$`, 'i') } },
        { _id: username },
        { id: username },
      ],
    });
    return doc;
  } catch (err: any) {
    console.error('Failed to fetch user from MongoDB Atlas:', err.message);
    return null;
  }
}

/**
 * Returns all registered users from MongoDB Atlas.
 */
export async function getAllUsersFromMongo(): Promise<any[]> {
  try {
    const col = await getUsersCollection();
    if (!col) return [];
    const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
    return docs.map((d) => ({
      id: d.id || d._id,
      username: d.username,
      password: d.password,
      name: d.name,
      email: d.email,
      phone: d.phone,
      createdAt: d.createdAt,
      role: d.role,
      profile: d.profile,
    }));
  } catch (err: any) {
    console.error('Failed to fetch all users from MongoDB Atlas:', err.message);
    return [];
  }
}

/**
 * Saves a check deposit into MongoDB Atlas.
 */
export async function saveDepositToMongo(deposit: any): Promise<boolean> {
  try {
    const col = await getDepositsCollection();
    if (!col) return false;
    const doc = {
      _id: deposit.id,
      id: deposit.id,
      userId: deposit.userId,
      userName: deposit.userName,
      userEmail: deposit.userEmail,
      targetAccountId: deposit.targetAccountId,
      targetAccountName: deposit.targetAccountName,
      amount: deposit.amount,
      confirmationNumber: deposit.confirmationNumber,
      date: deposit.date,
      frontImage: deposit.frontImage,
      backImage: deposit.backImage,
      status: deposit.status,
      adminNote: deposit.adminNote,
      processedAt: deposit.processedAt,
      processedBy: deposit.processedBy,
      createdAt: new Date().toISOString(),
    };

    await col.updateOne({ _id: deposit.id }, { $set: doc }, { upsert: true });
    return true;
  } catch (err: any) {
    console.error('Failed to save deposit to MongoDB Atlas:', err.message);
    return false;
  }
}

/**
 * Returns all check deposits from MongoDB Atlas.
 */
export async function getAllDepositsFromMongo(): Promise<any[]> {
  try {
    const col = await getDepositsCollection();
    if (!col) return [];
    const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
    return docs.map((d) => ({
      id: d.id || d._id,
      userId: d.userId,
      userName: d.userName,
      userEmail: d.userEmail,
      targetAccountId: d.targetAccountId,
      targetAccountName: d.targetAccountName,
      amount: d.amount,
      confirmationNumber: d.confirmationNumber,
      date: d.date,
      frontImage: d.frontImage,
      backImage: d.backImage,
      status: d.status,
      adminNote: d.adminNote,
      processedAt: d.processedAt,
      processedBy: d.processedBy,
    }));
  } catch (err: any) {
    console.error('Failed to fetch deposits from MongoDB Atlas:', err.message);
    return [];
  }
}

/**
 * Approves or rejects a deposit and updates balances in MongoDB Atlas.
 */
export async function updateDepositActionInMongo(
  depositId: string,
  status: 'APPROVED' | 'REJECTED',
  adminNote?: string,
  processedBy = 'Bank Administrator'
): Promise<boolean> {
  try {
    const depositsCol = await getDepositsCollection();
    if (!depositsCol) return false;
    const deposit = await depositsCol.findOne({ $or: [{ _id: depositId }, { id: depositId }] });
    if (!deposit) return false;

    const processedAt = new Date().toISOString();
    await depositsCol.updateOne(
      { $or: [{ _id: depositId }, { id: depositId }] },
      {
        $set: {
          status,
          adminNote: adminNote || (status === 'APPROVED' ? 'Approved by Bank Administrator' : 'Rejected'),
          processedAt,
          processedBy,
        },
      }
    );

    // If approved, update user's account balance in MongoDB
    if (status === 'APPROVED' && deposit.userId) {
      const usersCol = await getUsersCollection();
      if (usersCol) {
        const user = await usersCol.findOne({ $or: [{ _id: deposit.userId }, { id: deposit.userId }] });
        if (user && user.profile && Array.isArray(user.profile.accounts)) {
          const creditAmount = Number(deposit.amount) || 0;
          const updatedAccounts = user.profile.accounts.map((acc: any) => {
            if (acc.id === deposit.targetAccountId) {
              const currentBal = Number(acc.availableBalance) || 0;
              const newBal = currentBal + creditAmount;
              const tx = {
                id: `tx-dep-appr-${Date.now()}`,
                date: new Date().toLocaleDateString('en-US'),
                description: `MOBILE CHECK DEPOSIT APPROVED - CONF #${deposit.confirmationNumber}`,
                amount: creditAmount,
                type: 'credit',
                category: 'Income',
              };
              return {
                ...acc,
                availableBalance: newBal,
                currentBalance: newBal,
                transactions: [tx, ...(acc.transactions || [])],
              };
            }
            return acc;
          });

          await usersCol.updateOne(
            { _id: user._id },
            { $set: { 'profile.accounts': updatedAccounts, updatedAt: new Date().toISOString() } }
          );
        }
      }
    }

    return true;
  } catch (err: any) {
    console.error('Failed to update deposit in MongoDB Atlas:', err.message);
    return false;
  }
}

/**
 * Seeds initial users into MongoDB Atlas if collection is empty.
 */
export async function seedInitialUsersToMongo(seedUsers: any[]): Promise<void> {
  try {
    const col = await getUsersCollection();
    if (!col) return;
    for (const u of seedUsers) {
      await col.updateOne(
        { $or: [{ _id: u.id }, { username: u.username }] },
        {
          $setOnInsert: {
            _id: u.id,
            id: u.id,
            username: u.username,
            password: u.password,
            name: u.name,
            email: u.email,
            phone: u.phone,
            createdAt: u.createdAt || new Date().toISOString(),
            role: u.role || 'customer',
            profile: u.profile,
          },
        },
        { upsert: true }
      );
    }
    console.log(`MongoDB Atlas: Sync complete. Seeded ${seedUsers.length} user records.`);
  } catch (err: any) {
    console.warn('MongoDB Atlas seed warning:', err.message);
  }
}
