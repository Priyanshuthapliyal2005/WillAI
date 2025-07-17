'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { testatorSchema, type TestatorData } from '@/lib/validations/will'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, ChevronLeft, ChevronRight } from 'lucide-react'

interface TestatorFormProps {
  willData?: any
  onSave: (data: any) => void
  isLoading: boolean
  onPrevious?: () => void
  canGoBack?: boolean
}

export function TestatorForm({ willData, onSave, isLoading, onPrevious, canGoBack }: TestatorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestatorData>({
    resolver: zodResolver(testatorSchema),
    defaultValues: willData?.testator || {
      fullName: '',
      age: 18,
      occupation: '',
      address: '',
      idNumber: '',
    },
  })

  const onSubmit = (data: TestatorData) => {
    onSave({ testator: data })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Testator Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Legal Name *</Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="Enter your full legal name"
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                {...register('age', { valueAsNumber: true })}
                placeholder="Enter your age"
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation *</Label>
              <Input
                id="occupation"
                {...register('occupation')}
                placeholder="Enter your occupation"
              />
              {errors.occupation && (
                <p className="text-sm text-destructive">{errors.occupation.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number *</Label>
              <Input
                id="idNumber"
                {...register('idNumber')}
                placeholder="Enter your ID number"
              />
              {errors.idNumber && (
                <p className="text-sm text-destructive">{errors.idNumber.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Complete Address *</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="Enter your complete address"
              rows={3}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

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