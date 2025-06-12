const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Listar todos os registros
const listarRegistros = async (req, res) => {
  try {
    const registros = await prisma.registro.findMany({
      orderBy: { data: 'desc' }
    });
    res.json(registros);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar registros" });
  }
};

// Criar novo registro
const criarRegistro = async (req, res) => {
  const { docente, email, status, detalhes } = req.body;

  if (!docente || !email || !status) {
    return res.status(400).json({ error: "Docente, email e status são obrigatórios" });
  }

  try {
    const novoRegistro = await prisma.registro.create({
      data: {
        docente,
        email,
        data: new Date(),
        status,
        detalhes: detalhes || null
      }
    });

    res.status(201).json(novoRegistro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar registro" });
  }
};

// Buscar registros por docente
const buscarRegistrosPorDocente = async (req, res) => {
  const { email } = req.params;

  try {
    const registros = await prisma.registro.findMany({
      where: { email },
      orderBy: { data: 'desc' }
    });

    res.json(registros);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar registros" });
  }
};

// Buscar registros por data
const buscarRegistrosPorData = async (req, res) => {
  const { data } = req.params;

  try {
    const dataInicio = new Date(data);
    const dataFim = new Date(data);
    dataFim.setDate(dataFim.getDate() + 1);

    const registros = await prisma.registro.findMany({
      where: {
        data: {
          gte: dataInicio,
          lt: dataFim
        }
      },
      orderBy: { data: 'desc' }
    });

    res.json(registros);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar registros por data" });
  }
};

// Buscar registros por status
const buscarRegistrosPorStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const registros = await prisma.registro.findMany({
      where: { 
        status: {
          contains: status,
          mode: 'insensitive'
        }
      },
      orderBy: { data: 'desc' }
    });

    res.json(registros);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar registros por status" });
  }
};

// Deletar registro
const deletarRegistro = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.registro.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Registro deletado com sucesso" });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Registro não encontrado" });
    }
    res.status(500).json({ error: "Erro ao deletar registro" });
  }
};

// Obter estatísticas dos registros
const obterEstatisticas = async (req, res) => {
  try {
    const total = await prisma.registro.count();
    
    const aprovadas = await prisma.registro.count({
      where: {
        status: {
          contains: 'aprovada',
          mode: 'insensitive'
        }
      }
    });

    const pendentes = await prisma.registro.count({
      where: {
        status: {
          contains: 'enviada',
          mode: 'insensitive'
        }
      }
    });

    const recusadas = await prisma.registro.count({
      where: {
        status: {
          contains: 'recusada',
          mode: 'insensitive'
        }
      }
    });

    const estatisticas = {
      total,
      aprovadas,
      pendentes,
      recusadas
    };

    res.json(estatisticas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter estatísticas" });
  }
};

module.exports = {
  listarRegistros,
  criarRegistro,
  buscarRegistrosPorDocente,
  buscarRegistrosPorData,
  buscarRegistrosPorStatus,
  deletarRegistro,
  obterEstatisticas
};

