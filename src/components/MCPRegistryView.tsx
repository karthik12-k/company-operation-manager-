import React, { useState } from 'react';
import { Plug, Server, Code, Play, CheckCircle2, Cpu } from 'lucide-react';
import { MOCK_MCP_TOOLS } from '../data/mockData';
import { MCPToolDefinition } from '../types';

export const MCPRegistryView: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<MCPToolDefinition>(MOCK_MCP_TOOLS[0]);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestTool = () => {
    setTestResult('Invoking MCP Tool over JSON-RPC 2.0...');
    setTimeout(() => {
      setTestResult(JSON.stringify({
        jsonrpc: '2.0',
        id: 'mcp-req-101',
        result: {
          status: 'success',
          server: selectedTool.server,
          tool: selectedTool.name,
          executionTimeMs: 142,
          output: `Mock response from ${selectedTool.name} executed cleanly.`
        }
      }, null, 2));
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Plug className="w-6 h-6 text-amber-400" />
            <span>MCP (Model Context Protocol) Tool Registry & Inspector</span>
          </h1>
          <p className="page-subtitle">
            Standardized tool definitions exposing enterprise Jira, GitHub, Telemetry, and Kubernetes endpoints to LLM agents.
          </p>
        </div>
      </div>

      <div className="grid-3">
        {/* Tools List Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-muted)' }}>REGISTERED MCP TOOLS</h3>
          {MOCK_MCP_TOOLS.map((tool) => (
            <div
              key={tool.id}
              onClick={() => { setSelectedTool(tool); setTestResult(null); }}
              className={`glass-card ${selectedTool.id === tool.id ? 'card-accent-blue' : ''}`}
              style={{ padding: '14px 16px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13.5px', color: 'var(--accent-blue)' }}>
                  {tool.name}
                </span>
                <span className="badge badge-success" style={{ fontSize: '10px' }}>
                  {tool.category}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Server: {tool.server}
              </div>
            </div>
          ))}
        </div>

        {/* Schema Inspector Column */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
                  {selectedTool.server}
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {selectedTool.name}
                </h2>
              </div>

              <button className="btn-primary" onClick={handleTestTool}>
                <Play className="w-3.5 h-3.5" />
                <span>Test MCP Invocation</span>
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '16px' }}>
              {selectedTool.description}
            </p>

            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Parameters (JSON Schema)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {selectedTool.parameters.map((param) => (
                <div
                  key={param.name}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {param.name}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                      ({param.type})
                    </span>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {param.description}
                    </div>
                  </div>
                  {param.required && <span className="badge badge-p0" style={{ fontSize: '10px' }}>REQUIRED</span>}
                </div>
              ))}
            </div>

            {/* Test Execution Output */}
            {testResult && (
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--accent-green)' }}>
                  ✓ JSON-RPC 2.0 Response Payload
                </h4>
                <pre className="code-block">{testResult}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
