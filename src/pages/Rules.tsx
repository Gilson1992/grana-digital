import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { Workflow } from 'lucide-react';

export default function Rules() {
  return (
    <div className="pb-20 md:pb-0">
      <Card className="shadow-md">
        <CardContent className="p-0">
          <EmptyState
            icon={Workflow}
            title="Regras Automáticas"
            description="Funcionalidade em desenvolvimento. Em breve você poderá criar regras para categorização automática de lançamentos."
          />
        </CardContent>
      </Card>
    </div>
  );
}
