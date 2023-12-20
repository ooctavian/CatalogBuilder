<template>
  <n-form ref="formRef" :model="model" :rules="rules">
    <n-form-item path="email" label="Email">
      <n-input v-model:value="model.email" @keydown.enter.prevent />
    </n-form-item>
    <n-form-item path="password" label="Password">
      <n-input
        v-model:value="model.password"
        type="password"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
            :disabled="model.email === null"
            block
            strong
            type="primary"
            @click="handleButtonClick"
          >
            Log in
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { validateEmailAddress } from "@/util/validateEmail";
import { useAuth } from "@/util/useAuth";

interface LogInInfo {
  email: string | null;
  password: string | null;
}

export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null);
    const rPasswordFormItemRef = ref<FormItemInst | null>(null);
    const config = useRuntimeConfig().public;
    const message = useMessage();
    const modelRef = ref<LogInInfo>({
      email: null,
      password: null,
    });
    function validatePasswordStartWith(
      rule: FormItemRule,
      value: string,
    ): boolean {
      return (
        !!modelRef.value.password &&
        modelRef.value.password.startsWith(value) &&
        modelRef.value.password.length >= value.length
      );
    }
    const auth = useAuth();
    const rules: FormRules = {
      password: [
        {
          required: true,
          message: "Password is required",
        },
      ],
      email: [
        {
          required: true,
          message: "Email is required",
          trigger: ["input", "blur"],
        },
        {
          validator: validateEmailAddress,
          message: "Invalid email",
          trigger: ["input", "blur"],
        },
      ],
    };
    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      auth,
      async handleButtonClick(e: MouseEvent) {
        e.preventDefault();
        try {
          const data: any = await $fetch(`${config.backendUrl}/auth/login`, {
            method: "POST",
            body: {
              email: modelRef.value.email,
              password: modelRef.value.password,
            },
          });
          auth.value = data;
          await navigateTo("/dashboard");
        } catch (error: any) {
          message.error(error.data.message);
        }
      },
    };
  },
});
</script>

<style type="text/css" scoped></style>
