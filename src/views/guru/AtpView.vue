<template>
  <div class="content-body">
    
    <div class="card-box header-atp-box">
      <div class="header-flex">
        <button @click="kembaliKeDashboard" class="btn-back">
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </button>
        <div class="meta-info">
          <h2>Penyusunan Alur Tujuan Pembelajaran (ATP)</h2>
          <p>Kelola dan petakan Tujuan Pembelajaran berdasarkan tugas mengajar Anda.</p>
        </div>
      </div>
    </div>

    <div class="card-box filter-card">
      <label for="plottingSelect" class="filter-label">
        <i class="fa-solid fa-sliders"></i> Pilih Tugas Mengajar:
      </label>
      <select 
        id="plottingSelect" 
        v-model="selectedPlottingId" 
        @change="handlePlottingChange" 
        class="input-filter-select"
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

    <div v-if="!mapelId || !kelasId" class="card-box empty-state-alert">
      <i class="fa-solid fa-map-location-dot alert-icon-info"></i>
      <h3>Fitur Pemetaan Siap</h3>
      <p>Silakan pilih kombinasi mata pelajaran dan kelas pada filter dropdown di atas untuk memuat susunan matriks ATP.</p>
    </div>

    <div v-else class="card-box table-container">
      <div class="section-header-atp">
        <div>
          <h3><i class="fa-solid fa-route"></i> Pemetaan Matriks TP ke dalam Semester & JP</h3>
          <p class="subtitle">Struktur ATP ini disimpan mengacu pada plot mengajar kelas terpilih.</p>
        </div>
        
        <div style="display: flex; gap: 10px;">
          <button @click="bukaModalClone" type="button" class="btn-clone-atp" :disabled="!selectedPlottingId">
            <i class="fa-solid fa-copy"></i> Clone ATP Teman
          </button>
          <button @click="simpanSemuaATP" class="btn-save-all" :disabled="isSaving">
            <i class="fa-solid fa-floppy-disk"></i> {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan ATP' }}
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i> Memuat daftar Capaian & Tujuan Pembelajaran...
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
        <p class="cp-deskripsi-singkat"><strong>Deskripsi CP:</strong> {{ cp.deskripsi }}</p>

        <table class="table-atp">
          <thead>
            <tr>
              <th width="12%">Kode TP</th>
              <th width="43%">Kompetensi Tujuan Pembelajaran (TP)</th>
              <th width="15%">Semester</th>
              <th width="15%">No. Urut Alur</th>
              <th width="15%">Alokasi (JP)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tp in cp.list_tp" :key="tp.id">
              <td class="kode-tp">{{ tp.kode_tp || tp.kode }}</td>
              <td class="desc-tp">{{ tp.deskripsi || tp.deskripsi_tp }}</td>
              <td>
                <select v-model="formATP[tp.id].semester" class="input-atp-select">
                  <option value="">-- Pilih --</option>
                  <option value="1">Semester 1 (Ganjil)</option>
                  <option value="2">Semester 2 (Genap)</option>
                </select>
              </td>
              <td>
                <input v-model.number="formATP[tp.id].nomor_urut" type="number" min="1" class="input-atp-num" />
              </td>
              <td>
                <input v-model.number="formATP[tp.id].alokasi_jp" type="number" min="0" class="input-atp-num" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="listCP.length > 0" class="card-box" style="background-color: #fdfaf6; border: 1px dashed #689F38; padding: 15px; border-radius: 8px; margin-top: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="margin: 0; color: #1E5631;"><i class="fa-solid fa-scale-balanced"></i> Kalkulasi Alokasi JP</h4>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #666;">
              Berdasarkan Rincian Minggu Efektif (RME):<br>
              <strong>{{ totalMingguEfektif }} Minggu Efektif</strong> x <strong>{{ jpPerMinggu }} JP/Minggu</strong> = <strong>{{ targetJpTahunan }} Target JP</strong> setahun.
            </p>
          </div>
          
          <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
            <div style="font-size: 24px; font-weight: bold; color: #333;">
              {{ totalJpTerpakai }} <span style="font-size: 16px; color: #666;">/ {{ targetJpTahunan }} JP</span>
            </div>
            
            <div :style="{ 
              color: jpStatus.color, 
              backgroundColor: jpStatus.bg,
              border: `1px solid ${jpStatus.color}`,
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }">
              <i :class="['fa-solid', jpStatus.icon]"></i>
              {{ jpStatus.text }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-action-row" v-if="listCP.length > 0">
        <button @click="simpanSemuaATP" class="btn-save-all-bottom" :disabled="isSaving">
          <i class="fa-solid fa-check-double"></i> {{ isSaving ? 'Menyimpan...' : 'Finalisasi & Simpan Struktur ATP' }}
        </button>
      </div>
    </div>

    <div v-if="showCloneModal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">
          <h4><i class="fa-solid fa-users"></i> Salin Struktur ATP Teman</h4>
          <button @click="showCloneModal = false" class="close-modal-btn">&times;</button>
        </div>
        <div class="modal-body">
          
          <div class="form-group" style="margin-bottom: 15px;">
            <label class="modal-label">1. Pilih Tahun Pelajaran Referensi:</label>
            <select v-model="selectedTahunTeman" @change="handleTahunTemanChange" class="input-filter-select">
              <option value="">-- Pilih Tahun Pelajaran --</option>
              <option v-for="tp in listTahunPelajaran" :key="tp.id" :value="tp.id">
                {{ tp.tahun_ajaran || tp.tahun_pelajaran || tp.nama_tahun || tp.nama }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="modal-label">2. Pilih Rekan Guru & Kelas:</label>
            <select 
              v-model="selectedPlottingTeman" 
              class="input-filter-select" 
              :disabled="!selectedTahunTeman || isLoadingTemanList"
            >
              <option value="">
                {{ !selectedTahunTeman ? '-- Pilih Tahun Pelajaran Dulu --' : (isLoadingTemanList ? 'Sedang memuat data rekan...' : '-- Pilih Referensi Guru --') }}
              </option>
              <option v-for="teman in listTemanAtp" :key="teman.id" :value="teman.id">
                {{ teman.guru?.name || teman.nama_guru || 'Guru Lain' }} - 
                Kelas {{ formatArrayKelas(teman.list_kelas || teman.kelas || []) }}
              </option>
            </select>
            <small v-if="selectedTahunTeman && listTemanAtp.length === 0 && !isLoadingTemanList" style="color: #c62828; margin-top: 5px; display: block;">
              * Tidak ditemukan guru lain yang mengajar mapel ini pada tahun tersebut.
            </small>
          </div>

        </div>
        <div class="modal-footer">
          <button @click="showCloneModal = false" class="btn-modal-batal">Batal</button>
          <button 
            @click="prosesCloneAtp" 
            class="btn-modal-terapkan" 
            :disabled="!selectedPlottingTeman || isLoadingTeman"
          >
            <i class="fa-solid fa-download"></i> {{ isLoadingTeman ? 'Menyalin...' : 'Terapkan Struktur' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../services/api';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();

const listPlottingRaw = ref([]);
const selectedPlottingId = ref(''); 

const mapelId = ref('');
const kelasId = ref(''); 

const targetJpTahunan = ref(0);
const totalMingguEfektif = ref(0);
const jpPerMinggu = ref(0);

const listCP = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);
const formATP = ref({});

// State Kebutuhan Clone Modal
const showCloneModal = ref(false);
const listTahunPelajaran = ref([]);
const selectedTahunTeman = ref('');
const listTemanAtp = ref([]);
const selectedPlottingTeman = ref('');
const isLoadingTemanList = ref(false);
const isLoadingTeman = ref(false);

const Toast = Swal.mixin({
  toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
  timerProgressBar: true, background: '#1E5631', color: '#FFE0B2',
});

const kembaliKeDashboard = () => {
  router.push({ name: 'guru.dashboard' });
};

const formatArrayKelas = (arr) => {
  if (!arr || arr.length === 0) return 'Tidak ada kelas';
  if (typeof arr === 'string') return arr; 
  return arr.map(k => k.nama_kelas || k.kelas || k.nama).join(', ');
};

const totalJpTerpakai = computed(() => {
  return Object.values(formATP.value).reduce((total, item) => total + (Number(item.alokasi_jp) || 0), 0);
});

const jpStatus = computed(() => {
  const selisih = targetJpTahunan.value - totalJpTerpakai.value;
  
  if (selisih > 0) {
    return { text: `Kurang ${selisih} JP`, color: '#B78103', bg: '#FFF9C4', icon: 'fa-circle-exclamation' };
  } else if (selisih < 0) {
    return { text: `Kelebihan ${Math.abs(selisih)} JP`, color: '#C62828', bg: '#FFEBEE', icon: 'fa-circle-xmark' };
  } else {
    return { text: 'JP Terpenuhi', color: '#2E7D32', bg: '#E8F5E9', icon: 'fa-circle-check' };
  }
});

const muatSemuaPlottingDropdown = async () => {
  try {
    const res = await api.get('/guru/plotting', { params: { per_page: 100 } });
    listPlottingRaw.value = res.data.data || res.data || [];
    
    if (route.query.kelas_id) {
      selectedPlottingId.value = String(route.query.kelas_id);
      handlePlottingChange();
    }
  } catch (error) {
    console.error("Gagal memuat tugas mengajar dropdown:", error);
  }
};

const handlePlottingChange = () => {
  if (!selectedPlottingId.value) {
    mapelId.value = ''; kelasId.value = ''; listCP.value = [];
    targetJpTahunan.value = 0; totalMingguEfektif.value = 0; jpPerMinggu.value = 0;
    return;
  }
  
  const selectedPlot = listPlottingRaw.value.find(p => String(p.id) === String(selectedPlottingId.value));

  if (selectedPlot) {
    kelasId.value = selectedPlot.id; 
    mapelId.value = selectedPlot.mapel_id || selectedPlot.id_mapel;
    jpPerMinggu.value = selectedPlot.jp_per_minggu || 0;

    router.replace({ query: { mapel_id: mapelId.value, kelas_id: kelasId.value } });
    fetchKonteksDanDataMatriks(selectedPlot.tahun_pelajaran_id);
  }
};

const fetchKonteksDanDataMatriks = async (tahunAjarId) => {
  await muatKonteksRme(tahunAjarId);
  await muatStrukturKurikulumDanATP();
};

const muatKonteksRme = async (tahunAjarId) => {
  if (!tahunAjarId) return;
  try {
    const resRme = await api.get(`/guru/rme/total-minggu`, { params: { tahun_pelajaran_id: tahunAjarId } });
    totalMingguEfektif.value = resRme.data.total_minggu_efektif || 0;
    targetJpTahunan.value = totalMingguEfektif.value * jpPerMinggu.value;
  } catch (error) {
    console.error("Gagal hitung RME:", error);
  }
};

const muatStrukturKurikulumDanATP = async () => {
  if (!mapelId.value || !kelasId.value) return;
  isLoading.value = true;
  try {
    const resCP = await api.get('/guru/capaian-pembelajaran', { params: { mapel_id: mapelId.value } });
    listCP.value = resCP.data.data || resCP.data || [];

    let dataSavedATP = [];
    try {
      const resATP = await api.get('/guru/atp', { params: { mapel_id: mapelId.value, kelas_id: kelasId.value } });
      dataSavedATP = resATP.data.data || resATP.data || [];
    } catch (e) {
      console.log("Belum ada data ATP untuk kelas ini.");
    }

    formATP.value = {};
    listCP.value.forEach(cp => {
      const listTp = cp.list_tp || cp.listTp || [];
      listTp.forEach(tp => {
        const savedMatch = Array.isArray(dataSavedATP) 
          ? dataSavedATP.find(a => String(a.tujuan_pembelajaran_id) === String(tp.id)) 
          : null;
          
        formATP.value[tp.id] = {
          tujuan_pembelajaran_id: tp.id,
          semester: savedMatch ? savedMatch.semester : '',
          nomor_urut: savedMatch ? savedMatch.nomor_urut : '',
          alokasi_jp: savedMatch ? savedMatch.alokasi_jp : ''
        };
      });
    });

  } catch (error) {
    console.error("Gagal memuat struktur kurikulum:", error);
  } finally {
    isLoading.value = false;
  }
};

const simpanSemuaATP = async () => {
  isSaving.value = true;
  try {
    const payloadItems = Object.values(formATP.value);
    const adaYangKosong = payloadItems.some(item => !item.semester || !item.nomor_urut || item.alokasi_jp === '');

    if (adaYangKosong) {
      Toast.fire({ icon: 'warning', title: 'Mohon lengkapi seluruh kolom matriks!' });
      isSaving.value = false;
      return; 
    }

    const payload = { 
      mapel_id: mapelId.value,   
      kelas_id: kelasId.value, 
      items: payloadItems 
    };
    
    await api.post('/guru/atp', payload);
    Toast.fire({ icon: 'success', title: 'Matriks ATP berhasil disimpan!' });
  } catch (error) {
    Toast.fire({ icon: 'error', title: 'Gagal menyimpan data.' });
  } finally {
    isSaving.value = false;
  }
};

// 🛠️ UPDATE: Membuka modal menggunakan route '/guru/tahun-ajaran' yang sudah Anda miliki
const bukaModalClone = async () => {
  if (!selectedPlottingId.value) return;
  
  try {
    const res = await api.get('/guru/tahun-ajaran'); // Menggunakan endpoint milik Anda
    listTahunPelajaran.value = res.data.data || res.data || [];
    
    // Reset parameter modal
    selectedTahunTeman.value = '';
    selectedPlottingTeman.value = '';
    listTemanAtp.value = [];
    
    showCloneModal.value = true;
  } catch (error) {
    console.error(error);
    Toast.fire({ icon: 'error', title: 'Gagal memuat daftar Tahun Pelajaran.' });
  }
};

const handleTahunTemanChange = async () => {
  selectedPlottingTeman.value = '';
  listTemanAtp.value = [];
  if (!selectedTahunTeman.value) return;

  isLoadingTemanList.value = true;
  try {
    const res = await api.get('/guru/atp/referensi-teman', {
      params: { 
        plotting_id: selectedPlottingId.value,
        tahun_pelajaran_id: selectedTahunTeman.value 
      }
    });
    listTemanAtp.value = res.data.data || res.data || [];
  } catch (error) {
    console.error(error);
    Toast.fire({ icon: 'error', title: 'Gagal memuat daftar rekan guru.' });
  } finally {
    isLoadingTemanList.value = false;
  }
};

const prosesCloneAtp = async () => {
  isLoadingTeman.value = true;
  try {
    const res = await api.get('/guru/atp/ambil-teman', {
      params: { plotting_id_teman: selectedPlottingTeman.value }
    });
    
    const atpTeman = res.data.data || [];
    
    if (atpTeman.length === 0) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Data Kosong', 
        text: 'Rekan guru yang dipilih belum mengisi atau menyimpan susunan matriks ATP mereka.',
        confirmButtonColor: '#1E5631'
      });
      isLoadingTeman.value = false;
      return;
    }

    let terisi = 0;
    atpTeman.forEach(atp => {
      if (formATP.value[atp.tujuan_pembelajaran_id]) {
        formATP.value[atp.tujuan_pembelajaran_id].semester = atp.semester || '';
        formATP.value[atp.tujuan_pembelajaran_id].nomor_urut = atp.nomor_urut || '';
        formATP.value[atp.tujuan_pembelajaran_id].alokasi_jp = atp.alokasi_jp || '';
        terisi++;
      }
    });

    showCloneModal.value = false;
    Toast.fire({ 
      icon: 'success', 
      title: `${terisi} Pengaturan berhasil disalin! Silakan klik simpan.` 
    });

  } catch (error) {
    console.error(error);
    Toast.fire({ icon: 'error', title: 'Gagal menyalin data ATP rekan.' });
  } finally {
    isLoadingTeman.value = false;
  }
};

onMounted(() => {
  muatSemuaPlottingDropdown();
});
</script>

<style scoped>
.content-body { padding: 30px; font-family: 'Segoe UI', sans-serif; background-color: #f8f9fa; min-height: 100vh; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; border-top: 4px solid #689F38; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 20px; }
.header-atp-box { background: #1E5631; border-top: none; color: white; padding: 20px 30px; }
.header-flex { display: flex; align-items: center; gap: 20px; }
.btn-back { background: #689F38; border: none; color: white; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 8px; }
.btn-back:hover { background: #FBC02D; color: #1E5631; }
.meta-info h2 { margin: 0 0 4px 0; font-size: 20px; color: #FBC02D; }
.meta-info p { margin: 0; color: #FFE0B2; font-size: 13px; }

/* Filter Card */
.filter-card { border-top: 4px solid #FBC02D; background-color: #FFFDE7; }
.filter-label { display: block; font-weight: bold; color: #1E5631; margin-bottom: 10px; font-size: 14.5px; }
.input-filter-select { width: 100%; height: 45px; padding: 0 15px; font-size: 15px; border: 2px solid #689F38; border-radius: 6px; outline: none; background: white; font-weight: 500; cursor: pointer; color: #333; margin-bottom: 5px; }

.section-header-atp { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 25px; }
.btn-save-all, .btn-save-all-bottom { background-color: #1E5631; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.btn-save-all:hover, .btn-save-all-bottom:hover { background-color: #689F38; }

.empty-state-alert { text-align: center; padding: 50px; color: #777; border-top: 4px solid #B0BEC5; }
.alert-icon-info { font-size: 50px; color: #689F38; margin-bottom: 15px; }

.element-block { background: #fdfaf6; border: 1px solid #FFE0B2; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
.element-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.badge-fase { background: #689F38; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; }
.cp-deskripsi-singkat { margin: 0 0 15px 0; font-size: 13.5px; background: #fff; padding: 12px; border-radius: 6px; border-left: 4px solid #FBC02D; }

.table-atp { width: 100%; border-collapse: collapse; background: white; border: 1px solid #e0e0e0; border-radius: 6px; }
.table-atp th { background-color: #689F38; color: white; padding: 12px; font-size: 13.5px; text-align: left; }
.table-atp td { padding: 12px; border-bottom: 1px solid #eee; font-size: 13.5px; }
.kode-tp { font-weight: bold; color: #e65100; }

.input-atp-select, .input-atp-num { width: 100%; height: 36px; padding: 0 8px; border: 1px solid #ccc; border-radius: 4px; outline: none; }
.input-atp-num { text-align: center; }
.footer-action-row { display: flex; justify-content: flex-end; margin-top: 20px; padding-top: 15px; border-top: 2px solid #eee; }

/* CSS UNTUK FITUR TOMBOL CLONE & MODAL POP-UP */
.btn-clone-atp { background-color: #0288D1; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s; }
.btn-clone-atp:hover:not(:disabled) { background-color: #01579B; }
.btn-clone-atp:disabled { background-color: #B0BEC5; cursor: not-allowed; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 9999; }
.modal-card { background: white; border-radius: 8px; width: 500px; max-width: 90%; box-shadow: 0 10px 25px rgba(0,0,0,0.2); overflow: hidden; animation: fadeIn 0.3s ease; }
.modal-header { background: #1E5631; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
.modal-header h4 { margin: 0; font-size: 16px; color: #FBC02D; display: flex; align-items: center; gap: 8px; }
.close-modal-btn { background: none; border: none; color: white; font-size: 24px; cursor: pointer; line-height: 1; }
.modal-body { padding: 25px; }
.modal-footer { padding: 15px 20px; background: #f5f5f5; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e0e0e0; }

.modal-label { font-weight: bold; font-size: 13.5px; color: #1E5631; display: block; margin-bottom: 8px; }
.btn-modal-batal { background: #fff; color: #555; border: 1px solid #ccc; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; }
.btn-modal-terapkan { background: #0288D1; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 6px; }
.btn-modal-terapkan:disabled { background: #b0bec5; cursor: not-allowed; }

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>