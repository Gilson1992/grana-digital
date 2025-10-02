import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactions as transactionsApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Download, TrendingDown, TrendingUp, ArrowRightLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TxType } from '@/types';
import { cn } from '@/lib/utils';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const typeConfig = {
  expense: { label: 'Despesa', icon: TrendingDown, color: 'text-expense' },
  income: { label: 'Receita', icon: TrendingUp, color: 'text-income' },
  transfer: { label: 'Transferência', icon: ArrowRightLeft, color: 'text-transfer' },
};

export default function Transactions() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsApi.list(),
  });

  const filteredTransactions = transactions?.filter((tx) =>
    tx.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="hidden sm:flex">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="hidden sm:flex">
            <Download className="h-4 w-4" />
          </Button>
          <Button onClick={() => navigate('/quick-add')}>
            <Plus className="h-4 w-4 mr-2" />
            Novo
          </Button>
        </div>
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block shadow-md">
        <CardHeader>
          <CardTitle>Lançamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm">Data</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Descrição</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Categoria</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Conta</th>
                    <th className="text-right py-3 px-4 font-medium text-sm">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions?.map((tx) => {
                    const config = typeConfig[tx.type as TxType];
                    const Icon = config.icon;
                    
                    return (
                      <tr key={tx.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-sm">
                          {format(new Date(tx.date), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Icon className={cn('h-4 w-4', config.color)} />
                            <span className="font-medium">{tx.description}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {tx.category_id ? `Categoria ${tx.category_id}` : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          Conta {tx.account_id}
                        </td>
                        <td className={cn('py-3 px-4 text-right font-semibold', config.color)}>
                          {tx.type === 'expense' ? '-' : '+'} {formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredTransactions?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum lançamento encontrado.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            {filteredTransactions?.map((tx) => {
              const config = typeConfig[tx.type as TxType];
              const Icon = config.icon;
              
              return (
                <Card key={tx.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon className={cn('h-4 w-4', config.color)} />
                          <span className="font-semibold">{tx.description}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{format(new Date(tx.date), 'dd/MM/yyyy')}</span>
                          <span>•</span>
                          <span>Conta {tx.account_id}</span>
                        </div>
                        {tx.category_id && (
                          <Badge variant="secondary" className="text-xs">
                            Categoria {tx.category_id}
                          </Badge>
                        )}
                      </div>
                      <div className={cn('font-bold text-lg', config.color)}>
                        {tx.type === 'expense' ? '-' : '+'} {formatCurrency(tx.amount)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {filteredTransactions?.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Nenhum lançamento encontrado.</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Floating Add Button (Mobile) */}
      <Button
        size="icon"
        className="md:hidden fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg z-10"
        onClick={() => navigate('/quick-add')}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
