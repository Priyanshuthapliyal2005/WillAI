import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/wills/[willId] - Get specific will
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

// PUT /api/wills/[willId] - Update will
export async function PUT(
  request: NextRequest,
  { params }: { params: { willId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { willId } = params
    const updateData = await request.json()

    // Verify ownership
    const existingWill = await prisma.will.findUnique({
      where: { id: willId, userId: session.user.id },
    })

    if (!existingWill) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 })
    }

    const will = await prisma.will.update({
      where: { id: willId },
      data: {
        ...updateData,
        updatedAt: new Date(),
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

    return NextResponse.json(will)

  } catch (error) {
    console.error('Error updating will:', error)
    return NextResponse.json(
      { error: 'Failed to update will' },
      { status: 500 }
    )
  }
}

// DELETE /api/wills/[willId] - Delete will
export async function DELETE(
  request: NextRequest,
  { params }: { params: { willId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { willId } = params

    // Verify ownership
    const existingWill = await prisma.will.findUnique({
      where: { id: willId, userId: session.user.id },
    })

    if (!existingWill) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 })
    }

    await prisma.will.delete({
      where: { id: willId },
    })

    return NextResponse.json({ message: 'Will deleted successfully' })

  } catch (error) {
    console.error('Error deleting will:', error)
    return NextResponse.json(
      { error: 'Failed to delete will' },
      { status: 500 }
    )
  }
}