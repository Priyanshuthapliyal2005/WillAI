import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Language mapping helper
const getLanguageFullName = (code: string): string => {
  const languages: Record<string, string> = {
    'es': 'Spanish (Español)',
    'fr': 'French (Français)', 
    'de': 'German (Deutsch)',
    'it': 'Italian (Italiano)',
    'pt': 'Portuguese (Português)',
    'hi': 'Hindi (हिन्दी)',
    'ar': 'Arabic (العربية)',
    'zh': 'Chinese (中文)',
    'ja': 'Japanese (日本語)',
    'ko': 'Korean (한국어)',
    'ru': 'Russian (Русский)'
  };
  return languages[code] || code.toUpperCase();
};

export interface WillData {
  testator: {
    fullName: string
    age: number
    occupation: string
    address: string
    idNumber: string
  }
  beneficiaries: Array<{
    id: string
    name: string
    relation: string
    idNumber: string
    address: string
    age: number
    percentage?: number
  }>
  movableAssets: {
    bankAccounts: Array<{
      id: string
      bankName: string
      accountNumber: string
      accountType: string
      branch: string
      beneficiaryId: string
    }>
    insurancePolicies: Array<{
      id: string
      policyNumber: string
      company: string
      policyType: string
      sumAssured: number
      beneficiaryId: string
    }>
    stocks: Array<{
      id: string
      company: string
      numberOfShares: number
      certificateNumber?: string
      beneficiaryId: string
    }>
    mutualFunds: Array<{
      id: string
      fundName: string
      folioNumber: string
      units: number
      beneficiaryId: string
    }>
  }
  physicalAssets: {
    jewellery: Array<{
      id: string
      description: string
      estimatedValue: number
      location: string
      beneficiaryId: string
    }>
  }
  immovableAssets: Array<{
    id: string
    propertyType: string
    description: string
    location: string
    surveyNumber?: string
    registrationNumber?: string
    estimatedValue: number
    beneficiaryId: string
  }>
  guardianClause?: {
    guardian: {
      name: string
      relation: string
      address: string
      phone: string
      email?: string
    }
    minorChildren: string[]
  }
  liabilities: string[]
  executors: Array<{
    id: string
    name: string
    relation: string
    address: string
    phone: string
    email?: string
    isPrimary: boolean
  }>
  witnesses: Array<{
    id: string
    name: string
    address: string
    phone: string
    occupation: string
    idNumber: string
  }>
  dateOfWill: string
  placeOfWill: string
  specialInstructions?: string
}

const LEGAL_WILL_PROMPT = `
You are an expert legal document generator specializing in Last Will and Testament documents. 

Generate a complete, legally structured HTML document for a "Last Will and Testament" using the provided JSON data.

LANGUAGE INSTRUCTIONS:
- If language is specified and is NOT English, translate the ENTIRE document into that language
- Use proper legal terminology for the target language
- Maintain the formal legal structure and language appropriate for legal documents in that jurisdiction
- Include culturally appropriate legal phrases and formats
- Ensure all legal concepts are properly translated with correct legal terminology

CRITICAL REQUIREMENTS:
1. Use formal legal language throughout (in specified language)
2. Structure as a legally valid will document
3. Use semantic HTML with proper tags (<article>, <section>, <h1>, <h2>, <table>, <p>, etc.)
4. Include semantic class names for styling: will-document, section-title, text-paragraph, beneficiary-table, asset-table, executor-table, witness-table, signature-section, etc.
5. Output ONLY the HTML content - no markdown, no explanations

DOCUMENT STRUCTURE:
1. Title: "LAST WILL AND TESTAMENT OF [TESTATOR NAME]" (translated to target language)
2. Declaration & Revocation clause (translated)
3. Beneficiaries table with all details (translated headers)
4. Movable Assets sections (Bank Accounts, Insurance, Stocks, Mutual Funds) (translated)
5. Physical Assets (Jewellery) (translated)
6. Immovable Assets (Properties) (translated)
7. Residual Clause (translated)
8. Guardian Clause (if applicable) (translated)
9. Liabilities Clause (translated)
10. Executors section (translated)
11. Special Instructions (if any) (translated)
12. Signature and Witness sections (translated)

STYLING REQUIREMENTS:
- Use class names that can be styled with Tailwind CSS
- Ensure theme-aware design (colors should be controllable via CSS variables)
- Make it print-friendly and professional
- Use proper table structures for assets and beneficiaries
- Include signature lines and witness attestation sections

LEGAL LANGUAGE:
- Use formal legal terminology appropriate for the target language
- Include proper declarations and revocations in target language
- Use equivalent of "I give, devise, and bequeath" for asset distribution in target language
- Include proper witness attestation language in target language
- Add execution clauses with date and place in target language

Generate the complete HTML document now:
`

export async function generateWillWithGemini(willData: WillData, language: string = 'en'): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    
    const prompt = `${LEGAL_WILL_PROMPT}

TARGET LANGUAGE: ${language === 'en' ? 'English' : getLanguageFullName(language)}

JSON DATA:
${JSON.stringify(willData, null, 2)}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const htmlContent = response.text()
    
    // Clean up the response to ensure it's valid HTML
    const cleanedHtml = htmlContent
      .replace(/```html/g, '')
      .replace(/```/g, '')
      .trim()
    
    return cleanedHtml
  } catch (error: any) {
    console.error('Error generating will with Gemini:', error)
    
    // Check if it's a service overload error
    if (error.status === 503 || error.message?.includes('overloaded')) {
      throw new Error('GEMINI_OVERLOADED')
    }
    
    // Check if it's an API key error
    if (error.status === 401 || error.status === 403) {
      throw new Error('GEMINI_AUTH_FAILED')
    }
    
    // Generic error for other cases
    throw new Error('GEMINI_FAILED')
  }
}