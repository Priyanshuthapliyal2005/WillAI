'use client';

import { useState } from 'react';
import { WillForm } from './will-form';
import { WillDocument } from './will-document';
import { WillData } from '@/types/will-types';
import { Button } from './ui/button';
import { FileText, ArrowLeft, Printer } from 'lucide-react';

// Language mapping helper
const getLanguageName = (code: string): string => {
  const languages: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French', 
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'hi': 'Hindi',
    'ar': 'Arabic',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ru': 'Russian'
  };
  return languages[code] || code.toUpperCase();
};

export function WillGenerator() {
  const [willData, setWillData] = useState<WillData | null>(null);
  const [showDocument, setShowDocument] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [aiGeneratedHtml, setAiGeneratedHtml] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleWillSubmit = async (data: WillData, language: string = 'en') => {
    setWillData(data);
    setSelectedLanguage(language);
    
    // If not English, use Gemini for translation/localization
    if (language !== 'en') {
      setIsGenerating(true);
      try {
        const response = await fetch('/api/generateWill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            language: language,
            data: data 
          }),
        });
        
        const result = await response.json();
        if (result.success) {
          setAiGeneratedHtml(result.html);
        }
      } catch (error) {
        console.error('Error generating localized will:', error);
      } finally {
        setIsGenerating(false);
      }
    }
    
    setShowDocument(true);
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

          {!showDocument ? (
            <WillForm onSubmit={handleWillSubmit} />
          ) : (
            <div className="space-y-6">
              {/* Language and Document Controls */}
              <div className="flex justify-between items-center bg-card p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleBackToForm}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Form
                  </Button>
                  
                  {selectedLanguage !== 'en' && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Language:</span>
                      <span className="font-semibold capitalize">{getLanguageName(selectedLanguage)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
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
              
              {/* Will Document */}
              {isGenerating ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Generating document in {getLanguageName(selectedLanguage)}...</p>
                  </div>
                </div>
              ) : selectedLanguage === 'en' ? (
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