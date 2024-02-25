<script setup lang="ts">
import { cn } from "@/lib/utils";
import { Copy } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { useDark } from "@vueuse/core";
import { useToast } from "@/components/ui/toast/use-toast";
import Spinner from "@/components/chat/Spinner.vue";

const { toast } = useToast();

const isDark = useDark();

export interface ChatMessageProps {
  role: "system" | "user";
  content?: string;
  isLoading?: boolean | undefined;
  src?: string;
}

const { role, content, isLoading, src } = defineProps<ChatMessageProps>();

const onCopy = () => {
  if (!content) {
    return;
  }

  navigator.clipboard.writeText(content);

  toast({
    description: "Message copied to clipboard.",
    duration: 3000,
  });
};
</script>

<template>
  <div
    :class="
      cn(
        'group flex items-start gap-x-3 py-4 w-full',
        role === 'user' && 'justify-end'
      )
    "
  >
    <BotAvatar v-if="role !== 'user' && src" :src="src" />
    <div class="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
      <Spinner v-if="isLoading" :color="!isDark ? 'black' : 'white'" size="5" />
      <template v-else>
        {{ content }}
      </template>
    </div>

    <UserAvatar v-if="role === 'user'" />

    <Button
      v-if="role !== 'user' && !isLoading"
      @click="onCopy"
      class="opacity-0 group-hover:opacity-100 transition"
      size="icon"
      variant="ghost"
    >
      <Copy class="w-4 h-4" />
    </Button>
  </div>
</template>
