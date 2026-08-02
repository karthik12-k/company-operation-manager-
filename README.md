# 🤖 Enterprise Company Operation Manager using AI

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with React](https://img.shields.io/badge/Built%20with-React%2018-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6)](https://www.typescriptlang.org/)
[![MCP Protocol](https://img.shields.io/badge/Protocol-MCP%20v1.2-purple)](https://modelcontextprotocol.io/)

> **Enterprise AI Operations Copilot** is a next-generation, multi-agent AI management platform designed for engineering executives, team leads, and developers. It unifies Jira bug tracking, GitHub PR monitoring, APM service telemetry, RAG vector search, autonomous self-healing infrastructure, and AI workload auto-redistribution into a single, real-time dashboard.

---

## 🌟 Key Features & Architecture

### 1. 🤖 Multi-Agent Copilot Orchestrator (MCP Protocol)
- **Model Context Protocol (MCP)**: JSON-RPC 2.0 interface connecting Jira, GitHub, Datadog telemetry, and vector RAG servers.
- **Real-Time Step Streaming**: Displays agent reasoning traces, tool invocations, and synthesized executive reports.
- **1-Click Communication**: Generates formatted Slack and Email status reports automatically.

### 2. 👥 Complete Team Management & RBAC Workspace
- **Admin Centralized Overview**: Company metrics, team creation modal, project deadline assigner, and employee member manager.
- **Team Leader Isolated Workspace**: Scoped workspace for sprint velocity, milestone tracking, and team task management.
- **Employee Personal Workspace**: Personal assigned Jira tasks (`PAY-891`), PR deliverables, and daily progress logger.
- **Team-Wise Yesterday Work Report Engine**: Query *"Give me the updates of yesterday's work across all teams"* for a structured team-by-team status breakdown.
- **Interactive Engineer Profile Reports**: Click any engineer avatar to view their PRs, assigned P0/P1 bugs, review velocity, and burnout metrics.

### 3. 🧠 Predictive AI Engineering Intelligence Suite
- 🔍 **AI Code Analysis**: Code health grades (A to F), coverage %, tech debt hours, duplicate code %, and static security vulnerability scanner with suggested fixes.
- ⚠️ **AI Risk Prediction Engine**: Release risk index (88/100 for `auth-service v2.14.0`), failure probability (92%), risk factor breakdown, and AI mitigation advice.
- 🩺 **AI Team Health Score**: Burnout risk diagnostics, workload balance index, PR review velocity, and sprint predictability.
- 🔄 **AI Auto Task Redistribution**: Interactive workload rebalancer with 1-click **"Auto-Rebalance Tasks Now"** button that reallocates tasks from overloaded leads to available team members.
- 📝 **AI Meeting & Standup Summarizer**: Automated standup briefing, critical blocker extractor, interactive action items checklist, and 1-click **Export to Slack**.

### 4. 🔐 Admin Authentication & Session Handover
- Interactive **Admin Authentication Modal**: Credentials input (Email, Password, Security Passkey, 2FA MFA Code).
- **Session Elevation & Handover**: Dynamic registration and authentication for incoming Admins (`Sarah Jenkins - VP Eng`, `David Vance - Director of Ops`, `Rachel Kim - CISO`).
- **Header Session Badge**: Displays `ADMIN AUTHENTICATED` status with token issuer info.

### 5. 🏆 Autonomous Self-Healing Cloud Ops & Chaos Simulator
- **Live Chaos Engineering Outage Simulator**: 1-click outage triggers (`🔥 Redis Pool Exhaustion`, `⚡ Stripe Webhook Lock Failure`).
- **Autonomous K8s Playbook Executor**: 1-click **"Execute Self-Healing Now"** button scales deployment replicas (4 → 12), purges stale Redis sockets, and restores service error rate from 8.45% down to **0.04%**.

### 6. 🛡️ Zero-Trust Security & PII Redactor
- **Real-Time PII & Secret Key Redactor**: Automatically sanitizes JWT bearer tokens, credit cards, emails, and AWS access keys before sending context to LLMs.
- **SOC2 / ISO 27001 Compliance Auditor**: Live SOC2 audit score (92/100) and change management alerts.

### 7. 💰 Cloud FinOps Cost Waste Optimizer
- Tracks monthly cloud spend ($48,200/mo AWS/GCP across EKS, Redis, DB clusters).
- Identifies idle staging pods, unattached EBS volumes, and over-provisioned Redis nodes.
- **1-Click FinOps Savings**: Reduces cloud spend by **$14,200/month** in 1 click.

### 8. 🎙️ Voice Copilot & C-Level Executive Slide Deck
- **Voice Copilot**: Browser Web Speech API modal for speaking or typing prompt text.
- **Executive Presentation Deck**: 1-click fullscreen 4-slide presentation deck for pitch presentations.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 + TypeScript + Vite
- **Styling**: Vanilla CSS3 + Glassmorphism + HSL Custom Tokens
- **Icons**: Lucide React
- **Data Visualization**: Recharts (APM Telemetry Area Charts)
- **Effects**: Canvas Confetti

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation Commands

```bash
# 1. Clone the repository
git clone https://github.com/karthik12-k/company-operation-manager-.git

# 2. Navigate to project directory
cd company-operation-manager-

# 3. Install dependencies
npm install

# 4. Start local Vite development server
npm run dev
```

Open your browser and navigate to **`http://localhost:3000/`**.

---

## 📂 Project Structure

```
d:/AI oper copilot/
├── src/
│   ├── components/
│   │   ├── AIEngineeringIntelligenceView.tsx  # Predictive AI Suite
│   │   ├── AdminLoginModal.tsx                # Admin Authentication & Session Transfer
│   │   ├── ArchitectureView.tsx               # Enterprise Topology Visualizer
│   │   ├── CopilotView.tsx                    # Multi-Agent Copilot Center
│   │   ├── ExecutiveSlideDeckModal.tsx        # C-Level Presentation Slide Deck
│   │   ├── FinOpsComplianceView.tsx           # Cloud FinOps & Zero-Trust Security
│   │   ├── GitHubDashboard.tsx                # GitHub PRs & Commit Stream
│   │   ├── Header.tsx                         # Header Navbar with Voice & Admin controls
│   │   ├── JiraDashboard.tsx                  # Jira P0/P1 Issue Tracker
│   │   ├── MCPRegistryView.tsx                # MCP Protocol Schema Inspector
│   │   ├── MetricsLogsView.tsx                # Service Telemetry & APM Logs
│   │   ├── RAGKnowledgeView.tsx               # Semantic Vector Search Engine
│   │   ├── SelfHealingOpsView.tsx             # Self-Healing Ops & Chaos Simulator
│   │   ├── Sidebar.tsx                        # Main Sidebar Navigation
│   │   ├── TeamManagementView.tsx             # RBAC Team Workspaces & Report Engine
│   │   ├── UserProfileReportModal.tsx         # Individual Engineer Work Report Modal
│   │   └── VoiceCopilotModal.tsx              # Voice & Text Copilot Input Modal
│   ├── data/
│   │   └── mockData.ts                        # Jira, GitHub, Telemetry, Teams datasets
│   ├── services/
│   │   └── copilotEngine.ts                   # Agent Flow Orchestration Engine
│   ├── types/
│   │   └── index.ts                           # TypeScript Interfaces
│   ├── App.tsx                                # Root Application Shell
│   ├── index.css                              # Glassmorphic Design System
│   └── main.tsx                               # React DOM Render Entry
├── index.html                                 # HTML Shell
├── package.json                               # Dependencies Manifest
└── vite.config.ts                             # Vite Development Server Config
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
