<script setup lang="ts">
import { SignUp } from "vue-clerk";
definePageMeta({
  layout: "auth",
  middleware: ["public"],
  title: "Taskify | Sign-up",
});
</script>

<template>
  <div class="grid h-full place-items-center">
    <SignUp sign-in-url="/sign-in" />
  </div>
</template>
