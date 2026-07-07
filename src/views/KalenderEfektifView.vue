<template>
  <div class="content-body">
    <div class="card-box table-container">
      
      <div class="filter-wrapper">
        <div class="filter-title">
          <h2>Kalender Akademik & Rincian Minggu Efektif</h2>
          <p class="sub-title">Konfigurasi alokasi waktu efektif mengajar per semester.</p>
        </div>
        
        <div class="filter-controls">
          <label for="tahun-select" class="filter-label">Tahun Pelajaran:</label>
          <select id="tahun-select" v-model="selectedTahunId" @change="muatDataKalender" class="filter-select">
            <option value="">-- Pilih Tahun Pelajaran --</option>
            <option v-for="t in listTahun" :key="t.id" :value="t.id">
              {{ t.nama_tahun }}  {{ t.is_active ? '(Aktif)' : '' }}
            </option>
          </select>
        </div>
      </div>

      <div class="upload-section" v-if="selectedTahunId">
        <div class="upload-card">
          <i class="fa-solid fa-file-pdf pdf-icon-large"></i>
          <div class="upload-info">
            <h3>File Kalender Pendidikan Resmi</h3>
            <p v-if="currentPdfUrl">
              <a :href="currentPdfUrl" target="_blank" class="link-download">
                <i class="fa-solid fa-external-link"></i> Lihat PDF Terupload
              </a>
            </p>
            <p v-else class="text-muted">Belum ada file PDF yang diunggah untuk tahun pelajaran ini.</p>
          </div>
          <div class="upload-action">
            <input type="file" ref="fileInput" @change="handleFileChange" accept="application/pdf" class="input-file-hidden" id="pdf-upload"/>
            <label for="pdf-upload" class="btn-upload-label">
              <i class="fa-solid fa-cloud-arrow-up"></i> Pilih Berkas PDF
            </label>
            <span v-if="selectedFile" class="file-name-info">{{ selectedFile.name }}</span>
          </div>
        </div>
      </div>

      <form v-if="selectedTahunId" @submit.prevent="simpanKalender" class="form-kalender">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th style="width: 50px;">No</th>
                <th style="width: 150px;">Bulan</th>
                <th style="width: 120px;">Jml. Minggu</th>
                <th style="width: 120px;">Minggu Efektif</th>
                <th style="width: 140px;">Minggu Tdk Efektif</th>
                <th>Keterangan / Agenda Kegiatan Sekolah</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in rincianBulan" :key="index">
                <td style="text-align: center;">{{ index + 1 }}</td>
                <td><strong>{{ row.bulan }}</strong></td>
                <td>
                  <input type="number" v-model.number="row.jumlah_minggu" min="0" max="6" class="form-control-num" @input="hitungOtomatis(index)" required />
                </td>
                <td>
                  <input type="number" v-model.number="row.minggu_efektif" min="0" max="6" class="form-control-num" @input="hitungManualEfektif(index)" required />
                </td>
                <td>
                  <input type="number" v-model.number="row.minggu_tidak_efektif" min="0" max="6" class="form-control-num" @input="hitungManualTidakEfektif(index)" required />
                </td>
                <td>
                  <input type="text" v-model="row.keterangan" placeholder="Misal: Libur Semester, UTS, MPLS, dll." class="form-control-text" />
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="row-total">
                <td colspan="2" style="text-align: right; font-weight: bold;">TOTAL JAMAN:</td>
                <td class="text-center-bold">{{ totalMinggu }}</td>
                <td class="text-center-bold text-success">{{ totalEfektif }}</td>
                <td class="text-center-bold text-danger">{{ totalTidakEfektif }}</td>
                <td><span class="info-footer">* Pastikan total hitungan baris sudah sesuai kalender pendidikan pendidikan.</span></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading" class="btn-save">
            <i class="fa-solid fa-floppy-disk"></i> {{ loading ? 'Menyimpan...' : 'Simpan Rincian Kalender' }}
          </button>
        </div>
      </form>

      <div v-else class="empty-state">
        <i class="fa-solid fa-calendar-days empty-icon"></i>
        <p>Silakan pilih Tahun Pelajaran terlebih dahulu untuk mengonfigurasi atau melihat Minggu Efektif.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';
import Swal from 'sweetalert2';

// --- STATE ---
const listTahun = ref([]);
const selectedTahunId = ref('');
const currentPdfUrl = ref(null);
const selectedFile = ref(null);
const fileInput = ref(null);
const loading = ref(false);

// Template Struktur 12 Bulan Standar Tahun Ajaran (Dimulai dari Juli s/d Juni)
const rincianBulan = ref([
  { bulan: 'Juli', jumlah_minggu: 4, minggu_efektif: 2, minggu_tidak_efektif: 2, keterangan: 'MPLS & Libur Semester' },
  { bulan: 'Agustus', jumlah_minggu: 4, minggu_efektif: 4, minggu_tidak_efektif: 0, keterangan: '' },
  { bulan: 'September', jumlah_minggu: 4, minggu_efektif: 3, minggu_tidak_efektif: 1, keterangan: 'Asesmen Tengah Semester' },
  { bulan: 'Oktober', jumlah_minggu: 5, minggu_efektif: 5, minggu_tidak_efektif: 0, keterangan: '' },
  { bulan: 'November', jumlah_minggu: 4, minggu_efektif: 4, minggu_tidak_efektif: 0, keterangan: '' },
  { bulan: 'Desember', jumlah_minggu: 4, minggu_efektif: 1, minggu_tidak_efektif: 3, keterangan: 'ASAS & Libur Semester' },
  { bulan: 'Januari', jumlah_minggu: 4, minggu_efektif: 4, minggu_tidak_efektif: 0, keterangan: '' },
  { bulan: 'Februari', jumlah_minggu: 4, minggu_efektif: 4, minggu_tidak_efektif: 0, keterangan: '' },
  { bulan: 'Maret', jumlah_minggu: 4, minggu_efektif: 3, minggu_tidak_efektif: 1, keterangan: 'Pondok Ramadhan / LPT' },
  { bulan: 'April', jumlah_minggu: 5, minggu_efektif: 3, minggu_tidak_efektif: 2, keterangan: 'Libur Idul Fitri' },
  { bulan: 'Mei', jumlah_minggu: 4, minggu_efektif: 4, minggu_tidak_efektif: 0, keterangan: '' },
  { bulan: 'Juni', jumlah_minggu: 4, minggu_efektif: 1, minggu_tidak_efektif: 3, keterangan: 'ASAS & Libur Akhir Tahun' }
]);

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  background: '#1E5631',
  color: '#FFE0B2'
});

// --- HITUNGAN COMPUTED (TOTAL FOOTER) ---
const totalMinggu = computed(() => rincianBulan.value.reduce((acc, curr) => acc + (curr.jumlah_minggu || 0), 0));
const totalEfektif = computed(() => rincianBulan.value.reduce((acc, curr) => acc + (curr.minggu_efektif || 0), 0));
const totalTidakEfektif = computed(() => rincianBulan.value.reduce((acc, curr) => acc + (curr.minggu_tidak_efektif || 0), 0));

// --- OTOMATISASI HITUNGAN INPUT ---
const hitungOtomatis = (index) => {
  const row = rincianBulan.value[index];
  // Default: Jika jumlah minggu diubah, set minggu efektif penuh dan tidak efektif 0
  row.minggu_efektif = row.jumlah_minggu;
  row.minggu_tidak_efektif = 0;
};

const hitungManualEfektif = (index) => {
  const row = rincianBulan.value[index];
  if (row.minggu_efektif > row.jumlah_minggu) row.minggu_efektif = row.jumlah_minggu;
  row.minggu_tidak_efektif = row.jumlah_minggu - row.minggu_efektif;
};

const hitungManualTidakEfektif = (index) => {
  const row = rincianBulan.value[index];
  if (row.minggu_tidak_efektif > row.jumlah_minggu) row.minggu_tidak_efektif = row.jumlah_minggu;
  row.minggu_efektif = row.jumlah_minggu - row.minggu_tidak_efektif;
};

// --- BACA DATA MASTER ---
const muatTahunPelajaran = async () => {
  try {
    const response = await api.get('/tahun-pelajaran', { params: { per_page: 100 } });
    const data = response.data.data || response.data;
    listTahun.value = data;
    
    // Auto select tahun pelajaran yang sedang berstatus aktif
    const aktif = data.find(t => t.is_active === 1 || t.is_active === true);
    if (aktif) {
      selectedTahunId.value = aktif.id;
      muatDataKalender();
    }
  } catch (error) {
    Swal.fire('Error', 'Gagal memuat master tahun pelajaran.', 'error');
  }
};

const muatDataKalender = async () => {
  if (!selectedTahunId.value) return;
  selectedFile.value = null; // reset berkas upload baru
  
  try {
    const response = await api.get('/kalender-efektif', {
      params: { tahun_pelajaran_id: selectedTahunId.value }
    });
    
    const resData = response.data.data;
    
    if (resData && resData.length > 0) {
      // Jika data sudah pernah diisi oleh admin di DB, timpa state lokal form
      currentPdfUrl.value = resData[0].file_pdf_url;
      
      // Map data dari DB ke form urutan bulan lokal agar susunannya presisi
      rincianBulan.value.forEach(localRow => {
        const dbRow = resData.find(d => d.bulan.toLowerCase() === localRow.bulan.toLowerCase());
        if (dbRow) {
          localRow.jumlah_minggu = dbRow.jumlah_minggu;
          localRow.minggu_efektif = dbRow.minggu_efektif;
          localRow.minggu_tidak_efektif = dbRow.minggu_tidak_efektif;
          localRow.keterangan = dbRow.keterangan === '-' ? '' : dbRow.keterangan;
        }
      });
    } else {
      // Jika data masih kosong di DB, kosongkan link pdf lama
      currentPdfUrl.value = null;
    }
  } catch (error) {
    console.error("Gagal memuat rincian kalender", error);
  }
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.type !== 'application/pdf') {
      Swal.fire('Format Salah', 'Berkas harus berupa file PDF resmi.', 'warning');
      return;
    }
    selectedFile.value = file;
  }
};

// --- SIMPAN DATA (POST MASSAL MULTIPART) ---
const simpanKalender = async () => {
  if (!selectedTahunId.value) return;
  loading.value = true;

  // Karena kita mengirim file PDF bersama Array Data, gunakan FormData
  const formData = new FormData();
  formData.append('tahun_pelajaran_id', selectedTahunId.value);
  
  if (selectedFile.value) {
    formData.append('file_pdf', selectedFile.value);
  }

  // Inject array data massal rincian bulan ke format input Form Data Laravel
  rincianBulan.value.forEach((item, index) => {
    formData.append(`rincian[${index}][bulan]`, item.bulan);
    formData.append(`rincian[${index}][jumlah_minggu]`, item.jumlah_minggu);
    formData.append(`rincian[${index}][minggu_efektif]`, item.minggu_efektif);
    formData.append(`rincian[${index}][minggu_tidak_efektif]`, item.minggu_tidak_efektif);
    formData.append(`rincian[${index}][keterangan]`, item.keterangan || '');
  });

  try {
    await api.post('/kalender-efektif', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    Toast.fire({ icon: 'success', title: 'Kalender & Minggu efektif berhasil disimpan!' });
    muatDataKalender();
  } catch (error) {
    Swal.fire('Gagal Menyimpan', error.response?.data?.message || 'Terjadi gangguan koneksi.', 'error');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  muatTahunPelajaran();
});
</script>

<style scoped>
.content-body { padding: 0; font-family: 'Segoe UI', sans-serif; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; border-top: 5px solid #FBC02D; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
h2 { color: #1E5631; margin-bottom: 5px; font-size: 20px; }
.sub-title { font-size: 13px; color: #666; margin: 0; }

.filter-wrapper { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #FFE0B2; }
.filter-controls { display: flex; gap: 10px; align-items: center; }
.filter-label { font-size: 14px; font-weight: bold; color: #1E5631; }
.filter-select { height: 38px; padding: 0 10px; border: 1px solid #689F38; border-radius: 5px; background: white; font-size: 14px; min-width: 240px; outline: none; }

/* Upload PDF Card */
.upload-section { margin-bottom: 20px; }
.upload-card { display: flex; align-items: center; background-color: #fff3e0; border: 1px solid #ffe0b2; padding: 15px 20px; border-radius: 8px; gap: 15px; }
.pdf-icon-large { font-size: 32px; color: #d9534f; }
.upload-info h3 { margin: 0 0 4px 0; font-size: 15px; color: #e65100; }
.upload-info p { margin: 0; font-size: 13px; }
.link-download { color: #1E5631; font-weight: bold; text-decoration: none; }
.link-download:hover { text-decoration: underline; }
.upload-action { margin-left: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
.input-file-hidden { display: none; }
.btn-upload-label { background-color: #689F38; color: white; padding: 8px 14px; border-radius: 4px; font-size: 13px; font-weight: bold; cursor: pointer; transition: 0.2s; }
.btn-upload-label:hover { background-color: #1E5631; }
.file-name-info { font-size: 12px; color: #333; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* Table Form Styling */
table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
th { background-color: #1E5631; color: white; padding: 12px; text-align: left; font-size: 14px; }
td { padding: 8px 12px; border-bottom: 1px solid #FFE0B2; color: #333; vertical-align: middle; }
.form-control-num { width: 80px; height: 32px; text-align: center; border: 1px solid #689F38; border-radius: 4px; font-size: 14px; font-weight: bold; outline: none; }
.form-control-text { width: 100%; height: 32px; padding: 0 10px; border: 1px solid #ffe0b2; border-radius: 4px; font-size: 13px; outline: none; box-sizing: border-box; }
.form-control-text:focus { border-color: #689F38; }

.row-total { background-color: #f9f9f9; }
.text-center-bold { text-align: center; font-weight: bold; font-size: 15px; }
.text-success { color: #2e7d32; }
.text-danger { color: #c62828; }
.info-footer { font-size: 12px; color: #e65100; font-style: italic; }

.form-actions { display: flex; justify-content: flex-end; margin-top: 15px; }
.btn-save { background-color: #1E5631; color: white; border: none; height: 42px; padding: 0 25px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px; transition: 0.2s; }
.btn-save:hover:not(:disabled) { background-color: #174425; }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

/* Empty State */
.empty-state { text-align: center; padding: 60px 20px; color: #888; }
.empty-icon { font-size: 48px; color: #ffe0b2; margin-bottom: 15px; }
</style>