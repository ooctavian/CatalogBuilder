<style scoped>
.store-cover {
  width: 100vw;
  height: 30vh;
  object-fit: cover;
}
.page-padding {
  padding: 30px 80px;
  max-width: 100%;
}
.container {
  padding: 0 30px 30px 30px;
  display: grid;
  align-items: center;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  padding: 40px;
  gap: 20px;
  grid-auto-rows: 1fr;
  overflow: hidden;
}
.store-item {
  max-width: 300px;
}
.fixed-element {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.product-cover {
  height: 300px;
  object-fit: cover;
}
</style>
<template>
  <n-drawer v-model:show="show" width="480" placement="right">
    <n-drawer-content v-if="currentProduct" closable>
      <template #header>{{ currentProduct.name }}</template>
      <ProductInfo :product="currentProduct" />
    </n-drawer-content>
  </n-drawer>
  <div>
    <img
      v-if="store?.coverUrl"
      :src="store?.coverUrl"
      alt="image cover"
      class="store-cover"
    />
    <n-space vertical class="page-padding" :size="20">
      <n-space justify="center" vertical>
        <n-space justify="center">
          <n-ellipsis
            :line-clamp="3"
            style="word-wrap: break-word; word-break: break-all"
          >
            <n-h1>{{ store?.name }}</n-h1>
          </n-ellipsis>
        </n-space>
        <n-card>
          <n-p style="text-align: center">{{ store?.description }}</n-p>
        </n-card>
      </n-space>
      <div class="container">
        <n-card
          v-for="product in products"
          class="store-item"
          :title="product.name"
          @click="
            currentProduct = product;
            show = true;
          "
        >
          <template #header-extra>
            ${{ (product.price / 100).toFixed(2) }}
          </template>
          <template #cover>
            <img
              v-if="product.imageUrls"
              :src="product.imageUrls[0]"
              class="product-cover"
            />
          </template>
        </n-card>
      </div>
    </n-space>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { Product } from "@/types/Product";
import type { Store } from "@/types/Store";
import ProductInfo from "@/components/ProductInfo.vue";

definePageMeta({
  layout: "public",
});

const message = useMessage();
const uuid = useRoute().params.uuid;
const config = useRuntimeConfig().public;

const { data: store, error } = await useFetch<Store>(
  `${config.backendUrl}/stores/${uuid}`,
);

if (error.value?.data) {
  message.error(error.value?.message);
}

if (!store.value) {
  store.value = {
    name: "",
    description: "",
  };
}
const { data: products, error: error2 } = await useFetch<Product[]>(
  `${config.backendUrl}/stores/${uuid}/items`,
);
if (error2.value?.data) {
  message.error(error2.value?.message);
}

const currentProduct: Ref<Product | null> = ref(null);
const show = ref(false);
</script>
