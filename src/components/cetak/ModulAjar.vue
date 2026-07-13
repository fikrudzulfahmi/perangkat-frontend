<template>
  <div class="modul-container">
    <div v-if="!modulList || modulList.length === 0" class="no-data-alert text-center">
      Data Modul Ajar belum tersedia untuk ploting ini.
    </div>

    <div v-for="(modul, index) in modulList" :key="index" class="modul-content" :class="{ 'break-before': index > 0 }">
      
      <h2 class="document-title">MODUL AJAR / RPP</h2>
      <hr class="title-line" />

      <div class="modul-section">
        <h3 class="section-title">A. INFORMASI UMUM</h3>
        
        <table class="identity-table">
          <tbody>
            <tr><td class="cell-label bold-text">Nama Penyusun</td><td class="cell-separator">:</td><td>{{ guru?.name || guru?.nama || '-' }}</td></tr>
            <tr><td class="cell-label bold-text">Institusi</td><td class="cell-separator">:</td><td>{{ config?.nama_sekolah || '-' }}</td></tr>
            <tr><td class="cell-label bold-text">Mata Pelajaran</td><td class="cell-separator">:</td><td>{{ guru?.mapel || '-' }}</td></tr>
            <tr><td class="cell-label bold-text">Bab / Materi</td><td class="cell-separator">:</td><td class="bold-text">{{ modul.bab_atau_materi }}</td></tr>
            <tr><td class="cell-label bold-text">Fase / Kelas</td><td class="cell-separator">:</td><td>{{ guru?.fase || 'F' }} / {{ guru?.kelas || '-' }}</td></tr>
            <tr><td class="cell-label bold-text">Alokasi Waktu</td><td class="cell-separator">:</td><td>{{ modul.alokasi_waktu }}</td></tr>
            <tr><td class="cell-label bold-text">Peretemuan</td><td class="cell-separator">:</td><td>{{ modul.pertemuan_ke }} pertemuan</td></tr>
          </tbody>
        </table>

        <div class="sub-section">
          <h4 class="sub-title">1. Dimensi Profil Lulusan</h4>
          <ul class="profil-lulusan-list">
            <li v-for="(pp, i) in modul.profil_pancasila" :key="i">
              <span class="bold-text">{{ pp }}</span>
              <div class="profil-desc">{{ getDeskripsiProfilLulusan(pp) }}</div>
            </li>
          </ul>
        </div>

        <div class="sub-section">
          <h4 class="sub-title">2. Sarana dan Prasarana</h4>
          <div class="pre-text" v-html="sanitizeHtml(modul.sarana_prasarana) || '-'"></div>
        </div>

        <div class="sub-section">
          <h4 class="sub-title">3. Target Peserta Didik</h4>
          <div class="pre-text">{{ modul.target_peserta || '-' }}</div>
        </div>

        <div class="sub-section">
          <h4 class="sub-title">4. Model Pembelajaran</h4>
          <div class="pre-text">{{ modul.model_pembelajaran || '-' }}</div>
        </div>
      </div>

      <div class="modul-section">
        <h3 class="section-title">B. KOMPONEN INTI</h3>
        
        <div class="sub-section">
          <h4 class="sub-title">1. Tujuan Pembelajaran</h4>
          <ul>
            <li v-for="(tp, i) in modul.tujuan_pembelajarans" :key="i">
              <span class="bold-text">{{ tp.kode_tp }}</span> - {{ tp.deskripsi }}
            </li>
          </ul>
        </div>

        <div class="sub-section">
          <h4 class="sub-title">2. Pemahaman Bermakna</h4>
          <div class="pre-text" v-html="sanitizeHtml(modul.pemahaman_bermakna) || '-'"></div>
        </div>

        <div class="sub-section">
          <h4 class="sub-title">3. Pertanyaan Pemantik</h4>
          <div class="pre-text" v-html="sanitizeHtml(modul.pertanyaan_pemantik) || '-'"></div>
        </div>

        <div class="sub-section">
          <h4 class="sub-title">4. Kegiatan Pembelajaran</h4>
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 15%; text-align: center;">Tahapan</th>
                <th style="width: 70%;">Aktivitas Pembelajaran</th>
                <th style="width: 15%; text-align: center;">Durasi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!modul.kegiatan_pembelajaran || modul.kegiatan_pembelajaran.length === 0">
                <td colspan="3" class="text-center">Belum ada data kegiatan pembelajaran.</td>
              </tr>
              <tr v-else v-for="(kegiatan, i) in modul.kegiatan_pembelajaran" :key="i">
                <td class="bold-text text-center">{{ kegiatan.tahap }}</td>
                <td class="pre-text" v-html="sanitizeHtml(kegiatan.aktivitas)"></td>
                <td class="text-center">{{ kegiatan.durasi }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="sub-section break-before-if-needed">
          <h4 class="sub-title">5. Asesmen / Penilaian</h4>
          
          <ul v-if="modul.asesmen_diagnostik || modul.asesmen_formatif || modul.asesmen_sumatif" class="asesmen-list">
            <li v-if="modul.asesmen_diagnostik">
              <strong>Asesmen Diagnostik:</strong> Kuesioner/Survei Singkat atau Diskusi Awal.
            </li>
            <li v-if="modul.asesmen_formatif">
              <strong>Asesmen Formatif:</strong> Observasi, Diskusi Kelompok, Penilaian Diri, Jurnal Belajar, Kuis Singkat, Umpan Balik Teman Sebaya.
            </li>
            <li v-if="modul.asesmen_sumatif">
              <strong>Asesmen Sumatif:</strong> Proyek Akhir/Uji Kinerja, Tes Tulis Komprehensif, atau Portofolio.
            </li>
          </ul>
          
          <div v-else class="pre-text">
            Tidak ada jenis asesmen yang dipilih untuk modul ini.
          </div>
        </div>

        <div class="sub-section break-before-if-needed">
          <h4 class="sub-title">6. Pengayaan dan Remedial</h4>
          
          <div class="remedial-pengayaan-box">
            <div class="rp-item">
              <strong>a. Langkah Remedial</strong>
              <div class="pre-text" v-html="sanitizeHtml(modul.remedial_content) || 'Tidak ada data langkah remedial yang diatur.'"></div>
            </div>
            
            <div class="rp-item" style="margin-top: 15px;">
              <strong>b. Evaluasi Pengayaan</strong>
              <div class="pre-text" v-html="sanitizeHtml(modul.enrichment_content) || 'Tidak ada data evaluasi pengayaan yang diatur.'"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="modul-section break-before-if-needed section-lampiran">
        <h3 class="section-title">C. LAMPIRAN</h3>
        
        <div class="sub-section">
          <h4 class="sub-title">1. Lembar Kerja Peserta Didik (LKPD)</h4>
          <div class="pre-text" v-html="sanitizeHtml(modul.lkpd) || '-'"></div>
        </div>

        <div class="sub-section">
          <h4 class="sub-title">2. Glosarium & Daftar Pustaka</h4>
          <div class="pre-text" v-html="sanitizeHtml(modul.glosarium_pustaka) || '-'"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { sanitizeHtml } from '../../utils/sanitizeHtml';

defineProps(['config', 'guru', 'modulList']);

// Referensi: Permendikdasmen No. 10 Tahun 2025 tentang Standar Kompetensi Lulusan (SKL)
// 8 Dimensi Profil Lulusan (pengganti 6 dimensi Profil Pelajar Pancasila)
// Key harus persis sama dengan label yang tersimpan di field modul.profil_pancasila
const DESKRIPSI_PROFIL_LULUSAN = {
  'Keimanan, Ketakwaan, dan Akhlak Mulia':
    'Peserta didik meyakini dan mengamalkan ajaran agama atau kepercayaannya, berakhlak mulia, serta menjaga hubungan baik dengan Tuhan Yang Maha Esa, sesama manusia, dan lingkungan sekitar.',
  'Kewargaan':
    'Peserta didik bangga terhadap identitas dan budayanya, menghargai keberagaman, menjaga persatuan bangsa, taat pada aturan bernegara dan bermasyarakat, serta peduli pada keberlanjutan lingkungan dan keharmonisan antarbangsa.',
  'Penalaran Kritis':
    'Peserta didik memiliki rasa ingin tahu, mampu berpikir logis dan analitis, dapat menganalisis dan memecahkan masalah, berargumentasi secara logis, serta memanfaatkan kemampuan literasi dan numerasi dalam menyelesaikan persoalan.',
  'Kreativitas':
    'Peserta didik mampu berperilaku produktif, menghasilkan gagasan atau karya yang inovatif, dan merumuskan solusi atas berbagai permasalahan di sekitarnya.',
  'Kolaborasi':
    'Peserta didik terbiasa peduli dan berbagi dengan orang lain, serta mampu membangun kerja sama dengan berbagai pihak di lingkungan sekitarnya.',
  'Kemandirian':
    'Peserta didik mampu bertanggung jawab, berinisiatif, dan beradaptasi dalam proses belajar maupun pengembangan dirinya.',
  'Kesehatan':
    'Peserta didik menerapkan pola hidup bersih dan sehat, memahami pentingnya kebugaran serta kesehatan fisik dan mental, dan berkontribusi positif bagi lingkungannya.',
  'Komunikasi':
    'Peserta didik memiliki kemampuan menyimak, membaca, berbicara, dan menulis dengan baik dan benar, sesuai etika, dalam berbagai konteks dan media.',
};

// Fallback berbasis kata kunci, dipakai hanya jika label tidak cocok persis
// (misal ada perbedaan spasi/kapitalisasi pada data lama)
const FALLBACK_KEYWORDS = [
  { keywords: ['iman', 'takwa', 'akhlak'], key: 'Keimanan, Ketakwaan, dan Akhlak Mulia' },
  { keywords: ['warga'], key: 'Kewargaan' },
  { keywords: ['nalar', 'kritis'], key: 'Penalaran Kritis' },
  { keywords: ['kreatif'], key: 'Kreativitas' },
  { keywords: ['kolaborasi', 'gotong'], key: 'Kolaborasi' },
  { keywords: ['mandiri'], key: 'Kemandirian' },
  { keywords: ['sehat'], key: 'Kesehatan' },
  { keywords: ['komunikasi'], key: 'Komunikasi' },
];

function getDeskripsiProfilLulusan(nama) {
  if (!nama) return '';
  const label = nama.toString().trim();

  // 1. Coba cocokkan persis (case-insensitive)
  const exactKey = Object.keys(DESKRIPSI_PROFIL_LULUSAN).find(
    k => k.toLowerCase() === label.toLowerCase()
  );
  if (exactKey) return DESKRIPSI_PROFIL_LULUSAN[exactKey];

  // 2. Fallback: cocokkan berdasarkan kata kunci
  const teks = label.toLowerCase();
  const found = FALLBACK_KEYWORDS.find(f => f.keywords.some(k => teks.includes(k)));
  return found ? DESKRIPSI_PROFIL_LULUSAN[found.key] : '';
}
</script>

<style scoped>
/* KONFIGURASI UMUM */
.modul-container {
  font-family: Arial, sans-serif;
  color: #000;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}
.modul-content { 
  width: 100% !important; 
  max-width: 100% !important;
  box-sizing: border-box !important;
}

.document-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 10px;
  text-transform: uppercase;
}
.title-line {
  border: none;
  border-top: 2px solid #000;
  margin-bottom: 25px;
}

/* SECTION & SUB-SECTION */
.modul-section {
  max-width: 100% !important;
  box-sizing: border-box !important;
  display: block;
  margin-bottom: 25px;
}
.section-title {
  font-size: 16px;
  font-weight: bold;
  background-color: #f5f5f5;
  padding: 8px 12px;
  margin-bottom: 15px;
  border-left: 4px solid #000;
  border-top: 1px solid #999;
  border-right: 1px solid #999;
  border-bottom: 1px solid #999;
}
.sub-section { 
  margin-bottom: 15px; 
  width: 100% !important; 
  max-width: 100% !important;
  display: block; 
  box-sizing: border-box !important;
}
.sub-title { font-size: 15px; font-weight: bold; margin: 0 0 8px 0; }

/* TEKS DINAMIS DATABASE - AMAN UNTUK DIV DAN TABEL */
.pre-text {
  white-space: pre-line !important;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  word-break: break-word !important; 
  max-width: 100% !important;             
  box-sizing: border-box !important;      
  font-family: Arial, sans-serif;
  font-size: 14px;
  text-align: justify;
  line-height: 1.5;
  background: #fff;
}
.pre-text-inline {
  white-space: pre-line !important;
}
.pre-text :deep(table) { border-collapse: collapse; width: 100%; margin: 6px 0; }
.pre-text :deep(td), .pre-text :deep(th) { border: 1px solid #000; padding: 6px 8px; font-size: 13px; }
.pre-text :deep(th) { background: #f5f5f5; font-weight: bold; }
ul { margin: 5px 0; padding-left: 20px; }
li { font-size: 14px; text-align: justify; margin-bottom: 6px; line-height: 1.5; }

/* PROFIL LULUSAN (8 DIMENSI) */
.profil-lulusan-list { padding-left: 20px; }
.profil-lulusan-list li { margin-bottom: 10px; }
.profil-desc {
  font-size: 13.5px;
  font-weight: normal;
  text-align: justify;
  line-height: 1.5;
  color: #222;
  margin-top: 2px;
}


/* STYLE ASESMEN & REMEDIAL BARU (PENGGANTI BANK SOAL) */
.asesmen-list {
  margin: 5px 0 15px 0;
  padding-left: 20px;
}
.asesmen-list li {
  margin-bottom: 6px;
  line-height: 1.5;
  font-size: 14px;
}
.remedial-pengayaan-box {
  margin-top: 8px;
}
.rp-item strong {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
  color: #333;
}


/* UTILITY CLASSES */
.bold-text { font-weight: bold; }
.text-center { text-align: center; }
.no-data-alert { padding: 25px; color: #666; font-style: italic; }

/* Pemisah halaman cetak */
.break-before { 
  page-break-before: always !important; 
  break-before: page !important; 
}
.break-before-if-needed {
  page-break-inside: auto !important;
}

/* DESAIN TABEL IDENTITAS */
.identity-table { 
  width: 100% !important; 
  border-collapse: collapse; 
  margin-bottom: 25px; 
  table-layout: fixed !important;
}
.identity-table td { 
  border: 1px solid #999; 
  padding: 8px 12px; 
  font-size: 14px; 
  vertical-align: top; 
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
}
.identity-table .cell-label { width: 22%; background-color: #f5f5f5; }
.identity-table .cell-separator { width: 3%; text-align: center; background-color: #f5f5f5; }

/* DESAIN TABEL UTAMA */
.data-table { 
  width: 100% !important; 
  border-collapse: collapse; 
  margin-top: 10px; 
  page-break-inside: auto; 
  table-layout: fixed !important; 
}
.data-table th { background-color: #f5f5f5; border: 1px solid #000; padding: 10px; font-size: 14px; font-weight: bold; }
.data-table td { 
  border: 1px solid #000; 
  padding: 10px; 
  font-size: 14px; 
  vertical-align: top; 
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
}
.data-table thead { display: table-header-group; }
.data-table tr { 
  page-break-inside: avoid;    
  break-inside: avoid;
}
</style>