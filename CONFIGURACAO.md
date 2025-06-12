# Instruções de Configuração - GetLab

## 🚀 Configuração Rápida

### 1. Google Calendar API

Para que a integração com Google Calendar funcione, você precisa:

1. **Acesse o Google Cloud Console**:
   - Vá para https://console.cloud.google.com/
   - Crie um novo projeto ou selecione um existente

2. **Ative a Google Calendar API**:
   - No menu lateral, vá em "APIs & Services" > "Library"
   - Procure por "Google Calendar API"
   - Clique em "Enable"

3. **Crie credenciais OAuth 2.0**:
   - Vá em "APIs & Services" > "Credentials"
   - Clique em "Create Credentials" > "OAuth 2.0 Client ID"
   - Selecione "Web application"
   - Em "Authorized JavaScript origins", adicione:
     - `http://localhost:8000`
     - `http://127.0.0.1:8000`
   - Anote o Client ID gerado

4. **Crie uma API Key**:
   - Ainda em "Credentials", clique em "Create Credentials" > "API Key"
   - Anote a API Key gerada

5. **Configure no código**:
   - Abra o arquivo `getlab-front/public/verReserva.html`
   - Encontre as linhas:
   ```javascript
   const CLIENT_ID = '615359403989-mi04c1tq562ri3vf20g704a4o2dvhqj4.apps.googleusercontent.com';
   const API_KEY = 'AIzaSyBQAUngO3UwPwiL_4-pml-HFJ43KJcQXL0';
   ```
   - Substitua pelos valores obtidos

### 2. Banco de Dados

O projeto já está configurado para PostgreSQL. Para usar:

1. **Instale PostgreSQL** (se não tiver)
2. **Crie um banco de dados**:
   ```sql
   CREATE DATABASE getlab;
   ```
3. **Configure a URL no arquivo `.env`**:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/getlab"
   ```

### 3. Executar o Projeto

1. **Backend**:
   ```bash
   cd getlab-backend
   npm install
   npx prisma migrate dev
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd getlab-front/public
   python3 -m http.server 8000
   ```

3. **Acesse**: http://localhost:8000

## 🔧 Configurações Adicionais

### Para Produção

1. **Domínios Autorizados**: Adicione seu domínio real nas configurações OAuth
2. **HTTPS**: Configure certificado SSL
3. **Variáveis de Ambiente**: Use variáveis seguras para produção
4. **Backup**: Configure backup automático do banco

### Personalização

1. **Logo**: Substitua `assets/logo.png` pelo logo da sua instituição
2. **Cores**: Modifique as variáveis CSS nos arquivos `.css`
3. **Domínio de Email**: Altere `@fmpsc.edu.br` para o domínio da sua instituição

## 📝 Notas Importantes

- O sistema está configurado para reconhecer docentes pelo domínio `@fmpsc.edu.br`
- Para testar, use um email com esse domínio
- O Google Calendar requer HTTPS em produção
- Mantenha as credenciais da API seguras

## 🆘 Solução de Problemas

### Erro de CORS
- Verifique se o backend está rodando na porta 3000
- Confirme que o CORS está habilitado no servidor

### Google Calendar não carrega
- Verifique se as credenciais estão corretas
- Confirme se a API está ativada no Google Cloud
- Teste em uma aba anônima do navegador

### Banco de dados não conecta
- Verifique se o PostgreSQL está rodando
- Confirme a string de conexão no `.env`
- Execute as migrações do Prisma

