import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { Plug } from 'lucide-react';

export default function Integrations() {
  return (
    <div className="pb-20 md:pb-0">
      <Card className="shadow-md">
        <CardContent className="p-0">
          <EmptyState
            icon={Plug}
            title="Integrações"
            description="Funcionalidade em desenvolvimento. Em breve você poderá integrar o FinControl com WhatsApp (n8n) e outros serviços."
          />
        </CardContent>
      </Card>
    </div>
  );
}
