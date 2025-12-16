import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/dashboard
 * Get user dashboard data - redirects to /api/dashboard/submissions
 */
export async function GET(req: NextRequest) {
  // Redirect to the new endpoint
  return NextResponse.redirect(new URL('/api/dashboard/submissions', req.url));
}
