import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateWillWithGemini, type WillData } from '@/lib/gemini'

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

    // Fetch complete will data
    const will = await prisma.will.findUnique({
      where: { 
        id: willId,
        userId: session.user.id,
      },
      include: {
        testator: true,
        beneficiaries: true,
        bankAccounts: true,
        insurancePolicies: true,
        stocks: true,
        mutualFunds: true,
        jewellery: true,
        immovableAssets: true,
        executors: true,
        witnesses: true,
      },
    })

    if (!will) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 })
    }

    if (!will.testator) {
      return NextResponse.json({ error: 'Testator information is required' }, { status: 400 })
    }

    if (will.beneficiaries.length === 0) {
      return NextResponse.json({ error: 'At least one beneficiary is required' }, { status: 400 })
    }

    if (will.executors.length === 0) {
      return NextResponse.json({ error: 'At least one executor is required' }, { status: 400 })
    }

    if (will.witnesses.length < 2) {
      return NextResponse.json({ error: 'At least two witnesses are required' }, { status: 400 })
    }

    // Transform data for Gemini
    const willData: WillData = {
      testator: {
        fullName: will.testator.fullName,
        age: will.testator.age,
        occupation: will.testator.occupation,
        address: will.testator.address,
        idNumber: will.testator.idNumber,
      },
      beneficiaries: will.beneficiaries.map(b => ({
        id: b.id,
        name: b.name,
        relation: b.relation,
        idNumber: b.idNumber,
        address: b.address,
        age: b.age,
        percentage: b.percentage || undefined,
      })),
      movableAssets: {
        bankAccounts: will.bankAccounts.map(a => ({
          id: a.id,
          bankName: a.bankName,
          accountNumber: a.accountNumber,
          accountType: a.accountType,
          branch: a.branch,
          beneficiaryId: a.beneficiaryId,
        })),
        insurancePolicies: will.insurancePolicies.map(p => ({
          id: p.id,
          policyNumber: p.policyNumber,
          company: p.company,
          policyType: p.policyType,
          sumAssured: p.sumAssured,
          beneficiaryId: p.beneficiaryId,
        })),
        stocks: will.stocks.map(s => ({
          id: s.id,
          company: s.company,
          numberOfShares: s.numberOfShares,
          certificateNumber: s.certificateNumber || undefined,
          beneficiaryId: s.beneficiaryId,
        })),
        mutualFunds: will.mutualFunds.map(f => ({
          id: f.id,
          fundName: f.fundName,
          folioNumber: f.folioNumber,
          units: f.units,
          beneficiaryId: f.beneficiaryId,
        })),
      },
      physicalAssets: {
        jewellery: will.jewellery.map(j => ({
          id: j.id,
          description: j.description,
          estimatedValue: j.estimatedValue,
          location: j.location,
          beneficiaryId: j.beneficiaryId,
        })),
      },
      immovableAssets: will.immovableAssets.map(a => ({
        id: a.id,
        propertyType: a.propertyType,
        description: a.description,
        location: a.location,
        surveyNumber: a.surveyNumber || undefined,
        registrationNumber: a.registrationNumber || undefined,
        estimatedValue: a.estimatedValue,
        beneficiaryId: a.beneficiaryId,
      })),
      guardianClause: will.guardianName ? {
        guardian: {
          name: will.guardianName,
          relation: will.guardianRelation || '',
          address: will.guardianAddress || '',
          phone: will.guardianPhone || '',
          email: will.guardianEmail || undefined,
        },
        minorChildren: will.minorChildren || [],
      } : undefined,
      liabilities: will.liabilities || [],
      executors: will.executors.map(e => ({
        id: e.id,
        name: e.name,
        relation: e.relation,
        address: e.address,
        phone: e.phone,
        email: e.email || undefined,
        isPrimary: e.isPrimary,
      })),
      witnesses: will.witnesses.map(w => ({
        id: w.id,
        name: w.name,
        address: w.address,
        phone: w.phone,
        occupation: w.occupation,
        idNumber: w.idNumber,
      })),
      dateOfWill: will.dateOfWill?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      placeOfWill: will.placeOfWill || '',
      specialInstructions: will.specialInstructions || undefined,
    }

    // Generate will with Gemini
    const generatedHtml = await generateWillWithGemini(willData)

    // Update will with generated content
    await prisma.will.update({
      where: { id: willId },
      data: {
        generatedHtml,
        generatedAt: new Date(),
        status: 'COMPLETED',
      },
    })

    return NextResponse.json({ 
      success: true,
      message: 'Will generated successfully',
      html: generatedHtml,
    })

  } catch (error) {
    console.error('Error generating will:', error)
    return NextResponse.json(
      { error: 'Failed to generate will' },
      { status: 500 }
    )
  }
}