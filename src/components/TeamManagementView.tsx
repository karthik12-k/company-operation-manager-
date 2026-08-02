import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  Briefcase,
  Plus,
  UserPlus,
  Calendar,
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Trash2,
  Edit3,
  Bot,
  Play,
  Sparkles,
  RefreshCw,
  Copy,
  Send,
  Terminal,
  KanbanSquare,
  GitPullRequest,
  Activity,
  Layers,
  FileText
} from 'lucide-react';
import { UserAccount, Team, TeamProject, JiraIssue, AgentExecutionStep } from '../types';
import { UserProfileReportModal } from './UserProfileReportModal';

interface TeamManagementViewProps {
  currentUser: UserAccount;
  teams: Team[];
  users: UserAccount[];
  projects: TeamProject[];
  jiraIssues: JiraIssue[];
  autoRunPrompt?: string | null;
  onClearAutoRunPrompt?: () => void;
  onCreateTeam: (newTeam: Omit<Team, 'id' | 'createdDate'>) => void;
  onCreateProject: (newProject: Omit<TeamProject, 'id'>) => void;
  onAddMemberToTeam: (teamId: string, userId: string) => void;
  onRemoveMemberFromTeam: (teamId: string, userId: string) => void;
}

export interface TeamWiseReport {
  generatedAt: string;
  summary: string;
  teamsReport: {
    teamCode: string;
    teamName: string;
    teamLead: string;
    prsMergedYesterday: { id: string; title: string; repo: string }[];
    activeBugs: { id: string; title: string; priority: string }[];
    serviceStatus: string;
    keyAccomplishment: string;
  }[];
  slackDraft: string;
}

export const TEAM_REPORT_DEFAULT_PROMPT = "Give me the updates of yesterday's work across all teams.";

export const TeamManagementView: React.FC<TeamManagementViewProps> = ({
  currentUser,
  teams,
  users,
  projects,
  jiraIssues,
  autoRunPrompt,
  onClearAutoRunPrompt,
  onCreateTeam,
  onCreateProject,
  onAddMemberToTeam,
  onRemoveMemberFromTeam
}) => {
  // Modal states
  const [showCreateTeamModal, setShowCreateTeamModal] = useState<boolean>(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState<boolean>(false);
  const [selectedTeamIdForMember, setSelectedTeamIdForMember] = useState<string | null>(null);
  const [selectedUserForReport, setSelectedUserForReport] = useState<UserAccount | null>(null);

  // New Team Form State
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [newTeamCode, setNewTeamCode] = useState<string>('');
  const [newTeamDesc, setNewTeamDesc] = useState<string>('');
  const [newTeamLeaderId, setNewTeamLeaderId] = useState<string>(users[1]?.id || '');

  // New Project Form State
  const [newPrjTitle, setNewPrjTitle] = useState<string>('');
  const [newPrjDesc, setNewPrjDesc] = useState<string>('');
  const [newPrjTeamId, setNewPrjTeamId] = useState<string>(teams[0]?.id || '');
  const [newPrjDeadline, setNewPrjDeadline] = useState<string>('2026-08-25');
  const [newPrjDeliverable, setNewPrjDeliverable] = useState<string>('');
  const [newPrjPriority, setNewPrjPriority] = useState<'High' | 'Medium' | 'Critical'>('High');

  // Employee status update submission form
  const [statusUpdateText, setStatusUpdateText] = useState<string>('');
  const [statusSubmitted, setStatusSubmitted] = useState<boolean>(false);

  // Copilot Orchestrator State for Team Management
  const [copilotPrompt, setCopilotPrompt] = useState<string>(TEAM_REPORT_DEFAULT_PROMPT);
  const [isCopilotRunning, setIsCopilotRunning] = useState<boolean>(false);
  const [copilotSteps, setCopilotSteps] = useState<AgentExecutionStep[]>([]);
  const [teamWiseReport, setTeamWiseReport] = useState<TeamWiseReport | null>(null);
  const [copiedSlack, setCopiedSlack] = useState<boolean>(false);

  // Handle Team Creation
  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newTeamCode.trim()) return;
    onCreateTeam({
      name: newTeamName,
      code: newTeamCode.toUpperCase(),
      description: newTeamDesc,
      leaderId: newTeamLeaderId,
      memberIds: [newTeamLeaderId]
    });
    setNewTeamName('');
    setNewTeamCode('');
    setNewTeamDesc('');
    setShowCreateTeamModal(false);
  };

  // Handle Project Creation
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrjTitle.trim()) return;
    onCreateProject({
      title: newPrjTitle,
      description: newPrjDesc,
      teamId: newPrjTeamId,
      deadline: newPrjDeadline,
      status: 'In Progress',
      progressPercent: 10,
      keyDeliverable: newPrjDeliverable || 'Complete core deliverables',
      priority: newPrjPriority
    });
    setNewPrjTitle('');
    setNewPrjDesc('');
    setNewPrjDeliverable('');
    setShowCreateProjectModal(false);
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusUpdateText.trim()) return;
    setStatusSubmitted(true);
    setTimeout(() => {
      setStatusUpdateText('');
      setStatusSubmitted(false);
    }, 3000);
  };

  // Copilot Execution Handler for Team-Wise Report
  const handleRunTeamCopilot = async (customPrompt?: string) => {
    const targetPrompt = customPrompt || copilotPrompt;
    if (!targetPrompt.trim()) return;

    setIsCopilotRunning(true);
    setCopilotSteps([]);
    setTeamWiseReport(null);

    const stepsData: Omit<AgentExecutionStep, 'id' | 'timestamp' | 'status'>[] = [
      {
        stepNumber: 1,
        type: 'reasoning',
        agentName: 'Ops Orchestrator',
        title: 'Team-Wise Work Extraction Plan',
        description: `Analyzing intent: "${targetPrompt}". Querying yesterday PRs, commits, Jira bugs, and service health.`
      },
      {
        stepNumber: 2,
        type: 'mcp_tool_call',
        agentName: 'Jira Agent',
        title: 'Querying Team A (Platform Auth) Activity via MCP',
        description: 'Executing tool `jira_search_issues(team="Team A")` and `github_get_recent_prs(repo="auth-service")`',
        toolCall: {
          mcpServer: 'jira-mcp-server',
          toolName: 'jira_search_issues',
          params: { team: 'Team A', timeframe: 'yesterday' }
        },
        toolResult: { team: 'Team A', prsMerged: 2, openBugs: 2 }
      },
      {
        stepNumber: 3,
        type: 'mcp_tool_call',
        agentName: 'GitHub Agent',
        title: 'Querying Team B (Payments & Gateway) Activity via MCP',
        description: 'Executing tool `jira_search_issues(team="Team B")` and `github_get_recent_prs(repo="payment-gateway")`',
        toolCall: {
          mcpServer: 'github-mcp-server',
          toolName: 'github_get_recent_prs',
          params: { team: 'Team B', status: 'merged' }
        },
        toolResult: { team: 'Team B', prsMerged: 1, openPRs: 1 }
      },
      {
        stepNumber: 4,
        type: 'mcp_tool_call',
        agentName: 'Metrics Agent',
        title: 'Querying Team C (DevOps & Infra) Telemetry',
        description: 'Executing tool `datadog_query_error_rates(cluster="k8s-us-east")`',
        toolCall: {
          mcpServer: 'datadog-mcp-server',
          toolName: 'datadog_query_error_rates',
          params: { cluster: 'k8s-us-east' }
        },
        toolResult: { team: 'Team C', status: 'All K8s canary checks healthy' }
      },
      {
        stepNumber: 5,
        type: 'synthesis',
        agentName: 'Ops Orchestrator',
        title: 'Synthesizing Team-Wise Report',
        description: 'Compiling structured team-by-team status breakdown with yesterday deliverables and active blockers.'
      }
    ];

    for (let i = 0; i < stepsData.length; i++) {
      const step = stepsData[i];
      const stepId = `team-step-${i + 1}`;
      const now = new Date().toLocaleTimeString();

      setCopilotSteps((prev) => [...prev, { ...step, id: stepId, timestamp: now, status: 'running' }]);
      await new Promise((r) => setTimeout(r, 550));

      setCopilotSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, status: 'completed', durationMs: Math.floor(Math.random() * 120) + 80 } : s))
      );
      await new Promise((r) => setTimeout(r, 150));
    }

    const report: TeamWiseReport = {
      generatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      summary: `Report generated for prompt: "${targetPrompt}". Yesterday's output: 3 PRs merged, 1 PR under review, 4 active high-priority bugs.`,
      teamsReport: [
        {
          teamCode: 'TEAM-A',
          teamName: 'Team A (Platform & Auth)',
          teamLead: 'Alex Rivera',
          prsMergedYesterday: [
            { id: '#1042', title: 'feat(auth): Upgrade Redis client to v4 with pooling', repo: 'auth-service' },
            { id: '#1045', title: 'fix(pay): Implement Redis lock watchdog for Stripe keys', repo: 'payment-gateway' }
          ],
          activeBugs: [
            { id: 'AUTH-402', title: 'OAuth Token Refresher 504 Gateway Timeouts', priority: 'P0 - Blocker' },
            { id: 'PAY-891', title: 'Stripe Webhook processing race condition', priority: 'P0 - Blocker' }
          ],
          serviceStatus: '🔴 CRITICAL (auth-service 6.42% error spike)',
          keyAccomplishment: 'Merged Redis pooling optimization and identified connection pool leak root cause.'
        },
        {
          teamCode: 'TEAM-B',
          teamName: 'Team B (Payments & Gateway)',
          teamLead: 'Marcus Chen',
          prsMergedYesterday: [
            { id: '#1050', title: 'chore(config): Update AWS Secrets sync interval', repo: 'k8s-infrastructure' }
          ],
          activeBugs: [
            { id: 'API-304', title: 'Rate limiter leak on GraphQL gateway /v2/query', priority: 'P1 - Critical' },
            { id: 'SEC-119', title: 'JWT Secret Rotation key mismatch', priority: 'P1 - Critical' }
          ],
          serviceStatus: '🟡 DEGRADED (api-gateway 1.15% rate limit warning)',
          keyAccomplishment: 'Submitted GraphQL depth limit validation PR #1048 to prevent memory leaks.'
        },
        {
          teamCode: 'TEAM-C',
          teamName: 'Team C (Cloud Infra & Security)',
          teamLead: 'Sarah Jenkins',
          prsMergedYesterday: [],
          activeBugs: [],
          serviceStatus: '🟢 HEALTHY (All K8s pod canaries green)',
          keyAccomplishment: 'Reduced Secrets Manager sync interval from 15m to 30s for zero-downtime key rotation.'
        }
      ],
      slackDraft: 
`*📢 TEAM-WISE DAILY STATUS UPDATE - YESTERDAY WORK SUMMARY*

*🔹 TEAM A (Platform & Auth - Lead: @Alex Rivera)*
• *Merged PRs:* #1042 (Redis client v4 upgrade), #1045 (Stripe lock watchdog)
• *Active Bugs:* AUTH-402 (P0), PAY-891 (P0)
• *Status:* auth-service error rate at 6.42% (Hotfix pod scaling underway)

*🔹 TEAM B (Payments & Gateway - Lead: @Marcus Chen)*
• *Merged PRs:* #1050 (AWS Secrets sync interval update)
• *Active Bugs:* API-304 (P1), SEC-119 (P1)
• *Status:* API gateway depth limit PR #1048 ready for final review

*🔹 TEAM C (Cloud Infra & Security - Lead: @Sarah Jenkins)*
• *Accomplishment:* Cross-region AWS Secret sync updated to 30s
• *Status:* 🟢 All infrastructure clusters healthy`
    };

    setTeamWiseReport(report);
    setIsCopilotRunning(false);
  };

  // Auto-run trigger when autoRunPrompt changes
  useEffect(() => {
    if (autoRunPrompt) {
      setCopilotPrompt(autoRunPrompt);
      handleRunTeamCopilot(autoRunPrompt);
      if (onClearAutoRunPrompt) {
        onClearAutoRunPrompt();
      }
    }
  }, [autoRunPrompt]);

  const handleCopySlackReport = () => {
    if (!teamWiseReport) return;
    navigator.clipboard.writeText(teamWiseReport.slackDraft);
    setCopiedSlack(true);
    setTimeout(() => setCopiedSlack(false), 3000);
  };

  // Filter scoped data based on role
  const userTeam = teams.find((t) => t.id === currentUser.teamId);
  const userTeamProjects = projects.filter((p) => p.teamId === currentUser.teamId);
  const userTeamMembers = users.filter((u) => u.teamId === currentUser.teamId);
  const userJiraIssues = jiraIssues.filter((j) => j.assignee.name.includes(currentUser.name.split(' ')[0]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Shield className="w-4 h-4" />
              <span>ROLE: {currentUser.role.toUpperCase()} WORKSPACE</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
              {currentUser.role === 'admin' && 'Centralized Company Team Management'}
              {currentUser.role === 'team_lead' && `${userTeam?.name || 'Team'} Operations Workspace`}
              {currentUser.role === 'employee' && `${currentUser.name}'s Personal Task Dashboard`}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginTop: '4px' }}>
              {currentUser.role === 'admin' && 'Manage teams, assign team leads, create projects, set deadlines, and monitor company-wide analytics.'}
              {currentUser.role === 'team_lead' && 'Isolated team workspace for managing team member tasks, project progress, and sprint deadlines.'}
              {currentUser.role === 'employee' && 'Isolated view displaying assigned Jira tasks, PR deliverables, project deadlines, and status updates.'}
            </p>
          </div>

          {/* Admin Action Buttons */}
          {currentUser.role === 'admin' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setShowCreateProjectModal(true)}>
                <FolderPlus className="w-4 h-4" />
                <span>Assign Project & Deadline</span>
              </button>
              <button className="btn-primary" onClick={() => setShowCreateTeamModal(true)}>
                <Plus className="w-4 h-4" />
                <span>Create New Team</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EMBEDDED TEAM COPILOT AI ORCHESTRATOR SEARCH BAR                         */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)', fontSize: '13px', fontWeight: 800 }}>
            <Bot className="w-4 h-4" />
            <span>ASK COPILOT ORCHESTRATOR FOR TEAM UPDATES</span>
          </div>

          <button
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '11.5px' }}
            onClick={() => setCopilotPrompt(TEAM_REPORT_DEFAULT_PROMPT)}
          >
            <RefreshCw className="w-3 h-3" />
            <span>Load "Yesterday's Work" Prompt</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Terminal style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: 'var(--accent-purple)'
            }} />
            <input
              type="text"
              value={copilotPrompt}
              onChange={(e) => setCopilotPrompt(e.target.value)}
              placeholder="Ask Copilot e.g. Give me the updates of yesterday's work across all teams..."
              style={{
                width: '100%',
                backgroundColor: '#060911',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px 10px 38px',
                fontSize: '13.5px',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <button
            className="btn-primary"
            disabled={isCopilotRunning || !copilotPrompt.trim()}
            onClick={() => handleRunTeamCopilot()}
            style={{ minWidth: '180px' }}
          >
            {isCopilotRunning ? (
              <>
                <RefreshCw className="w-4 h-4 spin-icon" />
                <span>Querying MCP...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Generate Team Report</span>
              </>
            )}
          </button>
        </div>

        {/* Live Steps Execution */}
        {copilotSteps.length > 0 && (
          <div className="step-timeline" style={{ marginTop: '14px' }}>
            {copilotSteps.map((step) => (
              <div key={step.id} className={`step-card ${step.status}`} style={{ padding: '10px 14px' }}>
                <div className="step-header">
                  <span className="step-agent" style={{ fontSize: '11px' }}>{step.agentName}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{step.timestamp}</span>
                </div>
                <div className="step-title" style={{ fontSize: '13px' }}>{step.title}</div>
                <div className="step-desc" style={{ fontSize: '12px' }}>{step.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Team-Wise Report Result Render */}
        {teamWiseReport && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ color: 'var(--accent-green)', fontWeight: 800, fontSize: '11px' }}>
                  ✓ GENERATED AT {teamWiseReport.generatedAt}
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Team-Wise Yesterday Work Report</h3>
              </div>

              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={handleCopySlackReport}>
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSlack ? 'Copied to Clipboard!' : 'Copy Slack Summary'}</span>
              </button>
            </div>

            <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
              {teamWiseReport.summary}
            </div>

            <div className="grid-3">
              {teamWiseReport.teamsReport.map((tReport) => (
                <div key={tReport.teamCode} className="glass-card" style={{ background: 'rgba(14, 19, 34, 0.9)', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-p2" style={{ fontSize: '10px' }}>{tReport.teamCode}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lead: @{tReport.teamLead}</span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '8px' }}>{tReport.teamName}</h4>

                  {/* Merged PRs */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-green)' }}>YESTERDAY PRs MERGED</div>
                    {tReport.prsMergedYesterday.length > 0 ? (
                      tReport.prsMergedYesterday.map((pr) => (
                        <div key={pr.id} style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '2px' }}>
                          <strong style={{ color: 'var(--accent-purple)' }}>{pr.id}</strong> {pr.title}
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>No PRs merged yesterday</div>
                    )}
                  </div>

                  {/* Active Bugs */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#EF4444' }}>ACTIVE TEAM BUGS</div>
                    {tReport.activeBugs.length > 0 ? (
                      tReport.activeBugs.map((bug) => (
                        <div key={bug.id} style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '2px' }}>
                          <strong style={{ color: 'var(--accent-blue)' }}>{bug.id}</strong> ({bug.priority}): {bug.title}
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Zero active bugs</div>
                    )}
                  </div>

                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                    Status: {tReport.serviceStatus}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PERSPECTIVE 1: ADMIN CENTRALIZED WORKSPACE                                */}
      {/* ========================================================================= */}
      {currentUser.role === 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Company Key Metrics */}
          <div className="grid-4">
            <div className="glass-card card-accent-blue" style={{ padding: '18px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL TEAMS</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-blue)', margin: '4px 0' }}>
                {teams.length}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>All active operational units</div>
            </div>

            <div className="glass-card card-accent-purple" style={{ padding: '18px', borderLeft: '4px solid var(--accent-purple)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE PROJECTS</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#A78BFA', margin: '4px 0' }}>
                {projects.length}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Across all 3 teams</div>
            </div>

            <div className="glass-card card-accent-blue" style={{ padding: '18px', borderLeft: '4px solid var(--accent-green)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>AVG COMPLETION RATE</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#34D399', margin: '4px 0' }}>
                {Math.round(projects.reduce((acc, p) => acc + p.progressPercent, 0) / (projects.length || 1))}%
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>On-track for Q3 deliverables</div>
            </div>

            <div className="glass-card card-accent-red" style={{ padding: '18px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>HIGH PRIORITY TASKS</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#EF4444', margin: '4px 0' }}>
                {jiraIssues.filter(i => i.priority.includes('P0') || i.priority.includes('P1')).length}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Requiring admin oversight</div>
            </div>
          </div>

          {/* Teams Grid List */}
          <div className="glass-card">
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users className="w-5 h-5 text-blue-400" />
              <span>Managed Enterprise Teams & Assigned Leaders</span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 'auto' }}>
                💡 Click any engineer profile to view full work report
              </span>
            </h3>

            <div className="grid-3">
              {teams.map((team) => {
                const leader = users.find((u) => u.id === team.leaderId);
                const teamMembers = users.filter((u) => team.memberIds.includes(u.id));
                const teamPrjs = projects.filter((p) => p.teamId === team.id);

                return (
                  <div key={team.id} className="glass-card" style={{ background: 'rgba(14, 19, 34, 0.8)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge badge-success" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                        {team.code}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Created {team.createdDate}</span>
                    </div>

                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{team.name}</h4>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '6px 0 12px 0', lineHeight: '1.4' }}>
                      {team.description}
                    </p>

                    {/* Team Leader Clickable Card */}
                    <div
                      onClick={() => leader && setSelectedUserForReport(leader)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-glow)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                        cursor: 'pointer'
                      }}
                      title={`Click to view ${leader?.name}'s full work report`}
                    >
                      {leader && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={leader.avatar} alt={leader.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                            <div>
                              <div style={{ fontSize: '11px', color: 'var(--accent-purple)', fontWeight: 700 }}>TEAM LEADER (CLICK REPORT)</div>
                              <div style={{ fontSize: '12.5px', fontWeight: 700 }}>{leader.name}</div>
                            </div>
                          </div>
                          <FileText className="w-4 h-4 text-purple-400" />
                        </>
                      )}
                    </div>

                    {/* Team Projects Summary */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                        ASSIGNED PROJECTS ({teamPrjs.length})
                      </div>
                      {teamPrjs.map((p) => (
                        <div key={p.id} style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed var(--border-subtle)' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.title}</span>
                          <span style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>Due {p.deadline}</span>
                        </div>
                      ))}
                    </div>

                    {/* Clickable Member Avatars */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {teamMembers.map((m) => (
                          <img
                            key={m.id}
                            src={m.avatar}
                            alt={m.name}
                            title={`Click to view ${m.name}'s full work report`}
                            onClick={() => setSelectedUserForReport(m)}
                            style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--accent-purple)', cursor: 'pointer' }}
                          />
                        ))}
                      </div>

                      <button
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '11.5px' }}
                        onClick={() => setSelectedTeamIdForMember(team.id)}
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Manage Members</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERSPECTIVE 2: TEAM LEADER ISOLATED WORKSPACE                            */}
      {/* ========================================================================= */}
      {currentUser.role === 'team_lead' && userTeam && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Team Lead Overview */}
          <div className="grid-3">
            <div className="glass-card card-accent-blue">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>MY TEAM WORKFORCE</div>
              <div style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0' }}>{userTeamMembers.length} Engineers</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Lead: {currentUser.name}</div>
            </div>

            <div className="glass-card card-accent-purple" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>TEAM ACTIVE PROJECTS</div>
              <div style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0' }}>{userTeamProjects.length} Projects</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Deadlines tracked</div>
            </div>

            <div className="glass-card card-accent-red">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>OPEN TEAM BUGS</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#EF4444', margin: '4px 0' }}>
                {jiraIssues.filter(j => j.assignee.team.includes(userTeam.code.replace('-', ' '))).length} Bugs
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Assigned to team members</div>
            </div>
          </div>

          {/* Team Projects & Progress */}
          <div className="glass-card">
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>
              {userTeam.name} - Projects & Milestone Deadlines
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {userTeamProjects.map((prj) => (
                <div key={prj.id} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="badge badge-p1">{prj.priority}</span>
                        <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{prj.title}</h4>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{prj.description}</p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TARGET DEADLINE</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                        {prj.deadline}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span>Progress: {prj.keyDeliverable}</span>
                      <span style={{ fontWeight: 800, color: 'var(--accent-green)' }}>{prj.progressPercent}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${prj.progressPercent}%`, height: '100%', backgroundColor: 'var(--accent-green)' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERSPECTIVE 3: EMPLOYEE PERSONAL WORKSPACE                               */}
      {/* ========================================================================= */}
      {currentUser.role === 'employee' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Employee Personal Summary */}
          <div className="grid-3">
            <div className="glass-card card-accent-blue">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>MY ASSIGNED JIRA TASKS</div>
              <div style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0' }}>{userJiraIssues.length} Tasks</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Assigned to {currentUser.name}</div>
            </div>

            <div className="glass-card card-accent-purple" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>TEAM PROJECT DEADLINE</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-amber)', margin: '6px 0', fontFamily: 'var(--font-mono)' }}>
                {userTeamProjects[0]?.deadline || '2026-08-15'}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{userTeamProjects[0]?.title || 'OAuth2 Hardening'}</div>
            </div>

            <div className="glass-card card-accent-blue" style={{ borderLeft: '4px solid var(--accent-green)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>MY WORKSPACE TEAM</div>
              <div style={{ fontSize: '18px', fontWeight: 800, margin: '6px 0' }}>{userTeam?.name}</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Role: Senior Engineer</div>
            </div>
          </div>

          {/* Personal Task List */}
          <div className="glass-card">
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>
              My Assigned Deliverables & Jira Issues
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {userJiraIssues.map((issue) => (
                <div key={issue.id} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={`badge ${issue.priority.includes('P0') ? 'badge-p0' : 'badge-p1'}`}>{issue.priority}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-blue)' }}>{issue.id}</span>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{issue.title}</span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>{issue.description}</p>
                  </div>

                  <span className="badge badge-success">{issue.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Status Form */}
          <div className="glass-card">
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px' }}>
              Submit Progress Update to Team Leader ({userTeamMembers.find(m => m.role === 'team_lead')?.name})
            </h3>

            <form onSubmit={handleStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <textarea
                rows={3}
                value={statusUpdateText}
                onChange={(e) => setStatusUpdateText(e.target.value)}
                placeholder="Log your daily progress e.g. Completed unit tests for PR #1045, refactored connection pool..."
                style={{
                  width: '100%',
                  backgroundColor: '#060911',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  fontSize: '13.5px',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {statusSubmitted ? (
                  <span style={{ color: 'var(--accent-green)', fontSize: '13px', fontWeight: 700 }}>
                    ✓ Status update submitted to Team Lead!
                  </span>
                ) : <span />}

                <button type="submit" className="btn-primary" disabled={!statusUpdateText.trim()}>
                  Submit Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE NEW TEAM                                                 */}
      {/* ========================================================================= */}
      {showCreateTeamModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-card" style={{ width: '520px', maxWidth: '90%', border: '1px solid var(--border-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Create New Engineering Team</h3>
              <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setShowCreateTeamModal(false)}>✕</button>
            </div>

            <form onSubmit={handleTeamSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>TEAM NAME</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Team D - Data & AI Platform"
                  required
                  style={{ width: '100%', backgroundColor: '#060911', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '13.5px', color: 'var(--text-primary)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>TEAM CODE</label>
                <input
                  type="text"
                  value={newTeamCode}
                  onChange={(e) => setNewTeamCode(e.target.value)}
                  placeholder="e.g. TEAM-D"
                  required
                  style={{ width: '100%', backgroundColor: '#060911', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '13.5px', color: 'var(--text-primary)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>ASSIGN TEAM LEADER</label>
                <select
                  value={newTeamLeaderId}
                  onChange={(e) => setNewTeamLeaderId(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#060911', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '13.5px', color: 'var(--text-primary)', marginTop: '4px' }}
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.title})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>TEAM DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="Focus area, responsibilities, and service ownership..."
                  style={{ width: '100%', backgroundColor: '#060911', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '13.5px', color: 'var(--text-primary)', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateTeamModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Team</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ASSIGN PROJECT & DEADLINE                                       */}
      {/* ========================================================================= */}
      {showCreateProjectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-card" style={{ width: '560px', maxWidth: '90%', border: '1px solid var(--border-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Assign New Project & Target Deadline</h3>
              <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setShowCreateProjectModal(false)}>✕</button>
            </div>

            <form onSubmit={handleProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>PROJECT TITLE</label>
                <input
                  type="text"
                  value={newPrjTitle}
                  onChange={(e) => setNewPrjTitle(e.target.value)}
                  placeholder="e.g. AI Copilot Vector Indexing Pipeline"
                  required
                  style={{ width: '100%', backgroundColor: '#060911', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '13.5px', color: 'var(--text-primary)', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>ASSIGN TO TEAM</label>
                  <select
                    value={newPrjTeamId}
                    onChange={(e) => setNewPrjTeamId(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#060911', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '13.5px', color: 'var(--text-primary)', marginTop: '4px' }}
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>TARGET DEADLINE</label>
                  <input
                    type="date"
                    value={newPrjDeadline}
                    onChange={(e) => setNewPrjDeadline(e.target.value)}
                    required
                    style={{ width: '100%', backgroundColor: '#060911', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '13.5px', color: 'var(--text-primary)', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>KEY DELIVERABLE / DEFINITION OF DONE</label>
                <input
                  type="text"
                  value={newPrjDeliverable}
                  onChange={(e) => setNewPrjDeliverable(e.target.value)}
                  placeholder="e.g. Sub-100ms vector search latency across 50k RCA docs"
                  style={{ width: '100%', backgroundColor: '#060911', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '13.5px', color: 'var(--text-primary)', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateProjectModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Assign Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: MEMBER MANAGER                                                 */}
      {/* ========================================================================= */}
      {selectedTeamIdForMember && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-card" style={{ width: '560px', maxWidth: '90%', border: '1px solid var(--border-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Manage Team Members</h3>
              <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setSelectedTeamIdForMember(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {users.map((usr) => {
                const isMember = usr.teamId === selectedTeamIdForMember;
                return (
                  <div key={usr.id} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={usr.avatar} alt={usr.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{usr.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{usr.title} • ({usr.role})</div>
                      </div>
                    </div>

                    {isMember ? (
                      <button
                        className="btn-secondary"
                        style={{ color: '#EF4444', padding: '4px 10px', fontSize: '11.5px' }}
                        onClick={() => onRemoveMemberFromTeam(selectedTeamIdForMember, usr.id)}
                      >
                        Remove from Team
                      </button>
                    ) : (
                      <button
                        className="btn-primary"
                        style={{ padding: '4px 10px', fontSize: '11.5px' }}
                        onClick={() => onAddMemberToTeam(selectedTeamIdForMember, usr.id)}
                      >
                        Add to Team
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: INDIVIDUAL ENGINEER WORK & PERFORMANCE REPORT                   */}
      {/* ========================================================================= */}
      {selectedUserForReport && (
        <UserProfileReportModal
          user={selectedUserForReport}
          onClose={() => setSelectedUserForReport(null)}
        />
      )}
    </div>
  );
};
