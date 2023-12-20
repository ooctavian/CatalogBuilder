<template>
  <n-layout has-sider style="flex: 1 1 auto">
    <n-layout-sider bordered content-style="padding: 24px;">
      <n-space vertical justify="space-around" size="large">
        <n-descriptions
          v-if="store"
          label-placement="top"
          bordered
          :column="1"
          style="width: 100%"
        >
          <n-descriptions-item>
            <template #label> Store name </template>
            <EditText
              :text="store.name"
              :onExit="(name: string) => updateStore({ name })"
            />
          </n-descriptions-item>
          <n-descriptions-item label="Description">
            <EditText
              :text="store.description"
              :onExit="(description: string) => updateStore({ description })"
            />
          </n-descriptions-item>
          <n-descriptions-item label="Link">
            <n-a :href="'/' + store.uuid">{{ store.uuid }}</n-a>
          </n-descriptions-item>
          <n-descriptions-item label="QR Code">
            <n-space style="width: 100%" justify="center">
              <VueQrcode
                id="qrcode"
                tag="svg"
                :value="`${config.frontendUrl}/${store.uuid}`"
                :options="{ width: 3000 }"
                style="width: 200px; height: 200px"
                type="image/png"
              />
            </n-space>
            <n-space justify="center">
              <n-button
                id="downloadButton"
                tag="a"
                :href="qrcodeLink"
                @click="downloadQrcode"
              >
                Download
              </n-button>
            </n-space>
          </n-descriptions-item>
          <n-descriptions-item label="Cover">
            <img :src="store.coverUrl" style="width: 100%" />
            <n-space justify="center">
              <n-upload
                ref="uploadRef"
                :max="1"
                action=""
                accept="image/png,image/jpeg"
                @change="changeCover"
              >
                <n-button>Change cover</n-button>
              </n-upload>
            </n-space>
          </n-descriptions-item>
        </n-descriptions>
      </n-space>
    </n-layout-sider>
    <n-layout>
      <n-layout-content embeded>
        <n-card>
          <n-empty description="Your customers await your next hit product">
            <template #icon>
              <n-icon>
                <BrowserPlus />
              </n-icon>
            </template>
            <template #extra>
              <n-button size="small" @click="showCreateModal = true">
                Add a new item
              </n-button>
            </template>
          </n-empty>
        </n-card>
        <n-modal
          v-model:show="showCreateModal"
          preset="card"
          title="Add a new item"
          size="huge"
          style="max-width: 600px"
        >
          <n-form
            ref="formRef"
            inline
            :label-width="80"
            :model="model"
            @submit.prevent="createProduct"
          >
            <n-space vertical style="width: 100%">
              <n-form-item label="Product name" path="name">
                <n-input
                  v-model:value="model.name"
                  placeholder="Amazing product"
                />
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
              <n-form-item
                label="Upload images of your product"
                path="uploadValue"
              >
                <n-upload
                  list-type="image-card"
                  accept="image/png,image/jpeg"
                  :max="4"
                  @change="
                    ({ fileList }) =>
                      (productImages = fileList.map(
                        (fileInfo) => fileInfo.file,
                      ))
                  "
                >
                </n-upload>
              </n-form-item>
            </n-space>
          </n-form>
          <template #footer>
            <n-space>
              <n-button @click.prevent="createProduct" type="primary">
                Create
              </n-button>
              <n-button @click="showCreateModal = false"> Cancel </n-button>
            </n-space>
          </template>
        </n-modal>
        <n-modal
          v-model:show="showEditModal"
          preset="card"
          title="Edit Product"
          size="huge"
          style="max-width: 600px"
        >
          <ProductEdit
            :product="currentProduct"
            :toggleModal="
              () => {
                showEditModal = !showEditModal;
              }
            "
          />
        </n-modal>
        <n-table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products">
              <td>{{ index + 1 }}</td>
              <td>
                <n-ellipsis
                  :line-clamp="2"
                  style="word-wrap: break-word; word-break: break-all"
                  expand-trigger="click"
                >
                  {{ product.name }}
                </n-ellipsis>
              </td>
              <td>
                <n-ellipsis
                  :line-clamp="2"
                  style="word-wrap: break-word; word-break: break-all"
                  expand-trigger="click"
                >
                  {{ product.description }}
                </n-ellipsis>
              </td>
              <td>{{ format(product.price) }}</td>
              <td>
                <n-space>
                  <n-button
                    secondary
                    type="info"
                    @click="
                      showEditModal = true;
                      currentProduct = product;
                    "
                  >
                    <n-icon>
                      <Edit />
                    </n-icon>
                  </n-button>
                  <n-button
                    secondary
                    type="error"
                    @click.prevent="
                      deleteProduct(storeUuid, product.uuid, index)
                    "
                  >
                    <n-icon>
                      <X />
                    </n-icon>
                  </n-button>
                </n-space>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
<script lang="ts" setup>
import { BrowserPlus, X, Edit } from "@vicons/tabler";
import EditText from "@/components/EditText";
import ProductEdit from "@/components/ProductEdit";
import type { Store } from "@/types/Store";
import type { Product, CreateProduct } from "@/types/Product";
import { useAuth } from "@/util/useAuth";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { format, formatCurrency, parseCurrency } from "@/util/currency";

const model = ref<CreateProduct>({
  name: "",
  description: "",
  url: undefined,
  price: 0,
});

const uploadRef = ref<UploadInst | null>(null);
const currentProduct = ref<Product | null>(null);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const storeUuid = useRoute().params.uuid;
const productImages: Ref<Array<File | null>> = ref([]);
const message = useMessage();
const formRef = ref(null);
const qrcodeLink = ref(null);
const config = useRuntimeConfig().public;

const { data: store, error } = await useFetch<Store>(
  `${config.backendUrl}/stores/${storeUuid}`,
);
if (error.value?.data) {
  message.error(error.value?.message);
}
const { data: products, error: error2 } = await useFetch<Product[]>(
  `${config.backendUrl}/stores/${storeUuid}/items`,
);
if (error2.value?.data) {
  message.error(error2.value?.message);
}

async function createProduct() {
  const auth = useAuth();
  try {
    const product = await $fetch<Product>(
      `${config.backendUrl}/stores/${storeUuid}/items`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${auth.value.accessToken}`,
        },
        body: {
          name: model.value.name,
          description: model.value.description,
          price: model.value.price * 100,
          url: model.value.url,
        },
      },
    );
    products.value?.push(product);
    const formData = new FormData();
    productImages.value.forEach((image) => formData.append("images", image));
    await $fetch(
      `${config.backendUrl}/stores/${storeUuid}/items/${product.uuid}/images`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${auth.value.accessToken}`,
        },
        body: formData,
      },
    );
  } catch (e: any) {
    message.error(e.data.message);
  } finally {
    model.name = "";
    model.description = "";
    model.price = 0;
    showCreateModal.value = false;
  }
}

async function deleteProduct(
  storeUuid: string,
  itemUuid: string,
  itemId: number,
) {
  const auth = useAuth();
  try {
    $fetch(`${config.backendUrl}/stores/${storeUuid}/items/${itemUuid}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${auth.value.accessToken}`,
      },
    });
    products.value?.splice(itemId, 1);
  } catch (e: any) {
    message.error(e.data.message);
  }
}

async function changeCover({ file }) {
  const auth = useAuth();
  const formData = new FormData();
  formData.append("cover", file.file);
  try {
    const data = await $fetch<Store>(
      `${config.backendUrl}/stores/${storeUuid}/cover`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${auth.value?.accessToken}`,
        },
        body: formData,
      },
    );
    store.value.coverUrl = data.coverUrl;
  } catch (e: any) {
    message.error(e.data.message);
  } finally {
    uploadRef.value.clear(file);
  }
}

async function updateStore(body: Object) {
  const auth = useAuth();
  try {
    await $fetch(`${config.backendUrl}/stores/${storeUuid}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${auth.value?.accessToken}`,
      },
      body: body,
    });
  } catch (e: any) {
    message.error(e.data.message);
  }
}

function downloadQrcode() {
  // Create a Blob from the SVG content
  const svgBlob = new Blob([new XMLSerializer().serializeToString(qrcode)], {
    type: "image/svg+xml",
  });
  downloadButton.href = window.URL.createObjectURL(svgBlob);
  downloadButton.download = `${store.value?.name}.svg`;
}
</script>
