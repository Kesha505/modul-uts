'use client';

import Link from 'next/link';
import { PrimaEditor, InlineEditText, InlineEditCode } from '../../components/MateriEditor';

const sieveGrid = Array.from({ length: 30 }, (_, i) => i + 2);
const primes = [2,3,5,7,11,13,17,19,23,29];
const testNums = [{n:7,p:true},{n:10,p:false},{n:13,p:true},{n:20,p:false},{n:29,p:true}];

export default function PrimaContent() {
  return (
    <div className="page-container slide-in">
      <PrimaEditor>
        {({ content, save }) => (
          <>
            <div className="page-hero">
              <div className="topic-tag" style={{ background:'rgba(16,185,129,0.12)',border:'1px solid rgba(16,185,129,0.3)',color:'#6ee7b7' }}>🔢 Materi 03</div>
              <h1 className="page-title">
                Bilangan <span style={{ background:'linear-gradient(135deg,#10b981,#06b6d4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>Prima</span>
              </h1>
              <div className="page-description">
                <InlineEditText value={content.description} onSave={(v) => save('description', v)} multiline />
              </div> <div className="meta-chips">
                <span className="meta-chip">⚡ O(√n)</span>
                <span className="meta-chip">🔍 Sieve: O(n log log n)</span>
                <span className="meta-chip">📊 Number Theory</span>
              </div>
            </div>

            <div className="grid-2" style={{ marginBottom: 24 }}>
              <div className="card">
                <div className="card-title"><div className="card-icon" style={{ background:'rgba(16,185,129,0.15)' }}>📖</div>Definisi Prima</div>
                <div className="info-box info-green">
                  <div className="info-box-icon">✅</div>
                  <div><div className="info-box-title">Bilangan Prima</div><div className="info-box-text">Bilangan bulat p &gt; 1 yang faktor positifnya <strong>hanya 1 dan p sendiri</strong>. Contoh: 2, 3, 5, 7, 11...</div></div>
                </div>
                <div className="info-box info-yellow">
                  <div className="info-box-icon">⚠️</div>
                  <div><div className="info-box-title">Catatan Penting</div><div className="info-box-text">• <strong>1 bukan prima</strong><br/>• <strong>2 satu-satunya prima genap</strong></div></div>
                </div>
              </div>
              <div className="card">
                <div className="card-title"><div className="card-icon" style={{ background:'rgba(245,158,11,0.15)' }}>🧮</div>Kenapa Cek Sampai √n ?</div>
                <div className="formula-box">
                  <div className="formula-title">Bukti Matematis</div>
                  <div className="formula" style={{ whiteSpace:'pre-wrap' }}>
                    <InlineEditText value={content.formula} onSave={(v) => save('formula', v)} multiline style={{ fontFamily:'JetBrains Mono,monospace',fontSize:13 }} />
                  </div>
                </div>
                <div className="info-box info-blue">
                  <div className="info-box-icon">💡</div>
                  <div><div className="info-box-title">Kesimpulan</div><div className="info-box-text">Kalau tidak ada pembagi sampai √n, n <strong>pasti prima</strong>.</div></div>
                </div>
              </div>
            </div>

            {/* Sieve */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-title"><div className="card-icon" style={{ background:'rgba(99,102,241,0.15)' }}>🔭</div>Sieve of Eratosthenes (2–31)</div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
                {sieveGrid.map(n => {
                  const isPrime = primes.includes(n);
                  return (
                    <div key={n} style={{ width:46,height:46,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'JetBrains Mono',fontWeight:700,fontSize:14,border:`1px solid ${isPrime?'rgba(16,185,129,0.4)':'rgba(239,68,68,0.2)'}`,background:isPrime?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.06)',color:isPrime?'#34d399':'#f87171',textDecoration:isPrime?'none':'line-through',opacity:isPrime?1:0.55 }}>
                      {n}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Test numbers */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-title"><div className="card-icon" style={{ background:'rgba(6,182,212,0.15)' }}>✅</div>Uji dari data: &quot;7 10 13 20 29&quot;</div>
              <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
                {testNums.map(({n,p}) => (
                  <div key={n} style={{ padding:'12px 18px',borderRadius:10,border:`1px solid ${p?'rgba(16,185,129,0.35)':'rgba(239,68,68,0.35)'}`,background:p?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.08)',textAlign:'center',minWidth:70 }}>
                    <div style={{ fontFamily:'JetBrains Mono',fontSize:22,fontWeight:800,color:p?'#34d399':'#f87171' }}>{n}</div>
                    <div style={{ fontSize:11,fontWeight:600,color:p?'#34d399':'#f87171',marginTop:4 }}>{p?'✓ prima':'✗ bukan prima'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-title"><div className="card-icon" style={{ background:'rgba(16,185,129,0.15)' }}>💻</div>Implementasi Dart</div>
              <InlineEditCode value={content.code} onSave={(v) => save('code', v)} lang="DART" />
            </div>

            <div className="stat-grid" style={{ marginBottom: 24 }}>
              <div className="stat-card"><div className="stat-value">O(√n)</div><div className="stat-label">Cek Tunggal</div></div>
              <div className="stat-card"><div className="stat-value" style={{ fontSize:20 }}>O(n log log n)</div><div className="stat-label">Sieve</div></div>
              <div className="stat-card"><div className="stat-value" style={{ fontSize:16 }}>n / ln(n)</div><div className="stat-label">Jumlah Prima ≤ n</div></div>
            </div>

            <div className="page-nav">
              <Link href="/materi/palindrom" className="nav-arrow"><span>←</span><div><span className="nav-arrow-label">Sebelumnya</span><span className="nav-arrow-text">🔄 Palindrom</span></div></Link>
              <Link href="/materi/pascal" className="nav-arrow"><div style={{ textAlign:'right' }}><span className="nav-arrow-label">Berikutnya</span><span className="nav-arrow-text">Segitiga Pascal 🔺</span></div><span>→</span></Link>
            </div>
          </>
        )}
      </PrimaEditor>
    </div>
  );
}

