
import prisma from "@/lib/prismadb";

export default defineEventHandler(async (event) => {
    const DAY_IN_MS = 86_400_000;


    const { auth } = event.context;

    if (!(auth?.userId)) return;


    const userSubscription = await prisma.userSubscription.findUnique({
        where: {
            userId: auth.userId,
        },
        select: {
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    })

    if (!userSubscription) {
        return false;
    }

    const isValid =
        userSubscription.stripePriceId &&
        userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

    return !!isValid;

});
