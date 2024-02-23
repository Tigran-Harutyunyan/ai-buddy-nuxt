<script setup lang="ts">
import { type Companion } from "@prisma/client";
import { MessagesSquare } from "lucide-vue-next";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";

interface CompanionsProps {
  data: (Companion & {
    _count: {
      messages: number;
    };
  })[];
}

const { data } = defineProps<CompanionsProps>();
</script>

<template>
  <div
    v-if="data?.length === 0"
    class="pt-10 flex flex-col items-center justify-center space-y-3"
  >
    <div class="relative w-60 h-60">
      <NuxtImg fill class="grayscale" src="/images/empty.png" alt="Empty" />
    </div>
    <p class="text-sm text-muted-foreground">No companions found.</p>
  </div>

  <div
    v-if="data && data.length"
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10"
  >
    <Card
      v-for="item in data"
      :key="item.name"
      class="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
    >
      <NuxtLink :to="`/chat/${item.id}`">
        <CardHeader
          class="flex items-center justify-center text-center text-muted-foreground"
        >
          <div class="relative w-32 h-32">
            <NuxtImg
              :src="item.src"
              fill
              class="rounded-xl object-cover"
              alt="Character"
            />
          </div>
          <p class="font-bold">
            {{ item.name }}
          </p>
          <p class="text-xs">
            {{ item.description }}
          </p>
        </CardHeader>
        <CardFooter
          class="flex items-center justify-between text-xs text-muted-foreground"
        >
          <p class="lowercase">@{{ item.userName }}</p>
          <div class="flex items-center">
            <MessagesSquare class="w-3 h-3 mr-1" />
            {{ item._count.messages }}
          </div>
        </CardFooter>
      </NuxtLink>
    </Card>
  </div>
</template>
