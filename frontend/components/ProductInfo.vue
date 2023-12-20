<template>
  <n-space vertical justify="space-around" size="large">
    <n-carousel
      v-if="props.product.imageUrls"
      effect="custom"
      :transition-props="{ name: 'creative' }"
      show-arrow
      style="width: 100%; height: 240px"
    >
      <img
        v-for="image in props.product.imageUrls"
        class="carousel-img"
        :src="image"
      />
    </n-carousel>
    <n-button
      v-if="props.product.url"
      @click.prevent="navigateTo(props.product.url, { external: true })"
      type="primary"
      style="width: 100%"
    >
      Buy it now
    </n-button>
    <n-card>
      <n-p>
        {{ props.product.description }}
      </n-p>
    </n-card>
    <!-- <n-h3>Reviews:</n-h3>
    <n-card v-for="review in reviews">
      <n-space justify="space-between">
        <n-ellipsis :line-clamp="1"> {{ review.username }} </n-ellipsis>
        <n-rate readonly :value="review.rate" :count="5" />
      </n-space>
      <n-p> {{ review.content }} </n-p>
    </n-card> -->
  </n-space>
</template>
<style scoped>
.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

:deep(.creative-enter-from),
:deep(.creative-leave-to) {
  opacity: 0;
  transform: scale(0.8);
}

:deep(.creative-enter-active),
:deep(.creative-leave-active) {
  transition: all 0.2s ease;
}
</style>
<script lang="ts" setup>
import type { Product } from "@/types/Product";
const props = defineProps<{
  product: Product;
}>();
</script>
