# FinControl - Sistema de Controle Financeiro

Sistema completo de gestão financeira pessoal desenvolvido com React, TypeScript e TailwindCSS. Interface mobile-first com experiência app-like para controle de despesas, receitas, cartões, orçamentos e relatórios.

## 🚀 Tecnologias

- **Frontend**: React 18 + Vite + TypeScript
- **UI**: TailwindCSS + shadcn/ui + Radix UI
- **Roteamento**: React Router 6
- **Estado**: TanStack Query (React Query)
- **Formulários**: react-hook-form + zod
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Datas**: date-fns

## 📦 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── shared/         # Componentes compartilhados (KpiCard, EmptyState, etc.)
│   ├── ui/             # Componentes shadcn/ui
│   ├── AppLayout.tsx   # Layout principal com sidebar e topbar
│   ├── AppSidebar.tsx  # Sidebar de navegação (desktop)
│   ├── BottomTabBar.tsx # Tab bar de navegação (mobile)
│   ├── Topbar.tsx      # Barra superior
│   └── ProtectedRoute.tsx # Guard de rotas autenticadas
├── hooks/              # Custom hooks
│   ├── useAuth.tsx     # Hook de autenticação
│   └── useTheme.tsx    # Hook de tema (light/dark)
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx   # Dashboard com KPIs e gráficos
│   ├── QuickAdd.tsx    # Formulário rápido de lançamentos
│   ├── Transactions.tsx # Lista de lançamentos
│   ├── Cards.tsx       # Gestão de cartões
│   ├── Budgets.tsx     # Orçamentos por categoria
│   ├── Reports.tsx     # Relatórios
│   ├── Accounts.tsx    # Contas bancárias/carteiras
│   ├── Profile.tsx     # Perfil do usuário
│   └── ...             # Outras páginas
├── services/           # Serviços e API
│   └── api.ts          # Cliente API com mock data
├── types/              # Tipos TypeScript
│   └── index.ts        # Definições de tipos
├── lib/                # Utilitários
│   └── utils.ts        # Funções auxiliares
├── App.tsx             # Componente raiz
└── main.tsx           # Entry point

```

## 🎨 Design System

### Cores Principais
- **Primary**: Indigo vibrante (`#6366F1`) - CTAs e destaques
- **Success**: Verde (`#10B981`) - Receitas
- **Expense**: Vermelho (`#EF4444`) - Despesas
- **Transfer**: Azul (`#6366F1`) - Transferências

### Tokens CSS
Todas as cores e estilos estão definidos em `src/index.css` usando variáveis CSS. O sistema suporta **light** e **dark mode** com persistência via localStorage.

### Componentes UI
Baseados em **shadcn/ui** com customizações:
- Rounded corners: `2xl` (16px)
- Shadows: suaves e em camadas
- Espaçamento: generoso para touch targets (min 44px)
- Animações: transições suaves

## 🔑 Autenticação

O sistema usa um mock de autenticação para demonstração. Para conectar à API Laravel real:

1. Configure a `baseURL` em `src/services/api.ts`
2. Implemente o fluxo OAuth/JWT conforme seu backend
3. Atualize o `AuthProvider` em `src/hooks/useAuth.tsx`

**Credenciais Demo**: Qualquer email/senha funciona no modo mock.

## 📱 Navegação

### Desktop
- **Topbar**: busca global, tema, menu do usuário
- **Sidebar**: navegação principal (collapsible)

### Mobile
- **Bottom Tab Bar**: 5 abas principais (Dashboard, Lançar, Lançamentos, Relatórios, Perfil)
- **Floating Action Button**: adicionar lançamento rápido

## 🗂 Funcionalidades Principais

### ✅ Implementadas
1. **Dashboard Interativo**
   - KPIs: saldo, receitas, despesas, orçamento
   - Gráfico de linha: saldo diário
   - Gráfico de pizza: despesas por categoria
   - Alertas: contas a vencer, faturas próximas

2. **Quick Add (Lançar)**
   - Tabs: Despesa / Receita / Transferência
   - Campos: valor, data, descrição, conta, categoria, fornecedor
   - Forma de pagamento (PIX, crédito, débito, dinheiro)
   - Parcelas (para crédito)
   - Recorrência (mensal/semanal/anual)
   - Validação com zod

3. **Lista de Lançamentos**
   - Busca por descrição
   - Filtros salvos
   - Visualização: tabela (desktop) + cards (mobile)
   - Paginação

4. **Gestão de Cartões**
   - Lista de cartões com limite e vencimento
   - Visualização de faturas por mês
   - Ações: Fechar fatura / Registrar pagamento

5. **Orçamentos**
   - Configuração de limites mensais por categoria
   - Visualização de progresso (%)
   - Alertas de orçamento excedido

6. **Contas**
   - Lista de contas (banco, carteira, cartão, dinheiro)
   - Saldo consolidado
   - Cores customizadas por tipo

7. **Perfil**
   - Dados do usuário
   - Alteração de senha
   - Preferências (tema, notificações)

8. **Tema Dark/Light**
   - Toggle no topbar
   - Persistência em localStorage

### 🚧 Em Desenvolvimento
- Compras (CRUD completo)
- Regras de categorização automática
- Relatórios avançados (CSV/Excel/PDF)
- Integração WhatsApp (n8n)
- Upload de anexos
- Modo offline

## 🔌 API Integration

### Mock Data
Atualmente o app usa mock data definido em `src/services/api.ts`. Para produção:

1. **Altere a baseURL**:
```typescript
const baseURL = 'https://sua-api.com/api';
```

2. **Endpoints Esperados** (Laravel):
```
POST   /api/login
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
GET    /api/accounts
GET    /api/categories
GET    /api/vendors
GET    /api/cards
GET    /api/budgets
POST   /api/budgets
GET    /api/rules
POST   /api/rules
GET    /api/dashboard/stats
GET    /api/dashboard/balance-chart
GET    /api/dashboard/expenses-by-category
```

3. **Autenticação**:
O app espera um token JWT retornado no login. Configure o Laravel Sanctum conforme necessário.

### Query Keys (TanStack Query)
```typescript
['dashboard-stats']
['dashboard-balance']
['dashboard-expenses']
['transactions', params]
['accounts']
['categories', type]
['cards']
['budgets', month]
['rules']
```

## 🎯 Query Params

- `/quick-add?type=expense` - Abrir formulário de despesa
- `/quick-add?type=income` - Abrir formulário de receita
- `/quick-add?type=transfer` - Abrir formulário de transferência

## 🧪 Como Rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📝 Validações (zod)

Todos os formulários usam `zod` para validação:
- Valores positivos
- Datas válidas
- Campos obrigatórios
- Regras condicionais (ex: parcelas apenas se crédito)

Exemplo:
```typescript
const transactionSchema = z.object({
  amount: z.string().min(1, 'Valor é obrigatório'),
  date: z.date(),
  description: z.string().min(1, 'Descrição é obrigatória'),
  // ...
});
```

## 🌐 Internacionalização

Todo o texto visível está em **Português Brasileiro (PT-BR)**:
- Botões: "Salvar", "Cancelar", "Excluir"
- Mensagens: "Lançamento criado com sucesso!"
- Empty states: "Nenhum lançamento encontrado."
- Datas: formatadas com `date-fns` + `locale: ptBR`

## 🔒 Segurança

- Validação client-side com zod
- Protected routes com `ProtectedRoute`
- Token JWT em localStorage (pode ser migrado para httpOnly cookies)
- CORS configurado no backend

## 📱 Responsividade

- **Mobile-first**: design otimizado para < 768px
- **Breakpoints**:
  - `sm`: 640px
  - `md`: 768px (sidebar aparece)
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1400px

## 🎨 Customização

### Cores
Edite `src/index.css` para alterar o palette:
```css
:root {
  --primary: 238 79% 61%;
  --success: 142 71% 45%;
  --expense: 0 84% 60%;
  /* ... */
}
```

### Componentes
Personalize shadcn components em `src/components/ui/`. Exemplo: adicionar variantes ao Button.

## 🐛 Troubleshooting

### "Module not found"
```bash
npm install
```

### "Cannot read property of undefined" no Dashboard
Verifique se os queries estão retornando dados válidos e usando `|| []` como fallback.

### Build errors
```bash
npm run build
# Verifique os erros TypeScript
```

## 📚 Recursos

- [React Query Docs](https://tanstack.com/query/latest)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de uso livre para fins educacionais e comerciais.

---

**Desenvolvido com ❤️ usando Lovable.dev**
