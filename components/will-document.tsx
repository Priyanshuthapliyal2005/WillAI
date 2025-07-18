import { WillData } from '@/types/will-types'
import { generateWillHTML } from '@/lib/will-generator'

interface WillDocumentProps {
  data: WillData
}

export function WillDocument({ data }: WillDocumentProps) {
  const htmlContent = generateWillHTML(data)
  
  return (
    <div 
      className="will-document-container"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}