<template>
  <div class="content-body">
    
    <div class="card-box header-prosem-box">
      <div class="header-flex">
        <button @click="kembaliKeDashboard" class="btn-back">
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </button>
        <div class="meta-info">
          <h2>Program Tahunan (Prota) & Program Semester (Prosem)</h2>
          <p v-if="selectedPlot">Kelola alokasi distribusi jam pelajaran (JP) per minggu secara efektif.</p>
        </div>
      </div>
    </div>

    <div class="card-box margin-top-25">
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0; color: #1E5631;"><i class="fa-solid fa-filter"></i> Pilih Tugas Mengajar (Plotting)</h3>
        <p style="margin: 4px 0 0 0; color: #666; font-size: 13px;">Silakan pilih kelas dan mata pelajaran terlebih dahulu.</p>
      </div>
     <select v-model="selectedPlot" @change="onPlotChange" class="input-prosem-select">
        <option :value="null">-- Pilih Mata Pelajaran & Kelas --</option>
        <option v-for="plot in listPlotting" :key="plot.id" :value="plot.id">
          {{ plot.mapel || plot.nama_mapel }} - Kelas {{ formatArrayKelas(plot.list_kelas || plot.kelas || []) }}
        </option>
      </select>
    </div>

    <div v-if="selectedPlot && !isLoading" class="margin-top-25">
      
      <div class="card-box">
        <div class="section-title-flex">
          <h3 class="title-green"><i class="fa-solid fa-book-open"></i> I. Rekapitulasi Program Tahunan (Prota)</h3>
          <div class="badge-info-jp">
            Total JP Seting RME: <strong>{{ metaProsem.total_jp_tahunan }} JP</strong> 
            <small>({{ metaProsem.total_rme }} RME × {{ metaProsem.jp_per_minggu }} JP)</small>
          </div>
        </div>

        <div class="table-responsive margin-top-15">
          <table class="table-custom">
            <thead>
              <tr>
                <th style="width: 60px; text-align: center;">No</th>
                <th style="width: 100px; text-align: center;">Semester</th>
                <th>Tujuan Pembelajaran (TP)</th>
                <th style="width: 120px; text-align: center;">Alokasi Waktu</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="allTps.length > 0">
                <tr v-for="(tp, index) in allTps" :key="tp.id">
                  <td style="text-align: center;">{{ index + 1 }}</td>
                  <td style="text-align: center;">
                    <span :class="['badge-sm', tp.semester === 'Ganjil' ? 'bg-ganjil' : 'bg-genap']">
                      {{ tp.semester }}
                    </span>
                  </td>
                  <td>{{ tp.kode_tp || tp.kode }} - {{ tp.deskripsi || tp.narasi || tp.deskripsi_tp }}</td>
                  <td style="text-align: center; font-weight: bold; color: #1E5631;">
                    {{ tp.alokasi_jp ?? 0 }} JP
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="4" class="text-center" style="padding: 20px; color: #888;">
                  Belum ada data Tujuan Pembelajaran (ATP) untuk mata pelajaran ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card-box margin-top-25">
        <div class="section-title-flex">
          <div>
            <h3 class="title-green"><i class="fa-solid fa-calendar-days"></i> II. Matriks Distribusi Program Semester (Prosem)</h3>
            <p style="margin: 4px 0 0 0; color: #666; font-size: 13px;">Isi jumlah alokasi JP pada minggu efektif di bawah ini.</p>
          </div>
          
          <div class="semester-toggle-group">
            <button 
              @click="currentSemester = 'Ganjil'" 
              :class="['btn-toggle', currentSemester === 'Ganjil' ? 'active-ganjil' : '']"
            >
              Semester Ganjil
            </button>
            <button 
              @click="currentSemester = 'Genap'" 
              :class="['btn-toggle', currentSemester === 'Genap' ? 'active-genap' : '']"
            >
              Semester Genap
            </button>
          </div>
        </div>

        <div class="table-responsive margin-top-20 table-prosem-wrapper">
          <table class="table-custom table-matrix">
            <thead>
              <tr>
                <th rowspan="2" style="min-width: 250px; vertical-align: middle;">Tujuan Pembelajaran (TP)</th>
                <th rowspan="2" style="width: 70px; text-align: center; vertical-align: middle;">Jml JP</th>
                <th v-for="bulan in kolomBulan" :key="bulan.nama" colspan="4" style="text-align: center;" class="th-bulan">
                  {{ bulan.nama }}
                </th>
              </tr>
              <tr>
                <template v-for="bulan in kolomBulan" :key="'m-'+bulan.nama">
                  <th v-for="m in 4" :key="bulan.nama+'-'+m" style="width: 35px; text-align: center; font-size: 11px; padding: 4px 2px;">
                    {{ m }}
                  </th>
                </template>
              </tr>
            </thead>
            <tbody>
              <template v-if="filteredTps.length > 0">
                <tr v-for="tp in filteredTps" :key="'matrix-'+tp.id">
                  <td class="tp-cell-text">
  <span class="tp-code-badge">{{ tp.kode_tp || tp.kode }}</span> {{ tp.deskripsi || tp.narasi || tp.deskripsi_tp }}
</td>
                  <td style="text-align: center; font-weight: bold; background: #f9f9f9;">
                    {{ tp.alokasi_jp ?? 0 }}
                  </td>
                  
                  <template v-for="bulan in kolomBulan" :key="'input-b-'+bulan.id">
                    <td v-for="m in 4" :key="'input-m-'+tp.id+'-'+bulan.id+'-'+m" style="padding: 2px; text-align: center;">
                      <input 
                        type="number" 
                        v-model.number="matrixForm[tp.id][bulan.id][m]"
                        class="input-grid-jp"
                        min="0"
                        placeholder="-"
                        @change="validateInputJp(tp)"
                      />
                    </td>
                  </template>
                </tr>
                
                <tr class="row-summary-jp">
                  <td style="text-align: right; font-weight: bold; padding-right: 15px;">Jumlah Terdistribusi per Minggu:</td>
                  <td style="text-align: center; font-weight: bold; background: #e8f5e9;">{{ totalJpTerinput }}</td>
                  <template v-for="bulan in kolomBulan" :key="'sum-b-'+bulan.id">
                    <td v-for="m in 4" :key="'sum-m-'+bulan.id+'-'+m" class="text-center font-bold font-sm text-green">
                      {{ hitungTotalPerKolom(bulan.id, m) || '' }}
                    </td>
                  </template>
                </tr>
              </template>
              <tr v-else>
                <td :colspan="2 + (kolomBulan.length * 5)" class="text-center" style="padding: 30px; color: #888;">
                  Tidak ada data Tujuan Pembelajaran untuk Semester {{ currentSemester }}.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="footer-actions margin-top-20" v-if="filteredTps.length > 0">
          <div class="info-warning" v-if="totalJpTerinput > metaProsem.total_jp_tahunan">
            <i class="fa-solid fa-triangle-exclamation"></i> Peringatan: Total JP terdistribusi ({{ totalJpTerinput }} JP) melebihi batas seting RME ({{ metaProsem.total_jp_tahunan }} JP)!
          </div>
          <button @click="simpanProsem" class="btn-save-prosem" :disabled="isSaving">
            <i class="fa-solid fa-floppy-disk"></i> {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan Prosem' }}
          </button>
        </div>

      </div>

    </div>

    <div v-if="isLoading" class="card-box text-center margin-top-25" style="padding: 4px 0;">
       <p style="color: #666;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat Struktur Data Prota & Prosem...</p>
    </div>

  </div>
</template>

<script>
// MENGGUNAKAN API INSTANCE ANDA (Sudah otomatis mengarah ke /api dan bawa Token)
import api from '../../services/api'; 
import Swal from 'sweetalert2';

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

export default {
  name: 'ProsemView',
  data() {
    return {
      selectedPlot: null,
      currentSemester: 'Ganjil', 
      isLoading: false,
      isSaving: false,
      listPlotting: [],

      metaProsem: {
        total_rme: 0,
        jp_per_minggu: 0,
        total_jp_tahunan: 0
      },
      
      allTps: [], 
      matrixForm: {}, 
    };
  },

  
  
  computed: {
    kolomBulan() {
      if (this.currentSemester === 'Ganjil') {
        return [
          { id: 7, nama: 'JULI' },
          { id: 8, nama: 'AGUSTUS' },
          { id: 9, nama: 'SEPTEMBER' },
          { id: 10, nama: 'OKTOBER' },
          { id: 11, nama: 'NOVEMBER' },
          { id: 12, nama: 'DESEMBER' }
        ];
      } else {
        return [
          { id: 1, nama: 'JANUARI' },
          { id: 2, nama: 'FEBRUARI' },
          { id: 3, nama: 'MARET' },
          { id: 4, nama: 'APRIL' },
          { id: 5, nama: 'MEI' },
          { id: 6, nama: 'JUNI' }
        ];
      }
    },

    filteredTps() {
      return this.allTps.filter(tp => tp.semester === this.currentSemester);
    },

    totalJpTerinput() {
      let total = 0;
      Object.keys(this.matrixForm).forEach(tpId => {
        if (this.matrixForm[tpId]) {
          Object.keys(this.matrixForm[tpId]).forEach(bulanId => {
            Object.keys(this.matrixForm[tpId][bulanId]).forEach(m => {
              const val = parseInt(this.matrixForm[tpId][bulanId][m]) || 0;
              total += val;
            });
          });
        }
      });
      return total;
    }
  },

  methods: {
    // Helper untuk menampilkan nama kelas di dropdown
    formatArrayKelas(arr) {
      if (!arr || arr.length === 0) return 'Tidak ada kelas';
      if (typeof arr === 'string') return arr; 
      return arr.map(k => k.nama_kelas || k.kelas || k.nama).join(', ');
    },

    async muatPlottingGuru() {
      try {
        const response = await api.get('/guru/plotting', { params: { per_page: 100 } }); 
        this.listPlotting = response.data.data || response.data || [];
      } catch (error) {
        console.error("Gagal memuat list plotting:", error);
      }
    },
    
    kembaliKeDashboard() {
      this.$router.push('/guru/dashboard');
    },

    async onPlotChange() {
      if (!this.selectedPlot) {
        this.allTps = [];
        this.matrixForm = {};
        return;
      }

      this.isLoading = true;
      try {
        // 1. Ambil data Prosem
        const response = await api.get('/guru/prosem', {
          params: { plotting_id: this.selectedPlot }
        });

        const resData = response.data.data || response.data;
        
        this.metaProsem.total_rme = resData.total_rme ?? 0;
        this.metaProsem.jp_per_minggu = resData.jp_per_minggu ?? 0;
        this.metaProsem.total_jp_tahunan = resData.total_jp_tahunan ?? 0;

        // 2. Tarik REFERENSI ATP (Ini yang tadi hilang di kode Anda)
        let dataSavedATP = [];
        try {
          const selectedPlotObj = this.listPlotting.find(p => String(p.id) === String(this.selectedPlot));
          const mId = selectedPlotObj ? (selectedPlotObj.mapel_id || selectedPlotObj.id_mapel) : null;
          
          if (mId) {
            const resATP = await api.get('/guru/atp', {
              params: { mapel_id: mId, kelas_id: this.selectedPlot }
            });
            dataSavedATP = resATP.data.data || resATP.data || [];
          }
        } catch (e) {
          console.error("Gagal memuat referensi ATP:", e);
        }

        // 3. Flatten data CP -> list TP & MAPPING DENGAN ATP
        let tempTps = [];
        if (resData.list_cp && Array.isArray(resData.list_cp)) {
          resData.list_cp.forEach(cp => {
            if (cp.list_tp && Array.isArray(cp.list_tp)) {
              cp.list_tp.forEach(rawTp => {
                // Kloning objek agar view HTML mendeteksi perubahan
                let tp = { ...rawTp };
                
                tp.kode = tp.kode_tp || tp.kode || '';
                tp.narasi = tp.deskripsi || tp.deskripsi_tp || tp.narasi || '';

                // PENCOCOKAN: Cari settingan Semester dan JP di tabel ATP
                const atpMatch = dataSavedATP.find(a => String(a.tujuan_pembelajaran_id) === String(tp.id));
                
                if (atpMatch) {
                  // MENGAMBIL REFERENSI DARI ATP
                  tp.semester = String(atpMatch.semester) === '2' ? 'Genap' : 'Ganjil';
                  tp.alokasi_jp = parseInt(atpMatch.alokasi_jp) || 0;
                  tp.nomor_urut = parseInt(atpMatch.nomor_urut) || 99;
                } else {
                  // JIKA BELUM ADA DI ATP (Fallback)
                  if (tp.kode && typeof tp.kode === 'string' && tp.kode.includes('.')) {
                    const subBab = tp.kode.split('.')[1];
                    tp.semester = parseInt(subBab) % 2 !== 0 ? 'Ganjil' : 'Genap';
                  } else {
                    tp.semester = 'Ganjil';
                  }
                  tp.alokasi_jp = 0;
                  tp.nomor_urut = 99;
                }
                
                tempTps.push(tp);
              });
            }
          });
        }
        
        // Urutkan TP sesuai tabel ATP
        tempTps.sort((a, b) => (a.nomor_urut || 0) - (b.nomor_urut || 0));
        this.allTps = tempTps;

        // 4. Inisialisasi Form Matrix
        let initialMatrix = {};
        this.allTps.forEach(tp => {
          initialMatrix[tp.id] = {};
          for (let b = 1; b <= 12; b++) {
            initialMatrix[tp.id][b] = { 1: '', 2: '', 3: '', 4: '', 5: '' };
          }
        });

        // 5. Map data Prosem lama
        if (resData.saved_prosem && Array.isArray(resData.saved_prosem)) {
          resData.saved_prosem.forEach(item => {
            if (item && item.tujuan_pembelajaran_id && initialMatrix[item.tujuan_pembelajaran_id]) {
              const b = parseInt(item.bulan);
              const m = parseInt(item.minggu_ke);
              if (b >= 1 && b <= 12 && m >= 1 && m <= 5) {
                initialMatrix[item.tujuan_pembelajaran_id][b][m] = item.alokasi_jp ?? '';
              }
            }
          });
        }

        this.matrixForm = initialMatrix;
      } catch (error) {
        console.error("Detail Error Prosem:", error);
        Swal.fire('Error', 'Gagal memuat struktur data Prosem.', 'error');
      } finally {
        this.isLoading = false;
      }
    },

    hitungTotalPerKolom(bulanId, mingguKe) {
      let sum = 0;
      this.filteredTps.forEach(tp => {
        if (this.matrixForm[tp.id] && this.matrixForm[tp.id][bulanId]) {
          sum += parseInt(this.matrixForm[tp.id][bulanId][mingguKe]) || 0;
        }
      });
      return sum;
    },

    validateInputJp(tp) {
      let totalBaris = 0;
      if (this.matrixForm[tp.id]) {
        for (let b = 1; b <= 12; b++) {
          if (this.matrixForm[tp.id][b]) {
            for (let m = 1; m <= 5; m++) {
              totalBaris += parseInt(this.matrixForm[tp.id][b][m]) || 0;
            }
          }
        }
      }
      if (totalBaris > (tp.alokasi_jp || 0)) {
        Swal.fire({
          title: 'Perhatian',
          text: `Distribusi JP untuk TP ${tp.kode} (${totalBaris} JP) melebihi target alokasi di ATP (${tp.alokasi_jp} JP).`,
          icon: 'warning',
          timer: 3000,
          showConfirmButton: false
        });
      }
    },

    async simpanProsem() {
      this.isSaving = true;
      
      let itemsToSave = [];
      Object.keys(this.matrixForm).forEach(tpId => {
        Object.keys(this.matrixForm[tpId]).forEach(bulanId => {
          Object.keys(this.matrixForm[tpId][bulanId]).forEach(m => {
            const val = this.matrixForm[tpId][bulanId][m];
            itemsToSave.push({
              tujuan_pembelajaran_id: tpId,
              bulan: parseInt(bulanId),
              minggu_ke: parseInt(m),
              alokasi_jp: val === '' ? 0 : parseInt(val)
            });
          });
        });
      });

     try {
        const response = await api.post('/guru/prosem/save', {
          plotting_id: this.selectedPlot,
          items: itemsToSave
        });

        // Menyesuaikan dengan response API Prosem Anda yang menggunakan status === 'success'
        if (response.data.status === 'success' || response.status === 200) {
          Toast.fire({
            icon: 'success',
            title: response.data.message || 'Data Program Semester berhasil disimpan!'
          });
          this.onPlotChange(); 
        }
      } catch (error) {
        console.error("Gagal menyimpan Prosem:", error);
        if (error.response && error.response.status === 422) {
          Toast.fire({ 
            icon: 'error', 
            title: 'Validasi gagal, periksa format data!' 
          });
        } else {
          Toast.fire({ 
            icon: 'error', 
            title: 'Gagal menyimpan data ke server.' 
          });
        }
      } finally {
        this.isSaving = false;
      }
    }
  },
  mounted() {
    this.muatPlottingGuru();
  }
};
</script>
<style scoped>
/* CSS diselaraskan dengan KktpView.vue */
.content-body { padding: 20px; font-family: 'Segoe UI', sans-serif; }
.card-box { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #ebdcc5; }
.margin-top-25 { margin-top: 25px; }
.margin-top-20 { margin-top: 20px; }
.margin-top-15 { margin-top: 15px; }
.text-center { text-align: center; }
.font-bold { font-weight: bold; }
.font-sm { font-size: 13px; }
.text-green { color: #1E5631; }

/* Header Styling */
.header-prosem-box { background: linear-gradient(135deg, #1E5631 0%, #4C9A2A 100%); color: white; border: none; }
.header-flex { display: flex; align-items: center; gap: 20px; }
.btn-back { background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.4); color: white; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: 500; transition: 0.2s; }
.btn-back:hover { background: rgba(255, 255, 255, 0.3); }
.meta-info h2 { margin: 0; font-size: 20px; font-weight: 600; }
.meta-info p { margin: 5px 0 0 0; font-size: 13px; color: #e0f2f1; }

/* Filter Select */
.input-prosem-select { width: 100%; max-width: 500px; padding: 12px; border-radius: 6px; border: 1px solid #ccc; font-size: 14px; outline: none; transition: 0.2s; }
.input-prosem-select:focus { border-color: #1E5631; box-shadow: 0 0 5px rgba(30, 86, 49, 0.2); }

/* Section Title Flex */
.section-title-flex { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; border-bottom: 2px solid #e8f5e9; padding-bottom: 12px; }
.title-green { margin: 0; color: #1E5631; font-size: 16px; display: flex; align-items: center; gap: 8px; }

/* Badges & Info */
.badge-info-jp { background: #e8f5e9; color: #2e7d32; padding: 6px 12px; border-radius: 20px; font-size: 13px; border: 1px solid #c8e6c9; }
.badge-sm { padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; color: white; }
.bg-ganjil { background-color: #0288d1; }
.bg-genap { background-color: #f57c00; }

/* Custom Responsive Table */
.table-responsive { width: 100%; overflow-x: auto; }
.table-custom { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
.table-custom th { background-color: #1E5631; color: white; padding: 10px; font-weight: 600; border: 1px solid #143d22; }
.table-custom td { padding: 10px; border: 1px solid #e0e0e0; vertical-align: middle; }
.table-custom tbody tr:hover { background-color: #fcfbf7; }

/* Matriks Prosem Khusus Grid */
.table-prosem-wrapper { max-height: 500px; overflow-y: auto; }
.table-matrix th.th-bulan { background-color: #388e3c; border-color: #2e7d32; font-size: 12px; letter-spacing: 0.5px; }
.tp-cell-text { max-width: 300px; white-space: normal; word-wrap: break-word; line-height: 1.4; }
.tp-code-badge { background: #eee; font-weight: bold; padding: 2px 5px; border-radius: 3px; font-size: 11px; color: #333; }

/* Input Grid Matrix */
.input-grid-jp { width: 100%; max-width: 30px; text-align: center; padding: 4px 0; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; font-weight: bold; transition: 0.2s; outline: none; }
.input-grid-jp:focus { border-color: #2e7d32; background: #f1f8e9; }
/* Hapus panah up/down default input type number */
.input-grid-jp::-webkit-inner-spin-button, 
.input-grid-jp::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

/* Row Summary / Hasil Akumulasi */
.row-summary-jp { background-color: #f5f5f5; font-weight: bold; }
.row-summary-jp td { border-top: 2px solid #ccc; border-bottom: 2px solid #ccc; }

/* Semester Toggle Button Group */
.semester-toggle-group { display: flex; gap: 2px; background: #eee; padding: 3px; border-radius: 6px; }
.btn-toggle { border: none; background: transparent; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer; border-radius: 4px; transition: 0.2s; color: #555; }
.btn-toggle:hover { background: rgba(0,0,0,0.05); }
.active-ganjil { background: #0288d1 !important; color: white !important; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.active-genap { background: #f57c00 !important; color: white !important; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

/* Footer Actions */
.footer-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
.info-warning { background-color: #fff3e0; color: #e65100; border: 1px solid #ffe0b2; padding: 8px 15px; border-radius: 5px; font-size: 12px; font-weight: 500; }
.btn-save-prosem { background-color: #1E5631; color: white; border: none; padding: 12px 24px; font-size: 14px; font-weight: bold; border-radius: 5px; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: 0.2s; }
.btn-save-prosem:hover:not(:disabled) { background-color: #143d22; transform: translateY(-1px); }
.btn-save-prosem:disabled { background-color: #999; cursor: not-allowed; }
</style>