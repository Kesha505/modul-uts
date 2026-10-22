'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../context/SidebarContext';

const pages = [
  { href: '/', label: 'Beranda' },
  { href: '/materi/hanoi', label: 'Menara Hanoi' },
  { href: '/materi/palindrom', label: 'Palindrom' },
  { href: '/materi/prima', label: 'Bilangan Prima' },
  { href: '/materi/pascal', label: 'Segitiga Pascal' },
];

export default function Topbar() {
  const pathname = usePathname();
  const current = pages.find((p) => p.href === pathname);
  const { toggle } = useSidebar();

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Hamburger button — mobile only */}
        <button
          className="hamburger-btn"
          onClick={toggle}
          aria-label="Buka menu navigasi"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <div className="topbar-breadcrumb">
          <span className="topbar-home-icon">📚</span>
          <span className="topbar-sep">›</span>
          <span className="topbar-breadcrumb-active">{current?.label ?? 'Halaman'}</span>
        </div>
      </div>

      <div className="topbar-actions">
        <a
          href="https://dart.dev"
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost topbar-btn-hide"
          style={{ fontSize: 12 }}
        >
          🎯 Dart Docs
        </a>
        <span
          className="btn btn-primary"
          style={{ cursor: 'default', fontSize: 12 }}
        >
          ✨ <span className="topbar-btn-label">Algoritma &amp; DS</span>
        </span>
      </div>
    </header>
  );
}
