import { useQuery } from '@tanstack/react-query';
import { accounts as accountsApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, Banknote, Smartphone, Plus } from 'lucide-react';
import type { AccountType } from '@/types';
import { AddAccountDialog } from '@/components/accounts/AddAccountDialog';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const accountIcons: Record<AccountType, any> = {
  bank: Wallet,
  wallet: Smartphone,
  card: CreditCard,
  cash: Banknote,
};

const accountLabels: Record<AccountType, string> = {
  bank: 'Conta Bancária',
  wallet: 'Carteira Digital',
  card: 'Cartão',
  cash: 'Dinheiro',
};

export default function Accounts() {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.list(),
  });

  const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0;

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

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Minhas Contas</h2>
          <p className="text-muted-foreground">Saldo total: {formatCurrency(totalBalance)}</p>
        </div>
        <AddAccountDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {accounts?.map((account) => {
          const Icon = accountIcons[account.type];
          const isNegative = (account.balance || 0) < 0;
          
          return (
            <Card
              key={account.id}
              className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: account.color + '20' || 'hsl(var(--muted))' }}
                    >
                      <Icon
                        className="h-6 w-6"
                        style={{ color: account.color || 'hsl(var(--foreground))' }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {accountLabels[account.type]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Saldo Atual</p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: isNegative ? 'hsl(var(--destructive))' : 'inherit' }}
                  >
                    {formatCurrency(account.balance || 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
