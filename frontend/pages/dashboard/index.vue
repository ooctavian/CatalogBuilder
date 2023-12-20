<template>
  <n-layout has-sider style="flex: 1 1 auto">
    <n-layout>
      <n-layout-content embeded>
        <n-card>
          <n-empty description="Don't miss the opportunity to">
            <template #icon>
              <n-icon>
                <BuildingStore />
              </n-icon>
            </template>
            <template #extra>
              <n-button size="small" @click="showModal = true">
                Create a new store
              </n-button>
            </template>
          </n-empty>
        </n-card>
        <n-table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(store, index) in stores">
              <td>{{ index + 1 }}</td>
              <td>
                <n-ellipsis
                  :line-clamp="2"
                  style="word-wrap: break-word; word-break: break-all"
                  expand-trigger="click"
                >
                  {{ store.name }}
                </n-ellipsis>
              </td>
              <td>
                <n-ellipsis
                  :line-clamp="2"
                  style="word-wrap: break-word; word-break: break-all"
                  expand-trigger="click"
                >
                  {{ store.description }}
                </n-ellipsis>
              </td>
              <td>
                <n-space>
                  <n-button
                    secondary
                    type="success"
                    @click.prevent="navigateTo('/' + store.uuid)"
                  >
                    <n-icon>
                      <Eye />
                    </n-icon>
                  </n-button>
                  <n-button
                    secondary
                    type="info"
                    @click.prevent="navigateTo('/dashboard/' + store.uuid)"
                  >
                    <n-icon>
                      <Edit />
                    </n-icon>
                  </n-button>
                  <n-button
                    secondary
                    type="error"
                    @click.prevent="
                      deleteStore(store.uuid);
                      stores.splice(index, 1);
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
        <n-modal
          v-model:show="showModal"
          preset="card"
          title="Create a new store"
          :bordered="false"
          size="huge"
          style="max-width: 600px"
        >
          <template #header-extra> </template>
          <template #footer>
            <n-form ref="formRef" inline :label-width="80" :model="model">
              <n-space vertical>
                <n-form-item label="Give name to your store" path="name">
                  <n-input
                    v-model:value="model.name"
                    placeholder="Amazing store"
                  />
                </n-form-item>
                <n-form-item
                  label="Give a description to your store"
                  path="description"
                >
                  <n-input
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    v-model:value="model.description"
                    type="textarea"
                  />
                </n-form-item>

                <n-form-item
                  label="Upload a cover for your store"
                  path="uploadValue"
                >
                  <n-upload
                    accept="image/png,image/jpeg"
                    @change="({ file }) => (coverImage = file.file)"
                    :max="1"
                    :default-upload="false"
                    :directory="false"
                  >
                    <n-upload-dragger>
                      <div style="margin-bottom: 12px">
                        <n-icon size="48" :depth="3">
                          <Polaroid />
                        </n-icon>
                      </div>
                      <n-text style="font-size: 16px">
                        Click or drag a file to this area to upload
                      </n-text>
                      <n-p depth="3" style="margin: 8px 0 0 0">
                        This image will be used as a cover for your store page.
                        So make sure you give the best.
                      </n-p>
                    </n-upload-dragger>
                  </n-upload>
                </n-form-item>
              </n-space>
            </n-form>
            <n-space>
              <n-button @click.prevent="createStore" type="primary">
                Create
              </n-button>
              <n-button @click="showModal = false"> Cancel </n-button>
            </n-space>
          </template>
        </n-modal>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
<script lang="ts" setup>
import { BuildingStore, Polaroid, Eye, Edit, X } from "@vicons/tabler";
import type { Store } from "@/types/Store";
import { useAuth } from "@/util/useAuth";

interface CreateStore {
  name: string | null;
  description: string | null;
}

const formRef = ref<FormInst | null>(null);
const message = useMessage();
const auth = useAuth();
const config = useRuntimeConfig().public;
const stores: Ref<Store[] | null> = ref(null);
try {
  stores.value = await $fetch(`${config.backendUrl}/stores`, {
    headers: {
      authorization: `Bearer ${auth.value.accessToken}`,
    },
  });
} catch (e: any) {
  message.error(e.data.message);
}

const model = ref<CreateStore>({
  name: null,
  description: null,
});

const showModal = ref(false);
const coverImage: Ref<any> = ref(null);
async function createStore() {
  const auth = useAuth();
  try {
    const data: Store = await $fetch(`${config.backendUrl}/stores`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${auth.value.accessToken}`,
      },
      body: {
        name: model.value.name,
        description: model.value.description,
      },
    });
    stores.value.push(data);
    if (coverImage.value) {
      const formData = new FormData();
      formData.append("cover", coverImage.value);
      await $fetch(`${config.backendUrl}/stores/${data.uuid}/cover`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${auth.value?.accessToken}`,
        },
        body: formData,
      });
    }
  } catch (e: any) {
    message.error(e.data.message);
  } finally {
    model.value.name = "";
    model.value.description = "";
    showModal.value = false;
  }
}
async function deleteStore(uuid: string) {
  const auth = useAuth();
  if (auth.value) {
    try {
      $fetch(`${config.backendUrl}/stores/${uuid}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${auth.value.accessToken}`,
        },
      });
    } catch (e: any) {
      message.error(e.data.message);
    }
  }
}
</script>
