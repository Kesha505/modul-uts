'use client';

import { useState, useRef, useEffect } from 'react';
import DartRunner from './DartRunner';


/**
 * InlineEditText — click to edit any text content inline.
 * Supports multiline (textarea) or single-line (input).
 */
export function InlineEditText({ value, onSave, multiline = false, className = '', style = {} }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);

  // Sync from parent (real-time updates from other users)
  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      if (multiline) {
        ref.current.selectionStart = ref.current.value.length;
      }
    }
  }, [editing, multiline]);

  async function handleSave() {
    if (draft.trim() === value.trim()) {
      setEditing(false);
      return;
    }
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setDraft(value);
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <div style={{ position: 'relative' }}>
        {multiline ? (
          <textarea
            ref={ref}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              minHeight: 80,
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.4)',
              borderRadius: 8,
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit',
              padding: '10px 12px',
              resize: 'vertical',
              outline: 'none',
              ...style,
            }}
          />
        ) : (
          <input
            ref={ref}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.4)',
              borderRadius: 8,
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              padding: '6px 10px',
              outline: 'none',
              ...style,
            }}
          />
        )}
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '6px 14px',
              borderRadius: 7,
              background: saving ? 'rgba(99,102,241,0.4)' : 'var(--accent-purple)',
              color: 'white',
              border: 'none',
              fontSize: 12,
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              touchAction: 'manipulation',
            }}
          >
            {saving ? '⏳ Menyimpan...' : '✓ Simpan'}
          </button>
          <button
            onClick={() => { setDraft(value); setEditing(false); }}
            style={{
              padding: '6px 14px',
              borderRadius: 7,
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              touchAction: 'manipulation',
            }}
          >
            Batal
          </button>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`editable-text ${className}`}
      onClick={() => setEditing(true)}
      title="Klik untuk edit"
      style={{ cursor: 'text', ...style }}
    >
      {value}
      <span className="edit-hint">✏️</span>
    </span>
  );
}

/**
 * InlineEditCode — click to edit code blocks inline.
 * After saving, auto-runs the Dart code via DartRunner.
 */
export function InlineEditCode({ value, onSave, lang = 'DART' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [autoRunKey, setAutoRunKey] = useState(0); // increment to trigger auto-run
  const ref = useRef(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
    }
  }, [editing]);

  async function handleSave() {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
    // Trigger auto-run after save
    setAutoRunKey((k) => k + 1);
  }

  return (
    <div className="code-container" style={{ position: 'relative' }}>
      <div className="code-header">
        <div className="code-dots">
          <div className="code-dot dot-red" />
          <div className="code-dot dot-yellow" />
          <div className="code-dot dot-green" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="code-lang">{lang}</div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              style={{
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#a5b4fc',
                borderRadius: 5,
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                touchAction: 'manipulation',
              }}
            >
              ✏️ Edit Kode
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <div>
          <textarea
            ref={ref}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
            spellCheck={false}
            style={{
              width: '100%',
              minHeight: 280,
              background: '#0d1117',
              border: 'none',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              color: '#e2e8f0',
              fontFamily: "'JetBrains Mono', 'Consolas', monospace",
              fontSize: 13,
              lineHeight: 1.8,
              padding: '20px',
              resize: 'vertical',
              outline: 'none',
              tabSize: 2,
              display: 'block',
            }}
          />
          <div style={{ display: 'flex', gap: 8, padding: '10px 16px', background: '#0d1117', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '7px 16px',
                borderRadius: 7,
                background: saving ? 'rgba(99,102,241,0.4)' : 'var(--accent-purple)',
                color: 'white',
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                touchAction: 'manipulation',
              }}
            >
              {saving ? '⏳ Menyimpan...' : '✓ Simpan Kode'}
            </button>
            <button
              onClick={() => { setDraft(value); setEditing(false); }}
              style={{
                padding: '7px 14px',
                borderRadius: 7,
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                touchAction: 'manipulation',
              }}
            >
              Batal
            </button>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto', alignSelf: 'center' }}>
              Esc untuk batal
            </span>
          </div>
        </div>
      ) : (
        <pre
          className="code-block"
          onClick={() => setEditing(true)}
          style={{ cursor: 'text', userSelect: 'text' }}
        >
          {value}
        </pre>
      )}

      {/* Dart Runner — otomatis setelah simpan, atau klik manual */}
      {lang === 'DART' && !editing && (
        <DartRunner code={value} autoRunKey={autoRunKey} />
      )}
    </div>
  );
}
