import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { DEFAULT_COLORS, type ThemeColors } from '@/lib/theme-context';

const DATA_FILE = path.join(process.cwd(), 'data', 'theme.json');

async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function readThemeData(): Promise<ThemeColors> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    const keys: (keyof ThemeColors)[] = [
      'ndGreen', 'ndGreenDark', 'ndGreenLight',
      'ndOrange', 'ndOrangeDark', 'ndOrangeLight', 'ndOrangeAccent',
      'ndBlack', 'ndYellow', 'ndYellowDark', 'ndYellowLight',
    ];
    const isValid = keys.every(k => typeof parsed[k] === 'string' && parsed[k].startsWith('#'));
    if (isValid) return parsed as ThemeColors;
    return DEFAULT_COLORS;
  } catch {
    return DEFAULT_COLORS;
  }
}

async function writeThemeData(data: ThemeColors): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// GET — any visitor can read theme data
export async function GET() {
  try {
    const data = await readThemeData();
    return NextResponse.json({ success: true, data, timestamp: Date.now() });
  } catch (error) {
    console.error('Error reading theme data:', error);
    return NextResponse.json(
      { success: false, data: DEFAULT_COLORS, timestamp: 0 },
      { status: 200 }
    );
  }
}

// POST — only authenticated admins can save
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, authEmail, authRole } = body;

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

    const keys: (keyof ThemeColors)[] = [
      'ndGreen', 'ndGreenDark', 'ndGreenLight',
      'ndOrange', 'ndOrangeDark', 'ndOrangeLight', 'ndOrangeAccent',
      'ndBlack', 'ndYellow', 'ndYellowDark', 'ndYellowLight',
    ];
    const isValid = data && keys.every(k => typeof data[k] === 'string' && data[k].startsWith('#'));
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Datos de theme inválidos' },
        { status: 400 }
      );
    }

    await writeThemeData(data as ThemeColors);
    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (error) {
    console.error('Error saving theme data:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
