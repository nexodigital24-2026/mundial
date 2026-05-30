'use client';

import { useState, useRef, useCallback } from 'react';
import { usePortalData } from '@/lib/portal-data-context';
import { type NewsItem, type GalleryImage, getTeamById, getTeamFlagUrl } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Image as ImageIcon, Plus, Edit, Trash2, Save, X,
  ArrowUp, ArrowDown, Eye, Copy, Upload, Link,
  CheckCircle, Settings2, Move, ZoomIn, Newspaper,
  Star, Tag, User, Globe, Camera, Images,
  Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight,
  ChevronLeft, ChevronRight, GripVertical, FileImage,
  Sparkles, MessageSquare, Quote,
} from 'lucide-react';

// ===================== GALLERY IMAGE UPLOADER =====================
function GalleryUploader({
  gallery,
  onGalleryChange,
}: {
  gallery: GalleryImage[];
  onGalleryChange: (gallery: GalleryImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingCaptionId, setEditingCaptionId] = useState<string | null>(null);
  const [captionText, setCaptionText] = useState('');

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    setUploading(true);
    const newImages: GalleryImage[] = [];

    for (const file of fileArray) {
      // Read as dataURL for immediate preview
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });

      // Upload to server
      let serverUrl = '';
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'news-gallery');
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        if (response.ok) {
          const data = await response.json();
          serverUrl = data.url;
        }
      } catch (e) {
        console.error('Gallery upload failed:', e);
      }

      newImages.push({
        id: `gimg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        url: serverUrl,
        dataUrl,
        caption: '',
        order: gallery.length + newImages.length + 1,
      });
    }

    onGalleryChange([...gallery, ...newImages]);
    setUploading(false);
  }, [gallery, onGalleryChange]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    const updated = gallery.filter(img => img.id !== id).map((img, i) => ({ ...img, order: i + 1 }));
    onGalleryChange(updated);
  };

  const moveImage = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= gallery.length) return;
    const newGallery = [...gallery];
    const temp = newGallery[idx];
    newGallery[idx] = newGallery[targetIdx];
    newGallery[targetIdx] = temp;
    const reordered = newGallery.map((img, i) => ({ ...img, order: i + 1 }));
    onGalleryChange(reordered);
  };

  const startEditCaption = (img: GalleryImage) => {
    setEditingCaptionId(img.id);
    setCaptionText(img.caption);
  };

  const saveCaption = (id: string) => {
    onGalleryChange(gallery.map(img => img.id === id ? { ...img, caption: captionText } : img));
    setEditingCaptionId(null);
    setCaptionText('');
  };

  const setAsCover = (img: GalleryImage) => {
    // Move this image to position 1
    const others = gallery.filter(i => i.id !== img.id);
    const reordered = [img, ...others].map((i, idx) => ({ ...i, order: idx + 1 }));
    onGalleryChange(reordered);
  };

  return (
    <div className="space-y-3">
      {/* Upload zone */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
        className="hidden"
      />
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200
          min-h-[100px] flex items-center justify-center
          ${dragOver
            ? 'border-nd-green bg-nd-green/10 scale-[1.01]'
            : 'border-muted-foreground/30 hover:border-nd-green/50 hover:bg-nd-green/5'
          }
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 p-4">
            <div className="w-8 h-8 border-3 border-nd-green border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground font-medium">Subiendo y convirtiendo a WebP...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-nd-green/10 flex items-center justify-center">
              <Camera className="w-5 h-5 text-nd-green" />
            </div>
            <span className="text-sm font-medium text-foreground">Arrastra fotos aqui o haz clic para seleccionar</span>
            <span className="text-xs text-muted-foreground">Puedes subir multiples fotos a la vez (se convierten a WebP)</span>
          </div>
        )}
      </div>

      {/* Gallery grid */}
      {gallery.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Images className="w-3.5 h-3.5" />
              Galeria ({gallery.length} {gallery.length === 1 ? 'foto' : 'fotos'})
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs h-6 text-red-500 hover:text-red-700"
              onClick={() => onGalleryChange([])}
            >
              <Trash2 className="w-3 h-3 mr-1" /> Vaciar galeria
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {gallery.sort((a, b) => a.order - b.order).map((img, idx) => (
              <div
                key={img.id}
                className={`
                  relative group rounded-lg overflow-hidden border-2 transition-all duration-200
                  ${idx === 0 ? 'border-nd-green ring-1 ring-nd-green/30' : 'border-border hover:border-nd-green/40'}
                `}
              >
                {/* Image */}
                <div className="aspect-[4/3] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.dataUrl || img.url}
                    alt={img.caption || `Foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-1">
                      {idx !== 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setAsCover(img); }}
                          className="text-white bg-nd-green hover:bg-nd-green-dark p-1 rounded transition-colors"
                          title="Usar como portada"
                        >
                          <Star className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); moveImage(idx, 'up'); }}
                        className="text-white bg-black/60 hover:bg-black/80 p-1 rounded transition-colors"
                        title="Mover izquierda"
                        disabled={idx === 0}
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveImage(idx, 'down'); }}
                        className="text-white bg-black/60 hover:bg-black/80 p-1 rounded transition-colors"
                        title="Mover derecha"
                        disabled={idx === gallery.length - 1}
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                        className="text-white bg-red-600 hover:bg-red-700 p-1 rounded transition-colors"
                        title="Eliminar"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  {/* Cover badge */}
                  {idx === 0 && (
                    <div className="absolute top-1 left-1">
                      <Badge className="bg-nd-green text-white border-0 text-[8px] px-1.5 py-0">
                        <Star className="w-2.5 h-2.5 mr-0.5" /> Portada
                      </Badge>
                    </div>
                  )}
                  {/* Order badge */}
                  <div className="absolute bottom-1 right-1">
                    <Badge className="bg-black/60 text-white border-0 text-[9px] px-1.5 py-0">
                      #{idx + 1}
                    </Badge>
                  </div>
                </div>
                {/* Caption */}
                <div className="p-1.5 bg-card">
                  {editingCaptionId === img.id ? (
                    <div className="flex gap-1">
                      <Input
                        value={captionText}
                        onChange={(e) => setCaptionText(e.target.value)}
                        className="text-[10px] h-5"
                        placeholder="Pie de foto..."
                        onKeyDown={(e) => { if (e.key === 'Enter') saveCaption(img.id); }}
                        autoFocus
                      />
                      <button
                        onClick={() => saveCaption(img.id)}
                        className="p-0.5 rounded bg-nd-green text-white"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <p
                      className="text-[10px] text-muted-foreground truncate cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => startEditCaption(img)}
                      title={img.caption || 'Haz clic para agregar pie de foto'}
                    >
                      {img.caption || 'Haz clic para agregar pie de foto...'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== NEWS IMAGE UPLOADER (cover photo) =====================
function NewsImageUploader({
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
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onImageDataUrlChange(dataUrl);
    };
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      setCompressionInfo(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'news');

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
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200
              min-h-[120px] flex items-center justify-center
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
                  className="w-full max-h-[160px] object-contain rounded-lg"
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
                <span className="text-sm font-medium text-foreground">Arrastra una imagen aqui</span>
                <span className="text-xs text-muted-foreground">o haz clic para seleccionar</span>
                <span className="text-[10px] text-muted-foreground/70 mt-1">Se convierte automaticamente a WebP</span>
              </div>
            )}
          </div>

          {compressionInfo && (
            <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 rounded-md px-2 py-1">
              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                WebP: {formatBytes(compressionInfo.original)} &rarr; {formatBytes(compressionInfo.compressed)} ({compressionInfo.savings} menor)
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

// ===================== TEXT FORMATTING TOOLBAR =====================
function TextFormatToolbar({
  onFormat,
}: {
  onFormat: (format: string) => void;
}) {
  const tools = [
    { icon: Bold, label: 'Negrita', format: '**' },
    { icon: Italic, label: 'Cursiva', format: '*' },
    { icon: Underline, label: 'Subrayado', format: '__' },
    { icon: Quote, label: 'Cita', format: '>' },
    { icon: List, label: 'Lista', format: '- ' },
    { icon: AlignLeft, label: 'Alinear izquierda', format: '' },
    { icon: AlignCenter, label: 'Centrar', format: '' },
    { icon: AlignRight, label: 'Alinear derecha', format: '' },
  ];

  return (
    <div className="flex items-center gap-0.5 p-1 bg-muted/50 rounded-lg border">
      {tools.map((tool, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onFormat(tool.format)}
          className="p-1.5 rounded hover:bg-nd-green/10 hover:text-nd-green transition-colors text-muted-foreground"
          title={tool.label}
        >
          <tool.icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
}

// ===================== TAG INPUT =====================
function TagInput({
  tags,
  onTagsChange,
}: {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim();
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => {
    onTagsChange(tags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Agregar etiqueta..."
          className="text-sm h-8"
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
        />
        <Button type="button" size="sm" variant="outline" className="h-8 px-3" onClick={addTag}>
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs gap-1 pr-1">
              <Tag className="w-2.5 h-2.5" />
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-0.5 hover:text-red-500 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// ===================== NEWS PREVIEW CARD =====================
function NewsPreview({ newsItem }: { newsItem: Partial<NewsItem> }) {
  const newsTeamMap: Record<string, string> = {
    messi: 'arg', yamal: 'esp', haaland: 'nor', mexico: 'mex', spain: 'esp', ronaldo: 'por', usa: 'usa',
  };
  const newsGradientMap: Record<string, string> = {
    'En Vivo': 'from-red-500/30 to-nd-orange/20',
    'Especial': 'from-nd-orange/30 to-yellow-400/20',
    'Analisis': 'from-nd-green/30 to-nd-green-light/20',
    'Análisis': 'from-nd-green/30 to-nd-green-light/20',
    'Resultados': 'from-blue-500/30 to-nd-green/20',
    'Clasificacion': 'from-nd-green-dark/30 to-nd-orange/20',
    'Clasificación': 'from-nd-green-dark/30 to-nd-orange/20',
  };

  const customImage = newsItem.imageDataUrl || newsItem.imageUrl || '';
  const galleryImages = newsItem.gallery || [];
  const teamId = newsTeamMap[newsItem.imageKeyword || ''];
  const team = teamId ? getTeamById(teamId) : null;
  const flagUrl = teamId ? getTeamFlagUrl(teamId, 320) : null;
  const gradient = newsGradientMap[newsItem.category || ''] || 'from-nd-green/20 to-nd-orange/10';

  return (
    <div className="rounded-xl overflow-hidden border border-nd-green/20 shadow-md max-w-xs">
      <div className={`h-32 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
        {customImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={customImage}
            alt={newsItem.title || 'Preview'}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : flagUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={flagUrl}
              alt={team?.name || ''}
              className="w-20 h-14 object-cover rounded-md shadow-lg"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute -bottom-1 -right-1 text-xl">{team?.flag}</div>
          </div>
        ) : (
          <span className="text-4xl">⚽</span>
        )}
        {/* Featured badge */}
        {newsItem.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-500 text-white border-0 text-[9px] px-1.5 py-0">
              <Star className="w-2.5 h-2.5 mr-0.5" /> Destacada
            </Badge>
          </div>
        )}
        {/* Gallery indicator */}
        {galleryImages.length > 0 && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-black/60 text-white border-0 text-[9px] px-1.5 py-0">
              <Images className="w-2.5 h-2.5 mr-0.5" /> {galleryImages.length}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-3 bg-card">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Badge variant="secondary" className="w-fit text-xs bg-nd-orange-light text-nd-green-dark">
            {newsItem.category || 'Categoría'}
          </Badge>
          {newsItem.author && (
            <span className="text-[9px] text-muted-foreground">Por {newsItem.author}</span>
          )}
        </div>
        <p className="text-sm font-bold leading-snug line-clamp-2 text-foreground">
          {newsItem.title || 'Título de la noticia'}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {newsItem.summary || 'Resumen de la noticia...'}
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] text-muted-foreground">{newsItem.date || '2026-06-20'}</p>
          {newsItem.source && (
            <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
              <Globe className="w-2.5 h-2.5" /> {newsItem.source}
            </span>
          )}
        </div>
        {/* Tags preview */}
        {newsItem.tags && newsItem.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {newsItem.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-[8px] px-1 py-0">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        {/* Gallery thumbnails */}
        {galleryImages.length > 0 && (
          <div className="flex gap-1 mt-2 overflow-hidden">
            {galleryImages.slice(0, 4).map((img, i) => (
              <div key={img.id} className="w-8 h-6 rounded overflow-hidden flex-shrink-0 border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.dataUrl || img.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {galleryImages.length > 4 && (
              <span className="text-[9px] text-muted-foreground self-center">+{galleryImages.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== MAIN NEWS EDITOR =====================
const CATEGORIES = ['En Vivo', 'Especial', 'Análisis', 'Resultados', 'Clasificación'];

const KEYWORD_OPTIONS = [
  { value: 'messi', label: '🇦🇷 Messi / Argentina' },
  { value: 'yamal', label: '🇪🇸 Yamal / España' },
  { value: 'haaland', label: '🇳🇴 Haaland / Noruega' },
  { value: 'mexico', label: '🇲🇽 México' },
  { value: 'spain', label: '🇪🇸 España' },
  { value: 'ronaldo', label: '🇵🇹 Ronaldo / Portugal' },
  { value: 'usa', label: '🇺🇸 Estados Unidos' },
  { value: 'bra', label: '🇧🇷 Brasil' },
  { value: 'fra', label: '🇫🇷 Francia' },
  { value: 'eng', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra' },
  { value: 'ger', label: '🇩🇪 Alemania' },
  { value: 'por', label: '🇵🇹 Portugal' },
  { value: 'ned', label: '🇳🇱 Países Bajos' },
  { value: 'custom', label: '🖼️ Imagen personalizada (sin bandera)' },
];

const defaultNewForm = {
  title: '',
  summary: '',
  content: '',
  category: 'Resultados',
  date: new Date().toISOString().split('T')[0],
  imageKeyword: 'custom',
  imageUrl: '',
  imageDataUrl: '',
  gallery: [] as GalleryImage[],
  author: '',
  source: '',
  tags: [] as string[],
  featured: false,
};

export default function NewsEditor() {
  const {
    news,
    updateNews,
  } = usePortalData();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<NewsItem>>({});
  const [newDialog, setNewDialog] = useState(false);
  const [newForm, setNewForm] = useState({ ...defaultNewForm });
  const [editorTab, setEditorTab] = useState<'basico' | 'contenido' | 'galeria' | 'avanzado'>('basico');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const sorted = [...news].sort((a, b) => a.order - b.order);

  // Filtered list
  const filtered = sorted.filter(item => {
    const matchesSearch = !searchFilter ||
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Start editing
  const startEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setForm({ ...item });
    setEditorTab('basico');
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  // Save editing
  const saveEdit = () => {
    if (!editingId || !form.title) return;
    updateNews(prev => prev.map(n =>
      n.id === editingId ? { ...n, ...form } as NewsItem : n
    ));
    setEditingId(null);
    setForm({});
  };

  // Delete news
  const deleteNews = (id: string) => {
    updateNews(prev => prev.filter(n => n.id !== id));
    if (editingId === id) cancelEdit();
  };

  // Duplicate news
  const duplicateNews = (item: NewsItem) => {
    const newItem: NewsItem = {
      ...item,
      id: `n${Date.now()}`,
      title: `${item.title} (copia)`,
      order: news.length + 1,
      gallery: [], // Don't copy gallery images (they're unique)
    };
    updateNews(prev => [...prev, newItem]);
  };

  // Toggle active
  const toggleActive = (id: string) => {
    updateNews(prev => prev.map(n => n.id === id ? { ...n, active: !n.active } : n));
  };

  // Toggle featured
  const toggleFeatured = (id: string) => {
    updateNews(prev => prev.map(n => n.id === id ? { ...n, featured: !n.featured } : n));
  };

  // Move news up/down
  const moveNews = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;
    const current = sorted[idx];
    const target = sorted[targetIdx];
    updateNews(prev => prev.map(n => {
      if (n.id === current.id) return { ...n, order: target.order };
      if (n.id === target.id) return { ...n, order: current.order };
      return n;
    }));
  };

  // Add new news
  const addNewNews = () => {
    const newItem: NewsItem = {
      id: `n${Date.now()}`,
      title: newForm.title,
      summary: newForm.summary,
      content: newForm.content,
      category: newForm.category,
      date: newForm.date,
      imageKeyword: newForm.imageKeyword,
      imageUrl: newForm.imageUrl,
      imageDataUrl: newForm.imageDataUrl,
      gallery: newForm.gallery,
      author: newForm.author,
      source: newForm.source,
      tags: newForm.tags,
      featured: newForm.featured,
      order: news.length + 1,
      active: true,
    };
    updateNews(prev => [...prev, newItem]);
    setNewDialog(false);
    setNewForm({ ...defaultNewForm, date: new Date().toISOString().split('T')[0] });
  };

  // Handle text formatting for content area
  const handleContentFormat = (format: string, isForm: boolean, field: 'content' | 'summary') => {
    const setter = isForm ? setForm : setNewForm;
    const currentValue = isForm ? (form[field] || '') : (newForm[field] || '');
    // Simple formatting: wrap selection or append format marker
    const newValue = currentValue + format;
    if (isForm) {
      setter(prev => ({ ...prev, [field]: newValue }));
    } else {
      setter(prev => ({ ...prev, [field]: newValue }));
    }
  };

  // Helper for thumbnail
  const getThumbnailImage = (item: NewsItem) => {
    const newsTeamMap: Record<string, string> = {
      messi: 'arg', yamal: 'esp', haaland: 'nor', mexico: 'mex', spain: 'esp', ronaldo: 'por', usa: 'usa',
    };
    if (item.imageDataUrl || item.imageUrl) return item.imageDataUrl || item.imageUrl;
    // Check gallery
    if (item.gallery && item.gallery.length > 0) {
      const first = item.gallery.sort((a, b) => a.order - b.order)[0];
      return first.dataUrl || first.url;
    }
    const teamId = newsTeamMap[item.imageKeyword];
    return teamId ? getTeamFlagUrl(teamId, 80) : '';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-nd-green" />
            Gestion de Noticias Destacadas
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {sorted.filter(n => n.active).length} activas de {sorted.length} noticias totales
            {sorted.filter(n => n.featured).length > 0 && (
              <span className="ml-2 text-yellow-600">
                | {sorted.filter(n => n.featured).length} destacadas
              </span>
            )}
          </p>
        </div>
        <Button size="sm" className="bg-nd-green hover:bg-nd-green-dark" onClick={() => setNewDialog(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Nueva Noticia
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Input
          placeholder="Buscar noticias..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="max-w-[200px] h-8 text-sm"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[140px] h-8 text-sm">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline" className="text-[10px]">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Two-column layout: List + Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* LEFT: News list (2 cols) */}
        <div className="lg:col-span-2 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
            <Move className="w-3 h-3" /> Noticias ({filtered.length})
          </div>
          {filtered.map((item, idx) => {
            const isEditing = editingId === item.id;
            const thumbImage = getThumbnailImage(item);
            const newsTeamMap: Record<string, string> = {
              messi: 'arg', yamal: 'esp', haaland: 'nor', mexico: 'mex', spain: 'esp', ronaldo: 'por', usa: 'usa',
            };
            const teamId = newsTeamMap[item.imageKeyword];
            const team = teamId ? getTeamById(teamId) : null;

            return (
              <div
                key={item.id}
                className={`
                  rounded-lg border-2 overflow-hidden transition-all duration-200 cursor-pointer
                  ${isEditing
                    ? 'border-nd-green shadow-lg shadow-nd-green/10 ring-1 ring-nd-green/30'
                    : 'border-border hover:border-nd-green/40 hover:shadow-md'
                  }
                  ${!item.active ? 'opacity-50' : ''}
                `}
                onClick={() => {
                  if (!isEditing) startEdit(item);
                }}
              >
                <div className="p-3 flex items-center gap-3">
                  {/* Order + Arrows */}
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    <button
                      className="p-0.5 rounded hover:bg-nd-green/10 text-muted-foreground hover:text-nd-green disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={idx === 0}
                      onClick={(e) => { e.stopPropagation(); moveNews(idx, 'up'); }}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-bold text-muted-foreground">#{item.order}</span>
                    <button
                      className="p-0.5 rounded hover:bg-nd-green/10 text-muted-foreground hover:text-nd-green disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={idx === sorted.length - 1}
                      onClick={(e) => { e.stopPropagation(); moveNews(idx, 'down'); }}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  {thumbImage ? (
                    <div className="w-16 h-10 rounded overflow-hidden flex-shrink-0 shadow-sm relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumbImage} alt="" className="w-full h-full object-cover" />
                      {item.gallery && item.gallery.length > 0 && (
                        <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[7px] px-0.5 rounded-tl">
                          <Images className="w-2 h-2 inline" /> {item.gallery.length}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-16 h-10 rounded bg-muted/40 flex items-center justify-center flex-shrink-0">
                      <Newspaper className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <Badge className={`text-[9px] px-1.5 py-0 ${
                        item.category === 'En Vivo' ? 'bg-red-100 text-red-700' :
                        item.category === 'Especial' ? 'bg-orange-100 text-orange-700' :
                        item.category === 'Análisis' ? 'bg-green-100 text-green-700' :
                        item.category === 'Resultados' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {item.category}
                      </Badge>
                      {!item.active && (
                        <Badge className="text-[9px] px-1.5 py-0 bg-gray-100 text-gray-500">Inactiva</Badge>
                      )}
                      {item.featured && (
                        <Badge className="text-[9px] px-1.5 py-0 bg-yellow-100 text-yellow-700">
                          <Star className="w-2.5 h-2.5 mr-0.5" /> Destacada
                        </Badge>
                      )}
                      {(item.imageUrl || item.imageDataUrl) && (
                        <Badge className="text-[9px] px-1.5 py-0 bg-nd-green/10 text-nd-green">
                          <ImageIcon className="w-2.5 h-2.5 mr-0.5" /> Foto
                        </Badge>
                      )}
                      {item.gallery && item.gallery.length > 0 && (
                        <Badge className="text-[9px] px-1.5 py-0 bg-blue-50 text-blue-600">
                          <Images className="w-2.5 h-2.5 mr-0.5" /> {item.gallery.length}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-semibold truncate">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {item.date} {team ? `- ${team.flag} ${team.name}` : ''}
                      {item.author ? ` | Por ${item.author}` : ''}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <Switch
                      checked={item.active}
                      onCheckedChange={() => toggleActive(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="scale-75"
                    />
                    <button
                      className="p-1 rounded hover:bg-yellow-50 text-muted-foreground hover:text-yellow-600"
                      onClick={(e) => { e.stopPropagation(); toggleFeatured(item.id); }}
                      title={item.featured ? 'Quitar destacada' : 'Marcar como destacada'}
                    >
                      <Star className={`w-3.5 h-3.5 ${item.featured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-nd-green/10 text-muted-foreground hover:text-nd-green"
                      onClick={(e) => { e.stopPropagation(); duplicateNews(item); }}
                      title="Duplicar"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600"
                      onClick={(e) => { e.stopPropagation(); deleteNews(item.id); }}
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

          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Newspaper className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No hay noticias. Agrega la primera.</p>
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
                    Editando Noticia #{form.order}
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
                {/* Editor Tabs */}
                <Tabs value={editorTab} onValueChange={(v) => setEditorTab(v as typeof editorTab)}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basico" className="text-xs">📝 Basico</TabsTrigger>
                    <TabsTrigger value="contenido" className="text-xs">📄 Contenido</TabsTrigger>
                    <TabsTrigger value="galeria" className="text-xs">
                      📸 Galeria {form.gallery && form.gallery.length > 0 ? `(${form.gallery.length})` : ''}
                    </TabsTrigger>
                    <TabsTrigger value="avanzado" className="text-xs">⚙️ Avanzado</TabsTrigger>
                  </TabsList>

                  {/* BASIC TAB */}
                  <TabsContent value="basico" className="mt-4 space-y-4">
                    {/* Title */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Titulo *</Label>
                      <Input
                        value={form.title ?? ''}
                        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ej: Messi lidera la goleada de Argentina"
                        className="text-sm"
                      />
                    </div>

                    {/* Summary with format toolbar */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Resumen</Label>
                      <TextFormatToolbar onFormat={(fmt) => handleContentFormat(fmt, true, 'summary')} />
                      <Textarea
                        value={form.summary ?? ''}
                        onChange={(e) => setForm(prev => ({ ...prev, summary: e.target.value }))}
                        placeholder="Resumen de la noticia..."
                        rows={3}
                        className="text-sm"
                      />
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        Foto de Portada
                      </Label>
                      <NewsImageUploader
                        imageUrl={form.imageUrl ?? ''}
                        imageDataUrl={form.imageDataUrl ?? ''}
                        onImageUrlChange={(url) => setForm(prev => ({ ...prev, imageUrl: url }))}
                        onImageDataUrlChange={(dataUrl) => setForm(prev => ({ ...prev, imageDataUrl: dataUrl }))}
                      />
                    </div>

                    {/* Category, Date, Keyword, Featured */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Categoria</Label>
                        <Select
                          value={form.category ?? 'Resultados'}
                          onValueChange={(v) => setForm(prev => ({ ...prev, category: v }))}
                        >
                          <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Fecha</Label>
                        <Input
                          type="date"
                          value={form.date ?? ''}
                          onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Bandera / Equipo</Label>
                        <Select
                          value={form.imageKeyword ?? 'custom'}
                          onValueChange={(v) => setForm(prev => ({ ...prev, imageKeyword: v }))}
                        >
                          <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {KEYWORD_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3" /> Destacada
                        </Label>
                        <div className="flex items-center gap-2 h-9">
                          <Switch
                            checked={form.featured ?? false}
                            onCheckedChange={(v) => setForm(prev => ({ ...prev, featured: v }))}
                          />
                          <span className="text-xs text-muted-foreground">
                            {(form.featured) ? 'Aparecera como destacada' : 'Noticia normal'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* CONTENT TAB */}
                  <TabsContent value="contenido" className="mt-4 space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold flex items-center gap-1">
                        <FileImage className="w-3 h-3" />
                        Cuerpo de la Noticia
                      </Label>
                      <TextFormatToolbar onFormat={(fmt) => handleContentFormat(fmt, true, 'content')} />
                      <Textarea
                        value={form.content ?? ''}
                        onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Escribe el contenido completo de la noticia aqui..."
                        rows={12}
                        className="text-sm leading-relaxed"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        {(form.content?.length || 0)} caracteres
                        {form.content && form.content.length < 100 && (
                          <span className="text-yellow-500 ml-2">Se recomienda al menos 100 caracteres</span>
                        )}
                      </p>
                    </div>

                    {/* Author and Source */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold flex items-center gap-1">
                          <User className="w-3 h-3" /> Autor
                        </Label>
                        <Input
                          value={form.author ?? ''}
                          onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                          placeholder="Ej: Carlos Mendez"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Fuente
                        </Label>
                        <Input
                          value={form.source ?? ''}
                          onChange={(e) => setForm(prev => ({ ...prev, source: e.target.value }))}
                          placeholder="Ej: ESPN, TyC Sports"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* GALLERY TAB */}
                  <TabsContent value="galeria" className="mt-4 space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold flex items-center gap-1">
                        <Images className="w-3 h-3" />
                        Galeria de Fotos
                      </Label>
                      <p className="text-[10px] text-muted-foreground">
                        Sube multiples fotos para crear una galeria. La primera foto se usara como portada si no hay foto de portada.
                      </p>
                      <GalleryUploader
                        gallery={form.gallery ?? []}
                        onGalleryChange={(gallery) => setForm(prev => ({ ...prev, gallery }))}
                      />
                    </div>
                  </TabsContent>

                  {/* ADVANCED TAB */}
                  <TabsContent value="avanzado" className="mt-4 space-y-4">
                    {/* Tags */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Etiquetas
                      </Label>
                      <TagInput
                        tags={form.tags ?? []}
                        onTagsChange={(tags) => setForm(prev => ({ ...prev, tags }))}
                      />
                    </div>

                    {/* Order and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Orden</Label>
                        <Input
                          type="number" min="1" max="50"
                          value={form.order ?? 1}
                          onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Estado</Label>
                        <div className="flex items-center gap-2 h-9">
                          <Switch
                            checked={form.active ?? true}
                            onCheckedChange={(v) => setForm(prev => ({ ...prev, active: v }))}
                          />
                          <span className="text-xs text-muted-foreground">
                            {(form.active ?? true) ? 'Publicada' : 'Borrador'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <Separator />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-muted/30 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">Portada</p>
                        <p className="text-sm font-bold">{(form.imageUrl || form.imageDataUrl) ? 'Si' : 'No'}</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">Galeria</p>
                        <p className="text-sm font-bold">{form.gallery?.length || 0} fotos</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">Contenido</p>
                        <p className="text-sm font-bold">{form.content?.length || 0} chars</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">Etiquetas</p>
                        <p className="text-sm font-bold">{form.tags?.length || 0}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Live Preview - always visible */}
                <Separator />
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Vista Previa en Tiempo Real
                  </Label>
                  <NewsPreview newsItem={form} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center text-muted-foreground">
                <ZoomIn className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Selecciona una noticia para editar</p>
                <p className="text-xs mt-1">Haz clic en cualquier noticia de la lista o crea una nueva</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ===== NEW NEWS DIALOG ===== */}
      <Dialog open={newDialog} onOpenChange={setNewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-nd-green" />
              Crear Nueva Noticia
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Titulo *</Label>
              <Input
                value={newForm.title}
                onChange={(e) => setNewForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ej: Messi lidera la goleada de Argentina"
              />
            </div>

            {/* Summary with format toolbar */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Resumen</Label>
              <TextFormatToolbar onFormat={(fmt) => handleContentFormat(fmt, false, 'summary')} />
              <Textarea
                value={newForm.summary}
                onChange={(e) => setNewForm(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Resumen de la noticia..."
                rows={3}
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <FileImage className="w-3 h-3" /> Contenido Completo
              </Label>
              <TextFormatToolbar onFormat={(fmt) => handleContentFormat(fmt, false, 'content')} />
              <Textarea
                value={newForm.content}
                onChange={(e) => setNewForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Escribe el contenido completo de la noticia..."
                rows={6}
              />
            </div>

            {/* Cover Image upload */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Foto de Portada
              </Label>
              <NewsImageUploader
                imageUrl={newForm.imageUrl}
                imageDataUrl={newForm.imageDataUrl}
                onImageUrlChange={(url) => setNewForm(prev => ({ ...prev, imageUrl: url }))}
                onImageDataUrlChange={(dataUrl) => setNewForm(prev => ({ ...prev, imageDataUrl: dataUrl }))}
              />
            </div>

            {/* Gallery Upload */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Images className="w-3 h-3" /> Galeria de Fotos
              </Label>
              <GalleryUploader
                gallery={newForm.gallery}
                onGalleryChange={(gallery) => setNewForm(prev => ({ ...prev, gallery }))}
              />
            </div>

            {/* Category, Date, Keyword, Author, Source */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Categoria</Label>
                <Select
                  value={newForm.category}
                  onValueChange={(v) => setNewForm(prev => ({ ...prev, category: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Fecha</Label>
                <Input
                  type="date"
                  value={newForm.date}
                  onChange={(e) => setNewForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Bandera / Equipo</Label>
                <Select
                  value={newForm.imageKeyword}
                  onValueChange={(v) => setNewForm(prev => ({ ...prev, imageKeyword: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {KEYWORD_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <User className="w-3 h-3" /> Autor
                </Label>
                <Input
                  value={newForm.author}
                  onChange={(e) => setNewForm(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Ej: Carlos Mendez"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Fuente
                </Label>
                <Input
                  value={newForm.source}
                  onChange={(e) => setNewForm(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="Ej: ESPN"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" /> Destacada
                </Label>
                <div className="flex items-center gap-2 h-9">
                  <Switch
                    checked={newForm.featured}
                    onCheckedChange={(v) => setNewForm(prev => ({ ...prev, featured: v }))}
                  />
                  <span className="text-xs text-muted-foreground">{newForm.featured ? 'Si' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Tag className="w-3 h-3" /> Etiquetas
              </Label>
              <TagInput
                tags={newForm.tags}
                onTagsChange={(tags) => setNewForm(prev => ({ ...prev, tags }))}
              />
            </div>

            {/* Preview */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Vista Previa</Label>
              <NewsPreview newsItem={newForm} />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button onClick={addNewNews} className="flex-1 bg-nd-green hover:bg-nd-green-dark" disabled={!newForm.title}>
                <Save className="w-4 h-4 mr-1" />
                Crear Noticia
              </Button>
              <Button variant="outline" onClick={() => setNewDialog(false)}>
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
