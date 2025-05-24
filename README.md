# GetLab - Sistema de Gerenciamento de Reservas de Laboratórios

![GetLab Logo](./assets/logo.png)

## 🚀 Sobre o Projeto

O **GetLab** é uma aplicação web para cadastro e gerenciamento de usuários docentes e administradores, com sistema integrado de reservas de laboratórios. Desenvolvido com JavaScript (Node.js, Express), Prisma ORM e PostgreSQL, o projeto visa facilitar o controle e a organização dos recursos laboratoriais em instituições acadêmicas.

---

## 📋 Funcionalidades

- Cadastro de usuários com validação de e-mail (docentes com `@fmpsc.edu.br` e administradores com `@admin.com`)
- Controle de tipos de usuários (docente ou admin)
- Integração com banco PostgreSQL via Prisma ORM
- API RESTful com rotas seguras para cadastro e manipulação de dados
- Interface de cadastro simples e intuitiva

---

## 🛠️ Como Executar o Projeto (Tutorial)

### Pré-requisitos

- [Node.js](https://nodejs.org/) e NPM instalados no sistema  
- Banco de dados PostgreSQL configurado (exemplo: ConsoleNeon)

### Passos para rodar

1. Abra o terminal ou PowerShell e navegue até a pasta do backend:
   ```bash
   cd getlab-backend

2. Instale as dependências do projeto:

npm install
Caso tenha problemas, verifique se o Node.js e o NPM estão instalados corretamente.
Se persistir o erro no PowerShell, execute como administrador e rode:


Set-ExecutionPolicy RemoteSigned
Confirme com S ou Y.

Gere o cliente Prisma (arquivos necessários para o ORM funcionar):


npx prisma generate
Inicie o servidor backend:


npm run dev
O backend estará conectado ao ConsoleNeon e pronto para uso.

📂 Estrutura do Projeto
pgsql
Copiar
Editar
getlab-backend/
├── node_modules/
├── prisma/
│   └── schema.prisma
├── routes/
│   └── usuarioRoutes.js
├── .env
├── package.json
└── server.js
🤝 Contribuições
Contribuições são bem-vindas!
Para sugestões e correções, abra uma issue ou envie um pull request.