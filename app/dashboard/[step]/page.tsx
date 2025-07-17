import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { WillFormWizard } from '@/components/will-form-wizard'

interface StepPageProps {
  params: {
    step: string
  }
  searchParams: {
    willId?: string
  }
}

export default async function StepPage({ params, searchParams }: StepPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const step = parseInt(params.step)
  
  if (isNaN(step) || step < 1 || step > 7) {
    redirect('/dashboard')
  }

  return (
    <WillFormWizard 
      currentStep={step} 
      willId={searchParams.willId}
      userId={session.user.id}
    />
  )
}