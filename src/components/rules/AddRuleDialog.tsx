import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rules, categories } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Rule } from '@/types';
import { Loader2, TestTube } from 'lucide-react';

const ruleSchema = z.object({
  contains: z.string().min(2, 'Digite pelo menos 2 caracteres'),
  category_id: z.number({
    required_error: 'Selecione uma categoria',
  }),
  priority: z.number().min(1).max(100).default(50),
});

type RuleFormData = z.infer<typeof ruleSchema>;

interface AddRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: Rule;
}

export function AddRuleDialog({ open, onOpenChange, rule }: AddRuleDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [testResult, setTestResult] = useState<string | null>(null);

  const { data: expenseCategories = [] } = useQuery({
    queryKey: ['categories', 'despesa'],
    queryFn: () => categories.list({ type: 'despesa' }),
  });

  const form = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: rule || {
      contains: '',
      category_id: undefined,
      priority: 50,
    },
  });

  const createMutation = useMutation({
    mutationFn: rules.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      toast({
        title: 'Regra criada com sucesso',
        description: 'A regra será aplicada aos próximos lançamentos.',
      });
      onOpenChange(false);
      form.reset();
      setTestResult(null);
    },
    onError: () => {
      toast({
        title: 'Erro ao criar regra',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    },
  });

  const testMutation = useMutation({
    mutationFn: rules.test,
    onSuccess: (data) => {
      const matchedExamples = data.matches.filter(m => m.would_apply);
      if (matchedExamples.length > 0) {
        setTestResult(`✓ Exemplos que correspondem: ${matchedExamples.map(m => `"${m.description}"`).join(', ')}`);
      } else {
        setTestResult(`✗ Nenhum exemplo corresponde à regra`);
      }
    },
  });

  const onSubmit = (data: RuleFormData) => {
    createMutation.mutate(data);
  };

  const handleTest = () => {
    const contains = form.getValues('contains');
    if (!contains) {
      toast({
        title: 'Digite um texto para testar',
        variant: 'destructive',
      });
      return;
    }
    testMutation.mutate({ contains });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {rule ? 'Editar Regra' : 'Nova Regra Automática'}
          </DialogTitle>
          <DialogDescription>
            Crie regras para categorizar lançamentos automaticamente
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contains"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quando a descrição contém</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: uber, ifood, netflix"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aplicar categoria</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade (1-100)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleTest}
                disabled={testMutation.isPending}
                className="flex-1"
              >
                {testMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <TestTube className="h-4 w-4 mr-2" />
                )}
                Testar Regra
              </Button>
            </div>

            {testResult && (
              <Alert>
                <AlertDescription>{testResult}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                  setTestResult(null);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
