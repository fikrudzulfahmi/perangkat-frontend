<template>
  <div>
    <div class="welcome-card">
      <h2>Ringkasan Aktivitas</h2>
      
      <p v-if="user" class="welcome-text">
        Selamat datang kembali, <strong>{{ user.name }}</strong>! Akhiri aktivitas mengajar Anda dengan bijak hari ini.
      </p>
      
      <p class="instruction-text">
        Gunakan menu di sebelah kiri (sidebar) untuk mulai mengelola seluruh instrumen pengajaran Anda.
      </p>

      <div v-if="user" class="user-badge">
        <i class="fa-solid fa-circle-user"></i> {{ user.email }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const user = ref(null);

onMounted(async () => {
  const token = localStorage.getItem('auth_token');
  
  try {
    // Mengambil data profile user yang sedang login dari API Laravel
    const response = await api.get('/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    user.value = response.data;
  } catch (error) {
    // Jika token kedaluwarsa atau tidak valid, hapus token dan tendang kembali ke halaman Login
    localStorage.removeItem('auth_token');
    router.push('/');
  }
});
</script>

<style scoped>
/* CSS murni hanya untuk komponen konten Dashboard */
.welcome-card {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  border-top: 5px solid #FBC02D; /* Palet: Kuning Emas */
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

h2 {
  color: #1E5631; /* Palet: Hijau Tua */
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 24px;
}

.welcome-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.instruction-text {
  font-size: 15px;
  color: #666;
  margin-bottom: 20px;
}

.user-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #FFE0B2; /* Palet: Krem */
  color: #1E5631; /* Palet: Hijau Tua */
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
}
</style>