const dotenv = require("dotenv");
dotenv.config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Cadastrar usuário
const cadastrarUsuario = async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  // Validação de domínio e tipo
  let tipo;
  if (email.endsWith("@fmpsc.edu.br")) {
    tipo = "docente";
  } else if (email.endsWith("@admin.com")) {
    tipo = "admin";
  } else {
    return res.status(400).json({
      error:
        "Email inválido. Use @fmpsc.edu.br para docentes ou @admin.com para administradores.",
    });
  }

  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(409).json({ error: "E-mail já cadastrado." });
    }

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        telefone,
        senha,
        tipo,
      },
    });

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        tipo: novoUsuario.tipo,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao cadastrar usuário: " + error.message });
  }
};

// Login de usuário
const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    if (usuario.senha !== senha) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao realizar login: " + error.message });
  }
};

module.exports = {
  cadastrarUsuario,
  loginUsuario,
};
