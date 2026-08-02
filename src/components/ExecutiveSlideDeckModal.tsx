import React, { useState } from 'react';
import { Presentation, ChevronLeft, ChevronRight, X, Shield, Bot, CheckCircle2, Zap, DollarSign } from 'lucide-react';
import { UserAccount } from '../types';

interface ExecutiveSlideDeckModalProps {
  currentUser: UserAccount;
  onClose: () => void;
}

export const ExecutiveSlideDeckModal: React.FC<ExecutiveSlideDeckModalProps> = ({
  currentUser,
  onClose
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const slides = [
    {
      title: 'Enterprise AI Operations Copilot',
      subtitle: 'Executive Operations Briefing & Engineering Intelligence Overview',
      badge: 'SLIDE 1 / 4 • EXECUTIVE BRIEFING',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="grid-3">
            <div className="glass-card card-accent-blue" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE MICROSERVICES</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-blue)', margin: '6px 0' }}>5 Services</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>auth-service, payment-gateway, api-gateway</div>
            </div>

            <div className="glass-card card-accent-purple" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>HIGH PRIORITY BUGS</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#EF4444', margin: '6px 0' }}>4 Active</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>2 P0 Blockers, 2 P1 Critical</div>
            </div>

            <div className="glass-card card-accent-green" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>COPILOT ACCELERATION</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#34D399', margin: '6px 0' }}>4.2x Faster</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>MTTR incident resolution speed</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-purple)', marginBottom: '8px' }}>
              Core Value Proposition & Multi-Agent Architecture
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Our Enterprise AI Operations Copilot orchestrates dedicated agents (Jira, GitHub, Telemetry, and RAG Vector Search) using the Model Context Protocol (MCP). It synthesizes real-time status reports, predicts deployment failure risks, and executes autonomous self-healing playbooks.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Incident Diagnosis & Failure Risk',
      subtitle: 'auth-service v2.14.0 Release Risk Assessment & P99 Latency Breakdown',
      badge: 'SLIDE 2 / 4 • INCIDENT DIAGNOSIS',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="grid-2">
            <div className="glass-card card-accent-red" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 800 }}>CRITICAL INCIDENT ALERT</div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#EF4444', margin: '6px 0' }}>6.42% Error Rate</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                auth-service 504 Gateway Timeouts caused by PR #1042 Redis connection pool leak.
              </div>
            </div>

            <div className="glass-card card-accent-purple" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--accent-purple)', fontWeight: 800 }}>AI FAILURE PROBABILITY</div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#A78BFA', margin: '6px 0' }}>92% Risk Index</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                P99 latency spiked to 2450ms. Upstream web sessions timing out during token refresh.
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>AI Recommended Directives</h4>
            <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
              1. Scale Kubernetes deployment <strong style={{ color: 'var(--accent-blue)' }}>auth-service</strong> to 12 replicas immediately.<br />
              2. Flush idle connection pool sockets in Redis pool manager.<br />
              3. Deploy DB-601 indexing script before promoting payment-gateway v1.8.4 to production.
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Team-Wise Progress & Workload Balance',
      subtitle: 'Engineering Velocity, Merged PRs, and AI Task Redistribution',
      badge: 'SLIDE 3 / 4 • TEAM VELOCITY',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="grid-3">
            <div className="glass-card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: 800 }}>TEAM A (PLATFORM AUTH)</div>
              <div style={{ fontSize: '18px', fontWeight: 800, margin: '4px 0' }}>2 PRs Merged Yesterday</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lead: @Alex Rivera</div>
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--accent-purple)', fontWeight: 800 }}>TEAM B (PAYMENTS & GATEWAY)</div>
              <div style={{ fontSize: '18px', fontWeight: 800, margin: '4px 0' }}>1 PR Open (#1048)</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lead: @Marcus Chen</div>
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 800 }}>TEAM C (CLOUD INFRA)</div>
              <div style={{ fontSize: '18px', fontWeight: 800, margin: '4px 0' }}>30s Secret Sync Active</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lead: @Sarah Jenkins</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-green)', marginBottom: '6px' }}>
              AI Auto Task Redistribution Result
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Reassigned ticket <strong style={{ color: 'var(--accent-blue)' }}>DB-601</strong> from overloaded Team Lead Alex Rivera (4 tasks) to Elena Rostova (1 task), balancing the team burnout index from 48 to 82.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Autonomous Self-Healing & Cloud FinOps',
      subtitle: 'Self-Healing Kubernetes Recovery & $14,200/mo Cloud Savings',
      badge: 'SLIDE 4 / 4 • FINOPS & SELF-HEALING',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="grid-2">
            <div className="glass-card card-accent-green" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: 800 }}>SELF-HEALING RECOVERY</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#34D399', margin: '6px 0' }}>0.04% Error Rate</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Automated K8s pod scaling & socket flushing restored auth-service latency to 85ms.
              </div>
            </div>

            <div className="glass-card card-accent-blue" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: 800 }}>CLOUD FINOPS SAVINGS</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-blue)', margin: '6px 0' }}>$14,200/mo Saved</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Auto-scaled idle staging pods and deleted unattached EBS volumes across EKS clusters.
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-purple)' }}>
              Thank You! Ready for Q&A with Hackathon Judges.
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Enterprise AI Operations Copilot • Multi-Agent MCP Orchestrator Suite
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const current = slides[currentSlide];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#060911',
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px'
      }}
    >
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Presentation className="w-6 h-6 text-purple-400" />
          <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {current.badge}
          </span>
        </div>

        <button className="btn-secondary" style={{ padding: '6px 12px' }} onClick={onClose}>
          <X className="w-4 h-4" />
          <span>Exit Presentation Mode</span>
        </button>
      </div>

      {/* Slide Canvas */}
      <div
        className="glass-card"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '36px',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-glow)'
        }}
      >
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>{current.title}</h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '28px' }}>
            {current.subtitle}
          </p>

          {current.content}
        </div>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Presenter: <strong style={{ color: 'var(--text-primary)' }}>{currentUser.name} ({currentUser.title})</strong>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" disabled={currentSlide === 0} onClick={handlePrev}>
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>

            <button className="btn-primary" disabled={currentSlide === slides.length - 1} onClick={handleNext}>
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
