<script setup lang="ts">
import { SendHorizonal } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMainStore } from "@/stores/main";

const { updateEventTrigger } = useMainStore();

const emit = defineEmits(["submit"]);

const model = defineModel<{
  model: string;
}>();

interface ChatFormProps {
  isLoading: boolean | undefined;
}

const { isLoading } = defineProps<ChatFormProps>();

const onSubmit = (e) => {
  emit("submit", e);

  setTimeout(() => {
    updateEventTrigger();
  }, 400);
};
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="border-t border-primary/10 py-4 flex items-center gap-x-2"
  >
    <Input
      :disabled="isLoading"
      v-model="model"
      placeholder="Type a message"
      class="rounded-lg bg-primary/10"
    />
    <Button :disabled="isLoading" variant="ghost">
      <SendHorizonal class="w-6 h-6" />
    </Button>
  </form>
</template>
