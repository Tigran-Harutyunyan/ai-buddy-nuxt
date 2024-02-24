<script setup lang="ts">
import { Avatar, AvatarImage } from "@/components/ui/avatar";
</script>

<template>
  <Avatar class="h-12 w-12">
    <AvatarImage :src="user?.imageUrl" />
  </Avatar>
</template>
