'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * DartRunner — menjalankan kode Dart secara nyata di browser.
 *
 * Flow:
 * 1. Kirim kode ke /api/run-dart (proxy ke DartPad compile API)
 * 2. DartPad mengembalikan compiled JavaScript
 * 3. Jalankan JS di sandboxed iframe
 * 4. Dart print() → dart2js menggunakan `dartPrint` hook → ditangkap
 * 5. Output dikirim ke parent via postMessage
 */
export default function DartRunner({ code, autoRunKey }) {
  const [output, setOutput] = useState(null);   // null = belum dijalankan
  const [running, setRunning] = useState(false);
  const [compileError, setCompileError] = useState(null);
  const iframeRef = useRef(null);
  const runIdRef = useRef(0);

  // Tangkap postMessage dari sandboxed iframe
  useEffect(() => {
    function onMessage(e) {
      const d = e.data;
      if (!d || d._dartRunnerId !== runIdRef.current) return;

      if (d.type === 'dart-ok') {
        setOutput(d.output ?? '(tidak ada output)');
        setRunning(false);
        setCompileError(null);
      } else if (d.type === 'dart-error') {
        setCompileError(d.message);
        setRunning(false);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Auto-run ketika kode berubah (dipicu dari luar via key)
  useEffect(() => {
    if (autoRunKey != null && autoRunKey > 0) {
      runCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRunKey]);

  const runCode = useCallback(async () => {
    if (!code?.trim() || running) return;

    const runId = ++runIdRef.current;
    setRunning(true);
    setOutput(null);
    setCompileError(null);

    try {
      const res = await fetch('/api/run-dart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      let result;
      try {
        result = await res.json();
      } catch {
        setCompileError('Server mengembalikan respons tidak valid. Coba lagi.');
        setRunning(false);
        return;
      }

      const { compiledJs, error } = result;

      if (error) {
        setCompileError(error);
        setRunning(false);
        return;
      }

      // Buat sandboxed HTML yang:
      // 1. Meng-intercept dartPrint (hook dari dart2js)
      // 2. Meng-intercept console.log (fallback dart2js)
      // 3. Mengirim output ke parent via postMessage setelah eksekusi
      const html = `<!DOCTYPE html><html><head><script>
var _id=${runId};
var _out=[];
// dart2js memanggil dartPrint jika didefinisikan
var dartPrint=function(s){_out.push(String(s))};
// Fallback: intercept console.log
var _origLog=console.log;
console.log=function(){
  var s=Array.prototype.slice.call(arguments).join(' ');
  if(typeof s==='string')_out.push(s);
  _origLog.apply(console,arguments);
};
window.onerror=function(msg,src,line,col,err){
  parent.postMessage({_dartRunnerId:_id,type:'dart-error',message:err?err.message:msg},'*');
  return true;
};
<\/script></head><body><script>
(function(){
try{
${compiledJs}
}catch(e){
  parent.postMessage({_dartRunnerId:_id,type:'dart-error',message:e.message},'*');
  return;
}
setTimeout(function(){
  parent.postMessage({_dartRunnerId:_id,type:'dart-ok',output:_out.join('\\n')},'*');
},400);
})();
<\/script></body></html>`;

      if (iframeRef.current) {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        iframeRef.current.src = url;
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      }
    } catch (err) {
      setCompileError('Network error: ' + err.message);
      setRunning(false);
    }
  }, [code, running]);

  return (
    <div>
      {/* Hidden iframe sandbox */}
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        style={{ display: 'none', width: 0, height: 0, border: 'none' }}
        title="dart-sandbox"
      />

      {/* Output panel */}
      <div
        style={{
          background: '#070d14',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '0 0 12px 12px',
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            borderBottom: output !== null || compileError ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Output
            </span>
            {running && (
              <span style={{ fontSize: 11, color: '#fbbf24', animation: 'pulse 1s infinite' }}>
                ⏳ Kompilasi &amp; menjalankan...
              </span>
            )}
            {output !== null && !running && !compileError && (
              <span style={{ fontSize: 11, color: '#34d399' }}>✓ Sukses</span>
            )}
            {compileError && !running && (
              <span style={{ fontSize: 11, color: '#f87171' }}>✗ Error</span>
            )}
          </div>
          <button
            onClick={runCode}
            disabled={running}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 6,
              background: running ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.15)',
              border: `1px solid ${running ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.35)'}`,
              color: running ? 'rgba(52,211,153,0.5)' : '#34d399',
              fontSize: 11,
              fontWeight: 700,
              cursor: running ? 'not-allowed' : 'pointer',
              touchAction: 'manipulation',
              transition: 'all 0.15s ease',
              userSelect: 'none',
            }}
          >
            {running ? '⏳' : '▶'} {running ? 'Menjalankan...' : 'Jalankan Kode'}
          </button>
        </div>

        {/* Output content */}
        {(output !== null || compileError) && (
          <div style={{ padding: '12px 16px' }}>
            {compileError ? (
              <pre
                style={{
                  fontFamily: "'JetBrains Mono', Consolas, monospace",
                  fontSize: 12,
                  color: '#fca5a5',
                  lineHeight: 1.7,
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                ⚠️ {compileError}
              </pre>
            ) : (
              <pre
                style={{
                  fontFamily: "'JetBrains Mono', Consolas, monospace",
                  fontSize: 13,
                  color: '#6ee7b7',
                  lineHeight: 1.9,
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {output}
              </pre>
            )}
          </div>
        )}

        {output === null && !compileError && !running && (
          <div style={{ padding: '10px 16px', fontSize: 11, color: 'var(--text-muted)' }}>
            Klik <strong>▶ Jalankan Kode</strong> untuk melihat output — atau simpan kode untuk auto-run.
          </div>
        )}
      </div>
    </div>
  );
}
