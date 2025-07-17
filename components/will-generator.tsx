'use client';

import { useState, useEffect } from 'react';
import { WillForm } from './will-form';
import { WillDocument } from './will-document';
import { WillData } from '@/types/will-types';
import { Button } from './ui/button';
import { FileText, ArrowLeft, Printer, Globe, Loader2, Download, FileDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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

export function WillGenerator() {
  const [willData, setWillData] = useState<WillData | null>(null);
  const [showDocument, setShowDocument] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [aiGeneratedHtml, setAiGeneratedHtml] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(true); // Always show language options

  useEffect(() => {
    // No need to check Gemini key - show language options by default
  }, []);

  const handleWillSubmit = (data: WillData, language: string = 'en') => {
    setWillData(data);
    setSelectedLanguage(language);
    setShowDocument(true);
    // Always show English first, then language options
    setShowLanguageOptions(false);
    setAiGeneratedHtml('');
  };

  const handleLanguageTranslation = async (language: string) => {
    if (!willData) return;
    
    setSelectedLanguage(language);
    setIsGenerating(true);
    
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
      
      alert(errorMessage + ' The English version is still available below.');
      setSelectedLanguage('en'); // Fallback to English
      setAiGeneratedHtml('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToForm = () => {
    setShowDocument(false);
  };

    const handlePrint = (forcePrint: boolean = false) => {
    if (forcePrint) {
      // Force print dialog
      const printContent = document.querySelector('.will-document')?.innerHTML;
      if (!printContent) return;

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Will Document - Print</title>
            <link rel="stylesheet" href="/styles.css">
            <style>
              body { margin: 0; padding: 20px; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            <div class="will-document">${printContent}</div>
            <script>
              window.onload = () => window.print();
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
      
      // Close print window after delay
      setTimeout(() => {
        printWindow.close();
      }, 250);
    } else {
      window.print();
    }
  };

  const handleDownloadPDF = async () => {
    if (!willData) return;
    
    // Simple PDF generation using browser print
    handlePrint();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-4xl font-bold text-foreground">
                Last Will and Testament Generator
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create a legally structured will document with professional formatting 
              and comprehensive asset management
            </p>
          </div>

          {!showDocument ? (
            <WillForm onSubmit={handleWillSubmit} />
          ) : (
            <div className="space-y-6">
              {/* Language and Document Controls */}
              <div className="bg-card p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={handleBackToForm}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Form
                    </Button>
                    
                    {hasGeminiKey && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline"
                            className="flex items-center gap-2"
                            disabled={isGenerating}
                          >
                            <Globe className="h-4 w-4" />
                            {isGenerating ? 'Translating...' : getLanguageName(selectedLanguage)}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {languages.map((lang) => (
                            <DropdownMenuItem
                              key={lang.code}
                              disabled={isGenerating || selectedLanguage === lang.code}
                              onSelect={() => handleLanguageTranslation(lang.code)}
                            >
                              {lang.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {hasGeminiKey && selectedLanguage === 'en' && !isGenerating && (
                      <Button
                        onClick={() => setShowLanguageOptions(!showLanguageOptions)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        {showLanguageOptions ? 'Hide Languages' : 'Change Language'}
                      </Button>
                    )}
                    {selectedLanguage !== 'en' && !isGenerating && (
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
                    <div className="h-6 w-px bg-border" /> {/* Divider */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          disabled={isGenerating}
                        >
                          <Download className="h-4 w-4" />
                          Download As
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleDownloadPDF}>
                          <FileDown className="h-4 w-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePrint()}>
                          <Printer className="h-4 w-4 mr-2" />
                          Print Document
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Language Selection Panel */}
                {showLanguageOptions && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">Select Language for Translation:</h3>
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
                          disabled={isGenerating}
                          className="justify-start h-auto py-2 px-3"
                        >
                          {isGenerating && selectedLanguage === lang.code ? (
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
                    {hasGeminiKey ? (
                      <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                        <p className="font-medium mb-1">Translation Notice:</p>
                        <p>AI translation will generate the document in your selected language. The English version will remain available.</p>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground bg-destructive/10 p-3 rounded-lg">
                        <p className="font-medium mb-1">Translation Unavailable</p>
                        <p>Language translation requires a valid Gemini API key. Please configure the API key in settings to enable translations.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Will Document */}
              {isGenerating ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Generating document in {getLanguageName(selectedLanguage)}...</p>
                  </div>
                </div>
              ) : selectedLanguage === 'en' || !aiGeneratedHtml ? (
                willData && <WillDocument data={willData} />
              ) : (
                <div 
                  className="will-document-ai" 
                  dangerouslySetInnerHTML={{ __html: aiGeneratedHtml }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}