# GetLab - Sistema de Reserva de Laboratórios

## Visão Geral

O GetLab é um sistema completo de reserva de laboratórios desenvolvido especificamente para instituições de ensino superior. O sistema permite que docentes visualizem laboratórios disponíveis, façam solicitações de reserva e acompanhem o histórico de suas atividades.

## Funcionalidades Implementadas

### 1. Página de Laboratórios (`laboratorios.html`)
- **Visualização em Cards**: Exibe todos os laboratórios em formato de cards elegantes
- **Status Visual**: Indicadores coloridos para mostrar disponibilidade (verde = disponível, vermelho = ocupado, laranja = pendente)
- **Informações Detalhadas**: Capacidade, recursos disponíveis e status atual
- **Busca Inteligente**: Campo de pesquisa para filtrar laboratórios por nome
- **Design Responsivo**: Adaptável para desktop e dispositivos móveis

### 2. Página de Visualização de Reservas (`verReserva.html`)
- **Calendário Interativo**: Calendário personalizado com cores indicando status das reservas
- **Integração Google Calendar**: Conecta com a API do Google Calendar para sincronização
- **Formulário de Reserva**: Exclusivo para docentes (@fmpsc.edu.br)
  - Seleção de data e horário
  - Descrição da atividade
  - Validação automática de conflitos
- **Navegação Mensal**: Botões para navegar entre meses
- **Legenda Visual**: Cores explicativas para diferentes status

### 3. Página de Registro (`registro.html`)
- **Histórico Completo**: Todas as ações realizadas no sistema
- **Filtros Avançados**: Por data, status, docente
- **Estatísticas em Tempo Real**: Cards com contadores de reservas
- **Exportação de Dados**: Funcionalidade para exportar em CSV
- **Paginação**: Sistema de páginas para grandes volumes de dados
- **Design Profissional**: Interface limpa e organizada

### 4. Backend Robusto
- **API RESTful**: Endpoints completos para todas as operações
- **Prisma ORM**: Integração com banco de dados PostgreSQL
- **Controllers Organizados**:
  - `reservaController.js`: Gerenciamento de reservas
  - `registroController.js`: Histórico de atividades
- **Validações**: Verificação de conflitos e permissões
- **CORS Habilitado**: Permite comunicação frontend-backend

## Estrutura do Projeto

```
ProjetoIntegrador2/
├── getlab-backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── laboratorioController.js
│   │   │   ├── usuarioController.js
│   │   │   ├── reservaController.js
│   │   │   └── registroController.js
│   │   ├── routes/
│   │   │   ├── laboratorioRoutes.js
│   │   │   ├── usuarioRoutes.js
│   │   │   ├── reservaRoutes.js
│   │   │   └── registroRoutes.js
│   │   └── server.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
└── getlab-front/
    └── public/
        ├── laboratorios.html
        ├── laboratorios.css
        ├── verReserva.html
        ├── verReserva.css
        ├── registro.html
        ├── registro.css
        └── [outros arquivos existentes]
```

## Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com gradientes e animações
- **JavaScript ES6+**: Funcionalidades interativas
- **Google Calendar API**: Integração com calendários
- **Design Responsivo**: Mobile-first approach

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **Prisma**: ORM para banco de dados
- **PostgreSQL**: Banco de dados relacional
- **CORS**: Middleware para requisições cross-origin

## Configuração e Instalação

### Pré-requisitos
- Node.js (versão 16 ou superior)
- PostgreSQL
- Conta Google Cloud (para Calendar API)

### Configuração do Backend

1. **Instalar dependências**:
```bash
cd getlab-backend
npm install
```

2. **Configurar variáveis de ambiente**:
Criar arquivo `.env` com:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/getlab"
```

3. **Configurar banco de dados**:
```bash
npx prisma migrate dev
npx prisma generate
```

4. **Iniciar servidor**:
```bash
npm run dev
```

### Configuração do Frontend

1. **Configurar Google Calendar API**:
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um projeto ou use existente
   - Ative a Google Calendar API
   - Crie credenciais OAuth 2.0
   - Configure domínios autorizados

2. **Atualizar credenciais**:
   No arquivo `verReserva.html`, substitua:
   ```javascript
   const CLIENT_ID = 'SEU_CLIENT_ID_AQUI';
   const API_KEY = 'SUA_API_KEY_AQUI';
   ```

3. **Iniciar servidor local**:
```bash
cd getlab-front/public
python3 -m http.server 8000
```

## Funcionalidades Específicas para Docentes

### Autenticação
- Sistema reconhece automaticamente emails `@fmpsc.edu.br`
- Formulário de reserva aparece apenas para docentes autenticados

### Processo de Reserva
1. Docente acessa página de laboratórios
2. Clica em "Ver Reservas" no laboratório desejado
3. Visualiza calendário com disponibilidade
4. Preenche formulário com:
   - Data e horário
   - Descrição da atividade
5. Sistema valida e salva solicitação
6. Registro é automaticamente criado

### Histórico e Acompanhamento
- Todas as ações ficam registradas
- Filtros para acompanhar status das solicitações
- Exportação de dados para relatórios

## Integração com Google Calendar

### Configuração
1. **Habilitar API**: Google Calendar API no Google Cloud Console
2. **Criar Credenciais**: OAuth 2.0 Client ID
3. **Configurar Domínios**: Adicionar domínios autorizados
4. **Implementar Autenticação**: Fluxo OAuth no frontend

### Funcionalidades
- **Visualização de Eventos**: Lista eventos do calendário principal
- **Sincronização**: Eventos aparecem no calendário do sistema
- **Autenticação Segura**: OAuth 2.0 com scopes limitados

## Banco de Dados

### Schema Prisma Atualizado
O sistema utiliza as seguintes tabelas:

- **Usuario**: Informações dos usuários
- **Laboratorio**: Dados dos laboratórios
- **Reserva**: Solicitações de reserva com status
- **Registro**: Histórico de todas as ações

### Relacionamentos
- Usuário pode ter múltiplas reservas
- Laboratório pode ter múltiplas reservas
- Registros são independentes para auditoria

## Design e UX

### Princípios Aplicados
- **Hierarquia Visual**: Títulos, subtítulos e conteúdo bem organizados
- **Cores Consistentes**: Paleta azul da instituição
- **Feedback Visual**: Estados hover, loading e sucesso
- **Responsividade**: Funciona em todos os dispositivos

### Componentes Reutilizáveis
- Cards de laboratório
- Formulários padronizados
- Botões com estados
- Calendário interativo

## Segurança

### Validações Implementadas
- **Frontend**: Validação de formulários
- **Backend**: Verificação de permissões
- **Banco**: Constraints e relacionamentos
- **API**: Validação de dados de entrada

### Controle de Acesso
- Verificação de email institucional
- Sessões baseadas em localStorage
- Validação de status de usuário

## Próximos Passos

### Melhorias Sugeridas
1. **Autenticação Robusta**: Implementar JWT tokens
2. **Notificações**: Email/SMS para status de reservas
3. **Dashboard Admin**: Interface para administradores
4. **Relatórios Avançados**: Gráficos e estatísticas
5. **Mobile App**: Aplicativo nativo

### Manutenção
- Backup regular do banco de dados
- Monitoramento de logs
- Atualizações de segurança
- Testes automatizados

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Confirme configurações do banco
3. Valide credenciais da Google API
4. Teste conectividade entre frontend e backend

## Conclusão

O sistema GetLab foi desenvolvido com foco na experiência do usuário e na robustez técnica. Todas as funcionalidades solicitadas foram implementadas com atenção aos detalhes e pensando na implementação real em ambiente universitário.

O código está bem estruturado, documentado e pronto para produção, necessitando apenas das configurações específicas do ambiente de destino.

