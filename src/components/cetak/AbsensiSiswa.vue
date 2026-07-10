<template>
  <div class="absensi-container">
    <h2 class="document-title">DAFTAR HADIR SISWA</h2>

    <table class="identity-table">
      <tbody>
        <tr>
          <td class="label">Mata Pelajaran</td>
          <td class="separator">:</td>
          <td class="value">{{ guru?.mapel || '-' }}</td>
          <td class="label-right">Tahun Pelajaran</td>
          <td class="separator">:</td>
          <td class="value">{{ config?.tahun_pelajaran || (siswaData?.[0]?.tahun_pelajaran_id ? '2026/2027' : '-') }}</td>
        </tr>
        <tr>
          <td class="label">Kelas</td>
          <td class="separator">:</td>
          <td class="value">{{ guru?.kelas || siswaData?.[0]?.kelas?.nama_kelas || '-' }}</td>
          <td class="label-right">Bulan</td>
          <td class="separator">:</td>
          <td class="value">................................................</td>
        </tr>
      </tbody>
    </table>

    <table class="data-table">
      <thead>
        <tr>
          <th rowspan="2" class="col-no">No</th>
          <th rowspan="2" class="col-nis">NIS</th>
          <th rowspan="2" class="col-nama">Nama Siswa</th>
          <th colspan="16">Tanggal</th>
          <th colspan="3" class="col-ket">Ket</th>
        </tr>
        <tr>
          <th v-for="n in 16" :key="n" class="date-col p-0">
            <div class="date-header">
              <div>{{ n }}</div>
              <div class="date-header-bottom">{{ n + 16 <= 31 ? n + 16 : '' }}</div>
            </div>
          </th>
          <th class="ket-col">S</th>
          <th class="ket-col">I</th>
          <th class="ket-col">A</th>
        </tr>
      </thead>
      
      <tbody>
        <template v-if="!siswaData || siswaData.length === 0">
          <tr>
            <td colspan="22" class="text-center no-data">Data Siswa belum tersedia.</td>
          </tr>
        </template>
        
        <template v-else v-for="(siswa, index) in siswaData" :key="siswa.id">
          <tr>
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center font-bold">{{ formatNis(siswa.nis) }}</td>
            <td class="text-left nama-siswa" :title="siswa.nama_siswa">{{ siswa.nama_siswa }}</td>
            
            <td v-for="n in 16" :key="'date-'+n" class="date-cell"></td>
            
            <td class="date-cell"></td>
            <td class="date-cell"></td>
            <td class="date-cell"></td>
          </tr>
        </template>
      </tbody>
    </table>

    <div class="signature-section">
      <div class="signature-box right">
        <p>{{ config?.tempat_tanggal || '.................................., ....................' }}</p>
        <p>Guru Mata Pelajaran,</p>
        <br /><br />
        <p class="guru-name font-bold">{{ guru?.name || guru?.nama || '...................................................' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['config', 'guru', 'siswaData']);

// Fungsi memotong NIS: Ambil teks sebelum '/' lalu ambil 5 angka pertama
const formatNis = (nis) => {
  if (!nis) return '-';
  const sebelumGarisMiring = String(nis).split('/')[0];
  return sebelumGarisMiring.substring(0, 5);
};
</script>

<style scoped>
.absensi-container { 
  font-family: 'Times New Roman', Times, serif; 
  color: #000; 
  width: 100%; 
  page-break-inside: auto;
}

.document-title { 
  text-align: center; 
  font-size: 18px; 
  font-weight: bold; 
  margin-bottom: 15px; 
  text-decoration: underline;
}

/* Tabel Identitas (Atas) */
.identity-table { 
  width: 100%; 
  border-collapse: collapse; 
  margin-bottom: 10px; 
  font-size: 13px; 
}
.identity-table td { padding: 2px 0; vertical-align: top; }
.identity-table .label { width: 15%; font-weight: bold; }
.identity-table .separator { width: 2%; text-align: center; }
.identity-table .value { width: 33%; }
.identity-table .label-right { width: 20%; font-weight: bold; padding-left: 20px;}

/* Tabel Utama (Data Absensi) */
.data-table { 
  width: 100%; 
  border-collapse: collapse; 
  margin-top: 5px; 
  table-layout: fixed; 
}
/* 1. UBAH PADDING AGAR LEBIH RAPAT (Mengecilkan spasi atas-bawah teks) */
.data-table th, .data-table td { 
  border: 1px solid #000; 
  padding: 1px 2px;     /* <-- Ubah angka pertama (1px) untuk menipiskan baris */
  font-size: 11px; 
  vertical-align: middle; 
}

/* 2. KUNCI TINGGI BARIS SISWA DI SINI */
.data-table tbody td {
  height: 16px;         /* <-- Setel tinggi baris siswa (misal: 16px atau 18px sesuai kebutuhan) */
}

/* 3. TINGGI KOTAK ABSENSI (Sesuaikan dengan tinggi baris di atas) */
.date-cell { 
  height: 16px;         /* <-- Samakan nilainya dengan height di atas */
}
.data-table th { 
  background-color: #f5f5f5; 
  font-weight: bold; 
  text-align: center; 
}
.data-table thead { display: table-header-group; }
.data-table tr { page-break-inside: avoid; }

/* Proporsi Lebar Kolom yang Pas untuk Total 22 Kolom */
.col-no { width: 4%; }
.col-nis { width: 7%; }
.col-nama { width: 29%; }
.date-col { width: 3%; text-align: center; } 
.col-ket { width: 12%; } 
.ket-col { width: 4%; text-align: center; }

/* Header Tanggal Bertumpuk (1/17 dst) */
.p-0 { padding: 0 !important; }
.date-header {
  display: flex;
  flex-direction: column;
  font-size: 10px;
  line-height: 1.1;
}
.date-header div { padding: 2px 0; }
.date-header-bottom { border-top: 1px solid #000; }

/* Tinggi tipis kotak absen */
.date-cell { 
  height: 20px; 
}

.text-center { text-align: center; }
.text-left { text-align: left; }
.font-bold { font-weight: bold; }

/* Nama Siswa Rapat, 1 Baris & Auto Terpotong jika Kepanjangan */
.nama-siswa { 
  padding-left: 5px !important; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
}

.no-data { padding: 15px !important; font-style: italic; color: #555; font-size: 13px !important; }

/* Tanda Tangan */
.signature-section { 
  margin-top: 20px; 
  width: 100%; 
  display: flex; 
  justify-content: flex-end; 
  font-size: 13px;
}
.signature-box.right { 
  text-align: left; 
  width: 280px;
}
.signature-box p { 
  margin: 0 0 4px 0; 
}
.guru-name { text-decoration: underline; margin-bottom: 2px !important; }

/* Print Styles */
@media print {
  @page { size: auto; margin: 1.2cm; }
  .absensi-container { width: 100% !important; margin: 0 !important; }
}
</style>