'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { subscribeMateri, saveField, DEFAULT_CONTENT } from '../lib/contentStore';
import { InlineEditText, InlineEditCode } from './InlineEditor';

/**
 * useMateriContent
 * - Langsung subscribe ke Firestore onSnapshot
 * - Update state INSTAN setiap ada perubahan dari siapapun
 * - Persis seperti Google Docs
 */
export function useMateriContent(slug) {
  const [content, setContent] = useState(DEFAULT_CONTENT[slug]);
  const [status, setStatus] = useState('loading');
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId || projectId === 'your_project_id_here') {
      setStatus('offline');
      return;
    }

    // Langsung subscribe — onSnapshot akan trigger tiap ada perubahan
    const unsub = subscribeMateri(
      slug,
      (data) => {
        // Dapat data baru dari Firestore (dari siapapun yang edit)
        setContent((prev) => ({ ...prev, ...data }));
        setStatus('live');
        if (data._updatedAt) {
          setLastSaved(data._updatedAt?.toDate?.() ?? new Date());
        }
      },
      (err) => {
        console.error('Firestore error:', err);
        setStatus('offline');
      }
    );

    return () => unsub();
  }, [slug]);

  const save = useCallback(
    async (field, value) => {
      // Update lokal dulu (optimistic update — UI instan)
      setContent((prev) => ({ ...prev, [field]: value }));

      if (status === 'live') {
        // Simpan ke Firestore → otomatis trigger onSnapshot di SEMUA user
        await saveField(slug, field, value);
        setLastSaved(new Date());
      }
    },
    [slug, status]
  );

  return { content, status, lastSaved, save };
}

/* ─── Live Badge ─── */
function LiveBadge({ status, lastSaved }) {
  const timeStr = lastSaved
    ? lastSaved.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 11,
        fontWeight: 600,
        padding: '5px 12px',
        borderRadius: 20,
        marginBottom: 14,
        background: status === 'live'
          ? 'rgba(16,185,129,0.12)'
          : status === 'offline'
          ? 'rgba(245,158,11,0.12)'
          : 'rgba(100,116,139,0.12)',
        border: `1px solid ${status === 'live' ? 'rgba(16,185,129,0.3)' : status === 'offline' ? 'rgba(245,158,11,0.3)' : 'rgba(100,116,139,0.2)'}`,
        color: status === 'live' ? '#34d399' : status === 'offline' ? '#fbbf24' : 'var(--text-muted)',
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          flexShrink: 0,
          background: status === 'live' ? '#34d399' : status === 'offline' ? '#fbbf24' : '#64748b',
          animation: status === 'live' ? 'pulse 2s infinite' : 'none',
        }}
      />
      {status === 'live'
        ? `🔴 Real-time aktif${timeStr ? ` · Tersimpan ${timeStr}` : ' · Perubahan sync ke semua user'}`
        : status === 'offline'
        ? '⚡ Mode Lokal · Setup Firebase untuk sync real-time'
        : '⏳ Menghubungkan ke Firebase...'}
    </div>
  );
}

/* ─── Edit Hint ─── */
function EditHint() {
  return (
    <div
      style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 20,
        padding: '7px 12px',
        background: 'rgba(99,102,241,0.06)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 8,
        flexWrap: 'wrap',
      }}
    >
      ✏️ <strong style={{ color: 'var(--text-secondary)' }}>Klik teks atau kode untuk edit</strong>
      <span style={{ color: 'var(--text-muted)' }}>— perubahan langsung tersimpan & muncul di semua pengguna</span>
    </div>
  );
}

/* ─── Generic MateriWrapper ─── */
function MateriWrapper({ slug, children }) {
  const { content, status, lastSaved, save } = useMateriContent(slug);
  return (
    <div>
      <LiveBadge status={status} lastSaved={lastSaved} />
      <EditHint />
      {children({ content, save })}
    </div>
  );
}

export function HanoiEditor({ children }) {
  return <MateriWrapper slug="hanoi">{children}</MateriWrapper>;
}
export function PalindromEditor({ children }) {
  return <MateriWrapper slug="palindrom">{children}</MateriWrapper>;
}
export function PrimaEditor({ children }) {
  return <MateriWrapper slug="prima">{children}</MateriWrapper>;
}
export function PascalEditor({ children }) {
  return <MateriWrapper slug="pascal">{children}</MateriWrapper>;
}

export { InlineEditText, InlineEditCode };
