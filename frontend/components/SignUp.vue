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
    <n-form-item
      ref="rPasswordFormItemRef"
      first
      path="reenteredPassword"
      label="Re-enter password"
    >
      <n-input
        v-model:value="model.reenteredPassword"
        :disabled="!model.password"
        type="password"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
            :disabled="
              model.email === null ||
              model.password === null ||
              model.reenteredPassword == null
            "
            block
            strong
            type="primary"
            @click.prevent="handleButtonClick"
          >
            Sign up
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { validateEmailAddress } from "../util/validateEmail";
import { useAuth } from "@/util/useAuth";

interface SignUpInfo {
  email: string | null;
  password: string | null;
  reenteredPassword: string | null;
}

export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null);
    const rPasswordFormItemRef = ref<FormItemInst | null>(null);
    const message = useMessage();
    const auth = useAuth();
    const config = useRuntimeConfig().public;
    const modelRef = ref<SignUpInfo>({
      email: null,
      password: null,
      reenteredPassword: null,
    });
    const rules: FormRules = {
      password: [
        {
          required: true,
          message: "Password is required",
        },
      ],
      reenteredPassword: [
        {
          required: true,
          message: "Re-entered password is required",
          trigger: ["input", "blur"],
        },
        {
          validator: validatePasswordStartWith,
          message: "Password is not the same!",
          trigger: "input",
        },
        {
          validator: validatePasswordSame,
          message: "Password is not the same!",
          trigger: ["blur", "password-input"],
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

    function validatePasswordStartWith(value: string): boolean {
      return (
        !!modelRef.value.password &&
        modelRef.value.password.startsWith(value) &&
        modelRef.value.password.length >= value.length
      );
    }

    function validatePasswordSame(rule: FormItemRule, value: string): boolean {
      return value === modelRef.value.password;
    }

    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      handlePasswordInput() {
        if (modelRef.value.reenteredPassword) {
          rPasswordFormItemRef.value?.validate({ trigger: "password-input" });
        }
      },
      async handleButtonClick() {
        try {
          const data: any = await $fetch(`${config.backendUrl}/auth/register`, {
            method: "POST",
            body: {
              email: modelRef.value.email,
              password: modelRef.value.password,
            },
          });
          auth.value = data;
          await navigateTo("/dashboard");
        } catch (e: any) {
          message.error(e.data.message);
        }
      },
    };
  },
});
</script>
