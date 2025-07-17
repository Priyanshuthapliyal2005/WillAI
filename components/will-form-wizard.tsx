'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { TestatorForm } from './forms/testator-form'
import { BeneficiariesForm } from './forms/beneficiaries-form'
import { AssetsForm } from './forms/assets-form'
import { ExecutorsForm } from './forms/executors-form'
import { WitnessesForm } from './forms/witnesses-form'
import { ReviewForm } from './forms/review-form'
import { WillPreview } from './will-preview'
import { toast } from 'sonner'

interface WillFormWizardProps {
  currentStep: number
  willId?: string
  userId: string
}

const STEPS = [
  { id: 1, title: 'Testator Information', description: 'Your personal details' },
  { id: 2, title: 'Beneficiaries', description: 'Who will inherit your assets' },
  { id: 3, title: 'Assets', description: 'Your movable and immovable assets' },
  { id: 4, title: 'Executors', description: 'Who will execute your will' },
  { id: 5, title: 'Witnesses', description: 'Legal witnesses for your will' },
  { id: 6, title: 'Review', description: 'Review all information' },
  { id: 7, title: 'Preview', description: 'Final will document' },
]

export function WillFormWizard({ currentStep, willId, userId }: WillFormWizardProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isGenerating, setIsGenerating] = useState(false)

  // Fetch will data
  const { data: willData, isLoading } = useQuery({
    queryKey: ['will', willId],
    queryFn: async () => {
      if (!willId) return null
      const response = await fetch(`/api/will/${willId}`)
      if (!response.ok) throw new Error('Failed to fetch will')
      return response.json()
    },
    enabled: !!willId,
  })

  // Save will data mutation
  const saveWillMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/saveUserInput', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          willId,
          userId,
          currentStep,
        }),
      })
      if (!response.ok) throw new Error('Failed to save will')
      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['will', willId] })
      toast.success('Progress saved successfully')
      
      // Update willId if this is a new will
      if (!willId && data.willId) {
        router.replace(`/dashboard/${currentStep}?willId=${data.willId}`)
      }
    },
    onError: () => {
      toast.error('Failed to save progress')
    },
  })

  // Generate will mutation
  const generateWillMutation = useMutation({
    mutationFn: async () => {
      if (!willId) throw new Error('No will ID')
      const response = await fetch('/api/generateWill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ willId }),
      })
      if (!response.ok) throw new Error('Failed to generate will')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['will', willId] })
      toast.success('Will generated successfully')
      setIsGenerating(false)
    },
    onError: () => {
      toast.error('Failed to generate will')
      setIsGenerating(false)
    },
  })

  const handleSaveAndContinue = async (data: any) => {
    try {
      // Save the data
      const result = await saveWillMutation.mutateAsync(data)
      
      // If save is successful, navigate to next step
      if (currentStep < 7) {
        const nextStep = currentStep + 1
        const newWillId = result?.willId || willId
        router.push(`/dashboard/${nextStep}${newWillId ? `?willId=${newWillId}` : ''}`)
      }
    } catch (error) {
      console.error('Failed to save and continue:', error)
      // Error is already shown via toast in mutation onError
    }
  }

  const handleNext = async (formData: any = {}) => {
    await handleSaveAndContinue(formData)
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      router.push(`/dashboard/${currentStep - 1}${willId ? `?willId=${willId}` : ''}`)
    }
  }

  const handleSave = async (data: any) => {
    // For form submissions, we want to save AND navigate
    await handleSaveAndContinue(data)
  }

  const handleGenerateWill = async () => {
    if (!willId) return
    setIsGenerating(true)
    generateWillMutation.mutate()
  }

  const renderStepContent = () => {
    const commonProps = {
      willData,
      onSave: handleSave,
      isLoading: saveWillMutation.isPending,
      onPrevious: handlePrevious,
      canGoBack: currentStep > 1,
    }

    switch (currentStep) {
      case 1:
        return <TestatorForm {...commonProps} />
      case 2:
        return <BeneficiariesForm {...commonProps} />
      case 3:
        return <AssetsForm {...commonProps} />
      case 4:
        return <ExecutorsForm {...commonProps} />
      case 5:
        return <WitnessesForm {...commonProps} />
      case 6:
        return <ReviewForm {...commonProps} onGenerateWill={handleGenerateWill} />
      case 7:
        return <WillPreview willId={willId} isGenerating={isGenerating} />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
              <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {STEPS.length}
            </div>
          </div>
          <Progress value={(currentStep / STEPS.length) * 100} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Step Content */}
      <div className="min-h-[600px]">
        {renderStepContent()}
      </div>
    </div>
  )
}