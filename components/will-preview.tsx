'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Printer, Share, ArrowLeft, FileText } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface WillPreviewProps {
  willId?: string
  isGenerating?: boolean
}

export function WillPreview({ willId, isGenerating = false }: WillPreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false)

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

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    if (!willId) return
    
    setIsDownloading(true)
    try {
      const response = await fetch(`/api/wills/${willId}/pdf`, {
        method: 'POST',
      })
      
      if (!response.ok) throw new Error('Failed to generate PDF')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `will-${willData?.testator?.fullName || 'document'}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('Failed to download PDF:', error)
      toast.error('Failed to download PDF')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Will Document',
          text: 'Here is my will document',
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Generating Your Will...</h3>
          <p className="text-muted-foreground">
            Please wait while we create your professional will document.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!willData?.generatedHtml) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Will Not Generated</h3>
          <p className="text-muted-foreground mb-4">
            Your will document hasn't been generated yet.
          </p>
          <Button asChild>
            <Link href={`/dashboard/will/${willId}`}>
              Continue Editing
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h2 className="text-xl font-semibold">Your Will Document</h2>
                <p className="text-muted-foreground">
                  Generated on {willData.generatedAt ? new Date(willData.generatedAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownloadPDF} disabled={isDownloading}>
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Will Document */}
      <Card className="will-document-container">
        <CardContent className="p-0">
          <div 
            className="will-document"
            dangerouslySetInnerHTML={{ __html: willData.generatedHtml }}
          />
        </CardContent>
      </Card>
    </div>
  )
}