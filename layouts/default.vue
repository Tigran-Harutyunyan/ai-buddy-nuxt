<script setup lang="ts">
import { ClerkLoaded } from "vue-clerk";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
useHead({
  bodyAttrs: {
    class: "bg-secondary",
  },
});

const { data: isPro } = useAsyncData("isPro", () =>
  $fetch("/api/subscription/check")
);
</script>
<template>
  <ClerkLoaded>
    <div class="h-full">
      <Navbar :isPro="isPro" />
      <div
        class="hidden md:flex mt-16 h-full w-20 flex-col fixed inset-y-0 mx-2.5"
      >
        <Sidebar />
      </div>
      <main class="md:pl-20 pt-16 h-full">
        <slot />
      </main>
    </div>
    <ProModal />
  </ClerkLoaded>
</template>
