<template>
  <div class="content-body">
    
    <div class="card-box">
      <h2>{{ isEditModeCP ? 'Edit Capaian Pembelajaran (CP)' : 'Tambah Capaian Pembelajaran (CP) Baru' }}</h2>
      <form @submit.prevent="simpanCP" class="form-grid-kurikulum">
        
        <div class="input-group-select">
          <label>Mata Pelajaran</label>
          <select v-model="formCP.mapel_id" required>
            <option value="" disabled>-- Pilih Mata Pelajaran --</option>
            <option v-for="m in listMapel" :key="m.id" :value="m.id">{{ m.nama_mapel }}</option>
          </select>
          <small v-if="validationErrorsCP.mapel_id" class="error-text">{{ validationErrorsCP.mapel_id[0] }}</small>
        </div>

        <div class="input-group-select">
          <label>Fase</label>
          <select v-model="formCP.fase" required>
            <option value="" disabled>-- Pilih Fase --</option>
            <option value="A">Fase A</option>
            <option value="B">Fase B</option>
            <option value="C">Fase C</option>
            <option value="D">Fase D</option>
            <option value="E">Fase E</option>
            <option value="F">Fase F</option>
          </select>
          <small v-if="validationErrorsCP.fase" class="error-text">{{ validationErrorsCP.fase[0] }}</small>
        </div>

        <div class="input-group-select full-width-mobile">
          <label>Nama Elemen</label>
          <input v-model="formCP.elemen" type="text" placeholder="Contoh: Aljabar / Pancasila" required />
          <small v-if="validationErrorsCP.elemen" class="error-text">{{ validationErrorsCP.elemen[0] }}</small>
        </div>

        <div class="input-group-select full-width margin-top-10">
          <label>Deskripsi Konten Capaian Pembelajaran (CP)</label>
          <textarea v-model="formCP.deskripsi" placeholder="Tulis deskripsi konten CP secara mendalam..." rows="3" required></textarea>
          <small v-if="validationErrorsCP.deskripsi" class="error-text">{{ validationErrorsCP.deskripsi[0] }}</small>
        </div>

        <div class="button-group-kurikulum full-width">
          <button type="submit" class="btn-submit-main" :style="{ backgroundColor: isEditModeCP ? '#FBC02D' : '#1E5631', color: isEditModeCP ? '#1E5631' : 'white' }">
            <i :class="isEditModeCP ? 'fa-solid fa-pen' : 'fa-solid fa-save'"></i>
            {{ isEditModeCP ? 'Update CP' : 'Simpan CP' }}
          </button>
          <button v-if="isEditModeCP" type="button" @click="batalEditCP" class="btn-cancel-main">Batal</button>
        </div>
      </form>
    </div>

    <div class="card-box margin-top-25">
      <div class="filter-wrapper-kurikulum">
        <div class="filter-title">
          <h2>Daftar Capaian & Tujuan Pembelajaran</h2>
        </div>
        <div class="filter-controls-kurikulum">
          <select v-model="filterMapelId" @change="gantiFilterMapel" class="filter-select-kurikulum">
            <option value="">-- Pilih Mapel untuk Melihat Data --</option>
            <option v-for="m in listMapel" :key="m.id" :value="m.id">{{ m.nama_mapel }}</option>
          </select>
        </div>
      </div>

      <div v-if="isLoading" class="loading-text">
        <i class="fa-solid fa-spinner fa-spin"></i> Sedang memuat data kurikulum...
      </div>
      
      <div class="empty-state" v-else-if="!filterMapelId">
        <i class="fa-solid fa-book-open empty-icon"></i>
        <p>Silakan pilih mata pelajaran terlebih dahulu pada pilihan di atas untuk mengelola sebaran kurikulum.</p>
      </div>

      <div class="empty-state" v-else-if="listCP.length === 0">
        <i class="fa-solid fa-folder-open empty-icon"></i>
        <p>Belum ada data Capaian Pembelajaran (CP) yang terdaftar untuk mata pelajaran ini.</p>
      </div>

      <div class="accordion-wrapper" v-else>
        <div v-for="cp in listCP" :key="cp.id" class="accordion-item" :class="{ 'is-open': activeAccordionId === cp.id }">
          
          <div class="accordion-header" @click="toggleAccordion(cp.id)">
            <div class="cp-info">
              <span class="badge-fase">Fase {{ cp.fase }}</span>
              <strong class="elemen-text">Elemen: {{ cp.elemen }}</strong>
            </div>
            <div class="cp-actions" @click.stop>
              <button @click="mulaiEditCP(cp)" class="btn-action-mini btn-edit-mini" title="Edit CP"><i class="fa-solid fa-pen"></i></button>
              <button @click="hapusCP(cp.id)" class="btn-action-mini btn-delete-mini" title="Hapus CP"><i class="fa-solid fa-trash"></i></button>
              <i class="fa-solid fa-chevron-down arrow-icon"></i>
            </div>
          </div>

          <div class="accordion-content" v-if="activeAccordionId === cp.id">
            <div class="cp-description-block">
              <h5>Konten Deskripsi Capaian Pembelajaran (CP):</h5>
              <p>{{ cp.deskripsi }}</p>
            </div>

            <div class="tp-section">
              <div class="tp-header-row">
                <h4><i class="fa-solid fa-list-check"></i> Manajemen Tujuan Pembelajaran (TP)</h4>
                <span class="tp-mode-indicator" :class="{ 'mode-edit': isEditModeTP }">
                  {{ isEditModeTP ? 'Mode Edit TP Aktif' : 'Tambah TP Baru' }}
                </span>
              </div>

              <form @submit.prevent="simpanTP(cp.id)" class="form-inline-tp">
                <input v-model="formTP.kode_tp" type="text" placeholder="Kode (Contoh: TP-01)" required class="input-kode-tp" />
                <input v-model="formTP.deskripsi" type="text" placeholder="Tulis deskripsi kompetensi tujuan pembelajaran..." required class="input-desc-tp" />
                <button type="submit" class="btn-submit-tp" :style="{ backgroundColor: isEditModeTP ? '#FBC02D' : '#689F38', color: isEditModeTP ? '#1E5631' : 'white' }">
                  <i :class="isEditModeTP ? 'fa-solid fa-check' : 'fa-solid fa-plus'"></i> {{ isEditModeTP ? 'Update' : 'Tambah' }}
                </button>
                <button v-if="isEditModeTP" type="button" @click="batalEditTP" class="btn-cancel-tp">Batal</button>
              </form>

              <table class="table-tp" v-if="cp.list_tp && cp.list_tp.length > 0">
                <thead>
                  <tr>
                    <th width="15%">Kode TP</th>
                    <th>Kompetensi Tujuan Pembelajaran</th>
                    <th width="15%" class="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tp in cp.list_tp" :key="tp.id">
                    <td class="kode-tp-cell">{{ tp.kode_tp }}</td>
                    <td>{{ tp.deskripsi }}</td>
                    <td class="text-center">
                      <button @click="mulaiEditTP(tp)" class="btn-table-edit" title="Edit TP"><i class="fa-solid fa-pencil"></i></button>
                      <button @click="hapusTP(tp)" class="btn-table-delete" title="Hapus TP"><i class="fa-solid fa-trash"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p class="empty-sub-text" v-else><i class="fa-solid fa-circle-info"></i> Belum ada Tujuan Pembelajaran (TP) yang disematkan pada elemen ini.</p>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api'; // Menggunakan instance api internal Anda
import Swal from 'sweetalert2';

// Sinkronisasi komponen Toast bawaan aplikasi Anda
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

// State Data Master
const listMapel = ref([]);
const listCP = ref([]);
const filterMapelId = ref('');
const isLoading = ref(false);
const activeAccordionId = ref(null);

// State Validasi Form
const validationErrorsCP = ref({});

// State Form CP
const isEditModeCP = ref(false);
const formCP = ref({ id: '', mapel_id: '', fase: '', elemen: '', deskripsi: '' });

// State Form TP
const isEditModeTP = ref(false);
const formTP = ref({ id: '', capaian_pembelajaran_id: '', kode_tp: '', deskripsi: '' });

// ==========================================
// OPERASI AMBIL DATA DARI BACKEND
// ==========================================

const muatDataMapel = async () => {
  try {
    const response = await api.get('/mapel', { params: { per_page: 500 } });
    listMapel.value = response.data.data || response.data;
  } catch (error) {
    console.error('Gagal memuat master data mapel', error);
  }
};

const muatDataCP = async () => {
  if (!filterMapelId.value) {
    listCP.value = [];
    return;
  }
  isLoading.value = true;
  try {
    const response = await api.get('/capaian-pembelajaran', {
      params: { mapel_id: filterMapelId.value }
    });
    listCP.value = response.data.data || response.data;
  } catch (error) {
    console.error("Gagal memuat data CP:", error);
  } finally {
    isLoading.value = false;
  }
};

const muatDetailCP = async (cpId) => {
  try {
    const response = await api.get(`/capaian-pembelajaran/${cpId}`);
    const index = listCP.value.findIndex(item => item.id === cpId);
    if (index !== -1) {
      listCP.value[index] = response.data.data || response.data;
    }
  } catch (error) {
    console.error("Gagal sinkronisasi data detail sub-TP:", error);
  }
};

const gantiFilterMapel = () => {
  activeAccordionId.value = null;
  formCP.value.mapel_id = filterMapelId.value;
  muatDataCP();
};

const toggleAccordion = (cpId) => {
  if (activeAccordionId.value === cpId) {
    activeAccordionId.value = null;
  } else {
    activeAccordionId.value = cpId;
    batalEditTP();
    muatDetailCP(cpId);
  }
};

// ==========================================
// OPERASI CRUD CAPAIAN PEMBELAJARAN (CP)
// ==========================================

const simpanCP = async () => {
  validationErrorsCP.value = {};
  try {
    if (isEditModeCP.value) {
      await api.put(`/capaian-pembelajaran/${formCP.value.id}`, formCP.value);
      Toast.fire({ icon: 'success', title: 'Data CP berhasil diperbarui!' });
    } else {
      await api.post('/capaian-pembelajaran', formCP.value);
      Toast.fire({ icon: 'success', title: 'Capaian Pembelajaran baru ditambahkan!' });
    }
    filterMapelId.value = formCP.value.mapel_id;
    batalEditCP();
    muatDataCP();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      validationErrorsCP.value = error.response.data.errors;
    } else {
      Toast.fire({ icon: 'error', title: 'Gagal memproses data CP.' });
    }
  }
};

const mulaiEditCP = (cp) => {
  isEditModeCP.value = true;
  formCP.value = { ...cp };
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const batalEditCP = () => {
  isEditModeCP.value = false;
  formCP.value = { id: '', mapel_id: filterMapelId.value, fase: '', elemen: '', deskripsi: '' };
  validationErrorsCP.value = {};
};

const hapusCP = async (id) => {
  const result = await Swal.fire({
    title: 'Hapus CP?',
    text: "Menghapus CP akan menghapus seluruh data sub-TP didalamnya!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d9534f',
    cancelButtonColor: '#1E5631',
    confirmButtonText: 'Ya, Hapus',
    background: '#FFE0B2',
    color: '#1E5631'
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/capaian-pembelajaran/${id}`);
      muatDataCP();
      Toast.fire({ icon: 'success', title: 'Data CP berhasil disingkirkan.' });
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Gagal menghapus data.' });
    }
  }
};

// ==========================================
// OPERASI CRUD TUJUAN PEMBELAJARAN (TP)
// ==========================================

const simpanTP = async (cpId) => {
  formTP.value.capaian_pembelajaran_id = cpId;
  try {
    if (isEditModeTP.value) {
      await api.put(`/tujuan-pembelajaran/${formTP.value.id}`, formTP.value);
      Toast.fire({ icon: 'success', title: 'Tujuan Pembelajaran berhasil diperbarui!' });
    } else {
      await api.post('/tujuan-pembelajaran', formTP.value);
      Toast.fire({ icon: 'success', title: 'Tujuan Pembelajaran ditambahkan!' });
    }
    batalEditTP();
    muatDetailCP(cpId);
  } catch (error) {
    Toast.fire({ icon: 'error', title: 'Gagal memproses data sub-TP.' });
  }
};

const mulaiEditTP = (tp) => {
  isEditModeTP.value = true;
  formTP.value = { ...tp };
};

const batalEditTP = () => {
  isEditModeTP.value = false;
  formTP.value = { id: '', capaian_pembelajaran_id: '', kode_tp: '', deskripsi: '' };
};

const hapusTP = async (tp) => {
  const result = await Swal.fire({
    title: 'Hapus Item TP ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d9534f',
    cancelButtonColor: '#1E5631',
    confirmButtonText: 'Hapus',
    background: '#FFE0B2',
    color: '#1E5631'
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/tujuan-pembelajaran/${tp.id}`);
      muatDetailCP(tp.capaian_pembelajaran_id);
      Toast.fire({ icon: 'success', title: 'Item TP terhapus.' });
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Gagal membuang data.' });
    }
  }
};

onMounted(() => {
  muatDataMapel();
});
</script>

<style scoped>
/* Grid Layout & Form Sesuai Struktur PlottingView */
.content-body { padding: 0; font-family: 'Segoe UI', sans-serif; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; border-top: 5px solid #FBC02D; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.margin-top-10 { margin-top: 10px; }
.margin-top-25 { margin-top: 25px; }
h2 { color: #1E5631; margin-bottom: 15px; font-size: 20px; }

.form-grid-kurikulum { display: grid; grid-template-columns: repeat(2, 1fr) 2fr; gap: 15px; align-items: end; background-color: #f9fbf9; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; }
.input-group-select { display: flex; flex-direction: column; width: 100%; }
.input-group-select label { font-size: 13px; color: #1E5631; font-weight: bold; margin-bottom: 6px; }
.form-grid-kurikulum select, .form-grid-kurikulum input, .form-grid-kurikulum textarea { box-sizing: border-box; padding: 10px 12px; border: 1px solid #689F38; border-radius: 5px; font-size: 14px; outline: none; background: white; width: 100%; }
.form-grid-kurikulum select { height: 42px; }
.full-width { grid-column: 1 / -1; }
.error-text { color: #d9534f; font-size: 12px; margin-top: 4px; font-weight: bold; }

.button-group-kurikulum { display: flex; gap: 10px; margin-top: 10px; }
.btn-submit-main, .btn-cancel-main { border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 8px; font-size: 14px; }
.btn-cancel-main { background-color: #d9534f; color: white; }

/* Filter Kontrol Area */
.filter-wrapper-kurikulum { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #689F38; padding-bottom: 12px; margin-bottom: 15px; flex-wrap: wrap; gap: 10px; }
.filter-select-kurikulum { height: 38px; padding: 0 10px; border: 1px solid #689F38; border-radius: 5px; background: white; font-size: 14px; color: #333; outline: none; min-width: 240px; font-weight: bold; }

.loading-text { text-align: center; padding: 30px; font-weight: bold; color: #1E5631; font-size: 15px; }
.empty-state { text-align: center; padding: 40px; color: #666; background: #fafafa; border-radius: 8px; border: 1px dashed #689F38; }
.empty-icon { font-size: 36px; color: #689F38; margin-bottom: 10px; display: block; }

/* Komponen Accordion */
.accordion-wrapper { display: flex; flex-direction: column; gap: 12px; }
.accordion-item { border: 1px solid #FFE0B2; border-radius: 6px; overflow: hidden; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
.accordion-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: #fdfaf6; cursor: pointer; user-select: none; }
.accordion-header:hover { background: #fff3e0; }

.cp-info { display: flex; align-items: center; gap: 12px; }
.badge-fase { background: #1E5631; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; }
.elemen-text { font-size: 14.5px; color: #222; }
.cp-actions { display: flex; align-items: center; gap: 6px; }
.arrow-icon { margin-left: 10px; transition: transform 0.25s ease; color: #1E5631; }
.is-open .arrow-icon { transform: rotate(180deg); }

.accordion-content { padding: 20px; background: #fff; border-top: 1px solid #FFE0B2; }
.cp-description-block { background: #f9f9f9; padding: 15px; border-left: 4px solid #1E5631; margin-bottom: 20px; border-radius: 0 4px 4px 0; }
.cp-description-block h5 { margin: 0 0 6px 0; color: #1E5631; font-size: 13px; font-weight: bold; }
.cp-description-block p { margin: 0; font-size: 14px; line-height: 1.6; color: #444; }

/* Sub Modul Manajemen TP */
.tp-section { border-top: 1px dashed #ffe0b2; padding-top: 18px; }
.tp-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.tp-header-row h4 { margin: 0; font-size: 14px; color: #1E5631; font-weight: bold; }
.tp-mode-indicator { font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: bold; background: #e8f5e9; color: #2e7d32; }
.tp-mode-indicator.mode-edit { background: #fffde7; color: #f57f17; }

.form-inline-tp { display: flex; gap: 10px; margin-bottom: 15px; }
.input-kode-tp { width: 15%; padding: 10px; border: 1px solid #689F38; border-radius: 5px; outline: none; }
.input-desc-tp { flex: 1; padding: 10px; border: 1px solid #689F38; border-radius: 5px; outline: none; }
.btn-submit-tp, .btn-cancel-tp { border: none; padding: 0 18px; border-radius: 5px; color: white; font-weight: bold; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 5px; }
.btn-cancel-tp { background: #d9534f; }

/* Desain Tabel TP */
.table-tp { width: 100%; border-collapse: collapse; margin-top: 5px; }
.table-tp th { background-color: #1E5631; color: white; padding: 10px; font-size: 13px; text-align: left; }
.table-tp td { padding: 11px 10px; border-bottom: 1px solid #FFE0B2; font-size: 13.5px; color: #333; }
.kode-tp-cell { font-weight: bold; color: #e65100; }

.btn-action-mini { border: none; padding: 5px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; }
.btn-edit-mini { background: #ffe0b2; color: #e65100; }
.btn-delete-mini { background: #fdd8d5; color: #c62828; }
.btn-table-edit { border: none; background: #fff3e0; color: #e65100; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
.btn-table-delete { border: none; background: #feebee; color: #c62828; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 5px; }
.text-center { text-align: center; }
.empty-sub-text { font-style: italic; color: #999; font-size: 13px; padding: 10px 0; }

/* Responsive Grid Breakpoints */
@media (max-width: 992px) {
  .form-grid-kurikulum { grid-template-columns: 1fr 1fr; }
  .full-width-mobile { grid-column: 1 / -1; }
}
@media (max-width: 576px) {
  .form-grid-kurikulum { grid-template-columns: 1fr; }
  .form-inline-tp { flex-direction: column; }
  .input-kode-tp { width: 100%; }
  .btn-submit-tp, .btn-cancel-tp { height: 40px; justify-content: center; }
}
</style>