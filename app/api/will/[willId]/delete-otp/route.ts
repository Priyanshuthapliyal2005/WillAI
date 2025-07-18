export async function DELETE(
  req: NextRequest,
  { params }: { params: { willId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { willId } = params
    const { otp } = await req.json()
    if (!otp) {
      return NextResponse.json({ error: 'OTP required' }, { status: 400 })
    }

    // Find the will
    const will = await prisma.will.findFirst({
      where: { id: willId, userId: session.user.id },
    })
    if (!will) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 })
    }

    // Find the OTP record
    const deleteOTP = await prisma.deleteOTP.findUnique({ where: { willId } })
    if (!deleteOTP) {
      return NextResponse.json({ error: 'No OTP found for this will' }, { status: 400 })
    }

    // Check expiry
    if (new Date(deleteOTP.expiresAt) < new Date()) {
      await prisma.deleteOTP.delete({ where: { willId } })
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 })
    }

    // Check attempts
    if (deleteOTP.attempts >= 5) {
      await prisma.deleteOTP.delete({ where: { willId } })
      return NextResponse.json({ error: 'Too many failed attempts. OTP invalidated.' }, { status: 400 })
    }

    // Check OTP
    if (deleteOTP.otp !== otp) {
      await prisma.deleteOTP.update({
        where: { willId },
        data: { attempts: { increment: 1 } },
      })
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }

    // OTP is valid, delete the will and OTP record
    await prisma.deleteOTP.delete({ where: { willId } })
    await prisma.will.delete({ where: { id: willId } })

    return NextResponse.json({ success: true, message: 'Will deleted successfully.' })
  } catch (error) {
    console.error('Error verifying delete OTP:', error)
    return NextResponse.json({ error: 'Failed to verify OTP or delete will' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Create email transporter (reusing existing SMTP config)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function POST(
  req: NextRequest,
  { params }: { params: { willId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { willId } = params

    // Verify the will belongs to the user
    const will = await prisma.will.findFirst({
      where: {
        id: willId,
        userId: session.user.id,
      },
      include: {
        testator: true,
      },
    })

    if (!will) {
      return NextResponse.json(
        { error: 'Will not found' },
        { status: 404 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete any existing OTP for this will
    await prisma.deleteOTP.deleteMany({
      where: { willId },
    })

    // Create new OTP record
    await prisma.deleteOTP.create({
      data: {
        willId,
        otp,
        expiresAt,
        attempts: 0,
      },
    })

    // Send email with OTP
    const willTitle = will.testator?.fullName 
      ? `${will.testator.fullName}'s Will` 
      : will.title || 'Your Will'

    if (!session.user.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      )
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: session.user.email as string,
      subject: 'Will Deletion Confirmation - OTP Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Will Deletion Confirmation</h2>
          
          <p>Hello ${session.user.name || 'User'},</p>
          
          <p>You have requested to delete the following will document:</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Will Document:</strong> ${willTitle}<br>
            <strong>Created:</strong> ${will.createdAt.toLocaleDateString()}<br>
            <strong>Status:</strong> ${will.status}
          </div>
          
          <p><strong>⚠️ WARNING: This action cannot be undone!</strong></p>
          
          <p>Your One-Time Password (OTP) for confirmation is:</p>
          
          <div style="background-color: #fef2f2; border: 2px solid #dc2626; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #dc2626; margin: 0; font-size: 32px; letter-spacing: 4px;">${otp}</h1>
          </div>
          
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          
          <p>If you did not request this deletion, please ignore this email and your will document will remain safe.</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            This email was sent from WillAI. Do not reply to this email.
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email address',
      expiresAt: expiresAt.toISOString(),
    })

  } catch (error) {
    console.error('Error sending delete OTP:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
