<template>
  <div class="kktp-container">
    <h2 class="document-title">KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)</h2>
    <hr class="title-line" />

    <div v-if="!listTp || listTp.length === 0" class="no-data-alert text-center">
      Data Tujuan Pembelajaran belum tersedia untuk ploting ini.
    </div>

    <div v-else>
      <table class="identity-table">
        <tbody>
          <tr>
            <td class="cell-label bold-text">Nama Guru</td>
            <td class="cell-separator">:</td>
            <td>{{ guru?.name || guru?.nama || '-' }}</td>
          </tr>
          <tr>
            <td class="cell-label bold-text">Mata Pelajaran</td>
            <td class="cell-separator">:</td>
            <td>{{ guru?.mapel || '-' }}</td>
          </tr>
          <tr>
            <td class="cell-label bold-text">Fase / Kelas</td>
            <td class="cell-separator">:</td>
            <td>Fase {{ data?.list_cp?.[0]?.fase || 'E' }} / {{ guru?.kelas || '-' }}</td>
          </tr>
          <tr>
            <td class="cell-label bold-text">Tahun Pelajaran</td>
            <td class="cell-separator">:</td>
            <td>{{ config?.tahun_pelajaran || '2023/2024' }}</td>
          </tr>
          <tr>
            <td class="cell-label bold-text">Kriteria Kelulusan (KKM)</td>
            <td class="cell-separator">:</td>
            <td class="bold-text" style="color: #1E5631;">{{ nilaiKktp }}</td>
          </tr>
        </tbody>
      </table>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 4%; text-align: center;">No.</th>
            <th style="width: 8%; text-align: center;">Kode TP</th>
            <th style="width: 40%;">Kompetensi Tujuan Pembelajaran (TP)</th>
            <th style="width: 12%; text-align: center;">Baru Berkembang<br>(0-65)</th>
            <th style="width: 12%; text-align: center;">Layak<br>(66-75)</th>
            <th style="width: 12%; text-align: center;">Cakap<br>(76-85)</th>
            <th style="width: 12%; text-align: center;">Mahir<br>(86-100)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tp, index) in listTp" :key="index">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="bold-text text-center">{{ tp.kode_tp }}</td>
            <td class="text-justify">{{ tp.deskripsi }}</td>
            
            <td class="text-center check-cell">{{ angkaMurni >= 0 && angkaMurni <= 60 ? '✔' : '' }}</td>
            <td class="text-center check-cell">{{ angkaMurni >= 61 && angkaMurni <= 70 ? '✔' : '' }}</td>
            <td class="text-center check-cell" :class="{ 'status-active': angkaMurni >= 71 && angkaMurni <= 80 }">
              {{ angkaMurni >= 71 && angkaMurni <= 80 ? '✔' : '' }}
            </td>
            <td class="text-center check-cell">{{ angkaMurni >= 81 && angkaMurni <= 100 ? '✔' : '' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  config: Object,
  guru: Object,
  data: Object,
  kktp_nilai: [String, Number] // Menangkap nilai kktp dari induk
});

// Menentukan teks nilai KKM yang ditampilkan di tabel identitas atas
const nilaiKktp = computed(() => {
  return props.kktp_nilai || props.data?.kktp_nilai || props.data?.kktp || props.guru?.kktp_nilai || 75;
});

// Konversi nilai ke tipe Number agar komparasi logika matematika beroperasi dengan valid
const angkaMurni = computed(() => {
  const nilai = nilaiKktp.value;
  return parseInt(nilai, 10) || 75;
});

// Menggabungkan seluruh data TP dari list_cp
const listTp = computed(() => {
  if (!props.data || !props.data.list_cp) return [];
  let tps = [];
  props.data.list_cp.forEach(cp => {
    if (cp.list_tp && cp.list_tp.length > 0) {
      tps.push(...cp.list_tp);
    }
  });
  return tps;
});
</script>

<style scoped>
.kktp-container {
  font-family: Arial, sans-serif;
  color: #000;
  width: 100% !important;
  box-sizing: border-box !important;
}

.document-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: uppercase;
}
.title-line {
  border: none;
  border-top: 2px solid #000;
  margin-bottom: 25px;
}

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
}
.identity-table .cell-label { width: 25%; background-color: #f5f5f5; }
.identity-table .cell-separator { width: 3%; text-align: center; background-color: #f5f5f5; }

.data-table { 
  width: 100% !important; 
  border-collapse: collapse; 
  margin-top: 10px; 
  table-layout: fixed !important;
}
.data-table th { 
  background-color: #f5f5f5; 
  border: 1px solid #000; 
  padding: 10px; 
  font-size: 13px; 
  font-weight: bold;
  vertical-align: middle;
}
.data-table td { 
  border: 1px solid #000; 
  padding: 10px; 
  font-size: 14px; 
  vertical-align: middle;
  word-wrap: break-word !important;
}

.check-cell {
  font-size: 18px;
  font-weight: bold;
  color: #000;
}

/* Background penanda kolom aktif saat di-preview di browser */
@media screen {
  .status-active {
    background-color: #e8f5e9 !important;
  }
}

.bold-text { font-weight: bold; }
.text-center { text-align: center; }
.text-justify { text-align: justify; line-height: 1.5; }
.no-data-alert { padding: 25px; color: #666; font-style: italic; }
</style>