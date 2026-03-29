import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/sales
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const org_id = searchParams.get('org_id');
  const status = searchParams.get('status');

  if (!org_id) {
    return NextResponse.json({ error: 'org_id required' }, { status: 400 });
  }

  let query = supabase()
    .from('sales')
    .select('*, buyer:buyers(full_name, company_name, buyer_type, country), sale_items(*, bottle:bottles(name, producer, vintage, primary_photo))', { count: 'exact' })
    .eq('org_id', org_id)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}

/**
 * POST /api/sales
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, ...saleData } = body;

    // Create sale
    const { data: sale, error: saleError } = await supabase()
      .from('sales')
      .insert(saleData)
      .select()
      .single();

    if (saleError) {
      return NextResponse.json({ error: saleError.message }, { status: 500 });
    }

    // Create sale items
    if (items?.length) {
      const saleItems = items.map((item: { bottle_id: string; unit_price: number; quantity?: number }) => ({
        sale_id: sale.id,
        ...item,
      }));

      await supabase().from('sale_items').insert(saleItems);

      // Update bottle status
      const bottleIds = items.map((i: { bottle_id: string }) => i.bottle_id);
      await supabase()
        .from('bottles')
        .update({ status: 'reserved', buyer_id: saleData.buyer_id })
        .in('id', bottleIds);
    }

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
