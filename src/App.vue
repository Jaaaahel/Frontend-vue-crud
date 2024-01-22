<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRoute();

const menuActive = ref<string[]>([router.path]);
watch(() => router.path, async () => { menuActive.value = [router.path]; });
</script>

<template>
  <a-layout class="layout">
    <a-layout-header v-if="router.path !== '/'">
      <a-menu
        v-model:selectedKeys='menuActive'
        theme='dark'
        mode='horizontal'
        :style="{ lineHeight: '64px' }"
      >
      
      <RouterLink to='/users'>
        <a-menu-item key='/users'>Users</a-menu-item>
      </RouterLink>
      <RouterLink to="/accounts">
        <a-menu-item key='/accounts'>Accounts</a-menu-item>
      </RouterLink>
      <a-menu-item @click='authStore.logout()'>Logout</a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout-content class="layout-content">
      <RouterView />
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.layout {
  min-height: 100dvh;
}

.layout-content {
  padding: 0 50px;
}
</style>