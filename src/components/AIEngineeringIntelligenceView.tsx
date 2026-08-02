import React, { useState } from 'react';
import {
  Code,
  AlertTriangle,
  HeartPulse,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Zap,
  UserCheck,
  ArrowRight,
  Send,
  Sliders,
  TrendingDown,
  TrendingUp,
  Copy
} from 'lucide-react';
import {
  MOCK_CODE_ANALYSIS,
  MOCK_RISK_PREDICTIONS,
  MOCK_TEAM_HEALTH,
  MOCK_TASK_REDISTRIBUTION,
  MOCK_MEETING_SUMMARY
} from '../data/mockData';
import { TaskRedistributionPlan, MeetingSummary } from '../types';

interface AIEngineeringIntelligenceViewProps {
  onAutoRedistributeTask?: (plan: TaskRedistributionPlan) => void;
}

export const AIEngineeringIntelligenceView: React.FC<AIEngineeringIntelligenceViewProps> = ({
  onAutoRedistributeTask
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'risk' | 'health' | 'redistribute' | 'meeting'>('risk');
  const [redistributionPlans, setRedistributionPlans] = useState<TaskRedistributionPlan[]>(MOCK_TASK_REDISTRIBUTION);
  const [executedRedistributions, setExecutedRedistributions] = useState<Record<string, boolean>>({});
  const [meetingSummary, setMeetingSummary] = useState<MeetingSummary>(MOCK_MEETING_SUMMARY);
  const [copiedSlack, setCopiedSlack] = useState<boolean>(false);

  const handleExecuteRedistribution = (plan: TaskRedistributionPlan) => {
    setExecutedRedistributions((prev) => ({ ...prev, [plan.id]: true }));
    if (onAutoRedistributeTask) {
      onAutoRedistributeTask(plan);
    }
  };

  const handleToggleActionItem = (itemId: string) => {
    setMeetingSummary((prev) => ({
      ...prev,
      actionItems: prev.actionItems.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const handleCopyStandupSlack = () => {
    const text = `*📢 DAILY STANDUP SUMMARY - ${meetingSummary.date}*\n\n*Executive Briefing:*\n${meetingSummary.executiveSummary}\n\n*🛑 Blockers Identified:*\n${meetingSummary.blockersIdentified.map(b => `• ${b}`).join('\n')}\n\n*✅ Action Items:*\n${meetingSummary.actionItems.map(a => `${a.completed ? '✓' : '☐'} *${a.task}* (@${a.owner}) - Due ${a.deadline}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedSlack(true);
    setTimeout(() => setCopiedSlack(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Sparkles className="w-4 h-4" />
              <span>PREDICTIVE ENGINEERING INTELLIGENCE SUITE</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
              AI Engineering Intelligence Hub
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginTop: '4px' }}>
              Autonomous static code quality analysis, predictive deployment risk scoring, team health/burnout diagnostics, auto task rebalancing, and standup summarization.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Navigation Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'risk' ? 'active' : ''}`}
          onClick={() => setActiveTab('risk')}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>AI Risk Prediction</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          <Code className="w-4 h-4 text-blue-400" />
          <span>AI Code Analysis</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveTab('health')}
        >
          <HeartPulse className="w-4 h-4 text-red-400" />
          <span>AI Team Health Score</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'redistribute' ? 'active' : ''}`}
          onClick={() => setActiveTab('redistribute')}
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>AI Auto Task Redistribution</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'meeting' ? 'active' : ''}`}
          onClick={() => setActiveTab('meeting')}
        >
          <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
          <span>AI Meeting & Standup Summary</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* FEATURE 1: AI RISK PREDICTION                                             */}
      {/* ========================================================================= */}
      {activeTab === 'risk' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="grid-2">
            {MOCK_RISK_PREDICTIONS.map((risk) => (
              <div
                key={risk.id}
                className={`glass-card ${risk.riskLevel === 'CRITICAL' ? 'card-accent-red' : 'card-accent-amber'}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>SERVICE RISK EVALUATION</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{risk.serviceName}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Version: {risk.version}</div>
                  </div>

                  <span className={`badge ${risk.riskLevel === 'CRITICAL' ? 'badge-critical' : 'badge-p1'}`}>
                    {risk.riskLevel} RISK
                  </span>
                </div>

                {/* Risk Score Gauge Display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '20px 0', background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: `6px solid ${risk.riskScore > 75 ? '#EF4444' : '#F59E0B'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: risk.riskScore > 75 ? '#EF4444' : '#F59E0B' }}>
                      {risk.riskScore}
                    </span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>/100 INDEX</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Predicted Failure Probability: <strong style={{ color: '#EF4444' }}>{risk.failureProbabilityPercent}%</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Candidate PR Impact: <strong>{risk.candidatePRs.join(', ')}</strong>
                    </div>
                  </div>
                </div>

                {/* Risk Factors Breakdown */}
                <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>AI Identified Risk Factors</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  {risk.riskFactors.map((rf, idx) => (
                    <div key={idx} style={{ fontSize: '12px', background: 'rgba(0, 0, 0, 0.3)', padding: '8px 12px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>• {rf.factor}</span>
                      <span style={{ color: rf.impact === 'High' ? '#EF4444' : '#F59E0B', fontWeight: 700 }}>{rf.impact} Impact</span>
                    </div>
                  ))}
                </div>

                {/* AI Recommendation */}
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent-purple)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Automated Mitigation Recommendation</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', marginTop: '4px' }}>
                    {risk.aiMitigationRecommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 2: AI CODE ANALYSIS                                              */}
      {/* ========================================================================= */}
      {activeTab === 'code' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {MOCK_CODE_ANALYSIS.map((ca) => (
            <div key={ca.id} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-blue)', fontSize: '14px' }}>
                    {ca.repoName}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>Static Code Analysis & Tech Debt Report</h3>
                </div>

                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: ca.healthGrade === 'C' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)', border: `2px solid ${ca.healthGrade === 'C' ? '#F59E0B' : '#10B981'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, color: ca.healthGrade === 'C' ? '#F59E0B' : '#10B981' }}>
                  {ca.healthGrade}
                </div>
              </div>

              {/* Code Quality Metrics */}
              <div className="grid-4" style={{ marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CODE COVERAGE</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-blue)' }}>{ca.codeCoveragePercent}%</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ESTIMATED TECH DEBT</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-amber)' }}>{ca.techDebtHours} Hours</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DUPLICATE CODE</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{ca.duplicateCodePercent}%</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CYCLOMATIC COMPLEXITY</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#A78BFA' }}>{ca.cyclomaticComplexityScore}</div>
                </div>
              </div>

              {/* Vulnerabilities List */}
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Detected Security Vulnerabilities & Code Smells</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ca.securityVulnerabilities.map((vuln, idx) => (
                  <div key={idx} className="code-block" style={{ borderLeft: `4px solid ${vuln.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: vuln.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B', fontWeight: 800 }}>
                        [{vuln.severity}] {vuln.title}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {vuln.file}: line {vuln.line}
                      </span>
                    </div>

                    <div style={{ color: 'var(--text-secondary)', fontSize: '12.5px', margin: '4px 0' }}>
                      {vuln.description}
                    </div>

                    <div style={{ color: 'var(--accent-green)', fontSize: '12px', fontWeight: 600 }}>
                      💡 Suggested AI Fix: {vuln.suggestedFix}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 3: AI TEAM HEALTH SCORE                                           */}
      {/* ========================================================================= */}
      {activeTab === 'health' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="grid-2">
            {MOCK_TEAM_HEALTH.map((th) => (
              <div key={th.teamId} className={`glass-card ${th.burnoutRiskLevel === 'High' ? 'card-accent-red' : 'card-accent-blue'}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800 }}>{th.teamName}</h3>
                  <span className={`badge ${th.burnoutRiskLevel === 'High' ? 'badge-critical' : 'badge-success'}`}>
                    Burnout Risk: {th.burnoutRiskLevel}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '16px 0' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', border: `4px solid ${th.healthScore > 80 ? '#10B981' : '#EF4444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, color: th.healthScore > 80 ? '#10B981' : '#EF4444' }}>
                    {th.healthScore}
                  </div>

                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>Workload Balance: {th.workloadBalanceScore}/100</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      PR Review Turnaround: <strong>{th.prReviewVelocityHours} hrs</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Sprint Predictability: <strong>{th.sprintPredictabilityPercent}%</strong>
                    </div>
                  </div>
                </div>

                {th.overloadedEngineers.length > 0 && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#EF4444' }}>⚠️ Overloaded Engineer Alert</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '2px' }}>
                      {th.overloadedEngineers.join(', ')}
                    </div>
                  </div>
                )}

                <div style={{ fontSize: '12px', color: 'var(--accent-purple)', fontWeight: 600 }}>
                  💡 AI Wellness Recommendation:
                  <ul style={{ color: 'var(--text-secondary)', paddingLeft: '16px', marginTop: '4px', fontWeight: 400 }}>
                    {th.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 4: AI AUTO TASK REDISTRIBUTION                                    */}
      {/* ========================================================================= */}
      {activeTab === 'redistribute' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
              Autonomous Task Redistribution & Workload Rebalancer
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Detects engineer burnout risks, analyzes skills/capacity, and recommends intelligent 1-click task reallocations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {redistributionPlans.map((plan) => {
                const isExecuted = executedRedistributions[plan.id];

                return (
                  <div key={plan.id} style={{ background: 'rgba(14, 19, 34, 0.8)', border: '1px solid var(--border-glow)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      {/* Overloaded Engineer */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={plan.overloadedEngineer.avatar} alt={plan.overloadedEngineer.name} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #EF4444' }} />
                        <div>
                          <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: 800 }}>OVERLOADED (4 TASKS)</div>
                          <div style={{ fontSize: '15px', fontWeight: 700 }}>{plan.overloadedEngineer.name}</div>
                        </div>
                      </div>

                      <ArrowRight className="w-6 h-6 text-purple-400" />

                      {/* Task to move */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                        <span className="badge badge-p1">{plan.taskToReassign.priority}</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-blue)', marginTop: '4px' }}>
                          {plan.taskToReassign.id}
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 600, maxWidth: '280px' }}>
                          {plan.taskToReassign.title}
                        </div>
                      </div>

                      <ArrowRight className="w-6 h-6 text-purple-400" />

                      {/* Target Available Engineer */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={plan.recommendedTargetEngineer.avatar} alt={plan.recommendedTargetEngineer.name} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #10B981' }} />
                        <div>
                          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 800 }}>AVAILABLE CAPACITY (1 TASK)</div>
                          <div style={{ fontSize: '15px', fontWeight: 700 }}>{plan.recommendedTargetEngineer.name}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                        💡 Impact: {plan.impactDescription}
                      </div>

                      <button
                        className={isExecuted ? 'btn-secondary' : 'btn-primary'}
                        disabled={isExecuted}
                        onClick={() => handleExecuteRedistribution(plan)}
                      >
                        {isExecuted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Tasks Rebalanced</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            <span>Auto-Rebalance Tasks Now</span>
                          </>
                        )}
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
      {/* FEATURE 5: AI MEETING & STANDUP SUMMARIZER                                */}
      {/* ========================================================================= */}
      {activeTab === 'meeting' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                  DAILY STANDUP • {meetingSummary.date}
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>
                  {meetingSummary.title}
                </h2>
              </div>

              <button className="btn-primary" onClick={handleCopyStandupSlack}>
                <Send className="w-4 h-4" />
                <span>{copiedSlack ? 'Copied to Clipboard!' : 'Export Summary to Slack'}</span>
              </button>
            </div>

            {/* Attendees */}
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Attendees: <strong>{meetingSummary.attendees.join(' • ')}</strong>
            </div>

            {/* Executive Summary */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px', fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ fontWeight: 800, color: 'var(--accent-purple)', fontSize: '13px', marginBottom: '6px' }}>
                📝 AI EXECUTIVE STANDUP BRIEFING
              </div>
              {meetingSummary.executiveSummary}
            </div>

            {/* Blockers & Action Items */}
            <div className="grid-2">
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: '#EF4444' }}>
                  🛑 Critical Blockers Identified
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {meetingSummary.blockersIdentified.map((b, idx) => (
                    <div key={idx} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--text-primary)' }}>
                      • {b}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: 'var(--accent-green)' }}>
                  ✅ Extracted Action Items & Assignees
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {meetingSummary.actionItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleActionItem(item.id)}
                      style={{
                        background: item.completed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      <input type="checkbox" checked={item.completed} readOnly />
                      <div style={{ flex: 1, textDecoration: item.completed ? 'line-through' : 'none', opacity: item.completed ? 0.7 : 1 }}>
                        <span style={{ fontWeight: 600 }}>{item.task}</span>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Owner: @{item.owner} | Due: {item.deadline}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
