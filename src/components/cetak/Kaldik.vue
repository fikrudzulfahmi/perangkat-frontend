<template>
  <div class="kaldik-container">
    <div class="content-wrapper">
      <h2 class="document-title">KALENDER PENDIDIKAN</h2>

      <div v-if="pdfUrl" class="pdf-wrapper">
        <VuePdfEmbed :source="pdfUrl" class="pdf-render" />
      </div>
      
      <div v-else class="no-data-alert text-center">
        File PDF Kalender Pendidikan belum tersedia.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed'; // <-- Import library-nya

const props = defineProps({
  data: Array
});

const pdfUrl = computed(() => {
  if (props.data && props.data.length > 0 && props.data[0].file_pdf_url) {
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
  margin-bottom: 30px; 
  text-decoration: underline;
  letter-spacing: 1px;
}

.pdf-wrapper {
  width: 100%;
  /* Menghapus background gelap dan merapikan posisi */
  background: white; 
}

/* Mengatur agar gambar hasil render PDF lebarnya pas dengan kertas A4 */
.pdf-render {
  width: 100%;
  height: auto;
}

/* Jika PDF ada 2 halaman, ini akan memaksa agar gambar 
  tidak terpotong di tengah-tengah saat dicetak 
*/
:deep(.vue-pdf-embed > div) {
  margin-bottom: 20px;
  page-break-inside: avoid;
}

.no-data-alert { padding: 25px; color: #666; font-style: italic; }
</style>