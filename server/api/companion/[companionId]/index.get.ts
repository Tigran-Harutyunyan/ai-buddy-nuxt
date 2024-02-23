
import prisma from "@/lib/prismadb";

export default defineEventHandler(async (event) => {

    const { auth } = event.context;

    if (!(auth?.userId)) return;

    const { companionId } = getRouterParams(event);

    if (!companionId) {
        createError({
            statusCode: 400,
            statusMessage: "no CompanionID"
        });
    }

    try {
        const companion = await prisma.companion.findUnique({
            where: {
                id: companionId,
                userId: auth?.userId,
            }
        });
        return companion;
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: "Something went wrong"
        });
    }
});
