'use client';

export default function Equipamentos() {
  // TODO: Buscar a lista de equipamentos do backend ao carregar a página
  // Dica: use useEffect + fetch para chamar GET /api/equipamentos

  // TODO: Criar um formulário para cadastrar novos equipamentos
  // Dica: os dados devem ser enviados via POST /api/equipamentos

  // TODO: Buscar os empréstimos em aberto ao carregar a página
  // Dica: use useEffect + fetch para chamar GET /api/emprestimos/em-aberto

  // TODO: Criar um formulário para registrar nova saída de equipamento
  // Dica: os dados devem ser enviados via POST /api/emprestimos
  //       Campos necessários: id_cliente, id_equipamento, data_prevista_devolucao

  return (
    <main>
      <h1>Equipamentos</h1>
      {/* TODO: Renderize a lista de equipamentos aqui */}
      {/* TODO: Adicione o formulário de cadastro aqui */}
      {/* Dica: exiba o status de cada equipamento (disponivel / emprestado) */}
      {/* // TODO: Adicionar um botão de DEVOLUÇÃO para cada empréstimo ativo
      // Dica: ao clicar, enviar PUT /api/emprestimos/:id/devolver */}
      {/* TODO: Renderize os empréstimos em aberto aqui */}
      {/* TODO: Adicione o formulário de novo empréstimo aqui */}

    </main>
  );
}
