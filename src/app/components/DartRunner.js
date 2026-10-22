'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * DartRunner — menjalankan kode Dart menggunakan DartPad embed.
 *
 * Cara kerja:
 * 1. Buat iframe tersembunyi yang memuat DartPad embed
 * 2. Inject kode via postMessage ke DartPad
 * 3. Tunggu DartPad menjalankan dan emit hasil
 * 4. Tampilkan output di bawah code block
 *
 * Fallback: jika DartPad tidak merespons, tampilkan link ke DartPad online
 */
export default function DartRunner({ code, autoRunKey }) {
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [compileError, setCompileError] = useState(null);
  const [dartpadReady, setDartpadReady] = useState(false);
  const iframeRef = useRef(null);
  const runIdRef = useRef(0);
  const timeoutRef = useRef(null);

  // Bersihkan timeout saat unmount
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  // Dengarkan pesan dari DartPad iframe
  useEffect(() => {
    function onMessage(e) {
      if (!e.origin?.includes('dartpad.dev') && e.origin !== window.location.origin) return;

      const d = e.data;
      if (!d) return;

      // DartPad siap menerima perintah
      if (d.type === 'ready') {
        setDartpadReady(true);
      }

      // Hasil eksekusi
      if (d.type === 'execution-output' || d.type === 'stdout') {
        clearTimeout(timeoutRef.current);
        const text = d.stdout ?? d.output ?? '';
        setOutput((prev) => (prev === null ? text : prev + text));
        setRunning(false);
      }

      if (d.type === 'execution-error' || d.type === 'stderr') {
        clearTimeout(timeoutRef.current);
        setCompileError(d.stderr ?? d.error ?? 'Runtime error');
        setRunning(false);
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Auto-run ketika kode baru disimpan
  useEffect(() => {
    if (autoRunKey != null && autoRunKey > 0) {
      runCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRunKey]);

  const runCode = useCallback(async () => {
    if (!code?.trim() || running) return;

    runIdRef.current++;
    setRunning(true);
    setOutput(null);
    setCompileError(null);

    // Kirim kode ke DartPad embed via postMessage
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          { type: 'sourceCode', sourceCode: code },
          'https://dartpad.dev'
        );

        // Timeout 20 detik
        timeoutRef.current = setTimeout(() => {
          setRunning(false);
          setCompileError('Timeout — DartPad tidak merespons. Coba lagi atau buka di DartPad langsung.');
        }, 20000);
      } catch {
        // Fallback jika postMessage gagal
        setRunning(false);
        setOutput(null);
      }
    } else {
      // Iframe belum siap — reload
      if (iframeRef.current) {
        iframeRef.current.src = getDartpadUrl();
        setTimeout(() => setRunning(false), 2000);
      }
    }
  }, [code, running]);

  function getDartpadUrl() {
    return 'https://dartpad.dev/embed-dart.html?theme=dark&split=0&run=false';
  }

  // Buka DartPad di tab baru dengan kode
  function openInDartpad() {
    const encoded = encodeURIComponent(code ?? '');
    // DartPad new embed URL
    const url = `https://dartpad.dev/?theme=dark&source=${encoded}`;
    window.open(url, '_blank', 'noopener');
  }

  return (
    <div>
      {/* DartPad iframe tersembunyi */}
      <iframe
        ref={iframeRef}
        src={getDartpadUrl()}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        style={{ display: 'none', width: 0, height: 0, border: 'none' }}
        title="dartpad-runner"
        onLoad={() => {
          // Setelah iframe load, inject kode
          setTimeout(() => {
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                { type: 'sourceCode', sourceCode: code },
                'https://dartpad.dev'
              );
            }
          }, 500);
        }}
      />

      {/* Output panel */}
      <div style={{ background: '#070d14', borderTop: '1px solid rgba(255,255,255,0.05)', borderRadius: '0 0 12px 12px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Output
            </span>
            {running && <span style={{ fontSize: 11, color: '#fbbf24' }}>⏳ Menjalankan...</span>}
            {output !== null && !running && !compileError && <span style={{ fontSize: 11, color: '#34d399' }}>✓ Sukses</span>}
            {compileError && !running && <span style={{ fontSize: 11, color: '#f87171' }}>✗ Error</span>}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {/* Buka di DartPad */}
            <button
              onClick={openInDartpad}
              title="Buka di DartPad online"
              style={{
                padding: '5px 10px',
                borderRadius: 6,
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.25)',
                color: '#a5b4fc',
                fontSize: 10,
                fontWeight: 600,
                cursor: 'pointer',
                touchAction: 'manipulation',
              }}
            >
              🔗 DartPad
            </button>
            {/* Jalankan */}
            <button
              onClick={runCode}
              disabled={running}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 12px',
                borderRadius: 6,
                background: running ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.15)',
                border: `1px solid ${running ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.35)'}`,
                color: running ? 'rgba(52,211,153,0.4)' : '#34d399',
                fontSize: 11,
                fontWeight: 700,
                cursor: running ? 'not-allowed' : 'pointer',
                touchAction: 'manipulation',
              }}
            >
              {running ? '⏳' : '▶'} {running ? 'Menjalankan...' : 'Jalankan'}
            </button>
          </div>
        </div>

        {/* Output content */}
        {(output !== null || compileError) && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            {compileError ? (
              <div>
                <pre style={{ fontFamily: "'JetBrains Mono',Consolas,monospace", fontSize: 12, color: '#fca5a5', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  ⚠️ {compileError}
                </pre>
                <button
                  onClick={openInDartpad}
                  style={{ marginTop: 8, padding: '5px 12px', borderRadius: 6, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                >
                  🔗 Buka di DartPad untuk debug
                </button>
              </div>
            ) : (
              <pre style={{ fontFamily: "'JetBrains Mono',Consolas,monospace", fontSize: 13, color: '#6ee7b7', lineHeight: 1.9, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {output}
              </pre>
            )}
          </div>
        )}

        {output === null && !compileError && !running && (
          <div style={{ padding: '8px 14px', fontSize: 11, color: 'var(--text-muted)' }}>
            Klik <strong style={{ color: '#34d399' }}>▶ Jalankan</strong> — atau <strong style={{ color: '#a5b4fc', cursor: 'pointer' }} onClick={openInDartpad}>🔗 buka di DartPad</strong> untuk output interaktif.
          </div>
        )}
      </div>
    </div>
  );
}
