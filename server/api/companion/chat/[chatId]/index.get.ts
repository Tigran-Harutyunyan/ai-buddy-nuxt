
import prisma from "@/lib/prismadb";

export default defineEventHandler(async (event) => {

    const { auth } = event.context;

    if (!(auth?.userId)) return;

    const { chatId } = getRouterParams(event);

    if (!chatId) {
        createError({
            statusCode: 400,
            statusMessage: "No chatId"
        });
    }

    try {

        const companion = await prisma.companion.findUnique({
            where: {
                id: chatId
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc"
                    },
                    where: {
                        userId: auth?.userId,
                    },
                },
                _count: {
                    select: {
                        messages: true,
                    }
                }
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


