<template>
  <div class="content-body">
    
    <div class="card-box">
      <h2>{{ isEditMode ? 'Edit Plotting Mengajar' : 'Tambah Plotting Baru' }}</h2>
      <form @submit.prevent="simpanPlotting" class="form-grid">
        
        <div class="input-group">
          <label>Tahun Pelajaran</label>
          <select v-model="form.tahun_pelajaran_id" required>
            <option value="" disabled>-- Pilih Tahun --</option>
            <option v-for="t in listTahun" :key="t.id" :value="t.id">
              {{ t.nama_tahun }} {{ t.is_active ? '(Aktif)' : '' }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <label>Guru Pengampu</label>
          <select v-model="form.guru_id" required>
            <option value="" disabled>-- Pilih Guru --</option>
            <option v-for="g in listGuru" :key="g.id" :value="g.id">{{ g.name }}</option>
          </select>
        </div>

        <div class="input-group">
          <label>Mata Pelajaran</label>
          <select v-model="form.mapel_id" required>
            <option value="" disabled>-- Pilih Mapel --</option>
            <option v-for="m in listMapel" :key="m.id" :value="m.id">{{ m.nama_mapel }}</option>
          </select>
        </div>

       <div class="input-group">
          <label>Kelas yang Diampu (Bisa pilih lebih dari satu)</label>
          <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 5px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            <label v-for="k in listKelas" :key="k.id" style="display: flex; align-items: center; gap: 5px; cursor: pointer; font-size: 14px;">
              <input type="checkbox" :value="k.id" v-model="form.kelas_ids">
              {{ k.nama_kelas }}
            </label>
          </div>
          <p v-if="form.kelas_ids.length === 0" style="color: #e65100; font-size: 12px; margin-top: 5px;">*Minimal pilih 1 kelas</p>
        </div>

        <div class="input-group">
          <label>JP per Minggu</label>
          <input 
            type="number" 
            v-model.number="form.jp_per_minggu" 
            required 
            min="1" 
            placeholder="Contoh: 6" 
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="isSaving">
            <i class="fa-solid fa-save"></i> {{ isSaving ? 'Menyimpan...' : (isEditMode ? 'Update Plotting' : 'Simpan Plotting') }}
          </button>
          <button type="button" @click="resetForm" class="btn-cancel" v-if="isEditMode" :disabled="isSaving">
            Batal Edit
          </button>
        </div>
      </form>
    </div>

    <div class="card-box filter-section">
      <div class="filter-group">
        <label>Filter Tahun Pelajaran</label>
        <select v-model="filterTahun" @change="muatDataPlotting(1)">
          <option value="">Semua Tahun</option>
          <option v-for="t in listTahun" :key="t.id" :value="t.id">{{ t.nama_tahun }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Cari Guru / Mapel</label>
        <div class="search-box">
          <i class="fa-solid fa-search search-icon"></i>
          <input type="text" v-model="searchQuery" placeholder="Ketik nama..." @keyup.enter="muatDataPlotting(1)" />
          <button @click="muatDataPlotting(1)" class="btn-search">Cari</button>
        </div>
      </div>
    </div>

    <div class="card-box">
      <h3>Daftar Plotting Mengajar</h3>
      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i> Memuat data plotting...
      </div>
      <table v-else class="table-plotting">
        <thead>
          <tr>
            <th>Tahun Ajaran</th>
            <th>Nama Guru</th>
            <th>Mata Pelajaran</th>
            <th>Kelas</th>
            <th style="text-align: center;">JP/Minggu</th> 
            <th width="150px" style="text-align: center;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="listPlotting.length === 0">
            <td colspan="6" class="empty-data">Belum ada data plotting ditemukan.</td>
          </tr>
          <tr v-for="plotting in listPlotting" :key="plotting.id">
            <td><span class="badge-tahun">{{ plotting.tahun_pelajaran }}</span></td>
            <td class="nama-guru">{{ plotting.guru }}</td>
            <td><span class="badge-mapel">{{ plotting.mapel }}</span></td>
            <td>
            <div style="display: flex; flex-wrap: wrap; gap: 5px;">
              <span v-for="kelas in plotting.list_kelas" :key="kelas.id" class="badge-kelas">
                {{ kelas.nama_kelas }}
              </span>
            </div>
          </td>
            
            <td style="font-weight: bold; color: #e65100; text-align: center;">
              {{ plotting.jp_per_minggu }} JP
            </td>
            
            <td style="text-align: center;">
              <button @click="editPlotting(plotting)" class="btn-action btn-edit" title="Edit">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button @click="hapusPlotting(plotting.id)" class="btn-action btn-delete" title="Hapus">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination-wrapper" v-if="pagination.last_page > 1">
        <span class="pagination-info">Menampilkan halaman {{ pagination.current_page }} dari {{ pagination.last_page }}</span>
        <div class="pagination-buttons">
          <button 
            :disabled="pagination.current_page === 1" 
            @click="gantiHalaman(pagination.current_page - 1)" 
            class="btn-page">
            <i class="fa-solid fa-chevron-left"></i> Prev
          </button>
          
          <button 
            v-for="page in pagination.last_page" 
            :key="page"
            :class="['btn-page', { 'active-page': page === pagination.current_page }]"
            @click="gantiHalaman(page)">
            {{ page }}
          </button>

          <button 
            :disabled="pagination.current_page === pagination.last_page" 
            @click="gantiHalaman(pagination.current_page + 1)" 
            class="btn-page">
            Next <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import Swal from 'sweetalert2';

// 🟢 Toast Tema Warna Aplikasi (Sama seperti MapelView)
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

// State Data Master (Dropdown)
const listTahun = ref([]);
const listGuru = ref([]);
const listMapel = ref([]);
const listKelas = ref([]);

// State Data Plotting & Pagination
const listPlotting = ref([]);
const isLoading = ref(false);
const pagination = ref({
  current_page: 1,
  last_page: 1
});

// State Filter & Pencarian
const filterTahun = ref('');
const searchQuery = ref('');

// State Form
const isEditMode = ref(false);
const isSaving = ref(false);
const editId = ref(null);
const form = ref({
  tahun_pelajaran_id: '',
  guru_id: '',
  mapel_id: '',
  kelas_ids: [],
  jp_per_minggu: ''
});

// --- Fungsi Memuat Data ---
const muatDataMaster = async () => {
  try {
    const [resTahun, resGuru, resMapel, resKelas] = await Promise.all([
      api.get('/tahun-pelajaran'),
      api.get('/guru'),
      api.get('/mapel'),
      api.get('/kelas')
    ]);
    listTahun.value = resTahun.data.data || resTahun.data;
    listGuru.value = resGuru.data.data || resGuru.data;
    listMapel.value = resMapel.data.data || resMapel.data;
    listKelas.value = resKelas.data.data || resKelas.data;

    const tahunAktif = listTahun.value.find(t => t.is_active === 1);
    if (tahunAktif) filterTahun.value = tahunAktif.id;

  } catch (error) {
    console.error("Gagal memuat data master", error);
    // 🟢 Menggunakan Toast Alih-alih Alert Box Besar
    Toast.fire({ icon: 'error', title: 'Gagal memuat data master (Tahun/Guru/Mapel/Kelas).' });
  }
};

const muatDataPlotting = async (page = 1) => {
  isLoading.value = true;
  try {
    const response = await api.get('/plotting', {
      params: {
        page: page,
        tahun_pelajaran_id: filterTahun.value,
        search: searchQuery.value,
        per_page: 10
      }
    });
    listPlotting.value = response.data.data;
    pagination.value = response.data.meta;
  } catch (error) {
    console.error("Gagal memuat data plotting", error);
    Toast.fire({ icon: 'error', title: 'Gagal memuat tabel plotting.' });
  } finally {
    isLoading.value = false;
  }
};

const gantiHalaman = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    muatDataPlotting(page);
  }
};

// --- Fungsi Form (Submit, Edit, Reset, Hapus) ---
const simpanPlotting = async () => {
  isSaving.value = true;
  try {
    if (isEditMode.value) {
      await api.put(`/plotting/${editId.value}`, form.value);
      Toast.fire({ icon: 'success', title: 'Data plotting berhasil diperbarui!' }); // 🟢 Toast Success
    } else {
      await api.post('/plotting', form.value);
      Toast.fire({ icon: 'success', title: 'Plotting baru berhasil ditambahkan!' }); // 🟢 Toast Success
    }
    resetForm();
    muatDataPlotting(pagination.value.current_page);
  } catch (error) {
    console.error("Gagal menyimpan plotting", error);
    // 🟢 Desain Alert Validasi Seragam dengan MataPelajaran
    if (error.response && error.response.status === 422) {
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
      Toast.fire({ icon: 'error', title: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.' });
    }
  } finally {
    isSaving.value = false;
  }
};

const editPlotting = (plotting) => {
  isEditMode.value = true;
  editId.value = plotting.id;
  form.value = {
    tahun_pelajaran_id: plotting.tahun_pelajaran_id,
    guru_id: plotting.guru_id,
    mapel_id: plotting.mapel_id,
    kelas_ids: plotting.list_kelas ? plotting.list_kelas.map(k => k.id) : [],
    jp_per_minggu: plotting.jp_per_minggu
  };
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const hapusPlotting = async (id) => {
  // 🟢 Desain Pop-up Hapus yang Elegan dan Seragam
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
      await api.delete(`/plotting/${id}`);
      Toast.fire({ icon: 'success', title: 'Data plotting telah dihapus.' });
      
      if (listPlotting.value.length === 1 && pagination.value.current_page > 1) {
        muatDataPlotting(pagination.value.current_page - 1);
      } else {
        muatDataPlotting(pagination.value.current_page);
      }
    } catch (error) {
      console.error("Gagal menghapus plotting", error);
      Toast.fire({ icon: 'error', title: 'Terjadi kesalahan saat menghapus data.' });
    }
  }
};

const resetForm = () => {
  isEditMode.value = false;
  editId.value = null;
  form.value = {
    tahun_pelajaran_id: filterTahun.value || '',
    guru_id: '',
    mapel_id: '',
    kelas_ids: [],
    jp_per_minggu: ''
  };
};

onMounted(async () => {
  await muatDataMaster();
  muatDataPlotting();
});
</script>

<style scoped>
.content-body { padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; min-height: 100vh; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; border-top: 4px solid #689F38; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 25px; }
h2 { margin-top: 0; color: #1E5631; font-size: 22px; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
h3 { margin-top: 0; color: #1E5631; font-size: 18px; margin-bottom: 15px; }

/* Form Styles */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.input-group { display: flex; flex-direction: column; gap: 5px; }
.input-group label { font-size: 13.5px; font-weight: bold; color: #444; }

.input-group select, .input-group input[type="number"] { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; outline: none; background-color: #f9f9f9; font-size: 14px; transition: 0.3s; box-sizing: border-box; }
.input-group select:focus, .input-group input[type="number"]:focus { border-color: #689F38; background-color: white; box-shadow: 0 0 0 3px rgba(104,159,56,0.1); }

.form-actions { grid-column: 1 / -1; display: flex; gap: 10px; margin-top: 10px; }
.btn-submit { background-color: #1E5631; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
.btn-submit:hover:not(:disabled) { background-color: #689F38; transform: translateY(-1px); }
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-cancel { background-color: #f5f5f5; color: #333; border: 1px solid #ccc; padding: 12px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s; }
.btn-cancel:hover { background-color: #e0e0e0; }

/* Filter Styles */
.filter-section { display: flex; gap: 20px; flex-wrap: wrap; background-color: #fdfaf6; border-top: 4px solid #FBC02D; }
.filter-group { flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 5px; }
.filter-group label { font-size: 13px; font-weight: bold; color: #666; }
.filter-group select { padding: 9px; border-radius: 5px; border: 1px solid #ccc; font-size: 14px; outline: none; }
.search-box { display: flex; align-items: center; background: white; border: 1px solid #ccc; border-radius: 5px; overflow: hidden; }
.search-icon { padding: 0 10px; color: #888; }
.search-box input { flex: 1; border: none; padding: 9px 5px; outline: none; font-size: 14px; }
.btn-search { background: #FBC02D; border: none; padding: 0 15px; font-weight: bold; color: #333; cursor: pointer; transition: 0.2s; align-self: stretch; }
.btn-search:hover { background: #f9a825; }

/* Table Styles */
.table-plotting { width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #eee; }
.table-plotting th { background-color: #1E5631; color: white; padding: 12px; font-size: 14px; text-align: left; }
.table-plotting td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; vertical-align: middle; }
.table-plotting tr:hover { background-color: #f9f9f9; }
.nama-guru { font-weight: bold; color: #1E5631; }
.empty-data { text-align: center; color: #888; font-style: italic; padding: 30px !important; }

/* Badges */
.badge-tahun { background-color: #e3f2fd; color: #1565c0; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; border: 1px solid #bbdefb; }
.badge-mapel { background-color: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; border: 1px solid #c8e6c9; }
.badge-kelas { background-color: #fff3e0; color: #e65100; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; border: 1px solid #ffe0b2; }

/* Pagination Styles */
.pagination-wrapper { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 15px; flex-wrap: wrap; gap: 15px; }
.pagination-info { font-size: 13px; color: #666; }
.pagination-buttons { display: flex; gap: 5px; }
.btn-page { background-color: white; color: #1E5631; border: 1px solid #689F38; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; }
.btn-page:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-page:hover:not(:disabled) { background-color: #e8f5e9; }
.active-page { background-color: #689F38; color: white; }

/* Action Buttons in Table */
.btn-action { width: 32px; height: 32px; border-radius: 4px; border: none; color: white; cursor: pointer; display: inline-flex; justify-content: center; align-items: center; margin: 0 3px; transition: 0.2s; }
.btn-edit { background-color: #FBC02D; color: #333; }
.btn-edit:hover { background-color: #f9a825; }
.btn-delete { background-color: #d9534f; }
.btn-delete:hover { background-color: #c9302c; }

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
  .table-plotting { display: block; overflow-x: auto; white-space: nowrap; }
}
</style>