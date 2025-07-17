import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function CreateWillPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Create a new will
  const will = await prisma.will.create({
    data: {
      userId: session.user.id,
      title: 'New Will',
      status: 'DRAFT',
      currentStep: 1,
    },
  })

  // Redirect to first step with the new will ID
  redirect(`/dashboard/1?willId=${will.id}`)
}