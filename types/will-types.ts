export interface PersonalInfo {
  fullName: string;
  age: number;
  occupation: string;
  address: string;
  idNumber: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  relation: string;
  idNumber: string;
  address: string;
  age: number;
  percentage?: number;
}

export interface BankAccount {
  sharePercentage: string;
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  branch: string;
  beneficiaryId: string;
}

export interface InsurancePolicy {
  sharePercentage: string;
  id: string;
  policyNumber: string;
  company: string;
  policyType: string;
  sumAssured: number;
  beneficiaryId: string;
}

export interface Stock {
  accountNumber: string | undefined;
  sharePercentage: string;
  id: string;
  company: string;
  numberOfShares: number;
  certificateNumber?: string;
  beneficiaryId: string;
}

export interface MutualFund {
  distributor: string;
  accountNumber: string;
  sharePercentage: string;
  id: string;
  fundName: string;
  folioNumber: string;
  units: number;
  beneficiaryId: string;
}

export interface Jewellery {
  type: string;
  invoiceNumber: string;
  sharePercentage: string;
  id: string;
  description: string;
  estimatedValue: number;
  location: string;
  beneficiaryId: string;
}

export interface ImmovableAsset {
  name: string;
  sharePercentage: string;
  id: string;
  propertyType: string;
  description: string;
  location: string;
  surveyNumber?: string;
  registrationNumber?: string;
  estimatedValue: number;
  beneficiaryId: string;
}

export interface Guardian {
  name: string;
  relation: string;
  address: string;
  phone: string;
  email?: string;
}

export interface Executor {
  id: string;
  name: string;
  relation: string;
  address: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface Witness {
  id: string;
  name: string;
  address: string;
  phone: string;
  occupation: string;
  idNumber: string;
}

export interface WillData {
  residualClause: string;
  testator: PersonalInfo;
  beneficiaries: Beneficiary[];
  movableAssets: {
    bankAccounts: BankAccount[];
    insurancePolicies: InsurancePolicy[];
    stocks: Stock[];
    mutualFunds: MutualFund[];
  };
  physicalAssets: {
    jewellery: Jewellery[];
  };
  immovableAssets: ImmovableAsset[];
  guardianClause?: {
    condition: string;
    guardian: Guardian;
    minorChildren: string[];
  };
  liabilities: string[];
  executors: Executor[];
  witnesses: Witness[];
  dateOfWill: string;
  placeOfWill: string;
  specialInstructions?: string;
}