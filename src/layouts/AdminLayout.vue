<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h3>Menu Admin</h3>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item">
          <i class="fa-solid fa-gauge"></i> Dashboard
        </router-link>
        <router-link to="/data-guru" class="nav-item">
          <i class="fa-solid fa-users"></i> Data Guru
        </router-link>
        <router-link to="/mata-pelajaran" class="nav-item">
          <i class="fa-solid fa-book-bookmark"></i> Mata Pelajaran
        </router-link>
        <router-link to="/kelas" class="nav-item">
          <i class="fa-solid fa-school"></i> Data Kelas
        </router-link>
        <router-link to="/tahun-pelajaran" class="nav-item">
          <i class="fa-solid fa-calendar-days"></i> Tahun Pelajaran
        </router-link>
        <router-link to="/plotting" class="nav-item">
          <i class="fa-solid fa-network-wired"></i> Plotting Guru
        </router-link>
        <router-link to="/siswa" class="nav-item">
          <i class="fa-solid fa-users"></i> Data Siswa
        </router-link>
        <router-link to="/kalender-efektif" class="nav-item">
          <i class="fa-solid fa-calendar-days"></i> Kalender & Efektif
        </router-link>
        <router-link to="/kurikulum" class="nav-item">
          <i class="fa-solid fa-graduation-cap"></i> CP & Tujuan Pembelajaran
        </router-link>
        <router-link to="/dokumen-statis" class="nav-item">
          <i class="fa-solid fa-file-signature"></i> Dokumen Statis
        </router-link>
        <router-link to="/jadwal-mengajar" class="nav-item">
          <i class="fa-solid fa-calendar-days"></i> Jadwal Mengajar
        </router-link>
        
        <button @click="handleLogout" class="nav-item btn-logout">
          <i class="fa-solid fa-right-from-bracket"></i> Keluar
        </button>
      </nav>
    </aside>

    <div class="main-content">
      <header class="top-header">
        <div class="page-title">
          <h2>{{ currentRouteName }}</h2>
        </div>
        <div class="user-info">
          <span>Sistem Dashboard <strong>Kurikulum</strong></span>
        </div>
      </header>

      <main class="content-body">
        <router-view />
      </main>

      <footer class="main-footer">
        <p>&copy; 2026 Aplikasi Perangkat Mengajar. All rights reserved.</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();

// Mengambil nama halaman secara dinamis untuk header
const currentRouteName = computed(() => route.name || 'Halaman Admin');

const handleLogout = () => {
  Swal.fire({
    title: 'Keluar Aplikasi?',
    text: "Anda harus login kembali untuk mengelola data.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d9534f',
    cancelButtonColor: '#1E5631',
    confirmButtonText: 'Ya, Keluar',
    cancelButtonText: 'Batal',
    background: '#FFE0B2',
    color: '#1E5631'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('auth_token');
      router.push('/');
    }
  });
};
</script>

<style scoped>
/* Layout Utama & Pengaturan Font Sukses Balik */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #FFE0B2; /* Mengembalikan warna Krem dasar dari screenshot Anda */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Perbaikan Font */
}

/* Kustomisasi Sidebar Sesuai Tema Hijau-Emas */
.sidebar {
  width: 260px;
  background-color: #1E5631; /* Hijau Tua */
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #689F38;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 20px;
  color: white;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.nav-item {
  padding: 12px 15px;
  color: #FFE0B2;
  text-decoration: none;
  border-radius: 5px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: 0.3s;
  font-size: 15px;
}

.nav-item:hover, .router-link-active {
  background-color: #689F38; /* Hijau Muda */
  color: white;
}

.router-link-active {
  border-left: 5px solid #FBC02D; /* Garis Kuning Emas Aktif */
}

.btn-logout {
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  margin-top: 30px;
  color: #ff8a80;
  text-align: left;
}

/* Area Utama Bagian Kanan */
.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.top-header {
  background-color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.top-header h2 {
  margin: 0;
  font-size: 18px;
  color: #1E5631;
}

.user-info {
  color: #1E5631;
  font-size: 14px;
}

.content-body {
  padding: 30px;
  flex-grow: 1;
}

/* Footer Tambahan */
.main-footer {
  background-color: white;
  padding: 12px;
  text-align: center;
  color: #666;
  font-size: 13px;
  border-top: 1px solid rgba(0,0,0,0.05);
}
.main-footer p {
  margin: 0;
}
</style>