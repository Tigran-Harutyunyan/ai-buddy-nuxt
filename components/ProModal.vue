<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast/use-toast";
import { useMainStore } from "@/stores/main";

const { toast } = useToast();

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const { showProDialog } = storeToRefs(useMainStore());

const loading = ref(false);

const onSubscribe = async () => {
  try {
    loading.value = true;
    const response = await $fetch("/api/stripe", {
      method: "post",
    });

    if (response?.url) {
      window.location.href = response?.url;
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
  <Dialog v-model:open="showProDialog">
    <DialogContent>
      <DialogHeader class="space-y-4">
        <DialogTitle class="text-center"> Upgrade to Pro </DialogTitle>
        <DialogDescription class="text-center space-y-2">
          Create
          <span class="text-sky-500 mx-1 font-medium">Custom AI</span>
          Companions!
        </DialogDescription>
      </DialogHeader>
      <Separator />
      <div class="flex justify-between">
        <p class="text-2xl font-medium">
          $9<span class="text-sm font-normal">.99 / mo</span>
        </p>
        <Button @click="onSubscribe" :disabled="loading" variant="premium">
          {{ loading ? "Wait..." : "Subscribe" }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
