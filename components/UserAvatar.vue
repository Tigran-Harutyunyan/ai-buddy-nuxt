<script setup lang="ts">
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useClerkProvide } from "vue-clerk";
const { state } = useClerkProvide();
</script>

<template>
  <Avatar class="h-12 w-12">
    <AvatarImage :src="state?.user?.imageUrl" />
  </Avatar>
</template>
