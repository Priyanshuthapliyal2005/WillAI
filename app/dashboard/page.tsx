import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { WillList } from '@/components/will-list'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }
  const wills = await prisma.will.findMany({
    where: { userId: session.user.id },
    include: { testator: true, beneficiaries: true },
    orderBy: { updatedAt: 'desc' },
  })
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wills</h1>
          <p className="text-muted-foreground">
            Create and manage your legal will documents
          </p>
        </div>
      </div>
      <WillList wills={wills} />
    </div>
  )
}