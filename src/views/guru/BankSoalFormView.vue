<template>
  <div class="content-body">
    <div class="card-box header-buku-box">
      <div class="header-flex">
        <button @click="batal" class="btn-back">
          <i class="fa-solid fa-arrow-left"></i> Batal
        </button>
        <div class="meta-info">
          <h2>{{ isEdit ? 'Edit Soal' : 'Tambah Soal Baru' }}</h2>
          <p>Lengkapi formulir di bawah untuk menyimpan soal ke bank data.</p>
        </div>
      </div>
    </div>

    <div class="card-box margin-top-25">
      <form @submit.prevent="simpanSoal" class="form-container">
        
        <div class="form-row">
          <div class="form-group w-50">
            <label>Mata Pelajaran (Plotting) <span class="text-danger">*</span></label>
            <select v-model="form.plotting_id" @change="muatTp" required class="input-text">
              <option value="" disabled>-- Pilih Mapel --</option>
              <option v-for="plot in listPlotting" :key="plot.id" :value="plot.id">
                {{ plot.mapel }} - Kelas {{ plot.nama_kelas_gabungan }}
              </option>
            </select>
          </div>
          
          <div class="form-group w-50">
            <label>Tujuan Pembelajaran (TP) Terkait</label>
            <select v-model="form.tp_id" class="input-text">
              <option value="">-- Tidak ditautkan ke TP --</option>
              
              <option v-for="tp in listTp" :key="tp.id" :value="tp.id">
                {{ tp.kode_tp }} - {{ tp.deskripsi }}
              </option>
              
            </select>
            <small style="color:#666">Pilih plotting untuk memuat TP.</small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group w-33">
            <label>Jenis Asesmen <span class="text-danger">*</span></label>
            <select v-model="form.jenis_asesmen" required class="input-text">
              <option value="Formatif">Formatif (Harian/Kuis)</option>
              <option value="Sumatif">Sumatif (UTS/UAS)</option>
            </select>
          </div>
          <div class="form-group w-33">
            <label>Tipe Soal <span class="text-danger">*</span></label>
            <select v-model="form.tipe_soal" required class="input-text">
              <option value="Pilihan Ganda">Pilihan Ganda</option>
              <option value="Esai">Esai</option>
              <option value="Praktik/Unjuk Kerja">Praktik/Unjuk Kerja</option>
            </select>
          </div>
          <div class="form-group w-33">
            <label>Tingkat Kesulitan <span class="text-danger">*</span></label>
            <select v-model="form.tingkat_kesulitan" required class="input-text">
              <option value="Mudah">Mudah</option>
              <option value="Sedang">Sedang</option>
              <option value="Sulit">Sulit</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="width: 150px;">
          <label>Bobot Nilai <span class="text-danger">*</span></label>
          <input type="number" v-model="form.bobot_nilai" required min="1" max="100" class="input-text text-center">
        </div>

        <hr class="divider">

        <div class="form-group">
          <label>Teks Pertanyaan / Instruksi <span class="text-danger">*</span></label>
          <textarea v-model="form.pertanyaan" required rows="5" class="input-text" placeholder="Ketik soal atau instruksi kerja di sini..."></textarea>
        </div>

        <div v-if="form.tipe_soal === 'Pilihan Ganda'" class="pg-container">
          <label>Pilihan Jawaban (A - E)</label>
          <div class="opsi-row" v-for="(opsi, index) in 5" :key="index">
            <span class="opsi-label">{{ String.fromCharCode(65 + index) }}.</span>
            <input type="text" v-model="form.pilihan_jawaban[index]" class="input-text" :placeholder="`Jawaban ${String.fromCharCode(65 + index)}`">
            
            <input type="radio" v-model="form.kunci_jawaban" :value="String.fromCharCode(65 + index)" name="kunci_pg" title="Jadikan Kunci Jawaban" class="radio-kunci">
          </div>
          <small style="color: #689F38;"><i class="fa-solid fa-info-circle"></i> Klik bulatan (radio button) di sebelah kanan untuk mengatur kunci jawaban.</small>
        </div>

        <div v-if="form.tipe_soal !== 'Pilihan Ganda'" class="form-group">
          <label>Kunci Jawaban / Rubrik Penilaian</label>
          <textarea v-model="form.kunci_jawaban" rows="4" class="input-text" placeholder="Tuliskan kunci jawaban atau kriteria penilaian (rubrik)..."></textarea>
        </div>

        <div class="form-footer">
          <button type="button" @click="batal" class="btn-cancel">Batal</button>
          <button type="submit" class="btn-save" :disabled="isSaving">
            <i class="fa-solid fa-floppy-disk"></i> {{ isSaving ? 'Menyimpan...' : 'Simpan Soal' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../../services/api';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();
const isEdit = ref(false);
const isSaving = ref(false);
const soalId = ref(null);

const listPlotting = ref([]);
const listTp = ref([]); // Nanti akan diisi data Tujuan Pembelajaran

const form = ref({
  plotting_id: '', tp_id: '',
  jenis_asesmen: 'Formatif', tipe_soal: 'Pilihan Ganda', tingkat_kesulitan: 'Sedang',
  bobot_nilai: 5, pertanyaan: '', pilihan_jawaban: ['', '', '', '', ''], kunci_jawaban: ''
});

const Toast = Swal.mixin({
  toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
  background: '#1E5631', color: '#FFE0B2', iconColor: '#FBC02D'
});

// Otomatis ubah bobot jika tipe soal berubah
watch(() => form.value.tipe_soal, (newVal) => {
  if (newVal === 'Pilihan Ganda') {
    form.value.bobot_nilai = 5;
    if (!form.value.pilihan_jawaban || form.value.pilihan_jawaban.length === 0) {
      form.value.pilihan_jawaban = ['', '', '', '', ''];
    }
  } else {
    form.value.bobot_nilai = 20;
    form.value.pilihan_jawaban = null; // Kosongkan array untuk Esai
    form.value.kunci_jawaban = ''; // Reset kunci
  }
});

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

const muatTp = async (isInitEdit = false) => {
  const selectedPlot = listPlotting.value.find(p => p.id === form.value.plotting_id);
  
  if (!selectedPlot || !selectedPlot.mapel_id) return;

  try {
    const res = await api.get('/guru/capaian-pembelajaran', {
      params: { mapel_id: selectedPlot.mapel_id } 
    });

    // Ambil array utamanya
    const rawData = res.data.data || res.data;
    
    // Pastikan rawData adalah Array sebelum di-flatMap
    if (Array.isArray(rawData)) {
      // Ambil secara spesifik dari list_tp (sesuai JSON-mu)
      listTp.value = rawData.flatMap(cp => cp.list_tp || []);
    } else {
      listTp.value = [];
    }

    // Reset pilihan form jika bukan mode edit
    if (!isInitEdit) {
      form.value.tp_id = '';
    }

  } catch (error) {
    console.error("Gagal memuat Tujuan Pembelajaran:", error);
    Toast.fire({ icon: 'error', title: 'Gagal memuat daftar TP.' });
  }
};

const muatSoalEdit = async () => {
  try {
    const res = await api.get(`/guru/bank-soal/${soalId.value}`);
    const data = res.data.data;
    
    // Set form (termasuk plotting_id)
    form.value = { ...data };

    // Panggil muatTp, lemparkan argumen true agar nilai form.tp_id tidak di-reset ke kosong
    await muatTp(true);
    
    // Pastikan array pilihan ganda terisi 5 slot jika kurang dari 5 (handling error)
    if (form.value.tipe_soal === 'Pilihan Ganda' && (!form.value.pilihan_jawaban || form.value.pilihan_jawaban.length < 5)) {
      form.value.pilihan_jawaban = ['', '', '', '', ''];
    }
  } catch (error) {
    Toast.fire({ icon: 'error', title: 'Data soal tidak ditemukan.' });
    batal();
  }
};

const simpanSoal = async () => {
  isSaving.value = true;
  try {
    // Bersihkan tp_id jika kosong (karena validasi expect UUID atau null)
    const payload = { ...form.value };
    if (!payload.tp_id) payload.tp_id = null;

    if (isEdit.value) {
      await api.put(`/guru/bank-soal/${soalId.value}`, payload);
      Toast.fire({ icon: 'success', title: 'Soal berhasil diupdate!' });
    } else {
      await api.post('/guru/bank-soal', payload);
      Toast.fire({ icon: 'success', title: 'Soal berhasil ditambahkan!' });
    }
    router.push({ name: 'guru.bank-soal' });
  } catch (error) {
    Toast.fire({ icon: 'error', title: 'Gagal menyimpan soal.' });
  } finally {
    isSaving.value = false;
  }
};

const batal = () => router.push({ name: 'guru.bank-soal' });

onMounted(() => {
  muatPlotting();
  if (route.params.id) {
    isEdit.value = true;
    soalId.value = route.params.id;
    // Akan butuh endpoint /guru/bank-soal/{id} GET di backend
    // muatSoalEdit(); 
  }
});
</script>

<style scoped>
/* Struktur Layout */
.content-body { padding: 30px; background-color: #fcf8f2; min-height: 100vh; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.margin-top-25 { margin-top: 25px; }

/* Header */
.header-buku-box { background: #1E5631; color: white; padding: 20px 30px; }
.header-flex { display: flex; align-items: center; gap: 20px; }
.btn-back { background: #689F38; border: none; color: white; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.btn-back:hover { background: #FBC02D; color: #1E5631; }
.meta-info h2 { margin: 0 0 6px 0; color: #FBC02D; }
.meta-info p { margin: 0; color: #FFE0B2; font-size: 14px; }

/* Form CSS Murni */
.form-container { display: flex; flex-direction: column; gap: 15px; }
.form-row { display: flex; gap: 20px; }
.w-50 { width: 50%; }
.w-33 { width: 33.33%; }
.form-group label { display: block; margin-bottom: 8px; font-weight: bold; font-size: 13.5px; color: #333; }
.text-danger { color: #d9534f; }
.input-text { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; font-family: inherit; background-color: #fafafa; transition: 0.2s; }
.input-text:focus { border-color: #689F38; outline: none; background-color: #fff; box-shadow: 0 0 0 2px rgba(104,159,56,0.2); }
.divider { border: 0; height: 1px; background: #eee; margin: 20px 0; }

/* Khusus Pilihan Ganda */
.pg-container { background: #f9fbe7; padding: 15px; border-radius: 8px; border: 1px solid #c5e1a5; margin-bottom: 15px; }
.pg-container label { color: #558b2f; font-weight: bold; margin-bottom: 15px; display: block; }
.opsi-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.opsi-label { font-weight: bold; font-size: 16px; color: #333; width: 20px; }
.radio-kunci { width: 20px; height: 20px; cursor: pointer; accent-color: #689F38; }

/* Footer Tombol */
.form-footer { display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px; }
.btn-cancel { background: #f4f4f4; border: 1px solid #ddd; padding: 12px 25px; border-radius: 6px; cursor: pointer; font-weight: bold; color: #666; }
.btn-save { background: #1E5631; color: white; border: none; padding: 12px 25px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 15px; display: flex; align-items: center; gap: 8px; }
.btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
</style>