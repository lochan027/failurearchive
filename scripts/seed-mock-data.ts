/**
 * Script to populate the database with realistic mock failure submissions
 * Run with: npx tsx scripts/seed-mock-data.ts
 */

import { PrismaClient, FailureRecordType, IdentityMode, EvidenceLevel, ModerationStatus } from '@prisma/client';

const prisma = new PrismaClient();

const mockSubmissions = [
  {
    type: 'RESEARCH_PAPER' as FailureRecordType,
    identityMode: 'ATTRIBUTED' as IdentityMode,
    title: 'Attempting to Scale Transformer Models Beyond 1 Trillion Parameters',
    hypothesis: 'We hypothesized that increasing model parameters to 1.5 trillion would yield proportional improvements in language understanding tasks, following the scaling laws observed in GPT-3 and PaLM.',
    method: 'Built a distributed training system using 2048 A100 GPUs. Implemented ZeRO-3 optimization, tensor parallelism, and pipeline parallelism. Trained on 3TB of multilingual text data for 6 weeks.',
    failurePoints: ['ASSUMPTION_INVALIDATED', 'COST_STRUCTURE'],
    keyMisunderstanding: 'We underestimated the communication overhead in distributed training at this scale. The model spent 70% of time synchronizing weights across nodes rather than computing. Additionally, the model began overfitting on common patterns despite massive data, showing diminishing returns past 800B parameters.',
    salvageableKnowledge: 'Discovered that communication-to-computation ratio becomes the bottleneck beyond 512 GPUs. Found that mixture-of-experts architecture can achieve similar performance with 1/3rd the parameters. Documented optimal batch sizes for various cluster configurations.',
    evidenceLevel: 'RESEARCH_GRADE' as EvidenceLevel,
    githubLink: 'https://github.com/example/mega-transformer',
    domain: ['Deep Learning', 'NLP', 'Distributed Systems'],
    tags: ['transformers', 'scaling-laws', 'distributed-training'],
    stage: 'Implementation',
    metrics: 'Training loss: 2.34 → 2.31 (marginal). Cost: $4.2M. Training time: 1008 GPU-hours. Peak memory: 640GB per node.',
    logs: 'Week 1: Baseline established\nWeek 3: Hit communication bottleneck\nWeek 4: Attempted pipeline optimization\nWeek 6: Terminated due to cost/benefit analysis',
    typeSpecificData: {
      journal: 'arXiv preprint',
      year: '2024',
      timeInvested: '6 months'
    }
  },
  {
    type: 'TECHNICAL_PROJECT' as FailureRecordType,
    identityMode: 'PSEUDONYMOUS' as IdentityMode,
    title: 'Building a Real-Time Collaborative Code Editor with CRDTs',
    hypothesis: 'We could build a more performant alternative to VSCode Live Share using Conflict-free Replicated Data Types (CRDTs) for operational transformation, avoiding the complexity of WebRTC signaling.',
    method: 'Implemented Yjs CRDT library with a custom WebSocket server. Built a Monaco editor integration with real-time cursor tracking. Used Redis for state synchronization across 50+ concurrent users per document.',
    failurePoints: ['TECHNICAL_CEILING', 'SCALING_FAILURE'],
    keyMisunderstanding: 'CRDTs maintain complete edit history, causing memory usage to grow linearly with edit count. After 10,000 edits, the in-memory document structure consumed 500MB+ per user. Garbage collection became a bottleneck. We also failed to account for network partition scenarios where users could edit offline.',
    salvageableKnowledge: 'WebRTC P2P was actually the right choice for this use case. Operational Transformation (OT) with periodic snapshots outperforms CRDTs for code editing specifically. Learned techniques for efficient cursor position encoding.',
    evidenceLevel: 'METRICS' as EvidenceLevel,
    githubLink: 'https://github.com/example/crdt-editor',
    domain: ['Web Development', 'Distributed Systems', 'Real-Time Collaboration'],
    tags: ['crdt', 'websockets', 'collaborative-editing', 'monaco-editor'],
    stage: 'Beta Testing',
    metrics: 'Memory usage: 500MB per user after 10k edits. Latency: 150ms (target: <50ms). Max concurrent users: 25 (target: 100).',
    logs: 'Month 1: Prototype working\nMonth 2: Load testing revealed memory issues\nMonth 3: Attempted optimization\nMonth 4: Pivoted to OT after realizing architectural mistake',
    typeSpecificData: {
      techStack: 'TypeScript, Yjs, WebSocket, Monaco Editor, Redis',
      teamSize: '3 engineers',
      timeInvested: '4 months'
    }
  },
  {
    type: 'BUSINESS_IDEA' as FailureRecordType,
    identityMode: 'DELAYED_30' as IdentityMode,
    title: 'SaaS Platform for Automated Code Review Using GPT-4',
    hypothesis: 'Developers would pay $50/month for AI-powered code review that catches bugs, suggests optimizations, and enforces style guidelines better than static analysis tools.',
    method: 'Built MVP with GPT-4 API integration, GitHub webhook integration, and automated PR comments. Marketed through Reddit, HN, and dev.to. Offered 30-day free trial.',
    failurePoints: ['TIMING_MISMATCH', 'COST_STRUCTURE'],
    keyMisunderstanding: 'Launched 3 weeks before GitHub Copilot announced their integrated code review feature. Our pricing was also misaligned - individual developers saw us as expensive, but enterprises required SOC2/GDPR compliance we didn\'t have. The market bifurcated beneath us.',
    salvageableKnowledge: 'Learned that timing is critical in AI tooling space. Found that developers are price-sensitive but enterprises value compliance over features. Our prompt engineering techniques for code review are still valuable.',
    evidenceLevel: 'METRICS' as EvidenceLevel,
    domain: ['SaaS', 'Developer Tools', 'AI'],
    tags: ['code-review', 'gpt-4', 'saas', 'developer-tools'],
    stage: 'Market Testing',
    metrics: 'MRR: $2,400 (target: $10k). Conversion rate: 2.3% (target: 10%). Churn: 45% after first month.',
    typeSpecificData: {
      businessModel: 'Subscription SaaS',
      marketSize: 'Developer tools market, targeting 25M developers',
      fundingAmount: 'Bootstrapped with $15k',
      timeInvested: '8 months'
    }
  },
  {
    type: 'AI_PROJECT' as FailureRecordType,
    identityMode: 'ATTRIBUTED' as IdentityMode,
    title: 'Training a Specialized LLM for Legal Document Analysis',
    hypothesis: 'A 7B parameter model fine-tuned on legal documents could match GPT-4 performance on contract analysis tasks while being 10x cheaper to run.',
    method: 'Started with Llama 2 7B base model. Curated 50GB of legal documents (contracts, case law, statutes). Used LoRA fine-tuning on 4x A100 for 3 weeks. Evaluated on custom benchmark of 1000 contract clauses.',
    failurePoints: ['TECHNICAL_CEILING', 'DATA_BIAS'],
    keyMisunderstanding: 'Legal reasoning requires broad world knowledge that a 7B model cannot compress. GPT-4\'s 100x larger capacity wasn\'t just about legal knowledge but general reasoning. Our training data also contained contradictory legal interpretations across jurisdictions, confusing the model.',
    salvageableKnowledge: 'Smaller models can work for template extraction and named entity recognition. Created a valuable benchmark dataset. Found that hybrid approach (small model + retrieval + GPT-4 validation) is cost-effective.',
    evidenceLevel: 'RESEARCH_GRADE' as EvidenceLevel,
    githubLink: 'https://github.com/example/legal-llm',
    domain: ['AI/ML', 'Legal Tech', 'NLP'],
    tags: ['llm', 'fine-tuning', 'legal-ai', 'llama'],
    stage: 'Implementation',
    metrics: 'Accuracy: 67% (GPT-4: 94%). Inference cost: $0.02 per contract (target: $0.01). F1 Score: 0.71',
    logs: 'Week 1-2: Data collection and cleaning\nWeek 3-5: Training\nWeek 6: Evaluation showed insufficient performance\nWeek 7: Attempted with 13B model, still inadequate',
    typeSpecificData: {
      techStack: 'Python, PyTorch, Llama 2, LoRA, Hugging Face',
      teamSize: '2 ML engineers',
      timeInvested: '3 months'
    }
  },
  {
    type: 'RESEARCH_IDEA' as FailureRecordType,
    identityMode: 'ANONYMOUS' as IdentityMode,
    title: 'Using Quantum Annealing for Optimizing Neural Architecture Search',
    hypothesis: 'Quantum annealers like D-Wave could explore the neural architecture search space more efficiently than gradient-based NAS, potentially discovering novel architectures.',
    method: 'Formulated NAS as a QUBO (Quadratic Unconstrained Binary Optimization) problem. Encoded architecture choices as binary variables. Attempted to use D-Wave Advantage quantum annealer through cloud API.',
    failurePoints: ['ASSUMPTION_INVALIDATED', 'TECHNICAL_CEILING'],
    keyMisunderstanding: 'The mapping between architecture quality and quantum energy landscape is non-trivial. Current quantum annealers have ~5000 qubits but NAS requires representing 10^20 possible architectures. The discretization loses critical information. Additionally, quantum annealing time wasn\'t actually faster than random search due to classical preprocessing overhead.',
    salvageableKnowledge: 'Learned the practical limitations of current quantum hardware. The QUBO formulation could potentially work with future quantum computers. Classical simulated annealing was actually competitive.',
    evidenceLevel: 'ANECDOTAL' as EvidenceLevel,
    domain: ['Quantum Computing', 'Neural Architecture Search', 'AI/ML'],
    tags: ['quantum-computing', 'nas', 'architecture-search', 'd-wave'],
    stage: 'Research',
    typeSpecificData: {
      timeInvested: '6 weeks of literature review and experimentation'
    }
  },
  {
    type: 'FUTURE_TECH_IDEA' as FailureRecordType,
    identityMode: 'ATTRIBUTED' as IdentityMode,
    title: 'Neuromorphic Chips for Edge AI: Why 2025 Wasn\'t Ready',
    hypothesis: 'Neuromorphic computing would enable 100x more energy-efficient AI inference on edge devices by 2025, making always-on AI assistants practical.',
    method: 'Researched Intel Loihi 2, IBM TrueNorth, and academic papers on spiking neural networks. Analyzed power consumption models and attempted to prototype with Loihi dev kit.',
    failurePoints: ['TIMING_MISMATCH', 'MARKET_ILLUSION'],
    keyMisunderstanding: 'The software ecosystem is 5+ years behind the hardware. PyTorch and TensorFlow models can\'t be easily converted to spiking neural networks. Training SNNs from scratch requires specialized expertise. Most importantly, modern GPUs got so efficient (4nm process, INT8 quantization) that the neuromorphic advantage shrunk from 100x to 3x.',
    salvageableKnowledge: 'Neuromorphic computing may still win for always-on, ultra-low-power applications (<1mW). The technology isn\'t dead, just needs another 5 years for software maturity. Event-based vision sensors could be the killer app.',
    evidenceLevel: 'ANECDOTAL' as EvidenceLevel,
    domain: ['Hardware', 'AI/ML', 'Edge Computing'],
    tags: ['neuromorphic', 'edge-ai', 'spiking-neural-networks'],
    stage: 'Research',
    typeSpecificData: {
      timeInvested: '2 months of research and prototyping'
    }
  },
  {
    type: 'TECHNICAL_PROJECT' as FailureRecordType,
    identityMode: 'PSEUDONYMOUS' as IdentityMode,
    title: 'Building a Rust-based WebAssembly Video Encoder for Browser',
    hypothesis: 'A WASM-based H.264 encoder written in Rust could enable client-side video encoding without uploading raw footage, providing privacy and reducing server costs.',
    method: 'Used x264 C library, compiled to WASM with Emscripten. Created Rust bindings. Built web worker architecture to avoid blocking main thread. Tested with 1080p video samples.',
    failurePoints: ['TECHNICAL_CEILING', 'USER_BEHAVIOR_MISMATCH'],
    keyMisunderstanding: 'WASM\'s single-threaded execution model (without SharedArrayBuffer due to security) made encoding unbearably slow. A 1-minute 1080p video took 15 minutes to encode. We needed SIMD and threading that browsers restricted post-Spectre. Battery drain on laptops was also severe.',
    salvageableKnowledge: 'Client-side encoding is viable only for low-resolution or short clips. The architectural pattern of web workers + WASM is sound. For production, hybrid approach: client-side for thumbnails, server-side for full encoding.',
    evidenceLevel: 'METRICS' as EvidenceLevel,
    githubLink: 'https://github.com/example/wasm-video-encoder',
    domain: ['Web Development', 'Video Processing', 'WebAssembly'],
    tags: ['wasm', 'rust', 'video-encoding', 'h264'],
    stage: 'Beta Testing',
    metrics: 'Encoding speed: 0.07x (target: 1x real-time). Memory usage: 2GB for 1080p. Battery impact: 25%/hour on laptop.',
    logs: 'Week 1-2: Initial WASM compilation\nWeek 3: Performance profiling\nWeek 4: Attempted SIMD optimization\nWeek 5: Realized browser threading limitations\nWeek 6: Scaled down to 480p use case',
    typeSpecificData: {
      techStack: 'Rust, WebAssembly, Emscripten, x264, Web Workers',
      teamSize: 'Solo developer',
      timeInvested: '6 weeks'
    }
  },
  {
    type: 'BUSINESS_IDEA' as FailureRecordType,
    identityMode: 'ATTRIBUTED' as IdentityMode,
    title: 'AI-Powered Personal Finance Coach - Why Gen Z Didn\'t Bite',
    hypothesis: 'Gen Z users (18-25) would pay $10/month for an AI chatbot that analyzes spending patterns and provides personalized savings advice, competing with human financial advisors.',
    method: 'Built mobile app with Plaid integration for bank connectivity. Used GPT-3.5 for conversational interface. Implemented spending categorization and goal tracking. Ran Instagram ads targeting college students.',
    failurePoints: ['MARKET_ILLUSION', 'USER_BEHAVIOR_MISMATCH', 'COST_STRUCTURE'],
    keyMisunderstanding: 'Gen Z users in our target demographic (college students) are already broke and don\'t see value in paying for savings advice. They also deeply distrust apps connecting to bank accounts after hearing about data breaches. The $10/month price point was too high for a demographic with median income <$20k/year.',
    salvageableKnowledge: 'Financial advice needs to be free-tier with premium features. Trust is critical - need bank-level security certifications. Better target: young professionals (25-35) with $50k+ income. Gamification and social features drive engagement more than AI insights.',
    evidenceLevel: 'METRICS' as EvidenceLevel,
    domain: ['FinTech', 'Mobile Apps', 'AI'],
    tags: ['fintech', 'personal-finance', 'mobile-app', 'ai-assistant'],
    stage: 'Market Testing',
    metrics: 'Sign-ups: 450. Paid conversions: 8 (1.8%). Monthly churn: 62%. CAC: $18, LTV: $23.',
    typeSpecificData: {
      businessModel: 'Freemium mobile app',
      marketSize: 'Gen Z personal finance market',
      fundingAmount: 'Bootstrapped with $8k',
      timeInvested: '5 months'
    }
  },
  {
    type: 'RESEARCH_PAPER' as FailureRecordType,
    identityMode: 'ATTRIBUTED' as IdentityMode,
    title: 'Negative Result: Graph Neural Networks for Molecular Property Prediction Show No Advantage Over Random Forests',
    hypothesis: 'Graph Neural Networks (GNNs) would outperform traditional ML methods for predicting molecular properties by capturing 3D structural information.',
    method: 'Implemented GCN, GAT, and MPNN architectures. Trained on 100k molecules from PubChem with 12 property targets. Compared against Random Forest with Morgan fingerprints. Used 5-fold cross-validation.',
    failurePoints: ['ASSUMPTION_INVALIDATED'],
    keyMisunderstanding: 'For small molecule datasets (<1M samples), Morgan fingerprints + Random Forest already capture the relevant structural information. GNNs showed no statistical improvement (p>0.05). The 3D information was actually noise for many properties. GNNs require 100x more training data to show benefits.',
    salvageableKnowledge: 'Published negative result to prevent others from wasting time. Identified specific properties where GNNs do help (protein binding affinity). Created a decision tree for when to use GNNs vs traditional ML in cheminformatics.',
    evidenceLevel: 'REPRODUCIBLE' as EvidenceLevel,
    githubLink: 'https://github.com/example/gnn-molecular-properties',
    pdfUrl: 'https://arxiv.org/pdf/example.pdf',
    domain: ['Machine Learning', 'Computational Chemistry', 'Drug Discovery'],
    tags: ['gnn', 'molecular-properties', 'cheminformatics', 'negative-result'],
    stage: 'Analysis',
    metrics: 'GNN RMSE: 0.82 ± 0.05. Random Forest RMSE: 0.79 ± 0.04. Training time GNN: 8 hours, RF: 10 minutes.',
    typeSpecificData: {
      journal: 'Journal of Chemical Information and Modeling',
      year: '2024',
      timeInvested: '4 months'
    }
  },
  {
    type: 'AI_PROJECT' as FailureRecordType,
    identityMode: 'PSEUDONYMOUS' as IdentityMode,
    title: 'Automated Bug Detection via CodeBERT - Why AST Analysis Won',
    hypothesis: 'Fine-tuning CodeBERT on bug reports could automatically detect similar bugs in new code with 85%+ accuracy, reducing manual code review time.',
    method: 'Collected 50k bug-fix commits from GitHub. Fine-tuned CodeBERT on bug-fix pairs. Built VSCode extension that flags suspicious code patterns. Evaluated on hold-out test set of 5k bugs.',
    failurePoints: ['TECHNICAL_CEILING', 'USER_BEHAVIOR_MISMATCH'],
    keyMisunderstanding: 'CodeBERT captured surface patterns but missed semantic bugs. 62% false positive rate made it unusable - developers ignored warnings. Traditional AST-based static analysis (PMD, SpotBugs) had 15% false positive rate with similar recall. We were solving a problem that was already better solved.',
    salvageableKnowledge: 'Learned that "good enough" solutions in production often beat "fancy" research prototypes. False positive rate is more important than recall for developer tools. CodeBERT is better for code search and documentation generation.',
    evidenceLevel: 'METRICS' as EvidenceLevel,
    githubLink: 'https://github.com/example/codebert-bug-detector',
    domain: ['AI/ML', 'Software Engineering', 'Developer Tools'],
    tags: ['codebert', 'bug-detection', 'static-analysis', 'vscode'],
    stage: 'Beta Testing',
    metrics: 'Precision: 38%. Recall: 76%. F1: 0.51. Developer satisfaction: 2.3/5. Warnings ignored: 85%.',
    logs: 'Month 1: Data collection\nMonth 2: Model training\nMonth 3: VSCode extension built\nMonth 4: User testing revealed fatal UX issues',
    typeSpecificData: {
      techStack: 'Python, PyTorch, CodeBERT, TypeScript, VSCode API',
      teamSize: '2 developers',
      timeInvested: '4 months'
    }
  }
];

async function main() {
  console.log('🌱 Starting to seed mock data...');

  // First, find or create a test user
  let testUser = await prisma.user.findFirst({
    where: {
      email: { contains: '@' }
    }
  });

  if (!testUser) {
    console.log('No user found. Please sign in to the application first, then run this script.');
    process.exit(1);
  }

  console.log(`Using user: ${testUser.email}`);

  // Generate pseudonymous IDs for those that need them
  const generatePseudoId = () => 'FA' + Math.random().toString(36).substring(2, 10).toUpperCase();

  let createdCount = 0;

  for (const submission of mockSubmissions) {
    try {
      const pseudonymousId = ['PSEUDONYMOUS', 'DELAYED_30', 'DELAYED_90'].includes(submission.identityMode) 
        ? generatePseudoId() 
        : null;

      const attributionDate = submission.identityMode.startsWith('DELAYED_')
        ? new Date(Date.now() + (submission.identityMode === 'DELAYED_30' ? 30 : submission.identityMode === 'DELAYED_90' ? 90 : 180) * 24 * 60 * 60 * 1000)
        : null;

      const failureRecord = await prisma.failureRecord.create({
        data: {
          ...submission,
          userId: testUser.id,
          pseudonymousId,
          attributionDate,
          status: 'PUBLISHED',
          licenseAccepted: true,
          textLicense: 'CC0-1.0',
          codeLicense: 'MIT',
          publishedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in last 90 days
        }
      });

      // Create moderation record
      await prisma.moderationRecord.create({
        data: {
          failureRecordId: failureRecord.id,
          status: 'APPROVED' as ModerationStatus,
          flags: [],
          aiAnalysis: 'Clean submission, approved for publication.',
          manualReview: false,
        }
      });

      createdCount++;
      console.log(`✅ Created: ${submission.title}`);
    } catch (error) {
      console.error(`❌ Failed to create: ${submission.title}`);
      console.error(error);
    }
  }

  console.log(`\n🎉 Successfully created ${createdCount} mock submissions!`);
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
