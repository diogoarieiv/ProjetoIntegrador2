const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { PrismaClient } = require('@prisma/client');
const usuarioRoutes = require('./routes/usuarioRoutes');


const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API do GetLab funcionando 🚀');
});

app.use('/api', usuarioRoutes); // agora /api/cadastro funciona


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
