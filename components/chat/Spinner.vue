<script setup lang="ts">
const { color } = defineProps<{
  color: string;
}>();

const rgbaColor = computed(() => {
  return color === "dark"
    ? "rgba(fff, fff, fff, 0.2)"
    : "rgba(000, 000, 000, 0.2)";
});
</script>

<template>
  <div class="dot-flashing"></div>
</template>

<style scoped>
.dot-flashing {
  position: relative;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background-color: v-bind("color");
  color: v-bind("color");
  animation: dot-flashing 1s infinite linear alternate;
  animation-delay: 0.5s;
}
.dot-flashing::before,
.dot-flashing::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
}
.dot-flashing::before {
  left: -10px;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background-color: v-bind("color");
  color: v-bind("color");
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 0s;
}

.dot-flashing::after {
  left: 10px;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background-color: v-bind("color");
  color: v-bind("color");
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 1s;
}

/* .dark .dot-flashing::after,
.dark .dot-flashing::before {
  background-color: #fff;
  color: #fff;
} */

@keyframes dot-flashing {
  0% {
    background-color: v-bind("color");
  }
  50%,
  100% {
    background-color: v-bind("rgbaColor");
  }
}
</style>
