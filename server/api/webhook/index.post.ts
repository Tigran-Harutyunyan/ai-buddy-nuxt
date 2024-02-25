import prismadb from "@/lib/prismadb";
import Stripe from "stripe";
import { defineStripeWebhook } from '@fixers/nuxt-stripe/server';

/**
 * @param event - the H3 event
 * @param stipe - the Stripe instance
 * @param stripeEvent - the Stripe Webhook event
 */

const STRIPE_API_KEY = useRuntimeConfig().stripeKey as string;

const webhookSecret = useRuntimeConfig().stripeWebhookSecret

const stripe = new Stripe(STRIPE_API_KEY, {
  apiVersion: "2023-10-16"
});

const webhookOptions = {
  webhookSecret,
  stripe,
}

export default defineStripeWebhook(async ({ event, stripeEvent }) => {

  if (!isMethod(event, ['POST'])) {
    setResponseStatus(event, 400)

    return { ok: false }
  }

  console.log(stripe);

  const session = stripeEvent.data.object as Stripe.Checkout.Session;


  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      if (!session?.metadata?.userId) {
        createError({
          statusCode: 400,
          statusMessage: 'User id is required'
        });
      }

      await prismadb.userSubscription.create({
        data: {
          userId: session?.metadata?.userId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      })

    }
    case 'invoice.payment_succeeded': {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      await prismadb.userSubscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      })
    }

    case 'customer.subscription.updated': {
      const object = stripeEvent?.data?.object;

      if (object?.canceled_at && object?.id) {
        await prismadb.userSubscription.delete({
          where: {
            stripeSubscriptionId: object?.id,
          },
        })
      }
    }

  }

  return {
    hello: 'world'
  }

}, webhookOptions); 