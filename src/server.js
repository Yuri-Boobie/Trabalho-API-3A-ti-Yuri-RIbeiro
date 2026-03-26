import express from 'express';
import tarefas from './dados.js';

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// ID para novas tarefas
let ultimoId = Math.max(...tarefas.map(t => t.id), 0);

// ============ ROTAS GET ============

// GET / - Retorna todas as tarefas
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Tarefas',
    total: tarefas.length,
    tarefas: tarefas
  });
});

// GET /tarefas - Listar todas as tarefas
app.get('/tarefas', (req, res) => {
  res.json({
    total: tarefas.length,
    tarefas: tarefas
  });
});

// GET /tarefas/:id - Obter uma tarefa específica
app.get('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find(t => t.id === id);

  if (!tarefa) {
    return res.status(404).json({
      erro: true,
      mensagem: `Tarefa com id ${id} não encontrada`
    });
  }

  res.json({
    sucesso: true,
    tarefa: tarefa
  });
});

// ============ ROTAS POST ============

// POST /tarefas - Criar uma nova tarefa
app.post('/tarefas', (req, res) => {
  const { titulo, descricao, concluida } = req.body;

  // Validação
  if (!titulo) {
    return res.status(400).json({
      erro: true,
      mensagem: 'Título é obrigatório'
    });
  }

  const novaTarefa = {
    id: ++ultimoId,
    titulo: titulo,
    descricao: descricao || '',
    concluida: concluida || false,
    dataCriacao: new Date()
  };

  tarefas.push(novaTarefa);

  res.status(201).json({
    sucesso: true,
    mensagem: 'Tarefa criada com sucesso',
    tarefa: novaTarefa
  });
});

// ============ ROTAS PUT ============

// PUT /tarefas/:id - Editar uma tarefa
app.put('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find(t => t.id === id);

  if (!tarefa) {
    return res.status(404).json({
      erro: true,
      mensagem: `Tarefa com id ${id} não encontrada`
    });
  }

  // Atualizar campos fornecidos
  if (req.body.titulo) tarefa.titulo = req.body.titulo;
  if (req.body.descricao !== undefined) tarefa.descricao = req.body.descricao;
  if (req.body.concluida !== undefined) tarefa.concluida = req.body.concluida;

  res.json({
    sucesso: true,
    mensagem: 'Tarefa atualizada com sucesso',
    tarefa: tarefa
  });
});

// ============ ROTAS DELETE ============

// DELETE /tarefas/:id - Excluir uma tarefa
app.delete('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = tarefas.findIndex(t => t.id === id);

  if (indice === -1) {
    return res.status(404).json({
      erro: true,
      mensagem: `Tarefa com id ${id} não encontrada`
    });
  }

  const tarefaRemovida = tarefas.splice(indice, 1);

  res.json({
    sucesso: true,
    mensagem: 'Tarefa deletada com sucesso',
    tarefa: tarefaRemovida[0]
  });
});

// ============ TRATAMENTO DE ERROS ============

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    erro: true,
    mensagem: 'Rota não encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📝 Total de tarefas: ${tarefas.length}`);
});
