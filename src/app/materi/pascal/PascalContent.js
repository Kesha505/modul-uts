'use client';

import Link from 'next/link';
import { PascalEditor, InlineEditText, InlineEditCode } from '../../components/MateriEditor';

function generatePascal(rows) {
  const tri = [[1]];
  for (let i = 1; i < rows; i++) {
    const prev = tri[i-1], row = [1];
    for (let j = 1; j < prev.length; j++) row.push(prev[j-1]+prev[j]);
    row.push(1); tri.push(row);
  }
  return tri;
}

const pascalRows = generatePascal(7);
const rowColors = ['#6366f1','#8b5cf6','#3b82f6','#06b6d4','#10b981','#f59e0b','#ef4444'];

export default function PascalContent() {
  return (
    <div className="page-container slide-in">
      <PascalEditor>
        {({ content, save }) => (
          <>
            <div className="page-hero">
              <div className="topic-tag" style={{ background:'rgba(245,158,11,0.12)',border:'1px solid rgba(245,158,11,0.3)',color:'#fcd34d' }}>🔺 Materi 04</div>
              <h1 className="page-title">
                Segitiga <span style={{ background:'linear-gradient(135deg,#f59e0b,#ef4444)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>Pascal</span>
              </h1>
              <div className="page-description">
                <InlineEditText value={content.description} onSave={(v) => save('description', v)} multiline />
              </div> <div className="meta-chips">
                <span className="meta-chip">🧮 C(n,k) = n!/(k!(n−k)!)</span>
                <span className="meta-chip">📊 Kombinatorika</span>
              </div>
            </div>

            {/* Triangle visual */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-title"><div className="card-icon" style={{ background:'rgba(245,158,11,0.15)' }}>🔺</div>Visualisasi Segitiga Pascal (Baris 0–6)</div>
              <div className="pascal-visual">
                {pascalRows.map((row, ri) => (
                  <div key={ri} className="pascal-row">
                    {row.map((val, ci) => (
                      <div key={ci} className="pascal-cell" style={{ background:`${rowColors[ri]}18`,borderColor:`${rowColors[ri]}35`,color:rowColors[ri],minWidth:val>99?52:42 }}>{val}</div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ display:'flex',gap:16,justifyContent:'center',marginTop:16,flexWrap:'wrap' }}>
                {rowColors.map((c,i) => <span key={i} style={{ fontSize:12,color:c,fontWeight:600 }}>Baris {i}: Σ=2<sup>{i}</sup>={Math.pow(2,i)}</span>)}
              </div>
            </div>

            {/* Rules + Math */}
            <div className="grid-2">
              <div className="card">
                <div className="card-title"><div className="card-icon" style={{ background:'rgba(99,102,241,0.15)' }}>📋</div>Aturan Pembentukan</div>
                <div className="step-list">
                  <div className="step-item"><div className="step-num" style={{ background:'rgba(99,102,241,0.15)',color:'#a78bfa' }}>1</div><div className="step-text">Tepi kiri dan kanan selalu <strong>1</strong></div></div>
                  <div className="step-item"><div className="step-num" style={{ background:'rgba(99,102,241,0.15)',color:'#a78bfa' }}>2</div><div className="step-text">Setiap angka = <strong>jumlah dua angka di atasnya</strong></div></div>
                </div>
                <div className="formula-box" style={{ marginTop:16,marginBottom:0 }}>
                  <div className="formula-title">Rekurens Pascal</div>
                  <div className="formula" style={{ whiteSpace:'pre-wrap' }}>
                    <InlineEditText value={content.formula} onSave={(v) => save('formula', v)} multiline style={{ fontFamily:'JetBrains Mono,monospace',fontSize:13 }} />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-title"><div className="card-icon" style={{ background:'rgba(245,158,11,0.15)' }}>🧮</div>Sisi Matematika</div>
                <div className="info-box info-purple" style={{ marginBottom:8 }}>
                  <div className="info-box-icon">🎯</div>
                  <div><div className="info-box-title">Contoh C(4,2)</div><div className="info-box-text">C(4,2) = 4!/(2!·2!) = 24/4 = <strong>6</strong><br/>Baris 4: 1, 4, <strong>6</strong>, 4, 1 ✓</div></div>
                </div>
                <div className="info-box info-green" style={{ marginBottom:0 }}>
                  <div className="info-box-icon">∑</div>
                  <div>
                    <div className="info-box-title">Sifat-sifat</div>
                    <div className="info-box-text">
                      {(content.properties || []).map((p, i) => (
                        <div key={i}>• <InlineEditText value={p} onSave={(v) => { const arr = [...content.properties]; arr[i]=v; save('properties', arr); }} /></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Binomial */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-title"><div className="card-icon" style={{ background:'rgba(6,182,212,0.15)' }}>🔢</div>Ekspansi (a+b)³ — Baris 1 3 3 1</div>
              <div className="formula-box">
                <div className="formula-title">Dari Baris 3: 1, 3, 3, 1</div>
                <div className="formula" style={{ whiteSpace:'pre-wrap' }}>
                  <InlineEditText value={content.binomial} onSave={(v) => save('binomial', v)} multiline style={{ fontFamily:'JetBrains Mono,monospace',fontSize:14 }} />
                </div>
              </div>
            </div>

            {/* Code */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-title"><div className="card-icon" style={{ background:'rgba(16,185,129,0.15)' }}>💻</div>Implementasi Dart</div>
              <InlineEditCode value={content.code} onSave={(v) => save('code', v)} lang="DART" />
            </div>

            {/* Output */}
            <div className="info-box info-green" style={{ marginBottom: 24 }}>
              <div className="info-box-icon">▶️</div>
              <div>
                <div className="info-box-title">Output Program</div>
                <div className="info-box-text" style={{ fontFamily:'JetBrains Mono,monospace',fontSize:12,lineHeight:2 }}>
                  1<br/>1 1<br/>1 2 1<br/>1 3 3 1<br/>1 4 6 4 1<br/>1 5 10 10 5 1
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-title"><div className="card-icon" style={{ background:'rgba(99,102,241,0.15)' }}>📊</div>Ringkasan Semua Topik</div>
              <table className="summary-table">
                <thead><tr><th>Topik</th><th>Konsep Kunci</th><th>Kompleksitas</th></tr></thead>
                <tbody>
                  <tr><td><span className="table-topic">🗼 Hanoi</span></td><td>Rekursi</td><td><span className="complexity-badge">T(n)=2ⁿ−1, O(2ⁿ)</span></td></tr>
                  <tr><td><span className="table-topic">🔄 Palindrom</span></td><td>Two pointers</td><td><span className="complexity-badge">O(n)</span></td></tr>
                  <tr><td><span className="table-topic">🔢 Prima</span></td><td>Sieve, √n</td><td><span className="complexity-badge">O(√n)</span></td></tr>
                  <tr><td><span className="table-topic">🔺 Pascal</span></td><td>Rekurens / binomial</td><td><span className="complexity-badge">C(n,k)=C(n-1,k-1)+C(n-1,k)</span></td></tr>
                </tbody>
              </table>
            </div>

            <div className="card" style={{ background:'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(239,68,68,0.08))',border:'1px solid rgba(245,158,11,0.2)',textAlign:'center',padding:36,marginBottom:24 }}>
              <div style={{ fontSize:40,marginBottom:12 }}>🎉</div>
              <div style={{ fontSize:22,fontWeight:800,marginBottom:8 }}>Selamat! Semua Materi Selesai</div>
              <div style={{ fontSize:14,color:'var(--text-secondary)',maxWidth:500,margin:'0 auto' }}>Kamu sudah mempelajari 4 topik inti. Edit dan perbarui materi kapan saja langsung di halaman ini!</div>
              <Link href="/" className="btn btn-primary" style={{ display:'inline-flex',marginTop:20 }}>← Kembali ke Beranda</Link>
            </div>

            <div className="page-nav">
              <Link href="/materi/prima" className="nav-arrow"><span>←</span><div><span className="nav-arrow-label">Sebelumnya</span><span className="nav-arrow-text">🔢 Bilangan Prima</span></div></Link>
              <span style={{ color:'var(--text-muted)',fontSize:13 }}>Materi terakhir ✓</span>
            </div>
          </>
        )}
      </PascalEditor>
    </div>
  );
}

