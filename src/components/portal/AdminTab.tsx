'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeCustomizer from './ThemeCustomizer';
import FooterEditor from './FooterEditor';
import {
  Shield, Users, Megaphone, FileEdit, Activity, Palette, LayoutTemplate,
  Plus, UserCheck, UserX, Clock, Eye, BarChart3
} from 'lucide-react';

interface LocalUser {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
}

interface ContentEditEntry {
  id: string;
  section: string;
  action: string;
  details: string;
  userId: string;
  createdAt: string;
}

const defaultUsers: LocalUser[] = [
  { id: 'u1', email: 'admin@nexodigitalmundial.com', name: 'Administrador', role: 'admin', active: true, createdAt: '2026-05-01' },
  { id: 'u2', email: 'editor@nexodigitalmundial.com', name: 'Editor Deportivo', role: 'editor', active: true, createdAt: '2026-05-15' },
  { id: 'u3', email: 'comercial@nexodigitalmundial.com', name: 'Comercial', role: 'comercial', active: true, createdAt: '2026-05-20' },
  { id: 'u4', email: 'editor2@nexodigitalmundial.com', name: 'Redactor Junior', role: 'editor', active: true, createdAt: '2026-06-01' },
  { id: 'u5', email: 'comercial2@nexodigitalmundial.com', name: 'Ventas Sr.', role: 'comercial', active: false, createdAt: '2026-06-05' },
];

const defaultEdits: ContentEditEntry[] = [
  { id: 'ce1', section: 'resultados', action: 'update', details: 'Actualización de marcador: México 3-0 Sudáfrica', userId: 'u2', createdAt: '2026-06-11 16:30' },
  { id: 'ce2', section: 'noticias', action: 'create', details: 'Nueva noticia: Messi lidera la goleada de Argentina', userId: 'u2', createdAt: '2026-06-16 21:00' },
  { id: 'ce3', section: 'banners', action: 'create', details: 'Banner creado: Qatar Airways - Viaja al Mundial', userId: 'u3', createdAt: '2026-06-10 10:15' },
  { id: 'ce4', section: 'goleadores', action: 'update', details: 'Actualización de goleadores: Messi +2 goles', userId: 'u4', createdAt: '2026-06-16 22:30' },
  { id: 'ce5', section: 'banners', action: 'update', details: 'Banner desactivado: Adidas - Nuevas Botas', userId: 'u3', createdAt: '2026-06-18 09:00' },
  { id: 'ce6', section: 'resultados', action: 'update', details: 'Actualización de marcador: España 3-0 Arabia Saudita', userId: 'u2', createdAt: '2026-06-15 18:45' },
  { id: 'ce7', section: 'sintesis', action: 'create', details: 'Síntesis creada: Argentina vs Argelia', userId: 'u4', createdAt: '2026-06-16 23:00' },
  { id: 'ce8', section: 'noticias', action: 'delete', details: 'Noticia eliminada: artículo duplicado', userId: 'u1', createdAt: '2026-06-17 08:00' },
];

export default function AdminTab() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<LocalUser[]>(defaultUsers);
  const [edits] = useState<ContentEditEntry[]>(defaultEdits);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', name: '', role: 'editor' });

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <Shield className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Acceso Denegado</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Solo los administradores pueden acceder a este panel. Inicie sesión con una cuenta de administrador.
        </p>
      </div>
    );
  }

  const activeUsers = users.filter(u => u.active).length;
  const inactiveUsers = users.filter(u => !u.active).length;

  const handleCreateUser = () => {
    if (!newUser.email || !newUser.name) return;
    const user: LocalUser = {
      id: `u${Date.now()}`,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, user]);
    setNewUser({ email: '', name: '', role: 'editor' });
    setDialogOpen(false);
  };

  const toggleUserActive = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: !u.active } : u));
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === 'admin') return 'bg-red-100 text-red-700 hover:bg-red-100';
    if (role === 'editor') return 'bg-nd-orange-light text-nd-orange-dark hover:bg-nd-orange-light';
    return 'bg-nd-orange-light text-nd-orange-dark hover:bg-nd-orange-light';
  };

  const getRoleLabel = (role: string) => {
    if (role === 'admin') return 'Admin';
    if (role === 'editor') return 'Editor';
    return 'Comercial';
  };

  const getActionBadge = (action: string) => {
    if (action === 'create') return 'bg-green-100 text-green-700 hover:bg-green-100';
    if (action === 'update') return 'bg-nd-orange-light text-nd-orange-dark hover:bg-nd-orange-light';
    return 'bg-red-100 text-red-700 hover:bg-red-100';
  };

  const getActionLabel = (action: string) => {
    if (action === 'create') return 'Crear';
    if (action === 'update') return 'Actualizar';
    return 'Eliminar';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        Panel de Administración
      </h2>

      <Tabs defaultValue="theme" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="theme" className="text-xs sm:text-sm flex items-center gap-1">
            <Palette className="w-4 h-4" />
            Colores
          </TabsTrigger>
          <TabsTrigger value="footer" className="text-xs sm:text-sm flex items-center gap-1">
            <LayoutTemplate className="w-4 h-4" />
            Footer
          </TabsTrigger>
          <TabsTrigger value="users" className="text-xs sm:text-sm">Usuarios</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm">Actividad</TabsTrigger>
        </TabsList>

        {/* ========== THEME TAB ========== */}
        <TabsContent value="theme" className="mt-4">
          <ThemeCustomizer />
        </TabsContent>

        {/* ========== FOOTER TAB ========== */}
        <TabsContent value="footer" className="mt-4">
          <FooterEditor />
        </TabsContent>

        {/* ========== USERS TAB ========== */}
        <TabsContent value="users" className="mt-4 space-y-4">
          {/* Stats overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">{users.length}</p>
                <p className="text-xs text-muted-foreground">Total Usuarios</p>
              </CardContent>
            </Card>
            <Card className="border-green-200">
              <CardContent className="p-4 text-center">
                <UserCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
                <p className="text-xs text-muted-foreground">Usuarios Activos</p>
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardContent className="p-4 text-center">
                <UserX className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{inactiveUsers}</p>
                <p className="text-xs text-muted-foreground">Inactivos</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200">
              <CardContent className="p-4 text-center">
                <FileEdit className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-amber-600">{edits.length}</p>
                <p className="text-xs text-muted-foreground">Ediciones</p>
              </CardContent>
            </Card>
          </div>

          {/* User Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Gestión de Usuarios
              </CardTitle>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Nuevo Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input
                        placeholder="Nombre completo"
                        value={newUser.name}
                        onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Correo Electrónico</Label>
                      <Input
                        type="email"
                        placeholder="correo@nexodigitalmundial.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rol</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(v) => setNewUser(prev => ({ ...prev, role: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="comercial">Comercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full" onClick={handleCreateUser} disabled={!newUser.email || !newUser.name}>
                      Crear Usuario
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Creado</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                                {u.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{u.name}</p>
                              <p className="text-[11px] text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-[11px] ${getRoleBadgeColor(u.role)}`}>
                            {getRoleLabel(u.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-[11px] ${u.active ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-100'}`}>
                            {u.active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{u.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Switch
                              checked={u.active}
                              onCheckedChange={() => toggleUserActive(u.id)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== ACTIVITY TAB ========== */}
        <TabsContent value="activity" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Registro de Actividad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-2">
                {edits.map((edit) => (
                  <div key={edit.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {edit.action === 'create' ? <Plus className="w-4 h-4 text-green-500" /> :
                       edit.action === 'update' ? <FileEdit className="w-4 h-4 text-nd-orange" /> :
                       <UserX className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge className={`text-[10px] ${getActionBadge(edit.action)}`}>
                          {getActionLabel(edit.action)}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {edit.section}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground">{edit.details}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{edit.createdAt}</span>
                        <span>•</span>
                        <span>Usuario: {edit.userId}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
