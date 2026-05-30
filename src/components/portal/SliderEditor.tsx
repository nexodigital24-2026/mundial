'use client';

import { useState, useRef, useCallback } from 'react';
import { usePortalData } from '@/lib/portal-data-context';
import { type SliderSlide, getTeamById, getTeamFlagUrl, getTeamCode, getTeamColor, getContrastTextColor } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Image as ImageIcon, Plus, Edit, Trash2, Save, X,
  ChevronUp, ChevronDown, Eye, Copy, GripVertical,
  Upload, Link, CheckCircle, ArrowUp, ArrowDown,
  Settings2, Move, ZoomIn, Layout, Zap, Trophy, Calendar, Star
} from 'lucide-react';

// ===================== IMAGE UPLOADER (inline, improved) =====================
function SlideImageUploader({
  imageUrl,
  imageDataUrl,
  onImageUrlChange,
  onImageDataUrlChange,
}: {
  imageUrl: string;
  imageDataUrl: string;
  onImageUrlChange: (url: string) => void;
  onImageDataUrlChange: (dataUrl: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<{ original: number; compressed: number; savings: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolvedImage = imageDataUrl || (imageUrl && imageUrl.length > 0 ? imageUrl : '');

  const handleFile = useCallback(async (file: File) => {
    // Immediate preview via dataURL
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onImageDataUrlChange(dataUrl);
    };
    reader.readAsDataURL(file);

    // Upload to server (converts to WebP)
    try {
      setUploading(true);
      setCompressionInfo(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'slides');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onImageUrlChange(data.url);
        if (data.savings) {
          setCompressionInfo({
            original: data.originalSize,
            compressed: data.compressedSize,
            savings: data.savings,
          });
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, [onImageUrlChange, onImageDataUrlChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };

  const clearImage = () => {
    onImageUrlChange('');
    onImageDataUrlChange('');
    setCompressionInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      {/* Mode toggle */}
      <div className="flex gap-1">
        <Button
          type="button"
          variant={mode === 'upload' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => setMode('upload')}
        >
          <Upload className="w-3 h-3 mr-1" />
          Subir Imagen
        </Button>
        <Button
          type="button"
          variant={mode === 'url' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => setMode('url')}
        >
          <Link className="w-3 h-3 mr-1" />
          URL Externa
        </Button>
      </div>

      {mode === 'upload' ? (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200
              min-h-[140px] flex items-center justify-center
              ${dragOver
                ? 'border-nd-green bg-nd-green/10 scale-[1.02]'
                : resolvedImage
                  ? 'border-border bg-muted/20'
                  : 'border-muted-foreground/30 hover:border-nd-green/50 hover:bg-nd-green/5'
              }
              ${uploading ? 'pointer-events-none opacity-60' : ''}
            `}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-3 border-nd-green border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground font-medium">Convirtiendo a WebP...</span>
              </div>
            ) : resolvedImage ? (
              <div className="w-full relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolvedImage}
                  alt="Preview"
                  className="w-full max-h-[200px] object-contain rounded-lg"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full flex items-center gap-1">
                      <Upload className="w-3 h-3" /> Cambiar imagen
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); clearImage(); }}
                      className="text-white bg-red-600 hover:bg-red-700 p-1.5 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-nd-green/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-nd-green" />
                </div>
                <span className="text-sm font-medium text-foreground">Arrastra una imagen aquí</span>
                <span className="text-xs text-muted-foreground">o haz clic para seleccionar</span>
                <span className="text-[10px] text-muted-foreground/70 mt-1">Se convierte automáticamente a WebP</span>
              </div>
            )}
          </div>

          {/* Compression info */}
          {compressionInfo && (
            <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 rounded-md px-2 py-1">
              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                WebP: {formatBytes(compressionInfo.original)} → {formatBytes(compressionInfo.compressed)} ({compressionInfo.savings} menor)
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            placeholder="https://ejemplo.com/imagen.jpg"
            value={imageUrl}
            onChange={(e) => {
              onImageUrlChange(e.target.value);
              onImageDataUrlChange('');
            }}
            className="text-sm"
          />
          {imageUrl && (
            <div className="relative rounded-lg overflow-hidden border bg-muted/30">
              <div className="aspect-video relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Preview URL"
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 w-6 h-6"
                onClick={clearImage}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ===================== LIVE PREVIEW CARD =====================
function SlidePreview({ slide, compact = false }: { slide: Partial<SliderSlide>; compact?: boolean }) {
  const image = slide.imageDataUrl || slide.imageUrl || '';
  const homeTeam = slide.homeTeamId ? getTeamById(slide.homeTeamId) : null;
  const awayTeam = slide.awayTeamId ? getTeamById(slide.awayTeamId) : null;

  return (
    <div className={`rounded-xl overflow-hidden relative ${compact ? 'h-28' : 'h-44'} shadow-inner border border-border/50`}>
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </>
      ) : (
        <div
          className="w-full h-full"
          style={{ background: `linear-gradient(135deg, ${slide.bgColor || '#003366'} 0%, ${slide.bgColor || '#003366'}cc 100%)` }}
        />
      )}
      <div className={`absolute inset-0 ${compact ? 'p-2' : 'p-4'} flex flex-col justify-end text-white`}>
        <div className="flex items-center gap-1 mb-1">
          <Badge className="bg-nd-orange text-nd-black border-0 font-bold text-[9px] px-1.5 py-0">🌐 Nexo Digital</Badge>
          {slide.category === 'En Vivo' && (
            <Badge className="bg-red-500 text-white border-0 text-[9px] px-1.5 py-0 animate-pulse">En Vivo</Badge>
          )}
          {slide.category === 'Próximo' && (
            <Badge className="bg-nd-orange/80 text-white border-0 text-[9px] px-1.5 py-0">Próximo</Badge>
          )}
          {slide.category === 'Resultado' && (
            <Badge className="bg-green-600 text-white border-0 text-[9px] px-1.5 py-0">Resultado</Badge>
          )}
        </div>
        {!compact && (
          <h3 className="text-lg font-extrabold leading-tight mb-0.5">
            Nexo Digital <span className="text-nd-orange">Mundial</span>
          </h3>
        )}
        <p className={`${compact ? 'text-xs' : 'text-sm'} font-bold leading-tight`}>{slide.title || 'Título del slide'}</p>
        {!compact && <p className="text-xs text-white/70 mt-0.5">{slide.subtitle || 'Subtítulo'}</p>}

        {homeTeam && awayTeam && (
          <div className={`flex items-center gap-2 mt-1 ${compact ? 'text-[10px]' : 'text-xs'}`}>
            {(() => {
              const flagUrl1 = getTeamFlagUrl(homeTeam.id, 40);
              const code1 = getTeamCode(homeTeam.id).toUpperCase();
              const color1 = getTeamColor(homeTeam.id);
              const textColor1 = getContrastTextColor(color1);
              const flagUrl2 = getTeamFlagUrl(awayTeam.id, 40);
              const code2 = getTeamCode(awayTeam.id).toUpperCase();
              const color2 = getTeamColor(awayTeam.id);
              const textColor2 = getContrastTextColor(color2);
              return (
                <>
                  <div className="flex items-center gap-1 rounded px-1 py-0.5" style={{ backgroundColor: color1 }}>
                    {flagUrl1 ? (
                      <img src={flagUrl1} alt="" className="w-4 h-2.5 object-cover rounded-sm" />
                    ) : <span>{homeTeam.flag}</span>}
                    <span className="font-extrabold text-[8px]" style={{ color: textColor1 }}>{code1}</span>
                  </div>
                  <span className="font-extrabold">{slide.homeScore ?? '-'}</span>
                  <span className="text-white/40">:</span>
                  <span className="font-extrabold">{slide.awayScore ?? '-'}</span>
                  <div className="flex items-center gap-1 rounded px-1 py-0.5" style={{ backgroundColor: color2 }}>
                    {flagUrl2 ? (
                      <img src={flagUrl2} alt="" className="w-4 h-2.5 object-cover rounded-sm" />
                    ) : <span>{awayTeam.flag}</span>}
                    <span className="font-extrabold text-[8px]" style={{ color: textColor2 }}>{code2}</span>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== MAIN SLIDER EDITOR =====================
export default function SliderEditor() {
  const {
    slides,
    matches,
    updateSlides,
  } = usePortalData();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<SliderSlide>>({});
  const [newDialog, setNewDialog] = useState(false);
  const [newForm, setNewForm] = useState({
    title: '',
    subtitle: '',
    category: 'Resultado',
    bgColor: '#003366',
    linkTo: 'resultados',
    matchId: 'none' as string,
    imageUrl: '',
    imageDataUrl: '',
  });

  const sorted = [...slides].sort((a, b) => a.order - b.order);

  // Start editing a slide
  const startEdit = (slide: SliderSlide) => {
    setEditingId(slide.id);
    setForm({ ...slide });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  // Save editing
  const saveEdit = () => {
    if (!editingId || !form.title) return;
    updateSlides(prev => prev.map(s =>
      s.id === editingId ? { ...s, ...form } as SliderSlide : s
    ));
    setEditingId(null);
    setForm({});
  };

  // Delete slide
  const deleteSlide = (id: string) => {
    updateSlides(prev => prev.filter(s => s.id !== id));
    if (editingId === id) cancelEdit();
  };

  // Duplicate slide
  const duplicateSlide = (slide: SliderSlide) => {
    const newSlide: SliderSlide = {
      ...slide,
      id: `slide${Date.now()}`,
      title: `${slide.title} (copia)`,
      order: slides.length + 1,
    };
    updateSlides(prev => [...prev, newSlide]);
  };

  // Toggle active
  const toggleActive = (id: string) => {
    updateSlides(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  // Move slide up/down
  const moveSlide = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;
    const current = sorted[idx];
    const target = sorted[targetIdx];
    updateSlides(prev => prev.map(s => {
      if (s.id === current.id) return { ...s, order: target.order };
      if (s.id === target.id) return { ...s, order: current.order };
      return s;
    }));
  };

  // Add new slide
  const addNewSlide = () => {
    const matchId = newForm.matchId === 'none' ? null : newForm.matchId;
    let homeTeamId: string | null = null;
    let awayTeamId: string | null = null;
    let homeScore: number | null = null;
    let awayScore: number | null = null;

    if (matchId) {
      const match = matches.find(m => m.id === matchId);
      if (match) {
        homeTeamId = match.homeTeamId;
        awayTeamId = match.awayTeamId;
        homeScore = match.homeScore;
        awayScore = match.awayScore;
      }
    }

    const newSlide: SliderSlide = {
      id: `slide${Date.now()}`,
      title: newForm.title,
      subtitle: newForm.subtitle,
      matchId,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      category: newForm.category,
      imageUrl: newForm.imageUrl,
      imageDataUrl: newForm.imageDataUrl,
      bgColor: newForm.bgColor,
      active: true,
      order: slides.length + 1,
      linkTo: newForm.linkTo,
    };
    updateSlides(prev => [...prev, newSlide]);
    setNewDialog(false);
    setNewForm({
      title: '',
      subtitle: '',
      category: 'Resultado',
      bgColor: '#003366',
      linkTo: 'resultados',
      matchId: 'none',
      imageUrl: '',
      imageDataUrl: '',
    });
  };

  // Helper for match select in new slide dialog
  const availableMatches = matches.filter(m => m.status === 'live' || m.status === 'completed');

  // Quick create from template
  const createFromTemplate = (template: 'resultado' | 'envivo' | 'proximo' | 'especial') => {
    const templates: Record<string, Partial<typeof newForm>> = {
      resultado: { category: 'Resultado', bgColor: '#003366', linkTo: 'resultados' },
      envivo: { category: 'En Vivo', bgColor: '#B71C1C', linkTo: 'en-vivo' },
      proximo: { category: 'Próximo', bgColor: '#E65100', linkTo: 'resultados' },
      especial: { category: 'Especial', bgColor: '#4A148C', linkTo: 'inicio' },
    };
    const tmpl = templates[template];
    setNewForm(prev => ({ ...prev, ...tmpl }));
    setNewDialog(true);
  };

  const activeSlides = sorted.filter(s => s.active);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-nd-green" />
            Gestion del Slider Principal
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activeSlides.length} activos de {sorted.length} slides totales
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-xs" onClick={() => {
            // Quick scroll to preview
            document.getElementById('slider-full-preview')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <Layout className="w-3.5 h-3.5 mr-1" />
            Vista Previa
          </Button>
          <Button size="sm" className="bg-nd-green hover:bg-nd-green-dark" onClick={() => setNewDialog(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Nuevo Slide
          </Button>
        </div>
      </div>

      {/* Quick Create Templates */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => createFromTemplate('resultado')}
          className="flex items-center gap-2 p-2.5 rounded-lg border-2 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-green-800">Resultado</p>
            <p className="text-[9px] text-green-600">Crear slide rapido</p>
          </div>
        </button>
        <button
          onClick={() => createFromTemplate('envivo')}
          className="flex items-center gap-2 p-2.5 rounded-lg border-2 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-red-800">En Vivo</p>
            <p className="text-[9px] text-red-600">Crear slide rapido</p>
          </div>
        </button>
        <button
          onClick={() => createFromTemplate('proximo')}
          className="flex items-center gap-2 p-2.5 rounded-lg border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-300 transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-orange-800">Proximo</p>
            <p className="text-[9px] text-orange-600">Crear slide rapido</p>
          </div>
        </button>
        <button
          onClick={() => createFromTemplate('especial')}
          className="flex items-center gap-2 p-2.5 rounded-lg border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Star className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-purple-800">Especial</p>
            <p className="text-[9px] text-purple-600">Crear slide rapido</p>
          </div>
        </button>
      </div>

      {/* Full Slider Preview Strip */}
      {activeSlides.length > 0 && (
        <div id="slider-full-preview" className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Layout className="w-3 h-3" /> Vista Previa del Slider Completo
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {activeSlides.map((slide) => {
              const slideImage = slide.imageDataUrl || slide.imageUrl || '';
              return (
                <div
                  key={slide.id}
                  className="flex-shrink-0 w-64 cursor-pointer hover:ring-2 hover:ring-nd-green/50 rounded-xl overflow-hidden transition-all"
                  onClick={() => startEdit(slide)}
                >
                  <SlidePreview slide={slide} compact />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two-column layout: List + Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* LEFT: Slide list (2 cols) */}
        <div className="lg:col-span-2 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
            <Move className="w-3 h-3" /> Slides ({sorted.length})
          </div>
          {sorted.map((slide, idx) => {
            const isEditing = editingId === slide.id;
            const slideImage = slide.imageDataUrl || slide.imageUrl || '';
            const homeTeam = slide.homeTeamId ? getTeamById(slide.homeTeamId) : null;
            const awayTeam = slide.awayTeamId ? getTeamById(slide.awayTeamId) : null;

            return (
              <div
                key={slide.id}
                className={`
                  rounded-lg border-2 overflow-hidden transition-all duration-200 cursor-pointer
                  ${isEditing
                    ? 'border-nd-green shadow-lg shadow-nd-green/10 ring-1 ring-nd-green/30'
                    : 'border-border hover:border-nd-green/40 hover:shadow-md'
                  }
                  ${!slide.active ? 'opacity-50' : ''}
                `}
                onClick={() => {
                  if (!isEditing) startEdit(slide);
                }}
              >
                {/* Card header with thumbnail and info */}
                <div className="p-3 flex items-center gap-3">
                  {/* Order + Arrows */}
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    <button
                      className="p-0.5 rounded hover:bg-nd-green/10 text-muted-foreground hover:text-nd-green disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={idx === 0}
                      onClick={(e) => { e.stopPropagation(); moveSlide(idx, 'up'); }}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-bold text-muted-foreground">#{slide.order}</span>
                    <button
                      className="p-0.5 rounded hover:bg-nd-green/10 text-muted-foreground hover:text-nd-green disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={idx === sorted.length - 1}
                      onClick={(e) => { e.stopPropagation(); moveSlide(idx, 'down'); }}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  {slideImage ? (
                    <div className="w-20 h-12 rounded overflow-hidden flex-shrink-0 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={slideImage} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div
                      className="w-20 h-12 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: slide.bgColor + '40' }}
                    >
                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Badge className={`text-[9px] px-1.5 py-0 ${
                        slide.category === 'En Vivo' ? 'bg-red-100 text-red-700' :
                        slide.category === 'Resultado' ? 'bg-green-100 text-green-700' :
                        slide.category === 'Próximo' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {slide.category}
                      </Badge>
                      {!slide.active && (
                        <Badge className="text-[9px] px-1.5 py-0 bg-gray-100 text-gray-500">Inactivo</Badge>
                      )}
                    </div>
                    <p className="text-sm font-semibold truncate">{slide.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{slide.subtitle}</p>
                    {homeTeam && awayTeam && (
                      <p className="text-[11px] mt-0.5">
                        {homeTeam.flag} {slide.homeScore} - {slide.awayScore} {awayTeam.flag}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <Switch
                      checked={slide.active}
                      onCheckedChange={() => toggleActive(slide.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="scale-75"
                    />
                    <button
                      className="p-1 rounded hover:bg-nd-green/10 text-muted-foreground hover:text-nd-green"
                      onClick={(e) => { e.stopPropagation(); duplicateSlide(slide); }}
                      title="Duplicar"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600"
                      onClick={(e) => { e.stopPropagation(); deleteSlide(slide.id); }}
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Editing indicator */}
                {isEditing && (
                  <div className="px-3 pb-2">
                    <Badge className="bg-nd-green/10 text-nd-green border-nd-green/20 text-[10px]">
                      <Edit className="w-2.5 h-2.5 mr-1" /> Editando...
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}

          {sorted.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No hay slides. Agrega el primero.</p>
            </div>
          )}
        </div>

        {/* RIGHT: Editor panel (3 cols) */}
        <div className="lg:col-span-3">
          {editingId ? (
            <Card className="border-nd-green/30 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-nd-green" />
                    Editando Slide #{form.order}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-nd-green hover:bg-nd-green-dark" onClick={saveEdit} disabled={!form.title}>
                      <Save className="w-3.5 h-3.5 mr-1" />
                      Guardar
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="w-3.5 h-3.5 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title and Subtitle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Título *</Label>
                    <Input
                      value={form.title ?? ''}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ej: Argentina golea 4-0"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Subtítulo</Label>
                    <Input
                      value={form.subtitle ?? ''}
                      onChange={(e) => setForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Ej: Messi brillante con doblete"
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Image Uploader */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    Imagen del Slide
                  </Label>
                  <SlideImageUploader
                    imageUrl={form.imageUrl ?? ''}
                    imageDataUrl={form.imageDataUrl ?? ''}
                    onImageUrlChange={(url) => setForm(prev => ({ ...prev, imageUrl: url }))}
                    onImageDataUrlChange={(dataUrl) => setForm(prev => ({ ...prev, imageDataUrl: dataUrl }))}
                  />
                </div>

                {/* Category, Match, Navigate */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Categoría</Label>
                    <Select
                      value={form.category ?? 'Resultado'}
                      onValueChange={(v) => setForm(prev => ({ ...prev, category: v }))}
                    >
                      <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="En Vivo">🔴 En Vivo</SelectItem>
                        <SelectItem value="Resultado">✅ Resultado</SelectItem>
                        <SelectItem value="Próximo">📅 Próximo Partido</SelectItem>
                        <SelectItem value="Especial">⭐ Especial</SelectItem>
                        <SelectItem value="Noticia">📰 Noticia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Partido vinculado</Label>
                    <Select
                      value={form.matchId ?? 'none'}
                      onValueChange={(v) => {
                        const matchId = v === 'none' ? null : v;
                        if (matchId) {
                          const match = matches.find(m => m.id === matchId);
                          if (match) {
                            setForm(prev => ({
                              ...prev,
                              matchId,
                              homeTeamId: match.homeTeamId,
                              awayTeamId: match.awayTeamId,
                              homeScore: match.homeScore,
                              awayScore: match.awayScore,
                              title: prev.title || `${getTeamById(match.homeTeamId)?.name} vs ${getTeamById(match.awayTeamId)?.name}`,
                            }));
                          }
                        } else {
                          setForm(prev => ({ ...prev, matchId: null, homeTeamId: null, awayTeamId: null, homeScore: null, awayScore: null }));
                        }
                      }}
                    >
                      <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin partido</SelectItem>
                        {availableMatches.map(m => {
                          const h = getTeamById(m.homeTeamId);
                          const a = getTeamById(m.awayTeamId);
                          return (
                            <SelectItem key={m.id} value={m.id}>
                              {h?.flag} {h?.name} vs {a?.flag} {a?.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Botón navega a</Label>
                    <Select
                      value={form.linkTo ?? 'grupos'}
                      onValueChange={(v) => setForm(prev => ({ ...prev, linkTo: v }))}
                    >
                      <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grupos">Grupos</SelectItem>
                        <SelectItem value="resultados">Resultados</SelectItem>
                        <SelectItem value="goleadores">Goleadores</SelectItem>
                        <SelectItem value="inicio">Inicio</SelectItem>
                        <SelectItem value="en-vivo">En Vivo</SelectItem>
                        <SelectItem value="votacion">Votación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Score + Color + Order (if teams) */}
                {form.homeTeamId && form.awayTeamId ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Goles Local</Label>
                      <Input
                        type="number" min="0"
                        value={form.homeScore ?? ''}
                        onChange={(e) => setForm(prev => ({ ...prev, homeScore: parseInt(e.target.value) || 0 }))}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Goles Visitante</Label>
                      <Input
                        type="number" min="0"
                        value={form.awayScore ?? ''}
                        onChange={(e) => setForm(prev => ({ ...prev, awayScore: parseInt(e.target.value) || 0 }))}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Color Fondo</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={form.bgColor ?? '#003366'}
                          onChange={(e) => setForm(prev => ({ ...prev, bgColor: e.target.value }))}
                          className="w-9 h-9 rounded border cursor-pointer"
                        />
                        <Input
                          value={form.bgColor ?? '#003366'}
                          onChange={(e) => setForm(prev => ({ ...prev, bgColor: e.target.value }))}
                          className="flex-1 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Orden</Label>
                      <Input
                        type="number" min="1" max="20"
                        value={form.order ?? 1}
                        onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                        className="text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Color Fondo</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={form.bgColor ?? '#003366'}
                          onChange={(e) => setForm(prev => ({ ...prev, bgColor: e.target.value }))}
                          className="w-9 h-9 rounded border cursor-pointer"
                        />
                        <Input
                          value={form.bgColor ?? '#003366'}
                          onChange={(e) => setForm(prev => ({ ...prev, bgColor: e.target.value }))}
                          className="flex-1 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Orden</Label>
                      <Input
                        type="number" min="1" max="20"
                        value={form.order ?? 1}
                        onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Live Preview */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Vista Previa en Tiempo Real
                  </Label>
                  <SlidePreview slide={form} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center text-muted-foreground">
                <ZoomIn className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Selecciona un slide para editar</p>
                <p className="text-xs mt-1">Haz clic en cualquier slide de la lista o crea uno nuevo</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ===== NEW SLIDE DIALOG ===== */}
      <Dialog open={newDialog} onOpenChange={setNewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-nd-green" />
              Crear Nuevo Slide
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Título *</Label>
                <Input
                  value={newForm.title}
                  onChange={(e) => setNewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Argentina golea 4-0"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Subtítulo</Label>
                <Input
                  value={newForm.subtitle}
                  onChange={(e) => setNewForm(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Ej: Messi brillante con doblete"
                />
              </div>
            </div>

            {/* Image upload */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Imagen del Slide
              </Label>
              <SlideImageUploader
                imageUrl={newForm.imageUrl}
                imageDataUrl={newForm.imageDataUrl}
                onImageUrlChange={(url) => setNewForm(prev => ({ ...prev, imageUrl: url }))}
                onImageDataUrlChange={(dataUrl) => setNewForm(prev => ({ ...prev, imageDataUrl: dataUrl }))}
              />
            </div>

            {/* Category, Match, Navigate */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Categoría</Label>
                <Select
                  value={newForm.category}
                  onValueChange={(v) => setNewForm(prev => ({ ...prev, category: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En Vivo">🔴 En Vivo</SelectItem>
                    <SelectItem value="Resultado">✅ Resultado</SelectItem>
                    <SelectItem value="Próximo">📅 Próximo Partido</SelectItem>
                    <SelectItem value="Especial">⭐ Especial</SelectItem>
                    <SelectItem value="Noticia">📰 Noticia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Partido vinculado</Label>
                <Select
                  value={newForm.matchId}
                  onValueChange={(v) => {
                    const matchId = v === 'none' ? null : v;
                    if (matchId) {
                      const match = matches.find(m => m.id === matchId);
                      if (match) {
                        setNewForm(prev => ({
                          ...prev,
                          matchId: v,
                          title: prev.title || `${getTeamById(match.homeTeamId)?.name} vs ${getTeamById(match.awayTeamId)?.name}`,
                        }));
                      }
                    } else {
                      setNewForm(prev => ({ ...prev, matchId: 'none' }));
                    }
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin partido</SelectItem>
                    {availableMatches.map(m => {
                      const h = getTeamById(m.homeTeamId);
                      const a = getTeamById(m.awayTeamId);
                      return (
                        <SelectItem key={m.id} value={m.id}>
                          {h?.flag} {h?.name} vs {a?.flag} {a?.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Botón navega a</Label>
                <Select
                  value={newForm.linkTo}
                  onValueChange={(v) => setNewForm(prev => ({ ...prev, linkTo: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grupos">Grupos</SelectItem>
                    <SelectItem value="resultados">Resultados</SelectItem>
                    <SelectItem value="goleadores">Goleadores</SelectItem>
                    <SelectItem value="inicio">Inicio</SelectItem>
                    <SelectItem value="en-vivo">En Vivo</SelectItem>
                    <SelectItem value="votacion">Votación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Color de Fondo (sin imagen)</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newForm.bgColor}
                    onChange={(e) => setNewForm(prev => ({ ...prev, bgColor: e.target.value }))}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <Input
                    value={newForm.bgColor}
                    onChange={(e) => setNewForm(prev => ({ ...prev, bgColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Eye className="w-3 h-3" /> Vista Previa
              </Label>
              <SlidePreview slide={{
                title: newForm.title,
                subtitle: newForm.subtitle,
                category: newForm.category,
                bgColor: newForm.bgColor,
                imageUrl: newForm.imageUrl,
                imageDataUrl: newForm.imageDataUrl,
                homeTeamId: null,
                awayTeamId: null,
                homeScore: null,
                awayScore: null,
              }} />
            </div>

            {/* Create button */}
            <Button
              className="w-full bg-nd-green hover:bg-nd-green-dark"
              onClick={addNewSlide}
              disabled={!newForm.title}
            >
              <Plus className="w-4 h-4 mr-1" />
              Crear Slide
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
