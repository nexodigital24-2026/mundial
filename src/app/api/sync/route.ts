import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const FOOTER_FILE = path.join(process.cwd(), 'data', 'footer.json');
const THEME_FILE = path.join(process.cwd(), 'data', 'theme.json');

async function getFileTimestamp(filePath: string): Promise<number> {
  try {
    const stat = await fs.stat(filePath);
    return stat.mtimeMs;
  } catch {
    return 0;
  }
}

// GET — returns timestamps for all syncable data so clients know if they need to refresh
export async function GET() {
  const [footerTs, themeTs] = await Promise.all([
    getFileTimestamp(FOOTER_FILE),
    getFileTimestamp(THEME_FILE),
  ]);

  return NextResponse.json({
    success: true,
    footer: { timestamp: footerTs },
    theme: { timestamp: themeTs },
  });
}
