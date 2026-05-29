'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogIn, LogOut, User, Shield, PenTool, Briefcase, AlertCircle } from 'lucide-react';

export default function LoginTab() {
  const { user, login, logout, isAdmin, isEditor, isComercial } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error ?? 'Error al iniciar sesión');
      }
      setLoading(false);
    }, 500);
  };

  const handleQuickLogin = (quickEmail: string, quickPassword: string) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
    setError('');
    const result = login(quickEmail, quickPassword);
    if (!result.success) {
      setError(result.error ?? 'Error al iniciar sesión');
    }
  };

  const getRoleBadgeColor = () => {
    if (isAdmin) return 'bg-red-100 text-red-700 hover:bg-red-100';
    if (isEditor) return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
    if (isComercial) return 'bg-green-100 text-green-700 hover:bg-green-100';
    return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Administrador';
    if (isEditor) return 'Editor';
    if (isComercial) return 'Comercial';
    return 'Usuario';
  };

  // Logged in view
  if (user) {
    return (
      <div className="space-y-6 animate-fade-in max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Mi Cuenta
        </h2>

        <Card className="overflow-hidden border-2 border-primary/20">
          <div className="bg-gradient-to-r from-primary/10 to-celeste-light p-6 text-center">
            <Avatar className="w-20 h-20 mx-auto mb-3">
              <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge className={`mt-2 ${getRoleBadgeColor()}`}>
              {isAdmin ? <Shield className="w-3 h-3 mr-1" /> : isEditor ? <PenTool className="w-3 h-3 mr-1" /> : <Briefcase className="w-3 h-3 mr-1" />}
              {getRoleLabel()}
            </Badge>
          </div>

          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-sm">Permisos de Acceso</h4>
              <div className="grid grid-cols-1 gap-2">
                <div className={`flex items-center gap-2 p-2.5 rounded-lg text-sm ${isAdmin ? 'bg-red-50 text-red-700' : 'bg-muted/50 text-muted-foreground'}`}>
                  <Shield className="w-4 h-4" />
                  <span>Panel de Administración</span>
                  {isAdmin ? <Badge className="ml-auto text-[10px] bg-green-100 text-green-700 hover:bg-green-100">Acceso</Badge> : <Badge className="ml-auto text-[10px] bg-gray-100 text-gray-400 hover:bg-gray-100">Restringido</Badge>}
                </div>
                <div className={`flex items-center gap-2 p-2.5 rounded-lg text-sm ${isEditor ? 'bg-blue-50 text-blue-700' : 'bg-muted/50 text-muted-foreground'}`}>
                  <PenTool className="w-4 h-4" />
                  <span>Panel de Edición</span>
                  {isEditor ? <Badge className="ml-auto text-[10px] bg-green-100 text-green-700 hover:bg-green-100">Acceso</Badge> : <Badge className="ml-auto text-[10px] bg-gray-100 text-gray-400 hover:bg-gray-100">Restringido</Badge>}
                </div>
                <div className={`flex items-center gap-2 p-2.5 rounded-lg text-sm ${isComercial ? 'bg-green-50 text-green-700' : 'bg-muted/50 text-muted-foreground'}`}>
                  <Briefcase className="w-4 h-4" />
                  <span>Panel Comercial</span>
                  {isComercial ? <Badge className="ml-auto text-[10px] bg-green-100 text-green-700 hover:bg-green-100">Acceso</Badge> : <Badge className="ml-auto text-[10px] bg-gray-100 text-gray-400 hover:bg-gray-100">Restringido</Badge>}
                </div>
              </div>
            </div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Login form
  return (
    <div className="space-y-6 animate-fade-in max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <LogIn className="w-5 h-5 text-primary" />
        Iniciar Sesión
      </h2>

      <Card className="overflow-hidden border-2 border-primary/20">
        <div className="bg-gradient-to-r from-primary to-celeste-dark p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Nuevo Día Mundial</h3>
          <p className="text-sm text-white/80">Portal del Mundial 2026</p>
        </div>

        <CardContent className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@nuevodiaworld.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">Acceso rápido (demo)</p>
            <div className="space-y-2">
              <button
                onClick={() => handleQuickLogin('admin@nuevodiaworld.com', 'admin123')}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Administrador</p>
                  <p className="text-[11px] text-muted-foreground">admin@nuevodiaworld.com</p>
                </div>
              </button>
              <button
                onClick={() => handleQuickLogin('editor@nuevodiaworld.com', 'editor123')}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <PenTool className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Editor Deportivo</p>
                  <p className="text-[11px] text-muted-foreground">editor@nuevodiaworld.com</p>
                </div>
              </button>
              <button
                onClick={() => handleQuickLogin('comercial@nuevodiaworld.com', 'comercial123')}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Comercial</p>
                  <p className="text-[11px] text-muted-foreground">comercial@nuevodiaworld.com</p>
                </div>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
