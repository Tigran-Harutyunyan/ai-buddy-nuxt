
import prisma from "@/lib/prismadb";

export default defineEventHandler(async (event) => {

    const { auth } = event.context;

    if (!(auth?.userId)) return;

    const { src, name, description, instructions, seed, categoryId, userName } = await readBody(event);

    if (!src || !name || !description || !instructions || !seed || !categoryId || !userName) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing required fields"
        });
    };

    //   const isPro = await checkSubscription();

    //   if (!isPro) { 
    //      throw createError({
    //     statusCode: 403,
    //     statusMessage: "Pro subscription required"
    //      });
    //   }

    try {
        const companion = await prisma.companion.create({
            data: {
                categoryId,
                userId: auth.userId,
                userName,
                src,
                name,
                description,
                instructions,
                seed,
            }
        });

        return companion;
    } catch (error) {
        console.log("[COMPANION_POST]", error);
        return createError({
            statusCode: 500,
            statusMessage: "Internal Error"
        });
    }
});
