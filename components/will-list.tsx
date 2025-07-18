"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Link from 'next/link'
import { Plus, FileText, Clock, CheckCircle } from 'lucide-react'

export function WillList({ wills }: { wills: any[] }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteWillId, setDeleteWillId] = useState<string | null>(null)
  const [deleteWillTitle, setDeleteWillTitle] = useState<string>('')
  const [otp, setOtp] = useState('')
  const [isRequestingOtp, setIsRequestingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

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

  const getWillTitle = (will: any) => {
    if (will.testator?.fullName) {
      return `${will.testator.fullName}'s Will`
    }
    return will.title || 'New Will'
  }

  const handleDeleteClick = (willId: string, willTitle: string) => {
    setDeleteWillId(willId)
    setDeleteWillTitle(willTitle)
    setDeleteDialogOpen(true)
    setOtp('')
    setOtpSent(false)
  }

  const handleSendOtp = async () => {
    if (!deleteWillId) return
    setIsRequestingOtp(true)
    const res = await fetch(`/api/will/${deleteWillId}/delete-otp`, { method: 'POST' })
    setIsRequestingOtp(false)
    if (res.ok) {
      setOtpSent(true)
      toast.success('Verification code sent to your email')
    } else {
      toast.error('Failed to send verification code')
      setDeleteDialogOpen(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!deleteWillId) return
    setIsVerifyingOtp(true)
    const res = await fetch(`/api/will/${deleteWillId}/delete-otp`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp }),
    })
    setIsVerifyingOtp(false)
    if (res.ok) {
      toast.success('Will deleted successfully')
      setDeleteDialogOpen(false)
      window.location.reload()
    } else {
      const data = await res.json()
      toast.error(data.error || 'Failed to delete will')
    }
  }

  if (wills.length === 0) {
    return (
      <Card className="mx-auto text-center py-12 items-center justify-center rounded-lg max-w-md">
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
    )
  }

  return (
    <>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {wills.map((will) => (
            <Card key={will.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {getWillTitle(will)}
                  </CardTitle>
                  {getStatusIcon(will.status)}
                </div>
                <CardDescription>
                  Step {will.currentStep} of 6 • {will.beneficiaries.length} beneficiaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Created: {new Date(will.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(will.updatedAt).toLocaleDateString()}</p>
                  {will.status === 'FINALIZED' && will.generatedAt && (
                    <p>Finalized: {new Date(will.generatedAt).toLocaleDateString()}</p>
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
                  <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDeleteClick(will.id, getWillTitle(will))}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Will</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete <strong>{deleteWillTitle}</strong>?<br/>This action cannot be undone.</p>
          {!otpSent ? (
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isRequestingOtp}>Cancel</Button>
              <Button variant="destructive" onClick={handleSendOtp} disabled={isRequestingOtp}>
                {isRequestingOtp ? 'Sending...' : 'Send OTP'}
              </Button>
            </DialogFooter>
          ) : (
            <>
              <p className="mt-2">Enter the verification code sent to your email to confirm deletion.</p>
              <Input
                placeholder="Enter verification code"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                disabled={isVerifyingOtp}
                className="mt-2"
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isVerifyingOtp}>Cancel</Button>
                <Button variant="destructive" onClick={handleVerifyOtp} disabled={isVerifyingOtp || !otp}>
                  {isVerifyingOtp ? 'Verifying...' : 'Delete'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
