<script setup lang="ts">
import qs from "query-string";
import { cn } from "@/lib/utils";
import { type Category } from "@prisma/client";

interface CategoriesProps {
  data: Category[] | null;
}

const { data } = defineProps<CategoriesProps>();

const router = useRouter();
const route = useRoute();

const onClick = async (id: string | undefined) => {
  const query = { categoryId: id };

  router.push({ path: "/", query });
};
</script>

<template>
  <div class="w-full overflow-x-auto space-x-2 flex p-1">
    <button
      @click="onClick(undefined)"
      :class="
        cn(
          `
          flex 
          items-center 
          text-center 
          text-xs 
          md:text-sm 
          px-2 
          md:px-4 
          py-2 
          md:py-3 
          rounded-md 
          bg-primary/10 
          hover:opacity-75 
          transition
        `,
          !route.query.categoryId ? 'bg-primary/25' : 'bg-primary/10'
        )
      "
    >
      Newest
    </button>
    <template v-if="data">
      <button
        v-for="item in data"
        @click="onClick(item.id)"
        :class="
          cn(
            `
            flex 
            items-center 
            text-center 
            text-xs 
            md:text-sm 
            px-2 
            md:px-4 
            py-2 
            md:py-3 
            rounded-md 
            bg-primary/10 
            hover:opacity-75 
            transition
          `,
            item.id === route.query.categoryId
              ? 'bg-primary/25'
              : 'bg-primary/10'
          )
        "
        key="item.id"
      >
        {{ item.name }}
      </button>
    </template>
  </div>
</template>
