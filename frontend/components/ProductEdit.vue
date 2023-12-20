<template>
  <n-space vertical style="width: 100%">
    <n-form-item label="Product name" path="name">
      <n-input v-model:value="model.name" placeholder="Amazing product" />
    </n-form-item>
    <n-form-item label="Describe your product" path="description">
      <n-input
        v-model:value="model.description"
        placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        type="textarea"
      />
    </n-form-item>
    <n-form-item label="Product URL" path="url">
      <n-input v-model:value="model.url" />
    </n-form-item>

    <n-form-item label="Price" path="price">
      <n-input-number
        v-model:value="model.price"
        :default-value="0"
        :parse="parseCurrency"
        :format="formatCurrency"
      />
    </n-form-item>
    <n-form-item>
      <n-upload
        :action="`${config.backendUrl}/stores/${storeUuid}/items/${props.product.uuid}/images`"
        :default-file-list="previewFileList"
        list-type="image-card"
        name="images"
        accept="image/png,image/jpeg"
        response-type="json"
        :headers="{
          authorization: `Bearer ${useAuth().value.accessToken}`,
        }"
        @remove="deleteCover"
        :max="4"
      />
    </n-form-item>

    <n-space>
      <n-button type="primary" @click="updateProduct"> Update </n-button>
      <n-button @click="toggleModal"> Cancel </n-button>
    </n-space>
  </n-space>
</template>
<script lang="ts" setup>
import { formatCurrency, parseCurrency } from "@/util/currency";
import type { Product } from "@/types/Product";
import { useAuth } from "@/util/useAuth";

const props = defineProps<{
  product: Product;
  toggleModal: () => void;
}>();
props.product.price = props.product.price;
const config = useRuntimeConfig().public;
const storeUuid = useRoute().params.uuid;
const message = useMessage();
const model = ref<Product>({ ...props.product });
const previewFileList = ref<UploadFileInfo[]>(
  props.product.imageUrls.map((url, index) => ({
    id: index,
    url: url,
    status: "finished",
  })),
);
model.value.price = model.value.price / 100;
async function updateProduct() {
  const auth = useAuth();

  try {
    await $fetch<Product>(
      `${config.backendUrl}/stores/${storeUuid}/items/${props.product.uuid}`,
      {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${auth.value.accessToken}`,
        },
        body: {
          name: model.value.name,
          description: model.value.description,
          price: model?.value.price * 100,
          url: model.value.url,
        },
      },
    );
    props.toggleModal();
  } catch (e: any) {
    message.error(e.data.message);
  }
}

async function deleteCover({ file }: UploadFileInfo) {
  const auth = useAuth();
  if (file.status === "error") {
    return true;
  }
  try {
    await $fetch<Product>(
      `${config.backendUrl}/stores/${storeUuid}/items/${props.product.uuid}/images/${file.id}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${auth.value.accessToken}`,
        },
      },
    );
    return true;
  } catch (e: any) {
    message.error(e.data.message);
    return false;
  }
}
</script>
