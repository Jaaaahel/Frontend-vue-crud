<template>
  <a-modal :confirm-loading="confirmLoading" @ok="submit(formData)" @cancel="cancel()">
    <a-space direction="vertical">
      <a-input v-model:value="formData.username" addonBefore="user name" />
      <a-input v-model:value="formData.firstName" addonBefore="first name" />
      <a-input v-model:value="formData.lastName" addonBefore="last name" />
      <a-input-password v-model:value="formData.password" addonBefore="password" />
    </a-space>
  </a-modal>
</template>
    
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const emit = defineEmits(['update:open', 'updateData']);
const confirmLoading = ref<boolean>(false);

const formData = reactive({
  username: '',
  password: '',
  firstName: '',
  lastName: '',
});

const submit = async (data: typeof formData) => {
  confirmLoading.value = true;

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/register`,
      data,
      { headers: { Authorization: `Bearer ${authStore.getToken()}` },
    });
    
    formData.username = '';
    formData.password = '';
    formData.firstName = '';
    formData.lastName = '';
    message.info('User successfully created');
  } catch (e: any) {
    if (e.response.data.message === 'Session Expired') {
      message.error('Session expired. Redirecting...');
      setTimeout( () => router.push({ path: '/'}), 3000);
    } else {
      message.error(e.response.data.message);
    }
  } finally {
    emit('updateData');
    confirmLoading.value = false;
    emit('update:open', false);
  }
};

const cancel = async () => {
  emit('update:open', false);
}
</script>