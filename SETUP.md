# 🚀 Guia de Setup do Sunset CRM

## Passo 1: Verificar dependências instaladas

```bash
# Verificar se está no diretório correto
cd /Users/zionmac/Documents/app_sunset

# Confirmar que node_modules existe
ls node_modules
```

✅ Dependências já instaladas (527 pacotes)

## Passo 2: Configurar Banco de Dados PostgreSQL

### Opção A: Instalar Docker e usar Docker Compose (RECOMENDADO)

```bash
# Instalar Docker Desktop para macOS
# Baixe de: https://www.docker.com/products/docker-desktop/

# OU via Homebrew:
brew install --cask docker

# Após instalar, abrir Docker Desktop e aguardar inicializar

# Iniciar PostgreSQL via Docker Compose
docker compose up -d

# Verificar se está rodando
docker compose ps
```

### Opção B: PostgreSQL local (sem Docker)

```bash
# Instalar PostgreSQL
brew install postgresql@16

# Iniciar serviço
brew services start postgresql@16

# Criar banco de dados
createdb sunset_crm

# Criar usuário (opcional)
psql postgres
CREATE USER sunset WITH PASSWORD 'sunset123';
GRANT ALL PRIVILEGES ON DATABASE sunset_crm TO sunset;
\q
```

Se usar esta opção, atualize o arquivo `.env`:
```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/sunset_crm?schema=public"
```

## Passo 3: Executar Migrations do Prisma

```bash
# Gerar Prisma Client (já foi feito)
npx prisma generate

# Executar migrations
npx prisma migrate dev --name init
```

**IMPORTANTE**: Este comando vai criar as tabelas no banco de dados.

## Passo 4: Popular banco com dados iniciais (Seed)

```bash
npx prisma db seed
```

Este comando vai criar:
- 1 usuário gestor: `admin@sunset.com` / `123456`
- 2 vendedores: `joao@sunset.com` / `123456` e `maria@sunset.com` / `123456`
- 4 estágios de funil: Prospecção, Negociação, Proposta, Fechamento
- 8 clientes de exemplo
- Tarefas e interações de exemplo

## Passo 5: Iniciar aplicação

```bash
npm run dev
```

Acesse: **http://localhost:3000**

Você será redirecionado para a tela de login.

## Passo 6: Fazer Login

Use qualquer uma das credenciais criadas pelo seed:

- **Gestor**: `admin@sunset.com` / `123456`
- **Vendedor**: `joao@sunset.com` / `123456`

## 🎉 Pronto!

Você deverá ver:
1. Dashboard com cards de meta, urgente e novos leads
2. Navegação na sidebar
3. Pipeline com Kanban drag & drop

## 🔍 Comandos Úteis

```bash
# Ver banco de dados visualmente
npx prisma studio

# Reset completo do banco (CUIDADO!)
npx prisma migrate reset

# Ver logs do Docker
docker compose logs -f

# Parar PostgreSQL no Docker
docker compose down
```

## 🐛 Troubleshooting

**Erro "Can't reach database server":**
- Verifique se o PostgreSQL está rodando: `docker compose ps` ou `brew services list`
- Confirme a URL no `.env`

**Erro ao rodar migrations:**
- Verifique se o banco existe
- Teste a conexão: `npx prisma db push`

**Página em branco:**
- Verifique o console do navegador (F12)
- Verifique os logs do terminal

## 📊 Estado Atual do Projeto

### ✅ Implementado
- Autenticação com NextAuth
- Tela de login moderna
- Dashboard com estatísticas
- Layout com sidebar
- Pipeline com Kanban drag & drop
- API routes para pipeline e stats
- Componentes UI (Shadcn)
- Proteção de rotas

### 🚧 Em Desenvolvimento
- Página de cliente 360º
- Calendário e tarefas
- Relatórios gerenciais
- Configuração de funil personalizado

## 📝 Próximos Passos Após Setup

1. Testar login com as credenciais
2. Explorar o Dashboard
3. Arrastar cards no Pipeline (Kanban)
4. Clicar no botão WhatsApp dos clientes
5. Testar navegação entre páginas

---

**Qualquer dúvida, consulte o README.md principal!**
