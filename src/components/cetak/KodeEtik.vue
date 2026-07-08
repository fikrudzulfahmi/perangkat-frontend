<template>
  <div class="kode-etik-container">
    <div v-if="!data || !data.isi_dokumen" class="no-data-alert text-center">
      Data Kode Etik Guru belum tersedia.
    </div>

    <div v-else class="content-wrapper">
      <h2 class="document-title">KODE ETIK GURU INDONESIA</h2>
      
      <ol class="etik-list">
        <li v-for="(item, index) in listEtik" :key="index">
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
  data: Object // Menerima JSON "data" dari API statis
});

// Memproses string dari API agar menjadi array untuk list HTML
const listEtik = computed(() => {
  if (!props.data || !props.data.isi_dokumen) return [];
  
  // Pecah string berdasarkan baris baru (enter)
  const lines = props.data.isi_dokumen.split('\n');
  
  return lines.filter(line => {
    const trimmed = line.trim();
    // Hilangkan baris kosong dan baris judul (KODE ETIK GURU INDONESIA) yang ikut terbawa di string
    return trimmed !== '' && !trimmed.toLowerCase().includes('kode etik guru indonesia');
  }).map(line => {
    // Hapus angka di depan teks (misal "1. ") karena HTML <ol> otomatis membuat angkanya
    return line.replace(/^\d+\.\s*/, '').trim();
  });
});
</script>

<style scoped>
.kode-etik-container {
  font-family: Arial, sans-serif;
  color: #000;
  width: 100% !important;
  box-sizing: border-box !important;
  padding: 20px 40px; /* Memberikan margin bernapas seperti di kertas dokumen */
}

.document-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 30px;
  text-decoration: underline;
}

.etik-list {
  padding-left: 25px;
  margin-bottom: 50px;
}

.etik-list li {
  font-size: 15px;
  text-align: justify;
  line-height: 1.6;
  margin-bottom: 12px;
  padding-left: 10px; /* Jarak antara angka dan teks */
}

/* DESAIN BLOK TANDA TANGAN */
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

.signature-box.left {
  text-align: left;
}

.signature-box.right {
  text-align: left;
  padding-left: 10%; /* Menggeser area ttd kanan agar pas posisinya */
}

.signature-box p {
  margin: 2px 0;
}

.bold-text {
  font-weight: bold;
}
.underline-text {
  text-decoration: underline;
}
.no-data-alert { 
  padding: 25px; 
  color: #666; 
  font-style: italic; 
}
</style>