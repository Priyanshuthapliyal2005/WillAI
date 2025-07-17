'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { executorSchema } from '@/lib/validations/will'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Save } from 'lucide-react'

const executorsFormSchema = z.object({
  executors: z.array(executorSchema).min(1, 'At least one executor is required'),
})

type ExecutorsFormData = z.infer<typeof executorsFormSchema>

interface ExecutorsFormProps {
  willData?: any
  onSave: (data: any) => void
  isLoading: boolean
}

export function ExecutorsForm({ willData, onSave, isLoading }: ExecutorsFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExecutorsFormData>({
    resolver: zodResolver(executorsFormSchema),
    defaultValues: {
      executors: willData?.executors?.length > 0 
        ? willData.executors 
        : [{ name: '', relation: '', address: '', phone: '', email: '', isPrimary: true }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'executors',
  })

  const addExecutor = () => {
    append({ name: '', relation: '', address: '', phone: '', email: '', isPrimary: false })
  }

  const onSubmit = (data: ExecutorsFormData) => {
    onSave({ executors: data.executors })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Executors</CardTitle>
          <Button type="button" onClick={addExecutor} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Executor
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  {watch(`executors.${index}.isPrimary`) ? 'Primary Executor' : 'Executor'} {index + 1}
                </h4>
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`primary-${index}`}
                  checked={watch(`executors.${index}.isPrimary`)}
                  onCheckedChange={(checked) => {
                    // Ensure only one primary executor
                    if (checked) {
                      fields.forEach((_, i) => {
                        setValue(`executors.${i}.isPrimary`, i === index)
                      })
                    }
                  }}
                />
                <Label htmlFor={`primary-${index}`}>Primary Executor</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    {...register(`executors.${index}.name`)}
                    placeholder="Enter executor's full name"
                  />
                  {errors.executors?.[index]?.name && (
                    <p className="text-sm text-destructive">
                      {errors.executors[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Relation to Testator *</Label>
                  <Input
                    {...register(`executors.${index}.relation`)}
                    placeholder="e.g., Son, Friend, Lawyer"
                  />
                  {errors.executors?.[index]?.relation && (
                    <p className="text-sm text-destructive">
                      {errors.executors[index]?.relation?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    {...register(`executors.${index}.phone`)}
                    placeholder="Enter phone number"
                  />
                  {errors.executors?.[index]?.phone && (
                    <p className="text-sm text-destructive">
                      {errors.executors[index]?.phone?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email (Optional)</Label>
                  <Input
                    type="email"
                    {...register(`executors.${index}.email`)}
                    placeholder="Enter email address"
                  />
                  {errors.executors?.[index]?.email && (
                    <p className="text-sm text-destructive">
                      {errors.executors[index]?.email?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Complete Address *</Label>
                <Textarea
                  {...register(`executors.${index}.address`)}
                  placeholder="Enter complete address"
                  rows={2}
                />
                {errors.executors?.[index]?.address && (
                  <p className="text-sm text-destructive">
                    {errors.executors[index]?.address?.message}
                  </p>
                )}
              </div>
            </div>
          ))}

          {errors.executors && (
            <p className="text-sm text-destructive">
              {errors.executors.message}
            </p>
          )}

          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}