import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rules, categories } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AddRuleDialog } from '@/components/rules/AddRuleDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { Plus, Trash2, Edit, Workflow, MoveUp, MoveDown } from 'lucide-react';
import { Rule } from '@/types';

export default function Rules() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<number | null>(null);

  const { data: rulesList = [], isLoading } = useQuery({
    queryKey: ['rules'],
    queryFn: rules.list,
  });

  const { data: expenseCategories = [] } = useQuery({
    queryKey: ['categories', 'despesa'],
    queryFn: () => categories.list({ type: 'despesa' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      // Mock delete
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      toast({
        title: 'Regra excluída com sucesso',
      });
      setDeleteDialogOpen(false);
      setRuleToDelete(null);
    },
  });

  const handleDelete = (id: number) => {
    setRuleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule);
    setDialogOpen(true);
  };

  const getCategoryName = (categoryId: number) => {
    return expenseCategories.find((c) => c.id === categoryId)?.name || 'Categoria';
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 75) return 'destructive';
    if (priority >= 50) return 'default';
    return 'secondary';
  };

  if (isLoading) {
    return <div className="pb-20 md:pb-0">Carregando...</div>;
  }

  return (
    <div className="pb-20 md:pb-0 space-y-4">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Regras Automáticas</CardTitle>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Regra
          </Button>
        </CardHeader>
        <CardContent>
          {rulesList.length === 0 ? (
            <EmptyState
              icon={Workflow}
              title="Nenhuma regra criada"
              description="Crie regras para categorizar lançamentos automaticamente com base na descrição."
              action={{
                label: 'Criar primeira regra',
                onClick: () => setDialogOpen(true),
              }}
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Prioridade</TableHead>
                    <TableHead>Condição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rulesList
                    .sort((a, b) => b.priority - a.priority)
                    .map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <Badge variant={getPriorityColor(rule.priority)}>
                            {rule.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">Contém:</span>
                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
                              {rule.contains}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getCategoryName(rule.category_id)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(rule)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(rule.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddRuleDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingRule(undefined);
        }}
        rule={editingRule}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta regra? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => ruleToDelete && deleteMutation.mutate(ruleToDelete)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
