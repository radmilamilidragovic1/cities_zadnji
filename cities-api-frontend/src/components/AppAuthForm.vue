<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppInput from './AppInput.vue';
import AppButton from './AppButton.vue';
import authApi from '@/api/auth';

const router = useRouter();

const isSignInMode = ref(true);

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');

const isSubmitting = ref(false);
const errorMessage = ref('');

async function submit() {
  isSubmitting.value = true;
  errorMessage.value = '';
  
  try {
    if (!isSignInMode.value) {
      const response = await authApi.signup({
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      });

      console.log('Signup success', response);
      router.push('/');
    } else {
      const response = await authApi.signin({
        email: email.value,
        password: password.value,
      });
      
      console.log('Signin success', response);
      router.push('/');
    }
  } catch (err) {
    console.error('Authentication error:', err);
    errorMessage.value = err.response?.data?.message || 'Authentication failed. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>



<template>
  <form class="form pa-xl" @submit.prevent="submit">
      <h2 class="title mb-md">{{ isSignInMode ? 'Sign in' : 'Sign up' }}</h2>
      <div class="mb-md">
          <div v-if="!isSignInMode" class="flex gap-sm mb-sm">
          <AppInput id="firstName" v-model="firstName" label="First Name" />
          <AppInput id="lastName" v-model="lastName" label="Last Name" />
          </div>
          <AppInput id="email" v-model="email" type="email" label="Email" class="mb-sm"/>
          <AppInput id="password" v-model="password" type="password" label="Password"/>
      </div>
      <AppButton type="submit" :label="isSignInMode ? 'Sign in' : 'Sign up'" primary class="mb-sm" :disabled="isSubmitting"/>
      <p v-if="isSubmitting" class="submitting-text">Submitting...</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p class="toggle">
          {{ isSignInMode ? 'New to Cities?' : 'Already have an account?' }}
          <a class="toggle-link" @click="isSignInMode = !isSignInMode">
              {{ isSignInMode ? 'Sign up now' : 'Sign in' }}
          </a>
      </p>
  </form>
</template>

<style lang="css" scoped>
.form {
  background-image: var(--gradient-bg);
  width: 448px;
  max-width: 448px;
  border-radius: 9px;
}

.title {
  font-size: 36px;
  font-weight: 600;
}

.toggle {
  color: #737373;
}

.toggle-link {
  color: white;
  cursor: pointer;
  transition: text-decoration 1s;
}

.toggle-link:hover {
  text-decoration: underline;
}

.error-message {
  color: #ff6b6b;
  font-size: 14px;
  margin-bottom: 8px;
}

.submitting-text {
  color: #737373;
  font-size: 14px;
}
</style>
