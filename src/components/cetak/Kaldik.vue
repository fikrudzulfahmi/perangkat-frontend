<template>
  <div class="kaldik-container">
    <div class="content-wrapper">
      <h2 class="document-title">KALENDER PENDIDIKAN</h2>

      <div v-if="pdfUrl" class="pdf-wrapper">
        <!-- Alert ini hanya tampil di layar, akan hilang otomatis saat di-print -->
        <div class="print-warning no-print">
          <strong>Penting:</strong> Di bawah ini adalah file PDF. Jika saat dicetak halamannya terpotong/kosong, silakan 
          <a :href="pdfUrl" target="_blank" rel="noopener noreferrer">Buka dan Cetak PDF Terpisah Di Sini</a>.
        </div>

        <iframe :src="pdfUrl" class="pdf-iframe" frameborder="0"></iframe>
      </div>
      
      <div v-else class="no-data-alert text-center">
        File PDF Kalender Pendidikan belum tersedia.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: Array // Karena JSON data Anda berupa Array
});

// Mengambil URL PDF dari elemen pertama array (karena url-nya sama di semua index)
const pdfUrl = computed(() => {
  if (props.data && props.data.length > 0 && props.data[0].file_pdf_url) {
    // Sesuaikan URL Backend Anda jika file_pdf_url hanya path relatif
    const baseUrl = 'https://api-perangkat.ingintau.my.id'; 
    return baseUrl + props.data[0].file_pdf_url;
  }
  return null;
});
</script>

<style scoped>
.kaldik-container {
  width: 100% !important;
  box-sizing: border-box !important;
  padding: 20px 40px;
}
.document-title {
  text-align: center; 
  font-size: 18px; 
  font-weight: bold; 
  margin-bottom: 20px; 
  text-decoration: underline;
  letter-spacing: 1px;
}
.pdf-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* Memaksa iframe tinggi agar PDF terlihat. (Terpotong saat print adalah risiko browser) */
.pdf-iframe {
  width: 100%;
  height: 1100px; 
}
.print-warning {
  background-color: #fff3cd;
  color: #856404;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
  width: 100%;
  text-align: center;
  font-size: 14px;
  border: 1px solid #ffeeba;
}
.no-data-alert { padding: 25px; color: #666; font-style: italic; }

/* Menyembunyikan elemen peringatan saat masuk ke mode print (kertas) */
@media print {
  .no-print { display: none !important; }
}
</style>