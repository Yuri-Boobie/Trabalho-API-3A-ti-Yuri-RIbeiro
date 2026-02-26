import express from "express";

const app = express();
const PORTA = 3000;

// Permite receber JSON no corpo da requisição [cite: 44, 103]
app.use(express.json());

// Dados em memória (Array de objetos) [cite: 73, 74, 112]
let tarefas = [
    { id: 1, titulo: "Estudar Node", concluida: false },
    { id: 2, titulo: "Fazer a AV1", concluida: true }
];

// Rota GET: Listar itens - Status 200 [cite: 47, 54, 106]
app.get("/tarefas", (req, res) => {
    res.status(200).json(tarefas);
});

// Rota POST: Criar item - Status 201 e Validação 400 [cite: 48, 55, 107, 108]
app.post("/tarefas", (req, res) => {
    const { titulo } = req.body;

    // Validação mínima: título obrigatório [cite: 82, 83, 114]
    if (!titulo || titulo.trim() === "") {
        return res.status(400).json({ erro: "Título é obrigatório." });
    }

    const novaTarefa = {
        id: tarefas.length + 1,
        titulo: titulo,
        concluida: false
    };

    tarefas.push(novaTarefa); // [cite: 80, 113]
    res.status(201).json(novaTarefa);
});

// Inicia o servidor [cite: 39, 95]
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});