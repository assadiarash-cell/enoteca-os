import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AgentRouter } from '@enoteca-os/shared/agents';

/**
 * POST /api/agents/scan
 * Trigger the acquisition pipeline: Vision → Authenticator → Pricer
 * Body: { photo_urls: string[], bottle_id?: string, org_id: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photo_urls, bottle_id, org_id } = body;

    if (!photo_urls?.length) {
      return NextResponse.json({ error: 'photo_urls required' }, { status: 400 });
    }

    if (!org_id) {
      return NextResponse.json({ error: 'org_id required' }, { status: 400 });
    }

    const router = new AgentRouter({
      org_id,
      anthropic_api_key: process.env.ANTHROPIC_API_KEY!,
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabase_service_key: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    });

    const result = await router.runAcquisitionPipeline({
      photo_urls,
      bottle_id,
    });

    // If bottle_id exists, update the bottle record with results
    if (bottle_id && result.vision.success) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const visionData = result.vision.data as Record<string, unknown>;
      const authData = result.authenticity.data as Record<string, unknown>;
      const priceData = result.pricing.data as Record<string, unknown>;

      await supabase
        .from('bottles')
        .update({
          producer: visionData.producer,
          category: visionData.category,
          vintage: visionData.vintage,
          denomination: visionData.denomination,
          region: visionData.region,
          country: visionData.country,
          format: visionData.format,
          closure_type: visionData.closure_type,
          label_condition: visionData.label_condition,
          liquid_level: visionData.liquid_level,
          capsule_condition: visionData.capsule_condition,
          overall_condition: visionData.overall_condition,
          vision_data: visionData,
          authenticity_score: authData.score,
          authenticity_flags: authData.flags,
          market_price_low: priceData.price_low,
          market_price_high: priceData.price_high,
          target_sell_price: priceData.recommended_sell,
          pricing_sources: priceData.sources,
          status: 'valued',
          valued_at: new Date().toISOString(),
        })
        .eq('id', bottle_id);

      // Create alert for trophy bottles
      if ((priceData.rarity as string) === 'trophy' || (priceData.rarity as string) === 'very_rare') {
        await supabase.from('alerts').insert({
          org_id,
          alert_type: 'trophy_bottle',
          priority: 'high',
          title: `Trophy detected: ${visionData.producer} ${visionData.name} ${visionData.vintage || ''}`,
          message: `Market value €${priceData.price_low}–€${priceData.price_high}. Authenticity: ${authData.score}/100.`,
          related_entity_type: 'bottle',
          related_entity_id: bottle_id,
        });
      }
    }

    return NextResponse.json({
      success: true,
      vision: result.vision,
      authenticity: result.authenticity,
      pricing: result.pricing,
    });
  } catch (error) {
    console.error('Scan pipeline error:', error);
    return NextResponse.json(
      { error: 'Pipeline failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}
