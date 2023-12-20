<template>
  <naive-config>
    <n-config-provider>
      <n-dialog-provider>
        <n-message-provider>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </n-message-provider>
      </n-dialog-provider>
    </n-config-provider>
  </naive-config>
</template>
<script setup lang="ts">
import { useNaiveColorMode } from "#imports";
const { colorModePreference } = useNaiveColorMode();
</script>
