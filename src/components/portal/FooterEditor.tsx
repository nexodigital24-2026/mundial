'use client';

import { useState } from 'react';
import {
  useFooterData,
  DEFAULT_FOOTER_DATA,
  type FooterLink,
  type FooterSection,
  type FooterSocial,
} from '@/lib/footer-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LayoutTemplate, Type, Link, Share2, Mail, Award,
  Plus, Trash2, Edit, Save, X, RotateCcw, Download, Upload,
  ChevronUp, ChevronDown, GripVertical, Eye, Copy,
  AlertTriangle, Globe, Phone, MapPin, Instagram, Twitter, Facebook, Youtube, Music,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ==================== ICON MAPPING ====================
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram, Twitter, Facebook, Youtube, Music,
};

// ==================== SOCIAL ICON BADGE ====================
function SocialIconBadge({ icon, size = 'sm' }: { icon: string; size?: 'sm' | 'md' }) {
  const IconComponent = iconMap[icon];
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  if (IconComponent) return <IconComponent className={sz} />;
  return <Globe className={sz} />;
}

// ==================== FOOTER LIVE PREVIEW ====================
function FooterPreview() {
  const { footerData } = useFooterData();

  if (!footerData.showFooter) {
    return (
      <div className="rounded-xl border-2 border-dashed border-muted-foreground/30 p-8 text-center text-muted-foreground">
        <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">El footer está oculto</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border shadow-lg">
      <div className="bg-gradient-to-b from-nd-green-dark to-nd-green text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-extrabold text-lg">{footerData.brandName}</span>
                <span className="text-nd-orange font-extrabold text-lg">{footerData.brandAccent}</span>
              </div>
              <p className="text-white/70 text-xs line-clamp-3">{footerData.brandDescription}</p>
            </div>

            {/* First two sections */}
            {footerData.sections.slice(0, 2).map(section => (
              <div key={section.id}>
                <h3 className="text-nd-orange font-bold mb-2 text-xs tracking-wider uppercase">{section.title}</h3>
                <ul className="space-y-1 text-xs text-white/70">
                  {section.links.slice(0, 4).map(link => (
                    <li key={link.id} className="hover:text-nd-orange transition-colors cursor-pointer">{link.label}</li>
                  ))}
                  {section.links.length > 4 && <li className="text-white/40">+{section.links.length - 4} más</li>}
                </ul>
              </div>
            ))}
          </div>

          {/* Socials preview */}
          {footerData.socials.length > 0 && (
            <div className="mt-4 flex gap-2">
              {footerData.socials.slice(0, 5).map(social => (
                <div key={social.id} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <SocialIconBadge icon={social.icon} size="sm" />
                </div>
              ))}
            </div>
          )}

          {/* Copyright */}
          <div className="mt-4 pt-3 border-t border-white/20 text-center text-[10px] text-white/50">
            {footerData.copyrightText} &copy; {footerData.copyrightYear} {footerData.brandName}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN FOOTER EDITOR ====================
export default function FooterEditor() {
  const {
    footerData,
    updateFooterField,
    updateSection,
    addSection,
    removeSection,
    addLink,
    removeLink,
    updateLink,
    addSocial,
    removeSocial,
    updateSocial,
    resetToDefault,
    exportFooter,
    importFooter,
    serverSynced,
    lastServerSync,
    syncNow,
  } = useFooterData();

  const { toast } = useToast();
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [newLinkDialog, setNewLinkDialog] = useState<string | null>(null);
  const [newLinkForm, setNewLinkForm] = useState({ label: '', url: '', target: '_self' as '_self' | '_blank' });
  const [newSectionDialog, setNewSectionDialog] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSocialDialog, setNewSocialDialog] = useState(false);
  const [newSocialForm, setNewSocialForm] = useState({ platform: '', url: '', icon: 'Globe' });

  // Handlers
  const handleExport = () => {
    const json = exportFooter();
    navigator.clipboard.writeText(json).then(() => {
      toast({ title: 'Footer copiado', description: 'El JSON del footer se copió al portapapeles' });
    }).catch(() => {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nexo-digital-footer.json';
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Footer descargado', description: 'Se descargó el archivo JSON del footer' });
    });
  };

  const handleImport = () => {
    setImportError('');
    const success = importFooter(importText);
    if (success) {
      setImportOpen(false);
      setImportText('');
      toast({ title: 'Footer importado', description: 'Los datos se aplicaron correctamente' });
    } else {
      setImportError('JSON inválido. Verifica que tenga la estructura requerida.');
    }
  };

  const handleReset = () => {
    resetToDefault();
    toast({ title: 'Footer restablecido', description: 'Se volvió a la configuración original' });
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    const section: FooterSection = {
      id: `sec${Date.now()}`,
      title: newSectionTitle.trim(),
      links: [],
    };
    addSection(section);
    setNewSectionDialog(false);
    setNewSectionTitle('');
    setEditingSectionId(section.id);
  };

  const handleAddLink = (sectionId: string) => {
    if (!newLinkForm.label.trim()) return;
    const link: FooterLink = {
      id: `lk${Date.now()}`,
      label: newLinkForm.label.trim(),
      url: newLinkForm.url.trim() || '#',
      target: newLinkForm.target,
    };
    addLink(sectionId, link);
    setNewLinkDialog(null);
    setNewLinkForm({ label: '', url: '', target: '_self' });
  };

  const handleAddSocial = () => {
    if (!newSocialForm.platform.trim() || !newSocialForm.url.trim()) return;
    const social: FooterSocial = {
      id: `soc${Date.now()}`,
      platform: newSocialForm.platform.trim(),
      url: newSocialForm.url.trim(),
      icon: newSocialForm.icon,
    };
    addSocial(social);
    setNewSocialDialog(false);
    setNewSocialForm({ platform: '', url: '', icon: 'Globe' });
  };

  const moveSection = (idx: number, direction: 'up' | 'down') => {
    const sections = [...footerData.sections];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    [sections[idx], sections[targetIdx]] = [sections[targetIdx], sections[idx]];
    updateFooterField('sections', sections);
  };

  const moveLink = (sectionId: string, idx: number, direction: 'up' | 'down') => {
    updateSection(sectionId, (section) => {
      const links = [...section.links];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= links.length) return section;
      [links[idx], links[targetIdx]] = [links[targetIdx], links[idx]];
      return { ...section, links };
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nd-green-dark to-nd-green flex items-center justify-center shadow-lg">
            <LayoutTemplate className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Editor del Footer</h2>
            <p className="text-sm text-muted-foreground">Configura todas las secciones, enlaces y redes sociales</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Sync indicator */}
          <button
            onClick={syncNow}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer"
            style={{
              backgroundColor: serverSynced ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: serverSynced ? '#16a34a' : '#dc2626',
            }}
            title={serverSynced ? 'Sincronizado con el servidor' : 'No sincronizado — tocar para reintentar'}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${serverSynced ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
            {serverSynced ? 'Sincronizado' : 'Sin sincronizar'}
          </button>
          <Switch
            checked={footerData.showFooter}
            onCheckedChange={(v) => updateFooterField('showFooter', v)}
          />
          <Label className="text-sm">{footerData.showFooter ? 'Footer visible' : 'Footer oculto'}</Label>
        </div>
      </div>

      {/* Live Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Eye className="w-4 h-4 text-nd-green" />
            Vista Previa en Vivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FooterPreview />
        </CardContent>
      </Card>

      <Tabs defaultValue="brand" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="brand" className="text-xs sm:text-sm flex items-center gap-1">
            <Type className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Marca</span>
          </TabsTrigger>
          <TabsTrigger value="sections" className="text-xs sm:text-sm flex items-center gap-1">
            <Link className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Secciones</span>
          </TabsTrigger>
          <TabsTrigger value="socials" className="text-xs sm:text-sm flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Redes</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="text-xs sm:text-sm flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Contacto</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="text-xs sm:text-sm flex items-center gap-1">
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Herramientas</span>
          </TabsTrigger>
        </TabsList>

        {/* ========== BRAND TAB ========== */}
        <TabsContent value="brand" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Type className="w-4 h-4 text-nd-green" />
                Identidad de Marca
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Configura el nombre, acento y descripción que aparecen en el footer
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Nombre de marca</Label>
                  <Input
                    value={footerData.brandName}
                    onChange={(e) => updateFooterField('brandName', e.target.value)}
                    placeholder="Nexo Digital"
                    className="text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground">Texto en blanco que aparece primero</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Acento de marca</Label>
                  <Input
                    value={footerData.brandAccent}
                    onChange={(e) => updateFooterField('brandAccent', e.target.value)}
                    placeholder="Mundial"
                    className="text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground">Texto en naranja que aparece después</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Descripción</Label>
                <Textarea
                  value={footerData.brandDescription}
                  onChange={(e) => updateFooterField('brandDescription', e.target.value)}
                  placeholder="Describe tu portal..."
                  rows={3}
                  className="text-sm"
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Switch
                  checked={footerData.showRadioBadge}
                  onCheckedChange={(v) => updateFooterField('showRadioBadge', v)}
                />
                <div>
                  <Label className="text-sm font-semibold">Mostrar badge radio</Label>
                  <p className="text-[10px] text-muted-foreground">El badge &quot;NEXO DIGITAL&quot; con ícono de radio</p>
                </div>
              </div>

              {footerData.showRadioBadge && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Texto del badge</Label>
                  <Input
                    value={footerData.radioBadgeText}
                    onChange={(e) => updateFooterField('radioBadgeText', e.target.value)}
                    placeholder="NEXO DIGITAL"
                    className="text-sm max-w-xs"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Texto de Copyright</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    value={footerData.copyrightText}
                    onChange={(e) => updateFooterField('copyrightText', e.target.value)}
                    placeholder="Todos los derechos reservados"
                    className="text-sm"
                  />
                  <Input
                    value={footerData.copyrightYear}
                    onChange={(e) => updateFooterField('copyrightYear', e.target.value)}
                    placeholder="2026"
                    className="text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== SECTIONS TAB ========== */}
        <TabsContent value="sections" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Link className="w-4 h-4 text-nd-green" />
                  Secciones del Footer
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {footerData.sections.length} secciones — cada una aparece como una columna en el footer
                </p>
              </div>
              <Button size="sm" className="bg-nd-green hover:bg-nd-green-dark" onClick={() => setNewSectionDialog(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Agregar Sección
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {footerData.sections.map((section, idx) => {
                const isEditing = editingSectionId === section.id;
                return (
                  <div
                    key={section.id}
                    className={`rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                      isEditing ? 'border-nd-green shadow-lg ring-1 ring-nd-green/30' : 'border-border hover:border-nd-green/40'
                    }`}
                  >
                    {/* Section Header */}
                    <div
                      className="p-3 flex items-center gap-3 cursor-pointer"
                      onClick={() => setEditingSectionId(isEditing ? null : section.id)}
                    >
                      <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                        <button
                          className="p-0.5 rounded hover:bg-nd-green/10 text-muted-foreground hover:text-nd-green disabled:opacity-30"
                          disabled={idx === 0}
                          onClick={(e) => { e.stopPropagation(); moveSection(idx, 'up'); }}
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
                        <button
                          className="p-0.5 rounded hover:bg-nd-green/10 text-muted-foreground hover:text-nd-green disabled:opacity-30"
                          disabled={idx === footerData.sections.length - 1}
                          onClick={(e) => { e.stopPropagation(); moveSection(idx, 'down'); }}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge className="text-[9px] bg-nd-green/10 text-nd-green">Sección {idx + 1}</Badge>
                          <span className="text-sm font-bold truncate">{section.title}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{section.links.length} enlaces</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isEditing && (
                          <Badge className="bg-nd-green/10 text-nd-green text-[10px]">
                            <Edit className="w-2.5 h-2.5 mr-1" />Editando
                          </Badge>
                        )}
                        <button
                          className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                          onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                          title="Eliminar sección"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Section Content (expanded when editing) */}
                    {isEditing && (
                      <div className="px-3 pb-3 space-y-3 border-t pt-3 bg-muted/10">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold">Título de la sección</Label>
                          <Input
                            value={section.title}
                            onChange={(e) => updateSection(section.id, (s) => ({ ...s, title: e.target.value }))}
                            className="text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-semibold">Enlaces ({section.links.length})</Label>
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => {
                              setNewLinkForm({ label: '', url: '', target: '_self' });
                              setNewLinkDialog(section.id);
                            }}>
                              <Plus className="w-3 h-3 mr-1" /> Agregar enlace
                            </Button>
                          </div>

                          {section.links.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground text-xs bg-muted/30 rounded-lg">
                              No hay enlaces. Agrega el primero.
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              {section.links.map((link, linkIdx) => (
                                <div
                                  key={link.id}
                                  className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-card border border-border/50 hover:border-nd-green/30 transition-colors group"
                                >
                                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                                    <button
                                      className="p-0.5 rounded hover:bg-nd-green/10 text-muted-foreground hover:text-nd-green disabled:opacity-30"
                                      disabled={linkIdx === 0}
                                      onClick={() => moveLink(section.id, linkIdx, 'up')}
                                    >
                                      <ChevronUp className="w-3 h-3" />
                                    </button>
                                    <button
                                      className="p-0.5 rounded hover:bg-nd-green/10 text-muted-foreground hover:text-nd-green disabled:opacity-30"
                                      disabled={linkIdx === section.links.length - 1}
                                      onClick={() => moveLink(section.id, linkIdx, 'down')}
                                    >
                                      <ChevronDown className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <Input
                                      value={link.label}
                                      onChange={(e) => updateLink(section.id, link.id, (l) => ({ ...l, label: e.target.value }))}
                                      placeholder="Texto del enlace"
                                      className="text-xs h-8"
                                    />
                                    <Input
                                      value={link.url}
                                      onChange={(e) => updateLink(section.id, link.id, (l) => ({ ...l, url: e.target.value }))}
                                      placeholder="URL (#grupos, https://...)"
                                      className="text-xs h-8"
                                    />
                                    <Select
                                      value={link.target || '_self'}
                                      onValueChange={(v) => updateLink(section.id, link.id, (l) => ({ ...l, target: v as '_self' | '_blank' }))}
                                    >
                                      <SelectTrigger className="text-xs h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="_self">Misma ventana</SelectItem>
                                        <SelectItem value="_blank">Nueva ventana</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <button
                                    className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                                    onClick={() => removeLink(section.id, link.id)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {footerData.sections.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Link className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No hay secciones. Agrega la primera.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== SOCIALS TAB ========== */}
        <TabsContent value="socials" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-nd-green" />
                  Redes Sociales
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {footerData.socials.length} redes configuradas
                </p>
              </div>
              <Button size="sm" className="bg-nd-green hover:bg-nd-green-dark" onClick={() => setNewSocialDialog(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Agregar Red
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {footerData.socials.map((social) => (
                <div
                  key={social.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-nd-green/30 transition-colors group bg-white dark:bg-card"
                >
                  <div className="w-9 h-9 rounded-full bg-nd-green/10 flex items-center justify-center flex-shrink-0">
                    <SocialIconBadge icon={social.icon} size="md" />
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      value={social.platform}
                      onChange={(e) => updateSocial(social.id, (s) => ({ ...s, platform: e.target.value }))}
                      placeholder="Plataforma"
                      className="text-xs h-8"
                    />
                    <Input
                      value={social.url}
                      onChange={(e) => updateSocial(social.id, (s) => ({ ...s, url: e.target.value }))}
                      placeholder="https://..."
                      className="text-xs h-8 sm:col-span-2"
                    />
                  </div>

                  <Select
                    value={social.icon}
                    onValueChange={(v) => updateSocial(social.id, (s) => ({ ...s, icon: v }))}
                  >
                    <SelectTrigger className="w-24 text-xs h-8 flex-shrink-0">
                      <SocialIconBadge icon={social.icon} size="sm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram"><Instagram className="w-3 h-3 inline mr-1" />Instagram</SelectItem>
                      <SelectItem value="Twitter"><Twitter className="w-3 h-3 inline mr-1" />Twitter/X</SelectItem>
                      <SelectItem value="Facebook"><Facebook className="w-3 h-3 inline mr-1" />Facebook</SelectItem>
                      <SelectItem value="Youtube"><Youtube className="w-3 h-3 inline mr-1" />YouTube</SelectItem>
                      <SelectItem value="Music"><Music className="w-3 h-3 inline mr-1" />TikTok</SelectItem>
                      <SelectItem value="Globe"><Globe className="w-3 h-3 inline mr-1" />Web</SelectItem>
                    </SelectContent>
                  </Select>

                  <button
                    className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => removeSocial(social.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {footerData.socials.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Share2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No hay redes sociales. Agrega la primera.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== CONTACT TAB ========== */}
        <TabsContent value="contact" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Mail className="w-4 h-4 text-nd-green" />
                Información de Contacto
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Datos de contacto que se muestran en el footer
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </Label>
                <Input
                  type="email"
                  value={footerData.contactEmail}
                  onChange={(e) => updateFooterField('contactEmail', e.target.value)}
                  placeholder="info@nexodigitalmundial.com"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Teléfono
                </Label>
                <Input
                  value={footerData.contactPhone}
                  onChange={(e) => updateFooterField('contactPhone', e.target.value)}
                  placeholder="+54 11 1234-5678"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Dirección
                </Label>
                <Input
                  value={footerData.contactAddress}
                  onChange={(e) => updateFooterField('contactAddress', e.target.value)}
                  placeholder="Buenos Aires, Argentina"
                  className="text-sm"
                />
              </div>

              <div className="p-3 rounded-lg bg-muted/30 space-y-3">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={footerData.showSponsors}
                    onCheckedChange={(v) => updateFooterField('showSponsors', v)}
                  />
                  <Label className="text-sm font-semibold">Mostrar fila de patrocinadores</Label>
                </div>
                {footerData.showSponsors && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Texto de patrocinadores</Label>
                    <Textarea
                      value={footerData.sponsorsText}
                      onChange={(e) => updateFooterField('sponsorsText', e.target.value)}
                      placeholder="Patrocinadores oficiales:..."
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== TOOLS TAB ========== */}
        <TabsContent value="tools" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Download className="w-4 h-4 text-nd-green" />
                  Exportar Footer
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Copia la configuración del footer como JSON
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-muted/30 p-3 max-h-32 overflow-auto custom-scrollbar">
                  <pre className="text-[9px] font-mono text-muted-foreground whitespace-pre-wrap">
                    {exportFooter().substring(0, 500)}...
                  </pre>
                </div>
                <Button size="sm" onClick={handleExport} className="w-full">
                  <Copy className="w-4 h-4 mr-1" />
                  Copiar JSON
                </Button>
              </CardContent>
            </Card>

            {/* Import */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Upload className="w-4 h-4 text-nd-orange" />
                  Importar Footer
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Importa una configuración de footer desde JSON
                </p>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setImportOpen(true)}>
                  <Upload className="w-4 h-4 mr-1" />
                  Importar desde JSON
                </Button>
              </CardContent>
            </Card>

            {/* Reset */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-red-500" />
                  Restablecer
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Vuelve a la configuración original del footer
                </p>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" size="sm" onClick={handleReset} className="w-full">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Restablecer Footer Original
                </Button>
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  Estructura del Footer
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Resumen de la configuración actual
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Marca:</span>
                    <span className="font-semibold">{footerData.brandName} {footerData.brandAccent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Secciones:</span>
                    <span className="font-semibold">{footerData.sections.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enlaces totales:</span>
                    <span className="font-semibold">{footerData.sections.reduce((acc, s) => acc + s.links.length, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Redes sociales:</span>
                    <span className="font-semibold">{footerData.socials.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visible:</span>
                    <Badge className={`text-[9px] ${footerData.showFooter ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {footerData.showFooter ? 'Sí' : 'No'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ===== DIALOGS ===== */}

      {/* New Section Dialog */}
      <Dialog open={newSectionDialog} onOpenChange={setNewSectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Sección del Footer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Título de la sección</Label>
              <Input
                placeholder="Ej: Recursos, Legal, Compañía..."
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleAddSection} disabled={!newSectionTitle.trim()}>
                <Plus className="w-4 h-4 mr-1" />
                Crear Sección
              </Button>
              <Button variant="outline" onClick={() => setNewSectionDialog(false)}>Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Link Dialog */}
      <Dialog open={!!newLinkDialog} onOpenChange={(open) => { if (!open) setNewLinkDialog(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Enlace</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Texto del enlace</Label>
              <Input
                placeholder="Ej: Grupos y Posiciones"
                value={newLinkForm.label}
                onChange={(e) => setNewLinkForm(prev => ({ ...prev, label: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>URL de destino</Label>
              <Input
                placeholder="#grupos, https://..."
                value={newLinkForm.url}
                onChange={(e) => setNewLinkForm(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Abrir en</Label>
              <Select
                value={newLinkForm.target}
                onValueChange={(v) => setNewLinkForm(prev => ({ ...prev, target: v as '_self' | '_blank' }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_self">Misma ventana</SelectItem>
                  <SelectItem value="_blank">Nueva ventana</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => newLinkDialog && handleAddLink(newLinkDialog)}
                disabled={!newLinkForm.label.trim()}
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </Button>
              <Button variant="outline" onClick={() => setNewLinkDialog(null)}>Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Social Dialog */}
      <Dialog open={newSocialDialog} onOpenChange={setNewSocialDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aregar Red Social</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Plataforma</Label>
              <Input
                placeholder="Ej: Instagram, Twitter/X, Facebook..."
                value={newSocialForm.platform}
                onChange={(e) => setNewSocialForm(prev => ({ ...prev, platform: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>URL del perfil</Label>
              <Input
                placeholder="https://instagram.com/..."
                value={newSocialForm.url}
                onChange={(e) => setNewSocialForm(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Ícono</Label>
              <Select
                value={newSocialForm.icon}
                onValueChange={(v) => setNewSocialForm(prev => ({ ...prev, icon: v }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram"><Instagram className="w-3 h-3 inline mr-1" />Instagram</SelectItem>
                  <SelectItem value="Twitter"><Twitter className="w-3 h-3 inline mr-1" />Twitter/X</SelectItem>
                  <SelectItem value="Facebook"><Facebook className="w-3 h-3 inline mr-1" />Facebook</SelectItem>
                  <SelectItem value="Youtube"><Youtube className="w-3 h-3 inline mr-1" />YouTube</SelectItem>
                  <SelectItem value="Music"><Music className="w-3 h-3 inline mr-1" />TikTok</SelectItem>
                  <SelectItem value="Globe"><Globe className="w-3 h-3 inline mr-1" />Web</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleAddSocial}
                disabled={!newSocialForm.platform.trim() || !newSocialForm.url.trim()}
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </Button>
              <Button variant="outline" onClick={() => setNewSocialDialog(false)}>Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Footer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Pega el JSON del footer aquí</Label>
              <Textarea
                value={importText}
                onChange={(e) => { setImportText(e.target.value); setImportError(''); }}
                placeholder='{"brandName":"Nexo Digital",...}'
                rows={10}
                className="font-mono text-xs"
              />
              {importError && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <AlertTriangle className="w-3 h-3" />
                  {importError}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleImport} className="flex-1" disabled={!importText.trim()}>
                <Save className="w-4 h-4 mr-1" />
                Aplicar
              </Button>
              <Button variant="outline" onClick={() => setImportOpen(false)}>Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
