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
        
        <!-- 1. INFORMASI UMUM -->
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
            <label>Target Peserta Didik <span class="text-danger">*</span></label>
            <select v-model="form.target_peserta" class="input-text" required>
              <option value="Peserta Didik Reguler">Peserta Didik Reguler</option>
              <option value="Peserta Didik dengan Kesulitan Belajar">Peserta Didik dengan Kesulitan Belajar</option>
              <option value="Peserta Didik Pencapaian Tinggi (Cerdas Istimewa)">Peserta Didik Pencapaian Tinggi (Cerdas Istimewa)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Model Pembelajaran <span class="text-danger">*</span></label>
            <select v-model="form.model_pembelajaran" class="input-text" required>
              <option value="">-- Pilih Model --</option>
              <option value="Tatap Muka">Tatap Muka</option>
              <option value="PJJ Daring">PJJ Daring / Online</option>
              <option value="PJJ Luring">PJJ Luring / Offline</option>
              <option value="Project Based Learning">Project Based Learning (PjBL)</option>
              <option value="Problem Based Learning">Problem Based Learning (PBL)</option>
              <option value="Discovery Learning">Discovery Learning</option>
            </select>
          </div>
        </div>

        <!-- 2. TUJUAN PEMBELAJARAN (TP) -->
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

        <!-- 3. PROFIL PELAJAR PANCASILA -->
        <div class="section-header margin-top-25">
          <h3><i class="fa-solid fa-users"></i> Profil Pelajar Pancasila</h3>
        </div>
        <div class="pancasila-grid">
          <div 
            v-for="profil in daftarProfilPancasila" 
            :key="profil"
            class="pancasila-item"
            :class="{'selected': form.profil_pancasila.includes(profil)}"
            @click="togglePancasila(profil)"
          >
            <i class="fa-solid" :class="form.profil_pancasila.includes(profil) ? 'fa-check-circle' : 'fa-circle'"></i>
            {{ profil }}
          </div>
        </div>

        <!-- 4. PEMAHAMAN & PERTANYAAN -->
        <div class="section-header margin-top-25">
          <h3><i class="fa-solid fa-lightbulb"></i> Pemahaman & Pertanyaan</h3>
        </div>
        <div class="form-group">
          <label>Pemahaman Bermakna</label>
          <textarea v-model="form.pemahaman_bermakna" class="input-textarea" rows="3" placeholder="Contoh: Manusia senantiasa membutuhkan bantuan orang lain..."></textarea>
        </div>
        <div class="form-group margin-top-15">
          <label>Pertanyaan Pemantik</label>
          <textarea v-model="form.pertanyaan_pemantik" class="input-textarea" rows="3" placeholder="Contoh: Apa yang terjadi jika kita tidak mematuhi rambu lalu lintas?"></textarea>
        </div>

        <!-- 5. SKENARIO KEGIATAN PEMBELAJARAN -->
        <div class="section-header margin-top-25">
          <h3><i class="fa-solid fa-list-ol"></i> Skenario Kegiatan Pembelajaran</h3>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">
            Isi aktivitas dengan poin-poin. Anda cukup menekan tombol <strong>Enter</strong> untuk membuat baris baru.
          </p>
        </div>

        <div class="kegiatan-container">
          <div v-for="(kegiatan, index) in form.kegiatan_pembelajaran" :key="index" class="kegiatan-box">
            
            <div class="kegiatan-header">
              <span class="badge-tahap-index">Tahap {{ index + 1 }}</span>
              <button @click.prevent="hapusKegiatan(index)" class="btn-hapus-kegiatan" title="Hapus Tahap Ini">
                <i class="fa-solid fa-trash-can"></i> Hapus
              </button>
            </div>

            <div class="form-grid" style="margin-top: 15px;">
              <div class="form-group">
                <label>Nama Tahapan <span class="text-danger">*</span></label>
                <input v-model="kegiatan.tahap" type="text" class="input-text" required placeholder="Contoh: Pendahuluan">
              </div>
              <div class="form-group">
                <label>Alokasi Waktu <span class="text-danger">*</span></label>
                <input v-model="kegiatan.durasi" type="text" class="input-text" required placeholder="Contoh: 15 Menit">
              </div>
            </div>

            <div class="form-group" style="margin-top: 15px;">
              <label>Langkah-Langkah Aktivitas <span class="text-danger">*</span></label>
              <textarea 
                v-model="kegiatan.aktivitas" 
                class="input-textarea" 
                rows="5" 
                required 
                placeholder="1. Guru membuka kelas...&#10;2. Siswa dibagi kelompok...&#10;3. Dst..."
              ></textarea>
            </div>
          </div>
        </div>
        <button @click.prevent="tambahKegiatan" class="btn-tambah-kegiatan">
          <i class="fa-solid fa-plus"></i> Tambah Tahapan Kegiatan Baru
        </button>

        <!-- 6. KOMPONEN LAMPIRAN -->
        <div class="section-header margin-top-25">
          <h3><i class="fa-solid fa-book-open"></i> Komponen Lampiran</h3>
        </div>
        <div class="form-group">
          <label>Sarana & Prasarana</label>
          <textarea v-model="form.sarana_prasarana" class="input-textarea" rows="3" placeholder="Contoh: Laptop, Proyektor, Papan Tulis, Buku Paket"></textarea>
        </div>
        <div class="form-group margin-top-15">
          <label>Lembar Kerja Peserta Didik (LKPD)</label>
          <textarea v-model="form.lkpd" class="input-textarea" rows="3" placeholder="Deskripsikan atau tautkan link LKPD di sini..."></textarea>
        </div>
        <div class="form-group margin-top-15">
          <label>Glosarium & Daftar Pustaka</label>
          <textarea v-model="form.glosarium_pustaka" class="input-textarea" rows="3" placeholder="Contoh: Adaptasi: Penyesuaian diri..."></textarea>
        </div>

        <!-- 7. ASISTEN AI -->
        <div style="margin-top: 25px; padding: 15px; background: #e3f2fd; border: 1px dashed #1565c0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: #1565c0;"><i class="fa-solid fa-robot"></i> Asisten AI Modul Ajar</strong>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #555;">
              Bingung mengisi komponen modul? Biarkan AI membantu Anda merancangnya berdasarkan TP yang dipilih.
            </p>
          </div>
          <button @click.prevent="salinPromptAI" style="background: #1565c0; color: white; border: none; padding: 10px 15px; border-radius: 6px; font-weight: bold; cursor: pointer; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <i class="fa-solid fa-copy"></i> Buat & Salin Prompt AI
          </button>
        </div>

        <!-- 8. ASESMEN & PENGAYAAN/REMEDIAL (BARU) -->
        <div class="section-header margin-top-25">
          <h3><i class="fa-solid fa-file-signature"></i> Asesmen dan Pengayaan/Remedial (Sesuai Panduan)</h3>
        </div>

        <div class="form-grid">
          <!-- Bagian Asesmen -->
          <div class="form-group-full">
            <label>Jenis Asesmen (Centang yang Digunakan)</label>
            <div class="asesmen-grid">
              <!-- Diagnostik -->
              <div class="form-check-group">
                <input type="checkbox" v-model="form.asesmen_diagnostik" id="asesmenDiag">
                <label for="asesmenDiag">
                  <strong>Asesmen Diagnostik:</strong>
                  <span>Kuesioner/Survei Singkat atau Diskusi Awal.</span>
                </label>
              </div>

              <!-- Formatif -->
              <div class="form-check-group">
                <input type="checkbox" v-model="form.asesmen_formatif" id="asesmenForm">
                <label for="asesmenForm">
                  <strong>Asesmen Formatif:</strong>
                  <span>Observasi, Diskusi Kelompok, Penilaian Diri, Jurnal Belajar, Kuis Singkat, Umpan Balik Teman Sebaya.</span>
                </label>
              </div>

              <!-- Sumatif -->
              <div class="form-check-group">
                <input type="checkbox" v-model="form.asesmen_sumatif" id="asesmenSum">
                <label for="asesmenSum">
                  <strong>Asesmen Sumatif:</strong>
                  <span>Proyek Akhir/Uji Kinerja, Tes Tulis Komprehensif, atau Portofolio.</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="form-grid margin-top-15">
          <!-- Bagian Remedial -->
          <div class="form-group">
            <label>Langkah Remedial (Editable)</label>
            <textarea v-model="form.remedial_content" class="input-textarea" rows="8" placeholder="Tuliskan poin-poin langkah remedial..."></textarea>
          </div>

          <!-- Bagian Pengayaan -->
          <div class="form-group">
            <label>Evaluasi Pengayaan (Editable)</label>
            <textarea v-model="form.enrichment_content" class="input-textarea" rows="8" placeholder="Tuliskan poin-poin evaluasi pengayaan..."></textarea>
          </div>
        </div>

        <div class="action-footer margin-top-25">
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

// Array Pilihan Profil Pancasila
const daftarProfilPancasila = [
  'Keimanan, Ketakwaan, dan Akhlak Mulia',
  'Kewargaan',
  'Penalaran Kritis',
  'Kreativitas',
  'Kolaborasi',
  'Kemandirian',
  'Kesehatan',
  'Komunikasi'
];

// Form State Lengkap (sudah diperbarui)
const form = ref({
  plotting_id: plottingId.value,
  bab_atau_materi: '',
  pertemuan_ke: '',
  alokasi_waktu: '',
  target_peserta: 'Peserta Didik Reguler',
  model_pembelajaran: '',
  pertanyaan_pemantik: '',
  pemahaman_bermakna: '',
  sarana_prasarana: '',
  lkpd: '',              
  glosarium_pustaka: '',  
  profil_pancasila: [],
  tujuan_pembelajaran_ids: [],
  
  // Field Baru Asesmen dan Remedial/Pengayaan
  asesmen_diagnostik: false,
  asesmen_formatif: false,
  asesmen_sumatif: false,
  remedial_content: '',
  enrichment_content: '',

  kegiatan_pembelajaran: [
    { tahap: 'Pendahuluan', durasi: '', aktivitas: '' },
    { tahap: 'Kegiatan Inti', durasi: '', aktivitas: '' },
    { tahap: 'Penutup', durasi: '', aktivitas: '' }
  ]
});

const Toast = Swal.mixin({
  toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
  background: '#1E5631', color: '#FFE0B2', iconColor: '#FBC02D'
});

const batal = () => router.push({ name: 'guru.modul-ajar' });
const tambahKegiatan = () => form.value.kegiatan_pembelajaran.push({ tahap: '', durasi: '', aktivitas: '' });
const hapusKegiatan = (index) => form.value.kegiatan_pembelajaran.splice(index, 1);

// Fungsi Toggle Profil Pancasila
const togglePancasila = (profil) => {
  const index = form.value.profil_pancasila.indexOf(profil);
  if (index > -1) form.value.profil_pancasila.splice(index, 1);
  else form.value.profil_pancasila.push(profil);
};

// Ambil data TP (Bank Soal sudah dihapus)
const muatDataPendukung = async () => {
  if (!plottingId.value || !mapelId.value) return;
  
  try {
    const resKktp = await api.get('/guru/kktp', { params: { mapel_id: mapelId.value, kelas_id: plottingId.value } });
    const payload = resKktp.data.data || {};
    
    const dataCP = payload.list_cp || [];
    listCp.value = dataCP; 

    let tempTp = [];
    dataCP.forEach(cp => {
      if (cp.list_tp) tempTp.push(...cp.list_tp);
    });
    opsiTp.value = tempTp;

  } catch (error) {
    console.error("Gagal muat data pendukung:", error);
  }
};

const salinPromptAI = async () => {
  if (!form.value.bab_atau_materi) {
    Swal.fire({ icon: 'warning', title: 'Isi Bab / Materi!', text: 'Silakan isi Bab/Pokok Materi terlebih dahulu.' });
    return;
  }
  if (form.value.tujuan_pembelajaran_ids.length === 0) {
    Swal.fire({ icon: 'warning', title: 'Pilih TP Dulu!', text: 'Silakan centang minimal 1 Tujuan Pembelajaran (TP).' });
    return;
  }

  const waktu = form.value.alokasi_waktu ? `${form.value.alokasi_waktu} Menit` : 'Sesuai jam pelajaran';
  const pertemuan = form.value.pertemuan_ke ? form.value.pertemuan_ke : '-';

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

  const stringTp = teksTpTerpilih.map((teks, index) => `${index + 1}. ${teks}`).join('\n');

  const promptText = `Saya sedang membuat Modul Ajar SMK untuk materi: "${form.value.bab_atau_materi}" (Pertemuan: ${pertemuan}, Waktu: ${waktu}).

Tujuan Pembelajarannya adalah:
${stringTp}

Tolong buatkan isian untuk form Modul Ajar saya. 

Syarat utama: 
Buatlah modul berikut dengan bahasa yang sederhana, langsung pada intinya (to the point), dan tidak kompleks. Tanpa kalimat pengantar atau penutup dari Anda. 

Langsung jawab persis dengan 7 format berikut:

1. Pertanyaan Pemantik: 
(1-2 pertanyaan singkat pemancing nalar)

2. Pemahaman Bermakna: 
(1-2 kalimat singkat manfaat materi di dunia nyata)

3. Sarana & Prasarana: 
(Daftar singkat alat/bahan/media)

4. LKPD: 
(Ide singkat tugas praktek/teori untuk siswa)

5. Glosarium dan Daftar Pustaka: 
(3-4 kata kunci dan 1-2 buku/referensi umum)

6. Skenario Kegiatan Pembelajaran: 
a. Tuliskan poin-poin yang sangat detail pada Skenario Kegiatan Pembelajaran untuk Kegiatan: Pendahuluan, Inti, Penutup, serta munculkan pembagian alokasi waktunya.
b. Tuliskan poin-poin pada kegiatan inti lebih detailkan dalam bentuk poin-poin kegiatan pada setiap pertemuan, serta munculkan pembagian alokasi waktunya.

7. Panduan Asesmen, Remedial, dan Pengayaan (Sesuai Lampiran Form):
a. Rekomendasi Centang Jenis Asesmen: (Sebutkan jenis asesmen yang harus dicentang antara Diagnostik, Formatif, atau Sumatif berdasarkan skenario pembelajaran di atas).
b. Langkah Remedial (Editable): (Tuliskan poin-poin singkat langkah remedial konkret yang bisa langsung disalin ke kolom form).
c. Evaluasi Pengayaan (Editable): (Tuliskan poin-poin singkat bentuk evaluasi pengayaan konkret yang bisa langsung disalin ke kolom form).`;

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
  if (form.value.tujuan_pembelajaran_ids.length === 0) {
    Swal.fire('Peringatan', 'Minimal pilih 1 Tujuan Pembelajaran (TP)', 'warning');
    return;
  }

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
.content-body { padding: 30px; background-color: #fcf8f2; min-height: 100vh; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.margin-top-25 { margin-top: 25px; }
.margin-top-15 { margin-top: 15px; }
.header-buku-box { background: #1E5631; color: white; padding: 20px 30px; }
.header-flex { display: flex; align-items: center; gap: 20px; }
.btn-back { background: #689F38; border: none; color: white; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.btn-back:hover { background: #FBC02D; color: #1E5631; }
.meta-info h2 { margin: 0 0 6px 0; color: #FBC02D; font-size: 20px;}
.meta-info p { margin: 0; color: #FFE0B2; font-size: 14px; }

.section-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 20px; }
.section-header h3 { margin: 0; color: #1E5631; font-size: 18px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
.form-group label { display: block; font-weight: bold; margin-bottom: 8px; color: #444; font-size: 14px; }
.input-text, .input-textarea { width: 100%; padding: 12px; border-radius: 6px; border: 1px solid #ccc; background: white; font-size: 14px; font-family: inherit; outline: none; box-sizing: border-box; }
.input-text:focus, .input-textarea:focus { border-color: #689F38; box-shadow: 0 0 5px rgba(104,159,56,0.3); }
.text-danger { color: #d9534f; }
.text-muted { color: #888; font-size: 13px; }

.tp-selection-container { display: flex; flex-direction: column; gap: 15px; margin-top: 15px; }
.cp-group-card { background: #fcf8f2; border: 1px solid #c5e1a5; border-radius: 8px; margin-bottom: 15px; overflow: hidden; }
.cp-header { display: flex; align-items: flex-start; justify-content: flex-start; gap: 12px; background-color: #e8f5e9; padding: 12px 15px; border-bottom: 1px solid #c5e1a5; color: #1E5631; }
.cp-header strong { flex: 1; white-space: normal; word-wrap: break-word; line-height: 1.5; text-align: left; font-size: 14px; }
.cp-group-card .checkbox-grid { display: grid; grid-template-columns: 1fr; gap: 10px; padding: 15px; background-color: white; }
.checkbox-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13.5px; line-height: 1.4; }
.checkbox-item input[type="checkbox"] { margin-top: 3px; cursor: pointer; }
.badge-kode-tp { font-weight: bold; color: #e65100; }
.empty-state-small { padding: 15px; background: #fff3e0; color: #e65100; border-radius: 6px; border: 1px dashed #ffb74d; font-size: 13px; }

/* Profil Pancasila Grid */
.pancasila-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; margin-top: 15px; }
.pancasila-item { padding: 12px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-size: 13px; color: #555; background: #fafafa; display: flex; align-items: center; gap: 10px; transition: all 0.2s; }
.pancasila-item:hover { border-color: #689F38; }
.pancasila-item.selected { background: #e8f5e9; border-color: #689F38; color: #1E5631; font-weight: bold; }
.pancasila-item i { font-size: 16px; color: #ccc; }
.pancasila-item.selected i { color: #689F38; }

/* Kegiatan Pembelajaran */
.kegiatan-container { display: flex; flex-direction: column; gap: 15px; margin-top: 15px; }
.kegiatan-box { border: 1px solid #c8e6c9; background-color: #f9fbe7; padding: 20px; border-radius: 8px; position: relative; }
.kegiatan-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #a5d6a7; padding-bottom: 10px; }
.badge-tahap-index { background-color: #1E5631; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
.btn-hapus-kegiatan { background: none; border: none; color: #d9534f; font-size: 12px; font-weight: bold; cursor: pointer; }
.btn-hapus-kegiatan:hover { text-decoration: underline; }
.btn-tambah-kegiatan { margin-top: 15px; background-color: #fff; border: 2px dashed #689F38; color: #1E5631; padding: 10px 15px; width: 100%; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.3s; }
.btn-tambah-kegiatan:hover { background-color: #e8f5e9; }

/* CSS BARU: Asesmen dan Pengayaan/Remedial */
.form-group-full { grid-column: 1 / -1; }
.asesmen-grid { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
.form-check-group { display: flex; align-items: flex-start; gap: 10px; padding: 10px; background: #fafafa; border: 1px solid #eee; border-radius: 6px; }
.form-check-group input[type="checkbox"] { margin-top: 4px; cursor: pointer;}
.form-check-group label { margin-bottom: 0 !important; cursor: pointer; }
.form-check-group label strong { display: block; color: #1E5631; font-size: 14px; }
.form-check-group label span { color: #666; font-size: 13px; font-weight: normal; }

.action-footer { display: flex; justify-content: flex-end; gap: 15px; border-top: 1px solid #eee; padding-top: 20px; }
.btn-cancel { background: #f5f5f5; color: #555; border: 1px solid #ddd; padding: 12px 25px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; }
.btn-submit { background: #1E5631; color: white; border: none; padding: 12px 30px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; }
.btn-submit:hover:not(:disabled) { background: #689F38; }
.btn-submit:disabled { background: #a5d6a7; cursor: not-allowed; }
</style>