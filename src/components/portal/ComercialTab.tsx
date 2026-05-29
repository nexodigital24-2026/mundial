'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { banners as defaultBanners, type Banner, type BannerPosition } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Briefcase, Megaphone, Plus, Edit, Trash2, Save, X,
  Eye, MousePointer, BarChart3, ImageIcon, Layout,
  Palette, Ruler, Timer, Target, Layers, ExternalLink
} from 'lucide-react';

const positionLabels: Record<BannerPosition, string> = {
  hero: 'Banner Principal',
  sidebar: 'Barra Lateral',
  footer: 'Pie de Página',
  'content-top': 'Contenido Superior',
  'content-bottom': 'Contenido Inferior',
  'navbar-below': 'Debajo del Nav',
  'between-matches': 'Entre Partidos',
  'sticky-bottom': 'Sticky Inferior',
  'floating-left': 'Flotante Izquierdo',
  'floating-right': 'Flotante Derecho',
  interstitial: 'Pantalla Completa',
};

const positionPresets: Record<BannerPosition, { width: number; height: number; bgColor: string; borderRadius: Banner['borderRadius']; displayDuration: number }> = {
  hero: { width: 728, height: 90, bgColor: '#E8F5E9', borderRadius: 'lg', displayDuration: 10 },
  sidebar: { width: 300, height: 250, bgColor: '#FFF3E0', borderRadius: 'md', displayDuration: 15 },
  footer: { width: 728, height: 90, bgColor: '#F5F5F5', borderRadius: 'md', displayDuration: 8 },
  'content-top': { width: 728, height: 90, bgColor: '#FFF3E0', borderRadius: 'lg', displayDuration: 10 },
  'content-bottom': { width: 728, height: 90, bgColor: '#F5F5F5', borderRadius: 'lg', displayDuration: 8 },
  'navbar-below': { width: 970, height: 66, bgColor: '#CC0000', borderRadius: 'none', displayDuration: 7 },
  'between-matches': { width: 728, height: 90, bgColor: '#E3F2FD', borderRadius: 'md', displayDuration: 10 },
  'sticky-bottom': { width: 970, height: 50, bgColor: '#026602', borderRadius: 'full', displayDuration: 5 },
  'floating-left': { width: 160, height: 600, bgColor: '#E8F5E9', borderRadius: 'md', displayDuration: 20 },
  'floating-right': { width: 160, height: 600, bgColor: '#FF6800', borderRadius: 'md', displayDuration: 20 },
  interstitial: { width: 800, height: 600, bgColor: '#1a1a2e', borderRadius: 'lg', displayDuration: 15 },
};

const borderRadiusLabels: Record<Banner['borderRadius'], string> = {
  none: 'Sin bordes',
  sm: 'Pequeño',
  md: 'Mediano',
  lg: 'Grande',
  full: 'Completo',
};

const borderRadiusClass: Record<Banner['borderRadius'], string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

function getContrastColor(hex: string): string {
  if (!hex || hex.length < 7) return '#1a1a1a';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
}

interface BannerForm {
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: BannerPosition;
  priority: number;
  startDate: string;
  endDate: string;
  width: number;
  height: number;
  displayDuration: number;
  targetType: '_blank' | '_self';
  bgColor: string;
  borderRadius: Banner['borderRadius'];
}

const defaultForm: BannerForm = {
  title: '',
  imageUrl: '',
  linkUrl: '',
  position: 'sidebar',
  priority: 1,
  startDate: '',
  endDate: '',
  width: 300,
  height: 250,
  displayDuration: 15,
  targetType: '_blank',
  bgColor: '#FFF3E0',
  borderRadius: 'md',
};

export default function ComercialTab() {
  const { isComercial } = useAuth();
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [form, setForm] = useState<BannerForm>({ ...defaultForm });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('table');

  const sortedBanners = useMemo(() =>
    [...banners].sort((a, b) => a.priority - b.priority),
    [banners]
  );

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
    setForm({ ...defaultForm });
    setDialogOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      position: banner.position,
      priority: banner.priority,
      startDate: banner.startDate,
      endDate: banner.endDate,
      width: banner.width,
      height: banner.height,
      displayDuration: banner.displayDuration,
      targetType: banner.targetType,
      bgColor: banner.bgColor,
      borderRadius: banner.borderRadius,
    });
    setDialogOpen(true);
  };

  const applyPreset = (position: BannerPosition) => {
    const preset = positionPresets[position];
    setForm(prev => ({
      ...prev,
      position,
      width: preset.width,
      height: preset.height,
      bgColor: preset.bgColor,
      borderRadius: preset.borderRadius,
      displayDuration: preset.displayDuration,
    }));
  };

  const saveBanner = () => {
    if (editingBanner) {
      setBanners(prev => prev.map(b =>
        b.id === editingBanner.id
          ? { ...b, ...form }
          : b
      ));
    } else {
      const newBanner: Banner = {
        id: `b${Date.now()}`,
        title: form.title,
        imageUrl: form.imageUrl,
        linkUrl: form.linkUrl,
        position: form.position,
        active: true,
        priority: form.priority,
        startDate: form.startDate,
        endDate: form.endDate,
        impressions: 0,
        clicks: 0,
        createdBy: 'comercial',
        width: form.width,
        height: form.height,
        displayDuration: form.displayDuration,
        targetType: form.targetType,
        bgColor: form.bgColor,
        borderRadius: form.borderRadius,
      };
      setBanners(prev => [...prev, newBanner]);
    }
    setDialogOpen(false);
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    setDeleteConfirmId(null);
  };

  const toggleBannerActive = (id: string) => {
    setBanners(prev => prev.map(b =>
      b.id === id ? { ...b, active: !b.active } : b
    ));
  };

  const totalImpressions = banners.reduce((sum, b) => sum + b.impressions, 0);
  const totalClicks = banners.reduce((sum, b) => sum + b.clicks, 0);
  const activeBanners = banners.filter(b => b.active).length;
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-primary" />
        Panel Comercial
      </h2>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-4 text-center">
            <Megaphone className="w-7 h-7 text-primary mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-primary">{banners.length}</p>
            <p className="text-xs text-muted-foreground">Total Banners</p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <Layers className="w-7 h-7 text-green-500 mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-green-600">{activeBanners}</p>
            <p className="text-xs text-muted-foreground">Activos</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200">
          <CardContent className="p-4 text-center">
            <Eye className="w-7 h-7 text-amber-500 mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-amber-600">{(totalImpressions / 1000).toFixed(1)}K</p>
            <p className="text-xs text-muted-foreground">Impresiones</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardContent className="p-4 text-center">
            <MousePointer className="w-7 h-7 text-orange-500 mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-orange-600">{totalClicks.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Clics</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 col-span-2 sm:col-span-1">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-7 h-7 text-purple-500 mx-auto mb-1.5" />
            <p className="text-2xl font-bold text-purple-600">{ctr}%</p>
            <p className="text-xs text-muted-foreground">CTR</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="table">
              <Layout className="w-4 h-4 mr-1" />
              Banners
            </TabsTrigger>
            <TabsTrigger value="positions">
              <Layers className="w-4 h-4 mr-1" />
              Mapa de Posiciones
            </TabsTrigger>
          </TabsList>
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-1" />
            Nuevo Banner
          </Button>
        </div>

        {/* Banner Table Tab */}
        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Banner</TableHead>
                      <TableHead>Posición</TableHead>
                      <TableHead className="text-center">Tamaño</TableHead>
                      <TableHead className="text-center">Duración</TableHead>
                      <TableHead className="text-center">Target</TableHead>
                      <TableHead className="text-center">Radio</TableHead>
                      <TableHead className="text-center">Color</TableHead>
                      <TableHead className="text-center">Prioridad</TableHead>
                      <TableHead className="text-center">Impr.</TableHead>
                      <TableHead className="text-center">Clics</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedBanners.map((banner) => (
                      <TableRow key={banner.id} className={banner.active ? '' : 'opacity-50'}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: banner.bgColor }}>
                              <ImageIcon className="w-4 h-4" style={{ color: getContrastColor(banner.bgColor) }} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate max-w-[160px]">{banner.title}</p>
                              <p className="text-[10px] text-muted-foreground">{banner.createdBy}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {positionLabels[banner.position]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-xs">
                          {banner.width}×{banner.height}
                        </TableCell>
                        <TableCell className="text-center text-xs">
                          {banner.displayDuration}s
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-[9px]">
                            {banner.targetType === '_blank' ? 'Nueva pestaña' : 'Misma'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-xs">
                          {borderRadiusLabels[banner.borderRadius]}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <div
                              className="w-4 h-4 border rounded-sm"
                              style={{ backgroundColor: banner.bgColor }}
                            />
                            <span className="text-[10px] text-muted-foreground">{banner.bgColor}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-sm">{banner.priority}</span>
                        </TableCell>
                        <TableCell className="text-center text-xs">{banner.impressions.toLocaleString()}</TableCell>
                        <TableCell className="text-center text-xs">{banner.clicks.toLocaleString()}</TableCell>
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
                            {deleteConfirmId === banner.id ? (
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="w-8 h-8 text-red-600" onClick={() => deleteBanner(banner.id)}>
                                  <Save className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setDeleteConfirmId(null)}>
                                  <X className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500 hover:text-red-700" onClick={() => setDeleteConfirmId(banner.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
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

        {/* Position Map Tab */}
        <TabsContent value="positions">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Mapa de Posiciones en la Página
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 min-h-[500px]">
                {/* Navbar-below */}
                <div className="mb-3">
                  <div className="bg-muted/60 h-8 rounded-md flex items-center px-3 mb-1">
                    <span className="text-[10px] font-medium text-muted-foreground">Navbar</span>
                  </div>
                  {banners.filter(b => b.active && b.position === 'navbar-below').length > 0 && (
                    <div className="mt-1">
                      <PositionBadge position="navbar-below" count={banners.filter(b => b.active && b.position === 'navbar-below').length} />
                    </div>
                  )}
                </div>

                {/* Floating Left */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2">
                  {banners.filter(b => b.active && b.position === 'floating-left').length > 0 && (
                    <PositionBadge position="floating-left" count={banners.filter(b => b.active && b.position === 'floating-left').length} vertical />
                  )}
                </div>

                {/* Floating Right */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {banners.filter(b => b.active && b.position === 'floating-right').length > 0 && (
                    <PositionBadge position="floating-right" count={banners.filter(b => b.active && b.position === 'floating-right').length} vertical />
                  )}
                </div>

                {/* Hero */}
                <div className="ml-16 mr-16 mb-3">
                  {banners.filter(b => b.active && b.position === 'hero').length > 0 ? (
                    <PositionBadge position="hero" count={banners.filter(b => b.active && b.position === 'hero').length} wide />
                  ) : (
                    <div className="h-16 border border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground">Hero</span>
                    </div>
                  )}
                </div>

                {/* Content Top */}
                <div className="ml-16 mr-16 mb-3">
                  {banners.filter(b => b.active && b.position === 'content-top').length > 0 ? (
                    <PositionBadge position="content-top" count={banners.filter(b => b.active && b.position === 'content-top').length} wide />
                  ) : (
                    <div className="h-8 border border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground">Content Top</span>
                    </div>
                  )}
                </div>

                {/* Main content + sidebar */}
                <div className="ml-16 mr-16 grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="md:col-span-2 space-y-3">
                    <div className="h-20 bg-muted/30 rounded-md flex items-center justify-center border border-muted-foreground/10">
                      <span className="text-[10px] text-muted-foreground">Contenido Principal</span>
                    </div>
                    {/* Between matches */}
                    {banners.filter(b => b.active && b.position === 'between-matches').length > 0 && (
                      <PositionBadge position="between-matches" count={banners.filter(b => b.active && b.position === 'between-matches').length} wide />
                    )}
                    <div className="h-20 bg-muted/30 rounded-md flex items-center justify-center border border-muted-foreground/10">
                      <span className="text-[10px] text-muted-foreground">Más Contenido</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {banners.filter(b => b.active && b.position === 'sidebar').length > 0 ? (
                      <PositionBadge position="sidebar" count={banners.filter(b => b.active && b.position === 'sidebar').length} />
                    ) : (
                      <div className="h-32 border border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center">
                        <span className="text-[10px] text-muted-foreground">Sidebar</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Bottom */}
                <div className="ml-16 mr-16 mb-3">
                  {banners.filter(b => b.active && b.position === 'content-bottom').length > 0 ? (
                    <PositionBadge position="content-bottom" count={banners.filter(b => b.active && b.position === 'content-bottom').length} wide />
                  ) : (
                    <div className="h-8 border border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground">Content Bottom</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="ml-16 mr-16">
                  <div className="bg-muted/60 h-8 rounded-md flex items-center px-3 mb-1">
                    <span className="text-[10px] font-medium text-muted-foreground">Footer</span>
                  </div>
                  {banners.filter(b => b.active && b.position === 'footer').length > 0 && (
                    <PositionBadge position="footer" count={banners.filter(b => b.active && b.position === 'footer').length} wide />
                  )}
                </div>

                {/* Sticky Bottom */}
                <div className="absolute bottom-2 left-4 right-4">
                  {banners.filter(b => b.active && b.position === 'sticky-bottom').length > 0 && (
                    <PositionBadge position="sticky-bottom" count={banners.filter(b => b.active && b.position === 'sticky-bottom').length} wide sticky />
                  )}
                </div>

                {/* Interstitial */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
                  {banners.filter(b => b.active && b.position === 'interstitial').length > 0 && (
                    <PositionBadge position="interstitial" count={banners.filter(b => b.active && b.position === 'interstitial').length} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingBanner ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingBanner ? 'Editar Banner' : 'Nuevo Banner'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            {/* Basic Info */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                Información Básica
              </h4>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  placeholder="Ej: Adidas - Impossible Is Nothing"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </div>

            {/* Position & Sizing */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                <Ruler className="w-4 h-4" />
                Posición y Tamaño
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Posición</Label>
                  <Select
                    value={form.position}
                    onValueChange={(v) => applyPreset(v as BannerPosition)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(positionLabels) as BannerPosition[]).map(pos => (
                        <SelectItem key={pos} value={pos}>{positionLabels[pos]}</SelectItem>
                      ))}
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

              {/* Preset Buttons */}
              <div className="space-y-1.5">
                <Label className="text-xs">Tamaños Predefinidos</Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(positionPresets) as BannerPosition[]).map(pos => {
                    const p = positionPresets[pos];
                    return (
                      <Button
                        key={pos}
                        variant={form.position === pos ? 'default' : 'outline'}
                        size="sm"
                        className="text-[11px] h-7"
                        onClick={() => applyPreset(pos)}
                      >
                        {positionLabels[pos]} ({p.width}×{p.height})
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ancho (px)</Label>
                  <Input
                    type="number"
                    min="50"
                    max="2000"
                    value={form.width}
                    onChange={(e) => setForm(prev => ({ ...prev, width: parseInt(e.target.value) || 300 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alto (px)</Label>
                  <Input
                    type="number"
                    min="50"
                    max="2000"
                    value={form.height}
                    onChange={(e) => setForm(prev => ({ ...prev, height: parseInt(e.target.value) || 250 }))}
                  />
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                <Timer className="w-4 h-4" />
                Configuración de Visualización
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duración de Rotación (segundos)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="range"
                      min="1"
                      max="60"
                      value={form.displayDuration}
                      onChange={(e) => setForm(prev => ({ ...prev, displayDuration: parseInt(e.target.value) || 10 }))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-10 text-right">{form.displayDuration}s</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Enlace</Label>
                  <Select
                    value={form.targetType}
                    onValueChange={(v) => setForm(prev => ({ ...prev, targetType: v as '_blank' | '_self' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_blank">Nueva pestaña (_blank)</SelectItem>
                      <SelectItem value="_self">Misma ventana (_self)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Style Settings */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                <Palette className="w-4 h-4" />
                Estilo Visual
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Color de Fondo</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.bgColor}
                      onChange={(e) => setForm(prev => ({ ...prev, bgColor: e.target.value }))}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={form.bgColor}
                      onChange={(e) => setForm(prev => ({ ...prev, bgColor: e.target.value }))}
                      placeholder="#E8F5E9"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bordes Redondeados</Label>
                  <Select
                    value={form.borderRadius}
                    onValueChange={(v) => setForm(prev => ({ ...prev, borderRadius: v as Banner['borderRadius'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(borderRadiusLabels) as Banner['borderRadius'][]).map(r => (
                        <SelectItem key={r} value={r}>{borderRadiusLabels[r]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                Programación
              </h4>
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
            </div>

            {/* Live Preview */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                Vista Previa en Tiempo Real
              </h4>
              <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center">
                <div
                  className={`relative overflow-hidden transition-all ${borderRadiusClass[form.borderRadius]}`}
                  style={{
                    backgroundColor: form.bgColor,
                    aspectRatio: `${form.width}/${form.height}`,
                    maxWidth: `min(${Math.min(form.width, 500)}px, 100%)`,
                    width: '100%',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0">
                        <Megaphone className="w-4 h-4" style={{ color: getContrastColor(form.bgColor) }} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: getContrastColor(form.bgColor) }}>
                          {form.title || 'Título del Banner'}
                        </p>
                        <Badge variant="secondary" className="text-[9px] mt-0.5">
                          {positionLabels[form.position]}
                        </Badge>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-50" style={{ color: getContrastColor(form.bgColor) }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{form.width}×{form.height}px</span>
                <span>•</span>
                <span>{form.displayDuration}s rotación</span>
                <span>•</span>
                <span>{form.targetType}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm border" style={{ backgroundColor: form.bgColor }} />
                  {form.bgColor}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
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

function PositionBadge({ position, count, wide, vertical, sticky }: { position: BannerPosition; count: number; wide?: boolean; vertical?: boolean; sticky?: boolean }) {
  const preset = positionPresets[position];
  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium ${borderRadiusClass[preset.borderRadius]} ${sticky ? 'border-2 border-dashed' : ''}`}
      style={{ backgroundColor: preset.bgColor + '40', color: getContrastColor(preset.bgColor) }}
    >
      <Megaphone className="w-3 h-3" />
      <span>{positionLabels[position]}</span>
      <Badge variant="secondary" className="text-[9px] ml-1">×{count}</Badge>
      <span className="text-[10px] opacity-70">({preset.width}×{preset.height})</span>
    </div>
  );
}
