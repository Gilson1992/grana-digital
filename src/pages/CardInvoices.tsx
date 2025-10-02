import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cards as cardsApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatMonth = (month: string) => {
  const [year, monthNum] = month.split('-');
  const date = new Date(Number(year), Number(monthNum) - 1);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

const statusLabels = {
  open: 'Aberta',
  closed: 'Fechada',
  paid: 'Paga',
};

const statusColors = {
  open: 'default',
  closed: 'secondary',
  paid: 'default',
} as const;

export default function CardInvoices() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: card, isLoading: cardLoading } = useQuery({
    queryKey: ['cards', id],
    queryFn: () => cardsApi.get(Number(id)),
    enabled: !!id,
  });

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['card-invoices', id],
    queryFn: () => cardsApi.getInvoices(Number(id)),
    enabled: !!id,
  });

  if (cardLoading || invoicesLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!card) {
    return (
      <EmptyState
        icon={Calendar}
        title="Cartão não encontrado"
        description="O cartão que você está procurando não existe."
        action={{ label: 'Voltar', onClick: () => navigate('/cards') }}
      />
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/cards')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Faturas - {card.name}</h2>
          <p className="text-sm text-muted-foreground">
            Fecha dia {card.closing_day} • Vence dia {card.due_day}
          </p>
        </div>
      </div>

      {!invoices || invoices.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Nenhuma fatura encontrada"
          description="As faturas deste cartão aparecerão aqui."
        />
      ) : (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <Card
              key={invoice.id}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">
                      {formatMonth(invoice.reference_month)}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusColors[invoice.status]}>
                        {invoice.status === 'open' && <Clock className="h-3 w-3 mr-1" />}
                        {invoice.status === 'paid' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {statusLabels[invoice.status]}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(invoice.total)}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p>Vencimento: {card.due_day}/{invoice.reference_month.split('-')[1]}</p>
                </div>

                <div className="flex gap-2">
                  {invoice.status === 'open' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        // TODO: Implement close invoice
                      }}
                    >
                      Fechar Fatura
                    </Button>
                  )}
                  {invoice.status === 'closed' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        // TODO: Implement pay invoice
                      }}
                    >
                      Registrar Pagamento
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/transactions?card_id=${card.id}&month=${invoice.reference_month}`)}
                  >
                    Ver Lançamentos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
