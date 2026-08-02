import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { CopilotView } from './components/CopilotView';
import { JiraDashboard } from './components/JiraDashboard';
import { GitHubDashboard } from './components/GitHubDashboard';
import { MetricsLogsView } from './components/MetricsLogsView';
import { RAGKnowledgeView } from './components/RAGKnowledgeView';
import { MCPRegistryView } from './components/MCPRegistryView';
import { ArchitectureView } from './components/ArchitectureView';
import { TeamManagementView } from './components/TeamManagementView';
import { AIEngineeringIntelligenceView } from './components/AIEngineeringIntelligenceView';
import { SelfHealingOpsView } from './components/SelfHealingOpsView';
import { FinOpsComplianceView } from './components/FinOpsComplianceView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ExecutiveSlideDeckModal } from './components/ExecutiveSlideDeckModal';
import { VoiceCopilotModal } from './components/VoiceCopilotModal';

import {
  MOCK_USERS,
  MOCK_TEAMS,
  MOCK_TEAM_PROJECTS,
  MOCK_JIRA_ISSUES
} from './data/mockData';
import { UserAccount, Team, TeamProject, JiraIssue, TaskRedistributionPlan, AdminSessionState } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('teams');

  // Application State
  const [users, setUsers] = useState<UserAccount[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(MOCK_USERS[0]); // Default Admin Sarah Jenkins
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [projects, setProjects] = useState<TeamProject[]>(MOCK_TEAM_PROJECTS);
  const [jiraIssues, setJiraIssues] = useState<JiraIssue[]>(MOCK_JIRA_ISSUES);

  // Modals & Auto-Run State
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [showSlideDeckModal, setShowSlideDeckModal] = useState<boolean>(false);
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [autoRunPrompt, setAutoRunPrompt] = useState<string | null>(null);

  const [adminSession, setAdminSession] = useState<AdminSessionState>({
    isAuthenticated: true,
    adminUser: MOCK_USERS[0],
    sessionToken: 'ADMIN-SESSION-TOKEN-SARAH-0802',
    authenticatedAt: new Date().toLocaleTimeString()
  });

  // User Switcher Handler
  const handleSwitchUser = (userId: string) => {
    const selected = users.find((u) => u.id === userId);
    if (selected) {
      setCurrentUser(selected);
    }
  };

  // Admin Login Success Handler
  const handleAdminLoginSuccess = (authenticatedAdmin: UserAccount) => {
    setAdminSession({
      isAuthenticated: true,
      adminUser: authenticatedAdmin,
      sessionToken: `ADMIN-SESSION-TOKEN-${authenticatedAdmin.name.toUpperCase().replace(' ', '-')}-${Date.now()}`,
      authenticatedAt: new Date().toLocaleTimeString()
    });
    setCurrentUser(authenticatedAdmin);
    setShowAdminLoginModal(false);
  };

  // Register New Admin User Handler
  const handleRegisterNewAdmin = (newAdminUser: UserAccount) => {
    setUsers((prev) => [newAdminUser, ...prev]);
  };

  // Voice Command Handler: Sets autoRunPrompt and navigates
  const handleVoiceCommandSubmit = (transcriptPrompt: string) => {
    if (transcriptPrompt.toLowerCase().includes('self-healing') || transcriptPrompt.toLowerCase().includes('outage')) {
      setActiveTab('self_healing');
    } else if (transcriptPrompt.toLowerCase().includes('finops') || transcriptPrompt.toLowerCase().includes('saving')) {
      setActiveTab('finops');
    } else {
      setAutoRunPrompt(transcriptPrompt);
      setActiveTab('teams');
    }
  };

  // Create Team Handler
  const handleCreateTeam = (newTeamData: Omit<Team, 'id' | 'createdDate'>) => {
    const newTeam: Team = {
      ...newTeamData,
      id: `team-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setTeams((prev) => [...prev, newTeam]);
    setUsers((prev) =>
      prev.map((u) => (u.id === newTeamData.leaderId ? { ...u, teamId: newTeam.id, role: 'team_lead' } : u))
    );
  };

  // Create Project Handler
  const handleCreateProject = (newProjectData: Omit<TeamProject, 'id'>) => {
    const newProject: TeamProject = {
      ...newProjectData,
      id: `prj-${Date.now()}`
    };
    setProjects((prev) => [...prev, newProject]);
  };

  // Add Member to Team Handler
  const handleAddMemberToTeam = (teamId: string, userId: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId && !t.memberIds.includes(userId)
          ? { ...t, memberIds: [...t.memberIds, userId] }
          : t
      )
    );
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, teamId } : u))
    );
  };

  // Remove Member from Team Handler
  const handleRemoveMemberFromTeam = (teamId: string, userId: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId ? { ...t, memberIds: t.memberIds.filter((id) => id !== userId) } : t
      )
    );
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, teamId: undefined } : u))
    );
  };

  // AI Task Auto-Redistribution Handler
  const handleAutoRedistributeTask = (plan: TaskRedistributionPlan) => {
    setJiraIssues((prev) =>
      prev.map((issue) =>
        issue.id === plan.taskToReassign.id
          ? {
              ...issue,
              assignee: {
                ...issue.assignee,
                name: plan.recommendedTargetEngineer.name,
                avatar: plan.recommendedTargetEngineer.avatar
              }
            }
          : issue
      )
    );
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={currentUser.role}
        p0Count={2}
        openPRCount={1}
        criticalAlertCount={2}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header
          currentUser={currentUser}
          allUsers={users}
          adminSession={adminSession}
          onSwitchUser={handleSwitchUser}
          onOpenAdminLogin={() => setShowAdminLoginModal(true)}
          onOpenSlideDeck={() => setShowSlideDeckModal(true)}
          onOpenVoiceModal={() => setShowVoiceModal(true)}
        />

        <main className="page-body">
          {activeTab === 'ai_intel' && (
            <AIEngineeringIntelligenceView
              onAutoRedistributeTask={handleAutoRedistributeTask}
            />
          )}
          {activeTab === 'self_healing' && <SelfHealingOpsView />}
          {activeTab === 'finops' && <FinOpsComplianceView />}
          {activeTab === 'teams' && (
            <TeamManagementView
              currentUser={currentUser}
              teams={teams}
              users={users}
              projects={projects}
              jiraIssues={jiraIssues}
              autoRunPrompt={autoRunPrompt}
              onClearAutoRunPrompt={() => setAutoRunPrompt(null)}
              onCreateTeam={handleCreateTeam}
              onCreateProject={handleCreateProject}
              onAddMemberToTeam={handleAddMemberToTeam}
              onRemoveMemberFromTeam={handleRemoveMemberFromTeam}
            />
          )}
          {activeTab === 'copilot' && <CopilotView />}
          {activeTab === 'jira' && <JiraDashboard />}
          {activeTab === 'github' && <GitHubDashboard />}
          {activeTab === 'telemetry' && <MetricsLogsView />}
          {activeTab === 'rag' && <RAGKnowledgeView />}
          {activeTab === 'mcp' && <MCPRegistryView />}
          {activeTab === 'architecture' && <ArchitectureView />}
        </main>
      </div>

      {/* Modals */}
      {showAdminLoginModal && (
        <AdminLoginModal
          currentAdmin={adminSession.adminUser}
          allAdminAccounts={users.filter((u) => u.role === 'admin')}
          onClose={() => setShowAdminLoginModal(false)}
          onLoginSuccess={handleAdminLoginSuccess}
          onRegisterNewAdmin={handleRegisterNewAdmin}
        />
      )}

      {showSlideDeckModal && (
        <ExecutiveSlideDeckModal
          currentUser={currentUser}
          onClose={() => setShowSlideDeckModal(false)}
        />
      )}

      {showVoiceModal && (
        <VoiceCopilotModal
          onClose={() => setShowVoiceModal(false)}
          onSubmitPrompt={handleVoiceCommandSubmit}
        />
      )}
    </div>
  );
};

export default App;
