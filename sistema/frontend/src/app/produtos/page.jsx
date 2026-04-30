'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

const EMPTY = { nome: '', descricao: '', unidade_medida: '', estoque_atual: 0, estoque_minimo: 0, data_validade: '', caracteristica_variacao: '' };

export default function ProdutosPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.replace('/login'); return; }
    carregar();
  }, [pagina]);

  async function carregar() {
    setLoading(true);
    try {
      const d = await api.get(`/api/produtos?pagina=${pagina}&limite=10`);
      setProdutos(d.produtos || []);
      setTotal(d.total || 0);
      setTotalPaginas(d.totalPaginas || 1);
    } catch { router.replace('/login'); }
    finally { setLoading(false); }
  }

  function abrirNovo() { setForm(EMPTY); setEditId(null); setShowForm(true); setErro(''); setMsg(''); }
  function abrirEditar(p) {
    setForm({
      nome: p.nome || '', descricao: p.descricao || '', unidade_medida: p.unidade_medida || '',
      estoque_atual: p.estoque_atual ?? 0, estoque_minimo: p.estoque_minimo ?? 0,
      data_validade: p.data_validade ? p.data_validade.split('T')[0] : '',
      caracteristica_variacao: p.caracteristica_variacao || ''
    });
    setEditId(p.id_produto); setShowForm(true); setErro(''); setMsg('');
  }

  async function salvar(e) {
    e.preventDefault(); setErro(''); setMsg('');
    try {
      if (editId) {
        await api.put(`/api/produtos/${editId}`, form);
        setMsg('Produto atualizado.');
      } else {
        await api.post('/api/produtos', form);
        setMsg('Produto criado.');
      }
      setShowForm(false); carregar();
    } catch (err) { setErro(err.message); }
  }

  async function excluir(id) {
    if (!confirm('Excluir produto?')) return;
    try { await api.del(`/api/produtos/${id}`); carregar(); }
    catch (err) { alert(err.message); }
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 className="page-title" style={{ marginBottom: 0, borderBottom: 'none' }}>PRODUTOS ({total})</h1>
          <button onClick={abrirNovo}>+ NOVO PRODUTO</button>
        </div>

        {msg && <p className="success">{msg}</p>}
        {erro && <p className="error">{erro}</p>}

        {showForm && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ marginBottom: 12, fontSize: 15 }}>{editId ? 'EDITAR PRODUTO' : 'NOVO PRODUTO'}</h2>
            <form onSubmit={salvar}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>NOME *</label>
                  <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>UNIDADE DE MEDIDA</label>
                  <input value={form.unidade_medida} onChange={e => setForm({ ...form, unidade_medida: e.target.value })} placeholder="ex: Saco, Lata, Barra" />
                </div>
                <div className="form-group">
                  <label>ESTOQUE ATUAL</label>
                  <input type="number" value={form.estoque_atual} onChange={e => setForm({ ...form, estoque_atual: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="form-group">
                  <label>ESTOQUE MÍNIMO *</label>
                  <input type="number" value={form.estoque_minimo} onChange={e => setForm({ ...form, estoque_minimo: parseInt(e.target.value) || 0 })} required />
                </div>
                <div className="form-group">
                  <label>DATA DE VALIDADE</label>
                  <input type="date" value={form.data_validade} onChange={e => setForm({ ...form, data_validade: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>VARIAÇÃO / CARACTERÍSTICA</label>
                  <input value={form.caracteristica_variacao} onChange={e => setForm({ ...form, caracteristica_variacao: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>DESCRIÇÃO</label>
                  <textarea rows={2} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="submit">SALVAR</button>
                <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>CANCELAR</button>
              </div>
            </form>
          </div>
        )}

        {loading ? <p>Carregando...</p> : (
          <table>
            <thead>
              <tr><th>ID</th><th>NOME</th><th>UNIDADE</th><th>ESTOQUE</th><th>MÍN.</th><th>VALIDADE</th><th>AÇÕES</th></tr>
            </thead>
            <tbody>
              {produtos.map(p => (
                <tr key={p.id_produto}>
                  <td>{p.id_produto}</td>
                  <td>{p.nome}</td>
                  <td>{p.unidade_medida || '—'}</td>
                  <td style={{ color: p.estoque_atual <= p.estoque_minimo ? '#f90' : '#fff' }}>{p.estoque_atual}</td>
                  <td>{p.estoque_minimo}</td>
                  <td>{p.data_validade ? p.data_validade.split('T')[0] : '—'}</td>
                  <td>
                    <button className="btn-outline" style={{ marginRight: 6, padding: '3px 10px', fontSize: 12 }} onClick={() => abrirEditar(p)}>EDITAR</button>
                    <button className="btn-danger" style={{ padding: '3px 10px', fontSize: 12 }} onClick={() => excluir(p.id_produto)}>EXCLUIR</button>
                  </td>
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
