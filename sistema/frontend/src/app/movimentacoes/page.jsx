'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

const EMPTY = { tipo_movimentacao: 'Entrada', quantidade: 1, data_movimentacao: new Date().toISOString().split('T')[0], id_produto: '', id_usuario: '' };

export default function MovimentacoesPage() {
  const router = useRouter();
  const [movs, setMovs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [msg, setMsg] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.replace('/login'); return; }
    carregar();
    api.get('/api/produtos?limite=100').then(d => setProdutos(d.produtos || [])).catch(() => {});
    api.get('/api/usuarios?limite=100').then(d => setUsuarios(d.usuarios || [])).catch(() => {});
  }, [pagina]);

  async function carregar() {
    setLoading(true);
    try {
      const d = await api.get(`/api/movimentacoes?pagina=${pagina}&limite=10`);
      setMovs(d.movimentacoes || []);
      setTotal(d.total || 0);
      setTotalPaginas(d.totalPaginas || 1);
    } catch { router.replace('/login'); }
    finally { setLoading(false); }
  }

  async function salvar(e) {
    e.preventDefault(); setErro(''); setMsg('');
    try {
      await api.post('/api/movimentacoes', { ...form, quantidade: parseInt(form.quantidade), id_produto: parseInt(form.id_produto), id_usuario: parseInt(form.id_usuario) });
      setMsg('Movimentação registrada.');
      setShowForm(false);
      setForm(EMPTY);
      carregar();
    } catch (err) { setErro(err.message); }
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 className="page-title" style={{ marginBottom: 0, borderBottom: 'none' }}>MOVIMENTAÇÕES ({total})</h1>
          <button onClick={() => { setShowForm(true); setErro(''); setMsg(''); }}>+ NOVA MOVIMENTAÇÃO</button>
        </div>

        {msg && <p className="success">{msg}</p>}
        {erro && <p className="error">{erro}</p>}

        {showForm && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ marginBottom: 12, fontSize: 15 }}>REGISTRAR MOVIMENTAÇÃO</h2>
            <form onSubmit={salvar}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>TIPO *</label>
                  <select value={form.tipo_movimentacao} onChange={e => setForm({ ...form, tipo_movimentacao: e.target.value })}>
                    <option value="Entrada">Entrada</option>
                    <option value="Saida">Saída</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>QUANTIDADE *</label>
                  <input type="number" min={1} value={form.quantidade} onChange={e => setForm({ ...form, quantidade: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>DATA *</label>
                  <input type="date" value={form.data_movimentacao} onChange={e => setForm({ ...form, data_movimentacao: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>PRODUTO *</label>
                  <select value={form.id_produto} onChange={e => setForm({ ...form, id_produto: e.target.value })} required>
                    <option value="">Selecione...</option>
                    {produtos.map(p => <option key={p.id_produto} value={p.id_produto}>{p.nome}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>USUÁRIO RESPONSÁVEL *</label>
                  <select value={form.id_usuario} onChange={e => setForm({ ...form, id_usuario: e.target.value })} required>
                    <option value="">Selecione...</option>
                    {usuarios.map(u => <option key={u.id_usuario} value={u.id_usuario}>{u.nome_usuario}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="submit">REGISTRAR</button>
                <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>CANCELAR</button>
              </div>
            </form>
          </div>
        )}

        {loading ? <p>Carregando...</p> : (
          <table>
            <thead>
              <tr><th>ID</th><th>TIPO</th><th>PRODUTO</th><th>QTD</th><th>DATA</th><th>USUÁRIO</th></tr>
            </thead>
            <tbody>
              {movs.map(m => (
                <tr key={m.id_movimentacao}>
                  <td>{m.id_movimentacao}</td>
                  <td style={{ color: m.tipo_movimentacao === 'Entrada' ? '#6f6' : '#f66' }}>{m.tipo_movimentacao.toUpperCase()}</td>
                  <td>{m.nome_produto || m.id_produto}</td>
                  <td>{m.quantidade}</td>
                  <td>{m.data_movimentacao ? m.data_movimentacao.split('T')[0] : '—'}</td>
                  <td>{m.nome_usuario || m.id_usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
          <button className="btn-outline" disabled={pagina <= 1} onClick={() => setPagina(p => p - 1)}>← ANTERIOR</button>
          <span style={{ color: '#888' }}>Página {pagina} de {totalPaginas}</span>
          <button className="btn-outline" disabled={pagina >= totalPaginas} onClick={() => setPagina(p => p + 1)}>PRÓXIMA →</button>
        </div>
      </div>
    </>
  );
}
