<template>
  <div class="jurnal-container">
    <div class="header-jurnal text-center mb-4">
      <h3 class="font-bold uppercase text-lg">JURNAL AGENDA GURU MENGAJAR</h3>
      <h4 class="font-bold uppercase text-md">TAHUN PELAJARAN {{ identity?.tahun_pelajaran || '202X/202X' }}</h4>
    </div>

    <div class="info-identitas mb-4">
      <table class="identity-table">
        <tr>
          <td width="140">Mata Pelajaran</td>
          <td width="15">:</td>
          <td class="font-bold">{{ identity?.mapel || '......................................................' }}</td>
          <td width="40"></td>
          <td width="120">Kelas / Fase</td>
          <td width="15">:</td>
          <td>{{ identity?.kelas || '..........' }} / {{ identity?.fase || '..........' }}</td>
        </tr>
        <tr>
          <td>Guru Pengampu</td>
          <td>:</td>
          <td>{{ identity?.name || '......................................................' }}</td>
          <td></td>
          <td>Semester</td>
          <td>:</td>
          <td>......................................................</td>
        </tr>
      </table>
    </div>

    <table class="table-jurnal">
      <thead>
        <tr>
          <th rowspan="2" width="4%">No</th>
          <th rowspan="2" width="15%">Hari / Tanggal</th>
          <th rowspan="2" width="8%">Jam Ke</th>
          <th rowspan="2" width="8%">Kelas</th>
          <th rowspan="2" width="40%">Materi / Kegiatan Pembelajaran</th>
          <th colspan="3" width="12%">Absensi Siswa</th>
          <th rowspan="2" width="13%">Keterangan / Catatan</th>
        </tr>
        <tr class="sub-header">
          <th>S</th>
          <th>I</th>
          <th>A</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 12" :key="i" class="row-blank">
          <td class="text-center">{{ i }}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>

   
  </div>
</template>

<script setup>
import { computed } from 'vue';

defineProps({
  identity: {
    type: Object,
    default: () => ({})
  },
  settingCetak: {
    type: Object,
    default: () => ({})
  }
});

// Tanggal hari ini otomatis untuk default penandatanganan
const tanggalCetak = computed(() => {
  const date = new Date();
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
});
</script>

<style scoped>
/* Pengaturan Halaman A4 Potret di Layar Preview */
.jurnal-container {
  background: white;
  width: 210mm; /* Kembalikan ke 210mm (Portrait) */
  min-height: 297mm; /* Kembalikan ke 297mm (Portrait) */
  padding: 15mm;
  margin: 0 auto 25px auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  box-sizing: border-box;
  font-family: 'Times New Roman', Times, serif;
  color: #000;
}
/* Helper Utilities */
.text-center { text-align: center; }
.uppercase { text-transform: uppercase; }
.font-bold { font-weight: bold; }
.underline { text-decoration: underline; }
.mb-4 { margin-bottom: 1.5rem; }
.mt-5 { margin-top: 3.5rem; }
.text-lg { font-size: 16px; }
.text-md { font-size: 14px; }

/* Tabel Identitas */
.identity-table {
  width: 100%;
  font-size: 13px;
  border: none;
}
.identity-table td {
  padding: 4px 0;
  vertical-align: top;
}

/* Tabel Jurnal Agenda Utama */
.table-jurnal {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.table-jurnal th,
.table-jurnal td {
  border: 1px solid #000;
  padding: 8px 6px;
  vertical-align: middle;
}

.table-jurnal th {
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: center;
}

.table-jurnal .sub-header th {
  padding: 4px;
  font-size: 11px;
}

/* Tinggi Baris Kosong agar Nyaman Ditulis Manual */
.row-blank {
  height: 38px;
}

/* Tanda Tangan */
.signature-area {
  font-size: 13px;
  page-break-inside: avoid;
}
.signature-area p {
  margin: 0 0 5px 0;
}

/* PENGATURAN CETAK (PRINT) */
@page cetak-jurnal-landscape {
  size: A4 landscape; /* Memaksa printer mendatar */
  margin: 15mm;
}

@media print {
  .jurnal-container {
    width: 100% !important;
    height: auto !important;
    min-height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    border: none !important;
    page: cetak-jurnal-landscape; /* Menghubungkan ke aturan landscape di atas */
  }
  .table-jurnal tr {
    page-break-inside: avoid !important;
  }
}
</style>