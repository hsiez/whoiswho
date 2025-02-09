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

export async function POST(request: Request) {
  try {
    const { 'bs-id': bsId, 'x-id': xId } = await request.json();

    const { error } = await supabase.rpc('create_mapping', { 
      username_a: bsId, 
      username_b: xId
    });

    if (error) console.error(error);

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

    const platform = searchParams.get('platform');
    if (!platform) {
      return NextResponse.json(
        { success: false, error: 'Platform parameter is required' },
        { status: 400 }
      );
    }

    const { data: result } = await supabase.rpc('search_association', { 
      search_username: username, 
      search_platform: platform
    });
    if (result) {
      return NextResponse.json({ success: true, linkedId: result });
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