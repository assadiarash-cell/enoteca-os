import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/acquisitions/:id
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase()
    .from('acquisitions')
    .select('*, seller:sellers(*), bottles(*), conversation:conversations(*, messages(*))')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

/**
 * PATCH /api/acquisitions/:id
 * Update acquisition status or details
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabase()
    .from('acquisitions')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If status changed to 'completed', update all associated bottles
  if (body.status === 'completed') {
    const { data: bottles } = await supabase()
      .from('bottles')
      .select('id')
      .eq('acquisition_id', id);

    if (bottles?.length) {
      await supabase()
        .from('bottles')
        .update({
          status: 'acquired',
          acquired_at: new Date().toISOString(),
          purchase_price: body.total_final ? body.total_final / bottles.length : undefined,
        })
        .eq('acquisition_id', id);
    }
  }

  return NextResponse.json(data);
}
