<template>
  <div class="content-body">
    
    <div class="card-box">
      <h2>{{ isEditMode ? 'Edit Tahun Pelajaran' : 'Tambah Tahun Pelajaran' }}</h2>
     <form @submit.prevent="simpanTahun" class="form-grid">
        
        <div class="input-group">
          <label>Tahun Pelajaran</label>
          <input v-model="form.nama_tahun" type="text" placeholder="Contoh: 2026/2027" required />
          <small v-if="validationErrors.nama_tahun" class="error-text">{{ validationErrors.nama_tahun[0] }}</small>
        </div>

       

        <div class="input-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.is_active" class="custom-checkbox" />
            <span class="checkbox-text">Aktifkan Tahun Ini?</span>
          </label>
        </div>

        <div class="button-group">
          <button type="submit" class="btn-submit" :style="{ backgroundColor: isEditMode ? '#FBC02D' : '#1E5631', color: isEditMode ? '#1E5631' : 'white' }">
            <i :class="isEditMode ? 'fa-solid fa-pen' : 'fa-solid fa-save'"></i>
            {{ isEditMode ? 'Update' : 'Simpan' }}
          </button>
          <button v-if="isEditMode" type="button" @click="batalEdit" class="btn-cancel">Batal</button>
        </div>
        
      </form>
    </div>

    <div class="card-box table-container">
      <div class="table-header-actions" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h2 style="margin: 0;">Daftar Tahun Pelajaran</h2>
        
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            @input="handleSearch" 
            type="text" 
            placeholder="Cari tahun..." 
            style="padding: 8px 12px; border: 1px solid #689F38; border-radius: 5px; width: 220px;"
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 60px;">No</th>
            <th>Tahun Pelajaran</th>
            <th>Status</th>
            <th style="width: 180px;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(t, index) in listTahun" :key="t.id">
            <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
            <td><strong>{{ t.nama_tahun }}</strong></td>
            <td>
              <span v-if="t.is_active" style="background-color: #1E5631; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                <i class="fa-solid fa-check-circle"></i> Aktif
              </span>
              <span v-else style="background-color: #9e9e9e; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
                Nonaktif
              </span>
            </td>
            <td>
              <button @click="editTahun(t)" class="btn-edit" style="background-color: #FBC02D; color: #1E5631; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;"><i class="fa-solid fa-pen"></i></button>
              <button @click="hapusTahun(t.id)" class="btn-delete"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
          <tr v-if="listTahun.length === 0">
            <td colspan="5" style="text-align: center; color: #689F38;">Belum ada data tahun pelajaran.</td>
          </tr>
        </tbody>
      </table>

      <div class="pagination-container" v-if="lastPage > 1" style="display: flex; justify-content: center; gap: 5px; margin-top: 15px;">
        <button :disabled="currentPage === 1" @click="gantiHalaman(currentPage - 1)" class="btn-page">Sebelumnya</button>
        <button 
          v-for="page in lastPage" 
          :key="page" 
          @click="gantiHalaman(page)" 
          :style="{ backgroundColor: currentPage === page ? '#1E5631' : 'white', color: currentPage === page ? 'white' : '#1E5631', border: '1px solid #689F38', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }"
        >
          {{ page }}
        </button>
        <button :disabled="currentPage === lastPage" @click="gantiHalaman(currentPage + 1)" class="btn-page">Berikutnya</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#1E5631', 
  color: '#FFE0B2',      
  iconColor: '#FBC02D'
});

const listTahun = ref([]);
const form = ref({ nama_tahun: '', is_active: false });
const isEditMode = ref(false);
const editId = ref(null);
const validationErrors = ref({}); 

const searchQuery = ref('');
const currentPage = ref(1);
const lastPage = ref(1);
const perPage = ref(10);
let searchTimeout = null;

const muatDataTahun = async () => {
  try {
    const response = await api.get('/tahun-pelajaran', {
      params: { page: currentPage.value, search: searchQuery.value }
    });
    listTahun.value = response.data.data;
    lastPage.value = response.data.meta.last_page;
    perPage.value = response.data.meta.per_page;
  } catch (error) {
    console.error("Gagal mengambil data", error);
  }
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1; 
    muatDataTahun();
  }, 500);
};

const gantiHalaman = (page) => {
  if (page >= 1 && page <= lastPage.value) {
    currentPage.value = page;
    muatDataTahun();
  }
};

const simpanTahun = async () => {
  validationErrors.value = {}; 
  try {
    if (isEditMode.value) {
      await api.put(`/tahun-pelajaran/${editId.value}`, form.value);
      Toast.fire({ icon: 'success', title: 'Data berhasil diperbarui!' });
    } else {
      await api.post('/tahun-pelajaran', form.value);
      Toast.fire({ icon: 'success', title: 'Data baru berhasil ditambahkan!' });
    }
    batalEdit();
    muatDataTahun();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      validationErrors.value = error.response.data.errors; 
      Swal.fire({
        title: 'Validasi Gagal', text: 'Periksa isian form Anda.', icon: 'warning', confirmButtonColor: '#1E5631', background: '#FFE0B2', color: '#1E5631'
      });
    } else {
      Toast.fire({ icon: 'error', title: 'Kesalahan server.' });
    }
  }
};

const editTahun = (tahun) => {
  isEditMode.value = true;
  editId.value = tahun.id; 
  validationErrors.value = {}; 
  form.value = { 
    nama_tahun: tahun.nama_tahun, 
    semester: tahun.semester, 
    is_active: tahun.is_active 
  };
};

const batalEdit = () => {
  isEditMode.value = false;
  editId.value = null;
  validationErrors.value = {};
  form.value = { nama_tahun: '', semester: '', is_active: false };
};

const hapusTahun = async (id) => {
  const result = await Swal.fire({
    title: 'Hapus data?',
    text: "Tindakan ini tidak bisa dibatalkan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d9534f', 
    cancelButtonColor: '#1E5631',  
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
    background: '#FFE0B2', color: '#1E5631'
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/tahun-pelajaran/${id}`); 
      Toast.fire({ icon: 'success', title: 'Data telah dihapus.' });
      muatDataTahun();
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Gagal menghapus data.' });
    }
  }
};

onMounted(muatDataTahun);
</script>

<style scoped>
/* =========================================
   BASE STYLES & LAYOUT
========================================= */
.content-body { padding: 0; font-family: 'Segoe UI', sans-serif; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; border-top: 5px solid #FBC02D; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin-bottom: 25px; }
h2 { color: #1E5631; margin-bottom: 15px; font-size: 20px; }

/* =========================================
   FORM GRID (Perbaikan Total)
========================================= */
.form-grid {
  display: grid;
  grid-template-columns: 2fr 1fr auto auto; 
  gap: 15px;
  align-items: end; /* Meratakan semua elemen ke garis bawah yang sama */
  background-color: #f9fbf9; 
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.input-group {
  display: flex;
  flex-direction: column;
  position: relative; /* Penting untuk posisi pesan error */
  width: 100%;
}

.input-group label {
  font-size: 13px;
  color: #1E5631;
  font-weight: bold;
  margin-bottom: 6px;
}

/* Kunci Kerapian: box-sizing dan tinggi absolut */
.form-grid input[type="text"], 
.form-grid select {
  box-sizing: border-box; 
  padding: 0 12px;
  border: 1px solid #689F38;
  border-radius: 5px;
  font-size: 14px;
  height: 42px; /* Tinggi dibuat sama rata */
  width: 100%;
  outline: none;
}

/* Pesan Error Melayang agar tidak merusak tinggi form */
.error-text { 
  color: #d9534f; 
  font-size: 11px; 
  font-weight: bold; 
  position: absolute; 
  bottom: -18px; 
  left: 0; 
}

/* =========================================
   CHECKBOX & BUTTONS
========================================= */
.checkbox-group {
  height: 42px; 
  justify-content: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  height: 100%;
  margin: 0;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #1E5631;
  cursor: pointer;
  margin: 0;
}

.checkbox-text {
  color: #1E5631;
  font-weight: bold;
  white-space: nowrap;
  font-size: 14px;
}

.button-group {
  display: flex;
  gap: 10px;
  height: 42px;
}

.btn-submit, .btn-cancel {
  box-sizing: border-box;
  border: none;
  padding: 0 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  height: 42px; /* Tinggi disamakan dengan input */
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-submit:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-cancel { background-color: #d9534f; color: white; }
.btn-cancel:hover { background-color: #c9302c; }

/* =========================================
   TABLE STYLES
========================================= */
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th { background-color: #1E5631; color: white; padding: 12px; text-align: left; }
td { padding: 12px; border-bottom: 1px solid #FFE0B2; color: #333; }

.btn-delete { background-color: #d9534f; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
.btn-delete:hover { background-color: #c9302c; }
.btn-page { background-color: white; color: #1E5631; border: 1px solid #689F38; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 13px; }
.btn-page:disabled { opacity: 0.5; cursor: not-allowed; }

/* =========================================
   RESPONSIVE DESIGN (MOBILE)
========================================= */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr; /* Jadi 1 kolom bersusun ke bawah */
    align-items: start;
    gap: 25px; /* Jarak dijauhkan untuk pesan error */
  }
  .checkbox-group, .button-group { height: auto; }
  .btn-submit, .btn-cancel { width: 100%; }
}
</style>