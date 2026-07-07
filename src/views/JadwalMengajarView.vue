<template>
  <div>
    <div class="card-box" style="margin-bottom: 20px; background-color: #1E5631; color: white;">
      <h2 style="margin: 0; color: #FBC02D;"><i class="fa-solid fa-calendar-days"></i> Plotting Jadwal Mengajar (Sistem Blok)</h2>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #FFE0B2;">
        Atur dan pasangkan jadwal mengajar Guru berdasarkan Blok 1 dan Blok 2 per Tahun Pelajaran.
      </p>
    </div>

    <div class="card-box" style="margin-bottom: 25px;">
      <h3 style="margin-top: 0; color: #1E5631; border-bottom: 1px solid #FFE0B2; padding-bottom: 8px;">
        <i class="fa-solid fa-plus"></i> {{ isEditMode ? 'Edit Slot Jadwal' : 'Tambah Slot Jadwal Baru' }}
      </h3>
      
      <form @submit.prevent="simpanJadwal" class="grid-form">
        <div class="input-group">
          <label>Tahun Pelajaran</label>
          <select v-model="form.tahun_pelajaran_id" required>
  <option value="">-- Pilih Tahun Pelajaran --</option>
  <option v-for="tp in listTahunPelajaran" :key="tp.id" :value="tp.id">
    {{ tp.nama_tahun }} </option>
</select>
        </div>

        <div class="input-group">
          <label>Guru Pengajar</label>
          <select v-model="form.guru_id" required>
            <option value="">-- Pilih Guru --</option>
            <option v-for="g in listGuru" :key="g.id" :value="g.id">{{ g.name }}</option>
          </select>
        </div>

        <div class="input-group">
          <label>Mata Pelajaran</label>
          <select v-model="form.mata_pelajaran_id" required>
            <option value="">-- Pilih Mapel --</option>
            <option v-for="m in listMapel" :key="m.id" :value="m.id">
              {{ m.nama || m.nama_mapel }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <label>Kelas</label>
          <select v-model="form.kelas_id" required>
            <option value="">-- Pilih Kelas --</option>
            <option v-for="k in listKelas" :key="k.id" :value="k.id">
              {{ k.nama || k.nama_kelas }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <label>Hari</label>
          <select v-model="form.hari" required>
            <option value="">-- Pilih Hari --</option>
            <option value="Senin">Senin</option>
            <option value="Selasa">Selasa</option>
            <option value="Rabu">Rabu</option>
            <option value="Kamis">Kamis</option>
            <option value="Jumat">Jumat</option>
            <option value="Sabtu">Sabtu</option>
          </select>
        </div>

        <div class="input-group">
          <label>Jam Ke</label>
          <input v-model="form.jam_ke" type="text" placeholder="Misal: 1-4 atau 5-8" required />
        </div>

        <div class="input-group">
          <label>Berlaku di Blok</label>
          <select v-model="form.blok" required>
            <option value="">-- Pilih Blok --</option>
            <option value="Blok 1">Blok 1</option>
            <option value="Blok 2">Blok 2</option>
          </select>
        </div>

        <div class="button-group" style="align-self: flex-end;">
          <button type="submit" class="btn-submit">
            <i class="fa-solid fa-floppy-disk"></i> {{ isEditMode ? 'Update' : 'Simpan Slot' }}
          </button>
          <button v-if="isEditMode" type="button" @click="resetForm" class="btn-cancel">Batal</button>
        </div>
      </form>
    </div>

    <div class="card-box">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #689F38; padding-bottom: 10px;">
        <h3 style="margin: 0; color: #1E5631;"><i class="fa-solid fa-list-check"></i> Matriks Jadwal Mengajar Guru</h3>
        
        <div style="display: flex; gap: 10px;">
          <select v-model="filterTp" @change="ambilDataJadwal" style="padding: 6px 10px; border-radius: 4px; border: 1px solid #689F38;">
  <option value="">-- Semua Tahun Pelajaran --</option>
  <option v-for="tp in listTahunPelajaran" :key="tp.id" :value="tp.id">
    {{ tp.nama_tahun }} </option>
</select>
          <select v-model="filterGuru" @change="ambilDataJadwal" style="padding: 6px 10px; border-radius: 4px; border: 1px solid #689F38;">
            <option value="">-- Filter Berdasarkan Guru --</option>
            <option v-for="g in listGuru" :key="g.id" :value="g.id">{{ g.name }}</option>
          </select>
        </div>
      </div>

      <div v-if="isLoading" style="text-align: center; padding: 30px; color: #689F38;">
        <i class="fa-solid fa-spinner fa-spin fa-2x"></i> <p>Memuat lembar jadwal...</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table-custom">
          <thead>
            <tr>
              <th>Hari</th>
              <th>Jam Ke</th>
              <th>Nama Guru</th>
              <th style="background-color: #e8f5e9; color: #1E5631;">BLOK 1 (Kelas / Mapel)</th>
              <th style="background-color: #fff3e0; color: #e65100;">BLOK 2 (Kelas / Mapel)</th>
              <th>Aksi Pembersihan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in jadwalTersusun" :key="idx">
              <td style="font-weight: bold; color: #1E5631;">{{ row.hari }}</td>
              <td><span class="badge-jam">Jam {{ row.jam_ke }}</span></td>
              <td style="font-weight: 600;">{{ row.nama_guru }}</td>
              
              <td style="background-color: #f4faf4; font-weight: bold; color: #2e7d32;">
                <span v-if="row.blok1 !== '-'">
                  <i class="fa-solid fa-circle-dot" style="font-size: 10px;"></i> {{ row.blok1 }}
                </span>
                <span v-else style="color: #bbb; font-weight: normal;">- Empty -</span>
              </td>

              <td style="background-color: #fffbf5; font-weight: bold; color: #d84315;">
                <span v-if="row.blok2 !== '-'">
                  <i class="fa-solid fa-circle-dot" style="font-size: 10px;"></i> {{ row.blok2 }}
                </span>
                <span v-else style="color: #bbb; font-weight: normal;">- Empty -</span>
              </td>

              <td>
                <button v-if="row.id_blok1" @value="row.id_blok1" @click="hapusKomponenJadwal(row.id_blok1, 'Blok 1')" class="btn-action-del" title="Hapus Blok 1">
                  Hapus B1
                </button>
                <button v-if="row.id_blok2" @value="row.id_blok2" @click="hapusKomponenJadwal(row.id_blok2, 'Blok 2')" class="btn-action-del" style="background-color: #e65100;" title="Hapus Blok 2">
                  Hapus B2
                </button>
              </td>
            </tr>
            <tr v-if="jadwalTersusun.length === 0">
              <td colspan="6" style="text-align: center; color: #999; padding: 20px;">
                Belum ada plotting jadwal untuk kombinasi filter ini.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';
import Swal from 'sweetalert2';

// Master Data List
const listTahunPelajaran = ref([]);
const listGuru = ref([]);
const listMapel = ref([]);
const listKelas = ref([]);
const listRawJadwal = ref([]);

// States & Filters
const isLoading = ref(false);
const isEditMode = ref(false);
const editId = ref(null);
const filterTp = ref('');
const filterGuru = ref('');

// Form Object
const form = ref({
  tahun_pelajaran_id: '',
  guru_id: '',
  mata_pelajaran_id: '',
  kelas_id: '',
  hari: '',
  jam_ke: '',
  blok: ''
});

// Toast Notification setup
const Toast = Swal.mixin({
  toast: true, position: 'top-end', showConfirmButton: false, timer: 2500,
  background: '#1E5631', color: '#white', iconColor: '#FBC02D'
});

// 🌟 ENGINE UTAMA: MERAKIT GABUNGAN HORIZONTAL (Blok 1 / Blok 2)
const jadwalTersusun = computed(() => {
  const matriks = {};

  listRawJadwal.value.forEach(item => {
    // Kunci penggabungan: Berdasarkan Hari, Jam Ke, dan Guru yang sama
    const key = `${item.hari}-${item.jam_ke}-${item.guru?.id}`;

    if (!matriks[key]) {
      matriks[key] = {
        hari: item.hari,
        jam_ke: item.jam_ke,
        nama_guru: item.guru?.name || 'Unknown',
        id_blok1: null,
        blok1: '-',
        id_blok2: null,
        blok2: '-'
      };
    }

    const infoTeks = `${item.kelas?.nama} [${item.mapel?.nama}]`;

    if (item.blok === 'Blok 1') {
      matriks[key].id_blok1 = item.id;
      matriks[key].blok1 = infoTeks;
    } else if (item.blok === 'Blok 2') {
      matriks[key].id_blok2 = item.id;
      matriks[key].blok2 = infoTeks;
    }
  });

  // Urutan hari sekolah biar rapi berurutan di tabel
  const urutanHari = { 'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6 };
  
  return Object.values(matriks).sort((a, b) => {
    return urutanHari[a.hari] - urutanHari[b.hari] || a.jam_ke.localeCompare(b.jam_ke);
  });
});

// Fetch Semua Dropdown Master & Jadwal
const muatSemuaMaster = async () => {
  try {
    const [resTp, resGuru, resMapel, resKelas] = await Promise.all([
      api.get('/tahun-pelajaran'),
      api.get('/guru'),
      api.get('/mapel'),
      api.get('/kelas')
    ]);

    // 💡 ANTI-GAGAL: Cek .data.data dulu, kalau tidak ada langsung ambil .data (Array langsung)
    listTahunPelajaran.value = resTp.data?.data || resTp.data || [];
    listGuru.value = resGuru.data?.data || resGuru.data || [];
    listMapel.value = resMapel.data?.data || resMapel.data || [];
    listKelas.value = resKelas.data?.data || resKelas.data || []; // <-- Typo lama sudah dibersihkan

    // Log ke console untuk intip struktur aslinya (bisa dihapus kalau sudah lancar)
    console.log("Data Tahun Pelajaran Berhasil Masuk:", listTahunPelajaran.value);

    // Auto select tahun pelajaran pertama jika ada
    if (listTahunPelajaran.value.length > 0) {
      filterTp.value = listTahunPelajaran.value[0].id;
      form.value.tahun_pelajaran_id = listTahunPelajaran.value[0].id;
    }
  } catch (error) {
    console.error("Gagal memuat master data drops:", error);
  }
};

const ambilDataJadwal = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/jadwal-mengajar', {
      params: {
        tahun_pelajaran_id: filterTp.value,
        guru_id: filterGuru.value
      }
    });
    listRawJadwal.value = res.data?.data || [];
  } catch (error) {
    Toast.fire({ icon: 'error', title: 'Gagal mengambil data jadwal.' });
  } finally {
    isLoading.value = false;
  }
};

// Operasi Simpan (POST)
const simpanJadwal = async () => {
  try {
    await api.post('/jadwal-mengajar', form.value);
    Toast.fire({ icon: 'success', title: 'Plotting jadwal sukses disimpan!' });
    resetForm();
    ambilDataJadwal();
  } catch (error) {
    Swal.fire('Gagal Menyimpan', error.response?.data?.message || 'Terjadi tabrakan data validasi.', 'error');
  }
};

// Operasi Hapus Satuan Blok
const hapusKomponenJadwal = async (id, jenisBlok) => {
  const tanya = await Swal.fire({
    title: `Hapus ${jenisBlok}?`,
    text: "Konfirmasi pencabutan jadwal di slot blok ini.",
    icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', buttonColor: '#3085d6', confirmButtonText: 'Ya, Cabut!'
  });

  if (tanya.isConfirmed) {
    try {
      await api.delete(`/jadwal-mengajar/${id}`);
      Toast.fire({ icon: 'success', title: 'Jadwal blok dicabut.' });
      ambilDataJadwal();
    } catch (error) {
      Swal.fire('Gagal', 'Sistem gagal menghapus.', 'error');
    }
  }
};

const resetForm = () => {
  form.value.mata_pelajaran_id = '';
  form.value.kelas_id = '';
  form.value.hari = '';
  form.value.jam_ke = '';
  form.value.blok = '';
  isEditMode.value = false;
  editId.value = null;
};

onMounted(async () => {
  await muatSemuaMaster();
  ambilDataJadwal();
});
</script>

<style scoped>
.card-box { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.08); border: 1px solid #e5dfd5; }
.grid-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 15fr)); gap: 15px; }
.input-group { display: flex; flex-direction: column; gap: 5px; }
.input-group label { font-weight: bold; font-size: 13px; color: #444; }
.input-group select, .input-group input { padding: 10px; border: 1px solid #689F38; border-radius: 4px; outline: none; font-size: 14px; }
.input-group select:focus, .input-group input:focus { border-color: #1E5631; box-shadow: 0 0 4px rgba(30,86,49,0.2); }

.button-group { display: flex; gap: 8px; }
.btn-submit { background-color: #1E5631; color: white; border: none; padding: 11px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; transition: 0.2s; }
.btn-submit:hover { background-color: #12361e; }
.btn-cancel { background-color: #e0e0e0; color: #333; border: none; padding: 11px 15px; border-radius: 4px; cursor: pointer; }

/* Styling Tabel Multi-Blok */
.table-responsive { width: 100%; overflow-x: auto; margin-top: 10px; }
.table-custom { width: 100%; border-collapse: collapse; text-align: left; }
.table-custom th { background-color: #1E5631; color: white; padding: 12px; font-size: 14px; border: 1px solid #ddd; }
.table-custom td { padding: 12px; border: 1px solid #eee; font-size: 14px; vertical-align: middle; }
.badge-jam { background-color: #689F38; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }

.btn-action-del { background-color: #d9534f; color: white; border: none; padding: 5px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; margin-right: 5px; }
.btn-action-del:hover { opacity: 0.9; }
</style>