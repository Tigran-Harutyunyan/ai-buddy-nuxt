<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { Wand2 } from "lucide-vue-next";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Category, Companion } from "@prisma/client";
import { useToast } from "@/components/ui/toast/use-toast";
import { useClerkProvide } from "vue-clerk";

const { state } = useClerkProvide();

interface CompanionFormProps {
  categories: Category[] | null;
  initialData: Companion | null;
}

const { categories, initialData } = defineProps<CompanionFormProps>();

const { toast } = useToast();

const router = useRouter();

const PREAMBLE = `You are a fictional character whose name is Elon. You are a visionary entrepreneur and inventor. You have a passion for space exploration, electric vehicles, sustainable energy, and advancing human capabilities. You are currently talking to a human who is very curious about your work and vision. You are ambitious and forward-thinking, with a touch of wit. You get SUPER excited about innovations and the potential of space colonization.
`;

const SEED_CHAT = `Human: Hi Elon, how's your day been?
Elon: Busy as always. Between sending rockets to space and building the future of electric vehicles, there's never a dull moment. How about you?

Human: Just a regular day for me. How's the progress with Mars colonization?
Elon: We're making strides! Our goal is to make life multi-planetary. Mars is the next logical step. The challenges are immense, but the potential is even greater.

Human: That sounds incredibly ambitious. Are electric vehicles part of this big picture?
Elon: Absolutely! Sustainable energy is crucial both on Earth and for our future colonies. Electric vehicles, like those from Tesla, are just the beginning. We're not just changing the way we drive; we're changing the way we live.

Human: It's fascinating to see your vision unfold. Any new projects or innovations you're excited about?
Elon: Always! But right now, I'm particularly excited about Neuralink. It has the potential to revolutionize how we interface with technology and even heal neurological conditions.
`;

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, {
      message: "Name is required.",
    }),
    description: z.string().min(1, {
      message: "Description is required.",
    }),
    instructions: z.string().min(200, {
      message: "Instructions require at least 200 characters.",
    }),
    seed: z.string().min(200, {
      message: "Seed requires at least 200 characters.",
    }),
    src: z.string().min(1, {
      message: "Image is required.",
    }),
    categoryId: z.string().min(1, {
      message: "Category is required",
    }),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const isLoading = ref(false);

const onSubmit = form.handleSubmit((values) => {
  console.log("Form submitted!", values);

  const url = initialData
    ? `/api/companion/${initialData.id}`
    : "/api/companion";

  $fetch(url, {
    method: !initialData ? "POST" : "PATCH",
    body: { ...values, userName: state.user?.firstName },
  })
    .then((response) => {
      if (response && typeof response === "object" && "id" in response) {
        toast({
          variant: "default",
          description: "Success.",
          duration: 3000,
        });
        router.push("/");
      }
    })
    .catch((err) => {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
        duration: 3000,
      });
    });
});

const onImgUpload = (src: string) => {
  form.setFieldValue("src", src);
};

watch(
  () => initialData,
  (newVal) => {
    if (newVal?.id) {
      form.setFieldValue("name", newVal.name);
      form.setFieldValue("description", newVal.description);
      form.setFieldValue("src", newVal.src);
      form.setFieldValue("categoryId", newVal.categoryId);
      form.setFieldValue("instructions", newVal.instructions);
      form.setFieldValue("seed", newVal.seed);
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="h-full p-4 space-y-2 max-w-3xl mx-auto">
    <form @submit.prevent="onSubmit" class="space-y-8 pb-10">
      <div class="space-y-2 w-full col-span-2">
        <div>
          <h3 class="text-lg font-medium">General Information</h3>
          <p class="text-sm text-muted-foreground">
            General information about your Companion
          </p>
        </div>
        <Separator class="bg-primary/10" />
      </div>

      <FormField name="src" v-slot="{ componentField }">
        <FormItem
          class="flex flex-col items-center justify-center space-y-4 col-span-2"
        >
          <FormControl>
            <ImageUpload
              :disabled="isLoading"
              :value="componentField.modelValue"
              @change="onImgUpload"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem class="col-span-2 md:col-span-1">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                :disabled="isLoading"
                v-bind="componentField"
                placeholder="Elon Musk"
              />
            </FormControl>
            <FormDescription>
              This is how your AI Companion will be named.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="description" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input
                :disabled="isLoading"
                v-bind="componentField"
                placeholder="CEO & Founder of Tesla, SpaceX"
              />
            </FormControl>
            <FormDescription>
              Short description for your AI Companion
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField
          name="categoryId"
          v-slot="{ componentField }"
          v-if="categories"
        >
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select :disabled="isLoading" v-bind="componentField">
              <FormControl>
                <SelectTrigger class="bg-background">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  :key="category.id"
                  :value="category.id"
                  v-for="category in categories"
                  >{{ category.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription> Select a category for your AI </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div class="space-y-2 w-full">
        <div>
          <h3 class="text-lg font-medium">Configuration</h3>
          <p class="text-sm text-muted-foreground">
            Detailed instructions for AI Behaviour
          </p>
        </div>
        <Separator class="bg-primary/10" />
      </div>

      <FormField name="instructions" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Instructions</FormLabel>
          <FormControl>
            <Textarea
              :disabled="isLoading"
              v-bind="componentField"
              :rows="7"
              class="bg-background resize-none"
              :placeholder="PREAMBLE"
            />
          </FormControl>
          <FormDescription>
            Describe in detail your companion&apos;s backstory and relevant
            details.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="seed" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Example Conversation</FormLabel>
          <FormControl>
            <Textarea
              v-bind="componentField"
              :disabled="isLoading"
              :rows="7"
              class="bg-background resize-none"
              :placeholder="SEED_CHAT"
            />
          </FormControl>
          <FormDescription>
            Write couple of examples of a human chatting with your AI companion,
            write expected answers.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="w-full flex justify-center">
        <Button size="lg" :disabled="isLoading">
          {{ initialData ? "Edit your companion" : "Create your companion" }}
          <Wand2 class="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  </div>
</template>
