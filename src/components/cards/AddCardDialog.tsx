import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cards as cardsApi } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const cardSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  limit: z.string().refine((val) => !isNaN(Number(val.replace(/\D/g, ''))) && Number(val.replace(/\D/g, '')) > 0, {
    message: 'Limite deve ser maior que zero',
  }),
  closing_day: z.string().refine((val) => {
    const num = Number(val);
    return num >= 1 && num <= 31;
  }, 'Dia de fechamento deve estar entre 1 e 31'),
  due_day: z.string().refine((val) => {
    const num = Number(val);
    return num >= 1 && num <= 31;
  }, 'Dia de vencimento deve estar entre 1 e 31'),
});

type CardFormData = z.infer<typeof cardSchema>;

export function AddCardDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      name: '',
      limit: '',
      closing_day: '',
      due_day: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => cardsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast({
        title: 'Cartão criado com sucesso',
        description: 'O cartão foi adicionado à sua lista.',
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: 'Erro ao criar cartão',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: CardFormData) => {
    createMutation.mutate({
      name: data.name,
      limit: Number(data.limit.replace(/\D/g, '')) / 100,
      closing_day: Number(data.closing_day),
      due_day: Number(data.due_day),
      account_id: 1, // Mock account
    });
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = Number(numbers) / 100;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cartão
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Cartão de Crédito</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cartão</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Nubank, Itaú..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite do Cartão</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="R$ 0,00"
                      {...field}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value);
                        field.onChange(formatted);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="closing_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de Fechamento</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        placeholder="Ex: 15"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de Vencimento</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        placeholder="Ex: 25"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
