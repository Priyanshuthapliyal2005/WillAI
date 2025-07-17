import { z } from "zod"

export const testatorSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  age: z.number().min(18, "Must be at least 18 years old"),
  occupation: z.string().min(2, "Occupation is required"),
  address: z.string().min(10, "Complete address is required"),
  idNumber: z.string().min(5, "Valid ID number is required"),
})

export const beneficiarySchema = z.object({
  name: z.string().min(2, "Name is required"),
  relation: z.string().min(2, "Relation is required"),
  idNumber: z.string().min(5, "ID number is required"),
  address: z.string().min(10, "Address is required"),
  age: z.number().min(1, "Age is required"),
  percentage: z.number().min(0).max(100).optional(),
})

export const bankAccountSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(5, "Account number is required"),
  accountType: z.string().min(2, "Account type is required"),
  branch: z.string().min(2, "Branch is required"),
  beneficiaryId: z.string().min(1, "Beneficiary must be selected"),
})

export const insurancePolicySchema = z.object({
  policyNumber: z.string().min(5, "Policy number is required"),
  company: z.string().min(2, "Company name is required"),
  policyType: z.string().min(2, "Policy type is required"),
  sumAssured: z.number().min(1, "Sum assured is required"),
  beneficiaryId: z.string().min(1, "Beneficiary must be selected"),
})

export const stockSchema = z.object({
  company: z.string().min(2, "Company name is required"),
  numberOfShares: z.number().min(1, "Number of shares is required"),
  certificateNumber: z.string().optional(),
  beneficiaryId: z.string().min(1, "Beneficiary must be selected"),
})

export const mutualFundSchema = z.object({
  fundName: z.string().min(2, "Fund name is required"),
  folioNumber: z.string().min(2, "Folio number is required"),
  units: z.number().min(0.01, "Units are required"),
  beneficiaryId: z.string().min(1, "Beneficiary must be selected"),
})

export const jewellerySchema = z.object({
  description: z.string().min(5, "Description is required"),
  estimatedValue: z.number().min(1, "Estimated value is required"),
  location: z.string().min(2, "Location is required"),
  beneficiaryId: z.string().min(1, "Beneficiary must be selected"),
})

export const immovableAssetSchema = z.object({
  propertyType: z.string().min(2, "Property type is required"),
  description: z.string().min(5, "Description is required"),
  location: z.string().min(5, "Location is required"),
  surveyNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  estimatedValue: z.number().min(1, "Estimated value is required"),
  beneficiaryId: z.string().min(1, "Beneficiary must be selected"),
})

export const executorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  relation: z.string().min(2, "Relation is required"),
  address: z.string().min(10, "Address is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  isPrimary: z.boolean().default(false),
})

export const witnessSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(10, "Address is required"),
  phone: z.string().min(10, "Phone number is required"),
  occupation: z.string().min(2, "Occupation is required"),
  idNumber: z.string().min(5, "ID number is required"),
})

export const guardianSchema = z.object({
  name: z.string().min(2, "Guardian name is required"),
  relation: z.string().min(2, "Relation is required"),
  address: z.string().min(10, "Address is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
})

export const willFormSchema = z.object({
  testator: testatorSchema,
  beneficiaries: z.array(beneficiarySchema).min(1, "At least one beneficiary is required"),
  bankAccounts: z.array(bankAccountSchema).optional(),
  insurancePolicies: z.array(insurancePolicySchema).optional(),
  stocks: z.array(stockSchema).optional(),
  mutualFunds: z.array(mutualFundSchema).optional(),
  jewellery: z.array(jewellerySchema).optional(),
  immovableAssets: z.array(immovableAssetSchema).optional(),
  executors: z.array(executorSchema).min(1, "At least one executor is required"),
  witnesses: z.array(witnessSchema).min(2, "At least two witnesses are required"),
  guardianClause: z.object({
    guardian: guardianSchema,
    minorChildren: z.array(z.string()).min(1, "At least one minor child is required"),
  }).optional(),
  liabilities: z.array(z.string()).optional(),
  dateOfWill: z.string().min(1, "Date of will is required"),
  placeOfWill: z.string().min(2, "Place of will is required"),
  specialInstructions: z.string().optional(),
})

export type WillFormData = z.infer<typeof willFormSchema>
export type TestatorData = z.infer<typeof testatorSchema>
export type BeneficiaryData = z.infer<typeof beneficiarySchema>
export type BankAccountData = z.infer<typeof bankAccountSchema>
export type InsurancePolicyData = z.infer<typeof insurancePolicySchema>
export type StockData = z.infer<typeof stockSchema>
export type MutualFundData = z.infer<typeof mutualFundSchema>
export type JewelleryData = z.infer<typeof jewellerySchema>
export type ImmovableAssetData = z.infer<typeof immovableAssetSchema>
export type ExecutorData = z.infer<typeof executorSchema>
export type WitnessData = z.infer<typeof witnessSchema>
export type GuardianData = z.infer<typeof guardianSchema>