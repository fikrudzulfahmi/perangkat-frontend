<template>
  <div class="dokumen-container">
    <div v-if="!data || !data.isi_dokumen" class="no-data-alert text-center">
      Data Pembiasaan Guru belum tersedia.
    </div>

    <div v-else class="content-wrapper">
      <h2 class="document-title">PEMBIASAAN GURU</h2>
      
      <div class="dokumen-list">
        <div 
          v-for="(item, index) in listData" 
          :key="index" 
          :class="item.isMain ? 'main-point' : 'sub-point'"
        >
          {{ item.text }}
        </div>
      </div>


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

// Logika baru untuk mendeteksi Main Poin dan Sub Poin
const listData = computed(() => {
  if (!props.data || !props.data.isi_dokumen) return [];
  
  const lines = props.data.isi_dokumen.split('\n');
  let result = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    
    // Abaikan baris kosong atau baris judul yang ikut terbawa
    if (trimmed === '' || trimmed.toLowerCase() === 'pembiasaan guru') return;
    
    // Cek apakah baris diawali dengan angka dan titik (misal: "1.", "2.")
    // Jika ya, jadikan main-point. Jika tidak, jadikan sub-point.
    const isMainPoint = /^\d+\./.test(trimmed);
    
    result.push({
      isMain: isMainPoint,
      text: trimmed // Teks aslinya (berikut strip/angka) dibiarkan utuh
    });
  });
  
  return result;
});
</script>

<style scoped>
.dokumen-container { 
  font-family: Arial, sans-serif; color: #000; width: 100% !important; box-sizing: border-box !important; padding: 20px 40px; 
}
.document-title { 
  text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 35px; text-decoration: underline; letter-spacing: 1px; 
}

.dokumen-list { 
  margin-bottom: 60px; 
  padding-left: 10px;
}

/* Desain untuk Poin Utama (1., 2., dst) */
.main-point {
  font-size: 15px;
  font-weight: bold;
  margin-top: 18px;
  margin-bottom: 8px;
}

/* Desain untuk Sub Poin (berawalan -, a., dll) */
.sub-point {
  font-size: 15px;
  text-align: justify;
  line-height: 1.6;
  margin-bottom: 6px;
  padding-left: 20px; /* Membuat teks menjorok ke dalam (hanging indent) */
}

/* Blok Tanda Tangan */
.signature-section { display: flex; justify-content: space-between; margin-top: 50px; width: 100%; }
.signature-box { width: 45%; font-size: 14px; line-height: 1.5; }
.signature-box.left { text-align: left; }
.signature-box.right { text-align: left; padding-left: 10%; }
.signature-box p { margin: 2px 0; }
.bold-text { font-weight: bold; }
.underline-text { text-decoration: underline; }
.no-data-alert { padding: 25px; color: #666; font-style: italic; }
</style>