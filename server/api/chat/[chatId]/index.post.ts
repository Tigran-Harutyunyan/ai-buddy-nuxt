
import prisma from "@/lib/prismadb";
import { StreamingTextResponse, LangChainStream } from "ai";
import { Replicate } from "langchain/llms/replicate";
import { CallbackManager } from "langchain/callbacks";
import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";

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

    const { prompt } = await readBody(event);

    try {
        const identifier = getRequestURL(event) + "-" + auth.userId;
        const { success } = await rateLimit(identifier);

        if (!success) {
            createError({
                statusCode: 429,
                statusMessage: "Rate limit exceeded"
            });
        }

        const companion = await prisma.companion.update({
            where: {
                id: chatId
            },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: "user",
                        userId: auth.userId,
                    },
                },
            }
        });

        if (!companion) {
            return createError({
                statusCode: 404,
                statusMessage: "Companion not found"
            });
        }

        const name = companion.id;
        const companion_file_name = name + ".txt";

        const companionKey = {
            companionName: name!,
            userId: auth.userId,
            modelName: "llama2-13b",
        };
        const memoryManager = await MemoryManager.getInstance();

        const records = await memoryManager.readLatestHistory(companionKey);
        if (records.length === 0) {
            await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
        }
        await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);

        // Query Pinecone

        const recentChatHistory = await memoryManager.readLatestHistory(companionKey);

        // Right now the preamble is included in the similarity search, but that
        // shouldn't be an issue

        const similarDocs = await memoryManager.vectorSearch(
            recentChatHistory,
            companion_file_name
        );

        let relevantHistory = "";
        if (!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
        }
        const { handlers } = LangChainStream();
        // Call Replicate for inference
        const model = new Replicate({
            model:
                "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
            input: {
                max_length: 2048,
            },
            apiKey: process.env.REPLICATE_API_TOKEN,
            callbackManager: CallbackManager.fromHandlers(handlers),
        });

        // Turn verbose on for debugging
        model.verbose = true; 

        const resp = String(
            await model
                .call(
                    `
            ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. 
    
            ${companion.instructions}
    
            Below are relevant details about ${companion.name}'s past and the conversation you are in.
            ${relevantHistory} 
            ${recentChatHistory}\n${companion.name}:`
                )
                .catch(console.error)
        ); 
       

        const cleaned = resp.replaceAll(",", "");
        const chunks = cleaned.split("\n");
        const response = chunks[0]; 
        
        await memoryManager.writeToHistory("" + response.trim(), companionKey);

        // var Readable = require("stream").Readable; 
        // let s = new Readable();
        // s.push(response);
        // s.push(null);
 
        if (response !== 'undefined' && response.length > 1) {
             memoryManager.writeToHistory("" + response.trim(), companionKey);

            console.log('!!!!',typeof response)

            await prisma.companion.update({
                where: {
                    id: chatId
                },
                data: {
                    messages: {
                        create: {
                            content: response.trim(),
                            role: "system",
                            userId: auth.userId,
                        },
                    },
                }
            });
            return response;
        } 
        
        if (resp === 'undefined') {
            return 'error-happened'; 
        } 
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: "Internal Error"
        });
    }
});
