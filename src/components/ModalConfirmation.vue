<template>
  <a-modal :confirm-loading="confirmLoading" @ok="submit(props.modalData?.id)" @cancel="cancel()">
    <p>{{ props.modalText }}</p>
  </a-modal>
</template>
    
<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const props = defineProps({ modalText: String, modalData: Object });
const emit = defineEmits(['update:open', 'updateData']);
const confirmLoading = ref<boolean>(false);

const submit = async (id: number) => {
  confirmLoading.value = true;

  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${authStore.getToken()}` }
    });
    
    message.info('User successfully deleted');
  } catch (e: any) {
    if (e.response.data.message === 'Session Expired') {
      message.error('Session expired. Redirecting...');
      setTimeout( () => router.push({ path: '/'}), 3000);
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