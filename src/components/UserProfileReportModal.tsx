import React, { useState } from 'react';
import { User, GitPullRequest, KanbanSquare, ShieldCheck, Activity, CheckCircle2, Copy, X, Clock, AlertTriangle } from 'lucide-react';
import { UserAccount, PullRequest, JiraIssue } from '../types';
import { MOCK_PULL_REQUESTS, MOCK_JIRA_ISSUES } from '../data/mockData';

interface UserProfileReportModalProps {
  user: UserAccount;
  onClose: () => void;
}

export const UserProfileReportModal: React.FC<UserProfileReportModalProps> = ({
  user,
  onClose
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Filter PRs authored by this user
  const userPRs = MOCK_PULL_REQUESTS.filter(
    (pr) => pr.author.name.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()) ||
            pr.author.handle.toLowerCase().includes(user.name.split(' ')[0].toLowerCase())
  );

  // Filter Jira Issues assigned to this user
  const userJiraIssues = MOCK_JIRA_ISSUES.filter(
    (issue) => issue.assignee.name.toLowerCase().includes(user.name.split(' ')[0].toLowerCase())
  );

  const handleCopySummary = () => {
    const summaryText = 
`*📊 INDIVIDUAL ENGINEER WORK REPORT - ${user.name.toUpperCase()}*
*Role:* ${user.title} (${user.role})

*🔹 YESTERDAY & RECENT PRs AUTHORED (${userPRs.length}):*
${userPRs.length > 0 ? userPRs.map(p => `• ${p.id} (${p.repo}): ${p.title} [Status: ${p.status}]`).join('\n') : '• No PRs recorded yesterday.'}

*🔹 ACTIVE ASSIGNED JIRA TICKETS (${userJiraIssues.length}):*
${userJiraIssues.length > 0 ? userJiraIssues.map(j => `• ${j.id} (${j.priority}): ${j.title} [Status: ${j.status}]`).join('\n') : '• Zero open Jira tickets.'}

*🔹 AI PRODUCTIVITY METRICS:*
• Workload Index: ${userJiraIssues.length > 3 ? 'High Workload (4+ Tasks)' : 'Balanced Workload'}
• Review Velocity: 4.2 hrs average PR turnaround`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(6, 9, 17, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 220
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '680px',
          maxWidth: '94%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-glow)',
          position: 'relative',
          padding: '24px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid var(--accent-purple)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{user.name}</h2>
                <span className={`badge ${user.role === 'admin' ? 'badge-p0' : user.role === 'team_lead' ? 'badge-p1' : 'badge-p2'}`} style={{ fontSize: '10px' }}>
                  {user.role.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {user.title} • {user.email}
              </div>
            </div>
          </div>

          <button className="btn-secondary" style={{ padding: '6px 12px' }} onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Productivity Metrics Summary Row */}
        <div className="grid-3" style={{ marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>MERGED PRS YESTERDAY</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-purple)', margin: '2px 0' }}>
              {userPRs.length} PRs
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Authored deliverables</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE ASSIGNED JIRA TICKET</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: userJiraIssues.length > 2 ? '#EF4444' : '#34D399', margin: '2px 0' }}>
              {userJiraIssues.length} Tasks
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{userJiraIssues.length > 2 ? 'High Workload Risk' : 'Optimal Capacity'}</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>PR REVIEW VELOCITY</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-blue)', margin: '2px 0' }}>
              4.2 hrs
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Turnaround speed</div>
          </div>
        </div>

        {/* SECTION 1: YESTERDAY & RECENT PULL REQUESTS */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-green)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitPullRequest className="w-4 h-4" />
            <span>Yesterday & Recent Pull Requests Authored ({userPRs.length})</span>
          </h4>

          {userPRs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {userPRs.map((pr) => (
                <div key={pr.id} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-p2" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{pr.id}</span>
                      <span style={{ fontWeight: 700, fontSize: '13.5px' }}>{pr.title}</span>
                    </div>
                    <span className={`badge ${pr.status === 'merged' ? 'badge-success' : 'badge-p1'}`}>{pr.status}</span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', margin: '4px 0' }}>
                    {pr.summary}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', paddingTop: '6px', borderTop: '1px dashed var(--border-subtle)' }}>
                    <span>Repo: <strong style={{ color: 'var(--text-primary)' }}>{pr.repo}</strong></span>
                    <span><span style={{ color: '#34D399' }}>+{pr.additions}</span> / <span style={{ color: '#EF4444' }}>-{pr.deletions}</span> lines</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              No pull requests recorded yesterday for this engineer.
            </div>
          )}
        </div>

        {/* SECTION 2: ACTIVE ASSIGNED JIRA TICKETS */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#EF4444', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <KanbanSquare className="w-4 h-4" />
            <span>Active Assigned Jira Tickets & Bugs ({userJiraIssues.length})</span>
          </h4>

          {userJiraIssues.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {userJiraIssues.map((issue) => (
                <div key={issue.id} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${issue.priority.includes('P0') ? 'badge-p0' : 'badge-p1'}`}>{issue.priority}</span>
                      <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>{issue.id}</span>
                      <span style={{ fontWeight: 700, fontSize: '13.5px' }}>{issue.title}</span>
                    </div>
                    <span className="badge badge-success">{issue.status}</span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {issue.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Zero active Jira bugs currently assigned to {user.name}.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn-secondary" onClick={handleCopySummary} style={{ fontSize: '12.5px' }}>
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copied Work Summary!' : 'Copy Individual Report'}</span>
          </button>

          <button className="btn-primary" onClick={onClose}>
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
