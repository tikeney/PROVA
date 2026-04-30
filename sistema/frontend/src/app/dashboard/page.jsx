'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [estoqueBaixo, setEstoqueBaixo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.replace('/login'); return; }
    Promise.all([
      api.get('/api/produtos?limite=1'),
      api.get('/api/movimentacoes?limite=1'),
      api.get('/api/usuarios?limite=1'),
      api.get('/api/produtos/estoque-baixo'),
    ]).then(([p, m, u, eb]) => {
      setStats({ produtos: p.total, movimentacoes: m.total, usuarios: u.total });
      setEstoqueBaixo(eb.produtos || []);
    }).catch(() => router.replace('/login'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><div className="page">Carregando...</div></>;

  return (
    <>
      <Navbar />
      <div className="page">
        <h1 className="page-title">DASHBOARD</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'PRODUTOS', value: stats?.produtos },
            { label: 'MOVIMENTAÇÕES', value: stats?.movimentacoes },
            { label: 'USUÁRIOS', value: stats?.usuarios },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 'bold' }}>{s.value ?? '—'}</div>
              <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>ESTOQUE BAIXO / CRÍTICO</h2>
        {estoqueBaixo.length === 0 ? (
          <p style={{ color: '#666' }}>Nenhum produto com estoque baixo.</p>
        ) : (
          <table>
            <thead>
              <tr><th>ID</th><th>NOME</th><th>ESTOQUE ATUAL</th><th>ESTOQUE MÍNIMO</th></tr>
            </thead>
            <tbody>
              {estoqueBaixo.map(p => (
                <tr key={p.id_produto}>
                  <td>{p.id_produto}</td>
                  <td>{p.nome}</td>
                  <td style={{ color: p.estoque_atual === 0 ? '#f66' : '#f90' }}>{p.estoque_atual}</td>
                  <td>{p.estoque_minimo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
