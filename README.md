# ADIT - Administração de Ativos e TI

## 📋 Sobre o Projeto

O **ADIT** (Administração de Ativos da TI) é um sistema de gestão desenvolvido para otimizar o controle e a manutenção de ativos e serviços de TI da Prefeitura de Barra Mansa. O objetivo principal é proporcionar visibilidade, organização e um fluxo de trabalho otimizado para a equipe de TI, começando pela gestão eficiente de impressoras e telefones.

## 🎯 Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- **Better-Auth**: Sistema robusto de autenticação
- **Controle de acesso**: Roles ADMIN e OPERATOR
- **Gerenciamento de usuários**: Criação, edição, banimento
- **Sessões seguras**: Controle de sessões e tokens

### 🏢 Gestão Organizacional
- **Secretarias**: Criação e gerenciamento de secretarias
- **Setores**: Vinculação de setores às secretarias
- **Hierarquia**: Estrutura organizacional completa

### 📱 Gestão de Ativos
- **Ativos Gerais**: Sistema unificado para diferentes tipos de ativos
- **Impressoras**: Gestão completa com modelos, toners e especificações
- **Telefones**: Controle de telefones VOIP, analógicos e digitais
- **Status de Ativos**: USING, STOCK, BROKEN, MAINTENANCE, RESERVED
- **Histórico**: Rastreamento de mudanças de status

### 🛠️ Serviços Públicos
- **Solicitação de Toner**: Formulário público para pedidos de toner
- **Solicitação de Manutenção**: Formulário público para manutenção de equipamentos
- **Acompanhamento**: Sistema de status para solicitações

### 📊 Gestão de Solicitações
- **Pedidos de Toner**: Aprovação, entrega e rejeição
- **Solicitações de Manutenção**: Controle de status (PENDING, ANALYZING, MAINTENANCE, COMPLETED, CANCELLED)
- **Histórico**: Rastreamento completo de mudanças

### 🎨 Interface Moderna
- **Design Responsivo**: Tailwind CSS com tema escuro
- **Componentes Reutilizáveis**: Shadcn/UI
- **Tabelas Interativas**: TanStack Table com filtros e paginação
- **Navegação Intuitiva**: Sidebar com controle de acesso

## 🚀 Tecnologias

### Frontend
- **Next.js 15**: Framework React com App Router
- **React 19**: Biblioteca de interface
- **TypeScript 5**: Tipagem estática
- **Tailwind CSS 4**: Framework CSS utilitário
- **Shadcn/UI**: Componentes acessíveis
- **TanStack Table**: Tabelas interativas
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de schemas
- **Sonner**: Sistema de notificações

### Backend & Database
- **Next.js Server Actions**: API serverless
- **Prisma ORM**: Object-Relational Mapping
- **PostgreSQL**: Banco de dados relacional
- **Better-Auth**: Sistema de autenticação

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- npm ou yarn

### Configuração

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/LuPeBreak/adit
   cd adit
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   # Database
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/adit?schema=public"
   
   # Authentication
   BETTER_AUTH_SECRET="sua-chave-secreta-aqui"
   BETTER_AUTH_URL="http://localhost:3000"
   
   # Admin Contact (opcional)
   ADMIN_EMAIL="admin@barramansa.rj.gov.br"
   ADMIN_WHATSAPP="24999999999"
   ```

4. **Execute as migrações:**
   ```bash
   npx prisma migrate dev
   ```

5. **Popule o banco (opcional):**
   ```bash
   npx prisma db seed
   ```

### Executando o Projeto

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

Acesse `http://localhost:3000` para visualizar a aplicação.

## 📁 Estrutura do Projeto

```
├── prisma/                    # Configuração do banco de dados
│   ├── migrations/           # Migrações do banco
│   ├── schema.prisma        # Schema do banco
│   └── seed.ts              # Dados iniciais
├── src/
    ├── actions/             # Server Actions
    │   ├── assets/          # Ações de ativos
    │   ├── auth/            # Autenticação
    │   ├── departments/     # Secretarias
    │   ├── maintenance-requests/ # Solicitações de manutenção
    │   ├── phones/          # Telefones
    │   ├── printer-models/  # Modelos de impressora
    │   ├── printers/        # Impressoras
    │   ├── sectors/         # Setores
    │   ├── toner-requests/  # Solicitações de toner
    │   └── users/           # Usuários
    ├── app/                 # Rotas da aplicação
    │   ├── (private)/       # Área administrativa
    │   │   └── dashboard/   # Painel de controle
    │   ├── (public)/        # Área pública
    │   │   ├── servicos/    # Serviços públicos
    │   │   └── page.tsx     # Página inicial
    │   └── api/             # API routes
    ├── components/          # Componentes React
    │   ├── data-tables/     # Tabelas de dados
    │   ├── forms/           # Formulários
    │   ├── home/            # Componentes da home
    │   ├── sidebar/         # Navegação
    │   ├── departments/     # Componentes para secretarias
    │   ├── sectors/         # Componentes para setores
    │   ├── assets/          # Componentes para ativos
    │   ├── printers/        # Componentes para impressoras
    │   ├── phones/          # Componentes para telefones
    │   ├── requests/        # Componentes para solicitações
    │   └── ui/              # Componentes base
    ├── lib/                 # Bibliotecas e configurações
    │   ├── auth/            # Configuração de autenticação
    │   ├── schemas/         # Schemas de validação
    │   ├── types/           # Tipos TypeScript
    │   └── utils/           # Utilitários
    └── middleware.ts        # Middleware de autenticação
```

## 🗄️ Modelos de Dados

### Principais Entidades
- **User**: Usuários do sistema (ADMIN/OPERATOR)
- **Session**: Sessões de autenticação dos usuários
- **Account**: Contas vinculadas aos usuários
- **Verification**: Tokens de verificação para autenticação
- **Department**: Secretarias da prefeitura (organizadas hierarquicamente)
- **Sector**: Setores que pertencem às secretarias
- **Asset**: Ativos de TI (impressoras, telefones, etc.)
- **AssetStatusHistory**: Histórico de status dos ativos
- **Printer**: Impressoras específicas com informações detalhadas
- **PrinterModel**: Modelos de impressoras disponíveis
- **Phone**: Telefones do sistema
- **PhoneType**: Tipos de telefones (fixo, móvel, etc.)
- **TonerRequest**: Solicitações de toner para impressoras
- **MaintenanceRequest**: Solicitações de manutenção de equipamentos
- **MaintenanceRequestHistory**: Histórico das solicitações de manutenção

### Organização Hierárquica

Na Prefeitura Municipal de Barra Mansa, a organização segue a seguinte estrutura:

- **Secretarias** (departments): Órgãos principais da prefeitura, cada uma com seu secretário que responde diretamente ao prefeito
- **Setores** (sectors): Divisões internas das secretarias, responsáveis por áreas específicas de atuação

> **Nota**: O termo "department" é usado no código como nomenclatura em inglês para as secretarias, mantendo a padronização técnica do sistema.

## 🌐 Serviços Disponíveis

### Gestão de Secretarias e Setores
- **Secretarias**: Cadastro e gerenciamento das secretarias municipais
- **Setores**: Organização dos setores dentro de cada secretaria
- **Hierarquia**: Estrutura organizacional clara da prefeitura

### Serviços Públicos (Implementados)
1. **Solicitação de Toner** (`/servicos/toner`)
   - Formulário para pedido de toner
   - Seleção automática de toners compatíveis
   - Notificação por email

2. **Solicitação de Manutenção** (`/servicos/manutencao`)
   - Formulário para manutenção de equipamentos
   - Acompanhamento de status
   - Histórico de solicitações

### Área Administrativa
- Dashboard com métricas
- Gestão de ativos, usuários, secretarias
- Controle de solicitações
- Relatórios e históricos

## 🔒 Sistema de Permissões

O sistema implementa controle de acesso baseado em funções (RBAC):

- **ADMIN**: Acesso completo ao sistema
  - Gerenciamento de usuários
  - Gestão de secretarias e setores
  - Controle de ativos (impressoras, telefones)
  - Visualização e gerenciamento de todas as solicitações
  
- **OPERATOR**: Acesso limitado
  - Visualização de solicitações
  - Atualização de status de solicitações
  - Acesso aos dados básicos do sistema

## 📞 Contato e Suporte

Para suporte técnico ou dúvidas sobre o sistema:
- **Email**: Configurado via `ADMIN_EMAIL`
- **WhatsApp**: Configurado via `ADMIN_WHATSAPP`

## 🚀 Próximas Funcionalidades

- Dashboard com métricas avançadas
- Sistema de relatórios
- API REST para integrações
- Aplicativo mobile
- Sistema de notificações em tempo real
- Módulo de inventário automatizado

## 👨‍💻 Desenvolvimento

Desenvolvido para a Prefeitura Municipal de Barra Mansa
Coordenadoria de Tecnologia da Informação

## 📄 Licença

Este projeto está sob a licença MIT.