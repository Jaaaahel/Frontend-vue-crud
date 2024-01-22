<template>
  <a-modal :confirm-loading="confirmLoading" @ok="submit(props.modalData?.id, formData)" @cancel="cancel()">
    <a-space direction="vertical">
      <a-input v-model:value="formData.username" addonBefore="user name" />
      <a-input v-model:value="formData.firstName" addonBefore="first name" />
      <a-input v-model:value="formData.lastName" addonBefore="last name" />
      <a-input-password v-model:value="formData.password" addonBefore="password" />
    </a-space>
  </a-modal>
</template>
  
<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const props = defineProps({ modalData: Object });
const emit = defineEmits(['update:open', 'updateData']);
const confirmLoading = ref<boolean>(false);

const formData = reactive({
  username: '',
  password: '',
  firstName: '',
  lastName: '',
});

const submit = async (id:number, data: typeof formData) => {
  confirmLoading.value = true;

  try {
    await axios.put(`${import.meta.env.VITE_API_URL}/users/${id}`,
      data,
      { headers: { Authorization: `Bearer ${authStore.getToken()}` },
    });
    
    message.info('User successfully updated');
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

watch(() => props.modalData, async () => {
  formData.username = props.modalData?.username;
  formData.firstName = props.modalData?.firstName;
  formData.lastName = props.modalData?.lastName;
  formData.password = props.modalData?.password;
});
</script>