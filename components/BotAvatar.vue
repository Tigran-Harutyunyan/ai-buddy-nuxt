<script setup lang="ts">
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface BotAvatarProps {
  src: string;
}

const { src } = defineProps<BotAvatarProps>();
</script>

<template>
  <Avatar class="h-12 w-12">
    <AvatarImage :src="src" />
  </Avatar>
</template>
