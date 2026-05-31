import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { DEFAULT_FOOTER_DATA, type FooterData } from '@/lib/footer-context';

const DATA_FILE = path.join(process.cwd(), 'data', 'footer.json');

async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function readFooterData(): Promise<FooterData> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.brandName && parsed.sections && Array.isArray(parsed.sections)) {
      return parsed as FooterData;
    }
    return DEFAULT_FOOTER_DATA;
  } catch {
    return DEFAULT_FOOTER_DATA;
  }
}

async function writeFooterData(data: FooterData): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// GET — any visitor can read footer data
export async function GET() {
  try {
    const data = await readFooterData();
    return NextResponse.json({ success: true, data, timestamp: Date.now() });
  } catch (error) {
    console.error('Error reading footer data:', error);
    return NextResponse.json(
      { success: false, data: DEFAULT_FOOTER_DATA, timestamp: 0 },
      { status: 200 } // Return defaults on error so the site still works
    );
  }
}

// POST — only authenticated admins can save
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, authEmail, authRole } = body;

    // Simple auth check (client sends its auth state)
    if (!authEmail || !authRole) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (authRole !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Solo administradores pueden guardar' },
        { status: 403 }
      );
    }

    // Validate the data structure
    if (!data || !data.brandName || !data.sections || !Array.isArray(data.sections)) {
      return NextResponse.json(
        { success: false, error: 'Datos de footer inválidos' },
        { status: 400 }
      );
    }

    await writeFooterData(data as FooterData);
    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (error) {
    console.error('Error saving footer data:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
