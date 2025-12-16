'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ReuseType } from '@/lib/db-types';

export default function SubmissionPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReuseForm, setShowReuseForm] = useState(false);
  const [reuseType, setReuseType] = useState<ReuseType>(ReuseType.REUSED);
  const [privateNotes, setPrivateNotes] = useState('');

  useEffect(() => {
    fetchSubmission();
  }, [params.id]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/submissions/${params.id}`);
      const data = await response.json();
      setSubmission(data.submission);
    } catch (error) {
      console.error('Failed to fetch submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReuse = async () => {
    try {
      const response = await fetch('/api/reuse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          failureRecordId: params.id,
          type: reuseType,
          privateNotes,
        }),
      });

      if (response.ok) {
        setShowReuseForm(false);
        setPrivateNotes('');
        alert('Reuse recorded successfully!');
        fetchSubmission();
      }
    } catch (error) {
      console.error('Failed to record reuse:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-[var(--muted)]">Loading...</div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-[var(--destructive)]">Submission not found</div>
      </div>
    );
  }

  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 text-sm text-[var(--muted)]">
          <Link href="/gallery" className="hover:text-[var(--accent)]">
            Gallery
          </Link>
          <span>/</span>
          <span className="font-mono">{formatType(submission.type)}</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">{submission.title}</h1>
        
        <div className="flex items-center gap-6 text-sm text-[var(--muted)]">
          <span>
            {submission.identityMode === 'ANONYMOUS'
              ? 'Anonymous'
              : submission.identityMode === 'PSEUDONYMOUS' || submission.identityMode.startsWith('DELAYED')
              ? submission.pseudonymousId || 'Anonymous'
              : submission.user?.name || 'Anonymous'}
          </span>
          <span>{formatDate(submission.createdAt)}</span>
          <span className="font-mono text-xs">{submission.evidenceLevel}</span>
        </div>
      </div>

      {/* Reuse Stats */}
      <div className="flex gap-4 mb-8 p-4 bg-[var(--border)] rounded">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{submission.reuseCount}</span>
          <span className="text-sm text-[var(--muted)]">Reused</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{submission.avoidedCount}</span>
          <span className="text-sm text-[var(--muted)]">Avoided</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{submission.referenceCount}</span>
          <span className="text-sm text-[var(--muted)]">Referenced</span>
        </div>
      </div>

      {/* Reuse Action */}
      {session && (
        <div className="mb-8 border border-[var(--border)] p-6 rounded">
          <h2 className="font-semibold mb-3">Mark This Failure</h2>
          {!showReuseForm ? (
            <div className="flex gap-3">
              <button
                onClick={() => setShowReuseForm(true)}
                className="px-4 py-2 border border-[var(--border)] rounded hover:bg-[var(--border)]"
              >
                ↻ Reused
              </button>
              <button
                onClick={() => { setReuseType(ReuseType.AVOIDED); setShowReuseForm(true); }}
                className="px-4 py-2 border border-[var(--border)] rounded hover:bg-[var(--border)]"
              >
                ✓ Avoided
              </button>
              <button
                onClick={() => { setReuseType(ReuseType.REFERENCED); setShowReuseForm(true); }}
                className="px-4 py-2 border border-[var(--border)] rounded hover:bg-[var(--border)]"
              >
                📚 Referenced
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Private Notes (optional)</label>
                <textarea
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded"
                  rows={3}
                  placeholder="How did you use or avoid this failure? (Only visible to you)"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReuse}
                  className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded"
                >
                  Record {reuseType}
                </button>
                <button
                  onClick={() => setShowReuseForm(false)}
                  className="px-4 py-2 border border-[var(--border)] rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Sections */}
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">Hypothesis</h2>
          <div className="p-4 bg-[var(--border)] rounded whitespace-pre-wrap">
            {submission.hypothesis}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Method</h2>
          <div className="p-4 bg-[var(--border)] rounded whitespace-pre-wrap">
            {submission.method}
          </div>
        </section>

        {submission.failurePoints && submission.failurePoints.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-3">Failure Points</h2>
            <div className="flex flex-wrap gap-2">
              {submission.failurePoints.map((point: string) => (
                <span
                  key={point}
                  className="px-3 py-1 border border-[var(--border)] rounded"
                >
                  {point.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-3">Key Misunderstanding</h2>
          <div className="p-4 border-l-4 border-[var(--accent)] bg-[var(--border)] rounded whitespace-pre-wrap">
            {submission.keyMisunderstanding}
          </div>
        </section>

        {submission.salvageableKnowledge && (
          <section>
            <h2 className="text-xl font-semibold mb-3">Salvageable Knowledge</h2>
            <div className="p-4 bg-[var(--border)] rounded whitespace-pre-wrap">
              {submission.salvageableKnowledge}
            </div>
          </section>
        )}

        {/* Evidence */}
        {(submission.githubLink || submission.metrics) && (
          <section>
            <h2 className="text-xl font-semibold mb-3">Evidence</h2>
            <div className="space-y-3">
              {submission.githubLink && (
                <div>
                  <span className="text-sm font-medium">GitHub Repository:</span>
                  <br />
                  <a
                    href={submission.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)]"
                  >
                    {submission.githubLink}
                  </a>
                </div>
              )}
              {submission.metrics && (
                <div>
                  <span className="text-sm font-medium">Metrics:</span>
                  <pre className="mt-2 p-4 bg-[var(--border)] rounded text-sm overflow-x-auto">
                    {submission.metrics}
                  </pre>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Domain & Tags */}
        {(submission.domain.length > 0 || submission.tags.length > 0) && (
          <section>
            <h2 className="text-xl font-semibold mb-3">Classification</h2>
            <div className="space-y-3">
              {submission.domain.length > 0 && (
                <div>
                  <span className="text-sm font-medium mb-2 block">Domains:</span>
                  <div className="flex flex-wrap gap-2">
                    {submission.domain.map((d: string) => (
                      <span key={d} className="px-3 py-1 bg-[var(--border)] rounded">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {submission.tags.length > 0 && (
                <div>
                  <span className="text-sm font-medium mb-2 block">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {submission.tags.map((t: string) => (
                      <span key={t} className="px-3 py-1 border border-[var(--border)] rounded text-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* License */}
        <section className="border-t border-[var(--border)] pt-6">
          <h2 className="text-sm font-semibold mb-2">License</h2>
          <div className="text-sm text-[var(--muted)]">
            <p>Text content: CC0 1.0 (Public Domain)</p>
            <p>Code references: MIT License</p>
          </div>
        </section>
      </div>
    </div>
  );
}
