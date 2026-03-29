import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AgentRouter } from '@enoteca-os/shared/agents';

const supabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/public/valuation
 * Public endpoint for seller bottle valuation
 * Body: FormData with photos, contact info, province, sale_type
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('photos') as File[];
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const province = formData.get('province') as string;
    const saleType = formData.get('sale_type') as string;
    const notes = formData.get('notes') as string | null;
    const orgSlug = formData.get('org_slug') as string || 'antiche-bottiglie';

    if (!files.length) {
      return NextResponse.json({ error: 'Carica almeno una foto' }, { status: 400 });
    }

    if (!name || !phone) {
      return NextResponse.json({ error: 'Nome e telefono obbligatori' }, { status: 400 });
    }

    const client = supabase();

    // Find organization
    const { data: org } = await client
      .from('organizations')
      .select('id')
      .eq('slug', orgSlug)
      .single();

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Create or find seller
    let { data: seller } = await client
      .from('sellers')
      .select('id')
      .eq('org_id', org.id)
      .eq('phone', phone)
      .single();

    if (!seller) {
      const { data: newSeller } = await client
        .from('sellers')
        .insert({
          org_id: org.id,
          full_name: name,
          phone,
          email,
          province,
          seller_type: saleType as 'inheritance' | 'collector' | 'restaurant_closure' | 'liquidation' | 'private',
          source_channel: 'website',
          notes,
        })
        .select()
        .single();
      seller = newSeller;
    }

    // Upload photos
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${org.id}/valuations/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { data } = await client.storage
        .from('bottle-photos')
        .upload(fileName, buffer, { contentType: file.type });

      if (data) {
        const { data: urlData } = client.storage.from('bottle-photos').getPublicUrl(data.path);
        uploadedUrls.push(urlData.publicUrl);
      }
    }

    // Create bottle record
    const { data: bottle } = await client
      .from('bottles')
      .insert({
        org_id: org.id,
        category: 'wine', // Will be updated by Vision Agent
        name: 'Pending identification',
        status: 'pending_valuation',
        seller_id: seller!.id,
        photos: uploadedUrls,
        primary_photo: uploadedUrls[0],
        notes: `Valutazione web — ${saleType}. ${notes || ''}`,
      })
      .select()
      .single();

    // Create alert for new lead
    await client.from('alerts').insert({
      org_id: org.id,
      alert_type: 'new_lead',
      priority: 'medium',
      title: `Nuova richiesta valutazione da ${name}`,
      message: `${province} — ${saleType} — ${files.length} foto caricate`,
      related_entity_type: 'bottle',
      related_entity_id: bottle!.id,
    });

    // Run AI pipeline in background (non-blocking)
    const router = new AgentRouter({
      org_id: org.id,
      anthropic_api_key: process.env.ANTHROPIC_API_KEY!,
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabase_service_key: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    });

    // Fire and forget — pipeline updates the bottle record async
    router.runAcquisitionPipeline({
      photo_urls: uploadedUrls,
      bottle_id: bottle!.id,
    }).catch((err) => console.error('Pipeline error:', err));

    return NextResponse.json({
      success: true,
      message: 'Valutazione in corso. Ti contatteremo entro 24 ore.',
      bottle_id: bottle!.id,
    });
  } catch (error) {
    console.error('Valuation error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
