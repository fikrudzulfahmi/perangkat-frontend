<template>
  <div class="content-body">
    
    <div class="card-box header-modul-box">
      <div class="header-flex">
        <button @click="kembaliKeDashboard" class="btn-back">
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </button>
        <div class="meta-info">
          <h2>Modul Ajar / RPP</h2>
          <p>Kelola dan pantau modul ajar berdasarkan target Tujuan Pembelajaran (TP).</p>
        </div>
      </div>
    </div>

    <div class="card-box margin-top-25">
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0; color: #1E5631;"><i class="fa-solid fa-filter"></i> Tugas Mengajar</h3>
        <p style="margin: 4px 0 0 0; color: #666; font-size: 13px;">Pilih mata pelajaran untuk melihat data daftar Modul Ajar / RPP.</p>
      </div>
      
      <div class="filter-wrapper">
       <div class="filter-item">
          <label class="filter-label">Mata Pelajaran & Kelas:</label>
          <select v-model="selectedPlotting" @change="onPlottingChange" class="input-text-select">
            <option value="">-- Tampilkan Semua Mata Pelajaran --</option>
            <option v-for="plot in listPlotting" :key="plot.id" :value="plot.id">
              {{ plot.mapel }} ({{ formatArrayKelas(plot.list_kelas) }})
            </option>
          </select>
        </div>
        </div>
    </div>

    <div v-if="!selectedPlotting" class="empty-state margin-top-25">
      <i class="fa-solid fa-hand-pointer empty-icon"></i>
      <p>Silakan pilih tugas mengajar di atas untuk menampilkan data Modul Ajar.</p>
    </div>

    <div v-else class="card-box margin-top-25">
      <div class="section-header">
        <div>
          <h3><i class="fa-solid fa-file-lines"></i> Daftar Perangkat Modul</h3>
          <p class="subtitle">Klik ikon panah <i class="fa-solid fa-chevron-right"></i> untuk melihat pemetaan rincian modul.</p>
        </div>
        <button @click="tambahModul" class="btn-add">
          <i class="fa-solid fa-plus"></i> Tambah Modul
        </button>
      </div>

      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i> Memuat data perangkat modul...
      </div>

      <div v-else-if="listModul.length === 0" class="empty-state">
        <i class="fa-solid fa-folder-open empty-icon"></i>
        <p>Belum ada Modul Ajar yang dibuat untuk kriteria ini.</p>
      </div>

      <table v-else class="table-custom">
        <thead>
          <tr>
            <th width="5%"></th> 
            <th width="35%">Bab / Pokok Bahasan Materi</th>
            <th width="15%">Pertemuan</th>
            <th width="15%">Alokasi Waktu</th>
            <th width="15%">Model Pembelajaran</th>
            <th width="15%">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="modul in listModul" :key="modul.id">
            <tr :class="{ 'row-active-expand': isExpanded(modul.id) }">
              <td style="text-align: center; vertical-align: middle;">
                <button @click="toggleRow(modul.id)" class="btn-expand-toggle" :class="{ 'rotated': isExpanded(modul.id) }">
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
              </td>
              <td>
                <strong style="color: #143d22; font-size: 15px;">{{ modul.bab_atau_materi }}</strong><br>
                <small style="color: #666;">Target: {{ modul.target_peserta }}</small>
              </td>
              <td style="vertical-align: middle;">Pertemuan {{ modul.pertemuan_ke }}</td>
              <td style="vertical-align: middle;">{{ modul.alokasi_waktu }}</td>
              <td style="vertical-align: middle;">
                <span class="badge-model">{{ modul.model_pembelajaran }}</span>
              </td>
              <td style="vertical-align: middle;">
                <div class="action-buttons">
                  <button @click="editModul(modul.id)" class="btn-icon btn-edit" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button @click="hapusModul(modul.id)" class="btn-icon btn-delete" title="Hapus">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="isExpanded(modul.id)" class="row-expanded-container">
              <td colspan="6" class="expanded-cell">
                
                <div class="expanded-grid">
                  <div class="expanded-subcard">
                    <h5><i class="fa-solid fa-bullseye" style="color: #689F38;"></i> Target Tujuan Pembelajaran (TP)</h5>
                    <ul v-if="modul.tujuan_pembelajarans && modul.tujuan_pembelajarans.length > 0">
                      <li v-for="tp in modul.tujuan_pembelajarans" :key="tp.id">
                        <span class="badge-kode-tp">TP {{ tp.kode_tp }}</span> {{ tp.deskripsi }}
                      </li>
                    </ul>
                    <p v-else class="empty-subtext">Modul ini belum menargetkan TP tertentu.</p>
                  </div>

                  <div class="expanded-subcard">
                    <h5><i class="fa-solid fa-file-signature" style="color: #1565c0;"></i> Asesmen (Jenis & Metode)</h5>
                    <ul class="asesmen-list-clean">
                      <li v-if="modul.asesmen_diagnostik">
                        <strong><i class="fa-solid fa-check-circle"></i> Asesmen Diagnostik:</strong> Kuesioner/Survei Singkat atau Diskusi Awal.
                      </li>
                      <li v-if="modul.asesmen_formatif">
                        <strong><i class="fa-solid fa-check-circle"></i> Asesmen Formatif:</strong> Observasi, Diskusi Kelompok, Penilaian Diri, Jurnal Belajar, dsb.
                      </li>
                      <li v-if="modul.asesmen_sumatif">
                        <strong><i class="fa-solid fa-check-circle"></i> Asesmen Sumatif:</strong> Proyek Akhir/Uji Kinerja, Tes Tulis Komprehensif, atau Portofolio.
                      </li>
                    </ul>
                    <p v-if="!modul.asesmen_diagnostik && !modul.asesmen_formatif && !modul.asesmen_sumatif" class="empty-subtext">Tidak ada jenis asesmen yang dipilih.</p>
                  </div>
                </div>

                <div class="expanded-grid margin-top-15">
                  <div class="expanded-subcard">
                    <h5><i class="fa-solid fa-users" style="color: #e65100;"></i> Profil Pelajar Pancasila</h5>
                    <div v-if="modul.profil_pancasila && modul.profil_pancasila.length > 0" class="profil-flex-container">
                      <span v-for="(profil, idx) in modul.profil_pancasila" :key="idx" class="badge-pancasila-item">
                        {{ profil }}
                      </span>
                    </div>
                    <p v-else class="empty-subtext">Belum ada profil pancasila yang dipilih.</p>
                  </div>

                  <div class="expanded-subcard">
                    <h5><i class="fa-solid fa-lightbulb" style="color: #fbc02d;"></i> Pemahaman Bermakna</h5>
                    <p class="text-block-detail">{{ modul.pemahaman_bermakna || 'Tidak diatur' }}</p>
                  </div>
                </div>

                <div class="expanded-subcard margin-top-15">
                  <h5><i class="fa-solid fa-list-ol" style="color: #1E5631;"></i> Skenario Langkah Kegiatan Pembelajaran</h5>
                  <div v-if="modul.kegiatan_pembelajaran && modul.kegiatan_pembelajaran.length > 0" class="timeline-kegiatan-box">
                    <div v-for="(keg, kIdx) in modul.kegiatan_pembelajaran" :key="kIdx" class="timeline-kegiatan-item">
                      <div class="timeline-kegiatan-meta">
                        <span class="timeline-tahap-badge">{{ keg.tahap }}</span>
                        <span class="timeline-durasi-text"><i class="fa-regular fa-clock"></i> {{ keg.durasi }}</span>
                      </div>
                      <div class="timeline-aktivitas-text pre-wrapped-text">{{ keg.aktivitas }}</div>
                    </div>
                  </div>
                  <p v-else class="empty-subtext">Skenario langkah kegiatan pembelajaran belum dibuat.</p>
                </div>

                <div class="expanded-grid margin-top-15">
                  <div class="expanded-subcard">
                    <h5><i class="fa-solid fa-file-pen" style="color: #1565c0;"></i> Lembar Kerja Peserta Didik (LKPD)</h5>
                    <p class="pre-wrapped-text">{{ modul.lkpd || 'Tidak diatur' }}</p>
                  </div>

                  <div class="expanded-subcard">
                    <h5><i class="fa-solid fa-book-atlas" style="color: #7b1fa2;"></i> Glosarium & Daftar Pustaka</h5>
                    <p class="pre-wrapped-text">{{ modul.glosarium_pustaka || 'Tidak diatur' }}</p>
                  </div>
                </div>

                <div class="expanded-footer-info remedial-box margin-top-15">
                  <div class="info-item">
                    <strong style="color: #d9534f;">🔄 Langkah Remedial:</strong>
                    <p class="pre-wrapped-text">{{ modul.remedial_content || 'Tidak diatur' }}</p>
                  </div>
                  <div class="info-item">
                    <strong style="color: #0277bd;">🚀 Evaluasi Pengayaan:</strong>
                    <p class="pre-wrapped-text">{{ modul.enrichment_content || 'Tidak diatur' }}</p>
                  </div>
                </div>

                <div class="expanded-footer-info margin-top-15">
                  <div class="info-item">
                    <strong>💡 Pertanyaan Pemantik:</strong>
                    <p>{{ modul.pertanyaan_pemantik || 'Tidak diatur' }}</p>
                  </div>
                  <div class="info-item">
                    <strong>🛠️ Sarana & Prasarana:</strong>
                    <p>{{ modul.sarana_prasarana || 'Tidak diatur' }}</p>
                  </div>
                </div>

              </td>
            </tr>
          </template>
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

// States
const isLoading = ref(false);
const listPlotting = ref([]);
const selectedPlotting = ref('');
const listModul = ref([]);
const expandedRows = ref([]);

const Toast = Swal.mixin({
  toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
  background: '#1E5631', color: '#FFE0B2', iconColor: '#FBC02D'
});

const formatArrayKelas = (arr) => {
  if (!arr || arr.length === 0) return 'Tidak ada kelas';
  if (typeof arr === 'string') return arr; 
  return arr.map(k => k.nama_kelas || k.kelas || k.nama).join(', ');
};

const kembaliKeDashboard = () => router.push({ name: 'guru.dashboard' });

const muatPlotting = async () => {
  try {
    const res = await api.get('/guru/plotting', { params: { per_page: 100 } });
    listPlotting.value = res.data.data || res.data || [];
  } catch (error) {
    console.error("Gagal muat plotting:", error);
  }
};

const onPlottingChange = () => {
  listModul.value = [];
  expandedRows.value = [];

  if (!selectedPlotting.value) return;
  muatModulAjar();
};

const muatModulAjar = async () => {
  if (!selectedPlotting.value) return;
  isLoading.value = true;
  try {
    const res = await api.get('/guru/modul-ajar', {
      params: {
        plotting_id: selectedPlotting.value
      }
    });
    listModul.value = res.data.data || res.data;
  } catch (error) {
    Toast.fire({ icon: 'error', title: 'Gagal memuat daftar modul ajar.' });
  } finally {
    isLoading.value = false;
  }
};

const toggleRow = (id) => {
  const index = expandedRows.value.indexOf(id);
  if (index > -1) {
    expandedRows.value.splice(index, 1);
  } else {
    expandedRows.value.push(id);
  }
};

const isExpanded = (id) => expandedRows.value.includes(id);

const tambahModul = () => {
  if (!selectedPlotting.value) {
    Toast.fire({ icon: 'warning', title: 'Silakan pilih Mata Pelajaran terlebih dahulu!' });
    return;
  }
  
  const plotAktif = listPlotting.value.find(p => p.id === selectedPlotting.value);
  
  router.push({ 
    name: 'guru.modul-ajar.create', 
    query: { 
      plotting_id: selectedPlotting.value,
      mapel_id: plotAktif.mapel_id 
    } 
  });
};

const editModul = (id) => {
  router.push({ name: 'guru.modul-ajar.edit', params: { id } });
};

const hapusModul = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus Modul Ajar?',
    text: "Dokumen modul yang dihapus tidak dapat dikembalikan!",
    icon: 'warning', showCancelButton: true, confirmButtonColor: '#d9534f',
    cancelButtonColor: '#6c757d', confirmButtonText: 'Ya, hapus!'
  });

  if (confirm.isConfirmed) {
    try {
      await api.delete(`/guru/modul-ajar/${id}`);
      Toast.fire({ icon: 'success', title: 'Modul Ajar berhasil dihapus!' });
      muatModulAjar();
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Gagal menghapus modul.' });
    }
  }
};

onMounted(() => {
  muatPlotting();
});
</script>

<style scoped>
.content-body { padding: 30px; background-color: #fcf8f2; min-height: 100vh; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.margin-top-25 { margin-top: 25px; }

/* Header */
.header-modul-box { background: #1E5631; color: white; padding: 20px 30px; }
.header-flex { display: flex; align-items: center; gap: 20px; }
.btn-back { background: #689F38; border: none; color: white; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.btn-back:hover { background: #FBC02D; color: #1E5631; }
.meta-info h2 { margin: 0 0 6px 0; color: #FBC02D; font-size: 20px; }
.meta-info p { margin: 0; color: #FFE0B2; font-size: 14px; }

/* Filter Section */
.filter-wrapper { display: flex; gap: 20px; flex-wrap: wrap; background: #f9fbe7; padding: 15px; border-radius: 8px; border: 1px solid #c5e1a5; margin-top: 10px; }
.filter-item { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 250px; }
.filter-label { font-weight: bold; color: #558b2f; font-size: 14px; }
.input-text-select { padding: 10px; border-radius: 5px; border: 1px solid #ccc; outline: none; background: white; font-size: 14px; }

/* Table Content */
.section-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 20px; }
.section-header h3 { margin: 0; color: #1E5631; font-size: 18px; }
.subtitle { margin: 6px 0 0 0; color: #666; font-size: 13.5px; }
.btn-add { background-color: #1E5631; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px; }
.btn-add:hover { background-color: #689F38; }

.table-custom { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; }
.table-custom th { background-color: #689F38; color: white; padding: 14px 15px; text-align: left; font-size: 14px; }
.table-custom td { padding: 14px 15px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; }
.badge-model { background: #efebe9; color: #4e342e; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }

/* Actions */
.btn-expand-toggle { background: none; border: none; color: #666; cursor: pointer; transition: transform 0.2s ease; font-size: 14px; }
.btn-expand-toggle.rotated { transform: rotate(90deg); color: #1E5631; }
.row-active-expand { background-color: #fdfaf6; }
.action-buttons { display: flex; gap: 8px; }
.btn-icon { border: none; padding: 8px 10px; border-radius: 4px; cursor: pointer; color: white; }
.btn-edit { background-color: #FBC02D; color: #1E5631; }
.btn-delete { background-color: #d9534f; }

/* Sub-card & Grid Untuk Expand Area */
.row-expanded-container { background-color: #fdfaf6; }
.expanded-cell { border-left: 5px solid #1E5631; padding: 20px !important; }
.expanded-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
@media (max-width: 768px) { .expanded-grid { grid-template-columns: 1fr; } }

.expanded-subcard { background: white; border: 1px solid #FFE0B2; border-radius: 8px; padding: 15px; box-shadow: 0 2px 6px rgba(0,0,0,0.01); }
.expanded-subcard h5 { margin: 0 0 12px 0; font-size: 14px; color: #1E5631; border-bottom: 1px solid #eee; padding-bottom: 8px; font-weight: bold; }
.expanded-subcard ul { padding-left: 15px; margin: 0; font-size: 13px; line-height: 1.6; }
.badge-kode-tp { font-weight: bold; color: #e65100; margin-right: 5px; }

/* CSS Baru Untuk Asesmen List */
.asesmen-list-clean { list-style-type: none; padding-left: 0 !important; margin: 0; }
.asesmen-list-clean li { margin-bottom: 8px; border-bottom: 1px dashed #eee; padding-bottom: 6px; }
.asesmen-list-clean li strong { color: #1E5631; font-weight: 600; }
.asesmen-list-clean li i { margin-right: 4px; color: #689F38; }

.empty-subtext { font-style: italic; color: #999; font-size: 12px; margin: 0; text-align: center; padding: 10px; }

/* Footer Info & Box Baru Remedial */
.expanded-footer-info { background: white; border: 1px solid #FFE0B2; border-radius: 8px; padding: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.remedial-box { border-color: #ffcdd2; background-color: #fffafb; } /* Bedakan warna untuk remedial & pengayaan */
@media (max-width: 768px) { .expanded-footer-info { grid-template-columns: 1fr; } }
.info-item strong { font-size: 13px; display: block; margin-bottom: 5px; }
.info-item p { margin: 0; color: #555; background: #fafafa; padding: 8px; border-radius: 5px; font-size: 13px; line-height: 1.4; border: 1px solid #eee; }

/* States Global */
.loading-state, .empty-state { text-align: center; padding: 50px; color: #666; font-weight: bold; }
.empty-icon { font-size: 44px; color: #ccc; margin-bottom: 15px; display: block; }

/* Utilities */
.margin-top-15 { margin-top: 15px; }
.text-block-detail { margin: 0; font-size: 13px; color: #555; line-height: 1.5; }
.pre-wrapped-text { white-space: pre-wrap; margin: 0; color: #555; font-size: 13px; line-height: 1.5; }

/* Profil Pancasila */
.profil-flex-container { display: flex; flex-wrap: wrap; gap: 6px; }
.badge-pancasila-item { background: #e8f5e9; color: #2e7d32; padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 500; border: 1px solid #c8e6c9; }

/* Timeline Skenario Kegiatan */
.timeline-kegiatan-box { display: flex; flex-direction: column; gap: 12px; border-left: 2px solid #e0e0e0; padding-left: 15px; margin-left: 5px; margin-top: 5px; }
.timeline-kegiatan-item { position: relative; }
.timeline-kegiatan-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.timeline-tahap-badge { background: #689F38; color: white; font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
.timeline-durasi-text { font-size: 11px; color: #e65100; font-weight: bold; }
.timeline-aktivitas-text { font-size: 13px; color: #444; line-height: 1.5; background: #fafafa; padding: 8px 12px; border-radius: 6px; border: 1px solid #eee; }
</style>