import { useQuery } from '@tanstack/react-query';
import { cards as cardsApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { AddCardDialog } from '@/components/cards/AddCardDialog';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function Cards() {
  const navigate = useNavigate();
  
  const { data: cards, isLoading } = useQuery({
    queryKey: ['cards'],
    queryFn: () => cardsApi.list(),
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="space-y-6 pb-20 md:pb-0">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Meus Cartões</h2>
          <AddCardDialog />
        </div>
        <EmptyState
          icon={CreditCard}
          title="Nenhum cartão cadastrado"
          description="Adicione seus cartões de crédito para gerenciar faturas e parcelas."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meus Cartões</h2>
        <AddCardDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card
            key={card.id}
            className="shadow-md hover:shadow-lg transition-all cursor-pointer bg-gradient-primary text-primary-foreground"
            onClick={() => navigate(`/cards/${card.id}`)}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm opacity-80">Cartão de Crédito</p>
                  <h3 className="text-xl font-bold mt-1">{card.name}</h3>
                </div>
                <CreditCard className="h-8 w-8 opacity-80" />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-80">Limite:</span>
                  <span className="font-semibold">{formatCurrency(card.limit || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Fecha dia:</span>
                  <span className="font-semibold">{card.closing_day}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Vence dia:</span>
                  <span className="font-semibold">{card.due_day}</span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/cards/${card.id}/invoices`);
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Ver Faturas
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
