import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/submissions/[id]
 * Get a single failure record by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const submission = await prisma.failureRecord.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        reuses: {
          select: {
            type: true,
            createdAt: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Don't expose user info if anonymous or pseudonymous
    if (submission.identityMode === 'ANONYMOUS') {
      submission.user = null;
    } else if (submission.identityMode === 'PSEUDONYMOUS' ||
               submission.identityMode.startsWith('DELAYED')) {
      // Check if attribution date has passed for delayed attribution
      const now = new Date();
      if (submission.attributionDate && submission.attributionDate > now) {
        submission.user = null;
      }
    }

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}
