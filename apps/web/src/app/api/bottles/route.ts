import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/bottles
 * List bottles with filters
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const org_id = searchParams.get('org_id');
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') || 'desc';
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  if (!org_id) {
    return NextResponse.json({ error: 'org_id required' }, { status: 400 });
  }

  let query = supabase()
    .from('bottles')
    .select('*, seller:sellers(full_name), buyer:buyers(full_name)', { count: 'exact' })
    .eq('org_id', org_id)
    .order(sort, { ascending: order === 'asc' })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);
  if (category) query = query.eq('category', category);
  if (search) {
    query = query.or(`name.ilike.%${search}%,producer.ilike.%${search}%,denomination.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count, limit, offset });
}

/**
 * POST /api/bottles
 * Create a new bottle
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.org_id || !body.name || !body.category) {
      return NextResponse.json({ error: 'org_id, name, and category are required' }, { status: 400 });
    }

    const { data, error } = await supabase()
      .from('bottles')
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
