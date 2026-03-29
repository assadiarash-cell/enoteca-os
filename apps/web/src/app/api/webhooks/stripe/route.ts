import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events for subscription management
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify webhook signature
    const stripe = await import('stripe');
    const stripeClient = new stripe.default(process.env.STRIPE_SECRET_KEY!);

    let event: import('stripe').Stripe.Event;
    try {
      event = stripeClient.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const client = supabase();

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as import('stripe').Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Map Stripe price to plan
        const priceId = subscription.items.data[0]?.price.id;
        let plan = 'base';
        // Map your Stripe price IDs to plans
        if (priceId?.includes('pro')) plan = 'pro';
        if (priceId?.includes('enterprise')) plan = 'enterprise';

        await client
          .from('organizations')
          .update({
            plan,
            stripe_subscription_id: subscription.id,
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as import('stripe').Stripe.Subscription;
        const customerId = subscription.customer as string;

        await client
          .from('organizations')
          .update({
            plan: 'trial',
            stripe_subscription_id: null,
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as import('stripe').Stripe.Invoice;
        const customerId = invoice.customer as string;

        const { data: org } = await client
          .from('organizations')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (org) {
          await client.from('alerts').insert({
            org_id: org.id,
            alert_type: 'deal_pending',
            priority: 'critical',
            title: 'Payment failed',
            message: 'Your subscription payment has failed. Please update your payment method.',
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
