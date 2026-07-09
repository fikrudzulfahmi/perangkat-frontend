<template>
  <div class="jadwal-container">
    <h2 class="document-title">JADWAL MENGAJAR GURU</h2>

    <table class="identity-table">
      <tbody>
        <tr>
          <td class="cell-label">Nama Guru</td>
          <td class="cell-separator">:</td>
          <td class="font-bold">{{ guru?.name || guru?.nama || '-' }}</td>
        </tr>
        <tr>
          <td class="cell-label">Tahun Pelajaran</td>
          <td class="cell-separator">:</td>
          <td>{{ jadwalData?.[0]?.tahun_pelajaran?.nama || '2025/2026' }}</td>
        </tr>
      </tbody>
    </table>

    <table class="jadwal-table">
      <thead>
        <tr>
          <th style="width: 10%;">Hari / Jam</th>
          <th v-for="jam in 10" :key="jam" style="width: 9%;">{{ jam }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!jadwalMatrix || jadwalMatrix.length === 0">
          <td colspan="11" class="text-center no-data">Data Jadwal Mengajar belum tersedia.</td>
        </tr>
        
        <tr v-else v-for="baris in jadwalMatrix" :key="baris.hari">
          <td class="bold-text text-center bg-gray">{{ baris.hari }}</td>
          
          <td 
            v-for="(cell, idx) in baris.cells" 
            :key="idx" 
            :colspan="cell.colspan"
            :class="{ 'bg-mapel': cell.isClass, 'empty-cell': !cell.isClass }"
          >
            <div v-if="cell.isClass" class="class-info">
              <span class="mapel-name">{{ cell.mapel }}</span>
              
              <span v-for="(kb, i) in cell.listKelasBlok" :key="i" class="kelas-name">
                {{ kb }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['config', 'guru', 'jadwalData']);

// Daftar hari sekolah
const hariSekolah = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

// Algoritma untuk mengubah data per-jam menjadi Matrix Colspan
const jadwalMatrix = computed(() => {
  if (!props.jadwalData || props.jadwalData.length === 0) return [];

  // 1. Parsing "jam_ke" ("3-8") menjadi start dan end
  const parsedData = props.jadwalData.map(item => {
    let start = 1;
    let end = 1;
    if (item.jam_ke) {
      const parts = item.jam_ke.split('-');
      start = parseInt(parts[0]) || 1;
      end = parts.length > 1 ? parseInt(parts[1]) || start : start;
    }
    return { ...item, start, end };
  });

  const matrix = [];

  // 2. Susun data berdasarkan hari
  hariSekolah.forEach(hari => {
    const jadwalHariIni = parsedData
      .filter(s => s.hari === hari)
      .sort((a, b) => a.start - b.start);
      
    const cells = [];
    let currentHour = 1;

    // Periksa sel dari jam 1 sampai 10
    while (currentHour <= 10) {
      const jadwalAktif = jadwalHariIni.filter(s => s.start === currentHour);

      if (jadwalAktif.length > 0) {
        const endHour = jadwalAktif[0].end;
        const colspan = (endHour - currentHour) + 1;
        
        // --- FORMAT KELAS DAN BLOK ---
        // Membuat format array seperti: ["12 TSM 3 (Blok 1)", "12 TSM 4 (Blok 2)"]
        const kombinasiKelasBlok = jadwalAktif.map(s => {
          const kls = s.kelas?.nama || '';
          const blk = s.blok || '';
          if (kls && blk) return `${kls} (${blk})`;
          return kls || blk || '';
        }).filter(Boolean); // Buang yang kosong
        
        const namaMapel = jadwalAktif[0].mapel?.nama || '-';

        cells.push({
          isClass: true,
          colspan: colspan,
          listKelasBlok: kombinasiKelasBlok,
          mapel: namaMapel,
        });
        
        currentHour = endHour + 1;
      } else {
        // Jika kosong, cari pelajaran terdekat
        const jadwalSelanjutnya = jadwalHariIni.filter(s => s.start > currentHour);
        const nextStart = jadwalSelanjutnya.length > 0 
          ? Math.min(...jadwalSelanjutnya.map(s => s.start)) 
          : 11;
          
        const colspanKosong = nextStart - currentHour;
        
        if (colspanKosong > 0) {
          cells.push({
            isClass: false,
            colspan: colspanKosong
          });
        }
        
        currentHour = nextStart;
      }
    }

    matrix.push({ hari, cells });
  });

  return matrix;
});
</script>

<style scoped>
.jadwal-container { font-family: Arial, sans-serif; color: #000; width: 100%; margin-top: 15px;}
.document-title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 25px; text-transform: uppercase; }

/* Desain Tabel Profil Identitas */
.identity-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
.identity-table td { border: 1px solid #b3b3b3; padding: 6px 12px; font-size: 14px; }
.identity-table .cell-label { width: 20%; font-weight: bold; background-color: #f5f5f5; }
.identity-table .cell-separator { width: 3%; text-align: center; background-color: #f5f5f5; }

/* Desain Tabel Utama Matrix */
.jadwal-table { 
  width: 100%; 
  border-collapse: collapse; 
  page-break-inside: auto; 
}

.jadwal-table th { background-color: #f5f5f5; border: 1px solid #000; padding: 10px 5px; font-size: 14px; font-weight: bold; text-align: center; }
.jadwal-table td { border: 1px solid #000; padding: 4px; height: 60px; vertical-align: middle; }

.jadwal-table thead { display: table-header-group; }
.jadwal-table tr { page-break-inside: avoid; break-inside: avoid; }

.text-center { text-align: center; }
.bold-text { font-weight: bold; }
.bg-gray { background-color: #f5f5f5; font-size: 13px; }

/* Desain untuk kotak yang ada isinya */
.bg-mapel { 
  background-color: #e8f5e9;
  text-align: center; 
}

.empty-cell {
  background-color: #fff;
}

/* Penataan isi kotak (Mapel dan Kelas) */
.class-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.4;
}

.mapel-name {
  font-weight: bold;
  font-size: 11px;
  color: #124d29;
  margin-bottom: 4px;
}

.kelas-name {
  font-weight: bold;
  font-size: 12px;
  color: #000;
}

.no-data { padding: 25px; color: #666; font-style: italic; font-size: 14px;}
</style>

<style>
@media print {
  table { page-break-inside: auto !important; width: 100% !important; }
  tr, td, th { page-break-inside: avoid !important; page-break-after: auto !important; }
  thead { display: table-header-group !important; }
  
  .bg-mapel {
    background-color: #e8f5e9 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .bg-gray {
    background-color: #f5f5f5 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>