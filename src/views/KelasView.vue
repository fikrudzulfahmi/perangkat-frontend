<template>
  <div class="content-body">
    
    <div class="card-box">
      <h2>{{ isEditMode ? 'Edit Data Kelas' : 'Tambah Kelas Baru' }}</h2>
      <form @submit.prevent="simpanKelas" class="form-inline">
        
        <div class="input-group">
          <input v-model="form.nama_kelas" type="text" placeholder="Nama Kelas (Contoh: X-RPL 1)" required />
          <small v-if="validationErrors.nama_kelas" class="error-text">{{ validationErrors.nama_kelas[0] }}</small>
        </div>

        <div class="button-group">
          <button type="submit" :style="{ backgroundColor: isEditMode ? '#FBC02D' : '#1E5631', color: isEditMode ? '#1E5631' : 'white' }">
            {{ isEditMode ? 'Update Kelas' : 'Simpan Kelas' }}
          </button>
          <button v-if="isEditMode" type="button" @click="batalEdit" class="btn-cancel">Batal</button>
        </div>
        
      </form>
    </div>

    <div class="card-box table-container">
      <div class="table-header-actions" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h2 style="margin: 0;">Daftar Kelas</h2>
        
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            @input="handleSearch" 
            type="text" 
            placeholder="Cari nama kelas..." 
            style="padding: 8px 12px; border: 1px solid #689F38; border-radius: 5px; width: 220px;"
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 80px;">No</th>
            <th>Nama Kelas</th>
            <th style="width: 200px;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(k, index) in listKelas" :key="k.id">
            <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
            <td><strong>{{ k.nama_kelas }}</strong></td>
            <td>
              <button @click="editKelas(k)" class="btn-edit" style="background-color: #FBC02D; color: #1E5631; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;"><i class="fa-solid fa-pen"></i> Edit</button>
              <button @click="hapusKelas(k.id)" class="btn-delete"><i class="fa-solid fa-trash"></i> Hapus</button>
            </td>
          </tr>
          <tr v-if="listKelas.length === 0">
            <td colspan="3" style="text-align: center; color: #689F38;">Belum ada data kelas.</td>
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

const listKelas = ref([]);
const form = ref({ nama_kelas: '' });
const isEditMode = ref(false);
const editId = ref(null);
const validationErrors = ref({}); 

const searchQuery = ref('');
const currentPage = ref(1);
const lastPage = ref(1);
const perPage = ref(10);
let searchTimeout = null;

const muatDataKelas = async () => {
  try {
    const response = await api.get('/kelas', {
      params: { page: currentPage.value, search: searchQuery.value }
    });
    listKelas.value = response.data.data;
    lastPage.value = response.data.meta.last_page;
    perPage.value = response.data.meta.per_page;
  } catch (error) {
    console.error("Gagal mengambil data kelas", error);
  }
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1; 
    muatDataKelas();
  }, 500);
};

const gantiHalaman = (page) => {
  if (page >= 1 && page <= lastPage.value) {
    currentPage.value = page;
    muatDataKelas();
  }
};

const simpanKelas = async () => {
  validationErrors.value = {}; 
  try {
    if (isEditMode.value) {
      await api.put(`/kelas/${editId.value}`, form.value);
      Toast.fire({ icon: 'success', title: 'Data kelas berhasil diperbarui!' });
    } else {
      await api.post('/kelas', form.value);
      Toast.fire({ icon: 'success', title: 'Kelas baru berhasil ditambahkan!' });
    }
    batalEdit();
    muatDataKelas();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      validationErrors.value = error.response.data.errors; 
      Swal.fire({
        title: 'Validasi Gagal',
        text: 'Silakan periksa kembali isian form Anda.',
        icon: 'warning',
        confirmButtonColor: '#1E5631',
        background: '#FFE0B2',
        color: '#1E5631'
      });
    } else {
      Toast.fire({ icon: 'error', title: 'Terjadi kesalahan pada server.' });
    }
  }
};

const editKelas = (kelas) => {
  isEditMode.value = true;
  editId.value = kelas.id; 
  validationErrors.value = {}; 
  form.value = { nama_kelas: kelas.nama_kelas };
};

const batalEdit = () => {
  isEditMode.value = false;
  editId.value = null;
  validationErrors.value = {};
  form.value = { nama_kelas: '' };
};

const hapusKelas = async (id) => {
  const result = await Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Data kelas yang dihapus tidak bisa dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d9534f', 
    cancelButtonColor: '#1E5631',  
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
    background: '#FFE0B2',
    color: '#1E5631'
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/kelas/${id}`); 
      Toast.fire({ icon: 'success', title: 'Data kelas telah dihapus.' });
      muatDataKelas();
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Gagal menghapus data kelas.' });
    }
  }
};

onMounted(muatDataKelas);
</script>

<style scoped>
.content-body { padding: 0; font-family: 'Segoe UI', sans-serif; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; border-top: 5px solid #FBC02D; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin-bottom: 25px; }
h2 { color: #1E5631; margin-bottom: 15px; font-size: 20px; }
.form-inline { display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-start; }
.form-inline input { flex: 1; min-width: 180px; padding: 10px; border: 1px solid #689F38; border-radius: 5px; }
.form-inline button { background-color: #1E5631; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; }
.form-inline button:hover { background-color: #689F38; }
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th { background-color: #1E5631; color: white; padding: 12px; text-align: left; }
td { padding: 12px; border-bottom: 1px solid #FFE0B2; color: #333; }
.btn-delete { background-color: #d9534f; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
.btn-delete:hover { background-color: #c9302c; }
.input-group { display: flex; flex-direction: column; flex: 1; min-width: 180px; }
.error-text { color: #d9534f; font-size: 12px; margin-top: 5px; font-weight: bold; }
.button-group { display: flex; gap: 10px; }
.btn-cancel { background-color: #d9534f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; }
.btn-page { background-color: white; color: #1E5631; border: 1px solid #689F38; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 13px; }
.btn-page:disabled { opacity: 0.5; cursor: not-allowed; }
</style>