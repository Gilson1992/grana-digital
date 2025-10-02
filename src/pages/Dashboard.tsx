import { useQuery } from '@tanstack/react-query';
import { dashboard } from '@/services/api';
import { KpiCard } from '@/components/shared/KpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, TrendingDown, Target, AlertCircle, CreditCard, Plus } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function Dashboard() {
  const navigate = useNavigate();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboard.stats,
  });

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['dashboard-balance'],
    queryFn: () => dashboard.balanceChart(),
  });

  const { data: expensesData, isLoading: expensesLoading } = useQuery({
    queryKey: ['dashboard-expenses'],
    queryFn: () => dashboard.expensesByCategory(),
  });

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Saldo Consolidado"
          value={formatCurrency(stats?.total_balance || 0)}
          icon={Wallet}
          className="md:col-span-2 lg:col-span-1"
        />
        <KpiCard
          title="Receitas do Mês"
          value={formatCurrency(stats?.month_income || 0)}
          icon={TrendingUp}
          trend={{ value: '+12.5%', positive: true }}
        />
        <KpiCard
          title="Despesas do Mês"
          value={formatCurrency(stats?.month_expense || 0)}
          icon={TrendingDown}
        />
        <KpiCard
          title="Orçamento Utilizado"
          value={`${stats?.budget_usage_percent || 0}%`}
          icon={Target}
        />
      </div>

      {/* Alerts */}
      {(stats?.upcoming_bills_count || stats?.next_invoice_days) && (
        <div className="grid gap-4 md:grid-cols-2">
          {stats.upcoming_bills_count > 0 && (
            <Card className="border-warning">
              <CardContent className="flex items-center gap-3 p-4">
                <AlertCircle className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium">Contas a Vencer</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.upcoming_bills_count} conta{stats.upcoming_bills_count > 1 ? 's' : ''} nos próximos 7 dias
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {stats.next_invoice_days && (
            <Card className="border-primary">
              <CardContent className="flex items-center gap-3 p-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Fatura Próxima</p>
                  <p className="text-sm text-muted-foreground">
                    Fecha em {stats.next_invoice_days} dia{stats.next_invoice_days > 1 ? 's' : ''}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Balance Chart */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Saldo Diário do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={balanceData || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).getDate().toString()}
                    className="text-xs"
                  />
                  <YAxis
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                    className="text-xs"
                  />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString('pt-BR')
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Expenses by Category */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {expensesLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesData || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) =>
                      `${category} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {(expensesData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => navigate('/quick-add?type=expense')}
            >
              <TrendingDown className="mr-2 h-5 w-5 text-expense" />
              <div className="text-left">
                <div className="font-semibold">Nova Despesa</div>
                <div className="text-xs text-muted-foreground">Registrar gasto</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => navigate('/quick-add?type=income')}
            >
              <TrendingUp className="mr-2 h-5 w-5 text-income" />
              <div className="text-left">
                <div className="font-semibold">Nova Receita</div>
                <div className="text-xs text-muted-foreground">Registrar ganho</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => navigate('/quick-add?type=transfer')}
            >
              <Plus className="mr-2 h-5 w-5 text-transfer" />
              <div className="text-left">
                <div className="font-semibold">Transferência</div>
                <div className="text-xs text-muted-foreground">Entre contas</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
