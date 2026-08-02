import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Sparkles, Terminal, X, RefreshCw } from 'lucide-react';

interface VoiceCopilotModalProps {
  onClose: () => void;
  onSubmitPrompt: (promptText: string) => void;
}

export const VoiceCopilotModal: React.FC<VoiceCopilotModalProps> = ({
  onClose,
  onSubmitPrompt
}) => {
  const [promptText, setPromptText] = useState<string>("Give me the updates of yesterday's work across all teams.");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcriptStatus, setTranscriptStatus] = useState<string>("Microphone ready. Speak or type your prompt below:");

  // Web Speech API Initialization
  useEffect(() => {
    let recognition: any = null;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setTranscriptStatus("🎙️ Listening... Speak your prompt clearly now.");
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setPromptText(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          setTranscriptStatus("Microphone access unavailable or denied. You can type your text directly below:");
        };

        recognition.onend = () => {
          setIsListening(false);
          setTranscriptStatus("Voice capture finished. Edit or click 'Execute Copilot Prompt' below.");
        };
      } catch (e) {
        setTranscriptStatus("Speech recognition not supported in this browser. Type your text directly below:");
      }
    } else {
      setTranscriptStatus("Type your command text directly in the box below:");
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {}
      }
    };
  }, []);

  const handleStartListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setTranscriptStatus("Microphone API unavailable. Type your prompt in the box below:");
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setTranscriptStatus("🎙️ Listening... Speak into microphone now.");
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setPromptText(text);
      };

      rec.onend = () => {
        setIsListening(false);
        setTranscriptStatus("Voice captured! Click submit to run.");
      };

      rec.start();
    } catch (e) {
      setIsListening(false);
      setTranscriptStatus("Microphone error. Enter prompt text manually below:");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    onSubmitPrompt(promptText);
    onClose();
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
        zIndex: 250
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
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Voice & Text Copilot Input Assistant
              </h3>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Speak into your microphone or type your prompt text manually
              </div>
            </div>
          </div>

          <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Microphone Pulse & Visualizer */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${isListening ? '#EF4444' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            textAlign: 'center',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <button
              type="button"
              onClick={handleStartListening}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: isListening ? '#EF4444' : 'var(--accent-purple)',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isListening ? '0 0 20px rgba(239, 68, 68, 0.6)' : 'var(--shadow-glow)'
              }}
            >
              {isListening ? <MicOff className="w-6 h-6 spin-icon" /> : <Mic className="w-6 h-6" />}
            </button>
          </div>

          <div style={{ fontSize: '12.5px', color: isListening ? '#EF4444' : 'var(--text-secondary)', fontWeight: 700 }}>
            {transcriptStatus}
          </div>
        </div>

        {/* Preset Prompt Shortcuts */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
            PRESET VOICE & TEXT PROMPTS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '4px 8px', fontSize: '11px' }}
              onClick={() => setPromptText("Give me the updates of yesterday's work across all teams.")}
            >
              Yesterday's Team Updates
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '4px 8px', fontSize: '11px' }}
              onClick={() => setPromptText("Execute self-healing playbook on auth-service and scale pods.")}
            >
              Self-Healing Playbook
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '4px 8px', fontSize: '11px' }}
              onClick={() => setPromptText("Show cloud FinOps cost savings recommendations.")}
            >
              FinOps Cost Savings
            </button>
          </div>
        </div>

        {/* Form Input for Manual Typing */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
              PROMPT TEXT (EDITABLE)
            </label>
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <Terminal style={{ position: 'absolute', left: '10px', top: '12px', width: '14px', height: '14px', color: 'var(--text-muted)' }} />
              <textarea
                rows={3}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Type your prompt text here e.g. Give me yesterday work update..."
                required
                style={{
                  width: '100%',
                  backgroundColor: '#060911',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 10px 10px 32px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn-primary" disabled={!promptText.trim()}>
              <Send className="w-4 h-4" />
              <span>Execute Copilot Prompt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
