router.post('/cadastro', async (req, res) => {
  const { nome, email, telefone, senha, tipo } = req.body;

  // Validação de domínio e tipo
  let tipoValidado;
  if (email.endsWith('@fmpsc.edu.br')) {
    tipoValidado = 'docente';
  } else if (email.endsWith('@admin.com')) {
    tipoValidado = 'admin';
  } else {
    return res.status(400).json({ error: 'Email inválido. Use @fmpsc.edu.br para docentes ou @admin.com para administradores.' });
  }

  // Segurança: ignora o tipo enviado e usa o validado
  try {
    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, telefone, senha, tipo: tipoValidado }
    });
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
