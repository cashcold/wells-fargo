export type AccountType = 'checking' | 'savings' | 'credit' | 'loan';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category: 'Shopping' | 'Food & Drink' | 'Bills & Utilities' | 'Income' | 'Transfers' | 'Payment';
}

export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
  type: AccountType;
  availableBalance: number;
  currentBalance?: number;
  rewardsBalance?: number;
  principalBalance?: number;
  nextPaymentDue?: string;
  nextPaymentAmount?: number;
  principalAndInterest?: number;
  pastDueAmount?: number;
  totalAmountDue?: number;
  autopayEnabled?: boolean;
  transactions: Transaction[];
}

export interface SetAsideBill {
  id: string;
  name: string;
  icon: 'phone' | 'gym' | 'electric' | 'rent' | 'internet' | 'custom';
  status: 'ready' | 'scheduled' | 'saving';
  totalAmount: number;
  savedAmount: number;
  daysRemaining: number;
  dueDate: string;
}

export interface CheckDepositRecord {
  id: string;
  confirmationNumber: string;
  date: string;
  targetAccountId: string;
  amount: number;
  frontImage: string;
  backImage: string;
  status: 'submitted' | 'processing' | 'cleared';
  creditDate: string;
  availableTodayAmount: number;
}

export interface EnrollmentFormData {
  // Online Banking Credentials
  username?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;

  // Identity Verification Document Uploads
  idPhotoUrl?: string; // Front of government ID photo / image (Base64 data URL)
  idPhotoBackUrl?: string; // Back of government ID photo (optional)
  selfieUrl?: string; // User portrait photo / selfie (optional)

  // Accounts
  accountType: 'Everyday Checking' | 'Way2Save Savings' | 'Checking & Savings Bundle' | 'Platinum Savings' | 'Time CD';
  initialDeposit: string;
  offerCode: string;
  bankName: string;

  // Customer 1 (Primary)
  c1FullName: string;
  c1StreetAddress: string;
  c1HowLongYr: string;
  c1HowLongMo: string;
  c1DirectionalAddress: string;
  c1City: string;
  c1State: string;
  c1Zip: string;
  c1Country: string;
  c1Tin: string;
  c1HomePhone: string;
  c1PrevAddress: string;
  c1PrevYr: string;
  c1PrevMo: string;
  c1PrevCity: string;
  c1PrevState: string;
  c1PrevZip: string;
  c1PrevCountry: string;
  c1Employer: string;
  c1BusinessPhone: string;
  c1PrimaryIdDesc: string;
  c1PrimaryIdState: string;
  c1Dob: string;
  c1PrimaryIssueDate: string;
  c1PrimaryExpDate: string;
  c1SecondaryIdDesc: string;
  c1SecondaryIdState: string;
  c1SecondaryIssueDate: string;
  c1SecondaryExpDate: string;

  // Customer 2 (Joint / Optional)
  hasCustomer2: boolean;
  c2FullName: string;
  c2StreetAddress: string;
  c2HowLongYr: string;
  c2HowLongMo: string;
  c2DirectionalAddress: string;
  c2City: string;
  c2State: string;
  c2Zip: string;
  c2Country: string;
  c2Tin: string;
  c2HomePhone: string;
  c2PrevAddress: string;
  c2PrevYr: string;
  c2PrevMo: string;
  c2PrevCity: string;
  c2PrevState: string;
  c2PrevZip: string;
  c2PrevCountry: string;
  c2Employer: string;
  c2BusinessPhone: string;
  c2PrimaryIdDesc: string;
  c2PrimaryIdState: string;
  c2Dob: string;
  c2PrimaryIssueDate: string;
  c2PrimaryExpDate: string;
  c2SecondaryIdDesc: string;
  c2SecondaryIdState: string;
  c2SecondaryIssueDate: string;
  c2SecondaryExpDate: string;

  // W-9 Backup Withholding
  w9SubjectToBackup: boolean;
  w9ExemptFromBackup: boolean;
  w9ManualSubmit: boolean;
  w9Signature: string;

  // Wisconsin Only
  isWisconsinResident: boolean;
  c1MaritalStatus: 'married' | 'unmarried' | 'legally separated' | '';
  c2MaritalStatus: 'married' | 'unmarried' | 'legally separated' | '';
  wiSpouseName: string;
  wiSpouseAddress: string;

  // Texas Right of Survivorship
  isTexasResident: boolean;
  txAgreementAccepted: boolean;
  txC1Signature: string;
  txC2Signature: string;
  txManualSubmit: boolean;

  // Final Signatures & Agreement
  agreementAccepted: boolean;
  c1Signature: string;
  c1SignatureDate: string;
  c1ManualSubmit: boolean;
  c2Signature: string;
  c2SignatureDate: string;
  c2ManualSubmit: boolean;
}

export type TBillTerm = '4-Week' | '8-Week' | '13-Week' | '17-Week' | '26-Week' | '52-Week';

export interface TreasuryBill {
  id: string;
  term: TBillTerm;
  termDays: number;
  cusip: string;
  auctionDate: string;
  issueDate: string;
  maturityDate: string;
  discountRate: number; // e.g. 5.18%
  investmentYield: number; // e.g. 5.29%
  pricePer1000: number; // e.g. 986.91
  minPurchase: number; // $1,000
  increment: number; // $1,000
  status: 'Auction Open' | 'Upcoming Auction' | 'Secondary Market';
  auctionClosingTime: string; // e.g. "11:00 AM ET"
}

export interface TreasuryTenderOrder {
  orderId: string;
  tBillId: string;
  cusip: string;
  term: TBillTerm;
  faceValue: number; // par value
  discountPrice: number; // actual amount paid
  totalDiscount: number; // interest earned at maturity
  discountRate: number;
  investmentYield: number;
  tenderType: 'Non-Competitive' | 'Competitive';
  bidYield?: number;
  autoRoll: boolean; // automatic reinvestment at maturity
  fundingAccountId: string;
  fundingAccountName: string;
  status: 'Awarded / Active' | 'Tender Submitted' | 'Matured';
  submittedAt: string;
  settlementDate: string;
  maturityDate: string;
  confirmationNumber: string;
}

export interface VoiceNote {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  tags?: string[];
}

export interface UserProfile {
  name: string;
  avatarUrl?: string; // Profile picture / portrait photo
  idPhotoUrl?: string; // Uploaded government ID document image
  idPhotoBackUrl?: string; // Uploaded ID back image
  idType?: string; // Primary ID document description
  greetingTime: 'morning' | 'afternoon' | 'evening';
  ficoScore: number;
  ficoChange: number;
  ficoUpdatedDate: string;
  unreadNotifications: number;
  bonusCode: string;
  accounts: BankAccount[];
  bills: SetAsideBill[];
  recentDeposits: CheckDepositRecord[];
  registrationData?: EnrollmentFormData;
  treasuryHoldings?: TreasuryTenderOrder[];
  voiceNotes?: VoiceNote[];
}
