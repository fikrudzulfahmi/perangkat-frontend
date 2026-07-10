<template>
  <div class="nilai-container">
    <h2 class="document-title">DAFTAR NILAI SISWA</h2>

    <table class="identity-table">
      <tbody>
        <tr>
          <td class="label">Mata Pelajaran</td>
          <td class="separator">:</td>
          <td class="value">{{ guru?.mapel || '-' }}</td>
          <td class="label-right">Tahun Pelajaran</td>
          <td class="separator">:</td>
          <td class="value">{{ config?.tahun_pelajaran || (siswaData?.[0]?.tahun_pelajaran_id ? '2026/2027' : '-') }}</td>
        </tr>
        <tr>
          <td class="label">Kelas</td>
          <td class="separator">:</td>
          <td class="value">{{ guru?.kelas || siswaData?.[0]?.kelas?.nama_kelas || '-' }}</td>
          <td class="label-right">Semester</td>
          <td class="separator">:</td>
          <td class="value">................................................</td>
        </tr>
      </tbody>
    </table>

    <table class="data-table">
      <thead>
        <tr>
          <th rowspan="2" class="col-no">No</th>
          <th rowspan="2" class="col-nis">NIS</th>
          <th rowspan="2" class="col-nama">Nama Siswa</th>
          <th colspan="15" class="materi-header">Materi Penilaian / Tujuan Pembelajaran (TP)</th>
          <th rowspan="2" class="col-akhir">Nilai Akhir</th>
        </tr>
        <tr>
          <th v-for="i in 15" :key="'h-' + i" class="empty-header-materi"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!siswaData || siswaData.length === 0">
          <td colspan="19" class="text-center no-data">Data siswa belum tersedia.</td>
        </tr>
        
        <tr v-else v-for="(siswa, index) in siswaData" :key="siswa.id">
          <td class="text-center">{{ index + 1 }}</td>
          
          <td class="text-center">{{ siswa.nis ? String(siswa.nis).split('/')[0] : '-' }}</td>
          
          <td class="nama-siswa text-left">{{ siswa.nama_siswa || '-' }}</td>
          
          <td v-for="i in 15" :key="'n-' + i" class="nilai-cell"></td>
          
          <td class="nilai-cell"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  guru: {
    type: Object,
    default: () => ({})
  },
  siswaData: {
    type: Array,
    default: () => []
  },
  config: {
    type: Object,
    default: () => ({})
  }
});
</script>

<style scoped>
/* Reset & Base Print Styles */
.nilai-container {
  width: 100%;
  font-family: 'Times New Roman', Times, serif;
  color: #000;
  background: #fff;
}

.document-title {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px; /* Dikecilkan */
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Tabel Identitas */
.identity-table {
  width: 100%;
  margin-bottom: 10px; /* Dikecilkan */
  font-size: 12px;
  border-collapse: collapse;
}
.identity-table td {
  padding: 1px 0; /* Padding vertikal dihilangkan agar lebih rapat */
  vertical-align: top;
}
.label { width: 12%; }
.separator { width: 2%; text-align: center; }
.value { width: 36%; font-weight: bold; }
.label-right { width: 20%; padding-left: 20px !important; }

/* Tabel Data Utama */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}
.data-table th, .data-table td {
  border: 1px solid #000;
  /* PERBAIKAN: Padding dikecilkan agar baris tidak bengkak ke bawah */
  padding: 2px 4px; 
  vertical-align: middle;
}
.data-table thead {
  display: table-header-group;
  background-color: #f9f9f9;
}
.data-table tr {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* Pengaturan Lebar Kolom */
.col-no { width: 3%; }
.col-nis { width: 7%; }
.col-nama { width: 28%; }
.col-akhir { width: 6%; text-align: center; }

/* Area Kolom Materi */
.materi-header {
  text-align: center;
  padding: 4px !important; /* Dikecilkan */
  font-size: 12px;
}
.empty-header-materi {
  height: 55px; /* Dikecilkan sedikit dari 60px tapi tetap ada ruang nulis */
  width: 3.73%; /* Sisa ruang (100-44) / 15 */
}

/* Sel Nilai */
.nilai-cell {
  height: 16px; /* PERBAIKAN: Tinggi baris nilai ditipiskan maksimal */
}

/* Utilities */
.text-center { text-align: center; }
.text-left { text-align: left; }
.no-data { padding: 15px !important; font-style: italic; color: #555; }

/* Format Nama Siswa (1 Baris & Terpotong Rapi) */
.nama-siswa { 
  padding-left: 4px !important; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  max-width: 150px; 
}
</style>