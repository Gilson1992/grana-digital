export type AccountType = 'bank' | 'wallet' | 'card' | 'cash';
export type TxType = 'expense' | 'income' | 'transfer';
export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash';
export type RecurrenceFreq = 'monthly' | 'weekly' | 'yearly';
export type PurchaseStatus = 'solicitado' | 'recebido' | 'faturado' | 'pago';
export type InvoiceStatus = 'open' | 'closed' | 'paid';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  currency: string;
  balance?: number;
  color?: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'despesa' | 'receita';
  parent_id?: number | null;
  icon?: string;
  color?: string;
}

export interface Vendor {
  id: number;
  name: string;
  cnpj?: string | null;
}

export interface Transaction {
  id: number;
  type: TxType;
  account_id: number;
  category_id?: number | null;
  vendor_id?: number | null;
  description: string;
  amount: number;
  date: string;
  competence_month?: string;
  payment_method?: PaymentMethod;
  installments_total?: number | null;
  installment_n?: number | null;
  attachment_url?: string | null;
  created_by?: number;
  account?: Account;
  category?: Category;
  vendor?: Vendor;
}

export interface Recurrence {
  id: number;
  transaction_template_id: number;
  freq: RecurrenceFreq;
  next_run_at: string;
  end_at?: string | null;
}

export interface Card {
  id: number;
  account_id: number;
  name: string;
  closing_day: number;
  due_day: number;
  limit?: number;
}

export interface CardInvoice {
  id: number;
  card_id: number;
  reference_month: string;
  status: InvoiceStatus;
  total: number;
  transactions?: Transaction[];
}

export interface Budget {
  id: number;
  category_id: number;
  month: string;
  limit_amount: number;
  used_amount?: number;
  category?: Category;
}

export interface Purchase {
  id: number;
  vendor_id: number;
  status: PurchaseStatus;
  expected_date?: string | null;
  received_date?: string | null;
  total_estimated?: number | null;
  total_real?: number | null;
  items?: PurchaseItem[];
  vendor?: Vendor;
}

export interface PurchaseItem {
  id: number;
  purchase_id: number;
  item_name: string;
  qty: number;
  unit_price: number;
}

export interface Rule {
  id: number;
  contains: string;
  category_id: number;
  priority: number;
  category?: Category;
}

export interface DashboardStats {
  total_balance: number;
  month_income: number;
  month_expense: number;
  budget_usage_percent: number;
  upcoming_bills_count: number;
  next_invoice_days?: number;
}

export interface ChartData {
  date: string;
  balance: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  color: string;
}
