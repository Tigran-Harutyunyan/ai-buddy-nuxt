<script setup lang="ts">
interface ImageUploadProps {
  value: string | undefined;
  disabled?: boolean;
}

const { value, disabled } = defineProps<ImageUploadProps>();

const emit = defineEmits(["change"]);

const uploadTest = ref("uw-test");

interface SuccessResponse {
  value: {
    event: "success";
    info: {
      secure_url: string;
    };
  };
}

interface ErrorResponse {
  value: {
    event: "error";
    error: {
      message: string;
    };
  };
}

type Response = SuccessResponse | ErrorResponse;

const handleUpload = (res: Response) => {
  if (res.value.event === "success") {
    emit("change", res.value?.info?.secure_url);
  }
};
</script>

<template>
  <div class="space-y-4 w-full flex flex-col justify-center items-center">
    <CldUploadWidget
      v-slot="{ open }"
      :uploadPreset="uploadTest"
      :options="{ maxFiles: 1 }"
      @upload="handleUpload"
    >
      <div
        class="p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center"
      >
        <div class="relative h-40 w-40">
          <NuxtImg
            fill
            alt="Upload"
            :src="value || '/images/placeholder.svg'"
            class="rounded-lg object-cover"
            @click="open"
          />
        </div>
      </div>
    </CldUploadWidget>
  </div>
</template>
