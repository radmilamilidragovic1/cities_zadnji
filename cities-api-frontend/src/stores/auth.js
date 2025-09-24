import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import authApi from '@/api/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(authApi.getToken());

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials) {
    try {
      const response = await authApi.signin(credentials);
      user.value = response.user;
      token.value = response.token;
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function register(userData) {
    try {
      const response = await authApi.signup(userData);
      user.value = response.user;
      token.value = response.token;
      return response;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    authApi.logout();
    user.value = null;
    token.value = null;
  }

  function initialize() {
    const storedToken = authApi.getToken();
    if (storedToken) {
      token.value = storedToken;
      // You might want to fetch user data here if needed
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    initialize,
  };
});