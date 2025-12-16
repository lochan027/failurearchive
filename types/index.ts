import { FailureRecordType, IdentityMode, SubmissionStatus, FailurePoint, EvidenceLevel, ReuseType } from '@/lib/db-types';

export interface FailureRecordFormData {
  type: FailureRecordType;
  identityMode: IdentityMode;
  title: string;
  hypothesis: string;
  method: string;
  failurePoints: FailurePoint[];
  keyMisunderstanding: string;
  salvageableKnowledge: string;
  evidenceLevel: EvidenceLevel;
  githubLink?: string;
  pdfUrl?: string;
  metrics?: string;
  logs?: string;
  charts?: any[];
  typeSpecificData?: any;
  domain: string[];
  tags: string[];
  stage?: string;
  licenseAccepted: boolean;
}

export interface TypeSpecificData {
  // Technical Project
  intendedOutcome?: string;
  architecture?: string;
  stack?: string[];
  
  // Research Paper
  researchMethod?: string;
  resultSummary?: string;
  whyNegativeMatters?: string;
  
  // Research Idea
  missingTheory?: string;
  missingData?: string;
  missingTooling?: string;
  weakestAssumption?: string;
  
  // Business Idea
  targetUser?: string;
  valueProposition?: string;
  failedAssumption?: {
    type: 'MARKET_SIZE' | 'USER_BEHAVIOR' | 'DISTRIBUTION' | 'COST_STRUCTURE' | 'TIMING';
    description: string;
  };
  
  // Future Tech Idea
  vision?: string;
  blockingLimitations?: string[];
  requiredBreakthroughs?: string[];
  whyCurrentTechInsufficient?: string;
  
  // AI Project
  model?: string;
  data?: string;
  evaluationMethod?: string;
  whereGeneralizationFailed?: string;
  whyScalingDidNotHelp?: string;
}

export interface GalleryFilters {
  types?: FailureRecordType[];
  domains?: string[];
  failurePoints?: FailurePoint[];
  stages?: string[];
  evidenceLevels?: EvidenceLevel[];
  search?: string;
}

export interface GallerySorting {
  field: 'reuseCount' | 'referenceCount' | 'createdAt' | 'relevance';
  order: 'asc' | 'desc';
}

export interface ReuseRecordData {
  type: ReuseType;
  privateNotes?: string;
}

export interface PreMortemInput {
  idea: string;
  domain?: string[];
  hypothesis?: string;
}

export interface PreMortemOutput {
  relatedFailures: string[]; // IDs
  commonPatterns: string[];
  likelyInvalidAssumptions: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
}
