import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { WillPreview } from '@/components/will-preview'

interface PreviewPageProps {
  params: {
    willId: string
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
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

  if (!will.generatedHtml) {
    redirect(`/dashboard/will/${will.id}`)
  }

  return <WillPreview willId={will.id} />
}