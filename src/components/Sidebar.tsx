import React from 'react';
import {
  BrainCircuit,
  Bot,
  KanbanSquare,
  GitPullRequest,
  Activity,
  Search,
  Cpu,
  Layers,
  Users,
  ShieldCheck,
  Zap,
  DollarSign
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab =
  | 'ai_intel'
  | 'self_healing'
  | 'finops'
  | 'copilot'
  | 'teams'
  | 'jira'
  | 'github'
  | 'telemetry'
  | 'rag'
  | 'mcp'
  | 'architecture';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userRole: UserRole;
  p0Count: number;
  openPRCount: number;
  criticalAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  p0Count,
  openPRCount,
  criticalAlertCount
}) => {
  return (
    <aside className="app-sidebar">
      {/* SECTION 1: AI INTELLIGENCE & SUITE */}
      <div className="sidebar-group">
        <div className="sidebar-title">AI INTELLIGENCE & SUITE</div>

        <button
          className={`sidebar-item ${activeTab === 'ai_intel' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai_intel')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            <span>AI Intelligence Hub</span>
          </div>
          <span className="badge badge-p1" style={{ fontSize: '10px' }}>PRO</span>
        </button>

        <button
          className={`sidebar-item ${activeTab === 'self_healing' ? 'active' : ''}`}
          onClick={() => setActiveTab('self_healing')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Self-Healing & Chaos Ops</span>
          </div>
          <span className="badge badge-p0" style={{ fontSize: '9px' }}>WINNER</span>
        </button>

        <button
          className={`sidebar-item ${activeTab === 'finops' ? 'active' : ''}`}
          onClick={() => setActiveTab('finops')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DollarSign className="w-4 h-4 text-green-400" />
            <span>FinOps & Security</span>
          </div>
          <span className="badge badge-success" style={{ fontSize: '9px' }}>MNC</span>
        </button>

        <button
          className={`sidebar-item ${activeTab === 'copilot' ? 'active' : ''}`}
          onClick={() => setActiveTab('copilot')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot className="w-4 h-4 text-blue-400" />
            <span>Copilot Orchestrator</span>
          </div>
          <span className="badge badge-p2" style={{ fontSize: '10px' }}>DEMO</span>
        </button>
      </div>

      {/* SECTION 2: MANAGEMENT & TEAMS */}
      <div className="sidebar-group">
        <div className="sidebar-title">MANAGEMENT & TEAMS</div>

        <button
          className={`sidebar-item ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Team Management</span>
          </div>
          <span className="badge badge-p2" style={{ fontSize: '10px' }}>
            {userRole.toUpperCase()}
          </span>
        </button>
      </div>

      {/* SECTION 3: ENTERPRISE INTEGRATIONS */}
      <div className="sidebar-group">
        <div className="sidebar-title">ENTERPRISE INTEGRATIONS</div>

        <button
          className={`sidebar-item ${activeTab === 'jira' ? 'active' : ''}`}
          onClick={() => setActiveTab('jira')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <KanbanSquare className="w-4 h-4 text-blue-400" />
            <span>Jira (Team A Bugs)</span>
          </div>
          {p0Count > 0 && <span className="badge badge-p0">{p0Count}</span>}
        </button>

        <button
          className={`sidebar-item ${activeTab === 'github' ? 'active' : ''}`}
          onClick={() => setActiveTab('github')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GitPullRequest className="w-4 h-4 text-emerald-400" />
            <span>GitHub Activity</span>
          </div>
          {openPRCount > 0 && <span className="badge badge-p1">{openPRCount}</span>}
        </button>

        <button
          className={`sidebar-item ${activeTab === 'telemetry' ? 'active' : ''}`}
          onClick={() => setActiveTab('telemetry')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity className="w-4 h-4 text-red-400" />
            <span>Service Telemetry & Logs</span>
          </div>
          {criticalAlertCount > 0 && <span className="badge badge-p0">{criticalAlertCount}</span>}
        </button>

        <button
          className={`sidebar-item ${activeTab === 'rag' ? 'active' : ''}`}
          onClick={() => setActiveTab('rag')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search className="w-4 h-4 text-amber-400" />
            <span>RAG Knowledge Base</span>
          </div>
        </button>
      </div>

      {/* SECTION 4: SYSTEM & ARCHITECTURE */}
      <div className="sidebar-group">
        <div className="sidebar-title">SYSTEM & ARCHITECTURE</div>

        <button
          className={`sidebar-item ${activeTab === 'mcp' ? 'active' : ''}`}
          onClick={() => setActiveTab('mcp')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>MCP Tool Registry</span>
          </div>
        </button>

        <button
          className={`sidebar-item ${activeTab === 'architecture' ? 'active' : ''}`}
          onClick={() => setActiveTab('architecture')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Enterprise Topology</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
