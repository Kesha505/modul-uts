import Link from 'next/link';

const topics = [
  {
    href: '/materi/hanoi',
    icon: '🗼',
    num: '01',
    title: 'Menara Hanoi',
    desc: 'Pelajari rekursi klasik: memindahkan piringan antar tiang dengan prinsip induksi matematis.',
    complexity: 'O(2ⁿ)',
    cardClass: 'home-card-1',
    color: '#6366f1',
    tags: ['Rekursi', 'Induksi', 'Divide & Conquer'],
  },
  {
    href: '/materi/palindrom',
    icon: '🔄',
    num: '02',
    title: 'Palindrom',
    desc: 'String dan angka yang sama dibaca dari depan maupun belakang. Teknik two pointers efisien.',
    complexity: 'O(n)',
    cardClass: 'home-card-2',
    color: '#06b6d4',
    tags: ['String', 'Two Pointers', 'Reverse'],
  },
  {
    href: '/materi/prima',
    icon: '🔢',
    num: '03',
    title: 'Bilangan Prima',
    desc: 'Deteksi prima dengan cek hingga √n dan Sieve of Eratosthenes untuk semua prima ≤ n.',
    complexity: 'O(√n)',
    cardClass: 'home-card-3',
    color: '#10b981',
    tags: ['Number Theory', 'Sieve', 'Optimasi'],
  },
  {
    href: '/materi/pascal',
    icon: '🔺',
    num: '04',
    title: 'Segitiga Pascal',
    desc: 'Koefisien binomial dalam pola segitiga. Fondasi kombinatorika dan ekspansi binomial.',
    complexity: 'C(n,k)',
    cardClass: 'home-card-4',
    color: '#f59e0b',
    tags: ['Kombinatorika', 'DP', 'Binomial'],
  },
];

export default function HomePage() {
  return (
    <div className="page-container fade-in-up">
      {/* Hero */}
      <div className="page-hero">
        <div
          className="topic-tag"
          style={{
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#a5b4fc',
          }}
        >
          📖 Modul Pembelajaran UTS
        </div>
        <h1 className="page-title">
          Algoritma &{' '}
          <span className="gradient-text">Rekursi</span>
        </h1>
        <p className="page-description">
          Empat topik esensial matematika diskrit dan algoritma yang sering muncul dalam
          ujian dan wawancara teknis. Pelajari teori, rumus, dan implementasi Dart-nya!
        </p>
        <div className="meta-chips">
          <span className="meta-chip">🎓 4 Materi Inti</span>
          <span className="meta-chip">🎯 Kode Dart</span>
          <span className="meta-chip">📐 Analisis Kompleksitas</span>
          <span className="meta-chip">🧮 Bukti Matematis</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">4</div>
          <div className="stat-label">Topik Materi</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">O(2ⁿ)</div>
          <div className="stat-label">Kompleksitas Tersulit</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Dart</div>
          <div className="stat-label">Bahasa Implementasi</div>
        </div>
      </div>

      {/* Topic Cards */}
      <div className="home-grid">
        {topics.map((topic) => (
          <Link key={topic.href} href={topic.href} className={`home-card ${topic.cardClass}`}>
            <span className="home-card-icon">{topic.icon}</span>
            <div
              className="home-card-num"
              style={{ color: topic.color }}
            >
              MATERI {topic.num}
            </div>
            <div className="home-card-title">{topic.title}</div>
            <div className="home-card-desc">{topic.desc}</div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
              {topic.tags.map((tag) => (
                <span
                  key={tag}
                  className="meta-chip"
                  style={{ fontSize: 11, padding: '3px 8px' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="home-card-footer">
              <span
                className="home-card-complexity complexity-badge"
                style={{ color: topic.color, borderColor: `${topic.color}40`, background: `${topic.color}15` }}
              >
                {topic.complexity}
              </span>
              <span className="home-card-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        className="card"
        style={{
          marginTop: 24,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08))',
          border: '1px solid rgba(99,102,241,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            🚀 Mulai dari Materi Pertama?
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Disarankan mengikuti urutan materi agar pemahaman lebih terstruktur.
          </div>
        </div>
        <Link href="/materi/hanoi" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
          Mulai Belajar →
        </Link>
      </div>
    </div>
  );
}
