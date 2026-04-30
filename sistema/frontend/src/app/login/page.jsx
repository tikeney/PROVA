'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ login: '', senha: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const data = await api.post('/api/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      router.replace('/dashboard');
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 320, border: '1px solid #333', padding: 32 }}>
        <h1 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
          TECHRENT — LOGIN
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>LOGIN</label>
            <input
              type="text"
              value={form.login}
              onChange={e => setForm({ ...form, login: e.target.value })}
              placeholder="seu.login"
              required
            />
          </div>
          <div className="form-group">
            <label>SENHA</label>
            <input
              type="password"
              value={form.senha}
              onChange={e => setForm({ ...form, senha: e.target.value })}
              placeholder="••••••"
              required
            />
          </div>
          {erro && <p className="error">{erro}</p>}
          <button type="submit" style={{ width: '100%', marginTop: 16 }} disabled={loading}>
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </div>
  );
}
