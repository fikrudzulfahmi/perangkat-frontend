<template>
  <div class="content-body">
    
    <div class="card-box header-kktp-box">
      <div class="header-flex">
        <button @click="kembaliKeDashboard" class="btn-back">
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </button>
        <div class="meta-info">
          <h2>Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)</h2>
          <p v-if="mapelId && kelasId">Tentukan standar ketuntasan kompetensi berbasis pendekatan interval kualitatif.</p>
        </div>
      </div>
    </div>

   <div class="card-box margin-top-25 filter-card">
      <label for="plottingSelect" class="filter-label" style="display: block; font-weight: bold; color: #1E5631; margin-bottom: 10px; font-size: 14.5px;">
        <i class="fa-solid fa-sliders"></i> Pilih Tugas Mengajar (Plotting):
      </label>
      <select 
        id="plottingSelect" 
        v-model="selectedPlottingId" 
        @change="handlePlottingChange" 
        class="input-filter-select"
        style="width: 100%; max-width: 500px; height: 45px; padding: 0 15px; font-size: 15px; border: 2px solid #689F38; border-radius: 6px; outline: none; background: white; font-weight: 500; cursor: pointer; color: #333;"
      >
        <option value="">-- Silakan Pilih Mapel & Kelas --</option>
        <option 
          v-for="plot in listPlottingRaw" 
          :key="plot.id" 
          :value="plot.id"
        >
          {{ plot.mapel || plot.nama_mapel }} 
          ({{ formatArrayKelas(plot.list_kelas || plot.kelas || []) }})
        </option>
      </select>
    </div>

    <div v-if="!mapelId || !kelasId" class="empty-state margin-top-25">
      <i class="fa-solid fa-hand-pointer empty-icon"></i>
      <p>Silakan pilih tugas mengajar pada filter di atas untuk menampilkan data KKTP.</p>
    </div>

    <div v-else class="card-box margin-top-25 table-container">
      <div class="section-header-kktp">
        <div>
          <h3><i class="fa-solid fa-scale-balanced"></i> Standarisasi Interval Nilai Per TP</h3>
          <p class="subtitle">Sistem otomatis memetakan rekomendasi interval <em>Deep Learning</em> berdasarkan target minimum.</p>
        </div>
        <button @click="simpanSemuaKKTP" class="btn-save-all" :disabled="isSaving">
          <i class="fa-solid fa-floppy-disk"></i> {{ isSaving ? 'Menyimpan...' : 'Simpan KKTP' }}
        </button>
      </div>

      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i> Memuat data indikator kurikulum...
      </div>

      <div v-else-if="listCP.length === 0" class="empty-state">
        <i class="fa-solid fa-folder-open empty-icon"></i>
        <p>Belum ada data Capaian Pembelajaran (CP) untuk mata pelajaran ini.</p>
      </div>

      <div v-else v-for="cp in listCP" :key="cp.id" class="element-block">
        <div class="element-header">
          <span class="badge-fase">Fase {{ cp.fase }}</span>
          <h4>Elemen: {{ cp.elemen }}</h4>
        </div>

        <table class="table-kktp">
          <thead>
            <tr>
              <th width="12%">Kode TP</th>
              <th width="38%">Tujuan Pembelajaran (TP)</th>
              <th width="15%">Target Minimum</th>
              <th width="35%">Deskripsi Interval Ketercapaian (Otomatis)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tp in cp.list_tp" :key="tp.id">
              <td class="kode-tp">{{ tp.kode_tp }}</td>
              <td class="desc-tp">{{ tp.deskripsi }}</td>
              <td>
                <div class="input-group-nilai">
                  <input 
                    v-model.number="formKKTP[tp.id].target_nilai" 
                    type="number" 
                    min="1" 
                    max="100" 
                    class="input-kktp-num" 
                  />
                  <span class="persen-badge">%</span>
                </div>
              </td>
              <td>
                <div class="interval-preview-box" v-if="formKKTP[tp.id]">
                  <div class="interval-row item-remedial">
                    <span class="range">0% - 40%</span>
                    <span class="desc">Belum tuntas, remedial seluruh bagian.</span>
                  </div>
                  <div class="interval-row item-remedial">
                    <span class="range">41% - {{ formKKTP[tp.id].target_nilai - 1 }}%</span>
                    <span class="desc">Belum tuntas, remedial di bagian tertentu.</span>
                  </div>
                  <div class="interval-row item-tuntas">
                    <span class="range">{{ formKKTP[tp.id].target_nilai }}% - 85%</span>
                    <span class="desc"><strong>Cakap:</strong> Mencapai target standar.</span>
                  </div>
                  <div class="interval-row item-mahir">
                    <span class="range">86% - 100%</span>
                    <span class="desc"><strong>Mahir:</strong> Pemahaman mendalam (Deep).</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../services/api'; 
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();

// Variabel disamakan dengan AtpView
const listPlottingRaw = ref([]);
const selectedPlottingId = ref(''); 

const mapelId = ref(route.query.mapel_id || '');
const kelasId = ref(route.query.kelas_id || '');

const listCP = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);
const formKKTP = ref({});

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

// Helper format array kelas persis seperti AtpView
const formatArrayKelas = (arr) => {
  if (!arr || arr.length === 0) return 'Tidak ada kelas';
  if (typeof arr === 'string') return arr; 
  return arr.map(k => k.nama_kelas || k.kelas || k.nama).join(', ');
};

const muatPlottingGuru = async () => {
  try {
    // Tambahkan parameter per_page: 100 agar semua data termuat
    const res = await api.get('/guru/plotting', { params: { per_page: 100 } });
    listPlottingRaw.value = res.data.data || res.data || [];

    if (kelasId.value) {
      const matched = listPlottingRaw.value.find(p => String(p.id) === String(kelasId.value));
      if (matched) {
        selectedPlottingId.value = matched.id;
        handlePlottingChange(false);
      }
    }
  } catch (error) {
    console.error("Gagal memuat list plotting:", error);
  }
};

const handlePlottingChange = (updateUrl = true) => {
  if (!selectedPlottingId.value) {
    mapelId.value = '';
    kelasId.value = '';
    listCP.value = [];
    return;
  }

  const selectedPlot = listPlottingRaw.value.find(p => String(p.id) === String(selectedPlottingId.value));
  
  if (selectedPlot) {
    mapelId.value = selectedPlot.mapel_id || selectedPlot.id_mapel;
    kelasId.value = selectedPlot.id; 
    
    // Sinkronkan ke URL
    if (updateUrl !== false) {
      router.replace({ query: { mapel_id: mapelId.value, kelas_id: kelasId.value } });
    }

    muatDataKKTP();
  }
};

// ... sisa fungsi kembaliKeDashboard, muatDataKKTP, simpanSemuaKKTP, dan onMounted tetap biarkan seperti aslinya

const kembaliKeDashboard = () => {
  router.push({ name: 'guru.dashboard' });
};

const muatDataKKTP = async () => {
  if (!mapelId.value || !kelasId.value) return;
  
  isLoading.value = true;
  try {
    const response = await api.get('/guru/kktp', {
      params: { mapel_id: mapelId.value, kelas_id: kelasId.value }
    });
    
    // Karena menggunakan JsonResource, payload asli dibungkus 'data'
    // Sehingga di Axios diakses dengan .data.data
    const payloadResource = response.data.data || {};
    
    const dataCP = payloadResource.list_cp || [];
    const savedKktp = payloadResource.saved_kktp || {};
    listCP.value = dataCP;

    formKKTP.value = {};
    dataCP.forEach(cp => {
      if (cp.list_tp) {
        cp.list_tp.forEach(tp => {
          const match = savedKktp[tp.id];
          formKKTP.value[tp.id] = {
            tujuan_pembelajaran_id: tp.id, // UUID
            target_nilai: match ? match.target_nilai : 75 // default jalan tengah
          };
        });
      }
    });

  } catch (error) {
    console.error("Gagal memuat data KKTP:", error);
    Toast.fire({ icon: 'error', title: 'Gagal memuat konfigurasi KKTP.' });
  } finally {
    isLoading.value = false;
  }
};

const simpanSemuaKKTP = async () => {
  isSaving.value = true;
  try {
    const payloadItems = Object.values(formKKTP.value);

    // Validasi sederhana: pastikan tidak ada nilai di luar rentang
    const nilaiValid = payloadItems.every(item => item.target_nilai >= 1 && item.target_nilai <= 100);
    if (!nilaiValid) {
      Toast.fire({ icon: 'warning', title: 'Target nilai harus berada di rentang 1 - 100!' });
      isSaving.value = false;
      return;
    }

    const payload = {
      kelas_id: kelasId.value, // UUID
      items: payloadItems
    };

    await api.post('/guru/kktp', payload);

    Toast.fire({
      icon: 'success',
      title: 'Kriteria KKTP berhasil disimpan!'
    });
  } catch (error) {
    console.error("Gagal menyimpan KKTP:", error);
    if (error.response && error.response.status === 422) {
      Toast.fire({ icon: 'error', title: 'Validasi gagal, periksa format data!' });
    } else {
      Toast.fire({ icon: 'error', title: 'Gagal menyimpan data ke server.' });
    }
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  muatDataKKTP();
  muatPlottingGuru();
});
</script>

<style scoped>
/* Styling menyesuaikan dengan tema Guru/Admin layout Agan */
.content-body { padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fcf8f2; min-height: 100vh; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 20px; }
.margin-top-15 { margin-top: 15px; }
.margin-top-25 { margin-top: 25px; }

/* Header Box Khas AtpView */
.header-kktp-box { background: #1E5631; border-top: none; color: white; padding: 20px 30px; border-radius: 10px; }
.header-flex { display: flex; align-items: center; gap: 20px; }
.btn-back { background: #689F38; border: none; color: white; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 8px; font-size: 14px; transition: 0.2s; }
.btn-back:hover { background: #FBC02D; color: #1E5631; }
.meta-info h2 { margin: 0 0 6px 0; font-size: 20px; color: #FBC02D; }
.meta-info p { margin: 0; color: #FFE0B2; font-size: 14px; }

.section-header-kktp { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 25px; }
.section-header-kktp h3 { margin: 0; color: #1E5631; font-size: 18px; font-weight: bold; }
.section-header-kktp .subtitle { margin: 6px 0 0 0; color: #666; font-size: 13.5px; }

.btn-save-all { background-color: #1E5631; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
.btn-save-all:hover:not(:disabled) { background-color: #689F38; }

.element-block { background: #fdfaf6; border: 1px solid #FFE0B2; border-radius: 8px; padding: 25px; margin-bottom: 30px; }
.element-header { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; border-bottom: 1px dashed #e0e0e0; padding-bottom: 12px; }
.badge-fase { background: #689F38; color: white; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 4px; }
.element-header h4 { margin: 0; font-size: 16px; color: #1E5631; }

.table-kktp { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; }
.table-kktp th { background-color: #689F38; color: white; padding: 14px 15px; font-size: 14px; text-align: left; }
.table-kktp td { padding: 14px 15px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; vertical-align: middle; }
.kode-tp { font-weight: bold; color: #e65100; font-size: 15px; }
.desc-tp { line-height: 1.5; color: #444; }

.input-group-nilai { display: flex; align-items: center; width: 95px; border: 1px solid #ccc; border-radius: 5px; overflow: hidden; }
.input-kktp-num { width: 65px; height: 38px; border: none; padding: 0 8px; text-align: center; font-size: 15px; font-weight: bold; outline: none; }
.persen-badge { background: #eee; width: 30px; height: 38px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #666; font-size: 13px; }

/* Preview Interval (Deep Learning) */
.interval-preview-box { display: flex; flex-direction: column; gap: 5px; font-size: 12px; background: #fafafa; padding: 8px; border-radius: 6px; border: 1px solid #ebdcc5; }
.interval-row { display: flex; gap: 10px; align-items: flex-start; line-height: 1.4; }
.interval-row .range { font-weight: bold; display: inline-block; min-width: 75px; padding: 2px 5px; border-radius: 3px; text-align: center; }
.item-remedial .range { background-color: #ffebee; color: #c62828; }
.item-tuntas .range { background-color: #e8f5e9; color: #2e7d32; }
.item-mahir .range { background-color: #e3f2fd; color: #1565c0; }
.interval-row .desc { color: #555; }

.loading-state { text-align: center; padding: 50px; font-weight: bold; color: #1E5631; }
.empty-state { text-align: center; padding: 50px; color: #666; }
.empty-state-alert { text-align: center; padding: 40px; border-top: 5px solid #d9534f; }
.alert-icon { font-size: 44px; color: #d9534f; margin-bottom: 12px; }
.btn-submit-kktp { background-color: #FBC02D; color: #1E5631; border: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; cursor: pointer; transition: 0.2s; }
.btn-submit-kktp:hover { background-color: #f9a825; }
</style>