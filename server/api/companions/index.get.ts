
import prisma from "@/lib/prismadb";

export default defineEventHandler(async (event) => {

    const { auth } = event.context;

    if (!(auth?.userId)) return;

    const params = getQuery(event);

    if (!params) {
        return createError({
            statusCode: 401,
            statusMessage: "missing params"
        });
    }

    try {
        const companions = await prisma.companion.findMany({
            where: {
                categoryId: params?.categoryId as string,

                // NOT supported by tidb
                // name: {
                //     search: params?.name as string,
                // }, 
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                _count: {
                    select: {
                        messages: true,
                    }
                }
            },
        });

        if (params?.name) {
            return companions.filter(item => item.name.toLocaleLowerCase().includes(params.name))
        }
        return companions;
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: "Something went wrong"
        });
    }
});
