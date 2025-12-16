"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SubmissionDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  identityMode: string;
  attributionName?: string;
  status: string;
  createdAt: string;
  impactLevel?: string;
  lessonsLearned?: string;
  whatWentWrong?: string;
  contextBackground?: string;
  knowledgeExtracted?: any;
  preMortemAnalysis?: any;
}

export default function SubmissionDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && params?.id) {
      fetchSubmissionDetail();
    }
  }, [status, params?.id]);

  const fetchSubmissionDetail = async () => {
    try {
      const response = await fetch(`/api/dashboard/submission/${params?.id}`);
      if (response.ok) {
        const data = await response.json();
        setSubmission(data);
      } else if (response.status === 404) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to fetch submission:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (!session || !submission) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-black mb-2">
                {submission.title}
              </h1>
              {submission.attributionName && (
                <p className="text-gray-600">by {submission.attributionName}</p>
              )}
            </div>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                submission.status === "PUBLISHED"
                  ? "bg-green-100 text-green-800"
                  : submission.status === "UNDER_REVIEW"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {submission.status.replace(/_/g, " ").toLowerCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Category:</span>
              <p className="font-medium text-black capitalize">
                {submission.category.replace(/_/g, " ").toLowerCase()}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Identity Mode:</span>
              <p className="font-medium text-black capitalize">
                {submission.identityMode.replace(/_/g, " ").toLowerCase()}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Impact Level:</span>
              <p className="font-medium text-black capitalize">
                {submission.impactLevel?.toLowerCase() || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Submitted:</span>
              <p className="font-medium text-black">
                {new Date(submission.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-black mb-3">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {submission.description}
          </p>
        </div>

        {/* Context/Background */}
        {submission.contextBackground && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-black mb-3">
              Context & Background
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {submission.contextBackground}
            </p>
          </div>
        )}

        {/* What Went Wrong */}
        {submission.whatWentWrong && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-black mb-3">
              What Went Wrong
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {submission.whatWentWrong}
            </p>
          </div>
        )}

        {/* Lessons Learned */}
        {submission.lessonsLearned && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-black mb-3">
              Lessons Learned
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {submission.lessonsLearned}
            </p>
          </div>
        )}

        {/* Knowledge Extracted */}
        {submission.knowledgeExtracted && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-black mb-3">
              AI-Extracted Knowledge
            </h2>
            <div className="space-y-4">
              {submission.knowledgeExtracted.rootCauses && (
                <div>
                  <h3 className="font-semibold text-black mb-2">Root Causes</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {submission.knowledgeExtracted.rootCauses.map(
                      (cause: string, idx: number) => (
                        <li key={idx}>{cause}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
              {submission.knowledgeExtracted.patterns && (
                <div>
                  <h3 className="font-semibold text-black mb-2">
                    Failure Patterns
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {submission.knowledgeExtracted.patterns.map(
                      (pattern: string, idx: number) => (
                        <li key={idx}>{pattern}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
              {submission.knowledgeExtracted.preventiveMeasures && (
                <div>
                  <h3 className="font-semibold text-black mb-2">
                    Preventive Measures
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {submission.knowledgeExtracted.preventiveMeasures.map(
                      (measure: string, idx: number) => (
                        <li key={idx}>{measure}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pre-mortem Analysis */}
        {submission.preMortemAnalysis && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-black mb-3">
              Pre-Mortem Analysis
            </h2>
            <div className="space-y-4">
              {submission.preMortemAnalysis.futureRisks && (
                <div>
                  <h3 className="font-semibold text-black mb-2">Future Risks</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {submission.preMortemAnalysis.futureRisks.map(
                      (risk: string, idx: number) => (
                        <li key={idx}>{risk}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
              {submission.preMortemAnalysis.recommendations && (
                <div>
                  <h3 className="font-semibold text-black mb-2">
                    Recommendations
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {submission.preMortemAnalysis.recommendations.map(
                      (rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
