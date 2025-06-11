const { PrismaClient } = require("@prisma/client");
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
  const { nome, capacidade, recursos } = req.body;
  const email = req.headers["x-user-email"] || req.body.email;

  if (!email || !email.endsWith("@admin.com")) {
    return res
      .status(403)
      .json({ error: "Apenas administradores podem criar laboratórios." });
  }

  if (!nome || nome.trim() === "") {
    return res.status(400).json({ error: "Nome do laboratório é obrigatório" });
  }

  if (!capacidade || isNaN(capacidade) || capacidade <= 0) {
    return res
      .status(400)
      .json({ error: "Capacidade deve ser um número válido" });
  }

  if (!Array.isArray(recursos)) {
    return res
      .status(400)
      .json({ error: "Recursos deve ser uma lista de strings" });
  }

  try {
    const novo = await prisma.laboratorio.create({
      data: {
        nome,
        capacidade,
        recursos,
      },
    });
    res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar laboratório" });
  }
};

module.exports = {
  listarLaboratorios,
  criarLaboratorio,
};
