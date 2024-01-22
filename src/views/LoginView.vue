<template>
  <div class="container">
    <a-form
      :model="form"
      autocomplete="off"
      @submit="submit"
    >
      <a-form-item
        name="username"
        :rules="[{ required: true, message: 'Please input your username' }]"
      >
        <a-input v-model:value="form.username">
          <template #prefix><user-outlined /></template>
        </a-input>
      </a-form-item>

      <a-form-item
        name="password"
        :rules="[{ required: true, message: 'Please input your password' }]"
      >
        <a-input-password v-model:value="form.password">
          <template #prefix><LockOutlined /></template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-button block type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import axios from 'axios'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const form = reactive({
  username: '',
  password: '',
});

const submit = async () => {

  if (form.username && form.password) {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, form);

      if (res.status === 200) authStore.login(res.data.data.token);
    } catch (e: any) {
      if (e.response.status === 404) {
        form.password = '';
        message.error('Incorrect credentials');
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
