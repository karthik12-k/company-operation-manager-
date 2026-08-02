import React from 'react';
import { Network, Bot, Shield, Cpu, Database, Server, GitBranch, Terminal, ArrowDown } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Network className="w-6 h-6 text-pink-400" />
            <span>Enterprise Architecture & System Topology</span>
          </h1>
          <p className="page-subtitle">
            Visual topology of multi-agent reasoning, Model Context Protocol (MCP) transport, and enterprise security perimeters.
          </p>
        </div>
      </div>

      {/* Architecture Visual Diagram Card */}
      <div className="glass-card" style={{ border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center' }}>
          
          {/* Layer 1: Presentation & Users */}
          <div style={{ width: '100%', maxWidth: '800px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '8px' }}>
              <Terminal className="w-4 h-4" />
              <span>PRESENTATION & COPILOT UI LAYER</span>
            </div>
            <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
              Engineering Manager Web Console • Incident Command Center • Automated Slack / Teams Status Webhooks
            </div>
          </div>

          <ArrowDown className="w-5 h-5 text-purple-400" />

          {/* Layer 2: AI Orchestrator */}
          <div style={{ width: '100%', maxWidth: '800px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)', border: '1px solid var(--accent-purple)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#A78BFA', fontSize: '16px', marginBottom: '8px' }}>
              <Bot className="w-6 h-6 text-purple-400" />
              <span>MULTI-AGENT ORCHESTRATION ENGINE (Gemini 3.6 Flash)</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', maxWidth: '650px', margin: '0 auto', lineHeight: '1.5' }}>
              Decomposes complex requests → Coordinates Jira Agent, GitHub Agent, Metrics Agent, and RAG Agent → Evaluates tool returns → Synthesizes Executive Reports & One-Click Remediation Actions.
            </div>
          </div>

          <ArrowDown className="w-5 h-5 text-purple-400" />

          {/* Layer 3: MCP Protocol Registry */}
          <div style={{ width: '100%', maxWidth: '900px' }}>
            <div style={{ fontWeight: 800, color: 'var(--accent-amber)', fontSize: '13px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              MODEL CONTEXT PROTOCOL (MCP) TRANSPORT LAYER (JSON-RPC 2.0 OVER SSE)
            </div>

            <div className="grid-4">
              <div className="glass-card" style={{ padding: '16px', borderTop: '3px solid #3B82F6' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#3B82F6' }}>jira-mcp-server</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  jira_search_issues<br/>create_jira_ticket
                </div>
              </div>

              <div className="glass-card" style={{ padding: '16px', borderTop: '3px solid #10B981' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#10B981' }}>github-mcp-server</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  github_get_recent_prs<br/>github_get_commits
                </div>
              </div>

              <div className="glass-card" style={{ padding: '16px', borderTop: '3px solid #EF4444' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#EF4444' }}>datadog-mcp-server</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  datadog_query_error_rates<br/>fetch_apm_logs
                </div>
              </div>

              <div className="glass-card" style={{ padding: '16px', borderTop: '3px solid #06B6D4' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#06B6D4' }}>rag-knowledge-server</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  vector_search_docs<br/>fetch_postmortem_rca
                </div>
              </div>
            </div>
          </div>

          <ArrowDown className="w-5 h-5 text-purple-400" />

          {/* Layer 4: Infrastructure & Data */}
          <div style={{ width: '100%', maxWidth: '800px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <Database className="w-4 h-4" />
              <span>ENTERPRISE DATASTORES & CLOUD INFRASTRUCTURE</span>
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Atlassian Jira REST API • GitHub Actions CI/CD • Datadog APM • Qdrant Vector DB • AWS EKS Kubernetes Cluster
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
