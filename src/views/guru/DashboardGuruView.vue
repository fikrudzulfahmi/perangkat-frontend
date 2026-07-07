<template>
  <div class="content-body">
    
    <div class="card-box welcome-box">
      <div class="welcome-text">
        <h2>Selamat Datang Kembali, Bapak/Ibu Guru! 👋</h2>
        <p>Silakan kelola Alur Tujuan Pembelajaran (ATP), KKTP, dan Modul Ajar berdasarkan tugas mengajar Anda pada daftar di bawah ini.</p>
      </div>
    </div>

    <div class="card-box table-container margin-top-25">
      <div style="border-bottom: 2px solid #689F38; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #1E5631;"><i class="fa-solid fa-chalkboard-user"></i> Tugas Mengajar Anda (Plotting)</h2>
        <p style="margin: 4px 0 0 0; color: #666; font-size: 13px;">Daftar kelas dan mata pelajaran yang Anda ampu pada tahun pelajaran aktif.</p>
      </div>

      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i> Memuat data tugas mengajar...
      </div>

      <div v-else-if="listPlotting.length === 0" class="empty-state">
        <i class="fa-solid fa-folder-open empty-icon"></i>
        <p>Anda belum memiliki plotting mengajar. Silakan hubungi Admin Kurikulum untuk melakukan plotting kelas.</p>
      </div>

      <div v-else class="plotting-grid">
        <div v-for="plot in listPlotting" :key="plot.id" class="plotting-card">
          
          <div class="card-badge-row">
            <span class="badge-thn"><i class="fa-solid fa-calendar-days"></i> {{ plot.tahun_pelajaran || '2026/2027' }}</span>
            <span class="badge-jp-minggu">{{ plot.jp_per_minggu || 0 }} JP/Minggu</span>
          </div>

          <div class="card-main-info">
            <h3>{{ plot.mapel || plot.nama_mapel }}</h3>
            <p class="subtitle-pilih-kelas">Silakan pilih kelas untuk menyusun perangkat:</p>
          </div>
          
          <div class="nested-kelas-container">
            <div 
              v-for="kls in (plot.list_kelas || plot.kelas || [])" 
              :key="kls.id" 
              class="kelas-row-item"
            >
              <div class="kelas-name-info">
                <i class="fa-solid fa-users" style="color: #e65100;"></i> 
                <strong>{{ kls.nama_kelas || kls.kelas || kls.nama }}</strong>
              </div>
              
              <div class="kelas-action-buttons">
                <button @click="navigasiKePerangkat('atp', plot.mapel_id, kls.id)" class="btn-action-perangkat btn-blue">ATP</button>
                <button @click="navigasiKePerangkat('kktp', plot.mapel_id, kls.id)" class="btn-action-perangkat btn-orange">KKTP</button>
                <button @click="navigasiKePerangkat('modul', plot.mapel_id, kls.id)" class="btn-action-perangkat btn-green">Modul</button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';

const router = useRouter();
const listPlotting = ref([]);
const isLoading = ref(false);

const muatPlottingSaya = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/guru/plotting', { params: { per_page: 100 } });
    listPlotting.value = response.data.data || response.data || [];
  } catch (error) {
    console.error("Gagal memuat tugas mengajar guru:", error);
  } finally {
    isLoading.value = false;
  }
};

// Navigasi Fleksibel dengan melemparkan klsId (yang berisi id dari table plotting_kelas)
const navigasiKePerangkat = (jenis, mapelId, plottingKelasId) => {
  router.push({ 
    name: `guru.${jenis}`, 
    query: { mapel_id: mapelId, kelas_id: plottingKelasId } 
  });
};

onMounted(() => {
  muatPlottingSaya();
});
</script>

<style scoped>
.content-body { padding: 30px; background-color: #fcf8f2; flex: 1; min-height: 100vh; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 25px; border: 1px solid #FFE0B2; }
.welcome-box { background: linear-gradient(135deg, #1E5631 0%, #689F38 100%); color: white; border: none; }
.welcome-box h2 { margin: 0 0 8px 0; color: #FBC02D; font-size: 22px; }
.welcome-box p { margin: 0; color: #FFE0B2; font-size: 14px; }

/* Grid Mapping */
.plotting-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 24px; margin-top: 20px; }
@media (max-width: 480px) { .plotting-grid { grid-template-columns: 1fr; } }

.plotting-card { background: white; border: 1px solid #E0E0E0; border-radius: 12px; padding: 25px; display: flex; flex-direction: column; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: all 0.3s ease; }
.plotting-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); border-color: #689F38; }

.card-badge-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.badge-thn { background: #1E5631; color: white; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; }
.badge-jp-minggu { background: #F5F5F5; color: #424242; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; border: 1px solid #E0E0E0; }

.card-main-info h3 { margin: 0 0 6px 0; color: #1E5631; font-size: 20px; font-weight: bold; }
.subtitle-pilih-kelas { margin: 0 0 15px 0; color: #757575; font-size: 13.5px; }

/* Styling List Kelas Sesuai Gambar Mockup */
.nested-kelas-container { display: flex; flex-direction: column; gap: 12px; margin-top: 10px; border-top: 1px dashed #E0E0E0; padding-top: 15px; }
.kelas-row-item { display: flex; justify-content: space-between; align-items: center; background-color: #FFFDF9; border: 1px solid #FFE0B2; padding: 12px 16px; border-radius: 8px; transition: 0.2s; }
.kelas-row-item:hover { background-color: #FFF3E0; }
.kelas-name-info { display: flex; align-items: center; gap: 10px; font-size: 14.5px; color: #212121; }

/* Tombol Aksi */
.kelas-action-buttons { display: flex; gap: 8px; }
.btn-action-perangkat { border: none; color: white; padding: 6px 14px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.08); }
.btn-action-perangkat:hover { transform: translateY(-1px); filter: brightness(1.1); }

.btn-blue { background-color: #1976D2; }
.btn-orange { background-color: #EF6C00; }
.btn-green { background-color: #2E7D32; }

.loading-state, .empty-state { text-align: center; padding: 40px; color: #666; }
.empty-icon { font-size: 40px; color: #FFE0B2; margin-bottom: 10px; }
</style>