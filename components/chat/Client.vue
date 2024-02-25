<script setup lang="ts">
import { useCompletion } from "ai/vue";
import type { Companion, Message } from "@prisma/client";
import ChatForm from "@/components/chat/ChatForm.vue";
import ChatHeader from "@/components/chat/ChatHeader.vue";
import ChatMessages from "@/components/chat/ChatMessages.vue";
import ChatMessageProps from "@/components/chat/ChatMessage.vue";
import { useMainStore } from "@/stores/main";
import { useToast } from "@/components/ui/toast/use-toast";

const { toast } = useToast();

const { updateEventTrigger } = useMainStore();

export interface ChatMessageProps {
  role: "system" | "user";
  content?: string;
  isLoading?: boolean;
  src?: string;
}

interface ChatClientProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}
const { companion } = defineProps<ChatClientProps>();

const messages = ref<ChatMessageProps[]>(companion.messages);

const { input, isLoading, handleSubmit } = useCompletion({
  api: `/api/chat/${companion.id}`,

  onFinish(_prompt, completion) {
    const systemMessage: ChatMessageProps = {
      role: "system",
      content: completion,
    };

    if (systemMessage.content === "error-happened") {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
    } else {
      messages.value.push(systemMessage);
    }

    input.value = "";

    setTimeout(() => {
      updateEventTrigger();
    }, 400);
  },
});
</script>

<template>
  <div class="flex flex-col h-full p-4 space-y-2">
    <ChatHeader :companion="companion" />
    <ChatMessages
      :companion="companion"
      :isLoading="isLoading"
      :messages="messages"
    />
    <ChatForm :isLoading="isLoading" v-model="input" @submit="handleSubmit" />
  </div>
</template>
