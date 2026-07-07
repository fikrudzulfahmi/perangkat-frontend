<template>
  <div class="content-body">
    <div class="card-box table-container">
      
      <div class="filter-wrapper">
        <div class="filter-title">
          <h2>Manajemen Data Siswa</h2>
          <p class="sub-title">
            Tahun Pelajaran Aktif: 
            <span class="badge-aktif">{{ namaTahunAktif }}</span>
          </p>
        </div>
        
        <div class="filter-controls">
          <select v-model="filterKelas" @change="gantiFilter" class="filter-select">
            <option value="">-- Semua Kelas --</option>
            <option v-for="k in listKelas" :key="k.id" :value="k.id">
              {{ k.nama_kelas }}
            </option>
          </select>

          <div class="search-group">
            <input 
              v-model="searchQuery" 
              @input="lakukanPencarian" 
              type="text" 
              placeholder="Cari Nama / NISN..." 
              class="filter-search" 
            />
            <i class="fa-solid fa-search search-icon"></i>
          </div>

          <button 
            :disabled="!filterKelas || !tahunPelajaranId" 
            @click="tarikDataSiswa" 
            class="btn-sync" 
            title="Tarik data siswa kelas ini dari aplikasi induk"
          >
            <i class="fa-solid fa-cloud-download"></i> Tarik Siswa
          </button>
          
          <button 
            :disabled="!filterKelas || !tahunPelajaranId" 
            @click="hapusMasalKelas" 
            class="btn-bulk-delete" 
            title="Kosongkan siswa di kelas ini"
          >
            <i class="fa-solid fa-trash-can"></i> Kosongkan Kelas
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 60px;">No</th>
            <th>NISN</th>
            <th>NIS</th>
            <th>Nama Lengkap Siswa</th>
            <th>Kelas / Rombel</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, index) in listSiswa" :key="s.id">
            <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
            <td><code>{{ s.nisn || '-' }}</code></td>
            <td>{{ s.nis || '-' }}</td>
            <td><strong>{{ s.nama_siswa }}</strong></td>
            <td>
              <span class="badge-kelas">{{ s.kelas ? s.kelas.nama_kelas : '-' }}</span>
            </td>
          </tr>
          <tr v-if="listSiswa.length === 0">
            <td colspan="5" style="text-align: center; color: #d9534f; padding: 40px 0;">
              Tidak ada data siswa ditemukan. Silakan pilih kelas lalu klik "Tarik Siswa".
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination-wrapper" v-if="totalPage > 1">
        <span class="pagination-info">Menampilkan {{ listSiswa.length }} dari {{ totalRows }} data</span>
        <div class="pagination-buttons">
          <button 
            :disabled="currentPage === 1" 
            @click="gantiHalaman(currentPage - 1)" 
            class="btn-page"
          >
            Sebelumnya
          </button>
          <button 
            v-for="page in totalPage" 
            :key="page" 
            @click="gantiHalaman(page)" 
            :class="['btn-page', { 'active-page': currentPage === page }]"
          >
            {{ page }}
          </button>
          <button 
            :disabled="currentPage === totalPage" 
            @click="gantiHalaman(currentPage + 1)" 
            class="btn-page"
          >
            Selanjutnya
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

// --- STATE ---
const listSiswa = ref([]);
const listKelas = ref([]);
const tahunPelajaranId = ref('');
const namaTahunAktif = ref('-');

const filterKelas = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const totalPage = ref(1);
const totalRows = ref(0);
let searchTimer = null;

const Toast = Swal.mixin({
  toast: true, 
  position: 'top-end', 
  showConfirmButton: false, 
  timer: 3000,
  background: '#1E5631', 
  color: '#FFE0B2', 
  iconColor: '#FBC02D'
});

// --- FUNGSI LOAD AWAL ---
const muatDataAwal = async () => {
  try {
    const [resKelas, resTahun] = await Promise.all([
      api.get('/kelas', { params: { per_page: 200 } }),
      api.get('/tahun-pelajaran', { params: { per_page: 100 } })
    ]);
    
    listKelas.value = resKelas.data.data || resKelas.data;
    
    // Cari Tahun Pelajaran Aktif (Siswa hanya terkait ke tahun aktif)
    const dataTahun = resTahun.data.data || resTahun.data;
    const aktif = dataTahun.find(t => t.is_active === 1 || t.is_active === true);
    
    if (aktif) {
      tahunPelajaranId.value = aktif.id;
      namaTahunAktif.value = `${aktif.nama_tahun} (${aktif.semester})`;
    } else {
      namaTahunAktif.value = "Belum Ada Tahun Aktif!";
    }

    muatSiswa();
  } catch (error) {
    console.error("Gagal inisialisasi data", error);
    Swal.fire('Error', 'Gagal memuat data master kelas & tahun pelajaran.', 'error');
  }
};

// --- FUNGSI LOAD SISWA ---
const muatSiswa = async () => {
  try {
    const response = await api.get('/siswa', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        kelas_id: filterKelas.value,
        tahun_pelajaran_id: tahunPelajaranId.value,
        search: searchQuery.value
      }
    });
    
    // Karena kita pakai API Resource, biasanya dibungkus "data" 
    const meta = response.data.meta || response.data; 
    
    listSiswa.value = response.data.data;
    totalPage.value = meta.last_page || 1;
    totalRows.value = meta.total || listSiswa.value.length;
  } catch (error) {
    console.error("Gagal memuat siswa", error);
  }
};

const gantiFilter = () => { 
  currentPage.value = 1; 
  muatSiswa(); 
};

const gantiHalaman = (p) => { 
  currentPage.value = p; 
  muatSiswa(); 
};

const lakukanPencarian = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { 
    currentPage.value = 1; 
    muatSiswa(); 
  }, 400); // Debounce 400ms
};

// --- FUNGSI AKSI (TARIK & HAPUS MASSAL) ---
const tarikDataSiswa = async () => {
  if (!filterKelas.value || !tahunPelajaranId.value) return;

  Swal.fire({
    title: 'Menarik data...', 
    text: 'Mohon tunggu sebentar, sedang sinkronisasi dengan aplikasi induk.', 
    allowOutsideClick: false,
    didOpen: () => { Swal.showLoading(); }
  });

  try {
    // 🟢 Disesuaikan dengan Route::apiResource('siswa') -> metod POST ke /siswa
    await api.post('/siswa', {
      kelas_id: filterKelas.value,
      tahun_pelajaran_id: tahunPelajaranId.value
    });
    
    Swal.close();
    Toast.fire({ icon: 'success', title: 'Data siswa berhasil disinkronkan!' });
    muatSiswa();
  } catch (error) {
    Swal.close();
    Swal.fire('Gagal!', error.response?.data?.message || 'Gagal menarik data dari aplikasi induk.', 'error');
  }
};

const hapusMasalKelas = async () => {
  if (!filterKelas.value || !tahunPelajaranId.value) return;

  const result = await Swal.fire({
    title: 'Kosongkan Kelas?',
    text: "Semua data siswa di kelas terpilih pada tahun ini akan dihapus permanen!",
    icon: 'warning', 
    showCancelButton: true, 
    confirmButtonColor: '#d9534f', 
    cancelButtonColor: '#1E5631',
    confirmButtonText: 'Ya, Hapus Semua!', 
    background: '#FFE0B2', 
    color: '#1E5631'
  });

  if (result.isConfirmed) {
    try {
      await api.post('/siswa/bulk-delete', {
        kelas_id: filterKelas.value,
        tahun_pelajaran_id: tahunPelajaranId.value
      });
      Toast.fire({ icon: 'success', title: 'Siswa kelas berhasil dikosongkan.' });
      muatSiswa();
    } catch (error) {
      Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus data.', 'error');
    }
  }
};

// --- LIFECYCLE ---
onMounted(() => { 
  muatDataAwal(); 
});
</script>

<style scoped>
.content-body { padding: 0; font-family: 'Segoe UI', sans-serif; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; border-top: 5px solid #FBC02D; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
h2 { color: #1E5631; margin-bottom: 5px; font-size: 20px; }
.sub-title { font-size: 13px; color: #666; margin: 0; }
.badge-aktif { background-color: #1E5631; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; }

.filter-wrapper { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #FFE0B2; }
.filter-controls { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.filter-select { height: 38px; padding: 0 10px; border: 1px solid #689F38; border-radius: 5px; background: white; font-size: 14px; min-width: 160px; outline: none; }
.search-group { position: relative; display: flex; align-items: center; }
.filter-search { height: 38px; padding: 0 12px 0 35px; border: 1px solid #689F38; border-radius: 5px; font-size: 14px; width: 180px; outline: none; }
.search-icon { position: absolute; left: 12px; color: #689F38; }

.btn-sync { background-color: #1E5631; color: white; border: none; height: 38px; padding: 0 15px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 13px; display: flex; align-items: center; gap: 6px; }
.btn-bulk-delete { background-color: #d9534f; color: white; border: none; height: 38px; padding: 0 15px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 13px; display: flex; align-items: center; gap: 6px; }
button:disabled { opacity: 0.4; cursor: not-allowed !important; }

table { width: 100%; border-collapse: collapse; }
th { background-color: #1E5631; color: white; padding: 12px; text-align: left; }
td { padding: 12px; border-bottom: 1px solid #FFE0B2; color: #333; }
.badge-kelas { background-color: #fff3e0; color: #e65100; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; border: 1px solid #ffe0b2; }

.pagination-wrapper { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
.btn-page { background-color: white; color: #1E5631; border: 1px solid #689F38; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; margin: 0 2px; }
.active-page { background-color: #1E5631 !important; color: white !important; }
</style>