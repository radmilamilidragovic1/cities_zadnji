<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h1 class="text-3xl mb-6 font-bold">🌍 Gradovi</h1>

    <!-- Forma za dodavanje novog grada -->
    <form @submit.prevent="addCity" class="mb-8 space-y-4">
      <input
        v-model="form.name"
        placeholder="Naziv grada"
        class="w-full p-2 border rounded"
        required
      />
      <input
        v-model="form.country"
        placeholder="Država"
        class="w-full p-2 border rounded"
        required
      />
      <input
        v-model="form.imageUrl"
        placeholder="URL slike"
        class="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Dodaj grad
      </button>
    </form>

    <!-- Prikaz gradova -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="city in cities"
        :key="city.id"
        class="rounded-xl shadow-lg overflow-hidden border"
      >
        <img
          :src="city.imageUrl"
          :alt="city.name"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h2 class="text-xl font-semibold">{{ city.name }}</h2>
          <p class="text-gray-600">{{ city.country }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiConfig from '@/api/config';
import authApi from '@/api/auth';

export default {
  data() {
    return {
      cities: [],
      form: {
        name: '',
        country: '',
        imageUrl: ''
      }
    };
  },
  methods: {
    async fetchCities() {
      try {
        const response = await apiConfig.get('/cities');
        this.cities = response.data.data.cities;
      } catch (error) {
        console.error('Greška pri dohvatu gradova:', error);
      }
    },
    async addCity() {
      if (!authApi.isAuthenticated()) {
        alert('Morate biti prijavljeni da biste dodali grad.');
        this.$router.push('/auth');
        return;
      }

      try {
        const response = await apiConfig.post('/cities', this.form);
        console.log('Dodat grad:', response.data);
        this.form = { name: '', country: '', imageUrl: '' }; // Reset forme
        this.fetchCities(); // Osveži listu
      } catch (error) {
        console.error('Greška pri dodavanju grada:', error);
        if (error.response?.status === 401) {
          alert('Vaša sesija je istekla. Molimo prijavite se ponovo.');
          authApi.logout();
          this.$router.push('/auth');
        } else {
          alert(error.response?.data?.message || 'Dodavanje nije uspelo.');
        }
      }
    }
  },
  mounted() {
    this.fetchCities();
  }
};
</script>

<style scoped>
.p-4 {
  padding: 20px;
}

.max-w-4xl {
  max-width: 1200px;
}

.mx-auto {
  margin: 0 auto;
}

.text-3xl {
  font-size: 28px;
}

.mb-6 {
  margin-bottom: 24px;
}

.font-bold {
  font-weight: bold;
}

.mb-8 {
  margin-bottom: 32px;
}

.space-y-4 > * + * {
  margin-top: 16px;
}

.w-full {
  width: 100%;
}

.p-2 {
  padding: 8px;
}

.border {
  border: 1px solid #ccc;
}

.rounded {
  border-radius: 4px;
}

.bg-blue-600 {
  background-color: #007bff;
}

.text-white {
  color: white;
}

.px-4 {
  padding-left: 16px;
  padding-right: 16px;
}

.py-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}

.hover\:bg-blue-700:hover {
  background-color: #0056b3;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 640px) {
  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.gap-4 {
  gap: 16px;
}

.rounded-xl {
  border-radius: 12px;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.overflow-hidden {
  overflow: hidden;
}

.h-48 {
  height: 192px;
}

.object-cover {
  object-fit: cover;
}

.text-xl {
  font-size: 20px;
}

.font-semibold {
  font-weight: 600;
}

.text-gray-600 {
  color: #6b7280;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
}

form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
}

input {
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #007bff;
}

button {
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

h1 {
  color: #333;
}

.grid > div {
  background-color: white;
  transition: transform 0.2s;
}

.grid > div:hover {
  transform: translateY(-2px);
}

.grid img {
  width: 100%;
}

.grid h2 {
  margin: 0;
  padding: 16px 16px 8px;
  color: #333;
}

.grid p {
  margin: 0;
  padding: 0 16px 16px;
}
</style>

