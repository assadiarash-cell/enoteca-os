import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/acquisitions
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const org_id = searchParams.get('org_id');
  const status = searchParams.get('status');

  if (!org_id) {
    return NextResponse.json({ error: 'org_id required' }, { status: 400 });
  }

  let query = supabase()
    .from('acquisitions')
    .select('*, seller:sellers(full_name, phone, city, seller_type), bottles(id, name, producer, vintage, status, purchase_price)', { count: 'exact' })
    .eq('org_id', org_id)
    .order('updated_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}

/**
 * POST /api/acquisitions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase()
      .from('acquisitions')
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
