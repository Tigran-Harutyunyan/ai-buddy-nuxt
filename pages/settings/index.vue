<script setup lang="ts">
definePageMeta({ middleware: "auth" });
const { isPro } = inject("isPro");
</script>

<template>
  <div class="h-full p-4 space-y-2">
    <h3 class="text-lg font-medium">Settings</h3>
    <div class="text-muted-foreground text-sm">
      {{
        isPro
          ? "You are currently on a Pro plan."
          : "You are currently on a free plan."
      }}
    </div>
    <SubscriptionButton :isPro="isPro" />
  </div>
</template>
