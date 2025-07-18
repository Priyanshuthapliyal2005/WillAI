import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateWillHTML } from '@/lib/will-generator'
import { WillData } from '@/types/will-types'

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

    // Transform data for Will AI with proper types
    const willData: WillData = {
      residualClause: (will as any).residualClause || "All remaining assets not specifically mentioned in this will shall be distributed equally among all named beneficiaries.",
      testator: {
        fullName: will.testator.fullName,
        age: will.testator.age,
        occupation: will.testator.occupation,
        address: will.testator.address,
        idNumber: will.testator.idNumber,
      },
      beneficiaries: will.beneficiaries.map((b: any) => ({
        id: b.id,
        name: b.name,
        relation: b.relation,
        idNumber: b.idNumber,
        address: b.address,
        age: b.age,
        percentage: b.percentage || undefined,
      })),
      movableAssets: {
        bankAccounts: will.bankAccounts.map((a: any) => ({
          id: a.id,
          bankName: a.bankName,
          accountNumber: a.accountNumber,
          accountType: a.accountType,
          branch: a.branch,
          beneficiaryId: a.beneficiaryId,
          sharePercentage: a.sharePercentage || "100%",
        })),
        insurancePolicies: will.insurancePolicies.map((p: any) => ({
          id: p.id,
          policyNumber: p.policyNumber,
          company: p.company,
          policyType: p.policyType,
          sumAssured: p.sumAssured,
          beneficiaryId: p.beneficiaryId,
          sharePercentage: p.sharePercentage || "100%",
        })),
        stocks: will.stocks.map((s: any) => ({
          id: s.id,
          company: s.company,
          numberOfShares: s.numberOfShares,
          certificateNumber: s.certificateNumber || undefined,
          beneficiaryId: s.beneficiaryId,
          sharePercentage: s.sharePercentage || "100%",
          accountNumber: s.accountNumber || "",
        })),
        mutualFunds: will.mutualFunds.map((f: any) => ({
          id: f.id,
          fundName: f.fundName,
          folioNumber: f.folioNumber,
          units: f.units,
          beneficiaryId: f.beneficiaryId,
          distributor: f.distributor || "N/A",
          sharePercentage: f.sharePercentage || "100%",
          accountNumber: f.accountNumber || "",
        })),
      },
      physicalAssets: {
        jewellery: will.jewellery.map((j: any) => ({
          id: j.id,
          type: j.type || "",
          invoiceNumber: j.invoiceNumber || "",
          description: j.description,
          estimatedValue: j.estimatedValue,
          location: j.location,
          beneficiaryId: j.beneficiaryId,
          sharePercentage: j.sharePercentage || "100%",
        })),
      },
      immovableAssets: will.immovableAssets.map((a: any) => ({
        id: a.id,
        name: a.name || "",
        propertyType: a.propertyType,
        description: a.description,
        location: a.location,
        surveyNumber: a.surveyNumber || undefined,
        registrationNumber: a.registrationNumber || undefined,
        estimatedValue: a.estimatedValue,
        beneficiaryId: a.beneficiaryId,
        sharePercentage: a.sharePercentage || "100%",
      })),
      guardianClause: will.guardianName ? {
        condition: (will as any).guardianCondition || "In the event of my death and the existence of minor children",
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
      executors: will.executors.map((e: any) => ({
        id: e.id,
        name: e.name,
        relation: e.relation,
        address: e.address,
        phone: e.phone,
        email: e.email || undefined,
        isPrimary: e.isPrimary,
      })),
      witnesses: will.witnesses.map((w: any) => ({
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

    // Generate will using manual generator for consistent formatting
    const generatedHtml = generateWillHTML(willData)

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