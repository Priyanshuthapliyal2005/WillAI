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
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  branch: string;
  beneficiaryId: string;
}

export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  company: string;
  policyType: string;
  sumAssured: number;
  beneficiaryId: string;
}

export interface Stock {
  id: string;
  company: string;
  numberOfShares: number;
  certificateNumber?: string;
  beneficiaryId: string;
}

export interface MutualFund {
  id: string;
  fundName: string;
  folioNumber: string;
  units: number;
  beneficiaryId: string;
}

export interface Jewellery {
  id: string;
  description: string;
  estimatedValue: number;
  location: string;
  beneficiaryId: string;
}

export interface ImmovableAsset {
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