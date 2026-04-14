<script setup lang="ts">
import { GalleryVerticalEnd } from "lucide-vue-next"

import OTPForm from "@/transcript/components/OTPForm.vue"
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-6 p-6 bg-muted min-h-svh md:p-10">
    <div class="flex flex-col w-full max-w-xs gap-6">
      <a href="#" class="flex items-center self-center gap-2 font-medium">
        <div class="flex items-center justify-center rounded-md bg-primary text-primary-foreground size-6">
          <GalleryVerticalEnd class="size-4" />
        </div>
        PLN Icon Plus
      </a>
      <OTPForm />
    </div>
  </div>
</template>
