'use client';

import Link from 'next/link';
import { HanoiEditor, InlineEditText, InlineEditCode } from '../../components/MateriEditor';

export default function HanoiContent() {
  return (
    <div className="page-container slide-in">
      <HanoiEditor>
        {({ content, save }) => (
          <>
            {/* Hero */}
            <div className="page-hero">
              <div className="topic-tag" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
                🗼 Materi 01
              </div>
              <h1 className="page-title">
                Menara <span className="gradient-text">Hanoi</span>
              </h1>
              <div className="page-description">
                <InlineEditText
                  value={content.description}
                  onSave={(v) => save('description', v)}
                  multiline
                />
              </div>
              <div className="meta-chips">
                <span className="meta-chip">⚡ Kompleksitas: O(2ⁿ)</span>
                <span className="meta-chip">🔁 Rekursi</span>
                <span className="meta-chip">📐 Induksi Matematika</span>
              </div>
            </div>

            {/* Visual */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-title">
                <div className="card-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>🗼</div>
                Visualisasi Menara Hanoi (n = 3)
              </div>
              <div className="hanoi-visual">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 4, height: 120, background: 'linear-gradient(to top, #64748b, #94a3b8)', borderRadius: 2 }} />
                    <div style={{ position: 'absolute', bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <div className="hanoi-disk" style={{ width: 50, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>1</div>
                      <div className="hanoi-disk" style={{ width: 70, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>2</div>
                      <div className="hanoi-disk" style={{ width: 90, background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>3</div>
                    </div>
                  </div>
                  <div style={{ width: 90, height: 10, background: 'linear-gradient(135deg,#475569,#64748b)', borderRadius: 4, marginTop: -2 }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginTop: 10 }}>Tiang A</div>
                  <div style={{ fontSize: 11, color: 'var(--accent-purple)', fontWeight: 600 }}>Sumber</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{ width: 4, height: 120, background: 'linear-gradient(to top, #64748b, #94a3b8)', borderRadius: 2 }} />
                  <div style={{ width: 90, height: 10, background: 'linear-gradient(135deg,#475569,#64748b)', borderRadius: 4, marginTop: -2 }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginTop: 10 }}>Tiang B</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Bantuan</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{ width: 4, height: 120, background: 'linear-gradient(to top, #64748b, #94a3b8)', borderRadius: 2 }} />
                  <div style={{ width: 90, height: 10, background: 'linear-gradient(135deg,#475569,#64748b)', borderRadius: 4, marginTop: -2 }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginTop: 10 }}>Tiang C</div>
                  <div style={{ fontSize: 11, color: 'var(--accent-green)', fontWeight: 600 }}>Tujuan</div>
                </div>
              </div>
            </div>

            {/* Rules + Steps */}
            <div className="grid-2">
              <div className="card">
                <div className="card-title">
                  <div className="card-icon" style={{ background: 'rgba(59,130,246,0.15)' }}>📋</div>
                  Aturan Permainan
                </div>
                <div className="step-list">
                  {(content.rules || []).map((r, i) => (
                    <div key={i} className="step-item">
                      <div className="step-num" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>{i + 1}</div>
                      <div className="step-text">
                        <InlineEditText value={r} onSave={(v) => { const arr = [...content.rules]; arr[i] = v; save('rules', arr); }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-title">
                  <div className="card-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>🔁</div>
                  Ide Rekursif
                </div>
                <div className="step-list">
                  {(content.steps || []).map((s, i) => (
                    <div key={i} className="step-item">
                      <div className="step-num" style={{ background: 'rgba(99,102,241,0.15)', color: '#a78bfa' }}>{i + 1}</div>
                      <div className="step-text">
                        <InlineEditText value={s} onSave={(v) => { const arr = [...content.steps]; arr[i] = v; save('steps', arr); }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Math */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-title">
                <div className="card-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>🧮</div>
                Sisi Matematika
              </div>
              <div className="formula-box">
                <div className="formula-title">📐 Relasi Rekurens</div>
                <div className="formula" style={{ whiteSpace: 'pre-wrap' }}>
                  <InlineEditText value={content.formula} onSave={(v) => save('formula', v)} multiline style={{ whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono, monospace', fontSize: 15 }} />
                </div>
              </div>
              <div className="info-box info-purple">
                <div className="info-box-icon">✨</div>
                <div>
                  <div className="info-box-title">Bukti dengan Induksi Matematika</div>
                  <div className="info-box-text" style={{ whiteSpace: 'pre-wrap' }}>
                    <InlineEditText value={content.proof} onSave={(v) => save('proof', v)} multiline />
                  </div>
                </div>
              </div>
              <div className="stat-grid" style={{ marginBottom: 0, marginTop: 16 }}>
                <div className="stat-card"><div className="stat-value">7</div><div className="stat-label">Langkah (n=3)</div></div>
                <div className="stat-card"><div className="stat-value">1.023</div><div className="stat-label">Langkah (n=10)</div></div>
                <div className="stat-card"><div className="stat-value">O(2ⁿ)</div><div className="stat-label">Kompleksitas Waktu</div></div>
              </div>
            </div>

            {/* Code */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-title">
                <div className="card-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>💻</div>
                Implementasi Dart
              </div>
              <InlineEditCode
                value={content.code}
                onSave={(v) => save('code', v)}
                lang="DART"
              />
            </div>

            {/* Output */}
            <div className="info-box info-green" style={{ marginBottom: 24 }}>
              <div className="info-box-icon">▶️</div>
              <div>
                <div className="info-box-title">Output Program (n=3)</div>
                <div className="info-box-text" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 2 }}>
                  Pindah 1: A → C<br />Pindah 2: A → B<br />Pindah 1: C → B<br />
                  Pindah 3: A → C<br />Pindah 1: B → A<br />Pindah 2: B → C<br />
                  Pindah 1: A → C<br />Total: <strong>7 langkah</strong>
                </div>
              </div>
            </div>

            <div className="page-nav">
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>← Halaman pertama</span>
              <Link href="/materi/palindrom" className="nav-arrow">
                <div><span className="nav-arrow-label">Materi Berikutnya</span><span className="nav-arrow-text">Palindrom 🔄</span></div>
                <span>→</span>
              </Link>
            </div>
          </>
        )}
      </HanoiEditor>
    </div>
  );
}
