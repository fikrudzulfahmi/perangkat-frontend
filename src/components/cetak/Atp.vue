<template>
  <div class="atp-container">
    <h2 class="document-title">ALUR TUJUAN PEMBELAJARAN (ATP)</h2>

    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 5%; text-align: center;">No.</th>
          <th style="width: 15%; text-align: center;">Kode TP</th>
          <th style="width: 55%;">Kompetensi Tujuan Pembelajaran (TP)</th>
          <th style="width: 10%; text-align: center;">Semester</th>
          <th style="width: 15%; text-align: center;">Alokasi (JP)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!atpData || atpData.length === 0">
          <td colspan="5" class="text-center no-data">Data ATP belum tersedia.</td>
        </tr>
        <tr v-else v-for="(item, index) in atpData" :key="index">
          <td class="text-center">{{ item.nomor_urut }}</td>
          <td class="bold-text text-center">{{ item.kode_tp }}</td>
          <td class="text-justify">{{ item.deskripsi_tp }}</td>
          <td class="text-center">{{ item.semester }}</td>
          <td class="text-center">{{ item.alokasi_jp }} JP</td>
        </tr>
      </tbody>
      
      </table>
  </div>
</template>

<script setup>
defineProps(['config', 'guru', 'atpData', 'cpData']);
</script>

<style scoped>
.atp-container { font-family: Arial, sans-serif; color: #000; width: 100%; }
.document-title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 25px; text-transform: uppercase; }

/* Desain Tabel Profil Identitas */
.identity-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
.identity-table td { border: 1px solid #999; padding: 8px 12px; font-size: 14px; }
.identity-table .cell-label { width: 22%; background-color: #f5f5f5; }
.identity-table .cell-separator { width: 3%; text-align: center; background-color: #f5f5f5; }
.bold-text { font-weight: bold; }

/* Desain Tabel Utama */
.data-table { 
  width: 100%; 
  border-collapse: collapse; 
  margin-top: 10px; 
  page-break-inside: auto; 
}

.data-table th { background-color: #f5f5f5; border: 1px solid #000; padding: 10px; font-size: 14px; font-weight: bold; }
.data-table td { border: 1px solid #000; padding: 10px; font-size: 14px; vertical-align: top; }

/* Pengulangan otomatis Header tabel di kertas lembar baru */
.data-table thead {
  display: table-header-group; 
}

/* Mengunci baris agar tidak terbelah mengerikan di tengah kalimat */
.data-table tr {
  page-break-inside: avoid;    
  break-inside: avoid;
}

.text-center { text-align: center; }
.text-justify { text-align: justify; line-height: 1.4; }
.no-data { padding: 25px; color: #666; font-style: italic; }
</style>

<style>
@media print {
  /* 1. Biarkan tabel mengalir secara natural ke halaman berikutnya */
  table {
    page-break-inside: auto !important;
    width: 100% !important;
  }
  
  /* 2. Cegah baris tabel terbelah di tengah-tengah teks */
  tr, td, th {
    page-break-inside: avoid !important;
    page-break-after: auto !important;
  }

  /* 3. Ulangi header tabel di setiap halaman baru */
  thead {
    display: table-header-group !important;
  }
}
</style>