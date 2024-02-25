<script setup lang="ts">
import ChatMessage, {
  type ChatMessageProps,
} from "@/components/chat/ChatMessage.vue";

import { type Companion } from "@prisma/client";
import { useMainStore } from "@/stores/main";

const { chatEventTrigger } = storeToRefs(useMainStore());

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading: boolean | undefined;
  companion: Companion;
}

const { messages, companion, isLoading } = defineProps<ChatMessagesProps>();

const fakeLoading = ref(messages.length === 0 ? true : false);

const scrollRef = ref<HTMLDivElement>();

onMounted(() => {
  setTimeout(() => {
    fakeLoading.value = false;
  }, 1000);

  setTimeout(() => {
    scrollRef?.value?.scrollIntoView({ behavior: "smooth" });
  }, 400);
});

watch(
  () => chatEventTrigger.value,
  () => {
    scrollRef?.value?.scrollIntoView({ behavior: "smooth" });
  }
);
</script>

<template>
  <div class="flex-1 overflow-y-auto pr-4">
    <ChatMessage
      :isLoading="fakeLoading"
      :src="companion.src"
      role="system"
      :content="`Hello, I am
      ${companion.name},
      ${companion.description}`"
    />

    <ChatMessage
      v-for="message in messages"
      :key="message.content"
      :src="companion.src"
      :content="message.content"
      :role="message.role"
    />

    <ChatMessage
      v-if="isLoading"
      :src="companion.src"
      role="system"
      isLoading
    />
    <div ref="scrollRef" class="w-full h-[3px]" />
  </div>
</template>
