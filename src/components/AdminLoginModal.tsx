import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Plus, UserPlus, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types';
import { MOCK_ADMIN_ACCOUNTS } from '../data/mockData';

interface AdminLoginModalProps {
  currentAdmin?: UserAccount;
  allAdminAccounts?: UserAccount[];
  onClose: () => void;
  onLoginSuccess: (adminUser: UserAccount) => void;
  onRegisterNewAdmin?: (newAdmin: UserAccount) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  currentAdmin,
  allAdminAccounts = MOCK_ADMIN_ACCOUNTS,
  onClose,
  onLoginSuccess,
  onRegisterNewAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedAdminId, setSelectedAdminId] = useState<string>(allAdminAccounts[0]?.id || 'usr-admin-sarah');
  
  // Existing Admin Login State
  const [email, setEmail] = useState<string>(allAdminAccounts[0]?.email || 'sarah.jenkins@company.com');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [mfaCode, setMfaCode] = useState<string>('849102');

  // Register New Admin State
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regTitle, setRegTitle] = useState<string>('Director of Systems & AI Ops');
  const [regAvatar, setRegAvatar] = useState<string>('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  const handleSelectAdminPreset = (admin: UserAccount) => {
    setSelectedAdminId(admin.id);
    setEmail(admin.email);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const targetAdmin = allAdminAccounts.find((a) => a.id === selectedAdminId) || allAdminAccounts[0];
      setIsProcessing(false);
      setAuthSuccessMsg(`✓ Admin Session Elevated to ${targetAdmin.name} (${targetAdmin.title})`);

      setTimeout(() => {
        onLoginSuccess(targetAdmin);
      }, 900);
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    setIsProcessing(true);

    const newAdminUser: UserAccount = {
      id: `usr-admin-${Date.now()}`,
      name: regName,
      email: regEmail,
      role: 'admin',
      title: regTitle || 'VP of Engineering',
      avatar: regAvatar
    };

    setTimeout(() => {
      setIsProcessing(false);
      setAuthSuccessMsg(`✓ Created & Authenticated New Admin: ${newAdminUser.name}`);

      if (onRegisterNewAdmin) {
        onRegisterNewAdmin(newAdminUser);
      }

      setTimeout(() => {
        onLoginSuccess(newAdminUser);
      }, 900);
    }, 750);
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
        zIndex: 200
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '560px',
          maxWidth: '92%',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-glow)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeTab === 'login' ? 'Admin Login & Session Transfer' : 'Register New Administrator'}
              </h3>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                {activeTab === 'login' ? 'Authenticate credentials or select an Admin profile' : 'Add a new Admin user to the system and grant administrative privileges'}
              </div>
            </div>
          </div>

          <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button
            className={`btn-secondary ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Login Existing Admin</span>
          </button>

          <button
            className={`btn-secondary ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Add New Admin</span>
          </button>
        </div>

        {/* TAB 1: LOGIN EXISTING ADMIN */}
        {activeTab === 'login' && (
          <div>
            {/* Preset Admin Accounts Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                SELECT ADMINISTRATOR PROFILE TO AUTHENTICATE
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {allAdminAccounts.map((admin) => {
                  const isSelected = admin.id === selectedAdminId;
                  return (
                    <div
                      key={admin.id}
                      onClick={() => handleSelectAdminPreset(admin)}
                      style={{
                        background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={admin.avatar} alt={admin.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                            {admin.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {admin.title}
                          </div>
                        </div>
                      </div>

                      {isSelected && <span className="badge badge-success" style={{ fontSize: '10px' }}>SELECTED</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>ADMIN EMAIL</label>
                <div style={{ position: 'relative', marginTop: '4px' }}>
                  <User style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', backgroundColor: '#060911', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 10px 8px 32px', fontSize: '13px', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              {authSuccessMsg && (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', color: '#34D399', fontSize: '12.5px', fontWeight: 700, textAlign: 'center' }}>
                  {authSuccessMsg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" className="btn-secondary" onClick={onClose}>
                  Cancel
                </button>

                <button type="submit" className="btn-primary" disabled={isProcessing}>
                  {isProcessing ? 'Verifying Tokens...' : 'Authenticate & Transfer Session'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: REGISTER NEW ADMIN */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>FULL NAME</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Michael Scott"
                required
                style={{ width: '100%', backgroundColor: '#060911', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>ADMIN CORPORATE EMAIL</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="e.g. michael.scott@company.com"
                required
                style={{ width: '100%', backgroundColor: '#060911', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>JOB TITLE / EXECUTIVE ROLE</label>
              <input
                type="text"
                value={regTitle}
                onChange={(e) => setRegTitle(e.target.value)}
                placeholder="e.g. Director of Infrastructure & Security"
                required
                style={{ width: '100%', backgroundColor: '#060911', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}
              />
            </div>

            {authSuccessMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', color: '#34D399', fontSize: '12.5px', fontWeight: 700, textAlign: 'center' }}>
                {authSuccessMsg}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>

              <button type="submit" className="btn-primary" disabled={isProcessing || !regName.trim() || !regEmail.trim()}>
                {isProcessing ? 'Provisioning Admin...' : 'Create & Authenticate Admin'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
