'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * DartRunner — menjalankan kode Dart menggunakan DartPad embed.
 * - Klik "▶ Jalankan": tampilkan DartPad embed iframe langsung di halaman
 * - Klik "🔗 DartPad": buka di tab baru (selalu bekerja 100%)
 * - Saat kode disimpan (autoRunKey berubah): embed otomatis refresh
 */
export default function DartRunner({ code, autoRunKey }) {
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedKey, setEmbedKey] = useState(0);

  // Auto-tampilkan / refresh embed setiap kode disimpan
  useEffect(() => {
    if (autoRunKey > 0) {
      setShowEmbed(true);
      setEmbedKey((k) => k + 1); // force re-mount iframe dengan kode baru
    }
  }, [autoRunKey]);

  function openInDartpad() {
    const url = `https://dartpad.dev/?source=${encodeURIComponent(code ?? '')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '0 0 12px 12px',
      overflow: 'hidden',
      background: '#070d14',
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px', flexWrap: 'wrap', gap: 8,
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Output
        </span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {!showEmbed ? (
            <button
              onClick={() => { setShowEmbed(true); setEmbedKey((k) => k + 1); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '5px 14px', borderRadius: 6,
                background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)',
                color: '#34d399', fontSize: 11, fontWeight: 700,
                cursor: 'pointer', touchAction: 'manipulation',
              }}
            >▶ Jalankan Kode</button>
          ) : (
            <button
              onClick={() => setEmbedKey((k) => k + 1)}
              style={{
                padding: '5px 12px', borderRadius: 6,
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                color: '#34d399', fontSize: 11, fontWeight: 600,
                cursor: 'pointer', touchAction: 'manipulation',
              }}
            >🔄 Refresh</button>
          )}
          <button
            onClick={openInDartpad}
            style={{
              padding: '5px 12px', borderRadius: 6,
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
              color: '#a5b4fc', fontSize: 11, fontWeight: 600,
              cursor: 'pointer', touchAction: 'manipulation',
            }}
          >🔗 Buka di DartPad</button>
        </div>
      </div>

      {/* DartPad embed */}
      {showEmbed && <DartpadEmbed key={embedKey} code={code} />}

      {!showEmbed && (
        <div style={{ padding: '6px 14px 10px', fontSize: 11, color: 'var(--text-muted)' }}>
          Klik <strong style={{ color: '#34d399' }}>▶ Jalankan Kode</strong> — atau{' '}
          <span
            style={{ color: '#a5b4fc', cursor: 'pointer', fontWeight: 600 }}
            onClick={openInDartpad}
          >🔗 Buka di DartPad</span> untuk output interaktif di tab baru.
        </div>
      )}
    </div>
  );
}

/** DartPad embed iframe dengan kode diinjeksi via postMessage */
function DartpadEmbed({ code }) {
  const ref = useRef(null);

  function inject() {
    try {
      ref.current?.contentWindow?.postMessage(
        { type: 'sourceCode', sourceCode: code },
        'https://dartpad.dev'
      );
    } catch {/* iframe mungkin belum siap */}
  }

  return (
    <iframe
      ref={ref}
      src="https://dartpad.dev/embed-dart.html?theme=dark&null_safety=true&split=50&run=true"
      style={{ width: '100%', height: 380, border: 'none', display: 'block' }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      onLoad={() => setTimeout(inject, 800)}
      title="DartPad Runner"
    />
  );
}
