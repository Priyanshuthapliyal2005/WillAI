'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { witnessSchema } from '@/lib/validations/will'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Save, ChevronLeft, ChevronRight } from 'lucide-react'

const witnessesFormSchema = z.object({
  witnesses: z.array(witnessSchema).min(2, 'At least two witnesses are required'),
})

type WitnessesFormData = z.infer<typeof witnessesFormSchema>

interface WitnessesFormProps {
  willData?: any
  onSave: (data: any) => void
  isLoading: boolean
  onPrevious?: () => void
  canGoBack?: boolean
  isEditingPreviousStep?: boolean
}

export function WitnessesForm({ willData, onSave, isLoading, onPrevious, canGoBack, isEditingPreviousStep }: WitnessesFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WitnessesFormData>({
    resolver: zodResolver(witnessesFormSchema),
    defaultValues: {
      witnesses: willData?.witnesses?.length > 0 
        ? willData.witnesses 
        : [
            { name: '', address: '', phone: '', occupation: '', idNumber: '' },
            { name: '', address: '', phone: '', occupation: '', idNumber: '' },
          ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'witnesses',
  })

  const addWitness = () => {
    append({ name: '', address: '', phone: '', occupation: '', idNumber: '' })
  }

  const onSubmit = (data: WitnessesFormData) => {
    onSave({ witnesses: data.witnesses })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Witnesses</CardTitle>
          <Button type="button" onClick={addWitness} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Witness
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Witness {index + 1}</h4>
                {fields.length > 2 && (
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
                    {...register(`witnesses.${index}.name`)}
                    placeholder="Enter witness's full name"
                  />
                  {errors.witnesses?.[index]?.name && (
                    <p className="text-sm text-destructive">
                      {errors.witnesses[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Occupation *</Label>
                  <Input
                    {...register(`witnesses.${index}.occupation`)}
                    placeholder="Enter occupation"
                  />
                  {errors.witnesses?.[index]?.occupation && (
                    <p className="text-sm text-destructive">
                      {errors.witnesses[index]?.occupation?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    {...register(`witnesses.${index}.phone`)}
                    placeholder="Enter phone number"
                  />
                  {errors.witnesses?.[index]?.phone && (
                    <p className="text-sm text-destructive">
                      {errors.witnesses[index]?.phone?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>ID Number *</Label>
                  <Input
                    {...register(`witnesses.${index}.idNumber`)}
                    placeholder="Enter ID number"
                  />
                  {errors.witnesses?.[index]?.idNumber && (
                    <p className="text-sm text-destructive">
                      {errors.witnesses[index]?.idNumber?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Complete Address *</Label>
                <Textarea
                  {...register(`witnesses.${index}.address`)}
                  placeholder="Enter complete address"
                  rows={2}
                />
                {errors.witnesses?.[index]?.address && (
                  <p className="text-sm text-destructive">
                    {errors.witnesses[index]?.address?.message}
                  </p>
                )}
              </div>
            </div>
          ))}

          {errors.witnesses && (
            <p className="text-sm text-destructive">
              {errors.witnesses.message}
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