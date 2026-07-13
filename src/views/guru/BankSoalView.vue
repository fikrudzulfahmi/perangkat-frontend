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

    <div class="card-box filter-card">
      <label class="filter-label">
        <i class="fa-solid fa-filter"></i> Pilih Tugas Mengajar:
      </label>
      <select v-model="selectedPlottingId" @change="handlePlottingChange" class="input-filter-select">
        <option value="">-- Pilih Mata Pelajaran & Kelas --</option>
        <option v-for="plot in listPlotting" :key="plot.id" :value="plot.id">
          {{ plot.mapel || plot.nama_mapel }} - Kelas {{ formatArrayKelas(plot.listKelas || plot.list_kelas || plot.kelas || []) }}
        </option>
      </select>
    </div>

    <div v-if="!selectedPlottingId" class="card-box empty-state-alert margin-top-25">
      <i class="fa-solid fa-hand-pointer alert-icon-info"></i>
      <h3>Pilih Tugas Mengajar</h3>
      <p>Silakan pilih tugas mengajar pada filter di atas untuk menampilkan daftar Bank Soal.</p>
    </div>

    <div v-else class="card-box margin-top-25">
      <div class="section-header">
        <div>
          <h3><i class="fa-solid fa-list-check"></i> Daftar Soal</h3>
          <p class="subtitle">{{ selectedPlottingNama }}</p>
        </div>
        
        <div class="action-buttons" style="display: flex; gap: 10px; flex-wrap: wrap;">
          <input type="file" ref="fileInput" @change="prosesUploadExcel" accept=".xlsx, .xls" style="display: none;" />
          
          <button @click="unduhTemplateExcel" class="btn-download-template">
            <i class="fa-solid fa-download"></i> Unduh Template
          </button>
          
          <button @click="triggerUpload" class="btn-upload-excel" :disabled="isUploading">
            <i class="fa-solid fa-file-excel"></i> {{ isUploading ? 'Mengunggah...' : 'Upload Excel' }}
          </button>

          <button @click="bukaModalKloning" class="btn-clone-main">
            <i class="fa-solid fa-copy"></i> Salin Soal Rekan / Tahun Lalu
          </button>

          <button @click="tambahSoalManual" class="btn-add">
            <i class="fa-solid fa-plus"></i> Tambah Manual
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i> Memuat data soal...
      </div>

      <div v-else-if="listSoal.length === 0" class="empty-state">
        <i class="fa-solid fa-box-open fa-3x" style="color: #ddd; margin-bottom: 15px;"></i>
        <h3>Belum Ada Soal</h3>
        <p>Silakan tambah soal manual, upload dari Excel, atau salin dari rekan guru.</p>
      </div>

      <table v-else class="table-custom">
        <thead>
          <tr>
            <th width="5%">No</th>
            <th width="15%">Tipe & Asesmen</th>
            <th width="70%">Pertanyaan / Instruksi</th>
            <th width="10%">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(soal, index) in listSoal" :key="soal.id">
            <td style="text-align: center;">{{ index + 1 }}</td>
            <td>
              <span class="badge-jenis">{{ soal.tipe_soal }}</span><br>
              <span class="badge-level" :class="'bg-' + (soal.tingkat_kesulitan ? soal.tingkat_kesulitan.toLowerCase() : 'sedang')">
                {{ soal.tingkat_kesulitan }}
              </span>
            </td>
            <td>
              <div class="text-truncate-multiline">
                <span v-if="tpMap[soal.tp_id]" class="tp-code-badge">
                  {{ tpMap[soal.tp_id] }}
                </span>
                {{ soal.pertanyaan }}
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="editSoal(soal.id)" class="btn-icon btn-edit" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button @click="hapusSoal(soal.id)" class="btn-icon btn-delete" title="Hapus"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModalKloning" class="modal-overlay">
      <div class="modal-content card-box modal-lg">
        <div class="modal-header-custom">
          <h3><i class="fa-solid fa-copy"></i> Salin Bank Soal</h3>
          <button @click="showModalKloning = false" class="btn-close-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        
        <div class="modal-body-scroll">
          
          <div class="step-container">
            <div class="form-group margin-bottom-15">
              <label class="step-label">1. Pilih Tugas Mengajar Anda (Tujuan Penyimpanan):</label>
              <select v-model="filterClone.targetPlottingId" @change="resetSumber" class="input-text target-select">
                <option value="">-- Pilih Tujuan Mapel & Kelas Anda --</option>
                <option v-for="plot in listPlotting" :key="plot.id" :value="plot.id">
                  {{ plot.mapel || plot.nama_mapel }} - Kelas {{ formatArrayKelas(plot.listKelas || plot.list_kelas || plot.kelas || []) }}
                </option>
              </select>
            </div>

            <div class="form-row" style="display: flex; gap: 15px;">
              <div class="form-group" style="flex: 1;">
                <label class="step-label">2. Pilih Tahun Pelajaran Referensi:</label>
                <select v-model="filterClone.tahunId" @change="loadPlottingSumber" class="input-text" :disabled="!filterClone.targetPlottingId">
                  <option value="">-- Pilih Tahun Pelajaran --</option>
                  <option v-for="tp in listTahunPelajaran" :key="tp.id" :value="tp.id">
                    {{ tp.nama_tahun }}
                  </option>
                </select>
              </div>
              <div class="form-group" style="flex: 1;">
                <label class="step-label">3. Pilih Referensi Rekan Guru:</label>
                <select v-model="filterClone.plottingSumberId" @change="loadSoalReferensi" class="input-text" :disabled="!filterClone.tahunId || isLoadingPlot">
                  <option value="">{{ isLoadingPlot ? 'Memuat...' : '-- Pilih Referensi Guru --' }}</option>
                  <option v-for="plot in listPlottingSumber" :key="plot.id" :value="plot.id">
                    {{ plot.guru?.name || plot.nama_guru || 'Guru Lain' }} | {{ plot.mapel || plot.nama_mapel }} - Kelas {{ formatArrayKelas(plot.listKelas || plot.list_kelas || plot.kelas || []) }}
                  </option>
                </select>
                <small v-if="filterClone.tahunId && listPlottingSumber.length === 0 && !isLoadingPlot" style="color: #c62828; margin-top: 4px; display: block;">
                  * Tidak ada guru yang mengajar mapel ini di tahun tersebut.
                </small>
              </div>
            </div>
          </div>

          <div v-if="isLoadingSoal" style="text-align: center; padding: 30px;">
            <i class="fa-solid fa-spinner fa-spin"></i> Mencari soal dari rekan...
          </div>
          
          <div v-else-if="listSoalReferensi.length > 0" style="margin-top: 20px;">
            <label class="step-label" style="color: #1E5631;">4. Pilih Soal yang Ingin Disalin:</label>
            <div class="table-responsive-clone">
              <table class="table-clone">
                <thead>
                  <tr>
                    <th style="width: 50px; text-align: center;">
                      <input type="checkbox" v-model="isSelectAll" @change="toggleSelectAll" class="cb-large">
                    </th>
                    <th>Pertanyaan / Instruksi</th>
                    <th style="width: 150px; text-align: center;">Tipe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="soal in listSoalReferensi" :key="soal.id">
                    <td style="text-align: center;">
                      <input type="checkbox" v-model="selectedSoalIds" :value="soal.id" class="cb-large">
                    </td>
                    <td class="text-truncate">{{ soal.pertanyaan }}</td>
                    <td style="text-align: center;">
                      <span class="badge-tipe-sm">{{ soal.tipe_soal }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style="font-size: 13.5px; font-weight: bold; margin-top: 10px; color: #0288D1;">
              <i class="fa-solid fa-check-double"></i> Terpilih: {{ selectedSoalIds.length }} dari {{ listSoalReferensi.length }} soal
            </p>
          </div>

          <div v-else-if="filterClone.plottingSumberId && !isLoadingSoal" class="empty-state-clone">
            <i class="fa-solid fa-folder-open fa-2x" style="color: #ccc; margin-bottom: 10px;"></i><br>
            Rekan guru ini belum menambahkan soal ke dalam bank soal.
          </div>

        </div>
        
        <div class="modal-footer">
          <button @click="showModalKloning = false" class="btn-cancel">Batal</button>
          <button @click="prosesKloningSelektif" class="btn-process-clone" :disabled="selectedSoalIds.length === 0 || !filterClone.targetPlottingId || isKloning">
            <i class="fa-solid fa-download"></i> {{ isKloning ? 'Memproses...' : `Salin ${selectedSoalIds.length} Soal Terpilih` }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';
import Swal from 'sweetalert2';

const router = useRouter();

// === STATE HALAMAN UTAMA ===
const listSoal = ref([]);
const listPlotting = ref([]);
const isLoading = ref(false);
const isUploading = ref(false);
const selectedPlottingId = ref('');
const fileInput = ref(null);
const tpMap = ref({}); // 🟢 Lookup: { [tp_id]: 'DD3-2.1' } untuk menampilkan Kode TP di tabel

// === STATE MODAL KLONING ===
const showModalKloning = ref(false);
const listTahunPelajaran = ref([]);
const listPlottingSumber = ref([]);
const listSoalReferensi = ref([]);
const selectedSoalIds = ref([]);
const isSelectAll = ref(false);

const isLoadingPlot = ref(false);
const isLoadingSoal = ref(false);
const isKloning = ref(false);

const filterClone = ref({
  targetPlottingId: '', // Ini sekarang diisi duluan!
  tahunId: '',
  plottingSumberId: ''
});

const Toast = Swal.mixin({
  toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
  background: '#1E5631', color: '#FFE0B2', iconColor: '#FBC02D'
});

// Helper Fungsi Format Kelas (Menangani 'listKelas' atau 'list_kelas')
const formatArrayKelas = (arr) => {
  if (!arr || arr.length === 0) return 'Tidak ada kelas';
  if (typeof arr === 'string') return arr;
  return arr.map(k => k.nama_kelas || k.kelas || k.nama).join(', ');
};

const kembaliKeDashboard = () => {
  router.push({ name: 'guru.dashboard' });
};

// 🟢 Objek plotting yang sedang aktif dipilih, jadi sumber tunggal untuk nama mapel & mapel_id
const selectedPlottingObj = computed(() =>
  listPlotting.value.find(p => String(p.id) === String(selectedPlottingId.value)) || null
);

const selectedPlottingNama = computed(() => {
  if (!selectedPlottingObj.value) return '';
  const p = selectedPlottingObj.value;
  const kelas = formatArrayKelas(p.listKelas || p.list_kelas || p.kelas || []);
  return `${p.mapel || p.nama_mapel} - Kelas ${kelas}`;
});

// === FUNGSI UTAMA (LIST SOAL & EXCEL) ===
const muatPlotting = async () => {
  try {
    const res = await api.get('/guru/plotting');
    listPlotting.value = res.data.data || res.data || [];
  } catch (error) {
    console.error("Gagal memuat tugas mengajar", error);
  }
};

const muatSoal = async () => {
  isLoading.value = true;
  try {
    const params = selectedPlottingId.value ? { plotting_id: selectedPlottingId.value } : {};
    const res = await api.get('/guru/bank-soal', { params });
    listSoal.value = res.data.data || res.data || [];
    console.log('DEBUG - contoh data soal:', listSoal.value[0]); // 🟡 hapus setelah selesai debug
  } catch (error) {
    Toast.fire({ icon: 'error', title: 'Gagal memuat daftar soal.' });
  } finally {
    isLoading.value = false;
  }
};

// 🟢 Ambil daftar Kode TP untuk mapel dari plotting yang sedang dipilih,
// lalu di-flatten jadi lookup { [tp_id]: kode_tp } agar cepat dicocokkan di tabel.
const muatKodeTp = async () => {
  tpMap.value = {};
  const mapelId = selectedPlottingObj.value?.mapel_id;
  if (!mapelId) return;

  try {
    const res = await api.get('/guru/capaian-pembelajaran', { params: { mapel_id: mapelId } });
    const listCp = res.data.data || res.data || [];

    const map = {};
    listCp.forEach(cp => {
      (cp.list_tp || []).forEach(tp => {
        map[tp.id] = tp.kode_tp;
      });
    });
    tpMap.value = map;
    console.log('DEBUG - tpMap:', map); // 🟡 hapus setelah selesai debug
  } catch (error) {
    console.error("Gagal memuat daftar kode TP", error);
  }
};

const handlePlottingChange = () => {
  if (!selectedPlottingId.value) {
    listSoal.value = [];
    tpMap.value = {};
    return;
  }
  muatSoal();
  muatKodeTp();
};

const tambahSoalManual = () => {
  router.push({ name: 'guru.bank-soal.create' });
};

const editSoal = (id) => {
  router.push({ name: 'guru.bank-soal.edit', params: { id } });
};

const hapusSoal = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus Soal?', text: "Soal yang dihapus tidak bisa dikembalikan!", icon: 'warning',
    showCancelButton: true, confirmButtonColor: '#d9534f', confirmButtonText: 'Ya, hapus!'
  });

  if (confirm.isConfirmed) {
    try {
      await api.delete(`/guru/bank-soal/${id}`);
      Toast.fire({ icon: 'success', title: 'Soal berhasil dihapus!' });
      muatSoal();
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Gagal menghapus soal.' });
    }
  }
};

const unduhTemplateExcel = async () => {
  if (!selectedPlottingId.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Pilih Tugas Mengajar Dulu',
      text: 'Silakan pilih tugas mengajar pada filter di atas sebelum mengunduh template.',
      confirmButtonColor: '#1E5631'
    });
    return;
  }

  try {
    const response = await api.get('/guru/bank-soal/template', {
      params: { plotting_id: selectedPlottingId.value },
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Template_Bank_Soal.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    Toast.fire({ icon: 'error', title: 'Gagal mengunduh template.' });
  }
};

const triggerUpload = () => {
  if (!selectedPlottingId.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Pilih Tugas Mengajar Dulu',
      text: 'Silakan pilih tugas mengajar pada filter di atas sebelum upload Excel.',
      confirmButtonColor: '#1E5631'
    });
    return;
  }
  fileInput.value.click();
};

const prosesUploadExcel = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isUploading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('plotting_id', selectedPlottingId.value);

  try {
    const res = await api.post('/guru/bank-soal/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    Swal.fire('Berhasil!', res.data.message || 'Data berhasil diimpor.', 'success');
    muatSoal();
  } catch (error) {
    console.error("DETAIL ERROR UPLOAD:", error.response || error);
    const errorMsg = error.response?.data?.message || 'Gagal mengupload file excel.';
    Swal.fire('Error!', errorMsg, 'error');
  } finally {
    isUploading.value = false;
    fileInput.value.value = '';
  }
};

// === FUNGSI KLONING SELEKTIF (MENGGUNAKAN LOGIKA ATP) ===
const bukaModalKloning = async () => {
  filterClone.value = { targetPlottingId: selectedPlottingId.value || '', tahunId: '', plottingSumberId: '' };
  listSoalReferensi.value = [];
  selectedSoalIds.value = [];
  isSelectAll.value = false;
  
  showModalKloning.value = true;
  
  try {
    // Sesuai dengan ATP, panggil API tahun-ajaran
    if (listTahunPelajaran.value.length === 0) {
      const res = await api.get('/guru/tahun-ajaran'); 
      listTahunPelajaran.value = res.data.data || res.data || [];
    }
  } catch (error) {
    console.error("Gagal memuat daftar tahun pelajaran", error);
  }
};

// Mereset dropdown jika user mengubah Tujuan Plotting
const resetSumber = () => {
  filterClone.value.tahunId = '';
  filterClone.value.plottingSumberId = '';
  listPlottingSumber.value = [];
  listSoalReferensi.value = [];
  selectedSoalIds.value = [];
  isSelectAll.value = false;
};

const loadPlottingSumber = async () => {
  filterClone.value.plottingSumberId = '';
  listSoalReferensi.value = [];
  if (!filterClone.value.tahunId || !filterClone.value.targetPlottingId) return;

  isLoadingPlot.value = true;
  try {
    // PERUBAHAN UTAMA: Kirim `plotting_id` agar Backend tau mapel apa yg dicari!
    const res = await api.get('/guru/bank-soal/referensi-plotting', { 
      params: { 
        plotting_id: filterClone.value.targetPlottingId, 
        tahun_pelajaran_id: filterClone.value.tahunId 
      }
    });
    listPlottingSumber.value = res.data.data || res.data || [];
  } catch (error) {
    console.error("Gagal memuat data referensi teman", error);
  } finally {
    isLoadingPlot.value = false;
  }
};

const loadSoalReferensi = async () => {
  selectedSoalIds.value = [];
  isSelectAll.value = false;
  if (!filterClone.value.plottingSumberId) return;

  isLoadingSoal.value = true;
  try {
    const res = await api.get('/guru/bank-soal/referensi', { 
      params: { plotting_id: filterClone.value.plottingSumberId } 
    });
    listSoalReferensi.value = res.data.data || res.data || [];
  } catch (error) {
    console.error("Gagal memuat soal", error);
  } finally {
    isLoadingSoal.value = false;
  }
};

const toggleSelectAll = () => {
  if (isSelectAll.value) {
    selectedSoalIds.value = listSoalReferensi.value.map(soal => soal.id);
  } else {
    selectedSoalIds.value = [];
  }
};

const prosesKloningSelektif = async () => {
  isKloning.value = true;
  try {
    const response = await api.post('/guru/bank-soal/kloning-selektif', {
      soal_ids: selectedSoalIds.value,
      target_plotting_id: filterClone.value.targetPlottingId
    });

    showModalKloning.value = false;
    Swal.fire('Berhasil!', response.data.message || 'Soal berhasil disalin.', 'success');
    
    // Auto-pilih dropdown utama ke mapel yang baru saja dituju
    selectedPlottingId.value = filterClone.value.targetPlottingId;
    muatSoal();
    muatKodeTp();
    
  } catch (error) {
    Swal.fire('Gagal!', 'Terjadi kesalahan saat menyalin soal.', 'error');
  } finally {
    isKloning.value = false;
  }
};

onMounted(() => {
  muatPlotting();
});
</script>

<style scoped>
/* ================= GLOBAL & HEADER ================= */
.content-body { padding: 30px; background-color: #fcf8f2; min-height: 100vh; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 25px; border: 1px solid #FFE0B2; }
.margin-top-25 { margin-top: 25px; }

.header-buku-box { background: linear-gradient(135deg, #1E5631 0%, #689F38 100%); color: white; padding: 20px 30px; }
.header-flex { display: flex; gap: 20px; align-items: center; }
.btn-back { background: #689F38; border: none; color: white; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 8px;}
.btn-back:hover { background: #FBC02D; color: #1E5631; }
.meta-info h2 { margin: 0 0 6px 0; color: #FBC02D; font-size: 20px; }
.meta-info p { margin: 0; color: #FFE0B2; font-size: 14px; }

.section-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 20px; }
.section-header h3 { margin: 0; color: #1E5631; }
.subtitle { margin: 6px 0 0 0; color: #666; font-size: 13.5px; }

/* Filter Card (disamakan dengan AtpView/KktpView/ModulAjarView/ProsemView) */
.filter-card { border-top: 4px solid #FBC02D; background-color: #FFFDE7; }
.filter-label { display: block; font-weight: bold; color: #1E5631; margin-bottom: 10px; font-size: 14.5px; }
.input-filter-select { width: 100%; max-width: 500px; height: 45px; padding: 0 15px; font-size: 15px; border: 2px solid #689F38; border-radius: 6px; outline: none; background: white; font-weight: 500; cursor: pointer; color: #333; }

.empty-state-alert { text-align: center; padding: 50px; color: #777; border-top: 4px solid #B0BEC5; }
.alert-icon-info { font-size: 50px; color: #689F38; margin-bottom: 15px; }

.btn-add { background-color: #1E5631; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px;}
.btn-add:hover { background: #143d22; }
.btn-clone-main { background: #0288D1; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px;}
.btn-clone-main:hover { background-color: #01579B; }
.btn-download-template { background: #FBC02D; color: #1E5631; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.btn-upload-excel { background: #4CAF50; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.btn-upload-excel:disabled { opacity: 0.7; cursor: not-allowed; }

/* ================= FORMS & TABLE UTAMA ================= */
.input-text { width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; font-family: inherit; transition: 0.2s; outline: none; background: white; }
.input-text:focus { border-color: #689F38; box-shadow: 0 0 0 2px rgba(104,159,56,0.2); }
.input-text:disabled { background: #f5f5f5; cursor: not-allowed; }

.table-custom { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; }
.table-custom th { background-color: #689F38; color: white; padding: 14px 15px; font-size: 14px; text-align: left; }
.table-custom td { padding: 14px 15px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; vertical-align: top; }
.loading-state { text-align: center; padding: 50px; font-weight: bold; color: #1E5631; }
.empty-state { text-align: center; padding: 50px; color: #666; }

.badge-jenis { background: #e3f2fd; color: #1565c0; font-size: 12px; font-weight: bold; padding: 4px 8px; border-radius: 4px; border: 1px solid #bbdefb; }
.badge-level { font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-top: 5px; }
.bg-mudah { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
.bg-sedang { background: #fff3e0; color: #ef6c00; border: 1px solid #ffe0b2; }
.bg-sulit { background: #ffebee; color: #c62828; border: 1px solid #ffcdd2; }
.text-truncate-multiline { font-size: 13.5px; line-height: 1.4; max-height: 60px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
.tp-code-badge { background: #eee; font-weight: bold; padding: 2px 5px; border-radius: 3px; font-size: 11px; color: #333; margin-right: 4px; }

.action-buttons { display: flex; gap: 8px; }
.btn-icon { border: none; padding: 8px 10px; border-radius: 4px; cursor: pointer; transition: 0.2s; color: white; }
.btn-edit { background-color: #FBC02D; color: #1E5631; }
.btn-edit:hover { background-color: #f9a825; }
.btn-delete { background-color: #d9534f; }
.btn-delete:hover { background-color: #c9302c; }

/* ================= MODAL KLONING SELEKTIF ================= */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: white; padding: 0; overflow: hidden; display: flex; flex-direction: column; border-radius: 8px; margin-bottom: 0; animation: fadeIn 0.2s; }
.modal-lg { width: 850px; max-width: 95%; max-height: 90vh; }
.modal-header-custom { padding: 15px 20px; background: #0288D1; color: white; display: flex; justify-content: space-between; align-items: center; }
.modal-header-custom h3 { margin: 0; font-size: 18px; color: white; display: flex; align-items: center; gap: 8px; }
.btn-close-modal { background: none; border: none; color: white; font-size: 20px; cursor: pointer; }

.modal-body-scroll { padding: 20px; overflow-y: auto; flex: 1; }
.step-container { background: #f5f5f5; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; }
.step-label { font-weight: bold; font-size: 13.5px; color: #333; display: block; margin-bottom: 8px; }
.margin-bottom-15 { margin-bottom: 15px; }

.target-select { border-color: #2e7d32; border-width: 2px; }

.table-responsive-clone { border: 1px solid #ccc; border-radius: 6px; overflow-y: auto; max-height: 350px; margin-top: 10px; }
.table-clone { width: 100%; border-collapse: collapse; }
.table-clone th { background: #eee; padding: 10px; text-align: left; position: sticky; top: 0; z-index: 2; border-bottom: 2px solid #ccc; }
.table-clone td { padding: 10px; border-bottom: 1px solid #ddd; font-size: 13.5px; }
.table-clone tr:hover { background: #f9f9f9; }
.text-truncate { max-width: 400px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cb-large { transform: scale(1.3); cursor: pointer; }
.badge-tipe-sm { background: #e3f2fd; color: #0288d1; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
.empty-state-clone { text-align: center; padding: 40px; color: #777; background: #fafafa; border-radius: 8px; border: 1px dashed #ccc; margin-top: 15px; }

.modal-footer { padding: 15px 20px; background: #f9f9f9; border-top: 1px solid #ddd; display: flex; justify-content: flex-end; gap: 10px; }
.btn-cancel { background: white; border: 1px solid #ccc; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; color: #555; }
.btn-process-clone { background: #0288D1; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.btn-process-clone:disabled { opacity: 0.6; cursor: not-allowed; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>