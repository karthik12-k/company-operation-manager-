export type Priority = 'P0 - Blocker' | 'P1 - Critical' | 'P2 - Major' | 'P3 - Minor';
export type IssueStatus = 'Open' | 'In Progress' | 'In Review' | 'Resolved';

export type UserRole = 'admin' | 'team_lead' | 'employee';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
  title: string;
  avatar: string;
}

export interface AdminLoginCredentials {
  email: string;
  password?: string;
  securityToken?: string;
  mfaCode?: string;
}

export interface AdminSessionState {
  isAuthenticated: boolean;
  adminUser?: UserAccount;
  sessionToken?: string;
  authenticatedAt?: string;
}

// Hackathon Winning & MNC Enterprise Suite Types
export interface SelfHealingStep {
  stepNumber: number;
  action: string;
  status: 'pending' | 'running' | 'completed';
  resultMessage: string;
}

export interface SelfHealingRemediation {
  id: string;
  targetService: string;
  triggerCause: string;
  initialErrorRate: number;
  recoveredErrorRate: number;
  status: 'idle' | 'in_progress' | 'healed';
  steps: SelfHealingStep[];
}

export interface SecurityGuardrailResult {
  piiRedactedCount: number;
  secretsMaskedCount: number;
  soc2ComplianceScore: number;
  complianceAlerts: {
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    rule: string;
    description: string;
    status: 'Flagged' | 'Mitigated';
  }[];
  sampleRawLog: string;
  sampleRedactedLog: string;
}

export interface FinOpsCostMetrics {
  totalMonthlySpend: number;
  potentialSavings: number;
  savingsApplied: boolean;
  spendByService: { service: string; cost: number; trend: string }[];
  wasteItems: {
    id: string;
    resourceName: string;
    type: string;
    monthlyCost: number;
    recommendation: string;
    applied: boolean;
  }[];
}

export interface ChaosOutageSimulation {
  id: string;
  title: string;
  targetService: string;
  errorSpikeRate: number;
  logStream: string;
  status: 'idle' | 'active_outage' | 'resolving' | 'resolved';
}

export interface TeamProject {
  id: string;
  title: string;
  description: string;
  teamId: string;
  deadline: string; // e.g. "2026-08-15"
  status: 'Planning' | 'In Progress' | 'Under Review' | 'Completed';
  progressPercent: number; // 0-100
  keyDeliverable: string;
  priority: 'High' | 'Medium' | 'Critical';
}

export interface Team {
  id: string; // e.g. "team-a"
  name: string; // e.g. "Team A - Platform & Auth"
  code: string; // e.g. "TEAM-A"
  description: string;
  leaderId: string; // UserAccount id
  memberIds: string[]; // UserAccount ids
  createdDate: string;
}

// AI Intelligence Suite Types
export interface CodeAnalysisResult {
  id: string;
  repoName: string;
  healthGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  codeCoveragePercent: number;
  techDebtHours: number;
  duplicateCodePercent: number;
  securityVulnerabilities: {
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    file: string;
    line: number;
    description: string;
    suggestedFix: string;
  }[];
  cyclomaticComplexityScore: number;
}

export interface ReleaseRiskPrediction {
  id: string;
  serviceName: string;
  version: string;
  riskScore: number; // 0-100
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  failureProbabilityPercent: number;
  candidatePRs: string[];
  riskFactors: {
    factor: string;
    impact: 'High' | 'Medium' | 'Low';
    description: string;
  }[];
  aiMitigationRecommendation: string;
}

export interface TeamHealthMetrics {
  teamId: string;
  teamName: string;
  healthScore: number; // 0-100
  burnoutRiskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  workloadBalanceScore: number; // 0-100
  prReviewVelocityHours: number;
  sprintPredictabilityPercent: number;
  overloadedEngineers: string[];
  recommendations: string[];
}

export interface TaskRedistributionPlan {
  id: string;
  overloadedEngineer: {
    id: string;
    name: string;
    avatar: string;
    currentTaskCount: number;
  };
  recommendedTargetEngineer: {
    id: string;
    name: string;
    avatar: string;
    currentTaskCount: number;
  };
  taskToReassign: {
    id: string;
    title: string;
    priority: Priority;
  };
  impactDescription: string;
}

export interface MeetingSummary {
  id: string;
  date: string;
  title: string;
  duration: string;
  attendees: string[];
  executiveSummary: string;
  blockersIdentified: string[];
  actionItems: {
    id: string;
    task: string;
    owner: string;
    deadline: string;
    completed: boolean;
  }[];
}

export interface JiraIssue {
  id: string; // e.g. "AUTH-402"
  title: string;
  priority: Priority;
  status: IssueStatus;
  assignee: {
    name: string;
    avatar: string;
    team: string;
  };
  component: string;
  created: string;
  description: string;
  impactScore: number; // 1-100
  rootCauseCandidate?: string;
}

export interface PullRequest {
  id: string; // e.g. "#1042"
  title: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  repo: string;
  status: 'merged' | 'open' | 'draft' | 'closed';
  mergedAt?: string;
  additions: number;
  deletions: number;
  summary: string;
  linkedJira?: string;
  ciStatus: 'success' | 'failed' | 'pending';
}

export interface CommitActivity {
  hash: string;
  message: string;
  author: string;
  repo: string;
  timestamp: string;
}

export interface MicroserviceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'critical';
  errorRate: number; // percentage e.g. 4.8%
  previousErrorRate: number; // e.g. 0.2%
  p99LatencyMs: number;
  requestsPerSec: number;
  activeIncidents: number;
  recentDeploy: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  service: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'FATAL';
  message: string;
  stackTrace?: string;
  traceId: string;
}

export interface RAGDocument {
  id: string;
  title: string;
  category: 'Postmortem (RCA)' | 'SOP Runbook' | 'Architecture Doc' | 'API Specs';
  similarityScore: number;
  contentSnippet: string;
  lastUpdated: string;
  author: string;
  tags: string[];
}

export interface MCPToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface MCPToolDefinition {
  id: string;
  server: string;
  name: string;
  description: string;
  parameters: MCPToolParameter[];
  category: 'Jira' | 'GitHub' | 'Telemetry' | 'RAG' | 'Actions';
}

export interface AgentExecutionStep {
  id: string;
  timestamp: string;
  stepNumber: number;
  type: 'reasoning' | 'mcp_tool_call' | 'tool_response' | 'synthesis';
  agentName: 'Ops Orchestrator' | 'Jira Agent' | 'GitHub Agent' | 'Metrics Agent' | 'RAG Agent';
  title: string;
  description: string;
  toolCall?: {
    toolName: string;
    params: Record<string, any>;
    mcpServer: string;
  };
  toolResult?: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  durationMs?: number;
}

export interface StatusReport {
  id: string;
  generatedAt: string;
  executiveSummary: string;
  jiraHighlights: {
    totalHighPriority: number;
    teamName: string;
    issues: JiraIssue[];
  };
  githubHighlights: {
    mergedPRsCount: number;
    openPRsCount: number;
    keyPRs: PullRequest[];
  };
  serviceAlerts: {
    highErrorServices: MicroserviceHealth[];
    topErrorLogs: LogEntry[];
  };
  recommendedActions: {
    id: string;
    action: string;
    owner: string;
    urgency: 'Immediate' | 'High' | 'Medium';
    type: 'jira_ticket' | 'slack_notification' | 'rollback' | 'runbook_exec';
  }[];
  slackDraft: string;
  emailDraft: string;
}
