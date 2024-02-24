
import prisma from "@/lib/prismadb";

export default defineEventHandler(async (event) => {

    const { auth } = event.context;

    if (!(auth?.userId)) return;

    const { companionId } = getRouterParams(event);

    if (!companionId) {
        createError({
            statusCode: 400,
            statusMessage: "Companion id is missing."
        });
    }

    try {

        const companion = await prisma.companion.delete({
            where: {
                userId: auth?.userId,
                id: companionId
            }
        });

        return companion;
    } catch (error) {
        console.log("[COMPANION_DELETE]", error);
        return createError({
            statusCode: 500,
            statusMessage: "Internal Error"
        });
    }
});
