<template>
  <div class="prota-container">
    <div class="header-title">
      <h2>PROGRAM TAHUNAN</h2>
      <h2>{{ config?.nama_sekolah || 'SMK ISLAM 1 BLITAR' }}</h2>
    </div>

    <!-- Tabel Identitas -->
    <table class="identity-table">
      <tbody>
        <tr>
          <td class="label-col">Mata Pelajaran</td>
          <td class="separator-col">:</td>
          <td class="value-col">{{ guru?.mapel || '-' }}</td>
        </tr>
        <tr>
          <td class="label-col">Konsentrasi Keahlian</td>
          <td class="separator-col">:</td>
          <td class="value-col">Teknik Sepeda Motor</td>
        </tr>
        <tr>
          <td class="label-col">Kelas / Fase</td>
          <td class="separator-col">:</td>
          <td class="value-col">{{ guru?.kelas || '-' }} / {{ guru?.fase || '-' }}</td>
        </tr>
        <tr>
          <td class="label-col">Kurikulum</td>
          <td class="separator-col">:</td>
          <td class="value-col">Kurikulum Merdeka</td>
        </tr>
        <tr>
          <td class="label-col">Tahun Pelajaran</td>
          <td class="separator-col">:</td>
          <td class="value-col">{{ guru?.tahun_pelajaran || '-' }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Tabel Utama Program Tahunan -->
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 6%;">SMT</th>
          <th style="width: 10%;">NO. TP</th>
          <th style="width: 72%;">TUJUAN PEMBELAJARAN</th>
          <th style="width: 12%;">JUMLAH JP</th>
        </tr>
      </thead>
      <tbody>
        <!-- ====== SEMESTER GANJIL ====== -->
        <template v-if="protaGanjil.length > 0">
          <tr v-for="(item, index) in protaGanjil" :key="'ganjil-'+index">
            <!-- Sel SMT Ganjil (Merger Row) -->
            <td v-if="index === 0" :rowspan="protaGanjil.length" class="bg-ganjil vertical-text">
              Ganjil
            </td>
            
            <td class="text-center">{{ item.kode_tp || '-' }}</td>
            <td class="text-left">{{ item.deskripsi_tp || '-' }}</td>
            <td class="text-center">{{ item.alokasi_jp || 0 }}</td>
          </tr>
          <tr class="total-row">
            <!-- Kolom Jumlah membentang melewati kolom No TP dan Deskripsi -->
            <td colspan="3" class="text-center bold-text padding-right">Jumlah</td>
            <td class="text-center bold-text">{{ totalGanjil }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td class="bg-ganjil vertical-text">Ganjil</td>
            <td colspan="3" class="text-center text-muted italic">Data Tujuan Pembelajaran Semester Ganjil Belum Tersedia</td>
          </tr>
        </template>

        <!-- ====== SEMESTER GENAP ====== -->
        <template v-if="protaGenap.length > 0">
          <tr v-for="(item, index) in protaGenap" :key="'genap-'+index">
            <!-- Sel SMT Genap (Merger Row) -->
            <td v-if="index === 0" :rowspan="protaGenap.length" class="bg-genap vertical-text">
              Genap
            </td>
            
            <td class="text-center">{{ item.kode_tp || '-' }}</td>
            <td class="text-left">{{ item.deskripsi_tp || '-' }}</td>
            <td class="text-center">{{ item.alokasi_jp || 0 }}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" class="text-center bold-text padding-right">Jumlah</td>
            <td class="text-center bold-text">{{ totalGenap }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td class="bg-genap vertical-text">Genap</td>
            <td colspan="3" class="text-center text-muted italic">Data Tujuan Pembelajaran Semester Genap Belum Tersedia</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  config: Object,
  guru: Object,
  data: Array // Data ini berasal dari "dataAtp" di CetakPerangkat.vue
});

// Filter Semester Ganjil (mendukung angka "1" atau string "ganjil")
const protaGanjil = computed(() => {
  if (!props.data) return [];
  return props.data.filter(d => ['1', 'ganjil'].includes(String(d.semester).toLowerCase()));
});

// Filter Semester Genap (mendukung angka "2" atau string "genap")
const protaGenap = computed(() => {
  if (!props.data) return [];
  return props.data.filter(d => ['2', 'genap'].includes(String(d.semester).toLowerCase()));
});

// Kalkulasi Total JP
const totalGanjil = computed(() => {
  return protaGanjil.value.reduce((sum, item) => sum + (Number(item.alokasi_jp) || 0), 0);
});

const totalGenap = computed(() => {
  return protaGenap.value.reduce((sum, item) => sum + (Number(item.alokasi_jp) || 0), 0);
});
</script>

<style scoped>
.prota-container {
  font-family: Arial, sans-serif;
  color: #000;
  width: 100%;
}

.header-title {
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
}
.header-title h2 {
  margin: 0;
  font-size: 18px;
  text-transform: uppercase;
}

/* Tabel Identitas */
.identity-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 13px;
}
.identity-table td {
  padding: 4px 0;
}
.label-col { width: 18%; }
.separator-col { width: 2%; text-align: center; }
.value-col { width: 80%; }

/* Tabel Data Utama */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.data-table th {
  background-color: #d9d9d9;
  border: 2px solid #000;
  padding: 8px;
  text-align: center;
  font-weight: bold;
}
.data-table td {
  border: 2px solid #000;
  padding: 6px 8px;
  vertical-align: middle;
}

/* Text Alignment & Styling */
.text-center { text-align: center; }
.text-left { text-align: left; line-height: 1.4; }
.text-right { text-align: right; }
.bold-text { font-weight: bold; }
.italic { font-style: italic; }
.text-muted { color: #555; }
.padding-right { padding-right: 15px !important; }

/* Background Row Total */
.total-row td {
  background-color: #f2f2f2;
}

/* Warna dan Teks Vertikal Ganjil/Genap (Sesuai Gambar) */
.vertical-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg); /* Membalik teks agar terbaca dari bawah ke atas */
  text-align: center;
  vertical-align: middle;
  font-weight: bold;
  font-size: 16px;
  letter-spacing: 2px;
}

.bg-ganjil {
  background-color: #0070C0 !important; /* Warna Biru */
  color: white !important;
}
.bg-genap {
  background-color: #FFC000 !important; /* Warna Kuning/Oranye */
  color: black !important;
}
</style>

<style>
/* Memastikan warna background cell ikut tercetak di Google Chrome / Printer */
@media print {
  .bg-ganjil, .bg-genap, .data-table th, .total-row td {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>