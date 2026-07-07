<template>
  <div>
    <div class="card-box">
      <h2>{{ isEditMode ? 'Edit Data Guru' : 'Tambah Data Guru Baru' }}</h2>
      <form @submit.prevent="simpanGuru" class="form-inline">
        
        <div class="input-group">
          <input v-model="form.name" type="text" placeholder="Nama Lengkap Guru" required />
          <small v-if="validationErrors.name" class="error-text">{{ validationErrors.name[0] }}</small>
        </div>

        <div class="input-group">
          <input v-model="form.email" type="email" placeholder="Email Guru" required />
          <small v-if="validationErrors.email" class="error-text">{{ validationErrors.email[0] }}</small>
        </div>

        <div class="input-group">
          <input v-model="form.password" type="password" :placeholder="isEditMode ? 'Kosongkan jika tak ganti' : 'Password Akun'" :required="!isEditMode" />
          <small v-if="validationErrors.password" class="error-text">{{ validationErrors.password[0] }}</small>
        </div>

        <div class="button-group">
          <button type="submit" :style="{ backgroundColor: isEditMode ? '#FBC02D' : '#1E5631', color: isEditMode ? '#1E5631' : 'white' }">
            {{ isEditMode ? 'Update Guru' : 'Simpan Guru' }}
          </button>
          <button v-if="isEditMode" type="button" @click="batalEdit" class="btn-cancel">Batal</button>
        </div>
        
      </form>
    </div>

<div class="card-box table-container">
      <div class="table-header-actions">
        <h2>Daftar Guru Terdaftar</h2>
        
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input 
            v-model="searchQuery" 
            @input="handleSearch" 
            type="text" 
            placeholder="Cari nama atau email..." 
          />
        </div>
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th style="width: 60px;">No</th>
              <th>Nama</th>
              <th>Email</th>
              <th style="width: 180px;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(g, index) in listGuru" :key="g.id">
              <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
              <td>{{ g.name }}</td>
              <td>{{ g.email }}</td>
              <td>
                <button @click="editGuru(g)" class="btn-edit"><i class="fa-solid fa-pen"></i> Edit</button>
                <button @click="hapusGuru(g.id)" class="btn-delete"><i class="fa-solid fa-trash"></i> Hapus</button>
              </td>
            </tr>
            <tr v-if="listGuru.length === 0">
              <td colspan="4" style="text-align: center; color: #689F38; padding: 30px;">
                Data guru tidak ditemukan atau belum ada.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-container" v-if="lastPage > 1">
        <button :disabled="currentPage === 1" @click="gantiHalaman(currentPage - 1)" class="page-btn">
          <i class="fa-solid fa-chevron-left"></i> Sebelumnya
        </button>
        
        <button 
          v-for="page in lastPage" 
          :key="page" 
          @click="gantiHalaman(page)"
          :class="['page-number', { active: currentPage === page }]"
        >
          {{ page }}
        </button>

        <button :disabled="currentPage === lastPage" @click="gantiHalaman(currentPage + 1)" class="page-btn">
          Berikutnya <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import Swal from 'sweetalert2';

// Toast Configuration
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#1E5631', 
  color: '#FFE0B2',      
  iconColor: '#FBC02D',  
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

// State Management
const listGuru = ref([]);
const form = ref({ name: '', email: '', password: '' });
const isEditMode = ref(false);
const editId = ref(null);
const validationErrors = ref({}); 

// State Pencarian & Paginasi
const searchQuery = ref('');
const currentPage = ref(1);
const lastPage = ref(1);
const perPage = ref(10);
let searchTimeout = null;

// Fungsi Ambil Data (Mendukung Query Parameter)
const muatDataGuru = async () => {
  try {
    const response = await api.get('/guru', {
      params: {
        page: currentPage.value,
        search: searchQuery.value
      }
    });
    
    // Mendukung format standard Laravel Pagination maupun API Resource Meta
    if (response.data.meta) {
      listGuru.value = response.data.data;
      lastPage.value = response.data.meta.last_page;
      perPage.value = response.data.meta.per_page;
    } else {
      listGuru.value = response.data.data || response.data;
      lastPage.value = response.data.last_page || 1;
      perPage.value = response.data.per_page || 10;
    }
  } catch (error) {
    console.error("Gagal mengambil data guru", error);
  }
};

// Sistem Debounce Pencarian (Menunggu 500ms setelah ketikan berhenti baru tembak API)
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1; // Kembalikan ke halaman 1 setiap kali mencari kata baru
    muatDataGuru();
  }, 500);
};

// Pindah Halaman Tabel
const gantiHalaman = (page) => {
  if (page >= 1 && page <= lastPage.value) {
    currentPage.value = page;
    muatDataGuru();
  }
};

const simpanGuru = async () => {
  validationErrors.value = {}; 
  try {
    if (isEditMode.value) {
      await api.put(`/guru/${editId.value}`, form.value);
      Toast.fire({ icon: 'success', title: 'Data guru berhasil diperbarui!' });
    } else {
      await api.post('/guru', form.value);
      Toast.fire({ icon: 'success', title: 'Guru baru berhasil ditambahkan!' });
    }
    batalEdit();
    muatDataGuru();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      validationErrors.value = error.response.data.errors; 
      Swal.fire({
        title: 'Validasi Gagal',
        text: 'Silakan periksa kembali isian form Anda.',
        icon: 'warning',
        confirmButtonColor: '#1E5631',
        background: '#FFE0B2',
        color: '#1E5631',
        iconColor: '#d9534f'
      });
    } else {
      Toast.fire({ icon: 'error', title: 'Terjadi kesalahan pada server.' });
    }
  }
};

const editGuru = (guru) => {
  isEditMode.value = true;
  editId.value = guru.id;
  validationErrors.value = {}; 
  form.value = { name: guru.name, email: guru.email, password: '' };
};

const batalEdit = () => {
  isEditMode.value = false;
  editId.value = null;
  validationErrors.value = {};
  form.value = { name: '', email: '', password: '' };
};

const hapusGuru = async (id) => {
  const result = await Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Data yang dihapus tidak dapat dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d9534f',
    cancelButtonColor: '#1E5631', 
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
    background: '#FFE0B2',
    color: '#1E5631',
    iconColor: '#d9534f'
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/guru/${id}`);
      Toast.fire({ icon: 'success', title: 'Data guru telah dihapus.' });
      muatDataGuru();
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Gagal menghapus data.' });
    }
  }
};

onMounted(muatDataGuru);
</script>

<style scoped>
.card-box { 
  background-color: white; 
  padding: 25px; 
  border-radius: 10px; 
  border-top: 5px solid #FBC02D; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.05); 
  margin-bottom: 25px; 
  box-sizing: border-box;
}
h2 { color: #1E5631; margin-top: 0; margin-bottom: 15px; font-size: 20px; }

.form-inline { display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-start; }
.input-group { display: flex; flex-direction: column; flex: 1; min-width: 180px; }
.input-group input { padding: 10px; border: 1px solid #689F38; border-radius: 5px; font-size: 14px; }
.error-text { color: #d9534f; font-size: 12px; margin-top: 5px; font-weight: bold; }

.button-group { display: flex; gap: 10px; }
.button-group button { border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px; }
.btn-cancel { background-color: #d9534f; color: white; }

/* Perbaikan wadah judul & search bar agar aman masuk layout */
.table-header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  width: 100%;
}
.table-header-actions h2 { margin-bottom: 0; }

.search-box {
  position: relative;
  width: 280px;
  max-width: 100%;
}
.search-box input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid #689F38;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}
.search-box input:focus {
  border-color: #1E5631;
  box-shadow: 0 0 5px rgba(30, 86, 49, 0.2);
}
.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #689F38;
  font-size: 14px;
}

/* Penyelaras Lebar Tabel */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}
table { width: 100%; border-collapse: collapse; margin-top: 5px; }
th { background-color: #1E5631; color: white; padding: 12px; text-align: left; font-size: 14px; }
td { padding: 12px; border-bottom: 1px solid #FFE0B2; color: #333; font-size: 14px; vertical-align: middle; }

/* Tombol Aksi */
.btn-edit { background-color: #FBC02D; color: #1E5631; border: none; padding: 8px 14px; border-radius: 4px; cursor: pointer; margin-right: 5px; font-weight: bold; font-size: 13px; }
.btn-edit:hover { background-color: #f7b013; }
.btn-delete { background-color: #d9534f; color: white; border: none; padding: 8px 14px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px; }
.btn-delete:hover { background-color: #c9302c; }

/* Komponen Paginasi */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 25px;
}
.page-btn {
  background-color: white;
  border: 1px solid #689F38;
  color: #1E5631;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  transition: 0.2s;
}
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-btn:not(:disabled):hover { background-color: #FFE0B2; }
.page-number {
  background-color: white;
  border: 1px solid #689F38;
  color: #1E5631;
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
}
.page-number:hover { background-color: #FFE0B2; }
.page-number.active { background-color: #1E5631; color: white; border-color: #1E5631; }
</style>