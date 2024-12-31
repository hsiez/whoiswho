import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

interface LinkRecord {
  'x-id': string;
  'bs-id': string;
  created_at: string;
}

export async function POST(request: Request) {
  try {
    const { 'x-id': xId, 'bs-id': bsId } = await request.json();

    const { error } = await supabase
      .from('links')
      .insert([
        {
          'x-id': xId,
          'bs-id': bsId,
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username parameter is required' },
        { status: 400 }
      );
    }

    // Try finding by x-id first
    const { data: xData } = await supabase
      .from('links')
      .select('bs-id')
      .eq('x-id', username)
      .single<Pick<LinkRecord, 'bs-id'>>();

    if (xData) {
      return NextResponse.json({ success: true, linkedId: xData['bs-id'] });
    }

    // If not found, try by bs-id
    const { data: bsData } = await supabase
      .from('links')
      .select('x-id')
      .eq('bs-id', username)
      .single<Pick<LinkRecord, 'x-id'>>();

    if (bsData) {
      return NextResponse.json({ success: true, linkedId: bsData['x-id'] });
    }

    return NextResponse.json(
      { success: false, error: 'No linked account found' },
      { status: 404 }
    );

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 