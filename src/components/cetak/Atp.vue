<template>
  <div class="atp-container">
    <h2 class="document-title">ALUR TUJUAN PEMBELAJARAN (ATP)</h2>

    <table class="identity-table">
      <tbody>
        <tr>
          <td class="cell-label">Nama Penyusun</td>
          <td class="cell-separator">:</td>
          <td>{{ guru?.name || guru?.nama || '-' }}</td>
        </tr>
        <tr>
          <td class="cell-label">Nama Sekolah</td>
          <td class="cell-separator">:</td>
          <td>{{ config?.nama_sekolah || '-' }}</td>
        </tr>
      </tbody>
    </table>
    
    <table class="identity-table" style="margin-top: 15px;">
      <tbody>
        <tr>
          <td class="cell-label">Mata Pelajaran</td>
          <td class="cell-separator">:</td>
          <td>{{ guru?.mapel || '-' }}</td>
        </tr>
        <tr>
          <td class="cell-label">Fase / Kelas</td>
          <td class="cell-separator">:</td>
          <td>{{ guru?.fase || 'F' }} / {{ guru?.kelas || '-' }}</td>
        </tr>
      </tbody>
    </table>

    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 5%; text-align: center;">No</th>
          <th style="width: 30%; text-align: center;">Elemen</th>
          <th style="width: 50%; text-align: center;">Tujuan Pembelajaran</th>
          <th style="width: 15%; text-align: center;">Alokasi Waktu</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!formattedAtp || formattedAtp.length === 0">
          <td colspan="4" class="text-center no-data">Data ATP belum tersedia.</td>
        </tr>
        <tr v-else v-for="(item, index) in formattedAtp" :key="index">
          <td class="text-center">{{ index + 1 }}</td>
          <td v-if="item.showElemen" :rowspan="item.rowspan" class="text-center align-middle">
  {{ item.elemen }}
</td>
          <td class="text-justify">{{ item.deskripsi_tp || '-' }}</td>
          <td class="text-center">{{ item.alokasi_jp || 0 }} JP</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['config', 'guru', 'atpData', 'cpData']);

// Fungsi otomatis untuk melacak dan memasangkan Elemen dengan Tujuan Pembelajarannya
const formattedAtp = computed(() => {
  if (!props.atpData) return [];

  return props.atpData.map(item => {
    let elemenName = item.elemen;
    let deskripsi = item.deskripsi_tp || item.tujuan || item.deskripsi;

    // JIKA elemen masih kosong/strip dari parent (CetakPerangkat), kita lacak otomatis dari cpData
    if ((!elemenName || elemenName === '-') && props.cpData && props.cpData.length > 0) {
      for (const cp of props.cpData) {
        if (cp.list_tp) {
          // Cari apakah TP pada row ini ada di dalam list_tp elemen ini
          const isMatch = cp.list_tp.find(tp => 
            tp.id === item.tp_id || 
            tp.kode_tp === item.kode_tp || 
            tp.deskripsi === deskripsi
          );
          
          if (isMatch) {
            elemenName = cp.elemen;       // Set nama elemen dari relasinya
            deskripsi = isMatch.deskripsi; // Set deskripsi TP-nya
            break;
          }
        }
      }
    }

    return {
      ...item,
      elemen: elemenName,
      deskripsi_tp: deskripsi
    };
  });
});
</script>

<style scoped>
.atp-container { font-family: Arial, sans-serif; color: #000; width: 100%; }
.document-title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 25px; text-transform: uppercase; }

.identity-table { width: 100%; border-collapse: collapse; }
.identity-table td { border: 1px solid #b3b3b3; padding: 8px 12px; font-size: 14px; }
.identity-table .cell-label { width: 22%; font-weight: bold; background-color: #f5f5f5;}
.identity-table .cell-separator { width: 3%; text-align: center; background-color: #f5f5f5; }

.data-table { 
  width: 100%; 
  border-collapse: collapse; 
  margin-top: 20px; 
  page-break-inside: auto; 
}

.data-table th { background-color: #f5f5f5; border: 1px solid #b3b3b3; padding: 10px; font-size: 14px; font-weight: bold; vertical-align: middle; }
.data-table td { border: 1px solid #b3b3b3; padding: 10px; font-size: 14px; vertical-align: top; }

.data-table thead { display: table-header-group; }
.data-table tr { page-break-inside: avoid; break-inside: avoid; }

.text-center { text-align: center; }
.text-justify { text-align: justify; line-height: 1.4; }
.no-data { padding: 25px; color: #666; font-style: italic; }
</style>

<style>
@media print {
  table { page-break-inside: auto !important; width: 100% !important; }
  tr, td, th { page-break-inside: avoid !important; page-break-after: auto !important; }
  thead { display: table-header-group !important; }
}
</style>