'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FailureRecordType, FailurePoint, EvidenceLevel } from '@/lib/db-types';

interface FailureCard {
  id: string;
  type: FailureRecordType;
  identityMode: string;
  pseudonymousId: string | null;
  title: string;
  hypothesis: string;
  failurePoints: FailurePoint[];
  evidenceLevel: EvidenceLevel;
  domain: string[];
  tags: string[];
  reuseCount: number;
  avoidedCount: number;
  referenceCount: number;
  createdAt: string;
}

export default function GalleryPage() {
  const [submissions, setSubmissions] = useState<FailureCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    domain: '',
    evidenceLevel: '',
    search: '',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSubmissions();
  }, [filters, sortBy, page]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sortBy,
        order: 'desc',
        ...(filters.type && { type: filters.type }),
        ...(filters.domain && { domain: filters.domain }),
      });

      const response = await fetch(`/api/submissions?${params}`);
      const data = await response.json();
      
      setSubmissions(data.submissions);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatEvidenceLevel = (level: string) => {
    return level.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Failure Gallery</h1>
        <p className="text-[var(--muted)]">
          Structured knowledge archive. No social features. No engagement metrics.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 p-6 border border-[var(--border)] rounded">
        <h2 className="font-semibold mb-4">Filters</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 rounded"
            >
              <option value="">All Types</option>
              <option value="TECHNICAL_PROJECT">Technical Project</option>
              <option value="RESEARCH_PAPER">Research Paper</option>
              <option value="RESEARCH_IDEA">Research Idea</option>
              <option value="BUSINESS_IDEA">Business Idea</option>
              <option value="FUTURE_TECH_IDEA">Future Tech Idea</option>
              <option value="AI_PROJECT">AI Project</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Domain</label>
            <input
              type="text"
              value={filters.domain}
              onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
              placeholder="e.g., ML, Healthcare"
              className="w-full px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded"
            >
              <option value="createdAt">Newest</option>
              <option value="reuseCount">Most Reused</option>
              <option value="referenceCount">Most Referenced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search titles..."
              className="w-full px-3 py-2 rounded"
            />
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="text-center py-16 text-[var(--muted)]">Loading...</div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 text-[var(--muted)]">
          No submissions found. Be the first to submit a failure.
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {submissions.map((submission) => (
              <Link
                key={submission.id}
                href={`/submission/${submission.id}`}
                className="block border border-[var(--border)] p-6 rounded hover:border-[var(--accent)]"
              >
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[var(--muted)]">
                      {formatType(submission.type)}
                    </span>
                    <span className="text-xs text-[var(--muted)]">
                      {formatEvidenceLevel(submission.evidenceLevel)}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {submission.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)] line-clamp-3">
                    {submission.hypothesis}
                  </p>
                </div>

                {submission.domain.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {submission.domain.slice(0, 3).map((d) => (
                      <span
                        key={d}
                        className="text-xs px-2 py-1 bg-[var(--border)] rounded"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                  <span>↻ {submission.reuseCount} reused</span>
                  <span>✓ {submission.avoidedCount} avoided</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-[var(--border)] rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 border border-[var(--border)] rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
