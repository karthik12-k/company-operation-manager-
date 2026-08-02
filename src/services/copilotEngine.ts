import {
  AgentExecutionStep,
  StatusReport,
  JiraIssue,
  PullRequest,
  MicroserviceHealth,
  LogEntry
} from '../types';
import {
  MOCK_JIRA_ISSUES,
  MOCK_PULL_REQUESTS,
  MOCK_MICROSERVICES,
  MOCK_LOGS,
  MOCK_RAG_DOCS
} from '../data/mockData';

export interface ExecutionCallback {
  onStepUpdate: (step: AgentExecutionStep) => void;
  onReportComplete: (report: StatusReport) => void;
}

export const MANAGER_DEFAULT_PROMPT = 
  "Show me all high-priority bugs assigned to Team A, summarize yesterday's GitHub activity, identify services with high error rates, and draft a status update.";

export class CopilotOrchestrator {
  private isExecuting = false;

  public async runOrchestration(
    userPrompt: string,
    callbacks: ExecutionCallback
  ): Promise<void> {
    if (this.isExecuting) return;
    this.isExecuting = true;

    // Filter Team A High Priority Bugs
    const teamABugs = MOCK_JIRA_ISSUES.filter(
      (issue) => issue.assignee.team.includes('Team A') && (issue.priority.includes('P0') || issue.priority.includes('P1'))
    );

    // Filter Yesterday's PRs
    const yesterdayPRs = MOCK_PULL_REQUESTS;

    // Filter High Error Microservices (> 1.0%)
    const highErrorServices = MOCK_MICROSERVICES.filter((svc) => svc.errorRate > 1.0);

    // Relevant Error Logs
    const criticalLogs = MOCK_LOGS.filter((l) => l.level === 'ERROR' || l.level === 'FATAL');

    // Define multi-step workflow execution steps
    const executionSteps: Omit<AgentExecutionStep, 'id' | 'timestamp' | 'status'>[] = [
      {
        stepNumber: 1,
        type: 'reasoning',
        agentName: 'Ops Orchestrator',
        title: 'Intent Parsing & Plan Construction',
        description: 'Analyzing query intent: [1] Team A High-Priority Jira Bugs, [2] Yesterday GitHub PRs & Commits, [3] High Error Rate Microservices, [4] Synthesize Executive Status Update.'
      },
      {
        stepNumber: 2,
        type: 'mcp_tool_call',
        agentName: 'Jira Agent',
        title: 'Querying Jira API via MCP Server',
        description: 'Executing tool `jira_search_issues(team="Team A", priority="P0,P1")`',
        toolCall: {
          mcpServer: 'jira-mcp-server',
          toolName: 'jira_search_issues',
          params: { team: 'Team A', priority_in: ['P0 - Blocker', 'P1 - Critical'] }
        },
        toolResult: {
          count: teamABugs.length,
          issues: teamABugs.map(b => ({ id: b.id, title: b.title, assignee: b.assignee.name, priority: b.priority }))
        }
      },
      {
        stepNumber: 3,
        type: 'mcp_tool_call',
        agentName: 'GitHub Agent',
        title: 'Fetching Yesterday GitHub Activity via MCP Server',
        description: 'Executing tool `github_get_recent_prs(timeframe="yesterday")`',
        toolCall: {
          mcpServer: 'github-mcp-server',
          toolName: 'github_get_recent_prs',
          params: { timeframe: 'yesterday', repos: ['auth-service', 'payment-gateway', 'api-gateway'] }
        },
        toolResult: {
          totalPRsMerged: yesterdayPRs.filter(p => p.status === 'merged').length,
          prs: yesterdayPRs.map(p => ({ id: p.id, title: p.title, repo: p.repo, ciStatus: p.ciStatus }))
        }
      },
      {
        stepNumber: 4,
        type: 'mcp_tool_call',
        agentName: 'Metrics Agent',
        title: 'Analyzing Microservice Telemetry & APM via Datadog MCP',
        description: 'Executing tool `datadog_query_error_rates(threshold=1.0)`',
        toolCall: {
          mcpServer: 'datadog-mcp-server',
          toolName: 'datadog_query_error_rates',
          params: { error_threshold_percent: 1.0, lookback: '24h' }
        },
        toolResult: {
          flaggedServices: highErrorServices.map(s => ({ service: s.name, errorRate: `${s.errorRate}%`, status: s.status }))
        }
      },
      {
        stepNumber: 5,
        type: 'mcp_tool_call',
        agentName: 'RAG Agent',
        title: 'Semantic Retrieval of Postmortems & SOPs',
        description: 'Executing tool `vector_search_docs(query="auth-service 504 gateway timeout redis connection pool")`',
        toolCall: {
          mcpServer: 'rag-knowledge-server',
          toolName: 'vector_search_docs',
          params: { query: 'Redis pool exhaustion 504 timeout auth-service', topK: 2 }
        },
        toolResult: {
          matchedDocs: MOCK_RAG_DOCS.slice(0, 2).map(d => ({ title: d.title, score: d.similarityScore, snippet: d.contentSnippet }))
        }
      },
      {
        stepNumber: 6,
        type: 'synthesis',
        agentName: 'Ops Orchestrator',
        title: 'Executive Report Synthesis & Action Drafting',
        description: 'Correlating high error rates in auth-service with yesterday PR #1042 merge. Drafting comprehensive executive status report with recommended mitigation steps.'
      }
    ];

    // Simulate real-time streaming execution
    for (let i = 0; i < executionSteps.length; i++) {
      const stepData = executionSteps[i];
      const stepId = `step-${i + 1}-${Date.now()}`;
      const now = new Date().toLocaleTimeString();

      // Emit running step
      callbacks.onStepUpdate({
        ...stepData,
        id: stepId,
        timestamp: now,
        status: 'running'
      });

      // Artificial realistic delay for tool execution feel
      await new Promise((res) => setTimeout(res, 750));

      // Emit completed step
      callbacks.onStepUpdate({
        ...stepData,
        id: stepId,
        timestamp: now,
        status: 'completed',
        durationMs: Math.floor(Math.random() * 200) + 120
      });

      await new Promise((res) => setTimeout(res, 250));
    }

    // Generate Final Executive Status Report
    const finalReport: StatusReport = {
      id: `report-${Date.now()}`,
      generatedAt: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      executiveSummary: 
        `🚨 **Critical Operations Summary**: Team A currently has **${teamABugs.length} high-priority bugs** (2 P0 Blockers, 2 P1 Criticals). The primary active incident is an error spike in **auth-service (6.42% error rate, up from 0.12%)** and **payment-gateway (2.85%)**. Diagnosis indicates a Redis connection pool leak in PR #1042 merged yesterday at 16:40. Action is required to scale auth-service pods and apply connection pool patch.`,
      jiraHighlights: {
        totalHighPriority: teamABugs.length,
        teamName: 'Team A (Platform & Core)',
        issues: teamABugs
      },
      githubHighlights: {
        mergedPRsCount: yesterdayPRs.filter((p) => p.status === 'merged').length,
        openPRsCount: yesterdayPRs.filter((p) => p.status === 'open').length,
        keyPRs: yesterdayPRs
      },
      serviceAlerts: {
        highErrorServices: highErrorServices,
        topErrorLogs: criticalLogs
      },
      recommendedActions: [
        {
          id: 'act-1',
          action: 'Scale auth-service replicas from 4 to 12 & trigger pod restart to reset stale connection pools',
          owner: 'Alex Rivera',
          urgency: 'Immediate',
          type: 'rollback'
        },
        {
          id: 'act-2',
          action: 'Apply Redis lock TTL extension patch for payment-gateway idempotency key race condition',
          owner: 'Elena Rostova',
          urgency: 'Immediate',
          type: 'jira_ticket'
        },
        {
          id: 'act-3',
          action: 'Merge GraphQL depth validation PR #1048 to stop rate-limiter leak on /v2/query',
          owner: 'Marcus Chen',
          urgency: 'High',
          type: 'runbook_exec'
        },
        {
          id: 'act-4',
          action: 'Publish status update report to #ops-engineering-leads Slack channel',
          owner: 'Copilot Orchestrator',
          urgency: 'Immediate',
          type: 'slack_notification'
        }
      ],
      slackDraft: 
`*📢 DAILY ENGINEERING STATUS UPDATE - TEAM A & INFRA*
*Generated by Enterprise AI Ops Copilot*

*🔴 High Priority Incidents & Bugs:*
• *AUTH-402* (P0): Redis pool exhaustion in auth-service (Error rate: 6.42%, p99: 2.45s) -> Assignee: @Alex Rivera
• *PAY-891* (P0): Stripe webhook idempotency race condition -> Assignee: @Elena Rostova
• *SEC-119* (P1): JWT Key mismatch during blue/green rotation -> Assignee: @Sophia Taylor

*🐙 Yesterday's GitHub Activity:*
• 3 PRs Merged (#1042 auth-service Redis upgrade, #1045 payment lock TTL, #1050 secret sync)
• 1 Open PR (#1048 GraphQL query depth limit)

*⚡ Immediate Actions Underway:*
1. Auto-scaling auth-service pods & applying Redis pool hotfix
2. Extending Redlock TTL on payment-gateway
3. Syncing cross-region AWS Secrets Manager keys for JWT rotation`,

      emailDraft:
`Subject: [Executive Briefing] Team A Status Update, High-Priority Incidents & GitHub Activity Summary

Dear Engineering Management Team,

Here is the operational status update compiled by the Enterprise AI Operations Copilot:

1. TEAM A HIGH-PRIORITY BUGS
- Total Active P0/P1 Issues: 4
- Primary Blocker: AUTH-402 (OAuth token refresher 504 timeouts). 
- Root Cause: Connection pool leak identified following PR #1042 merge yesterday.

2. SERVICE HEALTH ALERT
- auth-service: Error rate spiked from 0.12% to 6.42% (Status: CRITICAL)
- payment-gateway: Error rate at 2.85% (Status: DEGRADED)
- api-gateway: Error rate at 1.15% (Status: DEGRADED)

3. YESTERDAY'S GITHUB SUMMARY
- Merged PR #1042 (Redis client upgrade - candidate cause of AUTH-402)
- Merged PR #1045 (Stripe idempotency lock watchdog fix)
- Merged PR #1050 (AWS Secrets rotation interval update)

4. NEXT STEPS & MITIGATION
- Engineering is scaling auth-service replicas and deploying emergency patch (ETA 20 mins).
- Full postmortem will follow under RCA-2026-08.

Best regards,
Enterprise AI Operations Copilot`
    };

    callbacks.onReportComplete(finalReport);
    this.isExecuting = false;
  }
}
