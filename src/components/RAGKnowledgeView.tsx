import React, { useState } from 'react';
import { FileText, Search, Sparkles, Tag, BookOpen, Layers } from 'lucide-react';
import { MOCK_RAG_DOCS } from '../data/mockData';
import { RAGDocument } from '../types';

export const RAGKnowledgeView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('Redis connection pool 504 timeout');
  const [docs, setDocs] = useState<RAGDocument[]>(MOCK_RAG_DOCS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate RAG vector similarity re-ranking
    if (!searchQuery.trim()) {
      setDocs(MOCK_RAG_DOCS);
      return;
    }
    const filtered = MOCK_RAG_DOCS.filter(d => 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.contentSnippet.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDocs(filtered.length > 0 ? filtered : MOCK_RAG_DOCS);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>RAG Enterprise Knowledge Base & Vector Index</span>
          </h1>
          <p className="page-subtitle">
            Semantic vector search across historical postmortems (RCAs), SOP runbooks, and architecture design docs.
          </p>
        </div>
      </div>

      {/* Vector Search Input Bar */}
      <div className="glass-card">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              color: 'var(--accent-cyan)'
            }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search postmortems, runbooks, or error causes e.g. Redis pool timeout..."
              style={{
                width: '100%',
                backgroundColor: '#060911',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px 12px 42px',
                fontSize: '14px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ minWidth: '160px' }}>
            <Sparkles className="w-4 h-4" />
            <span>Vector Search</span>
          </button>
        </form>
      </div>

      {/* RAG Documents Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {docs.map((doc) => (
          <div key={doc.id} className="glass-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-success" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
                  {doc.category}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {doc.id}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{doc.title}</h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--accent-green)' }}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{(doc.similarityScore * 100).toFixed(0)}% Vector Match</span>
              </div>
            </div>

            <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.6' }}>
              "{doc.contentSnippet}"
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '11px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      color: 'var(--text-muted)'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Author: {doc.author} | Updated: {doc.lastUpdated}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
