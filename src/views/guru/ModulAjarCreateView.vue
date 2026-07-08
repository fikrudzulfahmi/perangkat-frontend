<template>
  <div class="content-body">
    <div class="card-box header-buku-box">
      <div class="header-flex">
        <button @click="batal" class="btn-back">
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </button>
        <div class="meta-info">
          <h2>Buat Modul Ajar Baru</h2>
          <p>Lengkapi formulir di bawah ini untuk menyusun perangkat ajar (RPP) secara utuh.</p>
        </div>
      </div>
    </div>

    <div class="card-box margin-top-25">
      <form @submit.prevent="simpanModul">
        
        <div class="section-header">
          <h3><i class="fa-solid fa-file-lines"></i> Informasi Umum Modul</h3>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>Bab / Pokok Materi <span class="text-danger">*</span></label>
            <input v-model="form.bab_atau_materi" type="text" class="input-text" required placeholder="Contoh: Aljabar Linear" />
          </div>
          
          <div class="form-group">
            <label>Pertemuan Ke- <span class="text-danger">*</span></label>
            <input v-model="form.pertemuan_ke" type="text" class="input-text" required placeholder="Contoh: 1 dari 3" />
          </div>

          <div class="form-group">
            <label>Alokasi Waktu <span class="text-danger">*</span></label>
            <input v-model="form.alokasi_waktu" type="text" class="input-text" required placeholder="Contoh: 2 x 45 Menit" />
          </div>

          <div class="form-group">
            <label>Model Pembelajaran <span class="text-danger">*</span></label>
            <select v-model="form.model_pembelajaran" class="input-text" required>
              <option value="">-- Pilih Model --</option>
              <option value="Tatap Muka (Luring)">Tatap Muka (Luring)</option>
              <option value="PJJ (Daring)">PJJ (Daring)</option>
              <option value="Blended Learning">Blended Learning</option>
              <option value="Project Based Learning">Project Based Learning</option>
              <option value="Problem Based Learning">Problem Based Learning</option>
            </select>
          </div>

          <div class="form-group">
            <label>Target Peserta Didik <span class="text-danger">*</span></label>
            <input v-model="form.target_peserta" type="text" class="input-text" required />
          </div>
        </div>

        <div class="form-group margin-top-25">
          <label>Pertanyaan Pemantik</label>
          <textarea v-model="form.pertanyaan_pemantik" class="input-textarea" rows="2" placeholder="Pertanyaan untuk memancing rasa ingin tahu siswa..."></textarea>
        </div>

        <div class="form-group">
          <label>Pemahaman Bermakna</label>
          <textarea v-model="form.pemahaman_bermakna" class="input-textarea" rows="2" placeholder="Manfaat yang akan diperoleh siswa setelah proses pembelajaran..."></textarea>
        </div>

        <div class="form-group">
          <label>Sarana & Prasarana</label>
          <textarea v-model="form.sarana_prasarana" class="input-textarea" rows="2" placeholder="Proyektor, Laptop, Buku Paket, dll..."></textarea>
        </div>

        <div class="form-group">
          <label>Lembar Kerja Peserta Didik (LKPD)</label>
          <textarea v-model="form.lkpd" class="input-textarea" rows="2" placeholder="Panduan tugas atau instruksi kerja kelompok/mandiri siswa..."></textarea>
        </div>

        <div class="form-group">
          <label>Glosarium & Daftar Pustaka</label>
          <textarea v-model="form.glosarium_pustaka" class="input-textarea" rows="2" placeholder="Definisi istilah penting dan sumber referensi buku/website..."></textarea>
        </div>


        <div class="section-header margin-top-25">
          <h3><i class="fa-solid fa-bullseye"></i> Target Tujuan Pembelajaran (TP)</h3>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">
            Centang Tujuan Pembelajaran (TP) yang akan diajarkan pada modul ini. Anda dapat memilih lebih dari satu TP.
          </p>
        </div>
        
        <div class="tp-selection-container">
          
          <div v-if="listCp.length === 0" class="empty-state-small">
            Memuat data Elemen & TP, atau data tidak tersedia...
          </div>

          <div v-for="cp in listCp" :key="cp.id" class="cp-group-card">
            
            <div class="cp-header">
              <i class="fa-solid fa-layer-group"></i> 
              <strong>Elemen: {{ cp.elemen || cp.deskripsi }}</strong>
            </div>

            <div class="checkbox-grid">
              <div v-for="tp in cp.list_tp" :key="tp.id" class="checkbox-item">
                <input 
                  type="checkbox" 
                  :id="'tp_' + tp.id" 
                  :value="tp.id" 
                  v-model="form.tujuan_pembelajaran_ids"
                >
                <label :for="'tp_' + tp.id">
                  <span class="badge-kode-tp">[{{ tp.kode_tp }}]</span> {{ tp.deskripsi }}
                </label>
              </div>
              
              <div v-if="!cp.list_tp || cp.list_tp.length === 0" style="color: #999; font-size: 13px; font-style: italic;">
                Belum ada TP untuk elemen ini.
              </div>
            </div>
            
          </div>
        </div>

        <div style="margin-top: 15px; padding: 15px; background: #e3f2fd; border: 1px dashed #1565c0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: #1565c0;"><i class="fa-solid fa-robot"></i> Asisten AI Modul Ajar</strong>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #555;">
              Bingung mengisi Pemahaman Bermakna, Pertanyaan Pemantik, & Kegiatan? Biarkan AI membantu Anda merancangnya berdasarkan TP yang dipilih.
            </p>
          </div>
          <button @click.prevent="salinPromptAI" style="background: #1565c0; color: white; border: none; padding: 10px 15px; border-radius: 6px; font-weight: bold; cursor: pointer; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <i class="fa-solid fa-copy"></i> Buat & Salin Prompt AI
          </button>
        </div>

        <div class="section-header margin-top-25">
          <h3><i class="fa-solid fa-list-ol"></i> Skenario Kegiatan Pembelajaran</h3>
          <button type="button" @click="tambahKegiatan" class="btn-add-small">+ Tambah Tahapan</button>
        </div>
        
        <div v-for="(kegiatan, index) in form.kegiatan_pembelajaran" :key="index" class="kegiatan-row">
          <div class="kegiatan-header">Tahap {{ index + 1 }}</div>
          <div class="form-group">
            <input v-model="kegiatan.tahap" type="text" class="input-text" placeholder="Pendahuluan/Inti/Penutup" required />
          </div>
          <div class="form-group">
            <input v-model="kegiatan.durasi" type="text" class="input-text" placeholder="Durasi (Mnt)" required />
          </div>
          <div class="form-group" style="flex-grow: 2;">
            <input v-model="kegiatan.aktivitas" type="text" class="input-text" placeholder="Deskripsi aktivitas guru dan siswa..." required />
          </div>
          <button type="button" @click="hapusKegiatan(index)" class="btn-icon btn-delete" v-if="form.kegiatan_pembelajaran.length > 1">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>


        <div class="section-header margin-top-25">
          <h3><i class="fa-solid fa-file-signature"></i> Hubungkan Soal Asesmen (Dari Bank Soal)</h3>
        </div>
        <div class="soal-selection-box">
          <table class="table-soal" v-if="opsiSoal.length > 0">
            <thead>
              <tr>
                <th width="50">Pilih</th>
                <th width="120">Jenis Asesmen</th>
                <th>Pertanyaan</th>
                <th width="100">Kesulitan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="soal in opsiSoal" :key="soal.id">
                <td style="text-align: center;">
                  <input type="checkbox" :value="soal.id" v-model="form.bank_soal_ids" />
                </td>
                <td><span class="badge-jenis">{{ soal.jenis_asesmen }}</span></td>
                <td class="text-left">{{ soal.pertanyaan }}</td>
                <td><span class="badge-level">{{ soal.tingkat_kesulitan }}</span></td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-muted" style="padding: 10px;">
            Belum ada data di Bank Soal untuk mata pelajaran ini. Silakan isi Bank Soal terlebih dahulu agar bisa dipilih di sini.
          </p>
        </div>


        <div class="form-actions margin-top-25">
          <button type="button" @click="batal" class="btn-cancel">Batal</button>
          <button type="submit" class="btn-submit" :disabled="isSaving">
            <i class="fa-solid fa-save"></i> {{ isSaving ? 'Menyimpan...' : 'Simpan Modul Ajar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../../services/api';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();

const isSaving = ref(false);
const plottingId = ref(route.query.plotting_id || '');
const mapelId = ref(route.query.mapel_id || '');

const listCp = ref([]);
const opsiTp = ref([]);
const opsiSoal = ref([]); // Menampung list bank_soals dari backend

// Form State Lengkap
const form = ref({
  plotting_id: plottingId.value,
  bab_atau_materi: '',
  pertemuan_ke: '',
  alokasi_waktu: '',
  target_peserta: 'Peserta Didik Reguler',
  model_pembelajaran: '',
  pertanyaan_pemantik: '',
  pemahaman_bermakna: '', // Kolom baru terisi
  sarana_prasarana: '',
  lkpd: '',               // Kolom baru terisi
  glosarium_pustaka: '',  // Kolom baru terisi
  profil_pancasila: ['Beriman, Bertakwa', 'Mandiri'],
  tujuan_pembelajaran_ids: [],
  bank_soal_ids: [], // 🟢 IDs soal yang diceklis akan masuk ke sini untuk mengisi tabel pivot `modul_ajar_soals`
  kegiatan_pembelajaran: [
    { tahap: 'Pendahuluan', durasi: '15 Menit', aktivitas: '' },
    { tahap: 'Kegiatan Inti', durasi: '60 Menit', aktivitas: '' },
    { tahap: 'Penutup', durasi: '15 Menit', aktivitas: '' }
  ]
});

const Toast = Swal.mixin({
  toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
  background: '#1E5631', color: '#FFE0B2', iconColor: '#FBC02D'
});

const batal = () => router.push({ name: 'guru.modul-ajar' });
const tambahKegiatan = () => form.value.kegiatan_pembelajaran.push({ tahap: '', durasi: '', aktivitas: '' });
const hapusKegiatan = (index) => form.value.kegiatan_pembelajaran.splice(index, 1);

// Ambil data TP & Daftar Soal
const muatDataPendukung = async () => {
  if (!plottingId.value || !mapelId.value) return;
  try {
    // 1. Ambil list TP via endpoint KKTP
    const resKktp = await api.get('/guru/kktp', { params: { mapel_id: mapelId.value, kelas_id: plottingId.value } });
    const payload = resKktp.data.data || {};
    
    const dataCP = payload.list_cp || [];

    // 👇 INI BARIS YANG HILANG: Masukkan data ke variabel listCp agar dibaca oleh HTML!
    listCp.value = dataCP; 

    // (Opsional) Jika variabel opsiTp masih Anda butuhkan di fungsi lain, biarkan saja:
    let tempTp = [];
    dataCP.forEach(cp => {
      if (cp.list_tp) tempTp.push(...cp.list_tp);
    });
    opsiTp.value = tempTp;

    // 2. Ambil list Soal yang sudah ada di Bank Soal
    const resSoal = await api.get('/guru/bank-soal', { params: { page: 1 } }); 
    opsiSoal.value = resSoal.data.data || [];

  } catch (error) {
    console.error("Gagal muat data pendukung:", error);
  }
};

// Fungsi untuk merangkai dan menyalin Prompt AI
const salinPromptAI = async () => {
  // 1. Validasi: Pastikan ada Bab dan TP yang dipilih
  if (!form.value.bab_atau_materi) {
    Swal.fire({ icon: 'warning', title: 'Isi Bab / Materi!', text: 'Silakan isi Bab/Pokok Materi terlebih dahulu.' });
    return;
  }
  if (form.value.tujuan_pembelajaran_ids.length === 0) {
    Swal.fire({ icon: 'warning', title: 'Pilih TP Dulu!', text: 'Silakan centang minimal 1 Tujuan Pembelajaran (TP).' });
    return;
  }

  // Ambil data tambahan untuk konteks AI
  const waktu = form.value.alokasi_waktu ? `${form.value.alokasi_waktu} Menit` : 'Sesuai jam pelajaran';
  const pertemuan = form.value.pertemuan_ke ? form.value.pertemuan_ke : '-';

  // 2. Kumpulkan teks TP yang dicentang
  let teksTpTerpilih = [];
  listCp.value.forEach(cp => {
    if (cp.list_tp) {
      cp.list_tp.forEach(tp => {
        if (form.value.tujuan_pembelajaran_ids.includes(tp.id)) {
          teksTpTerpilih.push(`[${tp.kode_tp}] ${tp.deskripsi}`);
        }
      });
    }
  });

  // 3. Format teks TP menjadi list nomor
  const stringTp = teksTpTerpilih.map((teks, index) => `${index + 1}. ${teks}`).join('\n');

  // 4. Susun Prompt AI (SANGAT SPESIFIK & SIMPEL)
  const promptText = `Saya sedang membuat Modul Ajar SMK untuk materi: "${form.value.bab_atau_materi}" (Pertemuan: ${pertemuan}, Waktu: ${waktu}).

Tujuan Pembelajarannya adalah:
${stringTp}

Tolong buatkan isian untuk form Modul Ajar saya. Syarat utama: Buatlah SANGAT SIMPEL, bahasanya sederhana, langsung pada intinya (to the point), dan tidak kompleks. Tanpa kalimat pengantar atau penutup dari Anda.

Langsung jawab persis dengan 6 format berikut:

1. Pertanyaan Pemantik: (1-2 pertanyaan singkat pemancing nalar)
2. Pemahaman Bermakna: (1-2 kalimat singkat manfaat materi di dunia nyata)
3. Sarana & Prasarana: (Daftar singkat alat/bahan/media)
4. LKPD: (Ide singkat tugas praktek/teori untuk siswa)
5. Glosarium dan Daftar Pustaka: (3-4 kata kunci dan 1-2 buku/referensi umum)
6. Skenario Kegiatan Pembelajaran: (Tuliskan poin-poin sangat singkat untuk: Pendahuluan, Inti, Penutup)`;

  // 5. Salin ke Clipboard menggunakan API Browser
  try {
    await navigator.clipboard.writeText(promptText);
    
    Swal.fire({
      icon: 'success',
      title: 'Prompt Berhasil Disalin!',
      html: '<p style="font-size:14px">Silakan buka <b>ChatGPT / Gemini / Claude</b>, lalu <b>Paste</b> di sana. Hasilnya dijamin lebih simpel!</p>',
      confirmButtonColor: '#1565c0',
      confirmButtonText: 'Buka AI & Paste!'
    });
  } catch (err) {
    console.error('Gagal copy text: ', err);
    Swal.fire({ icon: 'error', title: 'Gagal Menyalin', text: 'Browser Anda mungkin tidak mengizinkan aksi copy otomatis.' });
  }
};

const simpanModul = async () => {
  isSaving.value = true;
  try {
    await api.post('/guru/modul-ajar', form.value);
    Toast.fire({ icon: 'success', title: 'Modul Ajar & Skenario Asesmen berhasil disimpan!' });
    router.push({ name: 'guru.modul-ajar' });
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Gagal menyimpan data. Periksa kembali backend Anda.', 'error');
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  if (!plottingId.value || !mapelId.value) {
    Swal.fire('Peringatan', 'Akses tidak valid.', 'warning').then(() => { batal(); });
  } else {
    muatDataPendukung();
  }
});
</script>

<style scoped>
.content-body { padding: 30px; background-color: #fcf8f2; min-height: 100vh; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.margin-top-25 { margin-top: 25px; }
.header-buku-box { background: #1E5631; color: white; padding: 20px 30px; }
.header-flex { display: flex; align-items: center; gap: 20px; }
.btn-back { background: #689F38; border: none; color: white; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.btn-back:hover { background: #FBC02D; color: #1E5631; }
.meta-info h2 { margin: 0 0 6px 0; color: #FBC02D; }
.meta-info p { margin: 0; color: #FFE0B2; font-size: 14px; }

.section-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 15px; }
.section-header h3 { margin: 0; color: #1E5631; font-size: 16px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { display: flex; flex-direction: column; margin-bottom: 15px; }
.form-group label { font-weight: bold; margin-bottom: 8px; color: #444; font-size: 13px; }
.input-text, .input-textarea { padding: 10px; border-radius: 6px; border: 1px solid #ccc; background: white; font-size: 14px; width: 100%; outline: none; box-sizing: border-box; }
.input-text:focus, .input-textarea:focus { border-color: #689F38; }
.text-danger { color: #d9534f; }
.text-muted { color: #888; font-size: 13px; }

.tp-selection-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
}

.cp-group-card {
  background: #fff;
  border: 1px solid #c5e1a5;
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden; /* Kunci utamanya di sini agar tidak melewati batas layar */
}

/* 2. Perbaiki Header Elemen agar rapat ke kiri dan responsif */
.cp-header {
  display: flex;
  align-items: flex-start; /* Sejajarkan di atas jika teksnya jadi 2 baris */
  justify-content: flex-start; /* Pastikan merapat ke KIRI, jangan space-between */
  gap: 12px; /* Jarak antara ikon dan teks */
  background-color: #e8f5e9;
  padding: 12px 15px;
  border-bottom: 1px solid #c5e1a5;
  color: #1E5631;
}
.cp-header strong {
  flex: 1; /* Biarkan teks mengambil sisa ruang yang ada */
  white-space: normal; /* Mengizinkan teks turun ke baris baru */
  word-wrap: break-word; /* Memotong kata secara paksa jika ruang habis */
  line-height: 1.5;
  text-align: left;
  font-size: 14px;
}

/* Memodifikasi checkbox-grid bawaan Anda */
.cp-group-card .checkbox-grid {
  display: grid;
  grid-template-columns: 1fr; /* Buat 1 kolom agar teks TP yang panjang tidak terpotong */
  gap: 10px;
  padding: 15px;
  background-color: white;
}

.badge-kode-tp {
  font-weight: bold;
  color: #e65100;
}

.empty-state-small {
  padding: 15px;
  background: #fff3e0;
  color: #e65100;
  border-radius: 6px;
  border: 1px dashed #ffb74d;
  font-size: 13px;
}

.checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f9fbe7; padding: 15px; border-radius: 6px; border: 1px solid #c5e1a5; }
.checkbox-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; }

.kegiatan-row { display: flex; gap: 15px; align-items: center; background: #fafafa; padding: 10px 15px; border-radius: 6px; border: 1px dashed #ccc; margin-bottom: 10px; }
.kegiatan-header { font-weight: bold; color: #689F38; min-width: 70px; font-size: 14px; }
.btn-add-small { background: #e3f2fd; color: #1565c0; border: none; padding: 5px 10px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 12px; }

/* Styling Pilihan Soal */
.soal-selection-box { border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden; background: #fff; max-height: 300px; overflow-y: auto; }
.table-soal { width: 100%; border-collapse: collapse; font-size: 13px; }
.table-soal th { background: #f5f5f5; padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; text-align: left; }
.table-soal td { padding: 10px; border-bottom: 1px solid #eee; }
.text-left { text-align: left; }
.badge-jenis { background: #e3f2fd; color: #1565c0; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 11px; }
.badge-level { background: #689F38; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; }

.form-actions { display: flex; justify-content: flex-end; gap: 15px; border-top: 2px solid #e0e0e0; padding-top: 20px; }
.btn-cancel { background: #eee; color: #555; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; }
.btn-submit { background: #1E5631; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; }
.btn-submit:hover:not(:disabled) { background: #689F38; }
.btn-delete { background-color: #d9534f; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; }
</style>