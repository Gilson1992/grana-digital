import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { ShoppingCart } from 'lucide-react';

export default function Purchases() {
  return (
    <div className="pb-20 md:pb-0">
      <Card className="shadow-md">
        <CardContent className="p-0">
          <EmptyState
            icon={ShoppingCart}
            title="Gestão de Compras"
            description="Funcionalidade em desenvolvimento. Em breve você poderá gerenciar suas compras, itens e status de pagamento."
          />
        </CardContent>
      </Card>
    </div>
  );
}
