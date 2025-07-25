# ADIT - Administração de Ativos e TI

## 📋 Sobre o Projeto

O **ADIT** (Administração de Ativos da TI) é um sistema de gestão desenvolvido para otimizar o controle e a manutenção de ativos e serviços de TI da Prefeitura de Barra Mansa. O objetivo principal é proporcionar visibilidade, organização e um fluxo de trabalho otimizado para a equipe de TI, começando pela gestão eficiente de impressoras.

### Funcionalidades Principais

#### Já Implementadas

- ✅ Sistema de autenticação e autorização com níveis de acesso (ADMIN e OPERATOR)
- ✅ Listagem de impressoras com informações detalhadas
- ✅ Gerenciamento de departamentos e setores
- ✅ Controle de usuários do sistema
- ✅ Interface responsiva com tema escuro

#### Em Desenvolvimento

- 🔄 Formulários para criação e edição de registros
- 🔄 Dashboard com estatísticas e gráficos
- 🔄 Histórico de movimentações de ativos

#### Planejadas para o Futuro

- 📅 Expansão para outros tipos de ativos (computadores, switches, etc.)
- 📅 Módulo de inventário
- 📅 Sistema de chamados
- 📅 Aplicativo mobile para técnicos em campo

## 🚀 Tecnologias

O projeto é desenvolvido com as seguintes tecnologias:

- **Frontend**:
  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS
  - Shadcn/UI
  - TanStack Table

- **Backend**:
  - Next.js Server Components e Server Actions
  - Prisma ORM
  - PostgreSQL
  - Better-Auth para autenticação

## 🔧 Instalação e Uso

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- npm ou yarn

### Configuração

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd adit
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/adit?schema=public"
   BETTER_AUTH_SECRET=BETTER-AUTH-SECRET-KEY
   BETTER_AUTH_URL=http://localhost:3000 
   ```

4. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate dev
   # ou
   yarn prisma migrate dev
   ```

5. Popule o banco de dados com dados iniciais (opcional):
   ```bash
   npx prisma db seed
   # ou
   yarn prisma db seed
   ```

### Executando o Projeto

```bash
# Desenvolvimento
npm run dev
# ou
yarn dev

# Produção
npm run build
npm start
# ou
yarn build
yarn start
```

Acesse `http://localhost:3000` para visualizar a aplicação.

## 📚 Estrutura do Projeto

```
├── prisma/               # Configuração do banco de dados e migrações
├── public/               # Arquivos estáticos
└── src/
    ├── actions/          # Server Actions para operações no banco
    ├── app/              # Rotas e páginas da aplicação
    │   ├── (private)/    # Rotas protegidas (requer autenticação)
    │   └── (public)/     # Rotas públicas
    ├── components/       # Componentes reutilizáveis
    │   ├── auth/         # Componentes de autenticação
    │   ├── data-tables/  # Componentes de tabelas de dados
    │   ├── sidebar/      # Componentes da barra lateral
    │   └── ui/           # Componentes de UI genéricos
    ├── generated/        # Arquivos gerados pelo Prisma
    ├── hooks/            # React Hooks personalizados
    ├── lib/              # Bibliotecas e utilitários
    │   └── auth/         # Configuração de autenticação
    └── utils/            # Funções utilitárias
```

## 👨‍💻 Autor

Desenvolvido por [Luis Felipe de Paula Costa](https://github.com/lupebreak)

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).