<template>
  <div class="dokumen-container">
    <div v-if="!data || !data.isi_dokumen" class="no-data-alert text-center">
      Data Tata Tertib Guru belum tersedia.
    </div>

    <div v-else class="content-wrapper">
      <h2 class="document-title">TATA TERTIB GURU</h2>
      
      <ol class="dokumen-list">
        <li v-for="(item, index) in listData" :key="index">
          {{ item }}
        </li>
      </ol>

     
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  config: Object,
  guru: Object,
  data: Object
});

const listData = computed(() => {
  if (!props.data || !props.data.isi_dokumen) return [];
  const lines = props.data.isi_dokumen.split('\n');
  return lines.filter(line => {
    const trimmed = line.trim();
    return trimmed !== '' && !trimmed.toLowerCase().includes('tata tertib');
  }).map(line => {
    return line.replace(/^\d+\.\s*/, '').trim();
  });
});
</script>

<style scoped>
.dokumen-container {
  font-family: Arial, sans-serif; color: #000; width: 100% !important; box-sizing: border-box !important; padding: 20px 40px;
}
.document-title { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 35px; text-decoration: underline; letter-spacing: 1px; }
.dokumen-list { padding-left: 25px; margin-bottom: 60px; }
.dokumen-list li { font-size: 15px; text-align: justify; line-height: 1.7; margin-bottom: 15px; padding-left: 10px; }
.signature-section { display: flex; justify-content: space-between; margin-top: 50px; width: 100%; }
.signature-box { width: 45%; font-size: 14px; line-height: 1.5; }
.signature-box.left { text-align: left; }
.signature-box.right { text-align: left; padding-left: 10%; }
.signature-box p { margin: 2px 0; }
.bold-text { font-weight: bold; }
.underline-text { text-decoration: underline; }
.no-data-alert { padding: 25px; color: #666; font-style: italic; }
</style>