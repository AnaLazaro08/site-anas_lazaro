const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;


// Middleware para servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));


// Middleware para processar dados enviados via formulário (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
// Middleware para processar JSON
app.use(express.json());


// Rota para exibir o formulário de cadastro de responsável (responsavel.html)
app.get('/clientes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cliente.html'));
});


app.get('/agenda', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'agendar.html'));
});


app.get('/editaragenda', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'editaragenda.html'));
});


// Rota GET para buscar os responsáveis e retornar em JSON
app.get('/api/clientes', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'cliente.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo de cliente:', err);
            return res.status(500).json({ success: false, message: 'Erro ao obter cliente.' });
        }


        try {
            const clientes = JSON.parse(data);
            return res.status(200).json({ success: true, clientes });
        } catch (parseError) {
            console.error('Erro ao fazer o parsing do JSON:', parseError);
            return res.status(500).json({ success: false, message: 'Erro ao processar os clientes.' });
        }
    });
});


app.get('/api/agenda', (req, res) => {
    const tarefasFilePath = path.join(__dirname, 'data', 'agenda.json');


    fs.readFile(agendaFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo de agenda:', err);
            return res.status(500).json({ success: false, message: 'Erro ao processar as agenda.' });
        }


        let agenda = [];
        try {
            if (data) {
                agenda = JSON.parse(data);
            }
        } catch (parseError) {
            console.error('Erro ao fazer o parsing do arquivo de agenda:', parseError);
            return res.status(500).json({ success: false, message: 'Erro ao processar as agenda.' });
        }


        return res.status(200).json({ success: true, agenda });
    });
});


// Rota POST para cadastrar um responsável e salvar no arquivo JSON
app.post('/Cadclientes', (req, res) => {
    const { nome, email } = req.body;


    if (!nome) {
        return res.status(400).json({ success: false, message: 'Nome do cliente é obrigatório.' });
    }


    const filePath = path.join(__dirname, 'data', 'cliente.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);
            return res.status(500).json({ success: false, message: 'Erro ao processar o cadastro.' });
        }


        const clientes = JSON.parse(data);


        const novoCliente = {
            id: clientes.length + 1,
            nome: nome,
            email: email || '' // Se o email não for fornecido, será uma string vazia
        };


        clientes.push(novoCliente);


        fs.writeFile(filePath, JSON.stringify(clientes, null, 2), (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo JSON:', err);
                return res.status(500).json({ success: false, message: 'Erro ao salvar o cliente.' });
            }


            return res.status(200).json({ success: true, message: 'Cliente cadastrado com sucesso!' });
        });
    });
});


// Rota POST para cadastrar uma nova agendamento
app.post('/agenda', (req, res) => {
    const { nome, procedimento, data_entrega, cliente_id, status } = req.body;


    if (!nome || !procedimento || !data_entrega || !cliente_id) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
    }


    const clientesFilePath = path.join(__dirname, 'data', 'cliente.json');


    fs.readFile(clientesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo de clientes:', err);
            return res.status(500).json({ success: false, message: 'Erro ao processar os clientes.' });
        }


        let clientes;
        try {
           clientes = JSON.parse(data);
        } catch (parseError) {
            console.error('Erro ao fazer o parsing do JSON de clientes:', parseError);
            return res.status(500).json({ success: false, message: 'Erro ao processar os clientes.' });
        }


        const cliente = clientes.find(r => r.id === parseInt(cliente_id, 10));
        if (!cliente) {
            return res.status(400).json({ success: false, message: 'Cliente não encontrado.' });
        }


        const agendaFilePath = path.join(__dirname, 'data', 'agenda.json');


        fs.readFile(agendaFilePath, 'utf8', (err, data) => {
            let agenda = [];
            if (!err && data) {
                try {
                    agenda = JSON.parse(data);
                } catch (parseError) {
                    console.error('Erro ao fazer o parsing do JSON de agenda:', parseError);
                    return res.status(500).json({ success: false, message: 'Erro ao processar a agenda.' });
                }
            }


            const novaAgenda = {
                id: agenda.length + 1,
                nome,
                procedimento,
                data_entrega,
                cliente: cliente.nome,
                status: status || 'incompleta'
            };


            agenda.push(novaAgenda);


            fs.writeFile(agendaFilePath, JSON.stringify(agenda, null, 2), (err) => {
                if (err) {
                    console.error('Erro ao salvar a agenda:', err);
                    return res.status(500).json({ success: false, message: 'Erro ao salvar a agenda.' });
                }


                return res.status(200).json({ success: true, message: 'Agenda cadastrada com sucesso!' });
            });
        });
    });
});


// Rota PUT para editar uma tarefa existente
app.put('/api/agenda/:id', (req, res) => {
    const { id } = req.params;
    const { nome, procedimento, data_entrega, cliente, status } = req.body;


    const agendaFilePath = path.join(__dirname, 'data', 'agenda.json');


    fs.readFile(agendaFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo de agenda:', err);
            return res.status(500).json({ success: false, message: 'Erro ao processar a agenda.' });
        }


        let agenda = [];
        try {
            if (data) {
                agenda = JSON.parse(data);
            }
        } catch (parseError) {
            console.error('Erro ao fazer o parsing do arquivo de agenda:', parseError);
            return res.status(500).json({ success: false, message: 'Erro ao processar a agenda.' });
        }


        const agendaIndex = agenda.findIndex(agenda => agenda.id === parseInt(id, 10));
        if (agendaIndex === -1) {
            return res.status(404).json({ success: false, message: 'Agenda não encontrada.' });
        }


        // Atualizar os dados da agenda
        agenda[agendaIndex] = {
            ...agenda[agendaIndex],
            nome,
            procedimento,
            data_entrega,
            cliente,
            status
        };


        // Salvar as alterações no arquivo JSON
        fs.writeFile(agendaFilePath, JSON.stringify(agenda, null, 2), (err) => {
            if (err) {
                console.error('Erro ao salvar a agenda atualizada:', err);
                return res.status(500).json({ success: false, message: 'Erro ao salvar a agenda atualizada.' });
            }


            return res.status(200).json({ success: true, message: 'Agenda atualizada com sucesso!' });
        });
    });
});


// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
