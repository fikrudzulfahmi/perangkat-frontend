<template>
  <div class="modern-cover">
    <div class="side-accent-bar"></div>
    
    <div class="cover-content">
      <div class="top-tag text-uppercase">
        Dokumen Administrasi Akademik Kurikulum Merdeka
      </div>

      <div class="main-header">
        <h1 class="main-title">BUKU KERJA GURU</h1>
        <div class="accent-line"></div>
        <h2 class="sub-title text-uppercase">Perangkat Administrasi Pembelajaran</h2>
      </div>

      <div class="logo-wrapper">
        <div class="logo-inner-frame">
          <img src="/logo-sekolah.png" alt="LOGO SEKOLAH" class="school-logo" />
        </div>
      </div>

      <div class="meta-container">
        <div class="meta-grid">
          <div class="meta-label">NAMA GURU</div>
          <div class="meta-value">: {{ guru?.name || guru?.nama || '-' }}</div>

          <div class="meta-label">MATA PELAJARAN</div>
          <div class="meta-value">: {{ guru?.mapel || '-' }}</div>

          <div class="meta-label">KELAS / SEMESTER</div>
          <div class="meta-value">: {{ guru?.kelas || '-' }} / GASAL</div>

          <div class="meta-label">TAHUN PELAJARAN</div>
          <div class="meta-value">: {{ guru?.tahun_pelajaran || '-' }}</div>
        </div>
      </div>

      <div class="footer-identity">
        <p class="foundation-text">LEMBAGA PENDIDIKAN MA'ARIF NU KOTA BLITAR</p>
        <h2 class="school-name text-uppercase">{{ config?.nama_sekolah || 'SMKS ISLAM 1 KOTA BLITAR' }}</h2>
        <div class="school-divider"></div>
        <p class="school-address">Jl. Musi No. 6 Telp: (0342) 802137 Blitar, Jawa Timur</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Menerima kiriman data dari form kiri (config) dan data akun guru login (guru)
defineProps(['config', 'guru']);
</script>

<style scoped>
/* Desain Dasar Kertas A4 Cover */
.modern-cover {
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  background: #ffffff;
  color: #212529;
  font-family: 'Times New Roman', Times, serif;
}

/* Ornamen Garis Hijau Vertikal di Sisi Kiri */
.side-accent-bar {
  width: 16px;
  background: #1b4332; /* Hijau botol tua mewah */
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.cover-content {
  flex: 1;
  padding: 20mm 15mm 15mm 25mm; /* Left margin dilebihkan untuk jilid/staples */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Menggunakan rata kiri modern */
  justify-content: space-between;
  height: 100%;
  box-sizing: border-box;
}

/* Tag Atas */
.top-tag {
  font-size: 13px;
  font-family: sans-serif;
  letter-spacing: 2px;
  color: #6c757d;
  font-weight: 600;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 8px;
  width: 100%;
}

/* Judul Utama */
.main-header {
  margin-top: 20px;
  width: 100%;
}

.main-title {
  font-size: 46px;
  font-weight: 800;
  color: #1b4332;
  margin: 0;
  letter-spacing: 1px;
  line-height: 1.1;
}

.accent-line {
  width: 120px;
  height: 5px;
  background: #40916c; /* Aksen hijau sekunder */
  margin: 15px 0;
}

.sub-title {
  font-size: 18px;
  font-family: sans-serif;
  letter-spacing: 3px;
  color: #495057;
  font-weight: 700;
  margin: 0;
}

/* Container Logo */
.logo-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.logo-inner-frame {
  padding: 15px;
  border: 1px solid #e9ecef;
  border-radius: 50%;
  box-shadow: 0 10px 25px rgba(0,0,0,0.03);
  background: #fff;
}

.school-logo {
  width: 150px;
  height: auto;
  display: block;

  transition: 0.3s;
}

/* Meta Data Grid System */
.meta-container {
  width: 100%;
  background: #f8f9fa;
  border-left: 4px solid #1b4332;
  padding: 25px 30px;
  border-radius: 0 8px 8px 0;
  box-sizing: border-box;
}

.meta-grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  row-gap: 14px;
  font-size: 16px;
  font-weight: bold;
}

.meta-label {
  font-family: sans-serif;
  font-size: 13px;
  letter-spacing: 1.5px;
  color: #6c757d;
  display: flex;
  align-items: center;
}

.meta-value {
  color: #1a1a1a;
  font-size: 18px;
}

/* Footer Identitas Sekolah */
.footer-identity {
  width: 100%;
  text-align: center;
  margin-top: auto;
  padding-top: 30px;
}

.foundation-text {
  font-family: sans-serif;
  font-size: 14px;
  letter-spacing: 2px;
  color: #495057;
  margin: 0 0 5px 0;
  font-weight: 600;
}

.school-name {
  font-size: 26px;
  font-weight: 800;
  color: #1b4332;
  margin: 0;
  letter-spacing: 1px;
}

.school-divider {
  width: 60px;
  height: 2px;
  background: #212529;
  margin: 12px auto;
}

.school-address {
  font-size: 13px;
  color: #6c757d;
  margin: 0;
  font-style: italic;
}

/* UTURAN PRINT */
@media print {
  .modern-cover {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>