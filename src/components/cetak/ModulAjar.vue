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
            <tr><td class="cell-label bold-text">Fase / Kelas</td><td class="cell-separator">:</td><td>{{ guru?.kelas || '-' }}</td></tr>
            <tr><td class="cell-label bold-text">Alokasi Waktu</td><td class="cell-separator">:</td><td>{{ modul.alokasi_waktu }} Menit</td></tr>
            <tr><td class="cell-label bold-text">Pertemuan Ke</td><td class="cell-separator">:</td><td>{{ modul.pertemuan_ke }}</td></tr>
          </tbody>
        </table>

        <div class="sub-section">
          <h4 class="sub-title">1. Profil Pelajar Pancasila</h4>
          <ul>
            <li v-for="(pp, i) in modul.profil_pancasila" :key="i">{{ pp }}</li>
          </ul>
        </div>

        <div class="sub-section">
          <h4 class="sub-title">2. Sarana dan Prasarana</h4>
          <div class="pre-text">{{ modul.sarana_prasarana }}</div>
        </div>

        <div class="sub-section">
          <h4 class="sub-title">3. Target Peserta Didik</h4>
          <div class="pre-text">{{ modul.target_peserta }}</div>
        </div>

        <div class="sub-section">
          <h4 class="sub-title">4. Model Pembelajaran</h4>
          <div class="pre-text">{{ modul.model_pembelajaran }}</div>
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
          <div class="pre-text">{{ modul.pemahaman_bermakna }}</div>
        </div>

        <div class="sub-section">
          <h4 class="sub-title">3. Pertanyaan Pemantik</h4>
          <div class="pre-text">{{ modul.pertanyaan_pemantik }}</div>
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
              <tr v-for="(kegiatan, i) in modul.kegiatan_pembelajaran" :key="i">
                <td class="bold-text text-center">{{ kegiatan.tahap }}</td>
                <td class="pre-text">{{ kegiatan.aktivitas }}</td>
                <td class="text-center">{{ kegiatan.durasi }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="modul-section break-before section-lampiran">
        <h3 class="section-title">C. LAMPIRAN</h3>
        
        <div class="sub-section">
          <h4 class="sub-title">1. Lembar Kerja Peserta Didik (LKPD)</h4>
          <div class="pre-text">{{ modul.lkpd }}</div>
        </div>

        <div class="sub-section">
          <h4 class="sub-title">2. Glosarium & Daftar Pustaka</h4>
          <div class="pre-text">{{ modul.glosarium_pustaka }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps(['config', 'guru', 'modulList']);
</script>

<style scoped>
/* KONFIGURASI UMUM MENYAMAKAN ATP.VUE & CP.VUE */
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
  white-space: pre-line !important;       /* Mengabaikan spasi error database tapi tetap membaca enter */
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  word-break: break-all !important;      /* KUNCI: Memaksa kata patah ke bawah jika menyentuh ujung kanan */
  max-width: 100% !important;             
  box-sizing: border-box !important;      
  font-family: Arial, sans-serif;
  font-size: 14px;
  text-align: justify;
  line-height: 1.5;
}
ul { margin: 5px 0; padding-left: 20px; }
li { font-size: 14px; text-align: justify; margin-bottom: 6px; line-height: 1.5; }

/* UTILITY CLASSES */
.bold-text { font-weight: bold; }
.text-center { text-align: center; }
.no-data-alert { padding: 25px; color: #666; font-style: italic; }

/* Pemisah halaman cetak */
.break-before { 
  page-break-before: always !important; 
  break-before: page !important; 
}

/* DESAIN TABEL IDENTITAS */
.identity-table { 
  width: 100% !important; 
  border-collapse: collapse; 
  margin-bottom: 25px; 
  table-layout: fixed !important;        /* KUNCI: Mengunci lebar tabel agar tidak melar */
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
  table-layout: fixed !important;        /* KUNCI: Mengunci lebar tabel agar tidak melar */
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