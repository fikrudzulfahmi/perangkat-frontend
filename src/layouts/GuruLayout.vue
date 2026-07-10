<template>
  <div class="admin-layout">
    <div
      v-if="isSidebarOpen"
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>

    <aside class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="sidebar-header">
        <div class="brand">
          <i class="fa-solid fa-graduation-cap brand-icon"></i>
          <div class="brand-text">
            <h3>Menu Guru</h3>
            <span>Portal Perangkat Ajar</span>
          </div>
        </div>
        <button class="btn-close-sidebar" @click="closeSidebar" aria-label="Tutup menu">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/guru/dashboard" class="nav-item">
          <i class="fa-solid fa-gauge"></i> Dashboard Guru
        </router-link>
        <router-link to="/guru/atp" class="nav-item">
          <i class="fa-solid fa-route"></i> Alur Tujuan (ATP)
        </router-link>
        <router-link to="/guru/kktp" class="nav-item">
          <i class="fa-solid fa-bullseye"></i> Kriteria Ketuntasan (KKTP)
        </router-link>
        <router-link to="/guru/prosem" class="nav-item">
          <i class="fa-solid fa-calendar-days"></i> Prota & Prosem
        </router-link>
        <router-link to="/guru/buku-pegangan" class="nav-item">
          <i class="fa-solid fa-book-open-reader"></i> Daftar Buku Pegangan
        </router-link>
        <router-link to="/guru/bank-soal" class="nav-item">
          <i class="fa-solid fa-file-signature"></i> Bank Soal & Kisi-kisi
        </router-link>
        <router-link to="/guru/modul-ajar" class="nav-item">
          <i class="fa-solid fa-file-lines"></i> Modul Ajar / RPP
        </router-link>
        <router-link to="/guru/cetak-perangkat" class="nav-item">
          <i class="fa-solid fa-print"></i> Cetak Buku Kerja
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="btn-logout">
          <i class="fa-solid fa-right-from-bracket"></i> Keluar Aplikasi
        </button>
      </div>
    </aside>

    <div class="main-content">
      <header class="main-header">
        <button class="btn-menu-toggle" @click="toggleSidebar" aria-label="Buka menu">
          <i class="fa-solid fa-bars"></i>
        </button>

        <div class="header-spacer"></div>

        <div class="header-user">
          <div class="header-user-text">
            <span class="header-user-greeting">Selamat datang,</span>
            <span class="header-user-name">{{ namaUser || 'Guru Pengampu' }}</span>
          </div>
          <div class="header-user-avatar">
            {{ userInitial }}
          </div>
        </div>
      </header>

      <div class="page-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/api';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();
const namaUser = ref('');
const isSidebarOpen = ref(false);

const userInitial = computed(() => {
  return namaUser.value ? namaUser.value.trim().charAt(0).toUpperCase() : 'G';
});

const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value; };
const closeSidebar = () => { isSidebarOpen.value = false; };

// Otomatis tutup sidebar (mode mobile) setiap kali pindah halaman
watch(() => route.fullPath, () => { closeSidebar(); });

onMounted(async () => {
  try {
    // Panggil route bawaan Laravel tadi
    const response = await api.get('/user');

    // Sesuaikan '.name' dengan nama kolom di tabel users database Anda
    // (misalnya response.data.name atau response.data.nama_lengkap)
    namaUser.value = response.data.name;

  } catch (error) {
    console.error('Gagal mengambil data profil:', error);
    // Opsional: Jika error (misal token kadaluarsa), paksa logout
    if (error.response && error.response.status === 401) {
       localStorage.removeItem('auth_token');
       router.push('/');
    }
  }
});

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
      localStorage.removeItem('nama_user');
      router.push('/');
    }
  });
};
</script>

<style scoped>
/* Style disamakan 100% dengan AdminLayout.vue untuk keselarasan ukuran dan warna */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #fcf8f2; /* Warna krem lembut khas aplikasi */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 260px;
  flex-shrink: 0;
  background-color: #1E5631; /* Hijau Tua */
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  padding: 20px;
  background-color: #143d22; /* Hijau Lebih Tua */
  border-bottom: 2px solid #689F38;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.brand-icon {
  font-size: 24px;
  color: #FBC02D;
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-text h3 {
  margin: 0;
  font-size: 17px;
  color: white;
  line-height: 1.3;
  white-space: nowrap;
}

.brand-text span {
  font-size: 11.5px;
  color: #c5e1a5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-close-sidebar {
  display: none;
  background: none;
  border: none;
  color: #FFE0B2;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}
.btn-close-sidebar:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 14px 10px;
  overflow-y: auto;
  gap: 3px;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}
.sidebar-nav::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.nav-item {
  padding: 12px 15px;
  color: #FFE0B2;
  text-decoration: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14.5px;
  border-left: 3px solid transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.nav-item i {
  width: 18px;
  text-align: center;
  font-size: 15px;
  flex-shrink: 0;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: white;
}

.nav-item.router-link-active {
  background-color: #689F38; /* Hijau Muda */
  color: white;
  border-left-color: #FBC02D; /* Garis Kuning Emas Aktif */
  font-weight: 600;
}

.sidebar-footer {
  padding: 14px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.btn-logout {
  width: 100%;
  padding: 12px 15px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14.5px;
  color: #ffcdd2;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-logout i {
  width: 18px;
  text-align: center;
  font-size: 15px;
}

.btn-logout:hover {
  background-color: rgba(217, 83, 79, 0.25);
  color: #ff8a80;
}

/* ===== OVERLAY (mode mobile) ===== */
.sidebar-overlay {
  display: none;
}

/* ===== AREA UTAMA ===== */
.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.main-header {
  display: flex;
  align-items: center;
  padding: 14px 30px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #FFE0B2;
  position: sticky;
  top: 0;
  z-index: 5;
}

.header-spacer {
  flex: 1;
}

.btn-menu-toggle {
  display: none;
  background: none;
  border: none;
  color: #1E5631;
  font-size: 20px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  margin-right: 10px;
}
.btn-menu-toggle:hover {
  background-color: #fcf8f2;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-user-text {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.3;
}

.header-user-greeting {
  font-size: 11.5px;
  color: #999;
}

.header-user-name {
  font-size: 14.5px;
  font-weight: bold;
  color: #1E5631;
}

.header-user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: #1E5631;
  color: #FBC02D;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 15px;
  flex-shrink: 0;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ===== RESPONSIVE (tablet & mobile) ===== */
@media (max-width: 992px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 30;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .btn-close-sidebar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .btn-menu-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 25;
  }

  .main-header {
    padding: 14px 16px;
  }
}

@media (max-width: 480px) {
  .header-user-text {
    display: none;
  }
}
</style>