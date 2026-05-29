import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    // Convert to WebP using sharp for compression
    // Quality 80 provides excellent balance between size and visual quality
    const webpBuffer = await sharp(inputBuffer)
      .webp({ quality: 80 })
      .toBuffer();

    // Generate unique filename with .webp extension
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;

    // Save to public/uploads/{folder}/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, webpBuffer);

    const publicUrl = `/uploads/${folder}/${uniqueName}`;

    // Calculate compression ratio for info
    const originalSize = file.size;
    const compressedSize = webpBuffer.length;
    const savings = originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

    return NextResponse.json({
      url: publicUrl,
      name: file.name,
      originalSize,
      compressedSize,
      savings: `${savings}%`,
      type: 'image/webp',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
