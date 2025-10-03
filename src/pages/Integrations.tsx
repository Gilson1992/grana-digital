import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { integrations } from '@/services/api';
import { 
  MessageSquare, 
  Webhook, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Code2,
  AlertCircle 
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Integrations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testPhone, setTestPhone] = useState('');

  // Buscar status da integração
  const { data: whatsappStatus, isLoading } = useQuery({
    queryKey: ['integrations', 'whatsapp'],
    queryFn: integrations.whatsapp.status,
  });

  // Mutation para salvar webhook
  const saveWebhookMutation = useMutation({
    mutationFn: (url: string) => integrations.whatsapp.saveWebhook(url),
    onSuccess: () => {
      toast({
        title: 'Webhook salvo',
        description: 'URL do webhook foi configurada com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['integrations', 'whatsapp'] });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o webhook.',
        variant: 'destructive',
      });
    },
  });

  // Mutation para testar mensagem
  const testMessageMutation = useMutation({
    mutationFn: (phone: string) => integrations.whatsapp.testMessage(phone),
    onSuccess: () => {
      toast({
        title: 'Mensagem enviada',
        description: 'Mensagem de teste enviada com sucesso!',
      });
    },
    onError: () => {
      toast({
        title: 'Erro ao enviar',
        description: 'Não foi possível enviar a mensagem de teste.',
        variant: 'destructive',
      });
    },
  });

  // Mutation para toggle ativo/inativo
  const toggleActiveMutation = useMutation({
    mutationFn: (active: boolean) => integrations.whatsapp.toggleActive(active),
    onSuccess: (_, active) => {
      toast({
        title: active ? 'Integração ativada' : 'Integração desativada',
        description: active 
          ? 'A integração WhatsApp está agora ativa.'
          : 'A integração WhatsApp foi desativada.',
      });
      queryClient.invalidateQueries({ queryKey: ['integrations', 'whatsapp'] });
    },
  });

  const handleSaveWebhook = () => {
    if (!webhookUrl.trim()) {
      toast({
        title: 'URL obrigatória',
        description: 'Por favor, insira a URL do webhook.',
        variant: 'destructive',
      });
      return;
    }
    saveWebhookMutation.mutate(webhookUrl);
  };

  const handleTestMessage = () => {
    if (!testPhone.trim()) {
      toast({
        title: 'Telefone obrigatório',
        description: 'Por favor, insira um número de telefone.',
        variant: 'destructive',
      });
      return;
    }
    testMessageMutation.mutate(testPhone);
  };

  const isConnected = whatsappStatus?.connected || false;
  const isActive = whatsappStatus?.active || false;

  return (
    <div className="pb-20 md:pb-0 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Integrações</h1>
        <p className="text-muted-foreground mt-1">
          Configure integrações com serviços externos
        </p>
      </div>

      {/* WhatsApp + N8N Card */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>WhatsApp via N8N</CardTitle>
                <CardDescription>
                  Receba e registre lançamentos automaticamente via WhatsApp
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Conectado
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  Não conectado
                </Badge>
              )}
              <Switch
                checked={isActive}
                onCheckedChange={(checked) => toggleActiveMutation.mutate(checked)}
                disabled={!isConnected || toggleActiveMutation.isPending}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Alert de informação */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Como funciona?</AlertTitle>
            <AlertDescription>
              Configure um workflow no N8N que capture mensagens do WhatsApp e envie para o webhook abaixo. 
              O FinControl processará automaticamente os lançamentos com base em comandos simples.
            </AlertDescription>
          </Alert>

          {/* Configuração de Webhook */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Webhook className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="webhook-url" className="text-base font-semibold">
                URL do Webhook (N8N)
              </Label>
            </div>
            
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                placeholder="https://seu-n8n.com/webhook/fincontrol"
                value={webhookUrl || whatsappStatus?.webhook_url || ''}
                onChange={(e) => setWebhookUrl(e.target.value)}
                disabled={saveWebhookMutation.isPending}
              />
              <Button 
                onClick={handleSaveWebhook}
                disabled={saveWebhookMutation.isPending}
              >
                Salvar
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Esta URL receberá os dados enviados pelo seu workflow N8N
            </p>
          </div>

          <Separator />

          {/* Teste de mensagem */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="test-phone" className="text-base font-semibold">
                Testar Envio
              </Label>
            </div>
            
            <div className="flex gap-2">
              <Input
                id="test-phone"
                placeholder="+55 11 99999-9999"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                disabled={testMessageMutation.isPending}
              />
              <Button 
                onClick={handleTestMessage}
                disabled={testMessageMutation.isPending || !isConnected}
                variant="outline"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Teste
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Envie uma mensagem de teste para confirmar a integração
            </p>
          </div>

          <Separator />

          {/* Comandos aceitos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-base font-semibold">Comandos Aceitos</h3>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-3 font-mono text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Despesa:</p>
                <code className="text-foreground">despesa 150 uber categoria:transporte</code>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Receita:</p>
                <code className="text-foreground">receita 3500 salário categoria:salário</code>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Transferência:</p>
                <code className="text-foreground">transferência 500 nubank para inter</code>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Compra parcelada:</p>
                <code className="text-foreground">despesa 1200 notebook 6x categoria:tecnologia</code>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Envie mensagens neste formato pelo WhatsApp e o sistema registrará automaticamente
            </p>
          </div>

          <Separator />

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Mensagens Processadas</p>
              <p className="text-2xl font-bold mt-1">{whatsappStatus?.messages_processed || 0}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
              <p className="text-2xl font-bold mt-1">{whatsappStatus?.success_rate || 0}%</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Última Mensagem</p>
              <p className="text-2xl font-bold mt-1">{whatsappStatus?.last_message || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de outras integrações futuras */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Outras Integrações</CardTitle>
          <CardDescription>Em desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-dashed rounded-lg p-6 text-center opacity-50">
              <p className="text-sm text-muted-foreground">Telegram</p>
              <Badge variant="outline" className="mt-2">Em breve</Badge>
            </div>
            <div className="border border-dashed rounded-lg p-6 text-center opacity-50">
              <p className="text-sm text-muted-foreground">Email</p>
              <Badge variant="outline" className="mt-2">Em breve</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
