<script setup lang="ts">
definePageMeta({ middleware: "auth" });

import qs from "query-string";

const { data: categories } = useLazyAsyncData("categories", () =>
  $fetch("/api/categories")
);

const getUrl = () => {
  return qs.stringifyUrl(
    {
      url: "/api/companions",
      query: useRoute().query,
    },
    { skipNull: true, skipEmptyString: true }
  );
};

const { data: companions, refresh } = useLazyAsyncData("companions", () =>
  $fetch(getUrl())
);

const data = ref(companions);

watch(
  () => useRoute().query,
  () => {
    refresh();
  }
);
</script>
<template>
  <div class="h-full p-4 space-y-2">
    <SearchInput />
    <Categories :data="categories" />
    <Companions :data="data" />
  </div>
</template>
