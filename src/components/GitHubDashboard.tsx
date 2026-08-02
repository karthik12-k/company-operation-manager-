import React from 'react';
import { GitPullRequest, GitMerge, GitCommit, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import { MOCK_PULL_REQUESTS, MOCK_COMMITS } from '../data/mockData';

export const GitHubDashboard: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <GitPullRequest className="w-6 h-6 text-emerald-400" />
            <span>GitHub Activity & Pull Request Summary</span>
          </h1>
          <p className="page-subtitle">
            Yesterday's merged code reviews, active pull requests, CI/CD pipeline runs, and commit timelines.
          </p>
        </div>
      </div>

      {/* PR Cards Grid */}
      <div className="glass-card">
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitMerge className="w-4 h-4 text-purple-400" />
          <span>Pull Requests (Yesterday to Present)</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {MOCK_PULL_REQUESTS.map((pr) => (
            <div
              key={pr.id}
              style={{
                background: 'rgba(14, 19, 34, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                <img
                  src={pr.author.avatar}
                  alt={pr.author.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge ${pr.status === 'merged' ? 'badge-success' : 'badge-p2'}`}>
                      {pr.status.toUpperCase()}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-purple)' }}>
                      {pr.id}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '15px' }}>{pr.title}</span>
                  </div>

                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {pr.summary}
                  </div>

                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', gap: '16px' }}>
                    <span>Repo: <strong style={{ color: 'var(--text-primary)' }}>{pr.repo}</strong></span>
                    <span>Author: @{pr.author.handle}</span>
                    {pr.mergedAt && <span>Merged: {pr.mergedAt}</span>}
                    {pr.linkedJira && <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>Linked Jira: {pr.linkedJira}</span>}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', textAlign: 'right' }}>
                  <span style={{ color: '#34D399' }}>+{pr.additions}</span>{' '}
                  <span style={{ color: '#F87171' }}>-{pr.deletions}</span>
                </div>

                <div>
                  <span className={`badge ${pr.ciStatus === 'failed' ? 'badge-p0' : 'badge-success'}`}>
                    CI {pr.ciStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commit Timeline */}
      <div className="glass-card">
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitCommit className="w-4 h-4 text-blue-400" />
          <span>Recent Commit Log Stream</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MOCK_COMMITS.map((c) => (
            <div
              key={c.hash}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{c.hash}</span>
                <span style={{ color: 'var(--text-primary)' }}>{c.message}</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>
                {c.author} • {c.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
