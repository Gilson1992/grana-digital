// API client with mock data for Laravel backend integration
// Change baseURL to your Laravel API URL when ready

import type {
  Account,
  Category,
  Vendor,
  Transaction,
  Card,
  CardInvoice,
  Budget,
  Rule,
  Purchase,
  DashboardStats,
  ChartData,
  CategoryExpense,
  User,
} from '@/types';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Mock data generator
const generateMockTransactions = (count: number = 20): Transaction[] => {
  const types: Array<'expense' | 'income' | 'transfer'> = ['expense', 'income', 'transfer'];
  const descriptions = [
    'Almoço restaurante',
    'Uber para trabalho',
    'Compras supermercado',
    'Freelance projeto',
    'Salário mensal',
    'Transferência poupança',
    'Academia mensal',
    'Netflix',
    'Conta de luz',
    'Internet fibra',
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    account_id: Math.floor(Math.random() * 3) + 1,
    category_id: Math.floor(Math.random() * 8) + 1,
    vendor_id: Math.floor(Math.random() * 5) + 1,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    amount: parseFloat((Math.random() * 500 + 10).toFixed(2)),
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    payment_method: ['pix', 'credit', 'debit', 'cash'][Math.floor(Math.random() * 4)] as any,
  }));
};

// Auth
// POST /api/login -> returns {token, user}
export const auth = {
  login: async (credentials: { email: string; password: string }): Promise<{ token: string; user: User }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (credentials.email && credentials.password) {
      return {
        token: 'mock-token-' + Date.now(),
        user: {
          id: 1,
          name: 'Usuário Demo',
          email: credentials.email,
        },
      };
    }
    throw new Error('Credenciais inválidas');
  },
};

// Transactions
// GET /api/transactions?from&to&type&account_id&category_id&search&page&per_page
export const transactions = {
  list: async (params?: any): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockTransactions(30);
  },
  
  // POST /api/transactions
  create: async (data: Partial<Transaction>): Promise<Transaction> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id: Date.now(),
      ...data,
    } as Transaction;
  },
  
  // PUT /api/transactions/:id
  update: async (id: number, data: Partial<Transaction>): Promise<Transaction> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id,
      ...data,
    } as Transaction;
  },
  
  // DELETE /api/transactions/:id
  remove: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },
};

// Accounts
// GET /api/accounts
export const accounts = {
  list: async (): Promise<Account[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 1, name: 'Banco Inter', type: 'bank', currency: 'BRL', balance: 5420.50, color: '#FF7A00' },
      { id: 2, name: 'Nubank', type: 'card', currency: 'BRL', balance: -1250.00, color: '#8A05BE' },
      { id: 3, name: 'Carteira', type: 'cash', currency: 'BRL', balance: 320.00, color: '#22C55E' },
      { id: 4, name: 'PicPay', type: 'wallet', currency: 'BRL', balance: 850.75, color: '#11C76F' },
    ];
  },
};

// Categories
// GET /api/categories?type=despesa|receita
export const categories = {
  list: async (params?: { type?: 'despesa' | 'receita' }): Promise<Category[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const all: Category[] = [
      { id: 1, name: 'Alimentação', type: 'despesa', icon: '🍽️', color: '#F59E0B' },
      { id: 2, name: 'Transporte', type: 'despesa', icon: '🚗', color: '#3B82F6' },
      { id: 3, name: 'Moradia', type: 'despesa', icon: '🏠', color: '#8B5CF6' },
      { id: 4, name: 'Lazer', type: 'despesa', icon: '🎮', color: '#EC4899' },
      { id: 5, name: 'Saúde', type: 'despesa', icon: '💊', color: '#EF4444' },
      { id: 6, name: 'Educação', type: 'despesa', icon: '📚', color: '#06B6D4' },
      { id: 7, name: 'Salário', type: 'receita', icon: '💰', color: '#10B981' },
      { id: 8, name: 'Freelance', type: 'receita', icon: '💼', color: '#14B8A6' },
      { id: 9, name: 'Investimentos', type: 'receita', icon: '📈', color: '#6366F1' },
    ];
    
    if (params?.type) {
      return all.filter(c => c.type === params.type);
    }
    return all;
  },
};

// Vendors
// GET /api/vendors?search=...
export const vendors = {
  search: async (q?: string): Promise<Vendor[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const all = [
      { id: 1, name: 'Uber' },
      { id: 2, name: 'iFood' },
      { id: 3, name: 'Amazon' },
      { id: 4, name: 'Mercado Livre' },
      { id: 5, name: 'Netflix' },
      { id: 6, name: 'Spotify' },
    ];
    
    if (q) {
      return all.filter(v => v.name.toLowerCase().includes(q.toLowerCase()));
    }
    return all;
  },
};

// Recurrences
// POST /api/recurrences | POST /api/recurrences/run
export const recurrences = {
  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { id: Date.now(), ...data };
  },
  run: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { processed: 5 };
  },
};

// Cards & Invoices
// GET /api/cards
export const cards = {
  list: async (): Promise<Card[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 1, account_id: 2, name: 'Nubank', closing_day: 15, due_day: 22, limit: 5000 },
      { id: 2, account_id: 1, name: 'Inter Mastercard', closing_day: 10, due_day: 18, limit: 3000 },
    ];
  },
  
  // GET /api/cards/:id
  get: async (id: number): Promise<Card> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { id, account_id: 2, name: 'Nubank', closing_day: 15, due_day: 22, limit: 5000 };
  },
  
  // GET /api/cards/:id/invoices/:month
  getInvoice: async (cardId: number, month: string): Promise<CardInvoice> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id: 1,
      card_id: cardId,
      reference_month: month,
      status: 'open',
      total: 1250.50,
      transactions: generateMockTransactions(8),
    };
  },
  
  // POST /api/cards/:id/close-invoice
  closeInvoice: async (id: number, month: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
  
  // POST /api/cards/:id/pay-invoice
  payInvoice: async (id: number, month: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
};

// Budgets
// GET /api/budgets?month=YYYY-MM
export const budgets = {
  list: async (params?: { month?: string }): Promise<Budget[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 1, category_id: 1, month: params?.month || '2025-01', limit_amount: 800, used_amount: 645.50 },
      { id: 2, category_id: 2, month: params?.month || '2025-01', limit_amount: 400, used_amount: 320.00 },
      { id: 3, category_id: 3, month: params?.month || '2025-01', limit_amount: 1500, used_amount: 1500.00 },
      { id: 4, category_id: 4, month: params?.month || '2025-01', limit_amount: 300, used_amount: 180.00 },
    ];
  },
  
  // POST /api/budgets (upsert)
  upsert: async (data: Partial<Budget>): Promise<Budget> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id: data.id || Date.now(),
      ...data,
    } as Budget;
  },
};

// Rules
// GET /api/rules
export const rules = {
  list: async (): Promise<Rule[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 1, contains: 'uber', category_id: 2, priority: 1 },
      { id: 2, contains: 'ifood', category_id: 1, priority: 2 },
      { id: 3, contains: 'netflix', category_id: 4, priority: 3 },
    ];
  },
  
  // POST /api/rules
  create: async (data: Partial<Rule>): Promise<Rule> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id: Date.now(),
      ...data,
    } as Rule;
  },
  
  // POST /api/rules/test
  test: async (data: Partial<Rule>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      matches: [
        { description: 'Uber para casa', would_apply: true },
        { description: 'Compras mercado', would_apply: false },
      ],
    };
  },
};

// Purchases
// GET /api/purchases
export const purchases = {
  list: async (): Promise<Purchase[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: 1,
        vendor_id: 3,
        status: 'solicitado',
        expected_date: '2025-02-15',
        total_estimated: 450.00,
      },
      {
        id: 2,
        vendor_id: 4,
        status: 'recebido',
        expected_date: '2025-01-20',
        received_date: '2025-01-22',
        total_estimated: 320.00,
        total_real: 315.50,
      },
    ];
  },
  
  // POST /api/purchases
  create: async (data: Partial<Purchase>): Promise<Purchase> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id: Date.now(),
      ...data,
    } as Purchase;
  },
  
  // PUT /api/purchases/:id/status
  updateStatus: async (id: number, status: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { success: true };
  },
};

// Dashboard
// GET /api/dashboard/stats
export const dashboard = {
  stats: async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      total_balance: 5340.25,
      month_income: 8500.00,
      month_expense: 4280.75,
      budget_usage_percent: 68,
      upcoming_bills_count: 3,
      next_invoice_days: 5,
    };
  },
  
  // GET /api/dashboard/balance-chart?month=YYYY-MM
  balanceChart: async (month?: string): Promise<ChartData[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const days = 30;
    const data: ChartData[] = [];
    let balance = 5000;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      balance += (Math.random() - 0.4) * 200;
      data.push({
        date: date.toISOString().split('T')[0],
        balance: parseFloat(balance.toFixed(2)),
      });
    }
    
    return data;
  },
  
  // GET /api/dashboard/expenses-by-category?month=YYYY-MM
  expensesByCategory: async (month?: string): Promise<CategoryExpense[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      { category: 'Alimentação', amount: 1250.50, color: '#F59E0B' },
      { category: 'Transporte', amount: 680.00, color: '#3B82F6' },
      { category: 'Moradia', amount: 1500.00, color: '#8B5CF6' },
      { category: 'Lazer', amount: 450.25, color: '#EC4899' },
      { category: 'Saúde', amount: 320.00, color: '#EF4444' },
      { category: 'Outros', amount: 80.00, color: '#6B7280' },
    ];
  },
};

// Integrations (WhatsApp)
// GET /api/integrations/whatsapp/status
// POST /api/integrations/whatsapp/test
export const integrations = {
  whatsapp: {
    status: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        connected: true,
        webhook_url: 'https://your-app.com/api/webhooks/whatsapp',
      };
    },
    testMessage: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Mensagem de teste enviada!' };
    },
  },
};

export default {
  auth,
  transactions,
  accounts,
  categories,
  vendors,
  recurrences,
  cards,
  budgets,
  rules,
  purchases,
  dashboard,
  integrations,
};
