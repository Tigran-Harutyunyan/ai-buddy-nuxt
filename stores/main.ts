import { defineStore } from "pinia";

export const useMainStore = defineStore("main", () => {
  const chatEventTrigger = ref(0);
  const showProDialog = ref(false);

  function updateEventTrigger() {
    chatEventTrigger.value++;
  }

  function setProModal(isOpen: boolean) {
    showProDialog.value = isOpen;
  }

  return {
    showProDialog,
    chatEventTrigger,
    updateEventTrigger,
    setProModal
  };
});
