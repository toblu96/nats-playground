<template>
  <header class="bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex justify-between">
        <h1 class="text-lg font-semibold leading-6 text-gray-900">
          {{ title || "Page title" }}
        </h1>
        <slot name="header-content" />
      </div>
    </div>
  </header>
  <main>
    <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <slot />
    </div>
  </main>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
