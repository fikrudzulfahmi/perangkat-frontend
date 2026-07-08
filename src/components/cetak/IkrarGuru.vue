<template>
  <div class="ikrar-container">
    <div v-if="!data || !data.isi_dokumen" class="no-data-alert text-center">
      Data Ikrar Guru belum tersedia.
    </div>

    <div v-else class="content-wrapper">
      <h2 class="document-title">IKRAR GURU INDONESIA</h2>
      
      <ol class="ikrar-list">
        <li v-for="(item, index) in listIkrar" :key="index">
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
  data: Object // Menerima JSON dari API dokumen-statis?jenis=ikrar_guru
});

// Mengubah teks string panjang dari API menjadi format list array
const listIkrar = computed(() => {
  if (!props.data || !props.data.isi_dokumen) return [];
  
  const lines = props.data.isi_dokumen.split('\n');
  
  return lines.filter(line => {
    const trimmed = line.trim();
    // Abaikan baris kosong dan judul jika terbawa di dalam teks
    return trimmed !== '' && !trimmed.toLowerCase().includes('ikrar guru indonesia');
  }).map(line => {
    // Bersihkan angka penomoran otomatis di depan teks (misal "1. ")
    return line.replace(/^\d+\.\s*/, '').trim();
  });
});
</script>

<style scoped>
.ikrar-container {
  font-family: Arial, sans-serif;
  color: #000;
  width: 100% !important;
  box-sizing: border-box !important;
  padding: 20px 40px;
}

.document-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 35px;
  text-decoration: underline;
  letter-spacing: 1px;
}

.ikrar-list {
  padding-left: 25px;
  margin-bottom: 60px;
}

.ikrar-list li {
  font-size: 15px;
  text-align: justify;
  line-height: 1.7;
  margin-bottom: 15px;
  padding-left: 10px;
}

/* BLOK TANDA TANGAN */
.signature-section {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  width: 100%;
}
.signature-box {
  width: 45%;
  font-size: 14px;
  line-height: 1.5;
}
.signature-box.left { text-align: left; }
.signature-box.right { text-align: left; padding-left: 10%; }
.signature-box p { margin: 2px 0; }
.bold-text { font-weight: bold; }
.underline-text { text-decoration: underline; }
.no-data-alert { padding: 25px; color: #666; font-style: italic; }
</style>