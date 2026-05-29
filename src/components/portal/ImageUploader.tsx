'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, Upload, X, Link, CheckCircle } from 'lucide-react';

interface ImageUploaderProps {
  imageUrl: string;
  imageDataUrl: string;
  onImageUrlChange: (url: string) => void;
  onImageDataUrlChange: (dataUrl: string) => void;
  label?: string;
  folder?: string;
}

export default function ImageUploader({
  imageUrl,
  imageDataUrl,
  onImageUrlChange,
  onImageDataUrlChange,
  label = 'Imagen',
  folder = 'general',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [compressionInfo, setCompressionInfo] = useState<{ original: number; compressed: number; savings: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolvedImage = imageDataUrl || (imageUrl && imageUrl.length > 0 ? imageUrl : '');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For immediate preview, convert to data URL
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onImageDataUrlChange(dataUrl);
    };
    reader.readAsDataURL(file);

    // Also upload to server for persistence (converts to WebP)
    try {
      setUploading(true);
      setCompressionInfo(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

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
  };

  const clearImage = () => {
    onImageUrlChange('');
    onImageDataUrlChange('');
    setCompressionInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1.5">
        <ImageIcon className="w-4 h-4" />
        {label}
      </Label>

      {/* Mode toggle */}
      <div className="flex gap-1 mb-2">
        <Button
          type="button"
          variant={mode === 'upload' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => setMode('upload')}
        >
          <Upload className="w-3 h-3 mr-1" />
          Subir Archivo
        </Button>
        <Button
          type="button"
          variant={mode === 'url' ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7"
          onClick={() => setMode('url')}
        >
          <Link className="w-3 h-3 mr-1" />
          URL
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full h-20 border-dashed border-2 relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <span className="text-sm">Convirtiendo a WebP...</span>
            ) : resolvedImage ? (
              <div className="w-full h-full relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolvedImage}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Click para subir imagen (se convierte a WebP)</span>
              </div>
            )}
          </Button>

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
        <Input
          placeholder="https://ejemplo.com/imagen.jpg"
          value={imageUrl}
          onChange={(e) => {
            onImageUrlChange(e.target.value);
            onImageDataUrlChange(''); // Clear data URL when using URL mode
          }}
        />
      )}

      {/* Preview and clear */}
      {resolvedImage && (
        <div className="relative rounded-lg overflow-hidden border bg-muted/30">
          <div className="aspect-video relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolvedImage}
              alt="Preview"
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
          {uploading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white text-xs font-medium">Convirtiendo a WebP...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
