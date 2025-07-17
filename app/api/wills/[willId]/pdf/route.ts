import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import puppeteer from 'puppeteer'

export async function POST(
  request: NextRequest,
  { params }: { params: { willId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { willId } = params

    const will = await prisma.will.findUnique({
      where: { 
        id: willId,
        userId: session.user.id,
      },
      include: {
        testator: true,
      },
    })

    if (!will) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 })
    }

    if (!will.generatedHtml) {
      return NextResponse.json({ error: 'Will not generated yet' }, { status: 400 })
    }

    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()

    // Create complete HTML document with styles
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Will of ${will.testator?.fullName || 'Document'}</title>
          <style>
            /* Include your will document styles here */
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #000;
              background: #fff;
              margin: 0;
              padding: 20mm;
            }
            
            .will-document {
              max-width: none;
              margin: 0;
              padding: 0;
            }
            
            .will-title {
              font-size: 18pt;
              font-weight: bold;
              text-align: center;
              margin-bottom: 2rem;
              text-decoration: underline;
            }
            
            .section-title {
              font-size: 14pt;
              font-weight: bold;
              margin: 2rem 0 1rem 0;
              text-transform: uppercase;
              border-bottom: 1pt solid #000;
              padding-bottom: 0.5rem;
            }
            
            .text-paragraph {
              margin-bottom: 1rem;
              text-align: justify;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 1rem 0;
              font-size: 10pt;
            }
            
            th, td {
              border: 1pt solid #000;
              padding: 0.5rem;
              text-align: left;
              vertical-align: top;
            }
            
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            
            .signature-section {
              margin-top: 3rem;
              display: flex;
              justify-content: space-between;
            }
            
            .signature-line {
              width: 200px;
              border-bottom: 1pt solid #000;
              margin: 2rem 0 0.5rem 0;
            }
            
            @page {
              margin: 20mm;
              size: A4;
            }
          </style>
        </head>
        <body>
          ${will.generatedHtml}
        </body>
      </html>
    `

    await page.setContent(fullHtml, { waitUntil: 'networkidle0' })

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    })

    await browser.close()

    // Return PDF as response
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="will-${will.testator?.fullName || 'document'}.pdf"`,
      },
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}