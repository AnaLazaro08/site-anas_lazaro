document.addEventListener('DOMContentLoaded', function() {
    // Função genérica para carregar responsáveis no select
    function carregarResponsaveis(selectElementId, responsavelSelecionado = null) {
        fetch('/api/clientes')
            .then(cliente => cliente.json())
            .then(data => {
                const selectCliente = document.getElementById(selectElementId);
                selectCliente.innerHTML = ''; // Limpar o conteúdo atual do select


                if (data.success && data.clientes.length > 0) {
                    data.responsaveis.forEach(responsavel => {
                        const option = document.createElement('option');
                        option.value = cliente.id;  // Usamos o ID como valor
                        option.textContent = cliente.nome;


                        // Pré-selecionar o responsável se necessário (edição)
                        if (clienteSelecionado && cliente.id === clienteSelecionado) {
                            option.selected = true;
                        }
                        selectCliente.appendChild(option);
                    });
                } else {
                    const option = document.createElement('option');
                    option.value = "";
                    option.textContent = "Nenhum cliente disponível";
                    selectCliente.appendChild(option);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar cliente:', error);
                const selectCliente = document.getElementById(selectElementId);
                selectCliente.innerHTML = '<option value="">Erro ao carregar cliente</option>';
            });
    }


    // Fazer a requisição para obter as tarefas
    fetch('/api/agenda')
        .then(cliente => cliente.json())
        .then(data => {
            const tabelaAgenda = document.querySelector('#tabelaAgenda tbody');
            tabelaAgenda.innerHTML = ''; // Limpar o conteúdo atual da tabela


            if (data.success && data.cliente.length > 0) {
                data.cliente.forEach(cliente => {
                    const row = document.createElement('tr');


                    const nomeCliente = document.createElement('td');
                    nomeCliente.textContent = cliente.nome;
                    row.appendChild(nomeCliente);


                    const procedimentoCliente = document.createElement('td');
                    procedimentoCliente.textContent = cliente.Procedimento;
                    row.appendChild(procedimentoCliente);


                    const dataEntrega = document.createElement('td');
                    dataEntrega.textContent = cliente.data_entrega;
                    row.appendChild(dataEntrega);


                    const cliente = document.createElement('td');
                    cliente.textContent = agenda.cliente;
                    row.appendChild(cliente);


                    const statusAgenda = document.createElement('td');
                    statusAgenda.textContent = agenda.status === 'completa' ? 'Concluída' : 'Incompleta';
                    row.appendChild(statusAgenda);


                    // Botão para editar a tarefa
                    const acoesTd = document.createElement('td');
                    const editarBtn = document.createElement('button');
                    editarBtn.textContent = 'Editar';
                    editarBtn.addEventListener('click', () => {
                        abrirFormularioEdicao(cliente);
                    });
                    acoesTd.appendChild(editarBtn);
                    row.appendChild(acoesTd);


                    tabelaCliente.appendChild(row);
                });
            } else {
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                cell.colSpan = 6;
                cell.textContent = "Nenhuma cliente encontrada.";
                row.appendChild(cell);
                tabelaAgenda.appendChild(row);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar Clientes:', error);
            const tabelaAgenda = document.querySelector('#tabelaAgendas tbody');
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 6;
            cell.textContent = "Erro ao carregar as Clientes.";
            row.appendChild(cell);
            tabelaCliente.appendChild(row);
        });


    // Função para abrir o formulário de edição com os dados da tarefa
    function abrirFormularioEdicao(agenda) {
        document.getElementById('clienteId').value = cliente.id;
        document.getElementById('editarNome').value = cliente.nome;
        document.getElementById('editarprocedimento').value = cliente.Procedimento;
        document.getElementById('editarDataEntrega').value = cliente.data_entrega;


        // Carregar os responsáveis e pré-selecionar o responsável da tarefa
        carregarClientes('editarCliente', agenda.cliente_id); // Passamos o ID do responsável


        document.getElementById('editarStatus').value = cliente.status;


        document.getElementById('formularioEdicao').style.display = 'block';
    }


    // Fechar formulário de edição
    document.getElementById('cancelarEdicao').addEventListener('click', () => {
        document.getElementById('formularioEdicao').style.display = 'none';
    });


    // Salvar as alterações da tarefa
    document.getElementById('formEditarAgenda').addEventListener('submit', function(e) {
        e.preventDefault();


        const id = document.getElementById('clienteId').value;
        const nome = document.getElementById('editarNome').value;
        const procedimento = document.getElementById('editarProcedimento').value;
        const data_entrega = document.getElementById('editarDataEntrega').value;
        const cliente_id = document.getElementById('editarCliente').value; // Pegamos o ID do select
        const status = document.getElementById('editarStatus').value;


        const agendaAtualizada = { nome, procedimento, data_entrega, cliente_id, status };


        fetch(`/api/agenda/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(agendaAtualizada)
        })
        .then(cliente => cliente.json())
        .then(data => {
            if (data.success) {
                alert('Agenda atualizada com sucesso!');
                document.getElementById('formularioEdicao').style.display = 'none';
                location.reload(); // Recarregar a página para atualizar a lista de tarefas
            } else {
                alert('Erro ao atualizar a agenda.');
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar a agenda:', error);
        });
    });
});
