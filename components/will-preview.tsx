'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Printer, Share, ArrowLeft, FileText, Globe, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

// Languages available for translation
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

// Language mapping helper
const getLanguageName = (code: string): string => {
  return languages.find(lang => lang.code === code)?.name || code.toUpperCase();
};

interface WillPreviewProps {
  willId?: string
  isGenerating?: boolean
}

export function WillPreview({ willId, isGenerating = false }: WillPreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [aiGeneratedHtml, setAiGeneratedHtml] = useState<string>('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [showLanguageOptions, setShowLanguageOptions] = useState(false)

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

  // Update document title dynamically
  useEffect(() => {
    if (willData?.testator?.fullName) {
      document.title = `${willData.testator.fullName}'s Will - WillAI`
    } else {
      document.title = 'Will Preview - WillAI'
    }
    
    // Cleanup: restore original title when component unmounts
    return () => {
      document.title = 'WillAI'
    }
  }, [willData?.testator?.fullName])

  const handleLanguageTranslation = async (language: string) => {
    if (!willData) return;
    
    setSelectedLanguage(language);
    
    // For English, just clear AI-generated HTML to use the original stable template
    if (language === 'en') {
      setAiGeneratedHtml('');
      toast.success('Switched back to English version');
      return;
    }
    
    setIsTranslating(true);
    
    try {
      const response = await fetch('/api/generateWill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          language: language,
          data: willData 
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        setAiGeneratedHtml(result.html);
        toast.success(`Document translated to ${getLanguageName(language)}`);
      } else {
        throw new Error(result.error || 'Failed to generate');
      }
    } catch (error: any) {
      console.error('Error generating localized will:', error);
      
      // Handle specific Gemini errors
      let errorMessage = 'Failed to generate document in selected language.';
      if (error.message?.includes('GEMINI_OVERLOADED')) {
        errorMessage = 'AI service is temporarily overloaded. Please try again in a few minutes.';
      } else if (error.message?.includes('GEMINI_AUTH_FAILED')) {
        errorMessage = 'AI service authentication failed. Please contact support.';
      }
      
      toast.error(errorMessage + ' The English version is still available.');
      setSelectedLanguage('en'); // Fallback to English
      setAiGeneratedHtml('');
    } finally {
      setIsTranslating(false);
    }
  };

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
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Actions Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h2 className="text-xl font-semibold">
                  {willData?.testator?.fullName ? `${willData.testator.fullName}'s Will Document` : 'Your Will Document'}
                </h2>
                <p className="text-muted-foreground">
                  Generated on {willData.generatedAt ? new Date(willData.generatedAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {selectedLanguage === 'en' && !isTranslating && (
                <Button
                  onClick={() => setShowLanguageOptions(!showLanguageOptions)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  {showLanguageOptions ? 'Hide Languages' : 'Change Language'}
                </Button>
              )}
              {selectedLanguage !== 'en' && !isTranslating && (
                <Button
                  onClick={() => {
                    setSelectedLanguage('en');
                    setAiGeneratedHtml('');
                    setShowLanguageOptions(false);
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to English
                </Button>
              )}
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

          {/* Language Selection Panel */}
          {showLanguageOptions && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-medium">Select Language for Translation:</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Current Language:</span>
                    <span className="font-semibold capitalize">{getLanguageName(selectedLanguage)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => setShowLanguageOptions(false)}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕ Close
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {languages.filter(lang => lang.code !== 'en').map((lang) => (
                  <Button
                    key={lang.code}
                    onClick={() => handleLanguageTranslation(lang.code)}
                    variant="outline"
                    size="sm"
                    disabled={isTranslating}
                    className="justify-start h-auto py-2 px-3"
                  >
                    {isTranslating && selectedLanguage === lang.code ? (
                      <div className="flex items-center">
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        <span className="text-xs">Translating...</span>
                      </div>
                    ) : (
                      <span className="text-sm">{lang.name}</span>
                    )}
                  </Button>
                ))}
              </div>
              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                <p className="font-medium mb-1">Translation Notice:</p>
                <p>AI translation will generate the document in your selected language. The English version will remain available.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Will Document */}
      <Card className="will-document-container w-full">
        <CardContent className="p-0 overflow-x-auto">
          {isTranslating ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Generating document in {getLanguageName(selectedLanguage)}...</p>
              </div>
            </div>
          ) : selectedLanguage === 'en' && !aiGeneratedHtml ? (
            <div 
              className="will-document"
              dangerouslySetInnerHTML={{ __html: willData.generatedHtml }}
            />
          ) : (
            <div 
              className="will-document"
              dangerouslySetInnerHTML={{ __html: aiGeneratedHtml }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}