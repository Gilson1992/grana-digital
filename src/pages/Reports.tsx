import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Relatórios</h2>
        <div className="flex gap-2">
          <Select defaultValue="current-month">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Mês Atual</SelectItem>
              <SelectItem value="last-3-months">Últimos 3 Meses</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Despesas por Categoria</h3>
                <p className="text-sm text-muted-foreground">Análise detalhada</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-success/10">
                <FileText className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">Receitas por Origem</h3>
                <p className="text-sm text-muted-foreground">Análise de entradas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Fluxo de Caixa</h3>
                <p className="text-sm text-muted-foreground">Entradas x Saídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Relatórios detalhados em breve! Por enquanto, você pode visualizar os dados no Dashboard e exportar seus lançamentos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
