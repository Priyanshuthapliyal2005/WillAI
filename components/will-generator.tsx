'use client';

import { useState } from 'react';
import { WillForm } from './will-form';
import { WillDocument } from './will-document';
import { WillData } from '@/types/will-types';
import { Button } from './ui/button';
import { FileText, ArrowLeft, Printer, Globe, Loader2 } from 'lucide-react';

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
  const [isInitialGenerating, setIsInitialGenerating] = useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  const handleWillSubmit = async (data: WillData, language: string = 'en') => {
    setIsInitialGenerating(true);
    setWillData(data);
    setSelectedLanguage(language);
    
    // Simulate processing time for will generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setShowDocument(true);
    setShowLanguageOptions(false);
    setAiGeneratedHtml('');
    setIsInitialGenerating(false);
  };

  const handleLanguageTranslation = async (language: string) => {
    if (!willData) return;
    
    setSelectedLanguage(language);
    
    // For English, just clear AI-generated HTML to use the original stable template
    if (language === 'en') {
      setAiGeneratedHtml('');
      return;
    }
    
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

  const handlePrint = () => {
    window.print();
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

          {!showDocument && !isInitialGenerating ? (
            <WillForm onSubmit={handleWillSubmit} isGenerating={isInitialGenerating} />
          ) : isInitialGenerating ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center max-w-md">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
                  <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  Generating Your Will Document
                </h3>
                <p className="text-muted-foreground mb-4">
                  Please wait while we create your professional will document with proper legal formatting...
                </p>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Processing your information and formatting the document...
                  </p>
                </div>
              </div>
            </div>
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
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Document Language:</span>
                      <span className="font-semibold capitalize">{getLanguageName(selectedLanguage)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {selectedLanguage === 'en' && !isGenerating && (
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
                    <Button
                      onClick={handlePrint}
                      className="flex items-center gap-2"
                      disabled={isGenerating}
                    >
                      <Printer className="w-4 h-4" />
                      Print Document
                    </Button>
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
                    <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      <p className="font-medium mb-1">Translation Notice:</p>
                      <p>AI translation will generate the document in your selected language. The English version will remain available.</p>
                    </div>
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
              ) : selectedLanguage === 'en' && !aiGeneratedHtml ? (
                willData && <WillDocument data={willData} />
              ) : (
                <div 
                  className="will-document" 
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
