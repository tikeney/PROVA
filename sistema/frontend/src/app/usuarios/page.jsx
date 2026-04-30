'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

const EMPTY = { nome_usuario: '', login: '', senha: '' };

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
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
      const d = await api.get(`/api/usuarios?pagina=${pagina}&limite=10`);
      setUsuarios(d.usuarios || []);
      setTotal(d.total || 0);
      setTotalPaginas(d.totalPaginas || 1);
    } catch { router.replace('/login'); }
    finally { setLoading(false); }
  }

  function abrirNovo() { setForm(EMPTY); setEditId(null); setShowForm(true); setErro(''); setMsg(''); }
  function abrirEditar(u) {
    setForm({ nome_usuario: u.nome_usuario, login: u.login, senha: '' });
    setEditId(u.id_usuario); setShowForm(true); setErro(''); setMsg('');
  }

  async function salvar(e) {
    e.preventDefault(); setErro(''); setMsg('');
    try {
      const dados = { ...form };
      if (editId && !dados.senha) delete dados.senha;
      if (editId) {
        await api.put(`/api/usuarios/${editId}`, dados);
        setMsg('Usuário atualizado.');
      } else {
        await api.post('/api/auth/registro', dados);
        setMsg('Usuário criado.');
      }
      setShowForm(false); carregar();
    } catch (err) { setErro(err.message); }
  }

  async function excluir(id) {
    if (!confirm('Excluir usuário?')) return;
    try { await api.del(`/api/usuarios/${id}`); carregar(); }
    catch (err) { alert(err.message); }
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 className="page-title" style={{ marginBottom: 0, borderBottom: 'none' }}>USUÁRIOS ({total})</h1>
          <button onClick={abrirNovo}>+ NOVO USUÁRIO</button>
        </div>

        {msg && <p className="success">{msg}</p>}
        {erro && <p className="error">{erro}</p>}

        {showForm && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ marginBottom: 12, fontSize: 15 }}>{editId ? 'EDITAR USUÁRIO' : 'NOVO USUÁRIO'}</h2>
            <form onSubmit={salvar}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>NOME COMPLETO *</label>
                  <input value={form.nome_usuario} onChange={e => setForm({ ...form, nome_usuario: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>LOGIN *</label>
                  <input value={form.login} onChange={e => setForm({ ...form, login: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>SENHA {editId ? '(deixe vazio para manter)' : '*'}</label>
                  <input type="password" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} required={!editId} />
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
              <tr><th>ID</th><th>NOME</th><th>LOGIN</th><th>AÇÕES</th></tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id_usuario}>
                  <td>{u.id_usuario}</td>
                  <td>{u.nome_usuario}</td>
                  <td>{u.login}</td>
                  <td>
                    <button className="btn-outline" style={{ marginRight: 6, padding: '3px 10px', fontSize: 12 }} onClick={() => abrirEditar(u)}>EDITAR</button>
                    <button className="btn-danger" style={{ padding: '3px 10px', fontSize: 12 }} onClick={() => excluir(u.id_usuario)}>EXCLUIR</button>
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
