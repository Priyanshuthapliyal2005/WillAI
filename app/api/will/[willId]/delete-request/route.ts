import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(
  request: NextRequest,
  { params }: { params: { willId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { willId } = params

    // Check if will exists and belongs to the user
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
      return NextResponse.json({ error: 'Will not found' }, { status: 404 })
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in database
    await prisma.deleteOTP.upsert({
      where: { willId },
      update: {
        otp,
        expiresAt,
        attempts: 0,
      },
      create: {
        willId,
        otp,
        expiresAt,
        attempts: 0,
      },
    })

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    const willTitle = will.testator?.fullName 
      ? `${will.testator.fullName}'s Will` 
      : 'Your Will'

    const mailOptions = {
      from: process.env.EMAIL_SERVER_USER,
      to: session.user.email,
      subject: 'Will Deletion Verification - WillAI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc2626;">Will Deletion Request</h2>
          <p>Hello ${session.user.name || 'User'},</p>
          
          <p>You have requested to delete the following will:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>${willTitle}</strong><br>
            <small>Will ID: ${willId}</small>
          </div>
          
          <p>To confirm this deletion, please use the following verification code:</p>
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 4px;">${otp}</h1>
          </div>
          
          <p><strong>Important:</strong></p>
          <ul>
            <li>This code will expire in 10 minutes</li>
            <li>Once deleted, the will cannot be recovered</li>
            <li>If you didn't request this deletion, please ignore this email</li>
          </ul>
          
          <p>If you have any questions, please contact our support team.</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated message from WillAI. Please do not reply to this email.
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ 
      success: true, 
      message: 'Verification code sent to your email' 
    })

  } catch (error) {
    console.error('Error sending delete OTP:', error)
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    )
  }
}
