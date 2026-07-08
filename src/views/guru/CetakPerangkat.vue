<template>
  <div class="cetak-container">
    <aside class="control-panel no-print">
      <div class="card-box sticky-top">
        <h3 class="panel-title"><i class="fa-solid fa-gear"></i> Pengaturan Cetak</h3>
        <hr class="divider" />
        
        <div class="form-group">
          <label style="color: #1E5631; font-weight: bold;">
            <i class="fa-solid fa-chalkboard-user"></i> Pilih Ploting Mengajar
          </label>
          <select v-model="selectedPloting" @change="handlePlotingChange">
            <option value="">-- Pilih Mapel & Kelas --</option>
            <option v-for="p in listPloting" :key="p.id" :value="p.id">
              {{ p.mapel }} ({{ formatArrayKelas(p.list_kelas) }})
            </option>
          </select>
          <small v-if="listPloting.length === 0" class="text-danger">Belum ada data ploting mengajar.</small>
        </div>

        <hr class="divider" />

        <div class="form-group">
          <label>Nama Sekolah</label>
          <input type="text" v-model="settingCetak.nama_sekolah" placeholder="Contoh: SMK ISLAM 1 BLITAR" />
        </div>

        <div class="form-group">
          <label>Nama Kepala Sekolah</label>
          <input type="text" v-model="settingCetak.nama_kepsek" placeholder="Nama Beserta Gelar" />
        </div>

        <div class="form-group">
          <label>NIP Kepala Sekolah</label>
          <input type="text" v-model="settingCetak.nip_kepsek" placeholder="Masukkan NIP" />
        </div>

        <hr class="divider" />

        <p class="section-subtitle"><strong>Pilih Bagian Dokumen:</strong></p>
        <div class="scrollable-checklist">
          <div class="buku-section">
            <p class="buku-title">唐 BAGIAN UTAMA</p>
            <label><input type="checkbox" v-model="showPart.cover" /> 1.1 Cover / Sampul Utama</label>
            <label><input type="checkbox" v-model="showPart.daftar_isi" /> Daftar Isi</label>
          </div>

          <div class="buku-section">
            <p class="buku-title">祷 BUKU KERJA 1</p>
            <label><input type="checkbox" v-model="showPart.sekat1" /> Sekat Buku Kerja 1</label>
            <label><input type="checkbox" v-model="showPart.cp" /> 1.2 Capaian Pembelajaran (CP)</label>
            <label><input type="checkbox" v-model="showPart.atp" /> 1.3 TP & ATP</label>
            <label><input type="checkbox" v-model="showPart.modul_ajar" /> 1.4 Modul Ajar / RPP</label>
            <label><input type="checkbox" v-model="showPart.kktp" /> 1.5 KKTP</label>
          </div>

          <div class="buku-section">
            <p class="buku-title">痘 BUKU KERJA 2</p>
            <label><input type="checkbox" v-model="showPart.sekat2" /> Sekat Buku Kerja 2</label>
            <label><input type="checkbox" v-model="showPart.kode_etik" /> 2.1 Kode Etik Guru</label>
            <label><input type="checkbox" v-model="showPart.ikrar_guru" /> 2.2 Ikrar Guru</label>
            <label><input type="checkbox" v-model="showPart.tata_tertib" /> 2.3 Tata Tertib Guru</label>
            <label><input type="checkbox" v-model="showPart.pembiasaan" /> 2.4 Pembiasaan Guru</label>
            <label><input type="checkbox" v-model="showPart.kaldik" /> 2.5 Kalender Pendidikan</label>
            <label><input type="checkbox" v-model="showPart.rpe" /> 2.6 Rincian Pekan Efektif</label>
            <label><input type="checkbox" v-model="showPart.prota" /> 2.7 Program Tahunan (Prota)</label>
            <label><input type="checkbox" v-model="showPart.prosem" /> 2.8 Program Semester (Prosem)</label>
            <label><input type="checkbox" v-model="showPart.jurnal_agenda" /> 2.9 Jurnal Agenda Mengajar</label>
          </div>

          <div class="buku-section">
            <p class="buku-title">等 BUKU KERJA 3</p>
            <label><input type="checkbox" v-model="showPart.sekat3" /> Sekat Buku Kerja 3</label>
            <label><input type="checkbox" v-model="showPart.jadwal_blok" /> 3.1 Jadwal Mengajar (Blok)</label>
            <label><input type="checkbox" v-model="showPart.absensi" /> 3.2 Absensi Siswa</label>
            <label><input type="checkbox" v-model="showPart.daftar_nilai" /> 3.3 Daftar Nilai Siswa</label>
            <label><input type="checkbox" v-model="showPart.analisis_belajar" /> 3.4 Analisis Hasil Belajar</label>
            <label><input type="checkbox" v-model="showPart.daya_serap" /> 3.5 Lembar Daya Serap</label>
            <label><input type="checkbox" v-model="showPart.remedial_pengayaan" /> 3.6 Remedial & Pengayaan</label>
            <label><input type="checkbox" v-model="showPart.buku_pegangan" /> 3.7 Buku Pegangan & Paket</label>
            <label><input type="checkbox" v-model="showPart.kumpulan_soal" /> 3.8 Kisi-Kisi & Naskah Soal</label>
            <label><input type="checkbox" v-model="showPart.analisis_butir" /> 3.9 Analisis Butir Soal</label>
            <label><input type="checkbox" v-model="showPart.rekomendasi_soal" /> 3.10 Perbaikan Soal</label>
          </div>

          <div class="buku-section">
            <p class="buku-title">燈 BUKU KERJA 4</p>
            <label><input type="checkbox" v-model="showPart.sekat4" /> Sekat Buku Kerja 4</label>
            <label><input type="checkbox" v-model="showPart.evaluasi_diri" /> 4.1 Evaluasi Diri Guru (PKG)</label>
            <label><input type="checkbox" v-model="showPart.tindak_lanjut" /> 4.2 Tindak Lanjut Kerja Guru</label>
          </div>
        </div>

        <button @click="triggerPrint" class="btn-print-action" :disabled="!selectedPloting">
          <i class="fa-solid fa-print"></i> Cetak Perangkat
        </button>
      </div>
    </aside>

    <main class="preview-area">
      <div v-if="!selectedPloting" class="alert-pilih-ploting no-print">
        <i class="fa-solid fa-circle-info fa-2xl"></i>
        <h3>Silakan pilih Ploting Mengajar terlebih dahulu di panel sebelah kiri untuk memuat preview dokumen.</h3>
      </div>

      <template v-else>
        <section v-if="showPart.cover" class="page-a4">
          <Cover :config="settingCetak" :guru="dataGuruDynamic" />
        </section>

        <section v-if="showPart.daftar_isi" class="page-a4 break-before">
          <DaftarIsi :config="settingCetak" :show="showPart" :pageNumbers="pageNumbers" />
        </section>

        <section v-if="showPart.sekat1" class="page-a4 break-before">
          <div class="sekat-divider">
            <h1>BUKU KERJA I</h1>
            <hr class="sekat-line" />
            <p>CP, TP, ATP, MODUL AJAR, KKTP</p>
          </div>
        </section>

        <section v-if="showPart.cp" class="page-a4 break-before">
          <CapaianPembelajaran :config="settingCetak" :guru="dataGuruDynamic" :cpData="dataCp" />
        </section>

        <section v-if="showPart.atp" class="page-a4 break-before">
          <Atp :config="settingCetak" :guru="dataGuruDynamic" :atpData="dataAtp" />
        </section>

      <section v-if="showPart.modul_ajar" class="page-a4 break-before">
          <ModulAjar :config="settingCetak" :guru="dataGuruDynamic" :modulList="dataModul" />
        </section>

      <section v-if="showPart.kktp" class="page-a4 break-before">
          <Kktp 
            :config="settingCetak" 
            :guru="dataGuruDynamic" 
            :data="dataKktp"
            :kktp_nilai="dataKktp?.kktp_nilai || dataKktp?.kktp || 75" 
          />
        </section>

        <section v-if="showPart.sekat2" class="page-a4 break-before">
          <div class="sekat-divider">
            <h1>BUKU KERJA II</h1>
            <hr class="sekat-line" />
            <p>KODE ETIK, IKRAR, TATA TERTIB, PEMBIASAAN, KALDIK, RPE, PROTA, PROSEM, JURNAL</p>
          </div>
        </section>

        <section v-if="showPart.kode_etik" class="page-a4 break-before">
          <KodeEtik :config="settingCetak" :guru="dataGuruDynamic" :data="dataKodeEtik" />
        </section>

        <section v-if="showPart.ikrar_guru" class="page-a4 break-before">
          <IkrarGuru :config="settingCetak" :guru="dataGuruDynamic" :data="dataIkrarGuru" />
        </section>

        <section v-if="showPart.tata_tertib" class="page-a4 break-before">
          <TataTertib :config="settingCetak" :guru="dataGuruDynamic" :data="dataTataTertib" />
        </section>

        <section v-if="showPart.pembiasaan" class="page-a4 break-before">
          <Pembiasaan :config="settingCetak" :guru="dataGuruDynamic" :data="dataPembiasaan" />
        </section>

        <section v-if="showPart.kaldik" class="page-a4 break-before">
          <Kaldik :data="dataKaldikRpe" />
        </section>
<section v-if="showPart.rpe" class="page-a4 break-before">
          <Rpe 
             :config="settingCetak" 
             :guru="dataGuruDynamic" 
             :data="dataRpe" 
          />
        </section>

        <section v-if="showPart.sekat3" class="page-a4 break-before">
          <div class="sekat-divider">
            <h1>BUKU KERJA III</h1>
            <hr class="sekat-line" />
            <p>JADWAL, ABSENSI, NILAI, ANALISIS, DAYA SERAP, REMEDIAL, BUKU PEGANGAN, SOAL</p>
          </div>
        </section>

        <section v-for="part in ['jadwal_blok', 'absensi', 'daftar_nilai', 'analisis_belajar', 'daya_serap', 'remedial_pengayaan', 'buku_pegangan', 'kumpulan_soal', 'analisis_butir', 'rekomendasi_soal']" 
                 :key="part" v-if="showPart[part]" class="page-a4 break-before">
          <div class="placeholder-page">
            <h2 class="text-uppercase">{{ part.replace('_', ' ') }}</h2>
            <hr/>
            <p class="text-muted">[Konten {{ part }} akan di-render di sini]</p>
          </div>
        </section>

        <section v-if="showPart.sekat4" class="page-a4 break-before">
          <div class="sekat-divider">
            <h1>BUKU KERJA IV</h1>
            <hr class="sekat-line" />
            <p>EVALUASI DIRI GURU & PROGRAM TINDAK LANJUT</p>
          </div>
        </section>

        <section v-for="part in ['evaluasi_diri', 'tindak_lanjut']" 
                 :key="part" v-if="showPart[part]" class="page-a4 break-before">
          <div class="placeholder-page">
            <h2 class="text-uppercase">{{ part.replace('_', ' ') }}</h2>
            <hr/>
            <p class="text-muted">[Konten {{ part }} akan di-render di sini]</p>
          </div>
        </section>

      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../../services/api';

import Cover from '../../components/cetak/Cover.vue';
import DaftarIsi from '../../components/cetak/DaftarIsi.vue';
import CapaianPembelajaran from '../../components/cetak/CapaianPembelajaran.vue';
import Atp from '../../components/cetak/Atp.vue';
import ModulAjar from '../../components/cetak/ModulAjar.vue';
import Kktp from '../../components/cetak/Kktp.vue';
import KodeEtik from '../../components/cetak/KodeEtik.vue';
import IkrarGuru from '../../components/cetak/IkrarGuru.vue';
import TataTertib from '../../components/cetak/TataTertib.vue';
import Pembiasaan from '../../components/cetak/Pembiasaan.vue';
import Kaldik from '../../components/cetak/Kaldik.vue';
import Rpe from '../../components/cetak/Rpe.vue';

const listPloting = ref([]);
const selectedPloting = ref('');

const dataGuruDynamic = ref({
  name: '',
  mapel: '',
  kelas: '',
  tahun_pelajaran: ''
});

const dataCp = ref(null);
const dataAtp = ref([]);
const dataModul = ref([]);
const dataKktp = ref(null);
const dataKodeEtik = ref(null);
const dataIkrarGuru = ref(null);
const dataTataTertib = ref(null);
const dataPembiasaan = ref(null);
const dataKaldikRpe = ref([]);
const dataRpe = ref([]);

const settingCetak = ref({
  nama_sekolah: 'SMK ISLAM 1 BLITAR',
  nama_kepsek: 'Drs. Gigih Widiyanto, M.Pd',
  nip_kepsek: '-'
});

const showPart = ref({
  cover: true,
  daftar_isi: true,
  sekat1: true,
  cp: false,
  atp: false,
  modul_ajar: false,
  kktp: false,
  sekat2: false,
  kode_etik: false,
  ikrar_guru: false,
  tata_tertib: false,
  pembiasaan: false,
  kaldik: false,
  rpe: false,
  prota: false,
  prosem: false,
  jurnal_agenda: false,
  sekat3: false,
  jadwal_blok: false,
  absensi: false,
  daftar_nilai: false,
  analisis_belajar: false,
  daya_serap: false,
  remedial_pengayaan: false,
  buku_pegangan: false,
  kumpulan_soal: false,
  analisis_butir: false,
  rekomendasi_soal: false,
  sekat4: false,
  evaluasi_diri: false,
  tindak_lanjut: false
});

// Tetap dipertahankan agar tidak memicu error prop pada komponen anak, namun disembunyikan lewat CSS
const pageNumbers = computed(() => {
  const pages = {};
  let current = 1; 
  const s = showPart.value;

  if (s.sekat1) { pages.sekat1 = current; current += 1; }
  if (s.cp) { pages.cp = current; current += 1; } 
  if (s.atp) { pages.atp = current; current += 1; }
  if (s.modul_ajar) { pages.modul_ajar = current; current += 2; } 
  if (s.kktp) { pages.kktp = current; current += 1; }
  if (s.sekat2) { pages.sekat2 = current; current += 1; }
  if (s.kode_etik) { pages.kode_etik = current; current += 1; }
  if (s.ikrar_guru) { pages.ikrar_guru = current; current += 1; }
  if (s.tata_tertib) { pages.tata_tertib = current; current += 1; }
  if (s.pembiasaan) { pages.pembiasaan = current; current += 1; }
  if (s.kaldik) { pages.kaldik = current; current += 1; }
  if (s.rpe) { pages.rpe = current; current += 1; }
  if (s.prota) { pages.prota = current; current += 1; }
  if (s.prosem) { pages.prosem = current; current += 1; }
  if (s.jurnal_agenda) { pages.jurnal_agenda = current; current += 1; }
  if (s.sekat3) { pages.sekat3 = current; current += 1; }
  if (s.jadwal_blok) { pages.jadwal_blok = current; current += 1; }
  if (s.absensi) { pages.absensi = current; current += 1; }
  if (s.daftar_nilai) { pages.daftar_nilai = current; current += 1; }
  if (s.analisis_belajar) { pages.analisis_belajar = current; current += 1; }
  if (s.daya_serap) { pages.daya_serap = current; current += 1; }
  if (s.remedial_pengayaan) { pages.remedial_pengayaan = current; current += 1; }
  if (s.buku_pegangan) { pages.buku_pegangan = current; current += 1; }
  if (s.kumpulan_soal) { pages.kumpulan_soal = current; current += 1; }
  if (s.analisis_butir) { pages.analisis_butir = current; current += 1; }
  if (s.rekomendasi_soal) { pages.rekomendasi_soal = current; current += 1; }
  if (s.sekat4) { pages.sekat4 = current; current += 1; }
  if (s.evaluasi_diri) { pages.evaluasi_diri = current; current += 1; }
  if (s.tindak_lanjut) { pages.tindak_lanjut = current; current += 1; }

  return pages;
});

const formatArrayKelas = (arr) => {
  if (!arr || arr.length === 0) return '-';
  if (typeof arr === 'string') return arr;
  return arr.map(k => k.nama_kelas || k.kelas || k.nama).join(', ');
};

const handlePlotingChange = async () => {
  if (!selectedPloting.value) return;

  const activePlot = listPloting.value.find(p => String(p.id) === String(selectedPloting.value));
  
  if (activePlot) {
    let namaDariStorage = '';
    try {
      const userSession = JSON.parse(localStorage.getItem('user')) || {};
      namaDariStorage = userSession.name || userSession.user?.name || userSession.nama || '';
    } catch (e) {
      namaDariStorage = localStorage.getItem('user') || '';
    }
    
    dataGuruDynamic.value = {
      name: activePlot.guru || namaDariStorage || 'Nama Guru',
      mapel: activePlot.mapel || '-',
      kelas: formatArrayKelas(activePlot.list_kelas),
      tahun_pelajaran: activePlot.tahun_pelajaran || '-',
      jp: activePlot.jp_per_minggu || 0
    };

    try {
      const resCp = await api.get('/guru/capaian-pembelajaran', {
        params: { mapel_id: activePlot.mapel_id || activePlot.id_mapel }
      });
      const dataCpArray = resCp.data?.data || resCp.data || [];
      dataCp.value = dataCpArray;

      const resAtp = await api.get('/guru/atp', {
        params: { 
          mapel_id: activePlot.mapel_id || activePlot.id_mapel, 
          kelas_id: activePlot.id 
        }
      });
      const dataSavedAtp = resAtp.data?.data || resAtp.data || [];

      let mergedAtp = [];
      dataCpArray.forEach(cp => {
        const listTp = cp.list_tp || cp.listTp || [];
        listTp.forEach(tp => {
          const savedMatch = dataSavedAtp.find(a => String(a.tujuan_pembelajaran_id) === String(tp.id));
          if (savedMatch) {
            mergedAtp.push({
              kode_tp: tp.kode_tp || tp.kode || '-',
              deskripsi_tp: tp.deskripsi || tp.deskripsi_tp || '-',
              semester: savedMatch.semester || '-',
              nomor_urut: Number(savedMatch.nomor_urut) || 99,
              alokasi_jp: savedMatch.alokasi_jp || 0
            });
          }
        });
      });

      mergedAtp.sort((a, b) => a.nomor_urut - b.nomor_urut);
      dataAtp.value = mergedAtp;

      const resModul = await api.get('/guru/modul-ajar', {
        params: { plotting_id: activePlot.id }
      });
      dataModul.value = resModul.data?.data || resModul.data || [];

     const resKktp = await api.get('/guru/kktp', {
        params: { 
          mapel_id: activePlot.mapel_id || activePlot.id_mapel, // <--- Memperbaiki error mapel_id
          kelas_id: activePlot.kelas_id || activePlot.id,       // <--- Memperbaiki (and 1 more error)
          plotting_id: activePlot.id
        }
      });
      dataKktp.value = resKktp.data?.data || resKktp.data || null;
      // ==== AMBIL DATA KODE ETIK GURU ====
      const resKodeEtik = await api.get('/guru/dokumen-statis', {
        params: { jenis: 'kode_etik' }
      });
      dataKodeEtik.value = resKodeEtik.data?.data || null;

      const resIkrar = await api.get('/guru/dokumen-statis', {
        params: { jenis: 'ikrar_guru' } // <-- Sesuaikan jika nama jenis di DB berbeda
      });
      dataIkrarGuru.value = resIkrar.data?.data || null;

      const resTataTertib = await api.get('/guru/dokumen-statis', {
        params: { jenis: 'tata_tertib' } // sesuaikan jenis dari database
      });
      dataTataTertib.value = resTataTertib.data?.data || null;

      // ==== AMBIL DATA PEMBIASAAN ====
      const resPembiasaan = await api.get('/guru/dokumen-statis', {
        params: { jenis: 'pembiasaan_guru' } // sesuaikan jenis dari database
      });
      dataPembiasaan.value = resPembiasaan.data?.data || null;

      const resKaldikRpe = await api.get('/guru/kalender-efektif', {
        params: { 
          tahun_pelajaran_id: activePlot.tahun_pelajaran_id 
        } 
      });
      
      const fetchedData = resKaldikRpe.data?.data || [];
      
      // Isi data ke masing-masing state komponen
      dataKaldikRpe.value = fetchedData; // Untuk komponen Kaldik
      dataRpe.value = fetchedData;       // Untuk komponen RPE

    } catch (error) {
      console.error("Gagal mengambil data riil CP / ATP:", error);
      dataCp.value = [];
      dataAtp.value = [];
      dataModul.value = [];
      dataKktp.value = null;
      dataKodeEtik.value = null;
      dataIkrarGuru.value = null;
      dataTataTertib.value = null;
      dataPembiasaan.value = null;
      dataKaldikRpe.value = [];
      dataRpe.value = [];
    }
  
  }
};

const triggerPrint = () => {
  window.print();
};

onMounted(async () => {
  try {
    let namaAwal = '';
    try {
      const userSession = JSON.parse(localStorage.getItem('user')) || {};
      namaAwal = userSession.name || userSession.user?.name || userSession.nama || '';
    } catch (e) {
      namaAwal = localStorage.getItem('user') || '';
    }
    
    dataGuruDynamic.value.name = namaAwal;
    dataGuruDynamic.value.nama = namaAwal;

    const response = await api.get('/guru/plotting', { params: { per_page: 100 } });
    listPloting.value = response.data?.data || response.data || [];
    
    if (listPloting.value.length > 0) {
      selectedPloting.value = listPloting.value[0].id;
      await handlePlotingChange(); 
    }
  } catch (error) {
    console.error("Gagal memuat filter ploting mengajar:", error);
  }
});
</script>

<style scoped>
/* ========================================================
   GAYA PREVIEW DI LAYAR MONITOR (TETAP DIJAGA)
   ======================================================== */
.cetak-container { display: flex; background-color: #525659; height: 100vh; overflow: hidden; }
.control-panel { width: 360px; padding: 25px 20px; background: #ffffff; border-right: 1px solid #e0e0e0; box-shadow: 4px 0 10px rgba(0,0,0,0.05); display: flex; flex-direction: column; height: 100%; box-sizing: border-box; }
.sticky-top { display: flex; flex-direction: column; height: 100%; }
.panel-title { color: #1E5631; margin-top: 0; font-family: sans-serif; }
.divider { border: 1px solid #FFE0B2; margin: 12px 0; }
.section-subtitle { font-family: sans-serif; font-size: 13px; color: #555; margin-bottom: 8px; }

.form-group { margin-bottom: 12px; }
.form-group label { display: block; font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #333; font-family: sans-serif; }
.form-group input, .form-group select { width: 100%; padding: 8px 10px; border-radius: 4px; border: 1px solid #689F38; outline: none; font-size: 14px; box-sizing: border-box; }

.scrollable-checklist { flex: 1; overflow-y: auto; padding: 12px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fdfdfd; margin-bottom: 15px; }
.buku-section { margin-bottom: 15px; }
.buku-title { font-weight: bold; font-size: 12px; color: #1E5631; margin: 0 0 5px 0; background: #e8f5e9; padding: 5px 8px; border-radius: 4px; font-family: sans-serif; }
.buku-section label { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 6px; cursor: pointer; font-family: sans-serif; user-select: none; }

.btn-print-action { width: 100%; padding: 12px; background: #1E5631; color: white; border: none; border-radius: 6px; font-weight: bold; font-size: 15px; cursor: pointer; transition: 0.2s; font-family: sans-serif; }
.btn-print-action:hover:not(:disabled) { background: #12361e; }
.btn-print-action:disabled { background: #ccc; cursor: not-allowed; }

.preview-area { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 40px 20px; overflow-y: auto; height: 100%; box-sizing: border-box; }

.page-a4 { 
  background: white; 
  width: 210mm; 
  min-height: 297mm; 
  padding: 25mm 20mm; 
  margin-bottom: 25px; 
  box-shadow: 0 0 10px rgba(0,0,0,0.3); 
  box-sizing: border-box; 
  position: relative;
}

.alert-pilih-ploting { text-align: center; color: #fff; margin-top: 150px; max-width: 500px; line-height: 1.6; font-family: sans-serif; }
.alert-pilih-ploting i { color: #FFE0B2; margin-bottom: 15px; }

.sekat-divider { height: 240mm; border: 6px double #1E5631; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; color: #1E5631; font-family: 'Times New Roman', Times, serif; }
.sekat-divider h1 { font-size: 45px; margin: 0; font-weight: bold; }
.sekat-line { width: 60%; border: 2px solid #1E5631; margin: 15px 0; }
.sekat-divider p { font-size: 16px; font-weight: bold; line-height: 1.5; letter-spacing: 1px; text-transform: uppercase; max-width: 80%; }

.placeholder-page { font-family: 'Times New Roman', Times, serif; color: #333; }
.placeholder-page h2 { color: #1E5631; font-size: 24px; margin-bottom: 5px; }
.text-muted { color: #777; font-style: italic; margin-top: 20px; }

@media screen {
  .page-a4 {
    max-height: 297mm; 
    overflow-y: auto;  
  }
}
</style>

<style>
/* ========================================================
   ATURAN OVERRIDE & CETAK (PRINT) FINAL
   ======================================================== */

/* PERMINTAAN USER: Menghilangkan nomor halaman & titik-titik di Daftar Isi (baik di preview maupun cetak) */
.daftar-isi-container .dots,
.daftar-isi-container .page-number,
.page-footer {
  display: none !important;
}

@media print {
  /* 1. Atur Kertas dan Sembunyikan Panel Kiri */
  @page {
    size: A4 portrait;
    margin: 15mm; 
  }

  aside, .control-panel, .sidebar, .main-sidebar, .sidebar-container, .menu-guru, nav, header, .navbar, .no-print { 
    display: none !important; 
    width: 0 !important;
  }

  /* 2. Bersihkan Container Utama */
  html, body, #app, .main-layout, .wrapper, .main-content, .content-wrapper, main, .cetak-container, .preview-area {
    display: block !important;
    position: static !important;
    width: 100% !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    background: transparent !important;
    overflow: visible !important;
    box-shadow: none !important;
  }

  /* 3. Aturan Box Kertas A4 */
  .page-a4 { 
    display: block !important;
    width: 100% !important; 
    height: auto !important; 
    min-height: 0 !important; 
    max-height: none !important;
    margin: 0 !important;
    padding: 0 !important; 
    box-shadow: none !important; 
    border: none !important;
    page-break-after: auto !important; 
    page-break-inside: auto !important;
  }
  
  /* 4. Mekanisme Pindah Halaman */
  .break-before { 
    page-break-before: always !important; 
    break-before: page !important;
  }

  /* 5. Wadah Pembungkus Komponen */
  .atp-container, .cp-container, div[class*="-container"] {
    display: block !important; 
    width: 100% !important;
    page-break-inside: auto !important;
    height: auto !important;
    overflow: visible !important;
  }

  /* 6. Aturan Tabel */
  .data-table, .cp-table, .identity-table {
    display: table !important; 
    width: 100% !important;
    page-break-inside: auto !important; 
  }

  /* 7. Cegah Baris Terpotong */
  .data-table tbody tr, .cp-table tbody tr {
    page-break-inside: avoid !important; 
    break-inside: avoid !important;
    page-break-after: auto !important;
  }

  /* 8. Ulangi Header Kolom */
  .data-table thead, .cp-table thead {
    display: table-header-group !important; 
  }
}
</style>