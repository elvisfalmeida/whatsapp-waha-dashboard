# Gerenciador de Grupos do WhatsApp

Aplicação web criada com Next.js/T3 Stack para gerenciar grupos do WhatsApp via WAHA, criar campanhas de mensagens e agendar envios.

## Como Funciona

### 1. Autenticação e usuários

- Usuários podem se cadastrar e aguardar aprovação do administrador.
- Administradores recebem notificações por WhatsApp e email para novos cadastros.
- Controle de acesso por papéis: `ADMIN`, `USER` e `GUEST`.

### 2. Campanhas

Você pode criar campanhas informando:

- grupos ou contatos de destino;
- conteúdo da mensagem, com suporte a placeholders como `{days_left}`;
- data inicial, data final, horário e fuso;
- recorrência e sequência de mensagens, quando necessário.

### 3. Envio automático

O serviço de agendamento:

- verifica mensagens pendentes periodicamente;
- envia mensagens no horário programado;
- atualiza status, progresso e conclusão das campanhas;
- registra falhas para acompanhamento.

## Recursos

- Autenticação segura com redefinição de senha por email.
- Painel administrativo para usuários, sessões e campanhas.
- Notificações por WhatsApp e email.
- Seleção de grupos e contatos com busca.
- Agendamento de mensagens e campanhas recorrentes.
- Acompanhamento de progresso das campanhas.
- Interface responsiva para desktop e mobile.
- Gerenciamento de sessão WAHA com QR Code.

## Stack

- Next.js 15 com App Router
- React 19
- TypeScript
- tRPC
- TanStack Query
- Tailwind CSS
- Better Auth
- Prisma
- MongoDB
- Mailgun
- WAHA
- pnpm

## Pré-requisitos

- Node.js 18+
- pnpm
- Banco MongoDB
- Servidor WAHA acessível pela aplicação
- Conta Mailgun para emails

## Instalação Local

1. Clone o repositório:

```bash
git clone https://github.com/elvisfalmeida/whatsapp-waha-dashboard.git
cd whatsapp-waha-dashboard
```

2. Instale as dependências:

```bash
pnpm install
```

3. Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/whatsapp-manager"
WAHA_API_URL="https://sua-url-da-waha"
WAHA_API_KEY="sua-chave-da-waha"
BETTER_AUTH_SECRET="seu-secret-de-producao"
BETTER_AUTH_URL="http://localhost:3000"
MAILGUN_API_KEY="sua-chave-mailgun"
MAILGUN_DOMAIN="seu-dominio-mailgun"
FROM_EMAIL="noreply@seudominio.com"
ADMIN_EMAIL="admin@seudominio.com"
ADMIN_PHONE_NUMBER="+5511999999999"
NEXT_PUBLIC_SHOW_FOOTER="true"
```

4. Gere o client do Prisma:

```bash
pnpm prisma:generate
```

5. Envie o schema para o banco:

```bash
pnpm db:push
```

6. Rode o projeto:

```bash
pnpm dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Deploy na Vercel

A Vercel hospeda o dashboard Next.js. O banco MongoDB, o servidor WAHA e o scheduler precisam existir fora da Vercel.

1. Envie o código para o GitHub.
2. Importe o repositório na Vercel.
3. Configure as variáveis de ambiente no painel da Vercel.
4. Faça o deploy.

Variáveis principais:

```env
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/whatsapp-manager"
BETTER_AUTH_SECRET="seu-secret-de-producao"
BETTER_AUTH_URL="https://seu-app.vercel.app"
WAHA_API_URL="https://sua-url-da-waha"
WAHA_API_KEY="sua-chave-da-waha"
MAILGUN_API_KEY="sua-chave-mailgun"
MAILGUN_DOMAIN="seu-dominio-mailgun"
FROM_EMAIL="noreply@seudominio.com"
ADMIN_EMAIL="admin@seudominio.com"
ADMIN_PHONE_NUMBER="+5511999999999"
```

## Agendador

O scheduler precisa rodar continuamente, então ele deve ficar em um servidor separado, VPS ou no mesmo servidor onde a WAHA está rodando.

Exemplo com PM2:

```bash
pnpm install
pnpm prisma:generate
pm2 start src/scripts/messageScheduler.ts --interpreter ./node_modules/.bin/tsx --name whatsapp-scheduler --env production
pm2 save
pm2 startup
```

Comandos úteis:

```bash
pm2 status
pm2 logs whatsapp-scheduler
pm2 restart whatsapp-scheduler
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm db:push
pnpm prisma:generate
pnpm scheduler:start
pnpm typecheck
pnpm lint
```

## Estrutura

```text
prisma/
  schema.prisma
src/
  app/
  app/_components/
  app/admin/
  app/api/
  client/
  scripts/messageScheduler.ts
  server/
  styles/
  trpc/
  types/
```

## Observações

- O dashboard pode rodar na Vercel.
- O MongoDB deve ser externo, como MongoDB Atlas.
- A WAHA deve ficar em um servidor com URL pública.
- O scheduler não deve depender de um processo contínuo dentro da Vercel.
