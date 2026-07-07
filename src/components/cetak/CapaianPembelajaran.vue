<template>
  <div class="cp-container">
    <h2 class="document-title">CAPAIAN PEMBELAJARAN</h2>

    <div v-if="!cpData || cpData.length === 0" class="no-data-alert">
      Data Capaian Pembelajaran (CP) belum tersedia untuk mata pelajaran ini.
    </div>

    <table v-else class="cp-table identity-table">
      <tbody>
        <tr>
          <td class="label bg-gray">Nama Penyusun</td>
          <td class="separator bg-gray">:</td>
          <td>{{ guru?.name || guru?.nama || '-' }}</td>
        </tr>
        <tr>
          <td class="label bg-gray">Mata Pelajaran</td>
          <td class="separator bg-gray">:</td>
          <td>{{ guru?.mapel || '-' }}</td>
        </tr>
        <tr>
          <td class="label bg-gray">Fase / Kelas</td>
          <td class="separator bg-gray">:</td>
          <td>Fase {{ cpData[0]?.fase || 'F' }} / {{ guru?.kelas || '-' }}</td>
        </tr>
      </tbody>
    </table>

    <template v-if="cpData && cpData.length > 0">
      <table class="cp-table elements-table">
        <tbody v-for="(cp, index) in cpData" :key="index">
          <tr class="spacer-row" v-if="index !== 0"><td colspan="3"></td></tr>
          <tr>
            <td class="label bg-gray font-bold">Elemen</td>
            <td class="separator bg-gray">:</td>
            <td class="font-bold">{{ cp.elemen || '-' }}</td>
          </tr>
          <tr>
            <td class="label bg-gray font-bold">Deskripsi</td>
            <td class="separator bg-gray">:</td>
            <td class="text-justify">{{ cp.deskripsi || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script setup>
defineProps(['config', 'guru', 'cpData']);
</script>

<style scoped>
.cp-container { font-family: Arial, sans-serif; color: #000; width: 100%; }
.document-title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 25px; text-transform: uppercase; }
.cp-table { width: 100%; border-collapse: collapse; }
.cp-table td { border: 1px solid #999; padding: 10px 12px; font-size: 14px; vertical-align: top; }
.bg-gray { background-color: #f5f5f5; }
.cp-table .label { width: 22%; font-weight: bold; }
.cp-table .separator { width: 3%; text-align: center; }
.font-bold { font-weight: bold; }
.text-justify { text-align: justify; line-height: 1.5; }
.spacer-row td { border: none !important; height: 15px; padding: 0 !important; }
.identity-table { margin-bottom: 20px; }
.no-data-alert { text-align: center; padding: 30px; border: 1px dashed #ccc; color: #666; font-size: 14px; }
</style>