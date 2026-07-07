<template>
  <div class="admin-layout"> <aside class="sidebar">
      <div class="sidebar-header">
        <h3>Menu Guru</h3>
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
          <i class="fa-solid fa-calendar-calendar"></i> Prota & Prosem
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
        
        <button @click="handleLogout" class="btn-logout nav-item" style="color: #ff8a80; cursor: pointer; background: none; border: none; width: 100%; text-align: left; margin-top: 30px;">
          <i class="fa-solid fa-right-from-bracket"></i> Keluar Aplikasi
        </button>
      </nav>
    </aside>

    <main class="main-content">
      <header class="main-header" style="display: flex; justify-content: flex-end; align-items: center; padding: 15px 30px; background-color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-bottom: 1px solid #FFE0B2;">
        <div class="header-user" style="display: flex; align-items: center; gap: 10px; color: #1E5631; font-weight: bold;">
          <i class="fa-solid fa-circle-user" style="font-size: 20px;"></i>
          <span>Portal Guru Pengampu</span>
        </div>
      </header>
      
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

const handleLogout = async () => {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    try {
      localStorage.removeItem('auth_token');
      router.push('/');
    } catch (error) {
      console.error('Logout gagal:', error);
    }
  }
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

.sidebar {
  width: 260px;
  background-color: #1E5631; /* Hijau Tua */
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
}

.sidebar-header {
  padding: 20px;
  background-color: #143d22; /* Hijau Lebih Tua */
  text-align: center;
  border-bottom: 2px solid #689F38;
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

/* Area Utama */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>