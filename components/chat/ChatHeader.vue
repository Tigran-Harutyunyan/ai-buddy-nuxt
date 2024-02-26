<script setup lang="ts">
import type { Companion, Message } from "@prisma/client";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  ChevronLeft,
  Edit,
  MessagesSquare,
  MoreVertical,
  Trash,
} from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { useClerkProvide } from "vue-clerk";

const { state } = useClerkProvide();

interface ChatHeaderProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

const { companion } = defineProps<ChatHeaderProps>();

const { toast } = useToast();

const router = useRouter();

const onDelete = async () => {
  try {
    await $fetch(`/api/companion/${companion.id}`, {
      method: "DELETE",
    });
    toast({
      description: "Success.",
      duration: 3000,
    });
    router.push("/");
  } catch (error) {
    toast({
      variant: "destructive",
      description: "Something went wrong.",
      duration: 3000,
    });
  }
};
</script>

<template>
  <div
    class="flex w-full justify-between items-center border-b border-primary/10 pb-4"
  >
    <div class="flex gap-x-2 items-center">
      <Button @click="router.go(-1)" size="icon" variant="ghost">
        <ChevronLeft class="h-8 w-8" />
      </Button>

      <BotAvatar :src="companion.src" />

      <div class="flex flex-col gap-y-1">
        <div class="flex items-center gap-x-2">
          <p class="font-bold">{{ companion.name }}</p>
          <div class="flex items-center text-xs text-muted-foreground">
            <MessagesSquare class="w-3 h-3 mr-1" />
            {{ companion._count.messages }}
          </div>
        </div>
        <p class="text-xs text-muted-foreground">
          Created by {{ companion.userName }}
        </p>
      </div>
    </div>

    <DropdownMenu v-if="state.user?.id === companion.userId">
      <DropdownMenuTrigger as-child>
        <Button variant="secondary" size="icon">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          @click="() => router.push(`/companion/${companion.id}`)"
        >
          <Edit class="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem @click="onDelete">
          <Trash class="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
