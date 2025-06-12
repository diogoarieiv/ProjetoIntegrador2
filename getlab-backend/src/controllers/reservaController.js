const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Listar todas as reservas
const listarReservas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        usuario: true,
        laboratorio: true
      }
    });
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar reservas" });
  }
};

// Criar nova reserva
const criarReserva = async (req, res) => {
  const { laboratorioId, usuarioId, dataReserva, horaInicio, horaFim, descricao } = req.body;

  if (!laboratorioId || !usuarioId || !dataReserva || !horaInicio || !horaFim) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    // Combinar data e hora para criar DateTime
    const dataHoraInicio = new Date(`${dataReserva}T${horaInicio}:00.000Z`);
    
    // Verificar se o laboratório existe
    const laboratorio = await prisma.laboratorio.findUnique({
      where: { id: parseInt(laboratorioId) }
    });

    if (!laboratorio) {
      return res.status(404).json({ error: "Laboratório não encontrado" });
    }

    // Verificar se o usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Verificar se já existe reserva para o mesmo horário
    const reservaExistente = await prisma.reserva.findFirst({
      where: {
        laboratorioId: parseInt(laboratorioId),
        dataHora: dataHoraInicio,
        status: {
          in: ['pendente', 'aprovado']
        }
      }
    });

    if (reservaExistente) {
      return res.status(409).json({ error: "Já existe uma reserva para este horário" });
    }

    const novaReserva = await prisma.reserva.create({
      data: {
        laboratorioId: parseInt(laboratorioId),
        usuarioId: parseInt(usuarioId),
        dataHora: dataHoraInicio,
        status: 'pendente'
      },
      include: {
        usuario: true,
        laboratorio: true
      }
    });

    res.status(201).json(novaReserva);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar reserva" });
  }
};

// Atualizar status da reserva
const atualizarReserva = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pendente', 'aprovado', 'recusado'].includes(status)) {
    return res.status(400).json({ error: "Status inválido" });
  }

  try {
    const reserva = await prisma.reserva.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        usuario: true,
        laboratorio: true
      }
    });

    res.json(reserva);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }
    res.status(500).json({ error: "Erro ao atualizar reserva" });
  }
};

// Deletar reserva
const deletarReserva = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.reserva.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Reserva deletada com sucesso" });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }
    res.status(500).json({ error: "Erro ao deletar reserva" });
  }
};

// Buscar reservas por laboratório
const buscarReservasPorLaboratorio = async (req, res) => {
  const { laboratorioId } = req.params;

  try {
    const reservas = await prisma.reserva.findMany({
      where: { laboratorioId: parseInt(laboratorioId) },
      include: {
        usuario: true,
        laboratorio: true
      },
      orderBy: { dataHora: 'asc' }
    });

    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar reservas" });
  }
};

// Buscar reservas por usuário
const buscarReservasPorUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const reservas = await prisma.reserva.findMany({
      where: { usuarioId: parseInt(usuarioId) },
      include: {
        usuario: true,
        laboratorio: true
      },
      orderBy: { dataHora: 'asc' }
    });

    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar reservas" });
  }
};

module.exports = {
  listarReservas,
  criarReserva,
  atualizarReserva,
  deletarReserva,
  buscarReservasPorLaboratorio,
  buscarReservasPorUsuario
};

