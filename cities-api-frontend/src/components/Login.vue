<template>
  <div class="login-page">
    <h2>Prijava</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Lozinka" required />
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Prijavljivanje...' : 'Prijavi se' }}
      </button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import authApi from '@/api/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        await authApi.signin({
          email: this.email,
          password: this.password
        });

        this.$router.push('/'); // idi na home
      } catch (err) {
        this.errorMessage = err.response?.data?.message || 'Neuspešna prijava';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.error-message {
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 8px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
