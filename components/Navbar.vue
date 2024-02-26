<script setup lang="ts">
import { Sparkles } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { UserButton } from "vue-clerk";
import ModeToggle from "@/components/ModeToggle.vue";
import MobileSidebar from "@/components/MobileSidebar.vue";
import { useMainStore } from "@/stores/main";

interface NavbarProps {
  isPro?: boolean | null;
}

const { isPro } = defineProps<NavbarProps>();

const { setProModal } = useMainStore();
</script>

<template>
  <div
    class="fixed w-full z-50 flex justify-between items-center py-2 px-4 h-16 border-b border-primary/10 bg-secondary"
  >
    <div class="flex items-center">
      <MobileSidebar />
      <NuxtLink to="/">
        <h1
          class="hidden md:block text-xl md:text-3xl font-bold text-primary font-poppins"
        >
          companion.ai
        </h1>
      </NuxtLink>
    </div>
    <div class="flex items-center gap-x-3">
      <Button
        v-if="isPro !== null && isPro === false"
        @click="setProModal"
        size="sm"
        variant="premium"
      >
        Upgrade
        <Sparkles class="h-4 w-4 fill-white text-white ml-2" />
      </Button>
      <ModeToggle />
      <UserButton after-sign-out-url="/" />
    </div>
  </div>
</template>
