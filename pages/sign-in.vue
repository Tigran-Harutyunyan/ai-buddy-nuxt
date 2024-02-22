<script setup lang="ts">
import { SignIn } from "vue-clerk";

definePageMeta({
  middleware: ["public"],
  title: "ai buddy | Sign-in",
  layout: "auth",
});
</script>

<template>
  <div class="grid h-full place-items-center">
    <SignIn sign-up-url="/sign-up" />
  </div>
</template>
