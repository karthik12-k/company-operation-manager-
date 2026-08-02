import React, { useState, useEffect } from 'react';
import { Bot, ShieldCheck, Search, ChevronDown, Lock, Mic, Presentation } from 'lucide-react';
import { UserAccount, AdminSessionState } from '../types';

interface HeaderProps {
  currentUser: UserAccount;
  allUsers: UserAccount[];
  adminSession?: AdminSessionState;
  onSwitchUser: (userId: string) => void;
  onOpenAdminLogin: () => void;
  onOpenSlideDeck?: () => void;
  onOpenVoiceModal?: () => void;
  onSearchSelect?: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  adminSession,
  onSwitchUser,
  onOpenAdminLogin,
  onOpenSlideDeck,
  onOpenVoiceModal,
  onSearchSelect
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="brand-badge">
          <Bot className="w-6 h-6 text-blue-500" style={{ color: '#3B82F6' }} />
          <span>OPS COPILOT</span>
        </div>
        <div className="env-selector">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" style={{ color: '#10B981' }} />
          <span>PROD-CLUSTER-US-EAST</span>
        </div>

        {/* Admin Session Badge */}
        {adminSession?.isAuthenticated && (
          <div className="env-selector" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34D399' }}>
            <Lock className="w-3.5 h-3.5" />
            <span>ADMIN AUTHENTICATED ({adminSession.adminUser?.name.split(' ')[0]})</span>
          </div>
        )}
      </div>

      <div className="header-right">
        {/* Quick Search */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '14px',
              height: '14px',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search Jira, PRs, Teams..."
            style={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px 6px 32px',
              fontSize: '12.5px',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
            onChange={(e) => onSearchSelect && onSearchSelect(e.target.value)}
          />
        </div>

        {/* Voice Copilot Button */}
        <button
          className="btn-secondary"
          onClick={onOpenVoiceModal}
          style={{ padding: '6px 10px', fontSize: '11.5px', color: 'var(--accent-purple)', borderColor: 'var(--accent-purple)' }}
          title="Open Voice & Text Copilot Input"
        >
          <Mic className="w-3.5 h-3.5 text-purple-400" />
          <span>Voice Copilot</span>
        </button>

        {/* Executive Slide Deck Button */}
        <button
          className="btn-secondary"
          onClick={onOpenSlideDeck}
          style={{ padding: '6px 10px', fontSize: '11.5px', borderColor: 'var(--accent-purple)' }}
          title="Open C-Level Executive Slide Deck"
        >
          <Presentation className="w-3.5 h-3.5 text-purple-400" />
          <span>Executive Deck</span>
        </button>

        {/* Admin Login Button */}
        <button
          className="btn-secondary"
          onClick={onOpenAdminLogin}
          style={{ padding: '6px 10px', fontSize: '11.5px' }}
        >
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          <span>Admin Login</span>
        </button>

        {/* Live Status Indicator */}
        <div className="live-indicator">
          <div className="pulse-dot"></div>
          <span>AGENTS ONLINE</span>
        </div>

        {/* Clock */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {timeStr || '22:50:00 UTC'}
        </div>

        {/* User Account & Role Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-highlight)',
              borderRadius: 'var(--radius-md)',
              padding: '4px 10px 4px 6px',
              cursor: 'pointer'
            }}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '28px', height: '28px', borderRadius: '50%' }}
            />
            <div style={{ textAlign: 'left', fontSize: '12px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{currentUser.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--accent-purple)', fontWeight: 800, textTransform: 'uppercase' }}>
                {currentUser.role === 'admin' ? 'ADMIN' : currentUser.role === 'team_lead' ? 'TEAM LEADER' : 'EMPLOYEE'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {showRoleDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '42px',
                right: 0,
                width: '260px',
                backgroundColor: '#0E1322',
                border: '1px solid var(--border-glow)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-glow)',
                zIndex: 120,
                padding: '8px'
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', padding: '6px 10px', textTransform: 'uppercase' }}>
                SWITCH USER ROLE / PERSPECTIVE
              </div>

              {allUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    onSwitchUser(u.id);
                    setShowRoleDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    backgroundColor: u.id === currentUser.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent'
                  }}
                >
                  <img src={u.avatar} alt={u.name} style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: u.id === currentUser.id ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                      {u.name}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      {u.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
