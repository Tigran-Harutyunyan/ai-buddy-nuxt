<script setup lang="ts">
import { cn } from "@/lib/utils";
import { Home, Plus, Settings } from "lucide-vue-next";
import { useMainStore } from "@/stores/main";

const { setProModal } = useMainStore();

interface SidebarProps {
  isPro?: boolean;
}

const router = useRouter();

const routes = [
  {
    icon: Home,
    href: "/",
    label: "Home",
    pro: false,
  },
  {
    icon: Plus,
    href: "/companion/new",
    label: "Create",
    pro: true,
  },
  {
    icon: Settings,
    href: "/settings",
    label: "Settings",
    pro: false,
  },
];
const onNavigate = (url: string, pro: boolean) => {
  if (pro && !isPro) {
    setProModal(true);
    return;
  }

  return router.push(url);
};
const { isPro } = defineProps<SidebarProps>();

const currentRoute = useRoute();
</script>

<template>
  <div class="space-y-4 flex flex-col h-full text-primary bg-secondary mt-1.5">
    <div class="p-3 flex-1 flex justify-center">
      <div class="space-y-2">
        <div
          v-for="route in routes"
          @click="onNavigate(route.href, route.pro)"
          :key="route.href"
          :class="
            cn(
              'text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
              currentRoute.path === route.href && 'bg-primary/10 text-primary'
            )
          "
        >
          <div class="flex flex-col gap-y-2 items-center flex-1">
            <component :is="route.icon" class="h-5 w-5" />
            {{ route.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
