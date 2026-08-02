import React, { useState } from 'react';
import {
  Zap,
  Flame,
  CheckCircle2,
  RefreshCw,
  Play,
  Shield,
  Activity,
  AlertTriangle,
  Server,
  Layers,
  Cpu,
  TrendingDown
} from 'lucide-react';
import { SelfHealingRemediation, ChaosOutageSimulation } from '../types';
import { MOCK_SELF_HEALING, MOCK_CHAOS_SIMULATIONS } from '../data/mockData';

interface SelfHealingOpsViewProps {
  onTriggerChaosOutage?: (simulation: ChaosOutageSimulation) => void;
}

export const SelfHealingOpsView: React.FC<SelfHealingOpsViewProps> = ({
  onTriggerChaosOutage
}) => {
  const [remediation, setRemediation] = useState<SelfHealingRemediation>(MOCK_SELF_HEALING);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [currentErrorRate, setCurrentErrorRate] = useState<number>(6.42);
  const [activeOutage, setActiveOutage] = useState<string | null>(null);

  // Trigger Chaos Outage Handler
  const handleChaosTrigger = (sim: ChaosOutageSimulation) => {
    setActiveOutage(sim.title);
    setCurrentErrorRate(sim.errorSpikeRate);

    // Reset remediation state
    setRemediation({
      ...MOCK_SELF_HEALING,
      targetService: sim.targetService,
      triggerCause: sim.title,
      initialErrorRate: sim.errorSpikeRate,
      status: 'idle',
      steps: MOCK_SELF_HEALING.steps.map((s) => ({ ...s, status: 'pending' }))
    });

    if (onTriggerChaosOutage) {
      onTriggerChaosOutage(sim);
    }
  };

  // Execute Self-Healing Remediation Handler
  const handleExecuteRemediation = async () => {
    setIsExecuting(true);
    setRemediation((prev) => ({ ...prev, status: 'in_progress' }));

    const steps = [...remediation.steps];

    for (let i = 0; i < steps.length; i++) {
      steps[i] = { ...steps[i], status: 'running' };
      setRemediation((prev) => ({ ...prev, steps: [...steps] }));

      await new Promise((r) => setTimeout(r, 1200));

      steps[i] = { ...steps[i], status: 'completed' };

      // Gradually reduce error rate
      const stepErrorRate =
        i === 0 ? 3.10 : i === 1 ? 0.85 : 0.04;
      setCurrentErrorRate(stepErrorRate);

      setRemediation((prev) => ({ ...prev, steps: [...steps] }));
      await new Promise((r) => setTimeout(r, 400));
    }

    setRemediation((prev) => ({
      ...prev,
      status: 'healed',
      recoveredErrorRate: 0.04
    }));
    setIsExecuting(false);
    setActiveOutage(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Zap className="w-4 h-4 text-purple-400" />
              <span>HACKATHON WINNER MODULE • AUTONOMOUS CLOUD OPS</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
              Autonomous Self-Healing Ops & Chaos Engineering Simulator
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginTop: '4px' }}>
              Simulate live production outages for hackathon judges and trigger AI self-healing Kubernetes playbooks in real-time.
            </p>
          </div>

          <span className="badge badge-p0" style={{ padding: '6px 12px', fontSize: '12px' }}>
            MNC DEMO READY
          </span>
        </div>
      </div>

      {/* SECTION 1: LIVE CHAOS ENGINEERING OUTAGE SIMULATOR */}
      <div className="glass-card" style={{ border: '1px solid rgba(239, 68, 68, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontSize: '13px', fontWeight: 800, marginBottom: '12px' }}>
          <Flame className="w-4 h-4" />
          <span>LIVE CHAOS ENGINEERING SIMULATOR (FOR JUDGING DEMONSTRATIONS)</span>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Click an outage trigger button to simulate a live production outage in front of hackathon judges:
        </div>

        <div className="grid-2">
          {MOCK_CHAOS_SIMULATIONS.map((sim) => (
            <div
              key={sim.id}
              className="glass-card"
              style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '16px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-p0" style={{ fontSize: '10px' }}>OUTAGE SIMULATOR</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: {sim.targetService}</span>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                {sim.title}
              </h4>
              <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: '#FCA5A5', marginBottom: '14px' }}>
                {sim.logStream}
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', backgroundColor: '#DC2626', borderColor: '#EF4444' }}
                onClick={() => handleChaosTrigger(sim)}
              >
                <Flame className="w-4 h-4" />
                <span>🔥 Trigger {sim.targetService} Outage ({sim.errorSpikeRate}% Error Spike)</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: AUTONOMOUS SELF-HEALING KUBERNETES EXECUTION VISUALIZER */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)', fontSize: '12px', fontWeight: 800 }}>
              <Shield className="w-4 h-4" />
              <span>AUTONOMOUS KUBERNETES PLAYBOOK EXECUTOR</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
              Target Service: <span style={{ color: 'var(--accent-blue)' }}>{remediation.targetService}</span>
            </h3>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CURRENT SERVICE ERROR RATE</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: currentErrorRate > 1.0 ? '#EF4444' : '#34D399', fontFamily: 'var(--font-mono)' }}>
              {currentErrorRate.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Cause Alert */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>TRIGGER CAUSE</span>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{remediation.triggerCause}</div>
          </div>

          <button
            className="btn-primary"
            disabled={isExecuting || remediation.status === 'healed'}
            onClick={handleExecuteRemediation}
            style={{ minWidth: '220px' }}
          >
            {isExecuting ? (
              <>
                <RefreshCw className="w-4 h-4 spin-icon" />
                <span>Executing Self-Healing...</span>
              </>
            ) : remediation.status === 'healed' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Service Restored (0.04%)</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Execute Self-Healing Now</span>
              </>
            )}
          </button>
        </div>

        {/* Step Execution Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {remediation.steps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isRunning = step.status === 'running';

            return (
              <div
                key={step.stepNumber}
                style={{
                  background: isCompleted
                    ? 'rgba(16, 185, 129, 0.08)'
                    : isRunning
                    ? 'rgba(59, 130, 246, 0.15)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${
                    isCompleted
                      ? 'rgba(16, 185, 129, 0.3)'
                      : isRunning
                      ? 'var(--accent-blue)'
                      : 'var(--border-subtle)'
                  }`,
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isCompleted ? '#10B981' : isRunning ? '#3B82F6' : 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '13px'
                  }}
                >
                  {isCompleted ? '✓' : step.stepNumber}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Step {step.stepNumber}: {step.action}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {isCompleted ? step.resultMessage : isRunning ? 'Executing K8s API call...' : 'Waiting for prior step completion'}
                  </div>
                </div>

                <span className={`badge ${isCompleted ? 'badge-success' : isRunning ? 'badge-p1' : 'badge-p2'}`}>
                  {isCompleted ? 'RESTORED' : isRunning ? 'EXECUTING' : 'PENDING'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
