import React, { useState } from 'react';
import { Activity, ShieldAlert, AlertTriangle, Terminal, Filter, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MOCK_MICROSERVICES, MOCK_LOGS } from '../data/mockData';

const CHART_DATA = [
  { time: '16:00', auth: 0.12, payment: 0.05, gateway: 0.08 },
  { time: '17:00', auth: 0.15, payment: 0.06, gateway: 0.08 },
  { time: '18:00', auth: 0.85, payment: 0.40, gateway: 0.12 },
  { time: '19:00', auth: 2.40, payment: 1.10, gateway: 0.35 },
  { time: '20:00', auth: 4.80, payment: 2.10, gateway: 0.85 },
  { time: '21:00', auth: 6.42, payment: 2.85, gateway: 1.15 }
];

export const MetricsLogsView: React.FC = () => {
  const [selectedLogLevel, setSelectedLogLevel] = useState<string>('ALL');

  const filteredLogs = MOCK_LOGS.filter((l) => {
    if (selectedLogLevel === 'ERROR') return l.level === 'ERROR' || l.level === 'FATAL';
    if (selectedLogLevel === 'WARN') return l.level === 'WARN';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Activity className="w-6 h-6 text-red-400" />
            <span>Service Telemetry & Real-Time APM Logs</span>
          </h1>
          <p className="page-subtitle">
            Microservice error rates, latency (p99) metrics, active incident alerts, and live log stream.
          </p>
        </div>
      </div>

      {/* Microservices Health Cards */}
      <div className="grid-4">
        {MOCK_MICROSERVICES.map((svc) => (
          <div
            key={svc.name}
            className={`glass-card ${
              svc.status === 'critical' ? 'card-accent-red' : svc.status === 'degraded' ? 'card-accent-amber' : 'card-accent-blue'
            }`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '15px' }}>{svc.name}</span>
              <span className={`badge ${svc.status === 'critical' ? 'badge-critical' : svc.status === 'degraded' ? 'badge-p1' : 'badge-success'}`}>
                {svc.status.toUpperCase()}
              </span>
            </div>

            <div style={{ marginTop: '14px' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>ERROR RATE (24H)</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: svc.status === 'critical' ? '#EF4444' : svc.status === 'degraded' ? '#F59E0B' : '#10B981' }}>
                {svc.errorRate}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Latency p99: <strong>{svc.p99LatencyMs}ms</strong> | Rps: {svc.requestsPerSec}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Error Rate Chart */}
      <div className="glass-card">
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>
          Microservice Error Rate Trend (% Failed Requests)
        </h3>
        <div style={{ width: '100%', height: '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#090D16', borderColor: 'var(--border-subtle)', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="auth" stroke="#EF4444" fill="rgba(239, 68, 68, 0.2)" name="auth-service" />
              <Area type="monotone" dataKey="payment" stroke="#F59E0B" fill="rgba(245, 158, 11, 0.2)" name="payment-gateway" />
              <Area type="monotone" dataKey="gateway" stroke="#3B82F6" fill="rgba(59, 130, 246, 0.2)" name="api-gateway" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Log Stream */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal className="w-5 h-5 text-purple-400" />
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>APM Error & Diagnostic Log Stream</h3>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={`btn-secondary ${selectedLogLevel === 'ALL' ? 'active' : ''}`} onClick={() => setSelectedLogLevel('ALL')}>
              All Logs
            </button>
            <button className={`btn-secondary ${selectedLogLevel === 'ERROR' ? 'active' : ''}`} onClick={() => setSelectedLogLevel('ERROR')}>
              Errors Only
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredLogs.map((log) => (
            <div key={log.id} className="code-block" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: log.level === 'FATAL' || log.level === 'ERROR' ? '#EF4444' : '#F59E0B', fontWeight: 800 }}>
                  [{log.timestamp}] [{log.service}] {log.level}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>TraceID: {log.traceId}</span>
              </div>
              <div style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
                {log.message}
              </div>
              {log.stackTrace && (
                <div style={{ color: 'var(--text-secondary)', fontSize: '11.5px', marginTop: '6px' }}>
                  {log.stackTrace}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
