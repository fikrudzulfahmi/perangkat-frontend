<template>
  <div class="content-body">
    
    <div class="card-box header-buku-box">
      <div class="header-flex">
        <button @click="kembaliKeDashboard" class="btn-back">
          <i class="fa-solid fa-arrow-left"></i> Kembali
        </button>
        <div class="meta-info">
          <h2>Daftar Buku Pegangan</h2>
          <p>Kelola daftar buku pegangan guru, buku siswa, dan referensi lainnya (Buku Kerja 3).</p>
        </div>
      </div>
    </div>

    <div class="card-box margin-top-25">
      <div class="section-header">
        <div>
          <h3><i class="fa-solid fa-book"></i> Rekapitulasi Buku</h3>
          <p class="subtitle">Daftar buku yang digunakan pada tahun pelajaran aktif.</p>
        </div>
        <button @click="bukaModalTambah" class="btn-add">
          <i class="fa-solid fa-plus"></i> Tambah Buku
        </button>
      </div>

      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i> Memuat data buku...
      </div>

      <div v-else-if="listBuku.length === 0" class="empty-state">
        <i class="fa-solid fa-book-open empty-icon"></i>
        <p>Belum ada daftar buku pegangan. Silakan klik Tambah Buku.</p>
      </div>

      <table v-else class="table-custom">
        <thead>
          <tr>
            <th width="20%">Mata Pelajaran (Plotting)</th>
            <th width="25%">Judul Buku</th>
            <th width="15%">Jenis Buku</th>
            <th width="15%">Penerbit & Tahun</th>
            <th width="15%">Penulis</th>
            <th width="10%">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="buku in listBuku" :key="buku.id">
            <td>
              <strong>{{ buku.nama_mapel || 'Mapel tidak diketahui' }}</strong>
            </td>
            <td class="judul-text">{{ buku.judul_buku }}</td>
            <td>
              <span class="badge-jenis">{{ buku.jenis_buku }}</span>
            </td>
            <td>
              {{ buku.penerbit || '-' }} <br>
              <small style="color: #666;">({{ buku.tahun_terbit || '-' }})</small>
            </td>
            <td>{{ buku.penulis || '-' }}</td>
            <td>
              <div class="action-buttons">
                <button @click="bukaModalEdit(buku)" class="btn-icon btn-edit" title="Edit">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button @click="hapusBuku(buku.id)" class="btn-icon btn-delete" title="Hapus">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content card-box">
        <div class="modal-header">
          <h3>{{ isEdit ? 'Edit Buku Pegangan' : 'Tambah Buku Pegangan' }}</h3>
          <button @click="tutupModal" class="btn-close-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        
        <form @submit.prevent="simpanBuku" class="form-modal">
          <div class="form-group">
            <label>Mata Pelajaran (Plotting) <span class="text-danger">*</span></label>
            <select v-model="form.plotting_id" required class="input-text">
              <option value="" disabled>-- Pilih Mapel yang diajar --</option>
             <option v-for="plot in listPlotting" :key="plot.id" :value="plot.id">
  {{ plot.mapel }} - Kelas {{ plot.nama_kelas_gabungan }}
</option>
            </select>
          </div>

          <div class="form-group">
            <label>Judul Buku <span class="text-danger">*</span></label>
            <input type="text" v-model="form.judul_buku" required class="input-text" placeholder="Contoh: Bahasa Indonesia Kelas X">
          </div>

          <div class="form-group">
            <label>Jenis Buku <span class="text-danger">*</span></label>
            <select v-model="form.jenis_buku" required class="input-text">
              <option value="Buku Guru">Buku Guru</option>
              <option value="Buku Siswa">Buku Siswa</option>
              <option value="Referensi Lain">Referensi Lain</option>
            </select>
          </div>

          <div class="form-group-row">
            <div class="form-group w-50">
              <label>Penulis</label>
              <input type="text" v-model="form.penulis" class="input-text" placeholder="Nama Penulis">
            </div>
            <div class="form-group w-50">
              <label>Penerbit</label>
              <input type="text" v-model="form.penerbit" class="input-text" placeholder="Nama Penerbit">
            </div>
          </div>

          <div class="form-group">
            <label>Tahun Terbit</label>
            <input type="number" v-model="form.tahun_terbit" class="input-text" min="1900" :max="new Date().getFullYear() + 1" placeholder="Contoh: 2023">
          </div>

          <div class="modal-footer">
            <button type="button" @click="tutupModal" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-save" :disabled="isSaving">
              <i class="fa-solid fa-floppy-disk"></i> {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';
import Swal from 'sweetalert2';

const router = useRouter();

// State Data
const listBuku = ref([]);
const listPlotting = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);

// State Modal & Form
const showModal = ref(false);
const isEdit = ref(false);
const formId = ref(null);
const form = ref({
  plotting_id: '',
  judul_buku: '',
  jenis_buku: 'Buku Siswa',
  penulis: '',
  penerbit: '',
  tahun_terbit: ''
});

// Konfigurasi SweetAlert Toast
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#1E5631',
  color: '#FFE0B2',
  iconColor: '#FBC02D'
});

// Methods
const kembaliKeDashboard = () => {
  router.push({ name: 'guru.dashboard' });
};

const muatPlottingGuru = async () => {
  try {
    const res = await api.get('/guru/plotting');
    
    // Ambil array datanya
    const rawData = res.data.data || res.data;

    // Modifikasi data agar nama kelas dari array tergabung menjadi string
    listPlotting.value = rawData.map(plot => {
      // Ekstrak nama kelas dan gabungkan dengan koma
      const gabunganKelas = plot.list_kelas && plot.list_kelas.length > 0 
        ? plot.list_kelas.map(k => k.nama_kelas).join(', ') 
        : 'Belum ada kelas';

      return {
        ...plot,
        nama_kelas_gabungan: gabunganKelas // Bikin property baru untuk mempermudah template
      };
    });

  } catch (error) {
    console.error("Gagal memuat list plotting:", error);
  }
};

const muatBuku = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/guru/buku-pegangan');
    listBuku.value = res.data.data || res.data;
  } catch (error) {
    console.error("Gagal memuat buku:", error);
    Toast.fire({ icon: 'error', title: 'Gagal memuat data buku.' });
  } finally {
    isLoading.value = false;
  }
};

const bukaModalTambah = () => {
  isEdit.value = false;
  formId.value = null;
  form.value = { plotting_id: '', judul_buku: '', jenis_buku: 'Buku Siswa', penulis: '', penerbit: '', tahun_terbit: '' };
  showModal.value = true;
};

const bukaModalEdit = (buku) => {
  isEdit.value = true;
  formId.value = buku.id;
  form.value = {
    plotting_id: buku.plotting_id,
    judul_buku: buku.judul_buku,
    jenis_buku: buku.jenis_buku,
    penulis: buku.penulis || '',
    penerbit: buku.penerbit || '',
    tahun_terbit: buku.tahun_terbit || ''
  };
  showModal.value = true;
};

const tutupModal = () => {
  showModal.value = false;
};

const simpanBuku = async () => {
  isSaving.value = true;
  try {
    if (isEdit.value) {
      await api.put(`/guru/buku-pegangan/${formId.value}`, form.value);
      Toast.fire({ icon: 'success', title: 'Buku berhasil diperbarui!' });
    } else {
      await api.post('/guru/buku-pegangan', form.value);
      Toast.fire({ icon: 'success', title: 'Buku berhasil ditambahkan!' });
    }
    tutupModal();
    muatBuku(); // Refresh data
  } catch (error) {
    console.error("Gagal menyimpan:", error);
    Toast.fire({ icon: 'error', title: 'Terjadi kesalahan saat menyimpan data.' });
  } finally {
    isSaving.value = false;
  }
};

const hapusBuku = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus Buku?',
    text: "Data yang dihapus tidak dapat dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d9534f',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Ya, hapus!'
  });

  if (confirm.isConfirmed) {
    try {
      await api.delete(`/guru/buku-pegangan/${id}`);
      Toast.fire({ icon: 'success', title: 'Buku berhasil dihapus!' });
      muatBuku();
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Gagal menghapus buku.' });
    }
  }
};

onMounted(() => {
  muatPlottingGuru();
  muatBuku();
});
</script>

<style scoped>
.content-body { padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fcf8f2; min-height: 100vh; }
.card-box { background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 20px; }
.margin-top-25 { margin-top: 25px; }

/* Header Khas */
.header-buku-box { background: #1E5631; border-top: none; color: white; padding: 20px 30px; border-radius: 10px; }
.header-flex { display: flex; align-items: center; gap: 20px; }
.btn-back { background: #689F38; border: none; color: white; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 8px; font-size: 14px; transition: 0.2s; }
.btn-back:hover { background: #FBC02D; color: #1E5631; }
.meta-info h2 { margin: 0 0 6px 0; font-size: 20px; color: #FBC02D; }
.meta-info p { margin: 0; color: #FFE0B2; font-size: 14px; }

/* Sub Header Content */
.section-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 20px; }
.section-header h3 { margin: 0; color: #1E5631; font-size: 18px; font-weight: bold; }
.subtitle { margin: 6px 0 0 0; color: #666; font-size: 13.5px; }
.btn-add { background-color: #1E5631; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
.btn-add:hover { background-color: #689F38; }

/* Table */
.table-custom { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; }
.table-custom th { background-color: #689F38; color: white; padding: 14px 15px; font-size: 14px; text-align: left; }
.table-custom td { padding: 14px 15px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; vertical-align: middle; }
.judul-text { font-weight: bold; color: #1E5631; }
.badge-jenis { background: #e3f2fd; color: #1565c0; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 4px; border: 1px solid #bbdefb; }

/* Buttons Action */
.action-buttons { display: flex; gap: 8px; }
.btn-icon { border: none; padding: 8px 10px; border-radius: 4px; cursor: pointer; transition: 0.2s; color: white; }
.btn-edit { background-color: #FBC02D; color: #1E5631; }
.btn-edit:hover { background-color: #f9a825; }
.btn-delete { background-color: #d9534f; }
.btn-delete:hover { background-color: #c9302c; }

/* States */
.loading-state { text-align: center; padding: 50px; font-weight: bold; color: #1E5631; }
.empty-state { text-align: center; padding: 50px; color: #666; }
.empty-icon { font-size: 40px; color: #ccc; margin-bottom: 15px; }

/* Modal Styles CSS Murni */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { width: 500px; max-width: 90%; background: white; padding: 0; overflow: hidden; display: flex; flex-direction: column; }
.modal-header { padding: 15px 20px; background: #1E5631; color: white; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; font-size: 18px; color: #FBC02D; }
.btn-close-modal { background: none; border: none; color: white; font-size: 20px; cursor: pointer; }
.form-modal { padding: 20px; }
.form-group { margin-bottom: 15px; }
.form-group-row { display: flex; gap: 15px; }
.w-50 { width: 50%; }
.form-group label { display: block; margin-bottom: 6px; font-weight: bold; font-size: 13px; color: #333; }
.text-danger { color: #d9534f; }
.input-text { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 14px; font-family: inherit; }
.input-text:focus { border-color: #689F38; outline: none; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px; }
.btn-cancel { background: #f4f4f4; border: 1px solid #ddd; padding: 10px 18px; border-radius: 5px; cursor: pointer; }
.btn-save { background: #1E5631; color: white; border: none; padding: 10px 18px; border-radius: 5px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 8px; }
.btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
</style>