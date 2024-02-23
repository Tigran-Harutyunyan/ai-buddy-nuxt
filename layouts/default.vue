<script setup lang="ts">
import { ClerkLoaded, ClerkLoading } from "vue-clerk";
import Loading from "~/components/Loading.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
useHead({
  bodyAttrs: {
    class: "bg-secondary",
  },
});
</script>
<template>
  <ClerkLoading> </ClerkLoading>
  <ClerkLoaded>
    <div class="h-full">
      <Navbar />
      <div
        class="hidden md:flex mt-16 h-full w-20 flex-col fixed inset-y-0 mx-2.5"
      >
        <Sidebar />
      </div>
      <main class="md:pl-20 pt-16 h-full">
        <slot />
      </main>
    </div>
  </ClerkLoaded>
</template>
