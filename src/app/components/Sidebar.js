'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../context/SidebarContext';

const navItems = [
  {
    href: '/',
    icon: '🏠',
    label: 'Beranda',
    sub: 'Overview materi',
    num: null,
  },
  {
    href: '/materi/hanoi',
    icon: '🗼',
    label: 'Menara Hanoi',
    sub: 'Rekursi & Induksi',
    num: '01',
  },
  {
    href: '/materi/palindrom',
    icon: '🔄',
    label: 'Palindrom',
    sub: 'Two Pointers',
    num: '02',
  },
  {
    href: '/materi/prima',
    icon: '🔢',
    label: 'Bilangan Prima',
    sub: 'Sieve & √n Check',
    num: '03',
  },
  {
    href: '/materi/pascal',
    icon: '🔺',
    label: 'Segitiga Pascal',
    sub: 'Binomial & Rekurens',
    num: '04',
  },
];

const pageProgress = {
  '/': 0,
  '/materi/hanoi': 25,
  '/materi/palindrom': 50,
  '/materi/prima': 75,
  '/materi/pascal': 100,
};

export default function Sidebar() {
  const pathname = usePathname();
  const progress = pageProgress[pathname] ?? 0;
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={close} />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Mobile close button */}
        <button className="sidebar-close-btn" onClick={close} aria-label="Tutup menu">
          ✕
        </button>

        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">📚</div>
            <div>
              <div className="sidebar-logo-text">Modul UTS</div>
              <div className="sidebar-logo-sub">Algoritma &amp; Rekursi</div>
            </div>
          </div>
          <div className="sidebar-badge">
            <span>⚡</span> Informatika
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigasi</div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={close}
              >
                <div className="nav-icon">{item.icon}</div>
                <div className="nav-text">
                  <span className="nav-text-main">{item.label}</span>
                  <span className="nav-text-sub">{item.sub}</span>
                </div>
                {item.num && (
                  <div className="nav-number">{item.num}</div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="progress-info">
            <div className="progress-label">
              <span>Progress Materi</span>
              <span style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
