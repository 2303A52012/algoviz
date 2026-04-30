import React, { useState } from 'react';
import './CodeViewer.css';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'c', label: 'C' },
  { id: 'csharp', label: 'C#' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
];

const LanguageIcon = ({ langId }) => {
  const icons = {
    javascript: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 2h20v20H2V2z" fill="#F7DF1E"/>
        <path d="M8 8h2v8H8V8zm4 0h2v8h-2V8zm4 0h2v8h-2V8z" fill="#000"/>
      </svg>
    ),
    python: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z" fill="#3776AB"/>
        <path d="M12 4c2.21 0 2 1 2 1v2h-4v-2s-.21-1 2-1zm0 1c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" fill="#FFD43B"/>
      </svg>
    ),
    java: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.85 2.5c.8-.5 1.5-.4 2 .2.5.6 1 1.8 1.5 2.8.5 1 .8 1.5.8 2.5 0 .5-.2 1-.5 1.5.3 0 .7.1 1 .1h.5c.3 0 .6 0 .8-.1-.3-.5-.5-1.1-.5-1.6 0-1 .3-1.5.8-2.5.5-1 1-2.2 1.5-2.8.5-.6 1.2-.7 2-.2.8.5 1.3 1.2 1.3 2.2 0 1.5-.8 2.8-2.3 3.8 1.5 1 2.3 2.3 2.3 3.8 0 1-.5 1.7-1.3 2.2-.8.5-1.5.4-2-.2-.5-.6-1-1.8-1.5-2.8-.5-1-.8-1.5-.8-2.5 0-.5.2-1 .5-1.5-.3 0-.7-.1-1-.1h-.5c-.3 0-.6 0-.8.1.3.5.5 1.1.5 1.6 0 1-.3 1.5-.8 2.5-.5 1-1 2.2-1.5 2.8-.5.6-1.2.7-2 .2-.8-.5-1.3-1.2-1.3-2.2 0-1.5.8-2.8 2.3-3.8-1.5-1-2.3-2.3-2.3-3.8 0-1 .5-1.7 1.3-2.2z" fill="#F89820"/>
      </svg>
    ),
    cpp: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 2h24v20H0V2z" fill="#00599C"/>
        <text x="12" y="16" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">C++</text>
      </svg>
    ),
    c: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" fill="#A8B9CC"/>
        <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#003366">C</text>
      </svg>
    ),
    csharp: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" fill="#239120"/>
        <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff">C#</text>
      </svg>
    ),
    go: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 12c0 6.627 5.373 12 12 12s12-5.373 12-12S18.627 0 12 0 0 5.373 0 12z" fill="#00ADD8"/>
        <path d="M6 12c0 .6.4 1 1 1s1-.4 1-1-.4-1-1-1-1 .4-1 1zm6 0c0 .6.4 1 1 1s1-.4 1-1-.4-1-1-1-1 .4-1 1z" fill="#fff"/>
      </svg>
    ),
    rust: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" fill="#CE422B"/>
        <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fff">🦀</text>
      </svg>
    ),
  };

  return <span className="language-icon">{icons[langId] || langId}</span>;
};

export default function CodeViewer({ codeSnippets, algoLabel }) {
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const code = codeSnippets[selectedLang] || '// Code not available';

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-viewer">
      <div className="code-viewer-header">
        <h3>Code Implementation</h3>
        <div className="code-viewer-actions">
          <button className="code-action-btn" onClick={handleCopy} title="Copy code">
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="language-tabs">
        {LANGUAGES.map(lang => (
          <button
            key={lang.id}
            className={`lang-tab ${selectedLang === lang.id ? 'lang-tab-active' : ''}`}
            onClick={() => setSelectedLang(lang.id)}
          >
            <LanguageIcon langId={lang.id} />
            {lang.label}
          </button>
        ))}
      </div>

      <pre className="code-block">
        <code>{code}</code>
      </pre>
    </div>
  );
}
