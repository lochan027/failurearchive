'use client';

import { useState } from 'react';

interface PreMortemResult {
  relatedFailures: string[];
  failureDetails: any[];
  commonPatterns: string[];
  likelyInvalidAssumptions: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
}

export default function PreMortemPage() {
  const [idea, setIdea] = useState('');
  const [domain, setDomain] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PreMortemResult | null>(null);

  const handleAnalyze = async () => {
    if (!idea.trim()) {
      alert('Please describe your idea');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/premortem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          domain: domain.split(',').map(d => d.trim()).filter(Boolean),
          hypothesis,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Pre-mortem analysis failed:', error);
      alert(`Failed to analyze: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pre-Mortem Analysis</h1>
        <p className="text-[var(--muted)]">
          Input your idea and get related failures, common patterns, and risk assessment.
        </p>
      </div>

      {/* Input Form */}
      <div className="mb-8 border border-[var(--border)] p-6 rounded space-y-6">
        <div>
          <label className="block font-semibold mb-2">Describe Your Idea *</label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border)] rounded"
            rows={6}
            placeholder="Describe your project, research, or business idea in detail. What are you trying to achieve?"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Domain(s)</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border)] rounded"
            placeholder="e.g., ML, Healthcare, Web3 (comma-separated)"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Core Hypothesis (Optional)</label>
          <textarea
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border)] rounded"
            rows={3}
            placeholder="What's your core assumption? What needs to be true for this to work?"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Idea'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-8">
          {/* Risk Level */}
          <div
            className={`p-6 rounded border-2 ${
              result.riskLevel === 'HIGH'
                ? 'border-red-500 bg-red-50/30'
                : result.riskLevel === 'MEDIUM'
                ? 'border-yellow-500 bg-yellow-50/30'
                : 'border-green-500 bg-green-50/30'
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">Risk Level</h2>
            <div className="text-3xl font-bold">
              {result.riskLevel}
            </div>
            <p className="text-sm text-[var(--muted)] mt-2">
              Based on historical failure patterns and invalidated assumptions in the archive.
            </p>
          </div>

          {/* Related Failures */}
          {result.failureDetails && result.failureDetails.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Related Failures</h2>
              <div className="space-y-4">
                {result.failureDetails.map((failure) => (
                  <a
                    key={failure.id}
                    href={`/submission/${failure.id}`}
                    className="block border border-[var(--border)] p-4 rounded hover:border-[var(--accent)]"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{failure.title}</h3>
                      <span className="text-xs text-[var(--muted)] font-mono">
                        {formatType(failure.type)}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted)] line-clamp-2 mb-2">
                      {failure.hypothesis}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                      <span>↻ {failure.reuseCount} reused</span>
                      <span className="font-mono">{failure.evidenceLevel}</span>
                      {failure.domain.length > 0 && (
                        <span>• {failure.domain.join(', ')}</span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Common Patterns */}
          {result.commonPatterns && result.commonPatterns.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Common Failure Patterns</h2>
              <div className="space-y-2">
                {result.commonPatterns.map((pattern, idx) => (
                  <div
                    key={idx}
                    className="p-4 border-l-4 border-[var(--accent)] bg-[var(--border)] rounded"
                  >
                    {pattern}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Likely Invalid Assumptions */}
          {result.likelyInvalidAssumptions && result.likelyInvalidAssumptions.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Likely Invalid Assumptions</h2>
              <div className="space-y-2">
                {result.likelyInvalidAssumptions.map((assumption, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-[var(--destructive)] bg-red-50/30 rounded"
                  >
                    ⚠️ {assumption}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
              <div className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[var(--border)] rounded flex items-start gap-3"
                  >
                    <span className="text-lg">💡</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Next Steps */}
          <div className="border-t border-[var(--border)] pt-6">
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <div className="space-y-3 text-sm">
              <p>
                Review the related failures and common patterns to refine your approach.
              </p>
              <p>
                If you proceed and fail, consider submitting your experience to help future researchers.
              </p>
              <a
                href="/submit"
                className="inline-block px-4 py-2 border border-[var(--border)] rounded hover:bg-[var(--border)]"
              >
                Submit a Failure
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
