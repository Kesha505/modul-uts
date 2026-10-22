'use client';

import Link from 'next/link';
import { PalindromEditor, InlineEditText, InlineEditCode } from '../../components/MateriEditor';

const examples = [
  { word: 'katak', is: true }, { word: 'madam', is: true },
  { word: 'level', is: true }, { word: '12321', is: true },
  { word: 'kasur', is: false }, { word: 'hello', is: false },
];

export default function PalindromContent() {
  return (
    <div className="page-container slide-in">
      <PalindromEditor>
        {({ content, save }) => (
          <>
            <div className="page-hero">
              <div className="topic-tag" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#67e8f9' }}>
                🔄 Materi 02
              </div>
              <h1 className="page-title">
                <span style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Palindrom
                </span>
              </h1>
              <p className="page-description">
                <InlineEditText value={content.description} onSave={(v) => save('description', v)} multiline />
              </p>
              <div className="meta-chips">
                <span className="meta-chip">⚡ O(n)</span>
                <span className="meta-chip">🎯 Two Pointers</span>
                <span className="meta-chip">💾 O(1) Memory</span>
              </div>
            </div>

            {/* Two-pointer visual */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-title"><div className="card-icon" style={{ background: 'rgba(6,182,212,0.15)' }}>🔍</div>Definisi &amp; Contoh</div>
              <div style={{ background: '#0d1117', borderRadius: 12, padding: '28px 24px', marginBottom: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Teknik Two Pointers pada &quot;k a t a k&quot;</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, alignItems: 'center' }}>
                  {['k','a','t','a','k'].map((ch, i) => {
                    const isP = i===0||i===4, isM = i===2;
                    return (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ width:52,height:52,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,fontFamily:'JetBrains Mono',background:isP?'linear-gradient(135deg,rgba(6,182,212,0.3),rgba(59,130,246,0.3))':isM?'rgba(99,102,241,0.15)':'rgba(255,255,255,0.05)',border:`1px solid ${isP?'rgba(6,182,212,0.5)':isM?'rgba(99,102,241,0.3)':'rgba(255,255,255,0.08)'}`,color:isP?'#67e8f9':isM?'#a5b4fc':'var(--text-primary)'}}>
                          {ch}
                        </div>
                        <div style={{ fontSize:11,color:'var(--text-muted)',marginTop:6 }}>[{i}]</div>
                        {isP&&<div style={{ fontSize:10,color:'#67e8f9',marginTop:2,fontWeight:700 }}>{i===0?'← L':'R →'}</div>}
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize:12,color:'#67e8f9',marginTop:16,fontWeight:600 }}>✓ s[0]=s[4]=&apos;k&apos; | s[1]=s[3]=&apos;a&apos; | s[2]=&apos;t&apos; → PALINDROM</div>
              </div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:10 }}>
                {examples.map(ex => (
                  <div key={ex.word} style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'8px 14px',borderRadius:8,border:`1px solid ${ex.is?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'}`,background:ex.is?'rgba(16,185,129,0.08)':'rgba(239,68,68,0.08)' }}>
                    <span style={{ fontFamily:'JetBrains Mono',fontWeight:700 }}>&quot;{ex.word}&quot;</span>
                    <span style={{ fontSize:12,fontWeight:700,color:ex.is?'#34d399':'#f87171' }}>{ex.is?'✓ Palindrom':'✗ Bukan'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Math */}
            <div className="grid-2">
              <div className="card">
                <div className="card-title"><div className="card-icon" style={{ background:'rgba(245,158,11,0.15)' }}>🧮</div>Sisi Matematika (String)</div>
                <div className="formula-box">
                  <div className="formula-title">Kondisi Palindrom</div>
                  <div className="formula" style={{ whiteSpace:'pre-wrap' }}>
                    <InlineEditText value={content.formula} onSave={(v) => save('formula', v)} multiline style={{ fontFamily:'JetBrains Mono,monospace',fontSize:14 }} />
                  </div>
                </div>
                <div className="info-box info-blue">
                  <div className="info-box-icon">💡</div>
                  <div><div className="info-box-title">Cukup setengah string</div><div className="info-box-text">Jadi cukup membandingkan setengah string saja karena sifat simetris palindrom.</div></div>
                </div>
              </div>
              <div className="card">
                <div className="card-title"><div className="card-icon" style={{ background:'rgba(16,185,129,0.15)' }}>🔢</div>Sisi Matematika (Bilangan)</div>
                <div className="formula-box">
                  <div className="formula-title">Cara Membalik Angka</div>
                  <div className="formula" style={{ whiteSpace:'pre-wrap' }}>
                    <InlineEditText value={content.formulaNumber} onSave={(v) => save('formulaNumber', v)} multiline style={{ fontFamily:'JetBrains Mono,monospace',fontSize:13 }} />
                  </div>
                </div>
                <div className="info-box info-green">
                  <div className="info-box-icon">✨</div>
                  <div><div className="info-box-title">Contoh: 12321</div><div className="info-box-text">reverse(12321) = 12321 → ✓ Palindrom</div></div>
                </div>
              </div>
            </div>

            {/* Code */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-title"><div className="card-icon" style={{ background:'rgba(16,185,129,0.15)' }}>💻</div>Implementasi Dart</div>
              <InlineEditCode value={content.code} onSave={(v) => save('code', v)} lang="DART" />
            </div>

            <div className="info-box info-green" style={{ marginBottom: 24 }}>
              <div className="info-box-icon">▶️</div>
              <div>
                <div className="info-box-title">Output Program</div>
                <div className="info-box-text" style={{ fontFamily:'JetBrains Mono,monospace',fontSize:13,lineHeight:2 }}>bukan palindrom</div>
              </div>
            </div>

            <div className="stat-grid" style={{ marginBottom: 24 }}>
              <div className="stat-card"><div className="stat-value">O(n)</div><div className="stat-label">Kompleksitas Waktu</div></div>
              <div className="stat-card"><div className="stat-value">O(1)</div><div className="stat-label">Memori (Two Pointers)</div></div>
              <div className="stat-card"><div className="stat-value">n/2</div><div className="stat-label">Perbandingan Nyata</div></div>
            </div>

            <div className="page-nav">
              <Link href="/materi/hanoi" className="nav-arrow"><span>←</span><div><span className="nav-arrow-label">Sebelumnya</span><span className="nav-arrow-text">🗼 Hanoi</span></div></Link>
              <Link href="/materi/prima" className="nav-arrow"><div style={{ textAlign:'right' }}><span className="nav-arrow-label">Berikutnya</span><span className="nav-arrow-text">Bilangan Prima 🔢</span></div><span>→</span></Link>
            </div>
          </>
        )}
      </PalindromEditor>
    </div>
  );
}
