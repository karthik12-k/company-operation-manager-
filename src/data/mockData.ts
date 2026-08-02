import {
  JiraIssue,
  PullRequest,
  CommitActivity,
  MicroserviceHealth,
  LogEntry,
  RAGDocument,
  MCPToolDefinition,
  UserAccount,
  Team,
  TeamProject,
  CodeAnalysisResult,
  ReleaseRiskPrediction,
  TeamHealthMetrics,
  TaskRedistributionPlan,
  MeetingSummary,
  FinOpsCostMetrics,
  SecurityGuardrailResult,
  SelfHealingRemediation,
  ChaosOutageSimulation
} from '../types';

export const MOCK_FINOPS_METRICS: FinOpsCostMetrics = {
  totalMonthlySpend: 48200,
  potentialSavings: 14200,
  savingsApplied: false,
  spendByService: [
    { service: 'auth-service (EKS Pods)', cost: 18400, trend: '▲ +34%' },
    { service: 'payment-gateway', cost: 12200, trend: '▶ Stable' },
    { service: 'api-gateway', cost: 9800, trend: '▲ +12%' },
    { service: 'Qdrant Vector DB Cluster', cost: 7800, trend: '▶ Stable' }
  ],
  wasteItems: [
    {
      id: 'waste-1',
      resourceName: 'Idle Staging EKS Pods (8 Nodes)',
      type: 'Compute Over-provisioning',
      monthlyCost: 6800,
      recommendation: 'Scale down staging cluster nodes between 10 PM - 6 AM daily.',
      applied: false
    },
    {
      id: 'waste-2',
      resourceName: 'Unattached EBS GP3 Volumes (1.2 TB)',
      type: 'Storage Waste',
      monthlyCost: 4200,
      recommendation: 'Delete 14 unattached EBS volumes leftover from blue/green deploys.',
      applied: false
    },
    {
      id: 'waste-3',
      resourceName: 'Over-provisioned Redis Cache (cache.r6g.2xlarge)',
      type: 'Memory Over-allocation',
      monthlyCost: 3200,
      recommendation: 'Right-size auth-service Redis cache node type to cache.r6g.xlarge.',
      applied: false
    }
  ]
};

export const MOCK_SECURITY_GUARDRAILS: SecurityGuardrailResult = {
  piiRedactedCount: 142,
  secretsMaskedCount: 38,
  soc2ComplianceScore: 92,
  complianceAlerts: [
    {
      severity: 'HIGH',
      rule: 'SOC2 CC6.1 - Access Control & Secret Rotation',
      description: 'Cross-region AWS Secrets Manager sync window exceeded 15 minute limit.',
      status: 'Flagged'
    },
    {
      severity: 'MEDIUM',
      rule: 'ISO 27001 A.12.1.2 - Change Management',
      description: 'PR #1042 Redis client upgrade missing explicit security guild sign-off.',
      status: 'Mitigated'
    }
  ],
  sampleRawLog: `[2026-08-02 21:45:12] ERROR auth-service: JWT Bearer Token secret="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." for user email="alex.rivera@company.com" card="4532-8921-9901-4412" failed verification. AWS_SECRET_ACCESS_KEY="AKIAIOSFODNN7EXAMPLE"`,
  sampleRedactedLog: `[2026-08-02 21:45:12] ERROR auth-service: JWT Bearer Token secret="[REDACTED_BEARER_TOKEN]" for user email="a***a@company.com" card="[REDACTED_CREDIT_CARD]" failed verification. AWS_SECRET_ACCESS_KEY="[REDACTED_AWS_KEY]"`
};

export const MOCK_SELF_HEALING: SelfHealingRemediation = {
  id: 'heal-auth-504',
  targetService: 'auth-service',
  triggerCause: 'Redis connection pool exhaustion & HTTP 504 Gateway Timeouts (6.42% error rate)',
  initialErrorRate: 6.42,
  recoveredErrorRate: 0.04,
  status: 'idle',
  steps: [
    {
      stepNumber: 1,
      action: 'Scale Kubernetes Deployment auth-service replicas from 4 to 12 pods',
      status: 'pending',
      resultMessage: 'Pod replicas scaled cleanly across US-East-1 nodes.'
    },
    {
      stepNumber: 2,
      action: 'Purge stale Redis connection leases and enable 5000ms idle reaping',
      status: 'pending',
      resultMessage: 'Flushed idle sockets in Redis pool manager.'
    },
    {
      stepNumber: 3,
      action: 'Apply dynamic HPA auto-scaling trigger and verify p99 latency recovery',
      status: 'pending',
      resultMessage: 'Latency dropped from 2450ms to 85ms. Error rate restored to 0.04%.'
    }
  ]
};

export const MOCK_CHAOS_SIMULATIONS: ChaosOutageSimulation[] = [
  {
    id: 'chaos-redis-exhaustion',
    title: '🔥 Redis Connection Pool Exhaustion (auth-service)',
    targetService: 'auth-service',
    errorSpikeRate: 8.45,
    logStream: 'FATAL auth-service: RedisConnectionPoolExhaustedException maxConnections=50 leased. Timeouts cascading.',
    status: 'idle'
  },
  {
    id: 'chaos-stripe-webhook',
    title: '⚡ Stripe Webhook Idempotency Lock Failure',
    targetService: 'payment-gateway',
    errorSpikeRate: 4.80,
    logStream: 'ERROR payment-gateway: Redlock acquisition timeout 200ms lock expired before DB commit.',
    status: 'idle'
  }
];

export const MOCK_ADMIN_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-admin-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@company.com',
    role: 'admin',
    title: 'VP of Engineering & Operations',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-admin-david',
    name: 'David Vance',
    email: 'david.vance@company.com',
    role: 'admin',
    title: 'Director of Cloud Operations & Infrastructure',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-admin-rachel',
    name: 'Rachel Kim',
    email: 'rachel.kim@company.com',
    role: 'admin',
    title: 'Chief Information Security Officer (CISO)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  }
];

export const MOCK_USERS: UserAccount[] = [
  ...MOCK_ADMIN_ACCOUNTS,
  {
    id: 'usr-alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@company.com',
    role: 'team_lead',
    teamId: 'team-a',
    title: 'Platform Auth Team Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-elena',
    name: 'Elena Rostova',
    email: 'elena.rostova@company.com',
    role: 'employee',
    teamId: 'team-a',
    title: 'Senior Payments Engineer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-marcus',
    name: 'Marcus Chen',
    email: 'marcus.chen@company.com',
    role: 'team_lead',
    teamId: 'team-b',
    title: 'API Gateway & Core Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-sophia',
    name: 'Sophia Taylor',
    email: 'sophia.taylor@company.com',
    role: 'employee',
    teamId: 'team-b',
    title: 'Security & Auth Engineer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  }
];

export const MOCK_TEAMS: Team[] = [
  {
    id: 'team-a',
    name: 'Team A - Platform & Auth',
    code: 'TEAM-A',
    description: 'Core OAuth2 services, Redis token caching, and user authentication infrastructure.',
    leaderId: 'usr-alex',
    memberIds: ['usr-alex', 'usr-elena'],
    createdDate: '2025-01-15'
  },
  {
    id: 'team-b',
    name: 'Team B - Payments & Gateway',
    code: 'TEAM-B',
    description: 'Stripe payment webhooks, idempotency locking, and GraphQL API gateway rate limiting.',
    leaderId: 'usr-marcus',
    memberIds: ['usr-marcus', 'usr-sophia'],
    createdDate: '2025-03-01'
  },
  {
    id: 'team-c',
    name: 'Team C - Cloud Infra & Security',
    code: 'TEAM-C',
    description: 'AWS Kubernetes clusters, Secrets Manager sync, and zero-downtime key rotation.',
    leaderId: 'usr-admin-david',
    memberIds: ['usr-admin-david', 'usr-sophia'],
    createdDate: '2025-05-10'
  }
];

export const MOCK_CODE_ANALYSIS: CodeAnalysisResult[] = [
  {
    id: 'ca-auth',
    repoName: 'ops-copilot/auth-service',
    healthGrade: 'C',
    codeCoveragePercent: 68.4,
    techDebtHours: 42,
    duplicateCodePercent: 4.2,
    cyclomaticComplexityScore: 24,
    securityVulnerabilities: [
      {
        severity: 'CRITICAL',
        title: 'Unbounded Redis Connection Leak in Token Exchanger',
        file: 'src/services/OAuthTokenService.ts',
        line: 142,
        description: 'Redis client pool leases connections without timeout during token refresh loops, leading to 504 Gateway Timeouts.',
        suggestedFix: 'Wrap client acquisition in connection pool manager with 5000ms idle timeout.'
      },
      {
        severity: 'HIGH',
        title: 'Hardcoded Fallback JWT KeyId in Signature Verifier',
        file: 'src/middleware/jwtAuth.ts',
        line: 88,
        description: 'Fallback key identifier bypasses AWS Secrets Manager rotation verification during blue/green deploys.',
        suggestedFix: 'Fetch dual-key vault signatures from KMS cache.'
      }
    ]
  },
  {
    id: 'ca-payment',
    repoName: 'ops-copilot/payment-gateway',
    healthGrade: 'B',
    codeCoveragePercent: 84.1,
    techDebtHours: 18,
    duplicateCodePercent: 1.8,
    cyclomaticComplexityScore: 14,
    securityVulnerabilities: [
      {
        severity: 'HIGH',
        title: 'Redlock Short Lock TTL Race Condition',
        file: 'src/processors/CheckoutProcessor.ts',
        line: 67,
        description: 'Stripe webhook idempotency key lock expires in 200ms before database write commits during latency spikes.',
        suggestedFix: 'Implement lock watchdog extension (min 3000ms TTL).'
      }
    ]
  }
];

export const MOCK_RISK_PREDICTIONS: ReleaseRiskPrediction[] = [
  {
    id: 'risk-auth-v214',
    serviceName: 'auth-service',
    version: 'v2.14.0 (Deployed Yesterday)',
    riskScore: 88,
    riskLevel: 'CRITICAL',
    failureProbabilityPercent: 92,
    candidatePRs: ['#1042 Redis Upgrade'],
    riskFactors: [
      { factor: 'Redis Connection Pool Exhaustion', impact: 'High', description: 'PR #1042 introduced unthrottled pool acquisition' },
      { factor: 'P99 Latency Spike (+2200ms)', impact: 'High', description: 'Upstream gateway timeouts cascade to web clients' },
      { factor: 'Cross-Region JWT Rotation Delay', impact: 'Medium', description: 'K8s secret sync lagging between US-East and EU-West' }
    ],
    aiMitigationRecommendation: 'Scale auth-service deployment to 12 replicas and rollback Redis client retry logic to v3.'
  },
  {
    id: 'risk-pay-v184',
    serviceName: 'payment-gateway',
    version: 'v1.8.4 (Staging)',
    riskScore: 45,
    riskLevel: 'MODERATE',
    failureProbabilityPercent: 35,
    candidatePRs: ['#1045 Stripe Lock Watchdog'],
    riskFactors: [
      { factor: 'Database Query Latency', impact: 'Medium', description: 'Unindexed query on user_preferences table' }
    ],
    aiMitigationRecommendation: 'Deploy PostgreSQL index migration script DB-601 before promoting v1.8.4 to production.'
  }
];

export const MOCK_TEAM_HEALTH: TeamHealthMetrics[] = [
  {
    teamId: 'team-a',
    teamName: 'Team A (Platform Auth & Core)',
    healthScore: 64,
    burnoutRiskLevel: 'High',
    workloadBalanceScore: 48,
    prReviewVelocityHours: 14.5,
    sprintPredictabilityPercent: 72,
    overloadedEngineers: ['Alex Rivera (4 High Priority Tasks assigned)'],
    recommendations: [
      'Reassign 2 Jira tickets (AUTH-402, DB-601) from Alex Rivera to Elena Rostova',
      'Reduce sprint story points by 15% to address incident technical debt'
    ]
  },
  {
    teamId: 'team-b',
    teamName: 'Team B (Payments & API Gateway)',
    healthScore: 88,
    burnoutRiskLevel: 'Low',
    workloadBalanceScore: 85,
    prReviewVelocityHours: 4.2,
    sprintPredictabilityPercent: 94,
    overloadedEngineers: [],
    recommendations: [
      'Maintain current sprint velocity; workload is evenly balanced across members.'
    ]
  }
];

export const MOCK_TASK_REDISTRIBUTION: TaskRedistributionPlan[] = [
  {
    id: 'redist-1',
    overloadedEngineer: {
      id: 'usr-alex',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      currentTaskCount: 4
    },
    recommendedTargetEngineer: {
      id: 'usr-elena',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      currentTaskCount: 1
    },
    taskToReassign: {
      id: 'DB-601',
      title: 'PostgreSQL connection queue maxed out on User-Profile service',
      priority: 'P2 - Major'
    },
    impactDescription: 'Reduces Alex Rivera workload by 25% and balances Team A task distribution index from 48 to 82.'
  }
];

export const MOCK_MEETING_SUMMARY: MeetingSummary = {
  id: 'mtg-standup-0802',
  date: '2026-08-02 09:30 AM',
  title: 'Daily Engineering Standup & Incident Sync - Team A & Platform Infra',
  duration: '15 mins',
  attendees: ['Sarah Jenkins (VP Eng)', 'Alex Rivera (Team A Lead)', 'Elena Rostova (Payments Eng)', 'Marcus Chen (Gateway Lead)'],
  executiveSummary: 
    'Engineering standup focused on resolving auth-service 504 timeouts (AUTH-402) caused by PR #1042. Alex Rivera is leading the Redis pool connection patch. Elena Rostova completed Stripe lock watchdog PR #1045. Marcus Chen submitted GraphQL query depth PR #1048.',
  blockersIdentified: [
    '504 Gateway Timeouts in auth-service causing customer login failures',
    'PostgreSQL unindexed query slowdown on user_preferences table (DB-601)'
  ],
  actionItems: [
    {
      id: 'act-std-1',
      task: 'Scale auth-service replicas from 4 to 12 & deploy Redis connection pool fix',
      owner: 'Alex Rivera',
      deadline: 'Today 14:00',
      completed: false
    },
    {
      id: 'act-std-2',
      task: 'Verify Stripe idempotency Redlock TTL extension in staging',
      owner: 'Elena Rostova',
      deadline: 'Today 16:00',
      completed: true
    },
    {
      id: 'act-std-3',
      task: 'Merge GraphQL depth validation PR #1048 to stop rate limiter leak',
      owner: 'Marcus Chen',
      deadline: 'Today 18:00',
      completed: false
    }
  ]
};

export const MOCK_TEAM_PROJECTS: TeamProject[] = [
  {
    id: 'prj-101',
    title: 'OAuth2 Redis Connection Pool Hardening',
    description: 'Fix connection leaks in node-redis v4 retry backoff and increase pool capacity to 200.',
    teamId: 'team-a',
    deadline: '2026-08-10',
    status: 'In Progress',
    progressPercent: 75,
    keyDeliverable: 'Zero 504 Timeouts in auth-service under 5k rps',
    priority: 'Critical'
  },
  {
    id: 'prj-102',
    title: 'Stripe Idempotency Redlock TTL Extension',
    description: 'Implement dynamic Redlock watchdog extending TTL during database latency spikes.',
    teamId: 'team-a',
    deadline: '2026-08-15',
    status: 'In Progress',
    progressPercent: 60,
    keyDeliverable: 'Idempotent webhook fulfillment verification suite',
    priority: 'High'
  },
  {
    id: 'prj-201',
    title: 'GraphQL API Gateway Rate-Limiter Patch',
    description: 'Refactor rate limiter middleware token bucket refill to prevent memory leaks.',
    teamId: 'team-b',
    deadline: '2026-08-12',
    status: 'Under Review',
    progressPercent: 90,
    keyDeliverable: 'PR #1048 query depth validation merge',
    priority: 'Critical'
  },
  {
    id: 'prj-301',
    title: 'Multi-Region AWS Secrets Manager Auto-Sync',
    description: 'Reduce Secrets Manager sync interval to 30s for cross-region JWT key rotation.',
    teamId: 'team-c',
    deadline: '2026-08-20',
    status: 'Completed',
    progressPercent: 100,
    keyDeliverable: 'Zero-downtime blue/green secret propagation',
    priority: 'Medium'
  }
];

export const MOCK_JIRA_ISSUES: JiraIssue[] = [
  {
    id: 'AUTH-402',
    title: 'OAuth Token Refresher causing 504 Gateway Timeouts in auth-service',
    priority: 'P0 - Blocker',
    status: 'In Progress',
    assignee: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      team: 'Team A (Platform Auth)'
    },
    component: 'auth-service',
    created: '2026-08-01 14:22',
    description: 'Redis connection pool exhaustion when exchanging refresh tokens during high traffic spikes. Leads to downstream 504 Gateway Timeouts for web sessions.',
    impactScore: 94,
    rootCauseCandidate: 'Connection leak in node-redis v4 retry logic deployed in PR #1042'
  },
  {
    id: 'PAY-891',
    title: 'Stripe Webhook processing race condition in payment-gateway',
    priority: 'P0 - Blocker',
    status: 'Open',
    assignee: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      team: 'Team A (Payments & Core)'
    },
    component: 'payment-gateway',
    created: '2026-08-01 18:45',
    description: 'Duplicate checkout events firing simultaneously cause double-fulfillment attempts and HTTP 500 error cascade on idempotency lock retry.',
    impactScore: 89,
    rootCauseCandidate: 'Distributed lock TTL set too short (200ms) under current DB latency spikes'
  },
  {
    id: 'API-304',
    title: 'Rate limiter leak on GraphQL gateway endpoint /v2/query',
    priority: 'P1 - Critical',
    status: 'In Review',
    assignee: {
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      team: 'Team B (Payments & Gateway)'
    },
    component: 'api-gateway',
    created: '2026-08-02 03:10',
    description: 'Token bucket algorithm fails to refill tokens for enterprise tier accounts when WebSocket subscription count exceeds 500 per client.',
    impactScore: 78,
    rootCauseCandidate: 'Incomplete memory garbage collection in rate-limiter middleware'
  },
  {
    id: 'SEC-119',
    title: 'JWT Secret Rotation key mismatch during automated blue/green deployment',
    priority: 'P1 - Critical',
    status: 'In Progress',
    assignee: {
      name: 'Sophia Taylor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      team: 'Team B (Payments & Gateway)'
    },
    component: 'auth-service',
    created: '2026-08-01 22:05',
    description: 'Green deployment pods reject valid bearer tokens signed by Blue deployment pods during 10-minute rolling migration window.',
    impactScore: 82,
    rootCauseCandidate: 'K8s Secret sync delay across AWS US-East and EU-West regions'
  },
  {
    id: 'DB-601',
    title: 'PostgreSQL connection queue maxed out on User-Profile service',
    priority: 'P2 - Major',
    status: 'Open',
    assignee: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      team: 'Team A (Platform Auth)'
    },
    component: 'user-service',
    created: '2026-08-02 08:30',
    description: 'Unindexed query on user_preferences table triggering sequential scans during login user session enrichment.',
    impactScore: 65
  }
];

export const MOCK_PULL_REQUESTS: PullRequest[] = [
  {
    id: '#1042',
    title: 'feat(auth): Upgrade Redis client to v4 with connection pooling optimization',
    author: {
      name: 'Alex Rivera',
      handle: 'arivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    repo: 'ops-copilot/auth-service',
    status: 'merged',
    mergedAt: 'Yesterday at 16:40',
    additions: 342,
    deletions: 118,
    summary: 'Refactored connection pooling logic, updated retry backoff strategy, and added Prometheus counters for idle connections.',
    linkedJira: 'AUTH-402',
    ciStatus: 'failed'
  },
  {
    id: '#1045',
    title: 'fix(pay): Implement Redis lock watchdog for Stripe idempotency keys',
    author: {
      name: 'Elena Rostova',
      handle: 'erostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    },
    repo: 'ops-copilot/payment-gateway',
    status: 'merged',
    mergedAt: 'Yesterday at 21:15',
    additions: 89,
    deletions: 24,
    summary: 'Extends lock TTL dynamically while webhook execution runs to prevent race conditions during DB latency spikes.',
    linkedJira: 'PAY-891',
    ciStatus: 'success'
  },
  {
    id: '#1048',
    title: 'refactor(gateway): Streamline GraphQL query depth validation middleware',
    author: {
      name: 'Marcus Chen',
      handle: 'mchen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    repo: 'ops-copilot/api-gateway',
    status: 'open',
    additions: 156,
    deletions: 72,
    summary: 'Adds maximum depth check (limit=8) to guard against nested recursive user queries causing memory overhead.',
    linkedJira: 'API-304',
    ciStatus: 'success'
  },
  {
    id: '#1050',
    title: 'chore(config): Update AWS Secrets Manager sync intervals in Helm charts',
    author: {
      name: 'Sophia Taylor',
      handle: 'staylor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    repo: 'ops-copilot/k8s-infrastructure',
    status: 'merged',
    mergedAt: 'Yesterday at 11:05',
    additions: 45,
    deletions: 12,
    summary: 'Reduced secret polling interval from 15m to 30s for zero-downtime key rotation compliance.',
    linkedJira: 'SEC-119',
    ciStatus: 'success'
  }
];

export const MOCK_COMMITS: CommitActivity[] = [
  {
    hash: 'a8f9c1d',
    message: 'fix(redis): patch idle connection timeout bug in pooling mechanism',
    author: 'Alex Rivera',
    repo: 'auth-service',
    timestamp: 'Yesterday 23:14'
  },
  {
    hash: 'c4e2b0a',
    message: 'test(payment): add unit tests for idempotency lock extension',
    author: 'Elena Rostova',
    repo: 'payment-gateway',
    timestamp: 'Yesterday 20:50'
  },
  {
    hash: 'f91d8e3',
    message: 'ci(github): add automated canary deployment checks in GitHub Actions',
    author: 'DevOps Bot',
    repo: 'k8s-infrastructure',
    timestamp: 'Yesterday 18:30'
  }
];

export const MOCK_MICROSERVICES: MicroserviceHealth[] = [
  {
    name: 'auth-service',
    status: 'critical',
    errorRate: 6.42,
    previousErrorRate: 0.12,
    p99LatencyMs: 2450,
    requestsPerSec: 1420,
    activeIncidents: 2,
    recentDeploy: 'Yesterday 16:40 (v2.14.0)'
  },
  {
    name: 'payment-gateway',
    status: 'degraded',
    errorRate: 2.85,
    previousErrorRate: 0.05,
    p99LatencyMs: 1120,
    requestsPerSec: 850,
    activeIncidents: 1,
    recentDeploy: 'Yesterday 21:15 (v1.8.4)'
  },
  {
    name: 'api-gateway',
    status: 'degraded',
    errorRate: 1.15,
    previousErrorRate: 0.08,
    p99LatencyMs: 480,
    requestsPerSec: 4200,
    activeIncidents: 1,
    recentDeploy: '3 days ago (v4.2.1)'
  },
  {
    name: 'user-service',
    status: 'healthy',
    errorRate: 0.04,
    previousErrorRate: 0.03,
    p99LatencyMs: 85,
    requestsPerSec: 940,
    activeIncidents: 0,
    recentDeploy: '5 days ago (v1.12.0)'
  },
  {
    name: 'notification-worker',
    status: 'healthy',
    errorRate: 0.01,
    previousErrorRate: 0.01,
    p99LatencyMs: 42,
    requestsPerSec: 310,
    activeIncidents: 0,
    recentDeploy: '1 week ago (v3.0.1)'
  }
];

export const MOCK_LOGS: LogEntry[] = [
  {
    id: 'log-9001',
    timestamp: '2026-08-02 21:45:12.102',
    service: 'auth-service',
    level: 'FATAL',
    message: 'RedisConnectionPoolExhaustedException: Connection pool reached limit [maxConnections=50]. All sockets leased.',
    stackTrace: 'at RedisPoolManager.acquire (RedisPoolManager.ts:142)\n at OAuthTokenService.exchangeRefreshToken (OAuthTokenService.ts:88)\n at AuthController.handleTokenRefresh (AuthController.ts:34)',
    traceId: 'tr-9942a-881c'
  },
  {
    id: 'log-9002',
    timestamp: '2026-08-02 21:44:50.884',
    service: 'auth-service',
    level: 'ERROR',
    message: 'HTTP 504 Gateway Timeout upstream call /oauth/token duration=5002ms',
    traceId: 'tr-8831f-0012'
  },
  {
    id: 'log-9003',
    timestamp: '2026-08-02 21:42:10.551',
    service: 'payment-gateway',
    level: 'ERROR',
    message: 'IdempotencyLockAcquisitionTimeout: Failed to acquire distributed lock for idempotency_key=evt_charge_99182 within 200ms',
    stackTrace: 'at Redlock.acquire (redlock.js:104)\n at CheckoutProcessor.processWebhook (CheckoutProcessor.ts:67)',
    traceId: 'tr-7719b-4491'
  },
  {
    id: 'log-9004',
    timestamp: '2026-08-02 21:40:02.320',
    service: 'api-gateway',
    level: 'WARN',
    message: 'Client rate limit warning: IP 198.51.100.44 triggered 429 Too Many Requests bucket size=1000',
    traceId: 'tr-6620c-1120'
  },
  {
    id: 'log-9005',
    timestamp: '2026-08-02 21:38:14.992',
    service: 'auth-service',
    level: 'ERROR',
    message: 'JWT validation failed: KeyId mismatch kid=prod-green-2026 expected kid=prod-blue-2026',
    traceId: 'tr-5511d-3381'
  }
];

export const MOCK_RAG_DOCS: RAGDocument[] = [
  {
    id: 'RCA-2025-09',
    title: 'Postmortem: Redis Connection Pool Exhaustion in Auth Microservices',
    category: 'Postmortem (RCA)',
    similarityScore: 0.96,
    contentSnippet: 'Resolution required increasing poolSize to 200, enabling automatic idle connection reaping after 5000ms, and updating node-redis client retry strategy to exponential backoff with jitter.',
    lastUpdated: '2025-11-14',
    author: 'SRE Team',
    tags: ['redis', 'auth-service', 'connection-pool', 'timeout', '504']
  },
  {
    id: 'SOP-88',
    title: 'Runbook: Resolving High 504 Timeouts in API Gateway & Auth Pods',
    category: 'SOP Runbook',
    similarityScore: 0.91,
    contentSnippet: 'Step 1: Check Prometheus metrics `redis_connected_clients`. Step 2: Scale auth-service deployment (`kubectl scale deployment auth-service --replicas=12`). Step 3: Trigger graceful pod restart.',
    lastUpdated: '2026-01-20',
    author: 'Platform Ops',
    tags: ['runbook', 'kubernetes', 'scaling', '504', 'auth-service']
  },
  {
    id: 'SOP-104',
    title: 'Stripe Webhook Idempotency & Distributed Locking Guidelines',
    category: 'SOP Runbook',
    similarityScore: 0.88,
    contentSnippet: 'All payment webhook consumers must enforce a minimum Redlock TTL of 3000ms with heartbeat extension enabled. Single-node Redis locks are strictly forbidden in production.',
    lastUpdated: '2026-03-05',
    author: 'Payments Arch Guild',
    tags: ['stripe', 'payment-gateway', 'redlock', 'idempotency']
  },
  {
    id: 'ARCH-04',
    title: 'Multi-Region Blue/Green Secret Rotation Protocol',
    category: 'Architecture Doc',
    similarityScore: 0.84,
    contentSnippet: 'During active key rotation, verification services MUST attempt signature validation against dual key-vault sets (active_key AND previous_key) during the 1-hour propagation window.',
    lastUpdated: '2026-04-12',
    author: 'Security Architecture',
    tags: ['jwt', 'secrets-manager', 'rotation', 'auth-service']
  }
];

export const MOCK_MCP_TOOLS: MCPToolDefinition[] = [
  {
    id: 'mcp-jira-search',
    server: 'jira-mcp-server',
    name: 'jira_search_issues',
    description: 'Searches Jira for issues matching JQL queries, team assignments, or priority levels.',
    category: 'Jira',
    parameters: [
      { name: 'team', type: 'string', description: 'Team name e.g. "Team A"', required: true },
      { name: 'priority', type: 'string', description: 'Filter by priority e.g. "P0", "P1"', required: false },
      { name: 'status', type: 'string', description: 'Filter by status e.g. "Open", "In Progress"', required: false }
    ]
  },
  {
    id: 'mcp-github-prs',
    server: 'github-mcp-server',
    name: 'github_get_recent_prs',
    description: 'Fetches merged, open, and recently updated pull requests across enterprise repositories.',
    category: 'GitHub',
    parameters: [
      { name: 'timeframe', type: 'string', description: 'Timeframe filter e.g. "yesterday", "last_24h"', required: true },
      { name: 'status', type: 'string', description: 'Filter by PR status e.g. "merged", "open"', required: false }
    ]
  },
  {
    id: 'mcp-telemetry-metrics',
    server: 'datadog-mcp-server',
    name: 'datadog_query_error_rates',
    description: 'Queries APM metrics and error rates for microservices across production clusters.',
    category: 'Telemetry',
    parameters: [
      { name: 'threshold', type: 'number', description: 'Minimum error rate percentage threshold (e.g. 1.0)', required: true },
      { name: 'timeWindow', type: 'string', description: 'Aggregation window e.g. "24h"', required: false }
    ]
  },
  {
    id: 'mcp-rag-vector-search',
    server: 'rag-knowledge-server',
    name: 'vector_search_docs',
    description: 'Performs semantic vector search across postmortems, SOP runbooks, and architecture docs.',
    category: 'RAG',
    parameters: [
      { name: 'query', type: 'string', description: 'Natural language search query', required: true },
      { name: 'topK', type: 'number', description: 'Number of top results to return (default 4)', required: false }
    ]
  },
  {
    id: 'mcp-slack-notify',
    server: 'slack-mcp-server',
    name: 'post_slack_status_update',
    description: 'Posts formatted markdown status updates and incident summaries to designated team channels.',
    category: 'Actions',
    parameters: [
      { name: 'channel', type: 'string', description: 'Target Slack channel e.g. "#ops-engineering-leads"', required: true },
      { name: 'message', type: 'string', description: 'Markdown formatted report text', required: true }
    ]
  },
  {
    id: 'mcp-k8s-autoscale',
    server: 'k8s-mcp-server',
    name: 'k8s_trigger_mitigation',
    description: 'Executes automated remediation scripts (scale replicas, trigger pod restart, dynamic rate limiting).',
    category: 'Actions',
    parameters: [
      { name: 'service', type: 'string', description: 'Target microservice deployment name', required: true },
      { name: 'action', type: 'string', description: 'Action type e.g. "scale_replicas", "restart_pods"', required: true }
    ]
  }
];
