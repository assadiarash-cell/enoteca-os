import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const org_id = searchParams.get('org_id');
  const unread_only = searchParams.get('unread_only') === 'true';

  if (!org_id) {
    return NextResponse.json({ error: 'org_id required' }, { status: 400 });
  }

  let query = supabase()
    .from('alerts')
    .select('*', { count: 'exact' })
    .eq('org_id', org_id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (unread_only) query = query.eq('is_read', false);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { ids, is_read, is_actioned } = body;

  if (!ids?.length) {
    return NextResponse.json({ error: 'ids required' }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (is_read !== undefined) update.is_read = is_read;
  if (is_actioned !== undefined) update.is_actioned = is_actioned;

  const { error } = await supabase()
    .from('alerts')
    .update(update)
    .in('id', ids);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
