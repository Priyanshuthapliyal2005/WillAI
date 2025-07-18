import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/wills/[willId]/save - Save will data (auto-save functionality)
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
    const formData = await request.json()

    // Verify ownership
    const existingWill = await prisma.will.findUnique({
      where: { id: willId, userId: session.user.id },
    })

    if (!existingWill) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 })
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Update will metadata
      const updateData: any = {
        currentStep: Math.max(existingWill.currentStep, formData.currentStep || 1),
        updatedAt: new Date(),
      }

      // Handle testator data
      if (formData.testator) {
        await tx.testator.upsert({
          where: { willId },
          update: formData.testator,
          create: {
            ...formData.testator,
            willId,
          },
        })
        
        // Update will title with testator's name
        if (formData.testator.fullName) {
          updateData.title = `${formData.testator.fullName}'s Will`
        }
      }

      // Handle beneficiaries
      if (formData.beneficiaries) {
        await tx.beneficiary.deleteMany({ where: { willId } })
        if (formData.beneficiaries.length > 0) {
          await tx.beneficiary.createMany({
            data: formData.beneficiaries.map((beneficiary: any) => ({
              ...beneficiary,
              willId,
            })),
          })
        }
      }

      // Handle bank accounts
      if (formData.bankAccounts) {
        await tx.bankAccount.deleteMany({ where: { willId } })
        if (formData.bankAccounts.length > 0) {
          await tx.bankAccount.createMany({
            data: formData.bankAccounts.map((account: any) => ({
              ...account,
              willId,
            })),
          })
        }
      }

      // Handle insurance policies
      if (formData.insurancePolicies) {
        await tx.insurancePolicy.deleteMany({ where: { willId } })
        if (formData.insurancePolicies.length > 0) {
          await tx.insurancePolicy.createMany({
            data: formData.insurancePolicies.map((policy: any) => ({
              ...policy,
              willId,
            })),
          })
        }
      }

      // Handle stocks
      if (formData.stocks) {
        await tx.stock.deleteMany({ where: { willId } })
        if (formData.stocks.length > 0) {
          await tx.stock.createMany({
            data: formData.stocks.map((stock: any) => ({
              ...stock,
              willId,
            })),
          })
        }
      }

      // Handle mutual funds
      if (formData.mutualFunds) {
        await tx.mutualFund.deleteMany({ where: { willId } })
        if (formData.mutualFunds.length > 0) {
          await tx.mutualFund.createMany({
            data: formData.mutualFunds.map((fund: any) => ({
              ...fund,
              willId,
            })),
          })
        }
      }

      // Handle jewellery
      if (formData.jewellery) {
        await tx.jewellery.deleteMany({ where: { willId } })
        if (formData.jewellery.length > 0) {
          await tx.jewellery.createMany({
            data: formData.jewellery.map((item: any) => ({
              ...item,
              willId,
            })),
          })
        }
      }

      // Handle immovable assets
      if (formData.immovableAssets) {
        await tx.immovableAsset.deleteMany({ where: { willId } })
        if (formData.immovableAssets.length > 0) {
          await tx.immovableAsset.createMany({
            data: formData.immovableAssets.map((asset: any) => ({
              ...asset,
              willId,
            })),
          })
        }
      }

      // Handle executors
      if (formData.executors) {
        await tx.executor.deleteMany({ where: { willId } })
        if (formData.executors.length > 0) {
          await tx.executor.createMany({
            data: formData.executors.map((executor: any) => ({
              ...executor,
              willId,
            })),
          })
        }
      }

      // Handle witnesses
      if (formData.witnesses) {
        await tx.witness.deleteMany({ where: { willId } })
        if (formData.witnesses.length > 0) {
          await tx.witness.createMany({
            data: formData.witnesses.map((witness: any) => ({
              ...witness,
              willId,
            })),
          })
        }
      }

      // Handle other fields
      if (formData.guardianClause) {
        updateData.guardianName = formData.guardianClause.guardian.name
        updateData.guardianRelation = formData.guardianClause.guardian.relation
        updateData.guardianAddress = formData.guardianClause.guardian.address
        updateData.guardianPhone = formData.guardianClause.guardian.phone
        updateData.guardianEmail = formData.guardianClause.guardian.email
        updateData.minorChildren = formData.guardianClause.minorChildren
      }

      if (formData.liabilities) {
        updateData.liabilities = formData.liabilities
      }

      if (formData.dateOfWill) {
        updateData.dateOfWill = new Date(formData.dateOfWill)
      }

      if (formData.placeOfWill) {
        updateData.placeOfWill = formData.placeOfWill
      }

      if (formData.specialInstructions) {
        updateData.specialInstructions = formData.specialInstructions
      }

      // Update the will
      return await tx.will.update({
        where: { id: willId },
        data: updateData,
      })
    })

    return NextResponse.json({ 
      success: true,
      message: 'Will data saved successfully',
      will: result,
    })

  } catch (error) {
    console.error('Error saving will data:', error)
    return NextResponse.json(
      { error: 'Failed to save will data' },
      { status: 500 }
    )
  }
}