<script setup lang="ts">
import qs from "query-string";
import { Search } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { useDebounceFn } from "@vueuse/core";

const emit = defineEmits(["change"]);

const name = ref("");
const route = useRoute();
const router = useRouter();

const search = () => {
  const query = {
    name: name.value,
    categoryId: useRoute().query?.categoryId,
  };

  const url = qs.stringifyUrl(
    {
      url: "/",
      query,
    },
    { skipNull: true, skipEmptyString: true }
  );

  router.push(url);

  emit("change");
};

const debounceInput = useDebounceFn(
  (e) => {
    name.value = e.target.value;
    search();
  },
  400,
  { maxWait: 5000 }
);

onMounted(() => {
  name.value = route.query?.name as string;
});
watch(
  () => route.query,
  () => {
    if (!route.query?.name && name.value) {
      name.value = "";
    }
  }
);
</script>

<template>
  <div class="relative">
    <Search class="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
    <Input
      placeholder="Search..."
      class="pl-10 bg-primary/10"
      v-model="name"
      @input="(e) => debounceInput(e)"
    />
  </div>
</template>
