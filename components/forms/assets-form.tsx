'use client'

import { useEffect } from 'react'
import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { bankAccountSchema, insurancePolicySchema, stockSchema, mutualFundSchema, jewellerySchema, immovableAssetSchema } from '@/lib/validations/will'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Save, ChevronLeft, ChevronRight } from 'lucide-react'

const assetsFormSchema = z.object({
  bankAccounts: z.array(bankAccountSchema).optional(),
  insurancePolicies: z.array(insurancePolicySchema).optional(),
  stocks: z.array(stockSchema).optional(),
  mutualFunds: z.array(mutualFundSchema).optional(),
  jewellery: z.array(jewellerySchema).optional(),
  immovableAssets: z.array(immovableAssetSchema).optional(),
})

type AssetsFormData = z.infer<typeof assetsFormSchema>

interface AssetsFormProps {
  willData?: any
  onSave: (data: any) => void
  isLoading: boolean
  onPrevious?: () => void
  canGoBack?: boolean
}

export function AssetsForm({ willData, onSave, isLoading, onPrevious, canGoBack }: AssetsFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AssetsFormData>({
    resolver: zodResolver(assetsFormSchema),
    defaultValues: {
      bankAccounts: willData?.bankAccounts || [],
      insurancePolicies: willData?.insurancePolicies || [],
      stocks: willData?.stocks || [],
      mutualFunds: willData?.mutualFunds || [],
      jewellery: willData?.jewellery || [],
      immovableAssets: willData?.immovableAssets || [],
    },
  })

  // Reset form when willData changes (for editing/restoring)
  useEffect(() => {
    reset({
      bankAccounts: willData?.bankAccounts || [],
      insurancePolicies: willData?.insurancePolicies || [],
      stocks: willData?.stocks || [],
      mutualFunds: willData?.mutualFunds || [],
      jewellery: willData?.jewellery || [],
      immovableAssets: willData?.immovableAssets || [],
    })
  }, [willData, reset])

  const bankAccountsFields = useFieldArray({ control, name: 'bankAccounts' })
  const insuranceFields = useFieldArray({ control, name: 'insurancePolicies' })
  const stocksFields = useFieldArray({ control, name: 'stocks' })
  const mutualFundsFields = useFieldArray({ control, name: 'mutualFunds' })
  const jewelleryFields = useFieldArray({ control, name: 'jewellery' })
  const immovableFields = useFieldArray({ control, name: 'immovableAssets' })

  const beneficiaries = willData?.beneficiaries || []

  const onSubmit = (data: AssetsFormData) => {
    onSave(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="bank-accounts" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="bank-accounts">Bank Accounts</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
              <TabsTrigger value="mutual-funds">Mutual Funds</TabsTrigger>
              <TabsTrigger value="jewellery">Jewellery</TabsTrigger>
              <TabsTrigger value="immovable">Property</TabsTrigger>
            </TabsList>

            {/* Bank Accounts */}
            <TabsContent value="bank-accounts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Bank Accounts</h3>
                <Button
                  type="button"
                  onClick={() => bankAccountsFields.append({
                    bankName: '',
                    accountNumber: '',
                    accountType: '',
                    branch: '',
                    beneficiaryId: '',
                    sharePercentage: '100%',
                  })}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </div>

              {bankAccountsFields.fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Bank Account {index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => bankAccountsFields.remove(index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bank Name *</Label>
                      <Input
                        {...register(`bankAccounts.${index}.bankName`)}
                        placeholder="Enter bank name"
                      />
                      {errors.bankAccounts?.[index]?.bankName && (
                        <p className="text-sm text-destructive">
                          {errors.bankAccounts[index]?.bankName?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Account Number *</Label>
                      <Input
                        {...register(`bankAccounts.${index}.accountNumber`)}
                        placeholder="Enter account number"
                      />
                      {errors.bankAccounts?.[index]?.accountNumber && (
                        <p className="text-sm text-destructive">
                          {errors.bankAccounts[index]?.accountNumber?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Type *</Label>
                      <Controller
                        control={control}
                        name={`bankAccounts.${index}.accountType`}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="savings">Savings Account</SelectItem>
                              <SelectItem value="current">Current Account</SelectItem>
                              <SelectItem value="fixed">Fixed Deposit</SelectItem>
                              <SelectItem value="recurring">Recurring Deposit</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.bankAccounts?.[index]?.accountType && (
                        <p className="text-sm text-destructive">
                          {errors.bankAccounts[index]?.accountType?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Branch *</Label>
                      <Input
                        {...register(`bankAccounts.${index}.branch`)}
                        placeholder="Enter branch name"
                      />
                      {errors.bankAccounts?.[index]?.branch && (
                        <p className="text-sm text-destructive">
                          {errors.bankAccounts[index]?.branch?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Beneficiary *</Label>
                    <Controller
                      control={control}
                      name={`bankAccounts.${index}.beneficiaryId`}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select beneficiary" />
                          </SelectTrigger>
                          <SelectContent>
                            {beneficiaries.map((beneficiary: any) => (
                              <SelectItem key={beneficiary.id} value={beneficiary.id}>
                                {beneficiary.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.bankAccounts?.[index]?.beneficiaryId && (
                      <p className="text-sm text-destructive">
                        {errors.bankAccounts[index]?.beneficiaryId?.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {bankAccountsFields.fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No bank accounts added yet. Click "Add Account" to start.
                </div>
              )}
            </TabsContent>

            {/* Insurance Policies */}
            <TabsContent value="insurance" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Insurance Policies</h3>
                <Button
                  type="button"
                  onClick={() => insuranceFields.append({
                    policyNumber: '',
                    company: '',
                    policyType: '',
                    sumAssured: 0,
                    beneficiaryId: '',
                    sharePercentage: '100%',
                  })}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Policy
                </Button>
              </div>

              {insuranceFields.fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Insurance Policy {index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => insuranceFields.remove(index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Policy Number *</Label>
                      <Input
                        {...register(`insurancePolicies.${index}.policyNumber`)}
                        placeholder="Enter policy number"
                      />
                      {errors.insurancePolicies?.[index]?.policyNumber && (
                        <p className="text-sm text-destructive">
                          {errors.insurancePolicies[index]?.policyNumber?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Insurance Company *</Label>
                      <Input
                        {...register(`insurancePolicies.${index}.company`)}
                        placeholder="Enter company name"
                      />
                      {errors.insurancePolicies?.[index]?.company && (
                        <p className="text-sm text-destructive">
                          {errors.insurancePolicies[index]?.company?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Policy Type *</Label>
                      <Input
                        {...register(`insurancePolicies.${index}.policyType`)}
                        placeholder="e.g., Life, Health, Term"
                      />
                      {errors.insurancePolicies?.[index]?.policyType && (
                        <p className="text-sm text-destructive">
                          {errors.insurancePolicies[index]?.policyType?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Sum Assured *</Label>
                      <Input
                        type="number"
                        {...register(`insurancePolicies.${index}.sumAssured`, { valueAsNumber: true })}
                        placeholder="Enter sum assured"
                      />
                      {errors.insurancePolicies?.[index]?.sumAssured && (
                        <p className="text-sm text-destructive">
                          {errors.insurancePolicies[index]?.sumAssured?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Beneficiary *</Label>
                    <Controller
                      control={control}
                      name={`insurancePolicies.${index}.beneficiaryId`}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select beneficiary" />
                          </SelectTrigger>
                          <SelectContent>
                            {beneficiaries.map((beneficiary: any) => (
                              <SelectItem key={beneficiary.id} value={beneficiary.id}>
                                {beneficiary.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.insurancePolicies?.[index]?.beneficiaryId && (
                      <p className="text-sm text-destructive">
                        {errors.insurancePolicies[index]?.beneficiaryId?.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {insuranceFields.fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No insurance policies added yet. Click "Add Policy" to start.
                </div>
              )}
            </TabsContent>

            {/* Similar patterns for other asset types */}
            <TabsContent value="stocks" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Stocks and Securities</h3>
                <Button
                  type="button"
                  onClick={() => stocksFields.append({
                    company: '',
                    numberOfShares: 0,
                    certificateNumber: '',
                    accountNumber: '',
                    beneficiaryId: '',
                    sharePercentage: '100%',
                  })}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stock
                </Button>
              </div>

              {stocksFields.fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Stock {index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => stocksFields.remove(index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company Name *</Label>
                      <Input
                        {...register(`stocks.${index}.company`)}
                        placeholder="Enter company name"
                      />
                      {errors.stocks?.[index]?.company && (
                        <p className="text-sm text-destructive">
                          {errors.stocks[index]?.company?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Number of Shares *</Label>
                      <Input
                        type="number"
                        {...register(`stocks.${index}.numberOfShares`, { valueAsNumber: true })}
                        placeholder="Enter number of shares"
                      />
                      {errors.stocks?.[index]?.numberOfShares && (
                        <p className="text-sm text-destructive">
                          {errors.stocks[index]?.numberOfShares?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Certificate Number</Label>
                      <Input
                        {...register(`stocks.${index}.certificateNumber`)}
                        placeholder="Enter certificate number (optional)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Account Number</Label>
                      <Input
                        {...register(`stocks.${index}.accountNumber`)}
                        placeholder="Enter account number (optional)"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Beneficiary *</Label>
                    <Controller
                      control={control}
                      name={`stocks.${index}.beneficiaryId`}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select beneficiary" />
                          </SelectTrigger>
                          <SelectContent>
                            {beneficiaries.map((beneficiary: any) => (
                              <SelectItem key={beneficiary.id} value={beneficiary.id}>
                                {beneficiary.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.stocks?.[index]?.beneficiaryId && (
                      <p className="text-sm text-destructive">
                        {errors.stocks[index]?.beneficiaryId?.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {stocksFields.fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No stocks added yet. Click "Add Stock" to start.
                </div>
              )}
            </TabsContent>

            <TabsContent value="mutual-funds" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Mutual Fund Investments</h3>
                <Button
                  type="button"
                  onClick={() => mutualFundsFields.append({
                    fundName: '',
                    folioNumber: '',
                    units: 0,
                    beneficiaryId: '',
                    distributor: '',
                    accountNumber: '',
                    sharePercentage: '100%',
                  })}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mutual Fund
                </Button>
              </div>

              {mutualFundsFields.fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Mutual Fund {index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => mutualFundsFields.remove(index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fund Name *</Label>
                      <Input
                        {...register(`mutualFunds.${index}.fundName`)}
                        placeholder="Enter fund name"
                      />
                      {errors.mutualFunds?.[index]?.fundName && (
                        <p className="text-sm text-destructive">
                          {errors.mutualFunds[index]?.fundName?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Folio Number *</Label>
                      <Input
                        {...register(`mutualFunds.${index}.folioNumber`)}
                        placeholder="Enter folio number"
                      />
                      {errors.mutualFunds?.[index]?.folioNumber && (
                        <p className="text-sm text-destructive">
                          {errors.mutualFunds[index]?.folioNumber?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Number of Units *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`mutualFunds.${index}.units`, { valueAsNumber: true })}
                        placeholder="Enter number of units"
                      />
                      {errors.mutualFunds?.[index]?.units && (
                        <p className="text-sm text-destructive">
                          {errors.mutualFunds[index]?.units?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Beneficiary *</Label>
                      <Controller
                        control={control}
                        name={`mutualFunds.${index}.beneficiaryId`}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select beneficiary" />
                            </SelectTrigger>
                            <SelectContent>
                              {beneficiaries.map((beneficiary: any) => (
                                <SelectItem key={beneficiary.id} value={beneficiary.id}>
                                  {beneficiary.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.mutualFunds?.[index]?.beneficiaryId && (
                        <p className="text-sm text-destructive">
                          {errors.mutualFunds[index]?.beneficiaryId?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {mutualFundsFields.fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No mutual funds added yet. Click "Add Mutual Fund" to start.
                </div>
              )}
            </TabsContent>

            <TabsContent value="jewellery" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Jewellery and Precious Items</h3>
                <Button
                  type="button"
                  onClick={() => jewelleryFields.append({
                    type: '',
                    description: '',
                    estimatedValue: 0,
                    location: '',
                    invoiceNumber: '',
                    beneficiaryId: '',
                    sharePercentage: '100%',
                  })}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Jewellery Item
                </Button>
              </div>

              {jewelleryFields.fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Jewellery Item {index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => jewelleryFields.remove(index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type *</Label>
                      <Controller
                        control={control}
                        name={`jewellery.${index}.type`}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select jewellery type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gold">Gold Jewellery</SelectItem>
                              <SelectItem value="silver">Silver Jewellery</SelectItem>
                              <SelectItem value="diamond">Diamond Jewellery</SelectItem>
                              <SelectItem value="platinum">Platinum Jewellery</SelectItem>
                              <SelectItem value="precious-stones">Precious Stones</SelectItem>
                              <SelectItem value="watch">Watch</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {(() => {
                        const err = errors.jewellery?.[index]?.type;
                        if (!err) return null;
                        if (typeof err === 'string') {
                          return <p className="text-sm text-destructive">{err}</p>;
                        }
                        if (typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
                          return <p className="text-sm text-destructive">{err.message}</p>;
                        }
                        return null;
                      })()}
                    </div>

                    <div className="space-y-2">
                      <Label>Description *</Label>
                      <Input
                        {...register(`jewellery.${index}.description`)}
                        placeholder="Detailed description of the item"
                      />
                      {errors.jewellery?.[index]?.description && (
                        <p className="text-sm text-destructive">
                          {errors.jewellery[index]?.description?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Estimated Value (₹) *</Label>
                      <Input
                        type="number"
                        {...register(`jewellery.${index}.estimatedValue`, { valueAsNumber: true })}
                        placeholder="Enter estimated value"
                      />
                      {errors.jewellery?.[index]?.estimatedValue && (
                        <p className="text-sm text-destructive">
                          {errors.jewellery[index]?.estimatedValue?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Invoice Number</Label>
                      <Input
                        {...register(`jewellery.${index}.invoiceNumber`)}
                        placeholder="Enter invoice/bill number (optional)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Current Location *</Label>
                      <Input
                        {...register(`jewellery.${index}.location`)}
                        placeholder="Where is this item currently stored?"
                      />
                      {errors.jewellery?.[index]?.location && (
                        <p className="text-sm text-destructive">
                          {errors.jewellery[index]?.location?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Beneficiary *</Label>
                      <Controller
                        control={control}
                        name={`jewellery.${index}.beneficiaryId`}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select beneficiary" />
                            </SelectTrigger>
                            <SelectContent>
                              {beneficiaries.map((beneficiary: any) => (
                                <SelectItem key={beneficiary.id} value={beneficiary.id}>
                                  {beneficiary.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.jewellery?.[index]?.beneficiaryId && (
                        <p className="text-sm text-destructive">
                          {errors.jewellery[index]?.beneficiaryId?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {jewelleryFields.fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No jewellery items added yet. Click "Add Jewellery Item" to start.
                </div>
              )}
            </TabsContent>

            <TabsContent value="immovable" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Immovable Property</h3>
                <Button
                  type="button"
                  onClick={() => immovableFields.append({
                    propertyType: '',
                    name: '',
                    description: '',
                    location: '',
                    surveyNumber: '',
                    registrationNumber: '',
                    estimatedValue: 0,
                    beneficiaryId: '',
                    sharePercentage: '100%',
                  })}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </div>

              {immovableFields.fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Property {index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => immovableFields.remove(index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Property Type *</Label>
                      <Controller
                        control={control}
                        name={`immovableAssets.${index}.propertyType`}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="residential-house">Residential House</SelectItem>
                              <SelectItem value="apartment">Apartment/Flat</SelectItem>
                              <SelectItem value="commercial-building">Commercial Building</SelectItem>
                              <SelectItem value="office-space">Office Space</SelectItem>
                              <SelectItem value="agricultural-land">Agricultural Land</SelectItem>
                              <SelectItem value="residential-plot">Residential Plot</SelectItem>
                              <SelectItem value="commercial-plot">Commercial Plot</SelectItem>
                              <SelectItem value="industrial-land">Industrial Land</SelectItem>
                              <SelectItem value="warehouse">Warehouse</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.immovableAssets?.[index]?.propertyType && (
                        <p className="text-sm text-destructive">
                          {errors.immovableAssets[index]?.propertyType?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Property Name *</Label>
                      <Input
                        {...register(`immovableAssets.${index}.name`)}
                        placeholder="Name or title of the property"
                      />
                      {errors.immovableAssets?.[index]?.name && (
                        <p className="text-sm text-destructive">
                          {errors.immovableAssets[index]?.name?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea
                      {...register(`immovableAssets.${index}.description`)}
                      placeholder="Detailed description of the property"
                      rows={3}
                    />
                    {errors.immovableAssets?.[index]?.description && (
                      <p className="text-sm text-destructive">
                        {errors.immovableAssets[index]?.description?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Textarea
                      {...register(`immovableAssets.${index}.location`)}
                      placeholder="Complete address and location details"
                      rows={2}
                    />
                    {errors.immovableAssets?.[index]?.location && (
                      <p className="text-sm text-destructive">
                        {errors.immovableAssets[index]?.location?.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Survey Number</Label>
                      <Input
                        {...register(`immovableAssets.${index}.surveyNumber`)}
                        placeholder="Survey number (if applicable)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Registration Number</Label>
                      <Input
                        {...register(`immovableAssets.${index}.registrationNumber`)}
                        placeholder="Registration/document number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Estimated Value (₹) *</Label>
                      <Input
                        type="number"
                        {...register(`immovableAssets.${index}.estimatedValue`, { valueAsNumber: true })}
                        placeholder="Enter estimated market value"
                      />
                      {errors.immovableAssets?.[index]?.estimatedValue && (
                        <p className="text-sm text-destructive">
                          {errors.immovableAssets[index]?.estimatedValue?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Beneficiary *</Label>
                      <Controller
                        control={control}
                        name={`immovableAssets.${index}.beneficiaryId`}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select beneficiary" />
                            </SelectTrigger>
                            <SelectContent>
                              {beneficiaries.map((beneficiary: any) => (
                                <SelectItem key={beneficiary.id} value={beneficiary.id}>
                                  {beneficiary.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.immovableAssets?.[index]?.beneficiaryId && (
                        <p className="text-sm text-destructive">
                          {errors.immovableAssets[index]?.beneficiaryId?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {immovableFields.fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No properties added yet. Click "Add Property" to start.
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-between">
            {canGoBack ? (
              <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                disabled={isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Save & Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}