<template>
  <div class="home-page">
    <div class="header">
      <h1>Dodaj Novi Grad</h1>
      <button v-if="isLoggedIn" @click="logout" class="logout-btn">
        Odjavi se
      </button>
    </div>

    <!-- Forma za dodavanje grada -->
    <form @submit.prevent="addCity" class="form-container">
      <input v-model="form.name" placeholder="Naziv grada" class="input" required />
      <textarea v-model="form.description" placeholder="Opis" class="input"></textarea>
      <input v-model="form.country" placeholder="Država" class="input" required />
      <input v-model.number="form.settledYear" placeholder="Godina osnivanja" class="input" />
      <input v-model.number="form.consolidatedYear" placeholder="Godina konsolidacije" class="input" />
      <input v-model.number="form.population" placeholder="Broj stanovnika" class="input" />
      <input v-model.number="form.zipCode" placeholder="Poštanski broj" class="input" />
      <input v-model="form.imageUrl" placeholder="URL slike" class="input" />

      <button type="submit" class="add-btn">
        Dodaj grad
      </button>
    </form>

    <!-- Lista gradova -->
    <div v-if="cities.length" class="cities-grid">
      <div v-for="city in cities" :key="city.id" class="city-card">
        <img :src="city.imageUrl" alt="Slika grada" class="city-image" />
        <h2 class="city-name">{{ city.name }}</h2>
        <p class="city-country">{{ city.country }}</p>
        <p class="city-description">{{ city.description }}</p>
        <p class="city-info">{{ city.settledYear }} - {{ city.population }} ljudi</p>
      </div>
    </div>
  </div>
</template>

<script>
import apiConfig from '@/api/config';
import authApi from '@/api/auth';

export default {
  name: 'HomePage',
  data() {
    return {
      cities: [],
      form: {
        name: '',
        description: '',
        country: '',
        settledYear: null,
        consolidatedYear: null,
        population: null,
        zipCode: null,
        imageUrl: ''
      },
      isLoggedIn: authApi.isAuthenticated()
    };
  },
  methods: {
    async fetchCities() {
      try {
        const response = await apiConfig.get('/cities');
        this.cities = response.data.data.cities;
      } catch (error) {
        console.error('Greška pri dohvaćanju gradova:', error);
      }
    },
    async addCity() {
      if (!authApi.isAuthenticated()) {
        alert('Morate biti prijavljeni da biste dodali grad.');
        this.$router.push('/auth');
        return;
      }

      try {
        await apiConfig.post('/cities', this.form);

        this.form = {
          name: '',
          description: '',
          country: '',
          settledYear: null,
          consolidatedYear: null,
          population: null,
          zipCode: null,
          imageUrl: ''
        };

        this.fetchCities(); // Osveži listu gradova
        alert('Grad je uspešno dodat!');
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
    },
    logout() {
      authApi.logout();
      this.isLoggedIn = false;
      this.$router.push('/auth');
    }
  },
  mounted() {
    this.fetchCities();
  }
};
</script>

<style scoped>
.home-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 24px;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background-color: #c82333;
}

.form-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 600px;
  margin-bottom: 30px;
}

.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  margin-bottom: 12px;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #007bff;
}

.add-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-btn:hover {
  background-color: #0056b3;
}

.add-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.cities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.city-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 1px solid #ddd;
  padding: 16px;
}

.city-image {
  width: 100%;
  height: 192px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
}

.city-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.city-country {
  font-size: 14px;
  color: #374151;
  margin: 0 0 8px 0;
}

.city-description {
  font-size: 14px;
  margin: 8px 0;
  color: #333;
}

.city-info {
  font-size: 12px;
  color: #6b7280;
  margin: 8px 0 0 0;
}
</style>
