<script setup lang="ts">
import { useClerkProvide } from "vue-clerk";
import CompanionForm from "@/components/companion/CompanionForm.vue";

const { derivedState } = useClerkProvide();

const router = useRouter();

const isAuth = computed(() => {
  return !!derivedState.value?.userId;
});

if (!isAuth) {
  router.push("/sign-in");
}

const { data: categories } = useLazyAsyncData("categories", () =>
  $fetch("/api/categories")
);

const companion = ref();

const { companionId } = useRoute().params;

const loadingCompanion = ref(true);

if (companionId !== "new") {
  const response = await $fetch(`/api/companion/${companionId[0]}`, {
    method: "GET",
  });

  loadingCompanion.value = false;

  if (response?.id) {
    companion.value = response;
  }
}

// const validSubscription = await $fetch("/api/subscription/check", {
//   method: "get",
// });

// if (!validSubscription) {
//   router.push("/");
// }
</script>

<template>
  <CompanionForm :initialData="companion" :categories="categories" />
</template>
