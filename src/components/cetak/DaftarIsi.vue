<template>
  <div class="daftar-isi-container">
    <div class="header-cetak">
      <h2 class="title-main">DAFTAR ISI</h2>
      <hr class="line-title" />
    </div>

    <div class="content-list">
      <div class="item-row header-row" v-if="show.cover">
        <span class="label-text">SAMPUL / COVER UTAMA BUKU KERJA</span>
        <span class="dots"></span>
        <span class="page-number">i</span>
      </div>
      <div class="item-row header-row" v-if="show.daftar_isi">
        <span class="label-text">DAFTAR ISI</span>
        <span class="dots"></span>
        <span class="page-number">ii</span>
      </div>

      <div class="buku-group" v-if="show.sekat1 || show.cp || show.atp || show.modul_ajar || show.kktp">
        <h4 class="group-title">📘 BUKU KERJA I</h4>
        
        <div class="item-row" v-if="show.sekat1">
          <span class="label-text">Sekat Cover Buku Kerja 1</span>
          <span class="dots"></span>
          <span class="page-number">{{ pageNumbers.sekat1 }}</span>
        </div>
        <div class="item-row" v-if="show.cp">
          <span class="label-text">1.1 Capaian Pembelajaran (CP)</span>
          <span class="dots"></span>
          <span class="page-number">{{ pageNumbers.cp }}</span>
        </div>
        <div class="item-row" v-if="show.atp">
          <span class="label-text">1.2 Tujuan Pembelajaran (TP) & Alur Tujuan Pembelajaran (ATP)</span>
          <span class="dots"></span>
          <span class="page-number">{{ pageNumbers.atp }}</span>
        </div>
        <div class="item-row" v-if="show.modul_ajar">
          <span class="label-text">1.3 Modul Ajar (MA) / Rencana Pelaksanaan Pembelajaran (RPP)</span>
          <span class="dots"></span>
          <span class="page-number">{{ pageNumbers.modul_ajar }}</span>
        </div>
        <div class="item-row" v-if="show.kktp">
          <span class="label-text">1.4 Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)</span>
          <span class="dots"></span>
          <span class="page-number">{{ pageNumbers.kktp }}</span>
        </div>
      </div>

      <div class="buku-group" v-if="show.sekat2 || show.kode_etik || show.ikrar_guru || show.tata_tertib || show.pembiasaan || show.kaldik || show.rpe || show.prota || show.prosem || show.jurnal_agenda">
        <h4 class="group-title">📗 BUKU KERJA II</h4>
        <div class="item-row" v-if="show.sekat2"><span class="label-text">Sekat Cover Buku Kerja 2</span><span class="dots"></span><span class="page-number">{{ pageNumbers.sekat2 }}</span></div>
        <div class="item-row" v-if="show.kode_etik"><span class="label-text">2.1 Kode Etik Guru</span><span class="dots"></span><span class="page-number">{{ pageNumbers.kode_etik }}</span></div>
        <div class="item-row" v-if="show.ikrar_guru"><span class="label-text">2.2 Ikrar Guru</span><span class="dots"></span><span class="page-number">{{ pageNumbers.ikrar_guru }}</span></div>
        <div class="item-row" v-if="show.tata_tertib"><span class="label-text">2.3 Tata Tertib Guru</span><span class="dots"></span><span class="page-number">{{ pageNumbers.tata_tertib }}</span></div>
        <div class="item-row" v-if="show.pembiasaan"><span class="label-text">2.4 Pembiasaan Guru</span><span class="dots"></span><span class="page-number">{{ pageNumbers.pembiasaan }}</span></div>
        <div class="item-row" v-if="show.kaldik"><span class="label-text">2.5 Kalender Pendidikan (Kaldik) Sekolah</span><span class="dots"></span><span class="page-number">{{ pageNumbers.kaldik }}</span></div>
        <div class="item-row" v-if="show.rpe"><span class="label-text">2.6 Rincian Pekan Efektif (RPE) / Alokasi Waktu</span><span class="dots"></span><span class="page-number">{{ pageNumbers.rpe }}</span></div>
        <div class="item-row" v-if="show.prota"><span class="label-text">2.7 Program Tahunan (Prota)</span><span class="dots"></span><span class="page-number">{{ pageNumbers.prota }}</span></div>
        <div class="item-row" v-if="show.prosem"><span class="label-text">2.8 Program Semester (Prosem)</span><span class="dots"></span><span class="page-number">{{ pageNumbers.prosem }}</span></div>
        <div class="item-row" v-if="show.jurnal_agenda"><span class="label-text">2.9 Jurnal Agenda Mengajar Guru</span><span class="dots"></span><span class="page-number">{{ pageNumbers.jurnal_agenda }}</span></div>
      </div>

      <div class="buku-group" v-if="show.sekat3 || show.jadwal_blok || show.absensi || show.daftar_nilai || show.analisis_belajar || show.daya_serap || show.remedial_pengayaan || show.buku_pegangan || show.kumpulan_soal || show.analisis_butir || show.rekomendasi_soal">
        <h4 class="group-title">📙 BUKU KERJA III</h4>
        <div class="item-row" v-if="show.sekat3"><span class="label-text">Sekat Cover Buku Kerja 3</span><span class="dots"></span><span class="page-number">{{ pageNumbers.sekat3 }}</span></div>
        <div class="item-row" v-if="show.jadwal_blok"><span class="label-text">3.1 Jadwal Mengajar Guru (Sistem Blok)</span><span class="dots"></span><span class="page-number">{{ pageNumbers.jadwal_blok }}</span></div>
        <div class="item-row" v-if="show.absensi"><span class="label-text">3.2 Daftar Hadir / Absensi Siswa per Kelas</span><span class="dots"></span><span class="page-number">{{ pageNumbers.absensi }}</span></div>
        <div class="item-row" v-if="show.daftar_nilai"><span class="label-text">3.3 Daftar Nilai Siswa</span><span class="dots"></span><span class="page-number">{{ pageNumbers.daftar_nilai }}</span></div>
        <div class="item-row" v-if="show.analisis_belajar"><span class="label-text">3.4 Analisis Hasil Belajar / Analisis Hasil Ulangan</span><span class="dots"></span><span class="page-number">{{ pageNumbers.analisis_belajar }}</span></div>
        <div class="item-row" v-if="show.daya_serap"><span class="label-text">3.5 Lembar Daya Serap Siswa (Klasikal & Perorangan)</span><span class="dots"></span><span class="page-number">{{ pageNumbers.daya_serap }}</span></div>
        <div class="item-row" v-if="show.remedial_pengayaan"><span class="label-text">3.6 Program Remedial (Perbaikan) & Pengayaan</span><span class="dots"></span><span class="page-number">{{ pageNumbers.remedial_pengayaan }}</span></div>
        <div class="item-row" v-if="show.buku_pegangan"><span class="label-text">3.7 Daftar Buku Pegangan Guru & Buku Paket Siswa</span><span class="dots"></span><span class="page-number">{{ pageNumbers.buku_pegangan }}</span></div>
        <div class="item-row" v-if="show.kumpulan_soal"><span class="label-text">3.8 Kumpulan Kisi-Kisi, Naskah Soal, Kunci Jawaban & Rubrik</span><span class="dots"></span><span class="page-number">{{ pageNumbers.kumpulan_soal }}</span></div>
        <div class="item-row" v-if="show.analisis_butir"><span class="label-text">3.9 Analisis Butir Soal (Tingkat Kesukaran & Daya Pembeda)</span><span class="dots"></span><span class="page-number">{{ pageNumbers.analisis_butir }}</span></div>
        <div class="item-row" v-if="show.rekomendasi_soal"><span class="label-text">3.10 Perbaikan / Rekomendasi Soal</span><span class="dots"></span><span class="page-number">{{ pageNumbers.rekomendasi_soal }}</span></div>
      </div>

      <div class="buku-group" v-if="show.sekat4 || show.evaluasi_diri || show.tindak_lanjut">
        <h4 class="group-title">📕 BUKU KERJA IV</h4>
        <div class="item-row" v-if="show.sekat4"><span class="label-text">Sekat Cover Buku Kerja 4</span><span class="dots"></span><span class="page-number">{{ pageNumbers.sekat4 }}</span></div>
        <div class="item-row" v-if="show.evaluasi_diri"><span class="label-text">4.1 Format Evaluasi Diri Guru (PKG / SKP)</span><span class="dots"></span><span class="page-number">{{ pageNumbers.evaluasi_diri }}</span></div>
        <div class="item-row" v-if="show.tindak_lanjut"><span class="label-text">4.2 Program Tindak Lanjut Kerja Guru</span><span class="dots"></span><span class="page-number">{{ pageNumbers.tindak_lanjut }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Cukup terima props pageNumbers dari induk, hapus import computed yang lama
defineProps(['config', 'show', 'pageNumbers']);
</script>

<style scoped>
.daftar-isi-container {
  padding: 10px 15px;
  font-family: 'Times New Roman', Times, serif;
  color: #000;
}

.header-cetak {
  text-align: center;
  margin-bottom: 35px;
}

.title-main {
  font-size: 26px;
  font-weight: bold;
  letter-spacing: 2px;
  margin: 0;
}

.line-title {
  border: none;
  border-top: 2px solid #000;
  width: 25%;
  margin: 8px auto 0 auto;
}

.content-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.buku-group {
  margin-top: 15px;
}

.group-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0 8px 0;
  text-transform: uppercase;
}

.item-row {
  display: flex;
  align-items: flex-end;
  font-size: 15px;
  margin-bottom: 5px;
  padding-left: 15px;
}

.header-row {
  padding-left: 0;
  font-weight: bold;
}

.label-text {
  white-space: nowrap;
}

.dots {
  flex: 1;
  border-bottom: 2px dotted #444;
  margin: 0 10px 4px 10px;
}

.page-number {
  text-align: right;
  min-width: 30px;
  font-weight: bold;
}
</style>