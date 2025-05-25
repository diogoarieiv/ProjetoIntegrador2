const dotenv = require("dotenv");
dotenv.config(); // precisa estar ANTES do PrismaClient

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//cadastro de usuario
const cadastrarUsuario = async (req, res) => {
  const { nome, email, telefone, senha, tipo } = req.body;

  // Validação de domínio e tipo
  let tipoValidado;
  if (email.endsWith("@fmpsc.edu.br")) {
    tipoValidado = "docente";
  } else if (email.endsWith("@admin.com")) {
    tipoValidado = "admin";
  } else {
    return res.status(400).json({
      error:
        "Email inválido. Use @fmpsc.edu.br para docentes ou @admin.com para administradores.",
    });
  }

  try {
    // Verifica se o e-mail já existe
    const usuarioExistente = await prisma.Usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(409).json({ error: "E-mail já cadastrado." }); // 409 = Conflict
    }

    const novoUsuario = await prisma.Usuario.create({
      data: { nome, email, telefone, senha, tipo: tipoValidado },
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao cadastrar usuário: " + error.message });
  }
};


//login de usuario

const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.Usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (usuario.senha !== senha) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    // Se quiser retornar só dados públicos:
    const { id, nome, tipo } = usuario;
    res.status(200).json({ id, nome, email, tipo });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar login: ' + error.message });
  }
};



module.exports = {
  cadastrarUsuario,
  loginUsuario
};
