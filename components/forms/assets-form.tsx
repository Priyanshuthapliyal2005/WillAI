'use client'

import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
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
                      <Select
                        onValueChange={(value) => setValue(`bankAccounts.${index}.accountType`, value)}
                      >
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
                    <Select
                      onValueChange={(value) => setValue(`bankAccounts.${index}.beneficiaryId`, value)}
                    >
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
                    <Select
                      onValueChange={(value) => setValue(`insurancePolicies.${index}.beneficiaryId`, value)}
                    >
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
              <div className="text-center py-8 text-muted-foreground">
                Stocks section - Similar implementation pattern as above
              </div>
            </TabsContent>

            <TabsContent value="mutual-funds" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Mutual Funds section - Similar implementation pattern as above
              </div>
            </TabsContent>

            <TabsContent value="jewellery" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Jewellery section - Similar implementation pattern as above
              </div>
            </TabsContent>

            <TabsContent value="immovable" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Immovable Assets section - Similar implementation pattern as above
              </div>
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