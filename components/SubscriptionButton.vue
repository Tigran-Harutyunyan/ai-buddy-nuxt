<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";
import { Sparkles } from "lucide-vue-next";

const { toast } = useToast();

const loading = ref(false);

const { isPro } = defineProps<{
  isPro: boolean;
}>();

const onClick = async () => {
  try {
    loading.value = true;

    const response = await $fetch("/api/stripe", {
      method: "POST",
    });

    if (response?.url) {
      window.location.href = response.url;
    }
  } catch (error) {
    toast({
      description: "Something went wrong",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Button
    size="sm"
    :variant="isPro ? 'default' : 'premium'"
    :disabled="loading"
    @click="onClick"
  >
    {{ isPro ? "Manage Subscription" : "Upgrade" }}
    <Sparkles v-if="!isPro" class="w-4 h-4 ml-2 fill-white" />
  </Button>
</template>
