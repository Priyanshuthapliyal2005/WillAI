import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { willId, userId, currentStep, ...formData } = body

    // Validate user matches session
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let will: any = null
    
    if (willId) {
      // Update existing will
      will = await prisma.will.findUnique({
        where: { id: willId, userId },
      })

      if (!will) {
        return NextResponse.json({ error: 'Will not found' }, { status: 404 })
      }
    } else {
      // Create new will
      will = await prisma.will.create({
        data: {
          userId,
          currentStep: currentStep || 1,
          status: 'DRAFT',
        },
      })
    }

    // Update will data based on current step
    const updateData: any = {
      currentStep: Math.max(will.currentStep, currentStep || 1),
      updatedAt: new Date(),
    }

    // Handle testator data
    if (formData.testator) {
      await prisma.testator.upsert({
        where: { willId: will.id },
        update: formData.testator,
        create: {
          ...formData.testator,
          willId: will.id,
        },
      })
      
      // Update will title with testator's name
      if (formData.testator.fullName) {
        updateData.title = `${formData.testator.fullName}'s Will`
      }
    }

    // Handle beneficiaries
    if (formData.beneficiaries) {
      // Delete existing beneficiaries
      await prisma.beneficiary.deleteMany({
        where: { willId: will.id },
      })
      
      // Create new beneficiaries
      if (formData.beneficiaries.length > 0) {
        await prisma.beneficiary.createMany({
          data: formData.beneficiaries.map((beneficiary: any) => ({
            ...beneficiary,
            willId: will.id,
          })),
        })
      }
    }

    // Handle bank accounts
    if (formData.bankAccounts) {
      await prisma.bankAccount.deleteMany({
        where: { willId: will.id },
      })
      
      if (formData.bankAccounts.length > 0) {
        await prisma.bankAccount.createMany({
          data: formData.bankAccounts.map((account: any) => ({
            ...account,
            willId: will.id,
          })),
        })
      }
    }

    // Handle insurance policies
    if (formData.insurancePolicies) {
      await prisma.insurancePolicy.deleteMany({
        where: { willId: will.id },
      })
      
      if (formData.insurancePolicies.length > 0) {
        await prisma.insurancePolicy.createMany({
          data: formData.insurancePolicies.map((policy: any) => ({
            ...policy,
            willId: will.id,
          })),
        })
      }
    }

    // Handle stocks
    if (formData.stocks) {
      await prisma.stock.deleteMany({
        where: { willId: will.id },
      })
      
      if (formData.stocks.length > 0) {
        await prisma.stock.createMany({
          data: formData.stocks.map((stock: any) => ({
            ...stock,
            willId: will.id,
          })),
        })
      }
    }

    // Handle mutual funds
    if (formData.mutualFunds) {
      await prisma.mutualFund.deleteMany({
        where: { willId: will.id },
      })
      
      if (formData.mutualFunds.length > 0) {
        await prisma.mutualFund.createMany({
          data: formData.mutualFunds.map((fund: any) => ({
            ...fund,
            willId: will.id,
          })),
        })
      }
    }

    // Handle jewellery
    if (formData.jewellery) {
      await prisma.jewellery.deleteMany({
        where: { willId: will.id },
      })
      
      if (formData.jewellery.length > 0) {
        await prisma.jewellery.createMany({
          data: formData.jewellery.map((item: any) => ({
            ...item,
            willId: will.id,
          })),
        })
      }
    }

    // Handle immovable assets
    if (formData.immovableAssets) {
      await prisma.immovableAsset.deleteMany({
        where: { willId: will.id },
      })
      
      if (formData.immovableAssets.length > 0) {
        await prisma.immovableAsset.createMany({
          data: formData.immovableAssets.map((asset: any) => ({
            ...asset,
            willId: will.id,
          })),
        })
      }
    }

    // Handle executors
    if (formData.executors) {
      await prisma.executor.deleteMany({
        where: { willId: will.id },
      })
      
      if (formData.executors.length > 0) {
        await prisma.executor.createMany({
          data: formData.executors.map((executor: any) => ({
            ...executor,
            willId: will.id,
          })),
        })
      }
    }

    // Handle witnesses
    if (formData.witnesses) {
      await prisma.witness.deleteMany({
        where: { willId: will.id },
      })
      
      if (formData.witnesses.length > 0) {
        await prisma.witness.createMany({
          data: formData.witnesses.map((witness: any) => ({
            ...witness,
            willId: will.id,
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

    // Update the will with any additional data
    await prisma.will.update({
      where: { id: will.id },
      data: updateData,
    })

    return NextResponse.json({ 
      success: true, 
      willId: will.id,
      message: 'Will data saved successfully' 
    })

  } catch (error) {
    console.error('Error saving will data:', error)
    return NextResponse.json(
      { error: 'Failed to save will data' },
      { status: 500 }
    )
  }
}