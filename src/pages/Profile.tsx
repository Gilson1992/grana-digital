import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { User, Mail, Lock, Bell, Moon } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-0">
      {/* User Info */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Perfil do Usuário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <div className="flex gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-2" />
                <Input id="name" defaultValue={user?.name} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="flex gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-2" />
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
            </div>

            <Button className="w-full sm:w-auto">Atualizar Perfil</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Senha Atual</Label>
            <Input id="current-password" type="password" placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">Nova Senha</Label>
            <Input id="new-password" type="password" placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <Input id="confirm-password" type="password" placeholder="••••••••" />
          </div>

          <Button className="w-full sm:w-auto">Alterar Senha</Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                <Label htmlFor="dark-mode" className="font-medium">
                  Modo Escuro
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Alterar tema da aplicação
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <Label htmlFor="notifications" className="font-medium">
                  Notificações
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receber alertas de vencimentos
              </p>
            </div>
            <Switch id="notifications" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
