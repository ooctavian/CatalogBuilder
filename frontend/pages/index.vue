<template>
  <div class="container">
    <n-space class="content" vertical color="white">
      <n-space justify="center">
        <n-h1
          :align-text="true"
          style="
            color: white;
            font-size: 2.7rem;
            background-color: #00000020;
            text-align: center;
            padding: 20px;
          "
        >
          Launch Your Dream Catalog Today
        </n-h1>
      </n-space>
      <n-p
        :align-text="true"
        style="
          color: white;
          background-color: #00000030;
          padding: 20px;
          font-size: 1.2rem;
          text-align: center;
        "
        depth="1"
      >
        Catalog Builder is a lightweight and user-friendly platform that enables
        anyone to build and manage their online catalog with ease. The goal is
        to simplify the process, providing a straightforward solution for
        showcasing products without unnecessary complexity.
      </n-p>
      <n-space justify="center">
        <n-button
          type="primary"
          size="large"
          @click.prevent="showModalOrRedirect"
          style="font-size: 1.3rem; padding: 1.8rem"
        >
          Join
        </n-button>
        <n-button
          type="info"
          size="large"
          @click.prevent="
            navigateTo('/0c60121d-0e36-4b93-b5c6-35a4f5fac613', {
              external: true,
            })
          "
          style="font-size: 1.3rem; padding: 1.8rem"
        >
          Live Demo
        </n-button>
      </n-space>
    </n-space>
    <n-carousel autoplay class="image-container">
      <img class="carousel-img" src="../static/bg1.jpg" />
      <img class="carousel-img" src="../static/bg3.jpg" />
      <img class="carousel-img" src="../static/bg2.jpg" />
    </n-carousel>
  </div>

  <n-modal
    :show="show"
    style="max-width: 400px"
    closeable
    @esc="show = false"
    @mask-click="show = false"
  >
    <n-card>
      <n-tabs
        class="card-tabs"
        pane-wrapper-style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        default-value="signin"
        size="large"
        justify-content="space-evenly"
      >
        <n-tab-pane name="signin" tab="Log In">
          <LogIn />
        </n-tab-pane>
        <n-tab-pane name="signup" tab="Sign up">
          <SignUp />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-modal>
</template>
<style scoped>
.container {
  position: relative;
}
.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
}
.content > * {
  color: white;
}
.carousel-img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
}
/* The .image-container class needs to be applied to a div wrapped around the image you want to apply this filter to */
.image-container {
  display: inline-block;
  position: relative;
  line-height: 0;
  background: #ffffff;
}
.image-container::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  mix-blend-mode: darken;
  background: #7d0000;
  opacity: 0.1;
}
.image-container > img {
  -webkit-filter: brightness(90%) contrast(125%) grayscale(100%)
    hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(50%);
  filter: brightness(90%) contrast(125%) grayscale(100%) hue-rotate(0deg)
    invert(0%) opacity(100%) saturate(100%) sepia(50%);
  mix-blend-mode: none;
}
</style>

<script lang="ts" setup>
import SignUp from "@/components/SignUp.vue";
import LogIn from "@/components/LogIn.vue";
import { checkIfLoggedIn } from "@/util/checkIfLoggedIn";
const loggedIn = await checkIfLoggedIn();
function showModalOrRedirect() {
  if (loggedIn) {
    navigateTo("/dashboard");
    return;
  }
  show.value = true;
}

const route = useRoute();
const router = useRouter();
const show: Ref<boolean> = ref(route.query.show ? true : false);
watch(show, (show) => {
  if (show) {
    router.push({
      path: "/",
      query: { show: String(show) },
    });
  }
});
definePageMeta({
  layout: "public",
});
</script>
