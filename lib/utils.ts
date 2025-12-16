/**
 * Utility functions for Failure Archive
 */

import { IdentityMode } from '@/lib/db-types';

/**
 * Generate a pseudonymous ID (e.g., "FA-2041")
 */
export function generatePseudonymousId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const id = (timestamp % 100000) + random;
  return `FA-${id}`;
}

/**
 * Calculate attribution date based on identity mode
 */
export function calculateAttributionDate(mode: IdentityMode): Date | null {
  const now = new Date();
  
  switch (mode) {
    case 'DELAYED_30':
      return new Date(now.setDate(now.getDate() + 30));
    case 'DELAYED_90':
      return new Date(now.setDate(now.getDate() + 90));
    case 'DELAYED_180':
      return new Date(now.setDate(now.getDate() + 180));
    case 'ANONYMOUS':
    case 'PSEUDONYMOUS':
    case 'ATTRIBUTED':
    default:
      return null;
  }
}

/**
 * Generate anonymous token
 */
export function generateAnonymousToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Validate GitHub URL
 */
export function isValidGithubUrl(url: string): boolean {
  const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
  return githubPattern.test(url);
}

/**
 * Format license for display
 */
export function formatLicense(license: string): {
  name: string;
  shortName: string;
  description: string;
} {
  const licenses: Record<string, any> = {
    'CC0-1.0': {
      name: 'Creative Commons Zero v1.0 Universal',
      shortName: 'CC0 1.0',
      description: 'Public Domain Dedication. Anyone can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission.',
    },
    'MIT': {
      name: 'MIT License',
      shortName: 'MIT',
      description: 'A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.',
    },
  };
  
  return licenses[license] || { name: license, shortName: license, description: '' };
}

/**
 * Sanitize filename for file uploads
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .toLowerCase();
}

/**
 * Calculate evidence score based on level and provided evidence
 */
export function calculateEvidenceScore(
  level: string,
  hasGithub: boolean,
  hasMetrics: boolean,
  hasLogs: boolean,
  hasCharts: boolean
): number {
  let score = 0;
  
  // Base score from level
  switch (level) {
    case 'REPRODUCIBLE':
      score = 100;
      break;
    case 'RESEARCH_GRADE':
      score = 80;
      break;
    case 'METRICS':
      score = 60;
      break;
    case 'ANECDOTAL':
      score = 30;
      break;
    case 'NONE':
      score = 10;
      break;
  }
  
  // Bonus for evidence
  if (hasGithub) score += 10;
  if (hasMetrics) score += 5;
  if (hasLogs) score += 5;
  if (hasCharts) score += 5;
  
  return Math.min(score, 100);
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
