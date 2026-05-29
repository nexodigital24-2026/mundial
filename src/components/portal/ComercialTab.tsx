'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { banners as defaultBanners, type Banner } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Briefcase, Megaphone, Plus, Edit, Trash2, Save, X,
  Eye, MousePointer, Calendar, ArrowUp, ArrowDown, ImageIcon
} from 'lucide-react';

const positionLabels: Record<Banner['position'], string> = {
  hero: 'Banner Principal',
  sidebar: 'Barra Lateral',
  footer: 'Pie de Página',
  'content-top': 'Contenido Superior',
  'content-bottom': 'Contenido Inferior',
};

export default function ComercialTab() {
  const { isComercial } = useAuth();
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [form, setForm] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    position: 'sidebar' as Banner['position'],
    priority: 1,
    startDate: '',
    endDate: '',
  });

  if (!isComercial) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <Briefcase className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Acceso Denegado</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Solo los usuarios con rol comercial y administradores pueden acceder a este panel.
        </p>
      </div>
    );
  }

  const openCreate = () => {
    setEditingBanner(null);
    setForm({ title: '', imageUrl: '', linkUrl: '', position: 'sidebar', priority: 1, startDate: '', endDate: '' });
    setDialogOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl ?? '',
      position: banner.position,
      priority: banner.priority,
      startDate: banner.startDate,
      endDate: banner.endDate,
    });
    setDialogOpen(true);
  };

  const saveBanner = () => {
    if (editingBanner) {
      setBanners(prev => prev.map(b =>
        b.id === editingBanner.id
          ? { ...b, ...form, linkUrl: form.linkUrl || undefined }
          : b
      ));
    } else {
      const newBanner: Banner = {
        id: `b${Date.now()}`,
        title: form.title,
        imageUrl: form.imageUrl,
        linkUrl: form.linkUrl || undefined,
        position: form.position,
        active: true,
        priority: form.priority,
        startDate: form.startDate,
        endDate: form.endDate,
        impressions: 0,
        clicks: 0,
        createdBy: 'comercial',
      };
      setBanners(prev => [...prev, newBanner]);
    }
    setDialogOpen(false);
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const toggleBannerActive = (id: string) => {
    setBanners(prev => prev.map(b =>
      b.id === id ? { ...b, active: !b.active } : b
    ));
  };

  const totalImpressions = banners.reduce((sum, b) => sum + b.impressions, 0);
  const totalClicks = banners.reduce((sum, b) => sum + b.clicks, 0);
  const activeBanners = banners.filter(b => b.active).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-primary" />
        Panel Comercial
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-4 text-center">
            <Megaphone className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">{banners.length}</p>
            <p className="text-xs text-muted-foreground">Total Banners</p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{activeBanners}</p>
            <p className="text-xs text-muted-foreground">Activos</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200">
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{(totalImpressions / 1000).toFixed(1)}K</p>
            <p className="text-xs text-muted-foreground">Impresiones</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200">
          <CardContent className="p-4 text-center">
            <MousePointer className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-600">{totalClicks.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Clics</p>
          </CardContent>
        </Card>
      </div>

      {/* Banner Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary" />
            Gestión de Banners
          </CardTitle>
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-1" />
            Nuevo Banner
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Banner</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead className="text-center">Prioridad</TableHead>
                  <TableHead className="text-center">Impresiones</TableHead>
                  <TableHead className="text-center">Clics</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.sort((a, b) => a.priority - b.priority).map((banner) => (
                  <TableRow key={banner.id} className={banner.active ? '' : 'opacity-50'}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate max-w-[200px]">{banner.title}</p>
                          <p className="text-[11px] text-muted-foreground">{banner.createdBy}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {positionLabels[banner.position]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-sm">{banner.priority}</span>
                    </TableCell>
                    <TableCell className="text-center text-sm">{banner.impressions.toLocaleString()}</TableCell>
                    <TableCell className="text-center text-sm">{banner.clicks.toLocaleString()}</TableCell>
                    <TableCell>
                      <Switch
                        checked={banner.active}
                        onCheckedChange={() => toggleBannerActive(banner.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(banner)}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500 hover:text-red-700" onClick={() => deleteBanner(banner.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Banner Preview */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Vista Previa de Banners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(['hero', 'sidebar', 'content-top', 'content-bottom', 'footer'] as Banner['position'][]).map((position) => {
              const posBanners = banners.filter(b => b.active && b.position === position);
              return (
                <div key={position} className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">{positionLabels[position]}</h4>
                  {posBanners.length === 0 ? (
                    <div className="p-4 rounded-lg border-2 border-dashed border-border text-center">
                      <p className="text-xs text-muted-foreground">Sin banners activos</p>
                    </div>
                  ) : (
                    posBanners.map(b => (
                      <div key={b.id} className="p-3 rounded-lg border bg-gradient-to-r from-nd-orange-light to-white flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{b.title}</span>
                        <Badge variant="secondary" className="text-[9px] ml-auto flex-shrink-0">#{b.priority}</Badge>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Banner Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBanner ? 'Editar Banner' : 'Nuevo Banner'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                placeholder="Ej: Adidas - Impossible Is Nothing"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>URL de Imagen</Label>
              <Input
                placeholder="/banners/mi-banner.jpg"
                value={form.imageUrl}
                onChange={(e) => setForm(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>URL de Enlace</Label>
              <Input
                placeholder="https://ejemplo.com"
                value={form.linkUrl}
                onChange={(e) => setForm(prev => ({ ...prev, linkUrl: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Posición</Label>
                <Select value={form.position} onValueChange={(v) => setForm(prev => ({ ...prev, position: v as Banner['position'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Banner Principal</SelectItem>
                    <SelectItem value="sidebar">Barra Lateral</SelectItem>
                    <SelectItem value="footer">Pie de Página</SelectItem>
                    <SelectItem value="content-top">Contenido Superior</SelectItem>
                    <SelectItem value="content-bottom">Contenido Inferior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prioridad</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={form.priority}
                  onChange={(e) => setForm(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha Inicio</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha Fin</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveBanner} className="flex-1" disabled={!form.title}>
                <Save className="w-4 h-4 mr-1" />
                {editingBanner ? 'Actualizar' : 'Crear'}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
