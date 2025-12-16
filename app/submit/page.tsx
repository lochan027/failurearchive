'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FailureRecordType, IdentityMode, FailurePoint, EvidenceLevel } from '@/lib/db-types';

export default function SubmitPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    type: 'TECHNICAL_PROJECT' as FailureRecordType,
    identityMode: 'ATTRIBUTED' as IdentityMode,
    attributionName: '', // Name to use for delayed attribution
    title: '',
    hypothesis: '',
    method: '',
    failurePoints: [] as FailurePoint[],
    keyMisunderstanding: '',
    salvageableKnowledge: '',
    evidenceLevel: 'ANECDOTAL' as EvidenceLevel,
    githubLink: '',
    pdfUrl: '', // For research papers
    domain: [] as string[],
    tags: [] as string[],
    stage: '',
    licenseAccepted: false,
    // Type-specific fields
    researchJournal: '', // RESEARCH_PAPER
    researchYear: '', // RESEARCH_PAPER
    businessModel: '', // BUSINESS_IDEA
    marketSize: '', // BUSINESS_IDEA
    techStack: '', // TECHNICAL_PROJECT, AI_PROJECT
    teamSize: '', // TECHNICAL_PROJECT, AI_PROJECT
    fundingAmount: '', // BUSINESS_IDEA
    timeInvested: '', // All types
  });

  const [domainInput, setDomainInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) { // 10MB limit
        setUploadedFile(file);
      } else {
        setError('Please upload a PDF file under 10MB');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.licenseAccepted) {
      setError('You must accept the license terms to submit.');
      return;
    }

    if (!session) {
      setError('You must be signed in to submit.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Build type-specific data object
      const typeSpecificData: Record<string, any> = {};
      
      if (formData.type === 'RESEARCH_PAPER') {
        if (formData.researchJournal) typeSpecificData.journal = formData.researchJournal;
        if (formData.researchYear) typeSpecificData.year = formData.researchYear;
      }
      
      if (formData.type === 'TECHNICAL_PROJECT' || formData.type === 'AI_PROJECT') {
        if (formData.techStack) typeSpecificData.techStack = formData.techStack;
        if (formData.teamSize) typeSpecificData.teamSize = formData.teamSize;
      }
      
      if (formData.type === 'BUSINESS_IDEA') {
        if (formData.businessModel) typeSpecificData.businessModel = formData.businessModel;
        if (formData.marketSize) typeSpecificData.marketSize = formData.marketSize;
        if (formData.fundingAmount) typeSpecificData.fundingAmount = formData.fundingAmount;
      }
      
      // Time invested applies to multiple types
      if (formData.timeInvested) {
        typeSpecificData.timeInvested = formData.timeInvested;
      }

      // Prepare submission data
      const submissionData = {
        ...formData,
        typeSpecificData,
      };

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      router.push(`/submission/${data.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const addDomain = () => {
    if (domainInput.trim() && !formData.domain.includes(domainInput.trim())) {
      setFormData({ ...formData, domain: [...formData.domain, domainInput.trim()] });
      setDomainInput('');
    }
  };

  const removeDomain = (domain: string) => {
    setFormData({ ...formData, domain: formData.domain.filter(d => d !== domain) });
  };

  const toggleFailurePoint = (point: FailurePoint) => {
    setFormData({
      ...formData,
      failurePoints: formData.failurePoints.includes(point)
        ? formData.failurePoints.filter(p => p !== point)
        : [...formData.failurePoints, point],
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit a Failure Record</h1>
        <p className="text-[var(--muted)]">
          Structure your failure as reusable knowledge. All submissions require license acceptance.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Selection */}
        <div>
          <label className="block font-semibold mb-2">Failure Type *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as FailureRecordType })}
            className="w-full px-3 py-2 rounded"
            required
          >
            <option value="TECHNICAL_PROJECT">Technical Project</option>
            <option value="RESEARCH_PAPER">Research Paper (Negative Result)</option>
            <option value="RESEARCH_IDEA">Research Idea (Pre-Mortem)</option>
            <option value="BUSINESS_IDEA">Business Idea</option>
            <option value="FUTURE_TECH_IDEA">Future Tech Idea</option>
            <option value="AI_PROJECT">AI Project</option>
          </select>
        </div>

        {/* Identity Mode */}
        <div>
          <label className="block font-semibold mb-2">Identity Mode *</label>
          <select
            value={formData.identityMode}
            onChange={(e) => setFormData({ ...formData, identityMode: e.target.value as IdentityMode })}
            className="w-full px-3 py-2 rounded"
            required
          >
            <option value="ATTRIBUTED">Attributed (show my name)</option>
            <option value="PSEUDONYMOUS">Pseudonymous (choose a pseudonym)</option>
            <option value="DELAYED_30">Delayed Attribution (30 days)</option>
            <option value="DELAYED_90">Delayed Attribution (90 days)</option>
            <option value="DELAYED_180">Delayed Attribution (180 days)</option>
            <option value="ANONYMOUS">Fully Anonymous</option>
          </select>
          <p className="text-sm text-[var(--muted)] mt-1">
            Choose how you want to be identified. Delayed attribution reveals your identity after the specified period.
          </p>
        </div>

        {/* Attribution Name - shown for attributed, pseudonymous, and delayed attribution */}
        {(formData.identityMode === 'ATTRIBUTED' ||
          formData.identityMode === 'PSEUDONYMOUS' ||
          formData.identityMode === 'DELAYED_30' || 
          formData.identityMode === 'DELAYED_90' || 
          formData.identityMode === 'DELAYED_180') && (
          <div>
            <label className="block font-semibold mb-2">
              {formData.identityMode === 'PSEUDONYMOUS' ? 'Pseudonym *' : 'Attribution Name *'}
            </label>
            <input
              type="text"
              value={formData.attributionName}
              onChange={(e) => setFormData({ ...formData, attributionName: e.target.value })}
              className="w-full px-3 py-2 rounded"
              placeholder={
                formData.identityMode === 'PSEUDONYMOUS' 
                  ? 'e.g., Anonymous Researcher, BuilderX, etc.' 
                  : 'Your name or preferred attribution'
              }
              required
            />
            <p className="text-sm text-[var(--muted)] mt-1">
              {formData.identityMode === 'ATTRIBUTED' 
                ? 'This name will be displayed with your submission (instead of your email).'
                : formData.identityMode === 'PSEUDONYMOUS'
                ? 'Choose a pseudonym to protect your identity. You can use the same pseudonym across submissions.'
                : 'This name will be shown after the delay period ends (instead of your email).'}
            </p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block font-semibold mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 rounded"
            placeholder="Brief, descriptive title"
            required
          />
        </div>

        {/* Hypothesis */}
        <div>
          <label className="block font-semibold mb-2">Hypothesis *</label>
          <textarea
            value={formData.hypothesis}
            onChange={(e) => setFormData({ ...formData, hypothesis: e.target.value })}
            className="w-full px-3 py-2 rounded"
            rows={4}
            placeholder="We believed ___ would work because ___."
            required
          />
          <p className="text-sm text-[var(--muted)] mt-1">
            What did you believe would work, and why?
          </p>
        </div>

        {/* Method */}
        <div>
          <label className="block font-semibold mb-2">Method *</label>
          <textarea
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            className="w-full px-3 py-2 rounded"
            rows={4}
            placeholder="What was built or tested..."
            required
          />
          <p className="text-sm text-[var(--muted)] mt-1">
            Describe what was actually built, tested, or attempted.
          </p>
        </div>

        {/* Failure Points */}
        <div>
          <label className="block font-semibold mb-2">Failure Points (Multi-select)</label>
          <div className="space-y-2">
            {[
              'ASSUMPTION_INVALIDATED',
              'DATA_BIAS',
              'TECHNICAL_CEILING',
              'USER_BEHAVIOR_MISMATCH',
              'MARKET_ILLUSION',
              'TIMING_MISMATCH',
              'SCALING_FAILURE',
            ].map((point) => (
              <label key={point} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.failurePoints.includes(point as FailurePoint)}
                  onChange={() => toggleFailurePoint(point as FailurePoint)}
                  className="w-4 h-4"
                />
                <span className="text-sm">
                  {point.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Key Misunderstanding */}
        <div>
          <label className="block font-semibold mb-2">Key Misunderstanding *</label>
          <textarea
            value={formData.keyMisunderstanding}
            onChange={(e) => setFormData({ ...formData, keyMisunderstanding: e.target.value })}
            className="w-full px-3 py-2 rounded"
            rows={3}
            placeholder="We assumed ___, but reality was ___."
            required
          />
        </div>

        {/* Salvageable Knowledge */}
        <div>
          <label className="block font-semibold mb-2">Salvageable Knowledge</label>
          <textarea
            value={formData.salvageableKnowledge}
            onChange={(e) => setFormData({ ...formData, salvageableKnowledge: e.target.value })}
            className="w-full px-3 py-2 rounded"
            rows={3}
            placeholder="What can others learn or reuse? Code, architecture, insights, research directions to avoid..."
          />
        </div>

        {/* Evidence */}
        <div>
          <label className="block font-semibold mb-2">Evidence Level *</label>
          <select
            value={formData.evidenceLevel}
            onChange={(e) => setFormData({ ...formData, evidenceLevel: e.target.value as EvidenceLevel })}
            className="w-full px-3 py-2 rounded"
            required
          >
            <option value="NONE">None</option>
            <option value="ANECDOTAL">Anecdotal</option>
            <option value="METRICS">With Metrics</option>
            <option value="RESEARCH_GRADE">Research Grade</option>
            <option value="REPRODUCIBLE">Reproducible</option>
          </select>
        </div>

        {/* GitHub Link */}
        <div>
          <label className="block font-semibold mb-2">GitHub Repository (Optional)</label>
          <input
            type="url"
            value={formData.githubLink}
            onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
            className="w-full px-3 py-2 rounded"
            placeholder="https://github.com/username/repo"
          />
        </div>

        {/* Domain */}
        <div>
          <label className="block font-semibold mb-2">Domain(s)</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDomain())}
              className="flex-1 px-3 py-2 rounded"
              placeholder="e.g., ML, Healthcare, Web3"
            />
            <button
              type="button"
              onClick={addDomain}
              className="px-4 py-2 border border-[var(--border)] rounded"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.domain.map((d) => (
              <span
                key={d}
                className="px-3 py-1 bg-[var(--border)] rounded flex items-center gap-2"
              >
                {d}
                <button
                  type="button"
                  onClick={() => removeDomain(d)}
                  className="text-[var(--destructive)]"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Type-Specific Fields */}
        {formData.type === 'RESEARCH_PAPER' && (
          <div className="border border-blue-200 bg-blue-50 p-6 rounded space-y-4">
            <h3 className="font-semibold text-lg">Research Paper Details</h3>
            
            <div>
              <label className="block font-semibold mb-2">Journal/Conference</label>
              <input
                type="text"
                value={formData.researchJournal}
                onChange={(e) => setFormData({ ...formData, researchJournal: e.target.value })}
                className="w-full px-3 py-2 rounded"
                placeholder="e.g., NeurIPS, ICML, arXiv"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Year</label>
              <input
                type="number"
                value={formData.researchYear}
                onChange={(e) => setFormData({ ...formData, researchYear: e.target.value })}
                className="w-full px-3 py-2 rounded"
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Upload PDF (Optional, max 10MB)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full px-3 py-2 rounded border border-gray-300"
              />
              {uploadedFile && (
                <p className="text-sm text-green-600 mt-2">✓ {uploadedFile.name} selected</p>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Upload your paper PDF for reference. This helps others understand the full methodology.
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-2">PDF URL (Alternative to upload)</label>
              <input
                type="url"
                value={formData.pdfUrl}
                onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                className="w-full px-3 py-2 rounded"
                placeholder="https://arxiv.org/pdf/..."
              />
              <p className="text-sm text-gray-600 mt-1">
                Link to your paper on arXiv or other repository
              </p>
            </div>
          </div>
        )}

        {(formData.type === 'TECHNICAL_PROJECT' || formData.type === 'AI_PROJECT') && (
          <div className="border border-purple-200 bg-purple-50 p-6 rounded space-y-4">
            <h3 className="font-semibold text-lg">Technical Project Details</h3>
            
            <div>
              <label className="block font-semibold mb-2">Tech Stack</label>
              <input
                type="text"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                className="w-full px-3 py-2 rounded"
                placeholder="e.g., React, Python, PyTorch, PostgreSQL"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Team Size</label>
              <input
                type="text"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                className="w-full px-3 py-2 rounded"
                placeholder="e.g., Solo, 2-3 people, 10+ engineers"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Time Invested</label>
              <input
                type="text"
                value={formData.timeInvested}
                onChange={(e) => setFormData({ ...formData, timeInvested: e.target.value })}
                className="w-full px-3 py-2 rounded"
                placeholder="e.g., 3 months, 1 year, 6 weeks"
              />
            </div>
          </div>
        )}

        {formData.type === 'BUSINESS_IDEA' && (
          <div className="border border-green-200 bg-green-50 p-6 rounded space-y-4">
            <h3 className="font-semibold text-lg">Business Details</h3>
            
            <div>
              <label className="block font-semibold mb-2">Business Model</label>
              <input
                type="text"
                value={formData.businessModel}
                onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                className="w-full px-3 py-2 rounded"
                placeholder="e.g., SaaS, Marketplace, B2B Enterprise"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Target Market Size</label>
              <input
                type="text"
                value={formData.marketSize}
                onChange={(e) => setFormData({ ...formData, marketSize: e.target.value })}
                className="w-full px-3 py-2 rounded"
                placeholder="e.g., $10M TAM, Enterprise healthcare, SMB e-commerce"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Funding/Investment</label>
              <input
                type="text"
                value={formData.fundingAmount}
                onChange={(e) => setFormData({ ...formData, fundingAmount: e.target.value })}
                className="w-full px-3 py-2 rounded"
                placeholder="e.g., Bootstrapped, $100K seed, $1M Series A"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Time Invested</label>
              <input
                type="text"
                value={formData.timeInvested}
                onChange={(e) => setFormData({ ...formData, timeInvested: e.target.value })}
                className="w-full px-3 py-2 rounded"
                placeholder="e.g., 6 months, 2 years"
              />
            </div>
          </div>
        )}

        {(formData.type === 'RESEARCH_IDEA' || formData.type === 'FUTURE_TECH_IDEA') && (
          <div className="border border-yellow-200 bg-yellow-50 p-6 rounded space-y-4">
            <h3 className="font-semibold text-lg">Idea Details</h3>
            
            <div>
              <label className="block font-semibold mb-2">Time Invested in Research</label>
              <input
                type="text"
                value={formData.timeInvested}
                onChange={(e) => setFormData({ ...formData, timeInvested: e.target.value })}
                className="w-full px-3 py-2 rounded"
                placeholder="e.g., 2 weeks of literature review, 3 months of exploration"
              />
            </div>

            <div className="bg-yellow-100 p-4 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Pre-Mortem Submission:</strong> Share ideas you've explored but decided not to pursue.
                Help others avoid the same dead ends and save time.
              </p>
            </div>
          </div>
        )}

        {/* License Agreement */}
        <div className="border border-[var(--accent)] p-6 rounded bg-blue-50/50">
          <h3 className="font-semibold mb-3">License Agreement (REQUIRED)</h3>
          <div className="space-y-2 text-sm mb-4">
            <p>
              <strong>Text Content:</strong> Licensed under CC0 1.0 (Public Domain Dedication).
              Anyone can copy, modify, and distribute, even for commercial purposes.
            </p>
            <p>
              <strong>Code References:</strong> Licensed under MIT License.
              Permissive with attribution requirement.
            </p>
          </div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.licenseAccepted}
              onChange={(e) => setFormData({ ...formData, licenseAccepted: e.target.checked })}
              className="w-5 h-5 mt-1"
              required
            />
            <span className="text-sm">
              I understand that this submission is shared under an open license (CC0 for text, MIT for code)
              and may be reused, modified, or built upon by anyone. This is required to submit.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || !formData.licenseAccepted}
            className="px-8 py-3 bg-[var(--foreground)] text-[var(--background)] rounded disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Failure Record'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 border border-[var(--border)] rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
