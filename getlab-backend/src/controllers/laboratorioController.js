const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os laboratórios
const listarLaboratorios = async (req, res) => {
  try {
    const laboratorios = await prisma.laboratorio.findMany();
    res.json(laboratorios);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar laboratórios" });
  }
};

const criarLaboratorio = async (req, res) => {
  const { nome } = req.body;

  const email = req.headers['x-user-email'] || req.body.email;

  if (!email || !email.endsWith('@admin.com')) {
    return res.status(403).json({ error: 'Apenas administradores podem criar laboratórios.' });
  }

  if (!nome || nome.trim() === '') {
    return res.status(400).json({ error: 'Nome do laboratório é obrigatório' });
  }

  try {
    const novo = await prisma.laboratorio.create({
      data: {
        nome,
        capacidade: 0,     
        recursos: []       
      },
    });
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar laboratório' });
  }
};

module.exports = {
  listarLaboratorios,
  criarLaboratorio,
};
