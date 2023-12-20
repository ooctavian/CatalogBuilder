<template>
  <n-space v-if="edit">
    <n-input
      clearable
      type="textarea"
      v-model:value="value"
      @focusout="onExit"
      @keyup="
        (event) => {
          if (event.keyCode === 13 || event.keyCode === 27) {
            onExit();
          }
        }
      "
      :autosize="{
        minRows: 1,
      }"
    >
      <template #suffix>
        <n-button tertiary circle size="tiny" @click.prevent="edit = false">
          <template #icon>
            <n-icon>
              <ArrowBarToDown />
            </n-icon>
          </template>
        </n-button>
      </template>
    </n-input>
  </n-space>
  <n-space v-else>
    <div style="word-break: break-all">
      {{ value }}
    </div>
    <n-button tertiary circle size="tiny" @click.prevent="edit = true">
      <template #icon>
        <n-icon>
          <EditCircle />
        </n-icon>
      </template>
    </n-button>
  </n-space>
</template>
<script lang="ts" setup>
import { EditCircle, ArrowBarToDown } from "@vicons/tabler";
const props = defineProps<{
  text: string;
  onExit: (text: string) => void;
}>();
const value = ref(props.text || "No description");
const edit: Ref<boolean> = ref(false);
const message = useMessage();
function onExit() {
  edit.value = false;
  props.onExit(value.value);
}
</script>
