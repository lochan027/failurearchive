import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/premortem
 * Generate pre-mortem analysis for an idea
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idea, domain, hypothesis } = body;

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea description is required' },
        { status: 400 }
      );
    }

    console.log('Generating pre-mortem analysis for:', { idea, domain, hypothesis });

    // Generate AI analysis
    const aiAnalysis = await aiService.generatePreMortem({
      idea,
      domain,
      hypothesis,
    });

    console.log('AI analysis completed:', aiAnalysis);

    // Find related failures
    const relatedFailures = await prisma.failureRecord.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          // Match by domain
          domain ? {
            domain: {
              hasSome: domain,
            },
          } : {},
          // TODO: Match by semantic similarity (requires vector search)
        ],
      },
      select: {
        id: true,
        title: true,
        hypothesis: true,
        failurePoints: true,
        domain: true,
        evidenceLevel: true,
        reuseCount: true,
      },
      orderBy: {
        reuseCount: 'desc',
      },
      take: 10,
    });

    console.log('Found related failures:', relatedFailures.length);

    return NextResponse.json({
      relatedFailures: relatedFailures.map((f: any) => f.id),
      failureDetails: relatedFailures,
      commonPatterns: aiAnalysis.commonPatterns,
      likelyInvalidAssumptions: aiAnalysis.likelyInvalidAssumptions,
      riskLevel: aiAnalysis.riskLevel,
      recommendations: aiAnalysis.recommendations,
    });
  } catch (error) {
    console.error('Pre-mortem error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate pre-mortem analysis' },
      { status: 500 }
    );
  }
}
