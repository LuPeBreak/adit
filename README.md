# ADIT - Administração de Ativos e TI

## 📋 Sobre o Projeto

O **ADIT** (Administração de Ativos da TI) é um sistema de gestão desenvolvido para otimizar o controle e a manutenção de ativos e serviços de TI da Prefeitura de Barra Mansa. O objetivo principal é proporcionar visibilidade, organização e um fluxo de trabalho otimizado para a equipe de TI, começando pela gestão eficiente de impressoras.

### Funcionalidades Principais

#### ✅ Já Implementadas

- **Sistema de Autenticação Robusto**: Implementado com Better-Auth, incluindo:
  - Autenticação por email/senha
  - Sistema de sessões seguras
  - Controle de acesso baseado em roles (ADMIN e OPERATOR)
  - Sistema de permissões granulares por recurso e ação
  - Funcionalidades de banimento de usuários

- **Gestão Completa de Ativos**: 
  - Listagem de todos os ativos com filtros e busca
  - Gestão específica de impressoras com informações detalhadas
  - Controle de status dos ativos (Em Uso, Estoque, Quebrado, Manutenção, Reservado)
  - Vinculação de ativos a setores e departamentos

- **Administração Organizacional**:
  - Gerenciamento completo de departamentos e setores
  - Controle hierárquico (Departamento → Setor → Ativo)
  - Gestão de modelos de impressoras com especificações de toners

- **Interface de Usuário Moderna**:
  - Design responsivo com Tailwind CSS
  - Componentes reutilizáveis com Shadcn/UI
  - Tema escuro por padrão
  - Tabelas interativas com TanStack Table (ordenação, filtros, paginação)
  - Sidebar navegacional com controle de acesso por role

- **Controle de Usuários Avançado**:
  - Criação e edição de usuários
  - Sistema de roles com permissões diferenciadas
  - Funcionalidade de banimento
  - Alteração de senhas e informações pessoais

#### 🔄 Em Desenvolvimento

- Dashboard principal com estatísticas e métricas
- Histórico de movimentações de ativos
- Relatórios e exportação de dados
- Sistema de notificações

#### 📅 Planejadas para o Futuro

- Expansão para outros tipos de ativos (computadores, switches, etc.)
- Módulo de inventário automatizado
- Sistema de chamados técnicos
- Aplicativo mobile para técnicos em campo
- Integração com sistemas externos
- API REST para integrações

## 🚀 Tecnologias

O projeto utiliza um stack moderno e robusto:

### **Frontend**
- **Next.js 15**: Framework React com App Router, Server Components e Server Actions
- **React 19**: Biblioteca para construção de interfaces de usuário
- **TypeScript 5**: Tipagem estática para maior segurança e produtividade
- **Tailwind CSS 4**: Framework CSS utilitário para estilização
- **Shadcn/UI**: Biblioteca de componentes acessíveis e customizáveis
- **TanStack Table**: Biblioteca poderosa para tabelas interativas
- **React Hook Form**: Gerenciamento de formulários com validação
- **Zod**: Validação de schemas e tipagem
- **Sonner**: Sistema de notificações toast

### **Backend & Database**
- **Next.js Server Actions**: API routes, Server Components e Server Actions
- **Prisma ORM**: Object-Relational Mapping com type safety
- **PostgreSQL**: Banco de dados relacional robusto
- **Better-Auth**: Sistema de autenticação completo com:
  - Plugin de administração
  - Controle de acesso
  - Gerenciamento de sessões
  - Sistema de roles e permissões


## 🔧 Instalação e Uso

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- npm ou yarn

### Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/LuPeBreak/adit
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

## 📚 Arquitetura e Estrutura do Projeto

### **Arquitetura Geral**
O ADIT segue uma arquitetura moderna baseada em:
- **Server-Side Rendering (SSR)** com Next.js App Router
- **Server Actions** para operações de backend
- **Component-Based Architecture** com React
- **Type-Safe Database Access** com Prisma
- **Role-Based Access Control (RBAC)** com Better-Auth

### **Estrutura de Diretórios**

```
├── prisma/                    # Configuração do banco de dados
│   ├── migrations/           # Migrações do banco de dados
│   ├── schema.prisma        # Schema do banco (modelos e relações)
│   └── seed.ts              # Script de população inicial
├── public/                   # Arquivos estáticos
└── src/
    ├── actions/             # Server Actions (operações do servidor)
    │   ├── assets/          # Ações relacionadas a ativos
    │   ├── auth/            # Ações de autenticação
    │   ├── departments/     # Ações de departamentos
    │   ├── printer-models/  # Ações de modelos de impressora
    │   ├── printers/        # Ações de impressoras
    │   ├── sectors/         # Ações de setores
    │   └── users/           # Ações de usuários
    ├── app/                 # Rotas da aplicação (App Router)
    │   ├── (private)/       # Rotas protegidas (dashboard)
    │   │   └── dashboard/   # Páginas do painel administrativo
    │   ├── (public)/        # Rotas públicas (login, home)
    │   ├── api/             # API routes (Better-Auth)
    │   ├── globals.css      # Estilos globais
    │   └── layout.tsx       # Layout raiz da aplicação
    ├── components/          # Componentes React reutilizáveis
    │   ├── account/         # Componentes de conta do usuário
    │   ├── auth/            # Componentes de autenticação
    │   ├── data-tables/     # Componentes de tabelas de dados
    │   │   ├── assets/      # Tabela de ativos
    │   │   ├── departments/ # Tabela de departamentos
    │   │   ├── printers/    # Tabela de impressoras
    │   │   ├── sectors/     # Tabela de setores
    │   │   └── users/       # Tabela de usuários
    │   ├── home/            # Componentes da página inicial
    │   ├── sidebar/         # Componentes da barra lateral
    │   └── ui/              # Componentes de UI base (Shadcn/UI)
    ├── generated/           # Arquivos gerados pelo Prisma
    │   └── prisma/          # Cliente Prisma tipado
    ├── hooks/               # React Hooks personalizados
    ├── lib/                 # Bibliotecas e configurações
    │   ├── auth/            # Configuração de autenticação
    │   │   ├── auth.ts      # Configuração do Better-Auth
    │   │   ├── permissions.ts # Sistema de permissões
    │   │   └── with-permissions.ts # HOC para controle de acesso
    │   ├── schemas/         # Schemas de validação Zod
    │   ├── types/           # Tipos TypeScript personalizados
    │   ├── utils/           # Funções utilitárias específicas
    │   ├── prisma.ts        # Instância do cliente Prisma
    │   └── utils.ts         # Utilitários gerais (cn, etc.)
    └── middleware.ts        # Middleware de autenticação
```

### **Padrões de Desenvolvimento**

- **Server Actions**: Todas as operações de banco são realizadas via Server Actions tipadas
- **Validação**: Schemas Zod para validação de dados de entrada
- **Permissões**: Sistema granular de permissões por recurso e ação
- **Componentes**: Separação clara entre componentes de UI, lógica e dados
- **Tipagem**: TypeScript em todo o projeto com tipos gerados pelo Prisma
- **Responsividade**: Design mobile-first com Tailwind CSS

## 🔍 Análise Técnica do Projeto

### **✅ Pontos Fortes**

#### **Arquitetura e Estrutura**
- **Arquitetura moderna**: Uso do Next.js 15 com App Router e Server Components
- **Separação de responsabilidades**: Clara divisão entre actions, components, lib e utils
- **Type Safety**: TypeScript em todo o projeto com tipos gerados pelo Prisma
- **Padrões consistentes**: Estrutura organizada e padronizada em todos os módulos

#### **Sistema de Autenticação e Segurança**
- **Better-Auth**: Implementação robusta com plugin de administração
- **Controle granular**: Sistema de permissões por recurso e ação
- **Middleware de proteção**: Rotas protegidas adequadamente
- **Validação de dados**: Schemas Zod para validação de entrada

#### **Interface e Experiência do Usuário**
- **Design system consistente**: Uso do Shadcn/UI com componentes reutilizáveis
- **Tabelas interativas**: TanStack Table com filtros, ordenação e paginação
- **Responsividade**: Design adaptável para diferentes dispositivos
- **Feedback visual**: Sistema de notificações com Sonner

#### **Banco de Dados e ORM**
- **Schema bem estruturado**: Relacionamentos claros entre entidades
- **Migrações organizadas**: Histórico de mudanças no banco bem documentado
- **Seed script**: População inicial de dados para desenvolvimento
- **Prisma ORM**: Type-safe database access com geração automática de tipos

### **⚠️ Pontos de Melhoria**

#### **Funcionalidades Pendentes**
- **Dashboard principal**: Página inicial ainda básica, sem métricas ou gráficos
- **Formulários de criação**: Alguns CRUDs podem estar incompletos
- **Histórico de ações**: Falta auditoria de mudanças nos ativos
- **Relatórios**: Sistema de exportação e relatórios não implementado

#### **Otimizações Técnicas**
- **Middleware limitado**: Proteção apenas para `/dashboard`, poderia ser mais granular
- **Error handling**: Tratamento de erros poderia ser mais robusto
- **Caching**: Implementar cache para consultas frequentes
- **Validação client-side**: Melhorar feedback em tempo real nos formulários

#### **Escalabilidade**
- **Paginação**: Implementar paginação server-side para grandes volumes
- **Busca avançada**: Sistema de busca mais sofisticado
- **Logs**: Sistema de logging para monitoramento
- **Testes**: Implementar testes unitários e de integração

### **🚀 Recomendações de Evolução**

#### **Curto Prazo**
1. Completar dashboard principal com métricas básicas
2. Implementar sistema de logs de auditoria
3. Melhorar tratamento de erros e loading states
4. Adicionar testes unitários para Server Actions

#### **Médio Prazo**
1. Sistema de relatórios e exportação
2. API REST para integrações externas
3. Sistema de notificações em tempo real
4. Módulo de manutenção preventiva

#### **Longo Prazo**
1. Aplicativo mobile para técnicos
2. Integração com sistemas de monitoramento
3. IA para predição de falhas
4. Dashboard executivo com BI


## 👨‍💻 Autor

Desenvolvido por [Luis Felipe de Paula Costa](https://github.com/lupebreak)

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).