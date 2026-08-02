import React, { useState } from 'react';
import { KanbanSquare, AlertOctagon, Filter, User, Sparkles, ExternalLink } from 'lucide-react';
import { MOCK_JIRA_ISSUES } from '../data/mockData';
import { JiraIssue } from '../types';

export const JiraDashboard: React.FC = () => {
  const [issues, setIssues] = useState<JiraIssue[]>(MOCK_JIRA_ISSUES);
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [selectedIssue, setSelectedIssue] = useState<JiraIssue | null>(null);

  const filteredIssues = issues.filter((issue) => {
    if (filterPriority === 'P0') return issue.priority.includes('P0');
    if (filterPriority === 'P1') return issue.priority.includes('P1');
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <KanbanSquare className="w-6 h-6 text-blue-500" style={{ color: '#3B82F6' }} />
            <span>Jira Operations Center - Team A</span>
          </h1>
          <p className="page-subtitle">
            High-priority bugs, root cause diagnostic candidates, and engineer assignments for Team A.
          </p>
        </div>

        {/* Priority Filter */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn-secondary ${filterPriority === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterPriority('ALL')}
          >
            All Bugs ({issues.length})
          </button>
          <button
            className={`btn-secondary ${filterPriority === 'P0' ? 'active' : ''}`}
            onClick={() => setFilterPriority('P0')}
          >
            P0 Blockers ({issues.filter(i => i.priority.includes('P0')).length})
          </button>
          <button
            className={`btn-secondary ${filterPriority === 'P1' ? 'active' : ''}`}
            onClick={() => setFilterPriority('P1')}
          >
            P1 Criticals ({issues.filter(i => i.priority.includes('P1')).length})
          </button>
        </div>
      </div>

      {/* Issues Table List */}
      <div className="glass-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              style={{
                background: 'rgba(14, 19, 34, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease'
              }}
              onClick={() => setSelectedIssue(issue)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <span className={`badge ${issue.priority.includes('P0') ? 'badge-p0' : issue.priority.includes('P1') ? 'badge-p1' : 'badge-p2'}`}>
                  {issue.priority}
                </span>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-blue)', fontSize: '13.5px' }}>
                      {issue.id}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                      {issue.title}
                    </span>
                  </div>

                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Component: <strong style={{ color: 'var(--text-primary)' }}>{issue.component}</strong> | Created: {issue.created}
                  </div>

                  {issue.rootCauseCandidate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-amber)', marginTop: '6px', fontWeight: 600 }}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Copilot AI Diagnosis: {issue.rootCauseCandidate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Assignee & Impact Score */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>IMPACT SCORE</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: issue.impactScore > 80 ? '#EF4444' : '#F59E0B' }}>
                    {issue.impactScore}/100
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px' }}>
                  <img
                    src={issue.assignee.avatar}
                    alt={issue.assignee.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                  />
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700 }}>{issue.assignee.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600 }}>{issue.status}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detail View */}
      {selectedIssue && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="glass-card" style={{ width: '640px', maxWidth: '90%', border: '1px solid var(--border-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={`badge ${selectedIssue.priority.includes('P0') ? 'badge-p0' : 'badge-p1'}`}>
                  {selectedIssue.priority}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '16px', color: 'var(--accent-blue)' }}>
                  {selectedIssue.id}
                </span>
              </div>
              <button
                className="btn-secondary"
                onClick={() => setSelectedIssue(null)}
                style={{ padding: '4px 10px' }}
              >
                ✕ Close
              </button>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>
              {selectedIssue.title}
            </h2>

            <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
              {selectedIssue.description}
            </div>

            {selectedIssue.rootCauseCandidate && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                marginBottom: '16px'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--accent-amber)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles className="w-4 h-4" />
                  <span>AI RCA Candidate</span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {selectedIssue.rootCauseCandidate}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={selectedIssue.assignee.avatar} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Assigned to {selectedIssue.assignee.name}</span>
              </div>

              <button className="btn-primary" onClick={() => alert(`Redirecting to Jira Ticket ${selectedIssue.id}...`)}>
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Jira</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
