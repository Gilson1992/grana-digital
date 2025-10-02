import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, TrendingDown, TrendingUp, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { transactions as transactionsApi } from '@/services/api';
import type { TxType } from '@/types';

const transactionSchema = z.object({
  type: z.enum(['expense', 'income', 'transfer']),
  amount: z.string().min(1, 'Valor é obrigatório'),
  date: z.date(),
  description: z.string().min(1, 'Descrição é obrigatória'),
  account_id: z.string().min(1, 'Conta é obrigatória'),
  category_id: z.string().optional(),
  vendor_id: z.string().optional(),
  payment_method: z.enum(['pix', 'credit', 'debit', 'cash']).optional(),
  installments: z.string().optional(),
  notes: z.string().optional(),
  recurrence_enabled: z.boolean().default(false),
  recurrence_freq: z.enum(['monthly', 'weekly', 'yearly']).optional(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

export default function QuickAdd() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialType = (searchParams.get('type') as TxType) || 'expense';
  const [activeTab, setActiveTab] = useState<TxType>(initialType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: initialType,
      date: new Date(),
      recurrence_enabled: false,
    },
  });

  const onSubmit = async (data: TransactionForm) => {
    setIsSubmitting(true);
    try {
      const amount = parseFloat(data.amount.replace(/[^\d,]/g, '').replace(',', '.'));
      
      await transactionsApi.create({
        type: data.type,
        amount,
        date: format(data.date, 'yyyy-MM-dd'),
        description: data.description,
        account_id: parseInt(data.account_id),
        category_id: data.category_id ? parseInt(data.category_id) : undefined,
        vendor_id: data.vendor_id ? parseInt(data.vendor_id) : undefined,
        payment_method: data.payment_method,
        installments_total: data.installments ? parseInt(data.installments) : undefined,
      });

      toast.success('Lançamento criado com sucesso!');
      navigate('/transactions');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar lançamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndNew = async () => {
    await form.handleSubmit(async (data) => {
      await onSubmit(data);
      form.reset({
        type: activeTab,
        date: new Date(),
        recurrence_enabled: false,
      });
    })();
  };

  const tabs = [
    { value: 'expense' as TxType, label: 'Despesa', icon: TrendingDown, color: 'text-expense' },
    { value: 'income' as TxType, label: 'Receita', icon: TrendingUp, color: 'text-income' },
    { value: 'transfer' as TxType, label: 'Transferência', icon: ArrowRightLeft, color: 'text-transfer' },
  ];

  return (
    <div className="max-w-3xl mx-auto pb-20 md:pb-0">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Novo Lançamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TxType)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              {tabs.map(({ value, label, icon: Icon, color }) => (
                <TabsTrigger key={value} value={value} className="gap-2">
                  <Icon className={cn('h-4 w-4', color)} />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map(({ value }) => (
              <TabsContent key={value} value={value}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <input type="hidden" {...field} value={activeTab} />
                      )}
                    />

                    {/* Amount */}
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="R$ 0,00"
                              className="text-lg"
                              inputMode="decimal"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Date */}
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'w-full justify-start text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, 'PPP', { locale: ptBR })
                                  ) : (
                                    <span>Selecione a data</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                locale={ptBR}
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: Almoço, Salário, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Account */}
                    <FormField
                      control={form.control}
                      name="account_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conta *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a conta" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Banco Inter</SelectItem>
                              <SelectItem value="2">Nubank</SelectItem>
                              <SelectItem value="3">Carteira</SelectItem>
                              <SelectItem value="4">PicPay</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category */}
                    {value !== 'transfer' && (
                      <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {value === 'expense' ? (
                                  <>
                                    <SelectItem value="1">🍽️ Alimentação</SelectItem>
                                    <SelectItem value="2">🚗 Transporte</SelectItem>
                                    <SelectItem value="3">🏠 Moradia</SelectItem>
                                    <SelectItem value="4">🎮 Lazer</SelectItem>
                                    <SelectItem value="5">💊 Saúde</SelectItem>
                                    <SelectItem value="6">📚 Educação</SelectItem>
                                  </>
                                ) : (
                                  <>
                                    <SelectItem value="7">💰 Salário</SelectItem>
                                    <SelectItem value="8">💼 Freelance</SelectItem>
                                    <SelectItem value="9">📈 Investimentos</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Payment Method */}
                    {value === 'expense' && (
                      <FormField
                        control={form.control}
                        name="payment_method"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Forma de Pagamento</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pix">PIX</SelectItem>
                                <SelectItem value="credit">Crédito</SelectItem>
                                <SelectItem value="debit">Débito</SelectItem>
                                <SelectItem value="cash">Dinheiro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Installments (if credit) */}
                    {form.watch('payment_method') === 'credit' && (
                      <FormField
                        control={form.control}
                        name="installments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parcelas</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="À vista" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[...Array(12)].map((_, i) => (
                                  <SelectItem key={i + 1} value={String(i + 1)}>
                                    {i + 1}x
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Notes */}
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} placeholder="Informações adicionais..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Recurrence */}
                    <FormField
                      control={form.control}
                      name="recurrence_enabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Recorrência</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Repetir este lançamento automaticamente
                            </div>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch('recurrence_enabled') && (
                      <FormField
                        control={form.control}
                        name="recurrence_freq"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequência</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="monthly">Mensal</SelectItem>
                                <SelectItem value="weekly">Semanal</SelectItem>
                                <SelectItem value="yearly">Anual</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={handleSaveAndNew}
                        disabled={isSubmitting}
                      >
                        Salvar + Novo
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
