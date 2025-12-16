import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { aiService } from '@/lib/ai-service';
import { generatePseudonymousId, calculateAttributionDate } from '@/lib/utils';
import { FailureRecordType, IdentityMode } from '@/lib/db-types';

/**
 * POST /api/submissions
 * Create a new failure record submission
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    // Validate license acceptance (MANDATORY)
    if (!body.licenseAccepted) {
      return NextResponse.json(
        { error: 'License acceptance is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.title || !body.hypothesis || !body.method || !body.keyMisunderstanding) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate attribution name for attributed and pseudonymous submissions
    if ((body.identityMode === 'ATTRIBUTED' || 
         body.identityMode === 'PSEUDONYMOUS' ||
         body.identityMode === 'DELAYED_30' ||
         body.identityMode === 'DELAYED_90' ||
         body.identityMode === 'DELAYED_180') && 
        !body.attributionName?.trim()) {
      return NextResponse.json(
        { error: 'Attribution name is required for this identity mode' },
        { status: 400 }
      );
    }

    // Determine identity
    let userId: string | null = null;
    let anonymousTokenId: string | null = null;
    let pseudonymousId: string | null = null;

    if (session?.user) {
      userId = session.user.id;
      
      // Generate pseudonymous ID if requested
      if (body.identityMode === 'PSEUDONYMOUS' || 
          body.identityMode === 'DELAYED_30' ||
          body.identityMode === 'DELAYED_90' ||
          body.identityMode === 'DELAYED_180') {
        pseudonymousId = generatePseudonymousId();
      }
    } else if (body.anonymousToken) {
      // Validate anonymous token
      const token = await prisma.anonymousToken.findUnique({
        where: { token: body.anonymousToken },
      });
      
      if (!token || token.expiresAt < new Date()) {
        return NextResponse.json(
          { error: 'Invalid or expired anonymous token' },
          { status: 401 }
        );
      }
      
      anonymousTokenId = token.id;
    } else {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // AI Moderation
    const moderationResult = await aiService.moderateContent({
      title: body.title,
      hypothesis: body.hypothesis,
      method: body.method,
      links: [body.githubLink, body.pdfUrl].filter(Boolean),
    });

    // Create the failure record
    const failureRecord = await prisma.failureRecord.create({
      data: {
        type: body.type as FailureRecordType,
        status: moderationResult.safe ? 'PUBLISHED' : 'PENDING_MODERATION',
        userId,
        anonymousTokenId,
        identityMode: body.identityMode as IdentityMode,
        pseudonymousId,
        attributionDate: calculateAttributionDate(body.identityMode),
        licenseAccepted: true,
        textLicense: 'CC0-1.0',
        codeLicense: 'MIT',
        title: body.title,
        hypothesis: body.hypothesis,
        method: body.method,
        failurePoints: body.failurePoints || [],
        keyMisunderstanding: body.keyMisunderstanding,
        salvageableKnowledge: body.salvageableKnowledge || '',
        evidenceLevel: body.evidenceLevel || 'ANECDOTAL',
        githubLink: body.githubLink,
        pdfUrl: body.pdfUrl,
        metrics: body.metrics,
        logs: body.logs,
        charts: body.charts || [],
        typeSpecificData: body.typeSpecificData || {},
        domain: body.domain || [],
        tags: body.tags || [],
        stage: body.stage,
      },
    });

    // Create moderation record
    const flagMapping: Record<string, string> = {
      'illegalContent': 'ILLEGAL_CONTENT',
      'malwareLinks': 'MALWARE_LINK',
      'scamPatterns': 'SCAM_PATTERN',
      'hateHarassment': 'HATE_HARASSMENT',
      'plagiarismRisk': 'PLAGIARISM_RISK',
      'fakeCitations': 'FAKE_CITATION',
      'spam': 'SPAM'
    };
    
    const mappedFlags = moderationResult.flags.map((flag: string) => 
      (flagMapping as Record<string, string>)[flag] || flag
    ) as any;
    
    await prisma.moderationRecord.create({
      data: {
        failureRecordId: failureRecord.id,
        status: moderationResult.safe ? 'APPROVED' : 'FLAGGED',
        flags: mappedFlags,
        aiAnalysis: moderationResult.analysis,
        manualReview: !moderationResult.safe,
      },
    });

    // AI Knowledge Extraction (async, don't block response)
    aiService.extractKnowledge({
      title: body.title,
      hypothesis: body.hypothesis,
      method: body.method,
      domain: body.domain || [],
      failurePoints: body.failurePoints || [],
    }).then(async (extraction) => {
      await prisma.aIKnowledgeExtraction.create({
        data: {
          failureRecordId: failureRecord.id,
          normalizedHypothesis: extraction.normalizedHypothesis,
          taxonomyTags: extraction.taxonomyTags,
          similarFailureIds: extraction.similarFailureIds,
          commonPatterns: extraction.commonPatterns,
        },
      });
      
      // Update the failure record with AI tags
      await prisma.failureRecord.update({
        where: { id: failureRecord.id },
        data: { aiExtractedTags: extraction.taxonomyTags },
      });
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      id: failureRecord.id,
      status: failureRecord.status,
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/submissions
 * List submissions (with filters)
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');
    const domain = searchParams.get('domain');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const where: any = {
      status: 'PUBLISHED',
    };

    if (type) {
      where.type = type;
    }

    if (domain) {
      where.domain = {
        has: domain,
      };
    }

    const orderBy: any = {};
    orderBy[sortBy] = order;

    const [submissions, total] = await Promise.all([
      prisma.failureRecord.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          type: true,
          identityMode: true,
          pseudonymousId: true,
          title: true,
          hypothesis: true,
          failurePoints: true,
          evidenceLevel: true,
          domain: true,
          tags: true,
          reuseCount: true,
          avoidedCount: true,
          referenceCount: true,
          createdAt: true,
        },
      }),
      prisma.failureRecord.count({ where }),
    ]);

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
