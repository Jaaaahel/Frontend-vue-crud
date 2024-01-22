import router from '@/router';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user'),
    returnUrl: '',
  }),
  actions: {
    login(user: string) {
      this.user = user;
      localStorage.setItem('user', user);

      router.push(this.returnUrl || '/users');
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      router.push('/');
    },
    getToken() {
        return this.user
    }
  },
});