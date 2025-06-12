const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { PrismaClient } = require('@prisma/client');
const usuarioRoutes = require('./routes/usuarioRoutes');
const laboratorioRoutes = require('./routes/laboratorioRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const registroRoutes = require('./routes/registroRoutes');


const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API do GetLab funcionando 🚀');
});

app.use('/api', usuarioRoutes); // agora /api/cadastro funciona
app.use('/api', laboratorioRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/registros', registroRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
