'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme, DEFAULT_COLORS, THEME_PRESETS, type ThemeColors } from '@/lib/theme-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Palette, Paintbrush, Check, RotateCcw, Download, Upload, Copy,
  Sun, Moon, Eye, Sparkles, Save, AlertTriangle, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ==================== COLOR INPUT WITH PICKER ====================

function ColorInput({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  description?: string;
}) {
  const [hexInput, setHexInput] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleHexChange = (v: string) => {
    setHexInput(v);
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
      onChange(v);
    }
  };

  const handlePickerChange = (v: string) => {
    setHexInput(v);
    onChange(v);
  };

  // Sync hex input when external value changes
  useEffect(() => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    if (hexInput !== value && hexRegex.test(value)) {
      setHexInput(value);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group">
      {/* Color swatch + native picker */}
      <div className="relative flex-shrink-0">
        <button
          className="w-10 h-10 rounded-lg border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer ring-2 ring-black/5"
          style={{ backgroundColor: value }}
          onClick={() => inputRef.current?.click()}
          title="Abrir selector de color"
        />
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => handlePickerChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Label + Hex input */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold text-foreground">{label}</Label>
          {description && (
            <span className="text-[10px] text-muted-foreground hidden sm:inline">{description}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Input
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            className="h-7 text-xs font-mono w-[90px]"
            placeholder="#000000"
          />
          <div
            className="w-5 h-5 rounded border border-black/10 flex-shrink-0"
            style={{ backgroundColor: value }}
          />
          <span className="text-[10px] text-muted-foreground font-mono">
            {value.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

// ==================== LIVE PREVIEW PANEL ====================

function LivePreview({ colors }: { colors: ThemeColors }) {
  return (
    <div className="rounded-xl overflow-hidden border shadow-lg">
      {/* Navbar preview */}
      <div style={{ backgroundColor: colors.ndGreen }} className="px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-white font-extrabold text-sm">Nexo Digital</span>
            <span style={{ color: colors.ndOrange }} className="font-extrabold text-sm">Mundial</span>
          </div>
          <div className="flex gap-1">
            <button
              className="px-2 py-0.5 rounded text-[9px] font-bold text-white/80 border border-white/10"
            >
              Inicio
            </button>
            <button
              className="px-2 py-0.5 rounded text-[9px] font-bold border"
              style={{ backgroundColor: colors.ndOrange, color: colors.ndBlack, borderColor: colors.ndOrange }}
            >
              Grupos
            </button>
          </div>
        </div>
      </div>

      {/* Content preview */}
      <div className="p-3 space-y-2" style={{ backgroundColor: '#F5F5F5' }}>
        {/* Cards row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { bg: colors.ndGreen, label: 'Verde' },
            { bg: colors.ndOrange, label: 'Naranja' },
            { bg: colors.ndOrangeAccent, label: 'Acento' },
          ].map(({ bg, label }) => (
            <div key={label} className="rounded-lg p-2 text-center" style={{ backgroundColor: bg }}>
              <span className="text-white text-[9px] font-bold">{label}</span>
            </div>
          ))}
        </div>

        {/* Button preview */}
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded-md text-[10px] font-bold text-white"
            style={{ backgroundColor: colors.ndGreen }}
          >
            Primario
          </button>
          <button
            className="px-3 py-1 rounded-md text-[10px] font-bold text-white"
            style={{ backgroundColor: colors.ndOrange }}
          >
            Naranja
          </button>
          <button
            className="px-3 py-1 rounded-md text-[10px] font-bold border"
            style={{ borderColor: colors.ndGreen, color: colors.ndGreen }}
          >
            Outline
          </button>
        </div>

        {/* Badge preview */}
        <div className="flex gap-1.5 flex-wrap">
          <span
            className="px-2 py-0.5 rounded-full text-[8px] font-bold"
            style={{ backgroundColor: colors.ndGreenLight, color: colors.ndGreenDark }}
          >
            Categoría
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-[8px] font-bold"
            style={{ backgroundColor: colors.ndOrangeLight, color: colors.ndOrangeDark }}
          >
            Destacada
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-[8px] font-bold"
            style={{ backgroundColor: colors.ndYellowLight, color: colors.ndYellowDark }}
          >
            Estrella
          </span>
        </div>

        {/* Text color preview */}
        <div className="rounded-lg p-2 bg-white">
          <p className="text-[10px] font-bold" style={{ color: colors.ndBlack }}>Texto principal</p>
          <p className="text-[9px]" style={{ color: colors.ndGreen }}>Texto verde</p>
          <p className="text-[9px]" style={{ color: colors.ndOrange }}>Texto naranja</p>
        </div>
      </div>

      {/* Footer preview */}
      <div style={{ backgroundColor: colors.ndGreenDark }} className="px-3 py-2">
        <span className="text-white text-[9px]">Nexo Digital Mundial © 2026</span>
      </div>
    </div>
  );
}

// ==================== PRESET CARD ====================

function PresetCard({
  preset,
  isActive,
  onApply,
}: {
  preset: typeof THEME_PRESETS[0];
  isActive: boolean;
  onApply: () => void;
}) {
  return (
    <button
      onClick={onApply}
      className={`relative rounded-xl border-2 p-3 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        isActive
          ? 'border-nd-green shadow-lg ring-2 ring-nd-green/30'
          : 'border-border hover:border-nd-green/40'
      }`}
    >
      {isActive && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-nd-green flex items-center justify-center shadow-md">
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      {/* Color swatches */}
      <div className="flex gap-1 mb-2">
        {[
          preset.colors.ndGreen,
          preset.colors.ndGreenDark,
          preset.colors.ndOrange,
          preset.colors.ndOrangeAccent,
          preset.colors.ndBlack,
        ].map((color, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-md border border-black/10 shadow-sm"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <p className="text-sm font-bold text-foreground">{preset.name}</p>
      <p className="text-[10px] text-muted-foreground line-clamp-2">{preset.description}</p>
    </button>
  );
}

// ==================== MAIN THEME CUSTOMIZER ====================

export default function ThemeCustomizer() {
  const {
    colors,
    updateColor,
    applyPreset,
    resetToDefault,
    activePresetId,
    exportTheme,
    importTheme,
    isCustom,
    serverSynced,
    lastServerSync,
    syncNow,
  } = useTheme();

  const { toast } = useToast();
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleExport = () => {
    const json = exportTheme();
    navigator.clipboard.writeText(json).then(() => {
      toast({ title: 'Tema copiado', description: 'El JSON del tema se copió al portapapeles' });
    }).catch(() => {
      // Fallback: download as file
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nexo-digital-theme.json';
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Tema descargado', description: 'Se descargó el archivo JSON del tema' });
    });
  };

  const handleImport = () => {
    setImportError('');
    const success = importTheme(importText);
    if (success) {
      setImportOpen(false);
      setImportText('');
      toast({ title: 'Tema importado', description: 'Los colores se aplicaron correctamente' });
    } else {
      setImportError('JSON inválido. Verifica que tenga todas las propiedades de color requeridas.');
    }
  };

  const handleReset = () => {
    resetToDefault();
    toast({ title: 'Tema restablecido', description: 'Se volvió al esquema de colores original' });
  };

  const colorGroups: {
    title: string;
    icon: React.ReactNode;
    description: string;
    colors: { key: keyof ThemeColors; label: string; desc?: string }[];
  }[] = [
    {
      title: 'Color Primario (Verde)',
      icon: <Sun className="w-4 h-4" />,
      description: 'Color principal del portal — navbar, botones primarios, acentos',
      colors: [
        { key: 'ndGreen', label: 'Primario', desc: 'Color principal' },
        { key: 'ndGreenDark', label: 'Primario Oscuro', desc: 'Gradientes, hover' },
        { key: 'ndGreenLight', label: 'Primario Claro', desc: 'Badges, fondos suaves' },
      ],
    },
    {
      title: 'Color Secundario (Naranja)',
      icon: <Moon className="w-4 h-4" />,
      description: 'Color de acento — botones destacados, badges, elementos activos',
      colors: [
        { key: 'ndOrange', label: 'Naranja', desc: 'Color secundario' },
        { key: 'ndOrangeDark', label: 'Naranja Oscuro', desc: 'Hover, sombras' },
        { key: 'ndOrangeLight', label: 'Naranja Claro', desc: 'Badges, fondos' },
        { key: 'ndOrangeAccent', label: 'Naranja Acento', desc: 'Destacados' },
      ],
    },
    {
      title: 'Color Terciario (Dorado)',
      icon: <Sparkles className="w-4 h-4" />,
      description: 'Estrellas, elementos premium, indicadores especiales',
      colors: [
        { key: 'ndYellow', label: 'Dorado', desc: 'Estrellas, premium' },
        { key: 'ndYellowDark', label: 'Dorado Oscuro', desc: 'Hover, bordes' },
        { key: 'ndYellowLight', label: 'Dorado Claro', desc: 'Badges, fondos' },
      ],
    },
    {
      title: 'Texto y Fondo',
      icon: <Eye className="w-4 h-4" />,
      description: 'Color de texto principal y fondo oscuro',
      colors: [
        { key: 'ndBlack', label: 'Negro / Texto', desc: 'Texto principal' },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nd-green to-nd-orange flex items-center justify-center shadow-lg">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Personalización de Colores</h2>
            <p className="text-sm text-muted-foreground">Configura los colores del portal en tiempo real</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
          {isCustom && (
            <Badge className="bg-purple-100 text-purple-700 text-xs">
              <Paintbrush className="w-3 h-3 mr-1" />
              Personalizado
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-1" />
            {showPreview ? 'Ocultar Preview' : 'Ver Preview'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="presets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="presets" className="text-xs sm:text-sm">Presets</TabsTrigger>
          <TabsTrigger value="custom" className="text-xs sm:text-sm">Colores</TabsTrigger>
          <TabsTrigger value="tools" className="text-xs sm:text-sm">Herramientas</TabsTrigger>
        </TabsList>

        {/* ========== PRESETS TAB ========== */}
        <TabsContent value="presets" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-nd-orange" />
                Temas Predefinidos
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Selecciona un tema completo para aplicarlo instantáneamente. Los colores se actualizan en tiempo real.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {THEME_PRESETS.map((preset) => (
                  <PresetCard
                    key={preset.id}
                    preset={preset}
                    isActive={activePresetId === preset.id}
                    onApply={() => applyPreset(preset.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live preview under presets */}
          {showPreview && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Eye className="w-5 h-5 text-nd-green" />
                  Vista Previa en Vivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-sm mx-auto">
                  <LivePreview colors={colors} />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ========== CUSTOM COLORS TAB ========== */}
        <TabsContent value="custom" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Color groups */}
            <div className="lg:col-span-2 space-y-4">
              {colorGroups.map((group) => (
                <Card key={group.title}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      {group.icon}
                      {group.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{group.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {group.colors.map(({ key, label, desc }) => (
                      <ColorInput
                        key={key}
                        label={label}
                        description={desc}
                        value={colors[key]}
                        onChange={(val) => updateColor(key, val)}
                      />
                    ))}
                  </CardContent>
                </Card>
              ))}

              {/* Advanced: All colors raw */}
              <Card>
                <CardHeader
                  className="pb-3 cursor-pointer"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Paintbrush className="w-4 h-4 text-muted-foreground" />
                      Edición Avanzada — Todas las Variables
                    </span>
                    {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CardTitle>
                </CardHeader>
                {showAdvanced && (
                  <CardContent className="space-y-2">
                    {(Object.keys(DEFAULT_COLORS) as (keyof ThemeColors)[]).map((key) => (
                      <ColorInput
                        key={key}
                        label={key.replace(/([A-Z])/g, ' $1').replace(/^nd /, '')}
                        value={colors[key]}
                        onChange={(val) => updateColor(key, val)}
                      />
                    ))}
                  </CardContent>
                )}
              </Card>
            </div>

            {/* Live preview sidebar */}
            {showPreview && (
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Eye className="w-4 h-4 text-nd-green" />
                        Vista Previa
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LivePreview colors={colors} />
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-semibold text-foreground">Valores Actuales:</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(['ndGreen', 'ndOrange', 'ndBlack', 'ndYellow'] as const).map((key) => (
                            <div key={key} className="flex items-center gap-1.5 p-1.5 rounded bg-muted/30">
                              <div
                                className="w-4 h-4 rounded border border-black/10 flex-shrink-0"
                                style={{ backgroundColor: colors[key] }}
                              />
                              <span className="text-[9px] font-mono text-muted-foreground">
                                {colors[key].toUpperCase()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ========== TOOLS TAB ========== */}
        <TabsContent value="tools" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Download className="w-4 h-4 text-nd-green" />
                  Exportar Tema
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Copia el tema actual como JSON para guardarlo o compartirlo con otro portal
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-muted/30 p-3 max-h-48 overflow-auto custom-scrollbar">
                  <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap">
                    {exportTheme()}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleExport} className="flex-1">
                    <Copy className="w-4 h-4 mr-1" />
                    Copiar JSON
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Import */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Upload className="w-4 h-4 text-nd-orange" />
                  Importar Tema
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Pega un JSON de tema para aplicarlo instantáneamente al portal
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setImportOpen(true)}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Importar desde JSON
                </Button>

                {/* Import dialog */}
                <Dialog open={importOpen} onOpenChange={setImportOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Importar Tema</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label>Pega el JSON del tema aquí</Label>
                        <Textarea
                          value={importText}
                          onChange={(e) => { setImportText(e.target.value); setImportError(''); }}
                          placeholder='{"ndGreen":"#026602","ndOrange":"#FF6800",...}'
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
                          Aplicar Tema
                        </Button>
                        <Button variant="outline" onClick={() => setImportOpen(false)}>
                          Cancelar
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Las propiedades requeridas: ndGreen, ndGreenDark, ndGreenLight, ndOrange,
                        ndOrangeDark, ndOrangeLight, ndOrangeAccent, ndBlack, ndYellow, ndYellowDark, ndYellowLight
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
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
                  Vuelve al esquema de colores original del portal Nexo Digital Mundial
                </p>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" size="sm" onClick={handleReset} className="w-full">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Restablecer Colores Originales
                </Button>
              </CardContent>
            </Card>

            {/* CSS Variables Reference */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Paintbrush className="w-4 h-4 text-purple-500" />
                  Variables CSS Disponibles
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Usa estas variables en tus estilos personalizados para que respeten el tema activo
                </p>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/30 p-3 max-h-48 overflow-auto custom-scrollbar">
                  <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap">
{`/* Variables dinámicas del tema */
var(--nd-green)         /* Primario */
var(--nd-green-dark)    /* Primario oscuro */
var(--nd-green-light)   /* Primario claro */
var(--nd-orange)        /* Secundario */
var(--nd-orange-dark)   /* Secundario oscuro */
var(--nd-orange-light)  /* Secundario claro */
var(--nd-orange-accent) /* Acento */
var(--nd-black)         /* Texto */
var(--nd-yellow)        /* Dorado */
var(--nd-yellow-dark)   /* Dorado oscuro */
var(--nd-yellow-light)  /* Dorado claro */

/* Clases Tailwind vinculadas */
bg-nd-green  bg-nd-green-dark
bg-nd-orange bg-nd-orange-dark
text-nd-green text-nd-orange
border-nd-green border-nd-orange`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
