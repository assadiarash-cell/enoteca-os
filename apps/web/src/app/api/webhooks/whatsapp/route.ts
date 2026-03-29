import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AgentRouter } from '@enoteca-os/shared/agents';

const supabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/webhooks/whatsapp
 * WhatsApp webhook verification
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}

/**
 * POST /api/webhooks/whatsapp
 * Incoming WhatsApp messages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract message from WhatsApp webhook payload
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages?.length) {
      return NextResponse.json({ status: 'no_messages' });
    }

    const message = messages[0];
    const from = message.from;
    const text = message.text?.body || '';
    const hasMedia = message.type === 'image' || message.type === 'document';
    const mediaId = message.image?.id || message.document?.id;

    // Find or create conversation
    const client = supabase();
    let { data: conversation } = await client
      .from('conversations')
      .select('*')
      .eq('external_contact', from)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Look up organization from WhatsApp number
    const phoneNumberId = value.metadata?.phone_number_id;
    const { data: org } = await client
      .from('organizations')
      .select('id')
      .limit(1)
      .single();

    const org_id = org?.id;
    if (!org_id) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 });
    }

    if (!conversation) {
      const { data: newConv } = await client
        .from('conversations')
        .insert({
          org_id,
          channel: 'whatsapp',
          external_contact: from,
          contact_name: value.contacts?.[0]?.profile?.name || from,
          direction: 'inbound_seller',
          status: 'active',
        })
        .select()
        .single();
      conversation = newConv;
    }

    // Save incoming message
    await client.from('messages').insert({
      conversation_id: conversation!.id,
      role: 'user',
      content: text,
      media_urls: mediaId ? [mediaId] : null,
      metadata: { whatsapp_message_id: message.id, from },
    });

    // Route to Intake Agent
    const router = new AgentRouter({
      org_id,
      anthropic_api_key: process.env.ANTHROPIC_API_KEY!,
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabase_service_key: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    });

    const result = await router.routeEvent({
      type: 'new_whatsapp_message',
      org_id,
      payload: {
        message: text,
        channel: 'whatsapp',
        has_media: hasMedia,
        media_id: mediaId,
        conversation_id: conversation!.id,
        from,
      },
      timestamp: new Date().toISOString(),
    });

    // If agent generated a response, send it back via WhatsApp
    const agentResult = Array.isArray(result) ? result[0] : result;
    const responseMessage = (agentResult.data as Record<string, unknown>)?.suggested_response as string;

    if (responseMessage) {
      // Save agent response
      await client.from('messages').insert({
        conversation_id: conversation!.id,
        role: 'agent',
        content: responseMessage,
        agent_id: agentResult.agent_id,
      });

      // Send via WhatsApp API (360dialog / Meta)
      await sendWhatsAppMessage(from, responseMessage, phoneNumberId);
    }

    return NextResponse.json({ status: 'processed' });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

async function sendWhatsAppMessage(to: string, text: string, phoneNumberId: string) {
  const apiKey = process.env.WHATSAPP_API_KEY;
  if (!apiKey) return;

  await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  });
}
