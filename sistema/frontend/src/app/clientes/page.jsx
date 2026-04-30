'use client';

import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/clientes`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setClientes(data);
        } else {
          console.error('Resposta inesperada do backend:', data);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar clientes:', error);
      });
  }, []);

  return (
    <main>
      <h1>Clientes</h1>
      <ul>
        {clientes.length > 0 ? (
          clientes.map(cliente => (
            <li key={cliente.id_usuario}>
              {cliente.nome} - {cliente.cpf_cnpj}
            </li>
          ))
        ) : (
          <li>Nenhum cliente encontrado.</li>
        )}
      </ul>
    </main>
  );
}
