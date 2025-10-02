import { useQuery } from '@tanstack/react-query';
import { budgets as budgetsApi, categories as categoriesApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, TrendingDown } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function Budgets() {
  const { data: budgets, isLoading } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => budgetsApi.list(),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories', 'despesa'],
    queryFn: () => categoriesApi.list({ type: 'despesa' }),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!budgets || budgets.length === 0) {
    return (
      <EmptyState
        icon={TrendingDown}
        title="Nenhum orçamento configurado"
        description="Defina limites mensais para suas categorias de despesas e controle melhor seus gastos."
        action={{ label: 'Criar Orçamento', onClick: () => {} }}
      />
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orçamentos</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {budgets.map((budget) => {
          const category = categories?.find((c) => c.id === budget.category_id);
          const usedPercent = ((budget.used_amount || 0) / budget.limit_amount) * 100;
          const isOverBudget = usedPercent > 100;
          
          return (
            <Card key={budget.id} className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2">
                    {category?.icon && <span className="text-2xl">{category.icon}</span>}
                    {category?.name || `Categoria ${budget.category_id}`}
                  </span>
                  <span
                    className="text-sm font-normal"
                    style={{ color: isOverBudget ? 'hsl(var(--destructive))' : 'inherit' }}
                  >
                    {usedPercent.toFixed(0)}%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress
                  value={Math.min(usedPercent, 100)}
                  className="h-2"
                />
                
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-muted-foreground">Gasto</p>
                    <p className="font-semibold">{formatCurrency(budget.used_amount || 0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Limite</p>
                    <p className="font-semibold">{formatCurrency(budget.limit_amount)}</p>
                  </div>
                </div>

                {isOverBudget && (
                  <p className="text-xs text-destructive font-medium">
                    ⚠️ Orçamento excedido em {formatCurrency((budget.used_amount || 0) - budget.limit_amount)}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
