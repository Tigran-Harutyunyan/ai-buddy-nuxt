<script setup lang="ts">
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-vue-next";
import Sidebar from "@/components/Sidebar.vue";

const { data: isPro } = useNuxtData("isPro");
</script>

<template>
  <Sheet>
    <SheetTrigger class="md:hidden pr-4">
      <Menu />
    </SheetTrigger>
    <SheetContent side="left" class="p-0 bg-secondary pt-10 w-32">
      <Sidebar :isPro="isPro" />
    </SheetContent>
  </Sheet>
</template>
