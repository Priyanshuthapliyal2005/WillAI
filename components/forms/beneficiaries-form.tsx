'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { beneficiarySchema } from '@/lib/validations/will'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Save, ChevronLeft, ChevronRight } from 'lucide-react'

const beneficiariesFormSchema = z.object({
  beneficiaries: z.array(beneficiarySchema).min(1, 'At least one beneficiary is required'),
})

type BeneficiariesFormData = z.infer<typeof beneficiariesFormSchema>

interface BeneficiariesFormProps {
  willData?: any
  onSave: (data: any) => void
  isLoading: boolean
  onPrevious?: () => void
  canGoBack?: boolean
  isEditingPreviousStep?: boolean
}

export function BeneficiariesForm({ willData, onSave, isLoading, onPrevious, canGoBack, isEditingPreviousStep }: BeneficiariesFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BeneficiariesFormData>({
    resolver: zodResolver(beneficiariesFormSchema),
    defaultValues: {
      beneficiaries: willData?.beneficiaries?.length > 0 
        ? willData.beneficiaries 
        : [{ name: '', relation: '', idNumber: '', address: '', age: 18 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'beneficiaries',
  })

  const addBeneficiary = () => {
    append({ name: '', relation: '', idNumber: '', address: '', age: 18 })
  }

  const onSubmit = (data: BeneficiariesFormData) => {
    onSave({ beneficiaries: data.beneficiaries })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Beneficiaries</CardTitle>
          <Button type="button" onClick={addBeneficiary} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Beneficiary
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Beneficiary {index + 1}</h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    {...register(`beneficiaries.${index}.name`)}
                    placeholder="Enter beneficiary's full name"
                  />
                  {errors.beneficiaries?.[index]?.name && (
                    <p className="text-sm text-destructive">
                      {errors.beneficiaries[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Relation to Testator *</Label>
                  <Input
                    {...register(`beneficiaries.${index}.relation`)}
                    placeholder="e.g., Son, Daughter, Spouse"
                  />
                  {errors.beneficiaries?.[index]?.relation && (
                    <p className="text-sm text-destructive">
                      {errors.beneficiaries[index]?.relation?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ID Number *</Label>
                  <Input
                    {...register(`beneficiaries.${index}.idNumber`)}
                    placeholder="Enter ID number"
                  />
                  {errors.beneficiaries?.[index]?.idNumber && (
                    <p className="text-sm text-destructive">
                      {errors.beneficiaries[index]?.idNumber?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Age *</Label>
                  <Input
                    type="number"
                    {...register(`beneficiaries.${index}.age`, { valueAsNumber: true })}
                    placeholder="Enter age"
                  />
                  {errors.beneficiaries?.[index]?.age && (
                    <p className="text-sm text-destructive">
                      {errors.beneficiaries[index]?.age?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Complete Address *</Label>
                <Textarea
                  {...register(`beneficiaries.${index}.address`)}
                  placeholder="Enter complete address"
                  rows={2}
                />
                {errors.beneficiaries?.[index]?.address && (
                  <p className="text-sm text-destructive">
                    {errors.beneficiaries[index]?.address?.message}
                  </p>
                )}
              </div>
            </div>
          ))}

          {errors.beneficiaries && (
            <p className="text-sm text-destructive">
              {errors.beneficiaries.message}
            </p>
          )}

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
                  {isEditingPreviousStep ? "Save Changes" : "Save & Continue"}
                  {!isEditingPreviousStep && <ChevronRight className="h-4 w-4 ml-2" />}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}