import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchases, vendors } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddPurchaseDialog } from '@/components/purchases/AddPurchaseDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { Plus, ShoppingCart, Eye, Package, FileCheck, CreditCard } from 'lucide-react';
import { Purchase } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  solicitado: { label: 'Solicitado', color: 'bg-blue-500', icon: ShoppingCart },
  recebido: { label: 'Recebido', color: 'bg-green-500', icon: Package },
  faturado: { label: 'Faturado', color: 'bg-purple-500', icon: FileCheck },
  pago: { label: 'Pago', color: 'bg-gray-500', icon: CreditCard },
};

export default function Purchases() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  const { data: purchasesList = [], isLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: purchases.list,
  });

  const { data: vendorsList = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => vendors.search(''),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Purchase['status'] }) =>
      purchases.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast({
        title: 'Status atualizado com sucesso',
      });
    },
  });

  const getVendorName = (vendorId: number) => {
    return vendorsList.find((v) => v.id === vendorId)?.name || 'Fornecedor';
  };

  const handleStatusChange = (purchaseId: number, newStatus: Purchase['status']) => {
    updateStatusMutation.mutate({ id: purchaseId, status: newStatus });
  };

  const handleViewDetails = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setDetailsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="pb-20 md:pb-0">Carregando...</div>;
  }

  return (
    <div className="pb-20 md:pb-0 space-y-4">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Compras</CardTitle>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Compra
          </Button>
        </CardHeader>
        <CardContent>
          {purchasesList.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="Nenhuma compra registrada"
              description="Comece registrando suas solicitações de compra e acompanhe o status de cada uma."
              action={{
                label: 'Criar primeira compra',
                onClick: () => setDialogOpen(true),
              }}
            />
          ) : (
            <div className="space-y-4">
              {purchasesList.map((purchase) => {
                const config = statusConfig[purchase.status];
                const Icon = config.icon;

                return (
                  <Card key={purchase.id} className="border-l-4" style={{ borderLeftColor: config.color.replace('bg-', '#') }}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold text-lg">
                              {getVendorName(purchase.vendor_id)}
                            </h3>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Status</p>
                              <Badge variant="outline">{config.label}</Badge>
                            </div>

                            {purchase.expected_date && (
                              <div>
                                <p className="text-muted-foreground">Data Prevista</p>
                                <p className="font-medium">
                                  {format(new Date(purchase.expected_date), 'dd/MM/yyyy', {
                                    locale: ptBR,
                                  })}
                                </p>
                              </div>
                            )}

                            <div>
                              <p className="text-muted-foreground">Valor Estimado</p>
                              <p className="font-medium">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(purchase.total_estimated || 0)}
                              </p>
                            </div>

                            {purchase.total_real && (
                              <div>
                                <p className="text-muted-foreground">Valor Real</p>
                                <p className="font-medium">
                                  {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  }).format(purchase.total_real)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Select
                            value={purchase.status}
                            onValueChange={(value) =>
                              handleStatusChange(purchase.id, value as Purchase['status'])
                            }
                          >
                            <SelectTrigger className="w-full md:w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="solicitado">Solicitado</SelectItem>
                              <SelectItem value="recebido">Recebido</SelectItem>
                              <SelectItem value="faturado">Faturado</SelectItem>
                              <SelectItem value="pago">Pago</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(purchase)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddPurchaseDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Compra</DialogTitle>
            <DialogDescription>
              Informações completas da solicitação de compra
            </DialogDescription>
          </DialogHeader>

          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fornecedor</p>
                  <p className="font-semibold">
                    {getVendorName(selectedPurchase.vendor_id)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline">
                    {statusConfig[selectedPurchase.status].label}
                  </Badge>
                </div>

                {selectedPurchase.expected_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">Data Prevista</p>
                    <p className="font-semibold">
                      {format(new Date(selectedPurchase.expected_date), 'dd/MM/yyyy', {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Valor Estimado</p>
                  <p className="font-semibold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(selectedPurchase.total_estimated || 0)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Timeline de Status</h4>
                <div className="space-y-2">
                  {(['solicitado', 'recebido', 'faturado', 'pago'] as const).map(
                    (status, index) => {
                      const config = statusConfig[status];
                      const Icon = config.icon;
                      const isCompleted = 
                        (['solicitado', 'recebido', 'faturado', 'pago'] as const).indexOf(selectedPurchase.status) >= index;

                      return (
                        <div
                          key={status}
                          className={`flex items-center gap-3 ${
                            isCompleted ? 'opacity-100' : 'opacity-40'
                          }`}
                        >
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${config.color}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{config.label}</span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
