import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const wills = await prisma.will.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      testator: true,
      beneficiaries: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'FINALIZED':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Wills</h1>
          <p className="text-muted-foreground">
            Create and manage your legal will documents
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create">
            <Plus className="h-4 w-4 mr-2" />
            Create New Will
          </Link>
        </Button>
      </div>

      {/* Wills Grid */}
      {wills.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No wills created yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first will document
            </p>
            <Button asChild>
              <Link href="/dashboard/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Will
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wills.map((will) => (
            <Card key={will.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {will.title || `Will of ${will.testator?.fullName || 'Untitled'}`}
                  </CardTitle>
                  {getStatusIcon(will.status)}
                </div>
                <CardDescription>
                  Step {will.currentStep} of 6 • {will.beneficiaries.length} beneficiaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Created: {will.createdAt.toLocaleDateString()}</p>
                  <p>Updated: {will.updatedAt.toLocaleDateString()}</p>
                  {will.status === 'FINALIZED' && will.generatedAt && (
                    <p>Finalized: {will.generatedAt.toLocaleDateString()}</p>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/dashboard/will/${will.id}`}>
                      Continue
                    </Link>
                  </Button>
                  {will.status === 'COMPLETED' && (
                    <Button size="sm" asChild className="flex-1">
                      <Link href={`/dashboard/will/${will.id}/preview`}>
                        View
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}