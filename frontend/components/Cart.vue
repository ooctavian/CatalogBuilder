<template>
  <n-table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Quantiy</th>
        <th>Total price</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="[item, quantity] in cartItems">
        <td>{{ item.name }}</td>
        <td>
          <n-space :wrap="false">
            <n-button
              strong
              tertiary
              size="small"
              type="error"
              @click="decrease(item)"
              >-</n-button
            >
            <n-space vertical align="center"> {{ quantity }}</n-space>
            <n-button
              strong
              tertiary
              size="small"
              type="success"
              @click="increase(item)"
              >+</n-button
            >
          </n-space>
        </td>
        <td>${{ ((item.price * quantity) / 100).toFixed(2) }}</td>
        <td>
          <n-button
            strong
            tertiary
            size="small"
            type="error"
            @click="remove(item)"
          >
            <n-icon>
              <X />
            </n-icon>
          </n-button>
        </td>
      </tr>
    </tbody>
  </n-table>
</template>

<script lang="ts" setup>
import type { Product } from "@/types/Product";
import { NButton } from "naive-ui";
import { X } from "@vicons/tabler";
const props = defineProps<{
  cartItems: Map<Product, number>;
}>();

const cartItems = props.cartItems;

function increase(product: Product) {
  let currentQuantity = cartItems.get(product) || 0;
  cartItems.set(product, currentQuantity + 1);
}

function decrease(product: Product) {
  let currentQuantity = cartItems.get(product) || 0;
  if (currentQuantity == 0) {
    return;
  }
  cartItems.set(product, currentQuantity - 1);
}

function remove(product: Product) {
  cartItems.delete(product);
}
</script>
<style scoped>
:deep(.center) {
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.spacing) {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
