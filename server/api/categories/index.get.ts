import prismadb from "@/lib/prismadb"

export default defineEventHandler(async (event) => {
    const { auth } = event.context;

    if (!(auth?.userId)) return;

    try {

        const categories = await prismadb.category.findMany()

        return categories;

    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error
        });
    }

});


