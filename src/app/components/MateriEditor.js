'use client';

import { useEffect, useState, useCallback } from 'react';
import { getOrInitMateri, saveMateri, subscribeMateri, DEFAULT_CONTENT } from '../lib/contentStore';
import { InlineEditText, InlineEditCode } from './InlineEditor';

/**
 * useMateriContent — hook that syncs materi content with Firestore in real-time.
 * Falls back to DEFAULT_CONTENT when Firebase is not configured.
 */
export function useMateriContent(slug) {
  const [content, setContent] = useState(DEFAULT_CONTENT[slug]);
  const [status, setStatus] = useState('loading'); // loading | live | offline

  useEffect(() => {
    // Check if Firebase is configured
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId || projectId === 'your_project_id_here') {
      setStatus('offline');
      return;
    }

    let unsub;
    async function init() {
      try {
        const data = await getOrInitMateri(slug);
        setContent((prev) => ({ ...prev, ...data }));
        setStatus('live');
        unsub = subscribeMateri(slug, (data) => {
          setContent((prev) => ({ ...prev, ...data }));
        });
      } catch (err) {
        console.warn('Firebase not connected, using local content:', err.message);
        setStatus('offline');
      }
    }
    init();
    return () => unsub?.();
  }, [slug]);

  const save = useCallback(
    async (field, value) => {
      setContent((prev) => ({ ...prev, [field]: value }));
      if (status === 'live') {
        await saveMateri(slug, { [field]: value });
      }
    },
    [slug, status]
  );

  return { content, status, save };
}

/**
 * LiveBadge — shows real-time sync status
 */
function LiveBadge({ status }) {
  if (status === 'loading') return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        fontWeight: 600,
        padding: '4px 10px',
        borderRadius: 20,
        marginBottom: 16,
        background: status === 'live'
          ? 'rgba(16,185,129,0.12)'
          : 'rgba(245,158,11,0.12)',
        border: `1px solid ${status === 'live' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
        color: status === 'live' ? '#34d399' : '#fbbf24',
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: status === 'live' ? '#34d399' : '#fbbf24',
          display: 'inline-block',
          animation: status === 'live' ? 'pulse 2s infinite' : 'none',
        }}
      />
      {status === 'live' ? '🔴 Live — perubahan disinkronkan ke semua user' : '⚡ Mode Lokal — setup Firebase untuk sync real-time'}
    </div>
  );
}

/**
 * EditHint — shown when hovering on editable fields
 */
function EditHint() {
  return (
    <div
      style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        marginBottom: 20,
        padding: '8px 12px',
        background: 'rgba(99,102,241,0.06)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 8,
      }}
    >
      ✏️ <strong>Mode Edit Aktif</strong> — Klik pada teks atau kode untuk mengedit langsung.
      Perubahan tersimpan otomatis ke semua pengguna.
    </div>
  );
}

// ===================== HANOI EDITOR =====================
export function HanoiEditor({ children }) {
  const { content, status, save } = useMateriContent('hanoi');

  return (
    <div>
      <LiveBadge status={status} />
      <EditHint />
      {children({ content, save })}
    </div>
  );
}

// ===================== PALINDROM EDITOR =====================
export function PalindromEditor({ children }) {
  const { content, status, save } = useMateriContent('palindrom');
  return (
    <div>
      <LiveBadge status={status} />
      <EditHint />
      {children({ content, save })}
    </div>
  );
}

// ===================== PRIMA EDITOR =====================
export function PrimaEditor({ children }) {
  const { content, status, save } = useMateriContent('prima');
  return (
    <div>
      <LiveBadge status={status} />
      <EditHint />
      {children({ content, save })}
    </div>
  );
}

// ===================== PASCAL EDITOR =====================
export function PascalEditor({ children }) {
  const { content, status, save } = useMateriContent('pascal');
  return (
    <div>
      <LiveBadge status={status} />
      <EditHint />
      {children({ content, save })}
    </div>
  );
}

export { InlineEditText, InlineEditCode };
