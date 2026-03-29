import { NextRequest } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `Sei il Copilot di ENOTECA OS, la piattaforma per dealer di bottiglie da collezione (vini pregiati, whisky rari, cognac, rum).

Il tuo ruolo:
- Aiuti gli operatori a gestire inventario, valutazioni, deal e analytics
- Rispondi in italiano, in modo conciso e professionale
- Conosci il mercato dei vini da collezione italiani e internazionali
- Puoi aiutare con: valutazioni di bottiglie, strategie di pricing, analisi di mercato, gestione clienti
- Usa terminologia del settore: DOCG, DOC, annata, condizione etichetta, livello liquido, provenienza

Primo cliente: Antiche Bottiglie (EBW Consulting Spa), Torino — 5.620 valutazioni/anno, 20.314 transazioni, ~€2M fatturato.

Rispondi sempre in italiano. Sii diretto e utile.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10),
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ error: `Anthropic API error: ${response.status}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
