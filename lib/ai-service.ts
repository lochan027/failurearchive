/**
 * AI Service Abstraction Layer
 * 
 * Provides Perplexity API interface for:
 * - Content moderation (using sonar model)
 * - Knowledge extraction (using sonar-pro for complex analysis)
 * - Pre-mortem analysis (using sonar-reasoning-pro for logical reasoning)
 */

export interface ModerationResult {
  safe: boolean;
  flags: string[];
  confidence: number;
  analysis: {
    illegalContent: boolean;
    malwareLinks: boolean;
    scamPatterns: boolean;
    hateHarassment: boolean;
    plagiarismRisk: boolean;
    fakeCitations: boolean;
  };
}

export interface KnowledgeExtraction {
  normalizedHypothesis: string;
  taxonomyTags: string[];
  similarFailureIds: string[];
  commonPatterns: string[];
  riskFactors: string[];
}

class AIService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.AI_API_KEY || '';
    this.apiUrl = process.env.AI_API_URL || 'https://api.perplexity.ai';
  }

  /**
   * Moderate submission content for policy violations
   */
  async moderateContent(content: {
    title: string;
    hypothesis: string;
    method: string;
    links?: string[];
  }): Promise<ModerationResult> {
    try {
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [
            {
              role: 'system',
              content: `You are a content moderator for an academic failure archive. 
              Analyze the submission for: illegal content, malware links, scam patterns, 
              hate/harassment, plagiarism risk, and fake citations.
              Respond ONLY with valid JSON matching this schema:
              {
                "safe": boolean,
                "flags": string[],
                "confidence": number,
                "analysis": {
                  "illegalContent": boolean,
                  "malwareLinks": boolean,
                  "scamPatterns": boolean,
                  "hateHarassment": boolean,
                  "plagiarismRisk": boolean,
                  "fakeCitations": boolean
                }
              }`,
            },
            {
              role: 'user',
              content: JSON.stringify(content),
            },
          ],
          temperature: 0.1,
        }),
      });

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('AI moderation failed:', error);
      // Fail-safe: flag for manual review
      return {
        safe: false,
        flags: ['AI_ERROR_NEEDS_MANUAL_REVIEW'],
        confidence: 0,
        analysis: {
          illegalContent: false,
          malwareLinks: false,
          scamPatterns: false,
          hateHarassment: false,
          plagiarismRisk: false,
          fakeCitations: false,
        },
      };
    }
  }

  /**
   * Extract knowledge and normalize submission data
   */
  async extractKnowledge(submission: {
    title: string;
    hypothesis: string;
    method: string;
    domain: string[];
    failurePoints: string[];
  }): Promise<KnowledgeExtraction> {
    try {
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'sonar-pro',
          messages: [
            {
              role: 'system',
              content: `You are an AI analyzing academic failure records.
              Extract structured knowledge: normalize the hypothesis into a general pattern,
              generate taxonomy tags, identify common failure patterns, and assess risk factors.
              Respond ONLY with valid JSON matching this schema:
              {
                "normalizedHypothesis": string,
                "taxonomyTags": string[],
                "commonPatterns": string[],
                "riskFactors": string[]
              }`,
            },
            {
              role: 'user',
              content: JSON.stringify(submission),
            },
          ],
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      return {
        ...result,
        similarFailureIds: [], // Will be populated by vector search
      };
    } catch (error) {
      console.error('AI knowledge extraction failed:', error);
      return {
        normalizedHypothesis: submission.hypothesis,
        taxonomyTags: submission.domain,
        similarFailureIds: [],
        commonPatterns: [],
        riskFactors: [],
      };
    }
  }

  /**
   * Generate pre-mortem analysis for an idea
   */
  async generatePreMortem(input: {
    idea: string;
    domain?: string[];
    hypothesis?: string;
  }): Promise<{
    commonPatterns: string[];
    likelyInvalidAssumptions: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendations: string[];
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'sonar-reasoning-pro',
          messages: [
            {
              role: 'system',
              content: `You are a pre-mortem analyst for a failure archive.
              Given an idea, identify common failure patterns, likely invalid assumptions,
              assess risk level, and provide recommendations.
              Respond ONLY with valid JSON matching this schema:
              {
                "commonPatterns": string[],
                "likelyInvalidAssumptions": string[],
                "riskLevel": "LOW" | "MEDIUM" | "HIGH",
                "recommendations": string[]
              }`,
            },
            {
              role: 'user',
              content: JSON.stringify(input),
            },
          ],
          temperature: 0.4,
        }),
      });

      const data = await response.json();
      let content = data.choices[0].message.content;
      
      // Remove XML thinking tags if present
      content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      
      // Extract JSON if wrapped in markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        content = jsonMatch[1];
      }
      
      const result = JSON.parse(content);
      return result;
    } catch (error) {
      console.error('AI pre-mortem failed:', error);
      return {
        commonPatterns: [],
        likelyInvalidAssumptions: [],
        riskLevel: 'MEDIUM',
        recommendations: ['AI analysis unavailable. Please review manually.'],
      };
    }
  }
}

export const aiService = new AIService();
