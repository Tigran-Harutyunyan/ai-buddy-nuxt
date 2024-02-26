<script setup lang="ts">
definePageMeta({ middleware: "auth" });

useHead({
  title: "Companion AI ",
});

import { useClerkProvide } from "vue-clerk";
import CompanionForm from "@/components/companion/CompanionForm.vue";
import { useMainStore } from "@/stores/main";

const { setProModal } = useMainStore();

const { derivedState } = useClerkProvide();

const router = useRouter();

const { companionId } = useRoute().params;

const isAuth = computed(() => {
  return !!derivedState.value?.userId;
});

if (!isAuth) {
  router.push("/sign-in");
}

const isPro = await $fetch("/api/subscription/check", {
  method: "get",
});

if (!isPro && companionId !== "new") {
  router.push("/");
  setTimeout(() => {
    setProModal(true);
  }, 300);
}

const { data: categories } = useLazyAsyncData("categories", () =>
  $fetch("/api/categories")
);

const companion = ref();

const loadingCompanion = ref(true);

if (companionId !== "new") {
  const response = await $fetch(`/api/companion/${companionId[0]}`, {
    method: "GET",
  });

  loadingCompanion.value = false;

  if (response && typeof response === "object" && "id" in response) {
    companion.value = response;
  }
}
</script>

<template>
  <CompanionForm :initialData="companion" :categories="categories" />
</template>
