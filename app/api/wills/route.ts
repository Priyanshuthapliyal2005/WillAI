import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/wills - Get all wills for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wills = await prisma.will.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        testator: true,
        beneficiaries: true,
        _count: {
          select: {
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
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(wills)

  } catch (error) {
    console.error('Error fetching wills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wills' },
      { status: 500 }
    )
  }
}

// POST /api/wills - Create new will
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title } = await request.json()

    const will = await prisma.will.create({
      data: {
        userId: session.user.id,
        title: title || 'Untitled Will',
        status: 'DRAFT',
        currentStep: 1,
      },
      include: {
        testator: true,
        beneficiaries: true,
      },
    })

    return NextResponse.json(will, { status: 201 })

  } catch (error) {
    console.error('Error creating will:', error)
    return NextResponse.json(
      { error: 'Failed to create will' },
      { status: 500 }
    )
  }
}