import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ReuseType } from '@/lib/db-types';

/**
 * POST /api/reuse
 * Mark a failure as reused or avoided
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { failureRecordId, type, privateNotes } = body;

    if (!failureRecordId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if failure record exists
    const failureRecord = await prisma.failureRecord.findUnique({
      where: { id: failureRecordId },
      select: { id: true, userId: true },
    });

    if (!failureRecord) {
      return NextResponse.json(
        { error: 'Failure record not found' },
        { status: 404 }
      );
    }

    // Create or update reuse record
    const reuseRecord = await prisma.reuseRecord.upsert({
      where: {
        failureRecordId_userId_type: {
          failureRecordId,
          userId: session.user.id,
          type: type as ReuseType,
        },
      },
      create: {
        failureRecordId,
        userId: session.user.id,
        type: type as ReuseType,
        privateNotes,
      },
      update: {
        privateNotes,
      },
    });

    // Update counters on failure record
    const updateData: any = {};
    if (type === 'REUSED') {
      updateData.reuseCount = { increment: 1 };
    } else if (type === 'AVOIDED') {
      updateData.avoidedCount = { increment: 1 };
    } else if (type === 'REFERENCED') {
      updateData.referenceCount = { increment: 1 };
    }

    await prisma.failureRecord.update({
      where: { id: failureRecordId },
      data: updateData,
    });

    // Create notification for the original author (if not anonymous)
    if (failureRecord.userId && failureRecord.userId !== session.user.id) {
      await prisma.reuseNotification.create({
        data: {
          userId: failureRecord.userId,
          failureRecordId,
          reuseType: type as ReuseType,
        },
      });
    }

    return NextResponse.json({
      success: true,
      reuseRecord,
    });
  } catch (error) {
    console.error('Reuse error:', error);
    return NextResponse.json(
      { error: 'Failed to record reuse' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reuse
 * Get reuse records for current user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const reuses = await prisma.reuseRecord.findMany({
      where: { userId: session.user.id },
      include: {
        failureRecord: {
          select: {
            id: true,
            title: true,
            type: true,
            domain: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reuses });
  } catch (error) {
    console.error('Error fetching reuses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reuses' },
      { status: 500 }
    );
  }
}
