'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    router.replace('/login');
  }

  const links = [
    { href: '/dashboard', label: 'DASHBOARD' },
    { href: '/produtos', label: 'PRODUTOS' },
    { href: '/movimentacoes', label: 'MOVIMENTAÇÕES' },
    { href: '/usuarios', label: 'USUÁRIOS' },
  ];

  return (
    <nav style={{ borderBottom: '1px solid #333', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 24 }}>
      <span style={{ fontWeight: 'bold', marginRight: 16 }}>TECHRENT</span>
      {links.map(l => (
        <Link
          key={l.href}
          href={l.href}
          style={{
            textDecoration: 'none',
            color: path === l.href ? '#fff' : '#666',
            borderBottom: path === l.href ? '1px solid #fff' : 'none',
            paddingBottom: 2,
          }}
        >
          {l.label}
        </Link>
      ))}
      <button
        onClick={logout}
        className="btn-outline"
        style={{ marginLeft: 'auto', padding: '4px 12px', fontSize: 12 }}
      >
        SAIR
      </button>
    </nav>
  );
}
