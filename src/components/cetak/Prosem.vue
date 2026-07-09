<template>
  <div class="prosem-wrapper">
    
    <section class="page-landscape break-before">
      <div class="kop-judul text-center mb-4">
        <h3 class="font-bold">PROGRAM SEMESTER (PROSEM)</h3>
        <h4 class="font-bold">SEMESTER GANJIL - TAHUN PELAJARAN {{ identity?.tahun_pelajaran || '202X/202X' }}</h4>
      </div>

      <div class="info-doc mb-3">
        <table class="identity-table">
          <tr>
            <td width="120">Mata Pelajaran</td>
            <td width="10">:</td>
            <td class="font-bold">{{ identity?.mapel || '-' }}</td>
            <td width="50"></td>
            <td width="100">Fase / Kelas</td>
            <td width="10">:</td>
            <td>{{ identity?.fase || '-' }} / {{ identity?.kelas || '-' }}</td>
          </tr>
          <tr>
            <td>Guru Pengampu</td>
            <td>:</td>
            <td>{{ identity?.name || '-' }}</td>
            <td></td>
            <td>Alokasi Waktu</td>
            <td>:</td>
            <td>{{ prosemData?.jp_per_minggu || 0 }} JP / Minggu</td>
          </tr>
        </table>
      </div>

      <div class="table-responsive">
        <table class="table-prosem">
          <thead>
            <tr>
              <th rowspan="2" width="2%">No</th>
              <th rowspan="2" width="10%">Elemen</th>
              <th rowspan="2" width="6%">Kode</th>
              <th rowspan="2" width="28%">Tujuan Pembelajaran (TP)</th>
              <th rowspan="2" width="4%">Jml JP</th>
              <th colspan="5">JULI</th>
              <th colspan="5">AGUSTUS</th>
              <th colspan="5">SEPTEMBER</th>
              <th colspan="5">OKTOBER</th>
              <th colspan="5">NOVEMBER</th>
              <th colspan="5">DESEMBER</th>
            </tr>
            <tr class="week-row">
              <th v-for="i in 5" :key="'jul'+i">{{ i }}</th>
              <th v-for="i in 5" :key="'agu'+i">{{ i }}</th>
              <th v-for="i in 5" :key="'sep'+i">{{ i }}</th>
              <th v-for="i in 5" :key="'okt'+i">{{ i }}</th>
              <th v-for="i in 5" :key="'nov'+i">{{ i }}</th>
              <th v-for="i in 5" :key="'des'+i">{{ i }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tp, index) in dataProsemGanjil" :key="index">
              <td class="text-center">{{ index + 1 }}</td>
              <td>{{ tp.elemen || '-' }}</td>
              <td class="text-center font-bold">{{ tp.kode_tp || '-' }}</td>
              <td class="text-justify">{{ tp.deskripsi || '-' }}</td>
              <td class="text-center font-bold">{{ getTotalJp(tp.id, 'ganjil') }}</td>
              
              <template v-for="bulan in [7,8,9,10,11,12]" :key="'bg-'+bulan">
                <td v-for="minggu in 5" :key="'mg-'+bulan+'-'+minggu" class="text-center cell-minggu" :class="{'has-value': getJpValue(tp.id, bulan, minggu)}">
                  {{ getJpValue(tp.id, bulan, minggu) }}
                </td>
              </template>
            </tr>
            <tr v-if="dataProsemGanjil.length === 0">
              <td colspan="35" class="text-center text-muted py-3">Tidak ada data Tujuan Pembelajaran untuk Semester Ganjil</td>
            </tr>
          </tbody>
        </table>
      </div>


    </section>

    <section class="page-landscape break-before">
      <div class="kop-judul text-center mb-4">
        <h3 class="font-bold">PROGRAM SEMESTER (PROSEM)</h3>
        <h4 class="font-bold">SEMESTER GENAP - TAHUN PELAJARAN {{ identity?.tahun_pelajaran || '202X/202X' }}</h4>
      </div>

      <div class="info-doc mb-3">
        <table class="identity-table">
          <tr>
            <td width="120">Mata Pelajaran</td>
            <td width="10">:</td>
            <td class="font-bold">{{ identity?.mapel || '-' }}</td>
            <td width="50"></td>
            <td width="100">Fase / Kelas</td>
            <td width="10">:</td>
            <td>{{ identity?.fase || '-' }} / {{ identity?.kelas || '-' }}</td>
          </tr>
          <tr>
            <td>Guru Pengampu</td>
            <td>:</td>
            <td>{{ identity?.name || '-' }}</td>
            <td></td>
            <td>Alokasi Waktu</td>
            <td>:</td>
            <td>{{ prosemData?.jp_per_minggu || 0 }} JP / Minggu</td>
          </tr>
        </table>
      </div>

      <div class="table-responsive">
        <table class="table-prosem">
          <thead>
            <tr>
              <th rowspan="2" width="2%">No</th>
              <th rowspan="2" width="10%">Elemen</th>
              <th rowspan="2" width="6%">Kode</th>
              <th rowspan="2" width="28%">Tujuan Pembelajaran (TP)</th>
              <th rowspan="2" width="4%">Jml JP</th>
              <th colspan="5">JANUARI</th>
              <th colspan="5">FEBRUARI</th>
              <th colspan="5">MARET</th>
              <th colspan="5">APRIL</th>
              <th colspan="5">MEI</th>
              <th colspan="5">JUNI</th>
            </tr>
            <tr class="week-row">
              <th v-for="i in 5" :key="'jan'+i">{{ i }}</th>
              <th v-for="i in 5" :key="'feb'+i">{{ i }}</th>
              <th v-for="i in 5" :key="'mar'+i">{{ i }}</th>
              <th v-for="i in 5" :key="'apr'+i">{{ i }}</th>
              <th v-for="i in 5" :key="'mei'+i">{{ i }}</th>
              <th v-for="i in 5" :key="'jun'+i">{{ i }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tp, index) in dataProsemGenap" :key="index">
              <td class="text-center">{{ index + 1 }}</td>
              <td>{{ tp.elemen || '-' }}</td>
              <td class="text-center font-bold">{{ tp.kode_tp || '-' }}</td>
              <td class="text-justify">{{ tp.deskripsi || '-' }}</td>
              <td class="text-center font-bold">{{ getTotalJp(tp.id, 'genap') }}</td>
              
              <template v-for="bulan in [1,2,3,4,5,6]" :key="'bg-'+bulan">
                <td v-for="minggu in 5" :key="'mg-'+bulan+'-'+minggu" class="text-center cell-minggu" :class="{'has-value': getJpValue(tp.id, bulan, minggu)}">
                  {{ getJpValue(tp.id, bulan, minggu) }}
                </td>
              </template>
            </tr>
            <tr v-if="dataProsemGenap.length === 0">
              <td colspan="35" class="text-center text-muted py-3">Tidak ada data Tujuan Pembelajaran untuk Semester Genap</td>
            </tr>
          </tbody>
        </table>
      </div>


    </section>

  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  prosemData: {
    type: Object,
    default: () => ({})
  },
  identity: {
    type: Object,
    default: () => ({})
  },
  settingCetak: {
    type: Object,
    default: () => ({})
  }
});

// Format Tanggal Cetak
const tanggalCetak = computed(() => {
  const date = new Date();
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
});

// 1. Ratakan (Flatten) Semua TP dari struktur "list_cp" ke dalam satu array
const allTPs = computed(() => {
  if (!props.prosemData || !props.prosemData.list_cp) return [];
  let tps = [];
  props.prosemData.list_cp.forEach(cp => {
    if (cp.list_tp) {
      cp.list_tp.forEach(tp => {
        tps.push({ ...tp, elemen: cp.elemen }); // Membawa nama elemen dari CP-nya
      });
    }
  });
  return tps;
});

// 2. Mendeteksi sebuah TP masuk Ganjil / Genap berdasarkan plotting bulannya
const getSemesterForTp = (tpId) => {
  if (!props.prosemData || !props.prosemData.saved_prosem) return 'ganjil'; // default
  
  const saved = props.prosemData.saved_prosem.filter(s => String(s.tujuan_pembelajaran_id) === String(tpId));
  if (saved.length === 0) return 'ganjil'; // default jika belum diplot
  
  const firstMonth = parseInt(saved[0].bulan);
  // Jika pertama kali diajarkan di bulan 1 s/d 6, masuk Genap
  if (firstMonth >= 1 && firstMonth <= 6) return 'genap';
  
  return 'ganjil';
};

// 3. Filter TP khusus Ganjil
const dataProsemGanjil = computed(() => {
  return allTPs.value.filter(tp => getSemesterForTp(tp.id) === 'ganjil');
});

// 4. Filter TP khusus Genap
const dataProsemGenap = computed(() => {
  return allTPs.value.filter(tp => getSemesterForTp(tp.id) === 'genap');
});

// 5. Mengambil Alokasi JP untuk Bulan & Minggu Tertentu
const getJpValue = (tpId, bulan, minggu) => {
  if (!props.prosemData || !props.prosemData.saved_prosem) return '';
  const match = props.prosemData.saved_prosem.find(item => 
    String(item.tujuan_pembelajaran_id) === String(tpId) &&
    String(item.bulan) === String(bulan) &&
    String(item.minggu_ke) === String(minggu)
  );
  return match ? match.alokasi_jp : '';
};

// 6. Menghitung Total JP per TP
const getTotalJp = (tpId, semester) => {
  if (!props.prosemData || !props.prosemData.saved_prosem) return 0;
  
  const validMonths = semester === 'ganjil' ? ['7','8','9','10','11','12'] : ['1','2','3','4','5','6'];
  return props.prosemData.saved_prosem
    .filter(item => String(item.tujuan_pembelajaran_id) === String(tpId) && validMonths.includes(String(item.bulan)))
    .reduce((sum, item) => sum + Number(item.alokasi_jp || 0), 0);
};
</script>

<style scoped>
/* KONFIGURASI KERTAS POTRET (BERDIRI) DI LAYAR PREVIEW */
.page-landscape {
  background: white;
  width: 210mm;      /* Lebar Kertas A4 Potret */
  min-height: 297mm; /* Tinggi Kertas A4 Potret */
  padding: 15mm 20mm;
  margin: 0 auto 25px auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  box-sizing: border-box;
  font-family: 'Times New Roman', Times, serif;
  color: #000;
}

/* Tipografi & Spasi */
.text-center { text-align: center; }
.text-justify { text-align: justify; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mt-5 { margin-top: 3rem; }
.py-3 { padding-top: 1rem; padding-bottom: 1rem; }
.font-bold { font-weight: bold; }
.underline { text-decoration: underline; }
.text-muted { color: #6c757d; }

.kop-judul h3 {
  font-size: 16px;
  margin: 0 0 5px 0;
  text-transform: uppercase;
}
.kop-judul h4 {
  font-size: 14px;
  margin: 0;
  text-transform: uppercase;
}

/* Tabel Identitas */
.identity-table {
  width: 100%;
  font-size: 12px;
  border: none;
}
.identity-table td {
  padding: 3px 0;
  vertical-align: top;
}

/* Tabel Prosem Utama */
.table-responsive {
  width: 100%;
}

.table-prosem {
  width: 100%;
  border-collapse: collapse;
  font-size: 9px; /* Diperkecil lagi karena mode Potret akan sangat sempit untuk 35 kolom */
}

.table-prosem th, 
.table-prosem td {
  border: 1px solid #000;
  padding: 4px 3px;
  vertical-align: middle;
}

.table-prosem thead th {
  text-align: center;
  background-color: #f8f9fa;
  font-weight: bold;
}

.table-prosem .week-row th {
  padding: 3px 1px;
  font-size: 8px; /* Diperkecil untuk memuat angka minggu di mode potret */
}

/* Cell khusus grid minggu */
.cell-minggu {
  width: 12px;
  font-size: 9px;
}

/* Warnai hijau lembut jika ada plotting JP */
.has-value {
  background-color: #d4edda !important; 
  color: #000;
  font-weight: bold;
}

/* Tanda Tangan */
.signature-area {
  font-size: 12px;
  page-break-inside: avoid;
}
.signature-area p {
  margin: 0 0 4px 0;
}

/* KONFIGURASI CSS SAAT DICETAK (PRINT) */
@media print {
  @page {
    size: A4 portrait; /* Memaksa browser mencetak dalam format Potret */
    margin: 10mm;      /* Margin sedikit dikecilkan agar tabel 35 kolom bisa muat */
  }

  .page-landscape {
    width: 100% !important;
    height: auto !important;
    min-height: 0 !important; /* KUNCI PERBAIKAN: Menghapus batas tinggi agar tidak overflow memicu halaman kosong */
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    border: none !important;
  }

  .break-before {
    page-break-before: always !important;
    break-before: page !important;
  }

  /* Menghindari baris tabel terpotong di tengah halaman */
  .table-prosem tr {
    page-break-inside: avoid !important;
  }
}
</style>