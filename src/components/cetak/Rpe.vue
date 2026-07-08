<template>
  <div class="rpe-container">
    <h2 class="document-title">RINCIAN MINGGU EFEKTIF (RME)</h2>

    <table class="identity-table" v-if="guru">
      <tbody>
        <tr>
          <td class="cell-label bold-text">Nama Satuan Pend</td>
          <td class="cell-separator">:</td>
          <td class="bold-text">{{ config?.nama_sekolah || '-' }}</td>
        </tr>
        <tr>
          <td class="cell-label bold-text">Mata Pelajaran</td>
          <td class="cell-separator">:</td>
          <td class="bold-text">{{ guru?.mapel || '-' }}</td>
        </tr>
        <tr>
          <td class="cell-label bold-text">Kelas / Fase</td>
          <td class="cell-separator">:</td>
          <td class="bold-text">{{ guru?.kelas || '-' }}</td>
        </tr>
        <tr>
          <td class="cell-label bold-text">Tahun Pelajaran</td>
          <td class="cell-separator">:</td>
          <td class="bold-text">{{ guru?.tahun_pelajaran || '-' }}</td>
        </tr>
      </tbody>
    </table>

    <table class="data-table">
      <thead>
        <tr>
          <th rowspan="2" style="width: 5%; text-align: center;">No.</th>
          <th rowspan="2" style="width: 15%; text-align: center;">Bulan</th>
          <th colspan="3" style="text-align: center;">Jumlah Minggu</th>
          <th rowspan="2" style="width: 35%; text-align: center;">Keterangan</th>
        </tr>
        <tr>
          <th style="width: 10%; text-align: center;">Total</th>
          <th style="width: 10%; text-align: center;">Efektif</th>
          <th style="width: 10%; text-align: center;">Tidak Efektif</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!data || data.length === 0">
          <td colspan="6" class="text-center no-data">Data Rincian Pekan Efektif belum tersedia.</td>
        </tr>
        <template v-else>
          <tr v-if="dataGanjil.length > 0">
            <td colspan="6" class="semester-header bold-text">I. Semester Ganjil</td>
          </tr>
          <tr v-for="(item, index) in dataGanjil" :key="'ganjil-'+index">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ item.bulan }}</td>
            <td class="text-center">{{ item.jumlah_minggu }}</td>
            <td class="text-center">{{ item.minggu_efektif }}</td>
            <td class="text-center">{{ item.minggu_tidak_efektif }}</td>
            <td class="text-justify">{{ item.keterangan !== '-' ? item.keterangan : '' }}</td>
          </tr>
          <tr class="total-row" v-if="dataGanjil.length > 0">
            <td colspan="2" class="text-center bold-text">Jumlah</td>
            <td class="text-center bold-text">{{ calcTotal(dataGanjil, 'jumlah_minggu') }}</td>
            <td class="text-center bold-text">{{ calcTotal(dataGanjil, 'minggu_efektif') }}</td>
            <td class="text-center bold-text">{{ calcTotal(dataGanjil, 'minggu_tidak_efektif') }}</td>
            <td></td>
          </tr>
          <tr v-if="dataGanjil.length > 0">
            <td colspan="6" class="text-center bold-text italic-text calc-row">
              Jumlah Jam Pelajaran Dalam Semester Ganjil = {{ guru?.jp || 0 }} x {{ calcTotal(dataGanjil, 'minggu_efektif') }} Jam Pelajaran = {{ (guru?.jp || 0) * calcTotal(dataGanjil, 'minggu_efektif') }} Jam Pelajaran
            </td>
          </tr>

          <tr v-if="dataGenap.length > 0">
            <td colspan="6" class="semester-header bold-text" style="border-top: 2px solid #000;">II. Semester Genap</td>
          </tr>
          <tr v-for="(item, index) in dataGenap" :key="'genap-'+index">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ item.bulan }}</td>
            <td class="text-center">{{ item.jumlah_minggu }}</td>
            <td class="text-center">{{ item.minggu_efektif }}</td>
            <td class="text-center">{{ item.minggu_tidak_efektif }}</td>
            <td class="text-justify">{{ item.keterangan !== '-' ? item.keterangan : '' }}</td>
          </tr>
          <tr class="total-row" v-if="dataGenap.length > 0">
            <td colspan="2" class="text-center bold-text">Jumlah</td>
            <td class="text-center bold-text">{{ calcTotal(dataGenap, 'jumlah_minggu') }}</td>
            <td class="text-center bold-text">{{ calcTotal(dataGenap, 'minggu_efektif') }}</td>
            <td class="text-center bold-text">{{ calcTotal(dataGenap, 'minggu_tidak_efektif') }}</td>
            <td></td>
          </tr>
          <tr v-if="dataGenap.length > 0">
            <td colspan="6" class="text-center bold-text italic-text calc-row">
              Jumlah Jam Pelajaran Dalam Semester Genap = {{ guru?.jp || 0 }} x {{ calcTotal(dataGenap, 'minggu_efektif') }} Jam Pelajaran = {{ (guru?.jp || 0) * calcTotal(dataGenap, 'minggu_efektif') }} Jam Pelajaran
            </td>
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
  data: Array
});

const dataGanjil = computed(() => {
  if (!props.data) return [];
  return props.data.filter(d => d.semester.toLowerCase() === 'ganjil');
});

const dataGenap = computed(() => {
  if (!props.data) return [];
  return props.data.filter(d => d.semester.toLowerCase() === 'genap');
});

const calcTotal = (arr, key) => {
  return arr.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
};
</script>

<style scoped>
.rpe-container { font-family: Arial, sans-serif; color: #000; width: 100%; }
.document-title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 25px; text-transform: uppercase; }

.identity-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
.identity-table td { border: 1px solid #999; padding: 6px 10px; font-size: 13px; }
.identity-table .cell-label { width: 25%; }
.identity-table .cell-separator { width: 3%; text-align: center; }

.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; page-break-inside: auto; }
.data-table th { background-color: #d9d9d9; border: 1px solid #000; padding: 8px; font-size: 13px; font-weight: bold; vertical-align: middle; }
.data-table td { border: 1px solid #000; padding: 6px 8px; font-size: 13px; vertical-align: top; }

.semester-header { text-align: left; background-color: #fff; padding-top: 15px !important; padding-bottom: 5px !important; border: none !important; }
.total-row td { background-color: #f9f9f9; }
.calc-row td { padding: 10px; background-color: #fff; }

.text-center { text-align: center; }
.text-justify { text-align: justify; line-height: 1.4; }
.bold-text { font-weight: bold; }
.italic-text { font-style: italic; }
.no-data { padding: 25px; color: #666; font-style: italic; }

.data-table thead { display: table-header-group; }
.data-table tr { page-break-inside: avoid; break-inside: avoid; }
</style>