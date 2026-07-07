<template>
  <div class="content-body">
    <div class="card-box header-buku-box">
      <div class="header-flex">
        <button @click="kembaliKeDashboard" class="btn-back">
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </button>
        <div class="meta-info">
          <h2>Bank Soal & Kisi-kisi</h2>
          <p>Kelola daftar soal evaluasi (Formatif & Sumatif) untuk Modul Ajar.</p>
        </div>
      </div>
    </div>

    <div class="card-box margin-top-25">
      <div class="section-header">
        <div>
          <h3><i class="fa-solid fa-list-check"></i> Daftar Soal</h3>
          <p class="subtitle">Kumpulan soal berdasarkan Mata Pelajaran aktif.</p>
        </div>
        
        <div class="action-buttons" style="display: flex; gap: 10px;">
          <input type="file" ref="fileInput" @change="prosesUploadExcel" accept=".xlsx, .xls" style="display: none;" />
          
          <button @click="unduhTemplateExcel" class="btn-download-template" style="background: #FBC02D; color: #1E5631; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-download"></i> Unduh Template Excel
          </button>

          <button @click="triggerUpload" class="btn-import" style="background: #2e7d32; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-file-excel"></i> Import Excel
          </button>
          
          <button @click="tambahSoal" class="btn-add">
            <i class="fa-solid fa-plus"></i> Tambah Manual
          </button>
        </div>
      </div>
<div class="filter-section" style="margin-bottom: 20px; background: #f9fbe7; padding: 15px; border-radius: 8px; border: 1px solid #c5e1a5; display: flex; align-items: center; gap: 15px;">
        <label style="font-weight: bold; color: #558b2f;"><i class="fa-solid fa-filter"></i> Filter Mata Pelajaran:</label>
        <select v-model="selectedPlotting" @change="muatBankSoal" class="input-text" style="max-width: 400px; flex-grow: 1;">
          <option value="">-- Tampilkan Semua Mata Pelajaran --</option>
          <option v-for="plot in listPlotting" :key="plot.id" :value="plot.id">
            {{ plot.mapel }} - Kelas {{ plot.nama_kelas_gabungan }}
          </option>
        </select>
      </div>
      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i> Memuat bank soal...
      </div>

      <div v-else-if="listSoal.length === 0" class="empty-state">
        <i class="fa-solid fa-folder-open empty-icon"></i>
        <p>Belum ada soal di Bank Soal. Silakan klik Tambah Soal.</p>
      </div>

      <table v-else class="table-custom">
        <thead>
          <tr>
            <th width="10%">Jenis</th>
            <th width="15%">Tipe & Level</th>
            <th width="45%">Pertanyaan</th>
            <th width="15%">Tujuan Pembelajaran (TP)</th>
            <th width="15%">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="soal in listSoal" :key="soal.id">
            <td>
              <span class="badge-jenis">{{ soal.jenis_asesmen }}</span>
            </td>
            <td>
              <strong>{{ soal.tipe_soal }}</strong><br>
              <small :class="['badge-level', soal.tingkat_kesulitan.toLowerCase()]">{{ soal.tingkat_kesulitan }}</small>
            </td>
            <td>
              <div class="text-truncate" style="max-width: 300px;">
                {{ soal.pertanyaan }}
              </div>
            </td>
            <td>
              <small>{{ soal.deskripsi_tp || 'Tanpa TP' }}</small>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="editSoal(soal.id)" class="btn-icon btn-edit" title="Edit">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button @click="hapusSoal(soal.id)" class="btn-icon btn-delete" title="Hapus">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';
import Swal from 'sweetalert2';

const router = useRouter();
const listSoal = ref([]);
const isLoading = ref(false);
const selectedPlotting = ref('');
const listPlotting = ref([]);
const fileInput = ref(null);
const isUploading = ref(false);

const Toast = Swal.mixin({
  toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
  background: '#1E5631', color: '#FFE0B2', iconColor: '#FBC02D'
});

const kembaliKeDashboard = () => router.push({ name: 'guru.dashboard' });
const tambahSoal = () => router.push({ name: 'guru.bank-soal.create' });
const editSoal = (id) => router.push({ name: 'guru.bank-soal.edit', params: { id } });

const muatPlotting = async () => {
  try {
    const res = await api.get('/guru/plotting');
    const rawData = res.data.data || res.data;
    listPlotting.value = rawData.map(plot => ({
      ...plot,
      nama_kelas_gabungan: plot.list_kelas && plot.list_kelas.length > 0 
        ? plot.list_kelas.map(k => k.nama_kelas).join(', ') 
        : 'Belum ada kelas'
    }));
  } catch (error) {
    console.error("Gagal muat plotting:", error);
  }
};

const triggerUpload = () => {
  // Wajib pilih mapel dulu
  if (!selectedPlotting.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Pilih Mapel Dahulu!',
      text: 'Silakan pilih Mata Pelajaran di bagian filter sebelum mengimpor soal.',
      confirmButtonColor: '#1E5631'
    });
    return;
  }
  
  // Klik input file tersembunyi
  fileInput.value.click();
};

// Fungsi memproses file saat dipilih
const prosesUploadExcel = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isUploading.value = true;
  Toast.fire({ icon: 'info', title: 'Sedang mengimpor soal...', timer: 5000 });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('plotting_id', selectedPlotting.value); // Kirim UUID mapel

  try {
    // Note: Pastikan header Content-Type multipart/form-data (axios biasanya auto-detect)
    await api.post('/guru/bank-soal/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    Toast.fire({ icon: 'success', title: 'File Excel berhasil diimpor!' });
    
    // Refresh tabel
    muatBankSoal();
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Gagal mengimpor file Excel.';
    Swal.fire('Error', errorMsg, 'error');
  } finally {
    isUploading.value = false;
    event.target.value = ''; // Reset file input agar bisa upload file yang sama lagi jika perlu
  }
};

const unduhTemplateExcel = async () => {
  if (!selectedPlotting.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Pilih Mapel Dahulan!',
      text: 'Silakan tentukan Mata Pelajaran di filter terlebih dahulu agar sistem bisa menyiapkan data TP-nya.',
      confirmButtonColor: '#1E5631'
    });
    return;
  }

  try {
    // Tarik data sebagai blob binary excel
    const response = await api.get('/guru/bank-soal/template', {
      params: { plotting_id: selectedPlotting.value },
      responseType: 'blob' 
    });

    // Proses download di browser otomatis
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    
    // Beri nama dinamis
    link.download = `template_bank_soal.xlsx`;
    link.click();
    
    Toast.fire({ icon: 'success', title: 'Template Excel berhasil diunduh!' });
  } catch (error) {
    console.error("Gagal download template:", error);
    Swal.fire('Error', 'Gagal mengunduh file template.', 'error');
  }
};

const muatBankSoal = async () => {
  isLoading.value = true;
  try {
    // API akan menangkap ini sebagai ?plotting_id=xxxx
    const res = await api.get('/guru/bank-soal', {
      params: { plotting_id: selectedPlotting.value || null } 
    });
    listSoal.value = res.data.data || res.data;
  } catch (error) {
    Toast.fire({ icon: 'error', title: 'Gagal memuat bank soal.' });
  } finally {
    isLoading.value = false;
  }
};

const hapusSoal = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus Soal?', text: "Soal yang dihapus tidak dapat dikembalikan!",
    icon: 'warning', showCancelButton: true, confirmButtonColor: '#d9534f',
    cancelButtonColor: '#6c757d', confirmButtonText: 'Ya, hapus!'
  });

  if (confirm.isConfirmed) {
    try {
      await api.delete(`/guru/bank-soal/${id}`);
      Toast.fire({ icon: 'success', title: 'Soal berhasil dihapus!' });
      muatBankSoal();
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Gagal menghapus soal.' });
    }
  }
};

onMounted(() => {
    muatPlotting();
  muatBankSoal();
});
</script>

<style scoped>
/* Gunakan style CSS yang persis sama dengan BukuPeganganView.vue di sini (content-body, card-box, dll) */
.content-body { padding: 30px; background-color: #fcf8f2; min-height: 100vh; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.margin-top-25 { margin-top: 25px; }
.header-buku-box { background: #1E5631; color: white; padding: 20px 30px; }
.header-flex { display: flex; align-items: center; gap: 20px; }
.btn-back { background: #689F38; border: none; color: white; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.btn-back:hover { background: #FBC02D; color: #1E5631; }
.meta-info h2 { margin: 0 0 6px 0; color: #FBC02D; }
.meta-info p { margin: 0; color: #FFE0B2; font-size: 14px; }
.section-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 20px; }
.section-header h3 { margin: 0; color: #1E5631; }
.subtitle { margin: 6px 0 0 0; color: #666; font-size: 13.5px; }
.btn-add { background-color: #1E5631; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; }
.table-custom { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; }
.table-custom th { background-color: #689F38; color: white; padding: 14px 15px; text-align: left; }
.table-custom td { padding: 14px 15px; border-bottom: 1px solid #eee; font-size: 14px; vertical-align: top; }
.badge-jenis { background: #e3f2fd; color: #1565c0; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
.badge-level { padding: 3px 6px; border-radius: 3px; font-size: 11px; font-weight: bold; color: white; display: inline-block; margin-top: 5px; }
.mudah { background: #4caf50; }
.sedang { background: #ff9800; }
.sulit { background: #f44336; }
.text-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.action-buttons { display: flex; gap: 8px; }
.btn-icon { border: none; padding: 8px 10px; border-radius: 4px; cursor: pointer; color: white; }
.btn-edit { background-color: #FBC02D; color: #1E5631; }
.btn-delete { background-color: #d9534f; }
.loading-state, .empty-state { text-align: center; padding: 50px; color: #666; }
.empty-icon { font-size: 40px; color: #ccc; margin-bottom: 15px; }
</style>