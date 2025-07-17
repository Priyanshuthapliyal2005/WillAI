import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface WillPageProps {
  params: {
    willId: string
  }
}

export default async function WillPage({ params }: WillPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const will = await prisma.will.findUnique({
    where: {
      id: params.willId,
      userId: session.user.id,
    },
  })

  if (!will) {
    redirect('/dashboard')
  }

  // Redirect to the current step
  redirect(`/dashboard/${will.currentStep}?willId=${will.id}`)
}