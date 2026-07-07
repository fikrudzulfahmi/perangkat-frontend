<template>
  <div class="login-container">
    <h2>Login Admin Perangkat</h2>
    
    <form @submit.prevent="handleLogin">
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required placeholder="Masukkan email" />
      </div>
      
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required placeholder="Masukkan password" />
      </div>

      <button type="submit">Masuk</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value
    });

    const apiResponse = response.data;

    if (apiResponse.status === 'success') {
      // 1. Simpan Token
      localStorage.setItem('auth_token', apiResponse.data.token);
      
      // Ambil objek user hasil kiriman Laravel
      const user = apiResponse.data.user;
      
      // 2. DETEKSI ROLE (Ubah ke 'let' agar nilainya bisa dimanipulasi frontend)
      let roleUser = user?.role; 

      if (!roleUser) {
        // Fallback cerdas: tebak role lewat email jika backend belum mengirim field role
        if (user && (user.email === 'admin@gmail.com' || user.email.includes('admin'))) {
          roleUser = 'admin';
        } else {
          roleUser = 'guru';
        }
      }
      
      // Simpan hasil penentuan role ke local storage
      localStorage.setItem('user_role', roleUser);

      // 3. Alihkan halaman secara otomatis sesuai role
      if (roleUser === 'admin') {
        router.push({ name: 'Dashboard' });
      } else {
        router.push({ name: 'guru.dashboard' });
      }
    } else {
      errorMessage.value = apiResponse.message || "Login gagal.";
    }

  } catch (error) {
    console.error("Login gagal:", error);
    errorMessage.value = error.response?.data?.message || "Terjadi kesalahan pada koneksi server.";
  }
};
</script>

<style scoped>
/* 1. Mengatur Background Halaman Utama (Warna Krem - Palette 4) */
:deep(body) {
  background-color: #FFE0B2; /* Krem Lembut */
  margin: 0;
  min-height: 100vh;
}

/* 2. Container Utama Form (Menengahkannya di layar) */
.login-container {
  max-width: 380px;
  margin: 10vh auto; /* Memberi jarak dari atas layar */
  padding: 30px;
  
  /* Styling Card Login */
  background-color: #ffffff; /* Tetap putih agar teks mudah dibaca */
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1); /* Shadow lembut */
  
  /* Memberi Border Halus (Warna Hijau Muda - Palette 2) */
  border: 1px solid #689F38;
  
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 3. Styling Judul (Warna Hijau Tua - Palette 1) */
h2 {
  text-align: center;
  color: #1E5631; /* Hijau Tua Forest */
  margin-bottom: 25px;
  font-weight: 600;
}

/* 4. Styling Label Input (Warna Hijau Tua - Palette 1) */
label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #1E5631; /* Hijau Tua Forest */
}

/* 5. Styling Input Field */
input {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 6px;
  box-sizing: border-box; /* Agar padding tidak merusak lebar */
  
  /* Border Input (Warna Hijau Muda - Palette 2) */
  border: 1px solid #689F38; 
  
  font-size: 14px;
  transition: border-color 0.3s;
}

/* Efek saat Input diklik/fokus (Warna Emas - Palette 3) */
input:focus {
  outline: none;
  border-color: #FBC02D; /* Kuning Emas/Mustard */
  box-shadow: 0 0 0 3px rgba(251, 192, 45, 0.2);
}

/* 6. Styling Tombol Masuk (Warna Hijau Tua - Palette 1) */
button {
  width: 100%;
  padding: 12px;
  background-color: #1E5631; /* Hijau Tua Forest */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* Efek saat Tombol di-hover (Sedikit lebih terang) */
button:hover {
  background-color: #2e8b57; /* Sea Green */
}

/* 7. Styling Pesan Error (Tetap Merah untuk Semantik, tapi disesuaikan) */
.error {
  color: #d9534f; /* Merah Error standar */
  background-color: #f2dede; /* Background merah muda lembut */
  border: 1px solid #ebccd1;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}
</style>