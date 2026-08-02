import React, { useState } from 'react';
import {
  Bot,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Send,
  Sparkles,
  RefreshCw,
  Terminal,
  KanbanSquare,
  GitPullRequest,
  Activity,
  ArrowRight,
  ShieldAlert,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  CopilotOrchestrator,
  MANAGER_DEFAULT_PROMPT
} from '../services/copilotEngine';
import { AgentExecutionStep, StatusReport } from '../types';

export const CopilotView: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(MANAGER_DEFAULT_PROMPT);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionSteps, setExecutionSteps] = useState<AgentExecutionStep[]>([]);
  const [generatedReport, setGeneratedReport] = useState<StatusReport | null>(null);
  const [activeReportTab, setActiveReportTab] = useState<'overview' | 'jira' | 'github' | 'telemetry' | 'actions' | 'slack'>('overview');
  const [copiedSlack, setCopiedSlack] = useState<boolean>(false);
  const [executedActions, setExecutedActions] = useState<Record<string, boolean>>({});

  const handleRunOrchestration = async () => {
    setIsRunning(true);
    setExecutionSteps([]);
    setGeneratedReport(null);

    const orchestrator = new CopilotOrchestrator();
    await orchestrator.runOrchestration(prompt, {
      onStepUpdate: (updatedStep) => {
        setExecutionSteps((prev) => {
          const index = prev.findIndex((s) => s.id === updatedStep.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = updatedStep;
            return next;
          }
          return [...prev, updatedStep];
        });
      },
      onReportComplete: (report) => {
        setGeneratedReport(report);
        setIsRunning(false);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // fallback if confetti canvas fails
        }
      }
    });
  };

  const handleActionTrigger = (actionId: string, actionName: string) => {
    setExecutedActions((prev) => ({ ...prev, [actionId]: true }));
    alert(`⚡ Executed Automated Action: "${actionName}"\nStatus: Triggered successfully via MCP Action Agent.`);
  };

  const handleCopySlack = () => {
    if (!generatedReport) return;
    navigator.clipboard.writeText(generatedReport.slackDraft);
    setCopiedSlack(true);
    setTimeout(() => setCopiedSlack(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(19, 27, 46, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '1px solid var(--border-glow)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Sparkles className="w-4 h-4" />
              <span>Multi-Agent Executive Operations Assistant</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', color: 'var(--text-primary)' }}>
              Enterprise Operations Copilot
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px', maxWidth: '800px' }}>
              Autonomous multi-agent engine integrating Jira, GitHub, Telemetry, RAG Vector Search, and MCP Tools to orchestrate incident diagnosis and executive status updates.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-secondary"
              onClick={() => setPrompt(MANAGER_DEFAULT_PROMPT)}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Manager Request</span>
            </button>
          </div>
        </div>

        {/* Prompt Input Box */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Terminal style={{
              position: 'absolute',
              left: '14px',
              top: '16px',
              width: '18px',
              height: '18px',
              color: 'var(--accent-blue)'
            }} />
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Copilot e.g. Show Team A bugs, summarize yesterday GitHub PRs..."
              style={{
                width: '100%',
                backgroundColor: '#060911',
                border: '1px solid var(--border-highlight)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px 12px 42px',
                fontSize: '13.5px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <button
            className="btn-primary"
            disabled={isRunning || !prompt.trim()}
            onClick={handleRunOrchestration}
            style={{ minWidth: '180px' }}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 spin-icon" />
                <span>Orchestrating...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Agent Flow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Execution Timeline (Live Agent Reasoning & Tool Calls) */}
      {executionSteps.length > 0 && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot className="w-5 h-5 text-purple-400" />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Live Orchestration Trace (MCP Protocol)</h3>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {executionSteps.filter((s) => s.status === 'completed').length} / {executionSteps.length} Steps Completed
            </div>
          </div>

          <div className="step-timeline">
            {executionSteps.map((step) => (
              <div
                key={step.id}
                className={`step-card ${step.status}`}
              >
                <div className="step-header">
                  <div className="step-agent">
                    <span style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: step.status === 'completed' ? 'var(--accent-green)' : step.status === 'running' ? 'var(--accent-blue)' : 'var(--text-muted)'
                    }} />
                    <span>Step {step.stepNumber}: {step.agentName}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {step.durationMs && <span>{step.durationMs}ms</span>}
                    <span>{step.timestamp}</span>
                  </div>
                </div>

                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.description}</div>

                {/* Show tool call parameters if present */}
                {step.toolCall && (
                  <div className="code-block" style={{ marginTop: '6px', fontSize: '11.5px', padding: '8px 12px' }}>
                    <span style={{ color: 'var(--accent-purple)' }}>[MCP Invocation]</span> {step.toolCall.mcpServer} → <strong>{step.toolCall.toolName}</strong>({JSON.stringify(step.toolCall.params)})
                  </div>
                )}

                {/* Show tool result summary if completed */}
                {step.toolResult && step.status === 'completed' && (
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--accent-green)',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 12px',
                    marginTop: '4px'
                  }}>
                    ✓ Result: {JSON.stringify(step.toolResult)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Status Report View */}
      {generatedReport && (
        <div className="glass-card" style={{ border: '1px solid var(--border-glow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)', fontSize: '12px', fontWeight: 700 }}>
                <CheckCircle2 className="w-4 h-4" />
                <span>REPORT GENERATED AT {generatedReport.generatedAt}</span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>
                Executive Engineering Status Update
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-secondary" onClick={handleCopySlack}>
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSlack ? 'Copied to Clipboard!' : 'Copy Slack Draft'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs for Report */}
          <div className="tabs-container">
            <button
              className={`tab-button ${activeReportTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveReportTab('overview')}
            >
              <FileText className="w-4 h-4" />
              <span>Executive Briefing</span>
            </button>
            <button
              className={`tab-button ${activeReportTab === 'jira' ? 'active' : ''}`}
              onClick={() => setActiveReportTab('jira')}
            >
              <KanbanSquare className="w-4 h-4" />
              <span>Team A Bugs ({generatedReport.jiraHighlights.totalHighPriority})</span>
            </button>
            <button
              className={`tab-button ${activeReportTab === 'github' ? 'active' : ''}`}
              onClick={() => setActiveReportTab('github')}
            >
              <GitPullRequest className="w-4 h-4" />
              <span>GitHub Activity ({generatedReport.githubHighlights.keyPRs.length})</span>
            </button>
            <button
              className={`tab-button ${activeReportTab === 'telemetry' ? 'active' : ''}`}
              onClick={() => setActiveReportTab('telemetry')}
            >
              <Activity className="w-4 h-4" />
              <span>Services & Telemetry ({generatedReport.serviceAlerts.highErrorServices.length})</span>
            </button>
            <button
              className={`tab-button ${activeReportTab === 'actions' ? 'active' : ''}`}
              onClick={() => setActiveReportTab('actions')}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Next Actions ({generatedReport.recommendedActions.length})</span>
            </button>
            <button
              className={`tab-button ${activeReportTab === 'slack' ? 'active' : ''}`}
              onClick={() => setActiveReportTab('slack')}
            >
              <Send className="w-4 h-4" />
              <span>Slack & Email Drafts</span>
            </button>
          </div>

          {/* TAB 1: EXECUTIVE BRIEFING */}
          {activeReportTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#EF4444', marginBottom: '8px' }}>
                  <ShieldAlert className="w-5 h-5" />
                  <span>INCIDENT SUMMARY & EXECUTIVE DIRECTIVE</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: generatedReport.executiveSummary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>

              {/* Quick Metrics Cards */}
              <div className="grid-4">
                <div className="glass-card card-accent-red" style={{ padding: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TEAM A P0/P1 BUGS</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#EF4444', margin: '4px 0' }}>
                    {generatedReport.jiraHighlights.totalHighPriority}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>2 Blockers, 2 Critical</div>
                </div>

                <div className="glass-card card-accent-blue" style={{ padding: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>YESTERDAY PRs MERGED</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#3B82F6', margin: '4px 0' }}>
                    {generatedReport.githubHighlights.mergedPRsCount}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Include PR #1042 Redis Client</div>
                </div>

                <div className="glass-card card-accent-red" style={{ padding: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>AUTH-SERVICE ERROR RATE</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#EF4444', margin: '4px 0' }}>
                    6.42%
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#EF4444' }}>▲ +6.30% spike post-deploy</div>
                </div>

                <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid var(--accent-purple)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>RAG RCA MATCH</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#A78BFA', margin: '8px 0' }}>
                    RCA-2025-09 (96% Match)
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Redis connection pool resolution</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JIRA BUGS */}
          {activeReportTab === 'jira' && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>
                High-Priority Jira Bugs Assigned to Team A
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {generatedReport.jiraHighlights.issues.map((issue) => (
                  <div
                    key={issue.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={`badge ${issue.priority.includes('P0') ? 'badge-p0' : 'badge-p1'}`}>
                          {issue.priority}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-blue)' }}>
                          {issue.id}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 700 }}>{issue.title}</span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                        {issue.description}
                      </div>
                      {issue.rootCauseCandidate && (
                        <div style={{ fontSize: '12px', color: 'var(--accent-amber)', marginTop: '4px', fontWeight: 600 }}>
                          🔍 Copilot Root Cause Diagnosis: {issue.rootCauseCandidate}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '180px', justifyContent: 'flex-end' }}>
                      <img
                        src={issue.assignee.avatar}
                        alt={issue.assignee.name}
                        style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                      />
                      <div style={{ fontSize: '12px' }}>
                        <div style={{ fontWeight: 600 }}>{issue.assignee.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>{issue.status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GITHUB ACTIVITY */}
          {activeReportTab === 'github' && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>
                Yesterday's GitHub Pull Request & Deployment Activity
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {generatedReport.githubHighlights.keyPRs.map((pr) => (
                  <div
                    key={pr.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={`badge ${pr.status === 'merged' ? 'badge-success' : 'badge-p2'}`}>
                          {pr.status.toUpperCase()}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-purple)' }}>
                          {pr.id}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 700 }}>{pr.title}</span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {pr.summary}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '12px' }}>
                        <span>Repo: {pr.repo}</span>
                        <span>Author: {pr.author.name}</span>
                        {pr.mergedAt && <span>Merged: {pr.mergedAt}</span>}
                      </div>
                    </div>

                    <div>
                      <span className={`badge ${pr.ciStatus === 'failed' ? 'badge-p0' : 'badge-success'}`}>
                        CI: {pr.ciStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TELEMETRY & LOGS */}
          {activeReportTab === 'telemetry' && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>
                Microservices Flagged for High Error Rates
              </h3>
              <div className="grid-3" style={{ marginBottom: '20px' }}>
                {generatedReport.serviceAlerts.highErrorServices.map((svc) => (
                  <div
                    key={svc.name}
                    className={`glass-card ${svc.status === 'critical' ? 'card-accent-red' : 'card-accent-blue'}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '16px' }}>{svc.name}</span>
                      <span className={`badge ${svc.status === 'critical' ? 'badge-critical' : 'badge-p1'}`}>
                        {svc.status.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Current Error Rate</div>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: svc.status === 'critical' ? '#EF4444' : '#F59E0B' }}>
                        {svc.errorRate}%
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        Baseline: {svc.previousErrorRate}% | p99: {svc.p99LatencyMs}ms
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Critical Log Stacktraces</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {generatedReport.serviceAlerts.topErrorLogs.map((log) => (
                  <div key={log.id} className="code-block">
                    <div style={{ color: '#EF4444', fontWeight: 700, marginBottom: '4px' }}>
                      [{log.timestamp}] [{log.service}] {log.level}: {log.message}
                    </div>
                    {log.stackTrace && (
                      <div style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>{log.stackTrace}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RECOMMENDED ACTIONS */}
          {activeReportTab === 'actions' && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>
                Copilot Recommended Next Actions & Mitigation Triggers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {generatedReport.recommendedActions.map((action) => {
                  const isDone = executedActions[action.id];
                  return (
                    <div
                      key={action.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Zap className="w-5 h-5 text-amber-400" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '14px' }}>{action.action}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Assignee: {action.owner} | Urgency: <strong style={{ color: '#EF4444' }}>{action.urgency}</strong>
                          </div>
                        </div>
                      </div>

                      <button
                        className={isDone ? 'btn-secondary' : 'btn-primary'}
                        disabled={isDone}
                        onClick={() => handleActionTrigger(action.id, action.action)}
                        style={{ fontSize: '12.5px', padding: '6px 14px' }}
                      >
                        {isDone ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Executed</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Trigger via MCP</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: SLACK / EMAIL DRAFTS */}
          {activeReportTab === 'slack' && (
            <div className="grid-2">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Slack Channel Draft (#ops-engineering-leads)</h4>
                  <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '11.5px' }} onClick={handleCopySlack}>
                    {copiedSlack ? 'Copied!' : 'Copy Slack Text'}
                  </button>
                </div>
                <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>
                  {generatedReport.slackDraft}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Executive Email Briefing Draft</h4>
                <div className="code-block" style={{ whiteSpace: 'pre-wrap' }}>
                  {generatedReport.emailDraft}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
