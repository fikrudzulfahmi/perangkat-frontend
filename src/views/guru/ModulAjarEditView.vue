<template>
  <div class="content-body">
    <div class="card-box header-buku-box">
      <div class="header-flex">
        <button @click="batal" class="btn-back">
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </button>
        <div class="meta-info">
          <h2>Edit Modul Ajar</h2>
          <p>Perbarui informasi formulir di bawah ini untuk mengubah perangkat ajar (RPP) Anda.</p>
        </div>
      </div>
    </div>

    <div v-if="isLoadingData" class="card-box margin-top-25 text-center" style="padding: 50px;">
      <i class="fa-solid fa-spinner fa-spin fa-2x" style="color: #1E5631;"></i>
      <p style="margin-top: 15px; color: #666;">Sedang memuat data modul...</p>
    </div>

    <div v-else class="card-box margin-top-25">
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
            <input v-model="form.pertemuan_ke" type="text" class="input-text" required placeholder="Contoh: 1 s/d 3" />
          </div>

          <div class="form-group">
            <label>Alokasi Waktu <span class="text-danger">*</span></label>
            <input v-model="form.alokasi_waktu" type="text" class="input-text" required placeholder="Contoh: 2 x 45 Menit" />
          </div>

          <div class="form-group">
            <label>Target Peserta Didik</label>
            <select v-model="form.target_peserta" class="input-text">
              <option value="Peserta Didik Reguler">Peserta Didik Reguler</option>
              <option value="Peserta Didik dengan Kesulitan Belajar">Peserta Didik dengan Kesulitan Belajar</option>
              <option value="Peserta Didik Pencapaian Tinggi (Cerdas Istimewa)">Peserta Didik Pencapaian Tinggi (Cerdas Istimewa)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Model Pembelajaran</label>
            <select v-model="form.model_pembelajaran" class="input-text">
              <option value="Tatap Muka">Tatap Muka</option>
              <option value="PJJ Daring">PJJ Daring / Online</option>
              <option value="PJJ Luring">PJJ Luring / Offline</option>
              <option value="Project Based Learning">Project Based Learning (PjBL)</option>
              <option value="Problem Based Learning">Problem Based Learning (PBL)</option>
              <option value="Discovery Learning">Discovery Learning</option>
            </select>
          </div>
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

        <div style="margin-top: 15px; padding: 15px; background: #e3f2fd; border: 1px dashed #1565c0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
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

        <!-- DIMULAI BAGIAN PENYESUAIAN BANK SOAL YANG SAMA DENGAN CREATE -->
        <div class="section-header margin-top-25">
          <h3><i class="fa-solid fa-file-signature"></i> Hubungkan Soal Asesmen (Dari Bank Soal)</h3>
        </div>
        <div class="soal-selection-box">
          <table class="table-soal" v-if="opsiSoal.length > 0">
            <thead>
              <tr>
                <th width="50">Pilih</th>
                <th width="120">Jenis Asesmen</th>
                <th width="120">Kode TP</th> 
                <th>Pertanyaan</th>
                <th width="100">Kesulitan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="soal in opsiSoal" :key="soal.id">
                <td style="text-align: center;">
                  <input type="checkbox" :value="soal.id" v-model="form.bank_soal_ids" />
                </td>
                <td><span class="badge-jenis">{{ soal.jenis_asesmen || soal.tipe_soal }}</span></td>
                
                <td>
                  <span v-if="soal.tp_id && getKodeTp(soal.tp_id) !== '-'" class="badge-kode-tp">
                    [{{ getKodeTp(soal.tp_id) }}]
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>

                <td class="text-left"><div v-html="soal.pertanyaan" style="font-size: 13px; color: #444; max-height: 80px; overflow: hidden;"></div></td>
                <td><span class="badge-level" :class="soal.tingkat_kesulitan?.toLowerCase()">{{ soal.tingkat_kesulitan }}</span></td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-muted" style="padding: 10px;">
            Belum ada data di Bank Soal untuk mata pelajaran ini. Silakan isi Bank Soal terlebih dahulu agar bisa dipilih di sini.
          </p>
        </div>
        <!-- AKHIR BAGIAN PENYESUAIAN BANK SOAL -->

        <div class="action-footer margin-top-25">
          <button @click="batal" type="button" class="btn-cancel">Batal</button>
          <button type="submit" class="btn-save" :disabled="isSaving">
            <i class="fa-solid fa-save" v-if="!isSaving"></i> 
            <i class="fa-solid fa-spinner fa-spin" v-else></i> 
            {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan Modul' }}
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

const modulId = ref(route.params.id); 
const isSaving = ref(false);
const isLoadingData = ref(true); 

const listCp = ref([]);
const opsiSoal = ref([]);
const opsiTp = ref([]); // Ditambahkan untuk menyimpan list TP

const daftarProfilPancasila = [
  'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
  'Berkebinekaan Global',
  'Bergotong Royong',
  'Mandiri',
  'Bernalar Kritis',
  'Kreatif'
];

const form = ref({
  bab_atau_materi: '',
  pertemuan_ke: '',
  alokasi_waktu: '',
  target_peserta: 'Peserta Didik Reguler',
  model_pembelajaran: 'Problem Based Learning',
  tujuan_pembelajaran_ids: [],
  profil_pancasila: [],
  pemahaman_bermakna: '',
  pertanyaan_pemantik: '',
  kegiatan_pembelajaran: [
    { tahap: 'Pendahuluan', durasi: '', aktivitas: '' },
    { tahap: 'Kegiatan Inti', durasi: '', aktivitas: '' },
    { tahap: 'Penutup', durasi: '', aktivitas: '' }
  ],
  lkpd: '',
  glosarium_pustaka: '',
  sarana_prasarana: '',
  bank_soal_ids: [],
  plotting_id: ''
});

// Fungsi getKodeTp sesuai dengan file Create
const getKodeTp = (tpId) => {
  if (!tpId) return '-';
  const tpDitemukan = opsiTp.value.find(tp => tp.id === tpId);
  return tpDitemukan ? tpDitemukan.kode_tp : '-';
};

const muatDetailModul = async () => {
  try {
    const res = await api.get(`/guru/modul-ajar/${modulId.value}`);
    const dataLama = res.data.data || res.data;

    form.value.bab_atau_materi = dataLama.bab_atau_materi || '';
    form.value.pertemuan_ke = dataLama.pertemuan_ke || '';
    form.value.alokasi_waktu = dataLama.alokasi_waktu || '';
    form.value.target_peserta = dataLama.target_peserta || 'Peserta Didik Reguler';
    form.value.model_pembelajaran = dataLama.model_pembelajaran || 'Problem Based Learning';
    form.value.pemahaman_bermakna = dataLama.pemahaman_bermakna || '';
    form.value.pertanyaan_pemantik = dataLama.pertanyaan_pemantik || '';
    form.value.lkpd = dataLama.lkpd || '';
    form.value.glosarium_pustaka = dataLama.glosarium_pustaka || '';
    form.value.sarana_prasarana = dataLama.sarana_prasarana || '';
    form.value.plotting_id = dataLama.plotting_id;

    if (dataLama.tujuan_pembelajarans) {
      form.value.tujuan_pembelajaran_ids = dataLama.tujuan_pembelajarans.map(tp => tp.id);
    }

    if (dataLama.profil_pancasila) {
      form.value.profil_pancasila = typeof dataLama.profil_pancasila === 'string' 
        ? JSON.parse(dataLama.profil_pancasila) 
        : dataLama.profil_pancasila;
    }

    if (dataLama.kegiatan_pembelajaran && dataLama.kegiatan_pembelajaran.length > 0) {
      form.value.kegiatan_pembelajaran = typeof dataLama.kegiatan_pembelajaran === 'string' 
        ? JSON.parse(dataLama.kegiatan_pembelajaran) 
        : dataLama.kegiatan_pembelajaran;
    }

    if (dataLama.bank_soals) {
      form.value.bank_soal_ids = dataLama.bank_soals.map(s => s.id);
    }

    const mapelId = dataLama.plotting ? dataLama.plotting.mapel_id : null;
    await muatDataPendukung(form.value.plotting_id, mapelId);

  } catch (error) {
    console.error("Gagal menarik detail modul:", error);
    Swal.fire('Error', 'Modul tidak ditemukan atau gagal dimuat.', 'error');
    batal();
  } finally {
    isLoadingData.value = false;
  }
};

const muatDataPendukung = async (plottingId, mapelId) => {
  if (!plottingId) return;
  try {
    if (mapelId) {
      const resKktp = await api.get('/guru/kktp', { params: { mapel_id: mapelId, kelas_id: plottingId } });
      const payload = resKktp.data.data || {};
      const dataCP = payload.list_cp || [];
      listCp.value = dataCP;

      // Menyimpan data TP agar `getKodeTp` bisa membaca kodenya
      let tempTp = [];
      dataCP.forEach(cp => {
        if (cp.list_tp) tempTp.push(...cp.list_tp);
      });
      opsiTp.value = tempTp;
    }

    // Mengambil bank soal menggunakan limit paginasi yang sama dengan create
    const resSoal = await api.get('/guru/bank-soal', { 
      params: { 
        page: 1,
        plotting_id: plottingId, // Filter agar tidak nyasar ke mapel lain
        per_page: 100 
      } 
    }); 
    
    // Penanganan respons array dari Laravel
    if (resSoal.data.data && Array.isArray(resSoal.data.data.data)) {
      opsiSoal.value = resSoal.data.data.data; 
    } else {
      opsiSoal.value = resSoal.data.data || []; 
    }
  } catch (error) {
    console.error("Gagal muat data pendukung:", error);
  }
};

const togglePancasila = (profil) => {
  const index = form.value.profil_pancasila.indexOf(profil);
  if (index > -1) form.value.profil_pancasila.splice(index, 1);
  else form.value.profil_pancasila.push(profil);
};

const tambahKegiatan = () => {
  form.value.kegiatan_pembelajaran.push({ tahap: '', durasi: '', aktivitas: '' });
};

const hapusKegiatan = (index) => {
  if (form.value.kegiatan_pembelajaran.length > 1) {
    form.value.kegiatan_pembelajaran.splice(index, 1);
  } else {
    Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Minimal harus ada 1 tahapan kegiatan!' });
  }
};

const simpanModul = async () => {
  if (form.value.tujuan_pembelajaran_ids.length === 0) {
    Swal.fire('Peringatan', 'Minimal pilih 1 Tujuan Pembelajaran (TP)', 'warning');
    return;
  }

  isSaving.value = true;
  try {
    const payload = { ...form.value };
    await api.put(`/guru/modul-ajar/${modulId.value}`, payload);
    
    Swal.fire({ icon: 'success', title: 'Berhasil Disimpan!', text: 'Perubahan Modul Ajar berhasil disimpan.' });
    router.push({ name: 'guru.modul-ajar' });
  } catch (error) {
    console.error("Gagal update modul:", error);
    Swal.fire('Gagal Menyimpan', 'Terjadi kesalahan pada sistem', 'error');
  } finally {
    isSaving.value = false;
  }
};

const batal = () => router.push({ name: 'guru.modul-ajar' });

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
  const promptText = `Saya sedang membuat Modul Ajar SMK untuk materi: "${form.value.bab_atau_materi}" (Pertemuan: ${pertemuan}, Waktu: ${waktu}).\n\nTujuan Pembelajarannya adalah:\n${stringTp}\n\nTolong buatkan isian untuk form Modul Ajar saya. Syarat utama: Buatlah SANGAT SIMPEL, bahasanya sederhana, langsung pada intinya (to the point), dan tidak kompleks. Tanpa kalimat pengantar atau penutup dari Anda.\n\nLangsung jawab persis dengan 6 format berikut:\n\n1. Pertanyaan Pemantik: (1-2 pertanyaan singkat pemancing nalar)\n2. Pemahaman Bermakna: (1-2 kalimat singkat manfaat materi di dunia nyata)\n3. Sarana & Prasarana: (Daftar singkat alat/bahan/media)\n4. LKPD: (Ide singkat tugas praktek/teori untuk siswa)\n5. Glosarium dan Daftar Pustaka: (3-4 kata kunci dan 1-2 buku/referensi umum)\n6. Skenario Kegiatan Pembelajaran: (Tuliskan poin-poin sangat singkat untuk: Pendahuluan, Inti, Penutup)`;

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
    Swal.fire({ icon: 'error', title: 'Gagal Menyalin', text: 'Browser Anda mungkin tidak mengizinkan aksi copy otomatis.' });
  }
};

onMounted(() => {
  muatDetailModul();
});
</script>

<style scoped>
/* CSS Sama persis dengan halaman Create Anda, saya sertakan penuh agar tidak berantakan */
.content-body { padding: 30px; background-color: #fcf8f2; min-height: 100vh; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.margin-top-25 { margin-top: 25px; }
.margin-top-15 { margin-top: 15px; }

/* Header Box */
.header-buku-box { background: #1E5631; color: white; padding: 20px 30px; }
.header-flex { display: flex; align-items: center; gap: 20px; }
.btn-back { background: #689F38; border: none; color: white; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.btn-back:hover { background: #FBC02D; color: #1E5631; }
.meta-info h2 { margin: 0 0 6px 0; color: #FBC02D; font-size: 20px; }
.meta-info p { margin: 0; color: #FFE0B2; font-size: 14px; }

/* Form Elements */
.section-header { border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 20px; }
.section-header h3 { margin: 0; color: #1E5631; font-size: 18px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
.form-group label { display: block; font-weight: bold; margin-bottom: 8px; color: #444; font-size: 14px; }
.input-text, .input-textarea { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 6px; font-family: inherit; font-size: 14px; }
.input-text:focus, .input-textarea:focus { border-color: #689F38; outline: none; box-shadow: 0 0 5px rgba(104,159,56,0.3); }
.text-danger { color: red; }
.text-muted { color: #888; font-size: 13px; }

/* Grouping TP */
.tp-selection-container { display: flex; flex-direction: column; gap: 15px; margin-top: 15px; }
.cp-group-card { border: 1px solid #c5e1a5; border-radius: 8px; overflow: hidden; background-color: #fcf8f2; }
.cp-header { display: flex; align-items: flex-start; justify-content: flex-start; gap: 12px; background-color: #e8f5e9; color: #1E5631; padding: 12px 15px; border-bottom: 1px solid #c5e1a5; }
.cp-header strong { flex: 1; white-space: normal; word-wrap: break-word; line-height: 1.5; text-align: left; font-size: 14px; }
.checkbox-grid { display: grid; grid-template-columns: 1fr; gap: 10px; padding: 15px; background-color: white; }
.checkbox-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13.5px; line-height: 1.4; }
.checkbox-item input[type="checkbox"] { margin-top: 3px; cursor: pointer; }
.badge-kode-tp { font-weight: bold; color: #e65100; }
.empty-state-small { padding: 15px; background: #fff3e0; color: #e65100; border-radius: 6px; border: 1px dashed #ffb74d; font-size: 13px; }

/* Profil Pancasila */
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

/* Styling Pilihan Soal (Disesuaikan dengan Create) */
.soal-selection-box { border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden; background: #fff; max-height: 300px; overflow-y: auto; }
.table-soal { width: 100%; border-collapse: collapse; font-size: 13px; }
.table-soal th { background: #f5f5f5; padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; text-align: left; }
.table-soal td { padding: 10px; border-bottom: 1px solid #eee; }
.text-left { text-align: left; }
.badge-jenis { background: #e3f2fd; color: #1565c0; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 11px; }
.badge-level { padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; color: white; text-transform: capitalize; background-color: #689F38; }
.badge-level.mudah { background-color: #4caf50; }
.badge-level.sedang { background-color: #ff9800; }
.badge-level.sulit { background-color: #f44336; }

/* Buttons Footer */
.action-footer { display: flex; justify-content: flex-end; gap: 15px; border-top: 1px solid #eee; padding-top: 20px; }
.btn-cancel { background: #f5f5f5; color: #555; border: 1px solid #ddd; padding: 12px 25px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; }
.btn-save { background: #1E5631; color: white; border: none; padding: 12px 30px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; }
.btn-save:hover { background: #689F38; }
.btn-save:disabled { background: #a5d6a7; cursor: not-allowed; }
</style>