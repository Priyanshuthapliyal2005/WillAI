import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
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

    return NextResponse.json(will)

  } catch (error) {
    console.error('Error fetching will:', error)
    return NextResponse.json(
      { error: 'Failed to fetch will' },
      { status: 500 }
    )
  }
}