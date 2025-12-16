import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch user's submissions
    const submissions = await prisma.failureRecord.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        type: true,
        identityMode: true,
        pseudonymousId: true,
        status: true,
        createdAt: true,
      },
    });

    // Calculate statistics
    const stats = {
      total: submissions.length,
      byCategory: submissions.reduce((acc: any, sub) => {
        acc[sub.type] = (acc[sub.type] || 0) + 1;
        return acc;
      }, {}),
      byStatus: submissions.reduce((acc: any, sub) => {
        acc[sub.status] = (acc[sub.status] || 0) + 1;
        return acc;
      }, {}),
      byIdentityMode: submissions.reduce((acc: any, sub) => {
        acc[sub.identityMode] = (acc[sub.identityMode] || 0) + 1;
        return acc;
      }, {}),
    };

    return NextResponse.json({
      submissions,
      stats,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
