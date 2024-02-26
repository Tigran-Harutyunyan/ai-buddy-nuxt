<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const companion = ref();

const router = useRouter();

const { chatId } = useRoute().params;

if (!chatId) {
  router.push("/");
}

const response = await $fetch(`/api/companion/chat/${chatId}`, {
  method: "GET",
});

if (response && typeof response === "object" && "id" in response) {
  companion.value = response;
}
</script>

<template>
  <div class="mx-auto max-w-4xl h-full w-full">
    <ChatClient :companion="companion" />
  </div>
</template>
