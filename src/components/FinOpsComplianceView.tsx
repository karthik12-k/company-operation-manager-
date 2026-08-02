import React, { useState } from 'react';
import {
  DollarSign,
  ShieldCheck,
  TrendingDown,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Cpu,
  Database,
  Layers,
  Sparkles
} from 'lucide-react';
import { FinOpsCostMetrics, SecurityGuardrailResult } from '../types';
import { MOCK_FINOPS_METRICS, MOCK_SECURITY_GUARDRAILS } from '../data/mockData';

export const FinOpsComplianceView: React.FC = () => {
  const [finOps, setFinOps] = useState<FinOpsCostMetrics>(MOCK_FINOPS_METRICS);
  const [security, setSecurity] = useState<SecurityGuardrailResult>(MOCK_SECURITY_GUARDRAILS);
  const [showRedactedLog, setShowRedactedLog] = useState<boolean>(true);
  const [savingsAppliedMsg, setSavingsAppliedMsg] = useState<boolean>(false);

  // Apply FinOps Savings Handler
  const handleApplySavings = () => {
    setFinOps((prev) => ({
      ...prev,
      totalMonthlySpend: prev.totalMonthlySpend - prev.potentialSavings,
      potentialSavings: 0,
      savingsApplied: true,
      wasteItems: prev.wasteItems.map((w) => ({ ...w, applied: true }))
    }));
    setSavingsAppliedMsg(true);
    setTimeout(() => setSavingsAppliedMsg(false), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>MNC GRADE • ZERO-TRUST SECURITY & CLOUD FINOPS</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
              Cloud FinOps Cost Optimizer & Zero-Trust PII Redactor
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginTop: '4px' }}>
              Eliminate cloud resource waste, enforce SOC2/ISO 27001 compliance, and sanitize PII & secret keys in real-time.
            </p>
          </div>

          <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '12px' }}>
            SOC2 COMPLIANT
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODULE 1: CLOUD FINOPS COST WASTE OPTIMIZER                              */}
      {/* ========================================================================= */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>AWS / GCP Cloud FinOps Cost Optimizer</span>
          </h3>

          <button
            className="btn-primary"
            disabled={finOps.savingsApplied}
            onClick={handleApplySavings}
            style={{ backgroundColor: '#10B981', borderColor: '#34D399' }}
          >
            <TrendingDown className="w-4 h-4" />
            <span>{finOps.savingsApplied ? '✓ $14,200/mo Savings Applied' : 'Apply 1-Click $14,200/mo FinOps Savings'}</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid-3" style={{ marginBottom: '20px' }}>
          <div className="glass-card card-accent-blue" style={{ padding: '16px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL MONTHLY CLOUD SPEND</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-blue)', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
              ${finOps.totalMonthlySpend.toLocaleString()}/mo
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Across EKS, Redis, & DB Clusters</div>
          </div>

          <div className="glass-card card-accent-green" style={{ padding: '16px', borderLeft: '4px solid var(--accent-green)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 700 }}>IDENTIFIED SAVINGS POTENTIAL</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#34D399', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
              ${finOps.potentialSavings.toLocaleString()}/mo
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>29.4% cost reduction opportunity</div>
          </div>

          <div className="glass-card card-accent-purple" style={{ padding: '16px', borderLeft: '4px solid var(--accent-purple)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 700 }}>COST EFFICIENCY INDEX</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#A78BFA', margin: '4px 0' }}>
              {finOps.savingsApplied ? '98/100' : '71/100'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Based on pod utilization analysis</div>
          </div>
        </div>

        {savingsAppliedMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: '#34D399', fontSize: '13px', fontWeight: 700, textAlign: 'center', marginBottom: '16px' }}>
            ✓ Successfully auto-scaled idle staging pods, deleted unattached EBS volumes, and right-sized Redis nodes! Saved $14,200/month.
          </div>
        )}

        {/* Waste Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            RESOURCE WASTE & RIGHT-SIZING OPPORTUNITIES
          </div>

          {finOps.wasteItems.map((item) => (
            <div
              key={item.id}
              style={{
                background: item.applied ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${item.applied ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-p1">{item.type}</span>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{item.resourceName}</span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {item.recommendation}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#34D399', fontFamily: 'var(--font-mono)' }}>
                  -${item.monthlyCost}/mo
                </div>
                <span className={`badge ${item.applied ? 'badge-success' : 'badge-p2'}`} style={{ fontSize: '10px', marginTop: '2px' }}>
                  {item.applied ? 'OPTIMIZED' : 'RECOMMENDED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODULE 2: ZERO-TRUST SECURITY & PII REDACTOR GUARDRAIL                   */}
      {/* ========================================================================= */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', fontSize: '12px', fontWeight: 800 }}>
              <Lock className="w-4 h-4" />
              <span>ZERO-TRUST SECURITY GUARDRAIL</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
              Real-Time PII & Secret Key Redactor Visualizer
            </h3>
          </div>

          <button
            className="btn-secondary"
            onClick={() => setShowRedactedLog(!showRedactedLog)}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            {showRedactedLog ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showRedactedLog ? 'Show Unsanitized Raw Log' : 'Show Redacted Safe Log'}</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid-3" style={{ marginBottom: '16px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>PII ITEMS SANITIZED</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-green)' }}>{security.piiRedactedCount} Customer Records</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>SECRETS & KEYS MASKED</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-purple)' }}>{security.secretsMaskedCount} API Keys & JWTs</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>SOC2 AUDIT SCORE</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-blue)' }}>{security.soc2ComplianceScore}/100 Grade A</div>
          </div>
        </div>

        {/* Live Redactor Code Comparison Box */}
        <div style={{ background: '#060911', border: '1px solid var(--border-glow)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: showRedactedLog ? 'var(--accent-green)' : '#EF4444', textTransform: 'uppercase' }}>
              {showRedactedLog ? '✓ SANITIZED REDACTED LOG (SAFE FOR LLM CONTEXT)' : '⚠ RAW UNSANITIZED LOG (EXPOSES PII & SECRETS)'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Regex Redactor Active</span>
          </div>

          <pre style={{ margin: 0, fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: showRedactedLog ? '#A7F3D0' : '#FCA5A5', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {showRedactedLog ? security.sampleRedactedLog : security.sampleRawLog}
          </pre>
        </div>
      </div>
    </div>
  );
};
