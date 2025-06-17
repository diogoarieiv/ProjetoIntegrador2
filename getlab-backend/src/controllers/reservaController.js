const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Listar todas as reservas
const listarReservas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        usuario: true,
        laboratorio: true,
      },
    });
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar reservas" });
  }
};

// Criar nova reserva
const criarReserva = async (req, res) => {
  const { laboratorioId, usuarioId, data, horaInicio, horaFim } = req.body;

  if (!laboratorioId || !usuarioId || !data || !horaInicio || !horaFim) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const laboratorio = await prisma.laboratorio.findUnique({
      where: { id: parseInt(laboratorioId) },
    });

    if (!laboratorio) {
      return res.status(404).json({ error: "Laboratório não encontrado" });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // ⚠️ Verificar conflito de horário
    const conflito = await prisma.reserva.findFirst({
      where: {
        laboratorioId: parseInt(laboratorioId),
        data: new Date(data),
        status: { in: ["pendente", "aprovado"] },
        AND: [
          {
            horaInicio: { lt: horaFim },
          },
          {
            horaFim: { gt: horaInicio },
          },
        ],
      },
    });

    if (conflito) {
      return res
        .status(409)
        .json({ error: "Já existe uma reserva neste horário." });
    }

    const novaReserva = await prisma.reserva.create({
      data: {
        laboratorioId: parseInt(laboratorioId),
        usuarioId: parseInt(usuarioId),
        data: new Date(data),
        horaInicio,
        horaFim,
        status: "pendente",
      },
      include: {
        usuario: true,
        laboratorio: true,
      },
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
  const { status, motivo } = req.body;

  if (!["pendente", "aprovado", "recusado", "cancelado"].includes(status)) {
    return res.status(400).json({ error: "Status inválido" });
  }

  try {
    const reserva = await prisma.reserva.update({
      where: { id: parseInt(id) },
      data: { 
        status,
        motivo: motivo || null // Include motivo in the update
      },
      include: {
        usuario: true,
        laboratorio: true,
      },
    });

    res.json(reserva);
  } catch (err) {
    console.error("Erro ao atualizar reserva:", err);
    if (err.code === "P2025") {
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
      where: { id: parseInt(id) },
    });

    res.json({ message: "Reserva deletada com sucesso" });
  } catch (err) {
    if (err.code === "P2025") {
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
        laboratorio: true,
      },
      orderBy: { data: "asc" },
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
        laboratorio: true,
      },
      orderBy: { data: "asc" },
    });

    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar reservas" });
  }
};

// Buscar reservas pendentes
const buscarReservasPendentes = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { status: "pendente" },
      include: {
        usuario: true,
        laboratorio: true,
      },
      orderBy: { data: "asc" },
    });

    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar reservas pendentes" });
  }
};

// Buscar reservas por mês e laboratório (calendário)
const buscarReservasPorDataLaboratorio = async (req, res) => {
  const { laboratorioId, ano, mes } = req.params;

  try {
    const inicioMes = new Date(parseInt(ano), parseInt(mes) - 1, 1);
    const fimMes = new Date(parseInt(ano), parseInt(mes), 0, 23, 59, 59);

    const reservas = await prisma.reserva.findMany({
      where: {
        laboratorioId: parseInt(laboratorioId),
        data: {
          gte: inicioMes,
          lte: fimMes,
        },
        status: {
          in: ["pendente", "aprovado"],
        },
      },
      include: {
        usuario: true,
        laboratorio: true,
      },
      orderBy: { data: "asc" },
    });

    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar reservas por data" });
  }
};

module.exports = {
  listarReservas,
  criarReserva,
  atualizarReserva,
  deletarReserva,
  buscarReservasPorLaboratorio,
  buscarReservasPorUsuario,
  buscarReservasPendentes,
  buscarReservasPorDataLaboratorio,
};
