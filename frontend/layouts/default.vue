<template>
  <div class="full-page-container">
    <naive-navbar>
      <template #start>
        <n-a href="/dashboard"> Dashboard </n-a>
        <n-text type="info">{{ payload.email }}</n-text>
      </template>
      <template #end>
        <n-space>
          <n-button tertiary type="error" @click.prevent="logOut">
            Log out</n-button
          >
        </n-space>
      </template>
    </naive-navbar>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { useAuth } from "@/util/useAuth";
import { checkIfLoggedIn } from "@/util/checkIfLoggedIn";
import { jwtDecode } from "jwt-decode";
import type { Payload } from "@/util/Payload";
const auth = useAuth();
const loggedIn = await checkIfLoggedIn();
async function logOut() {
  auth.value = null;
  await navigateTo("/");
}
if (!loggedIn) {
  await navigateTo("/?show=true");
}

const payload = jwtDecode<Payload>(auth.value.accessToken);
</script>
<style scoped>
.full-page-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
