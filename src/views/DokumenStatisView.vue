<template>
  <div>
    <div class="card-box" style="margin-bottom: 20px; background-color: #1E5631; color: white;">
      <h2 style="margin: 0; color: #FBC02D;"><i class="fa-solid fa-file-signature"></i> Manajemen Dokumen Statis</h2>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #FFE0B2;">
        Kelola regulasi sekolah untuk dibundling ke Buku Kerja Guru.
      </p>
    </div>

    <div class="layout-flex">
      <div class="sidebar-tab">
        <button 
          @click="gantiTab('kode_etik')" 
          :class="['btn-tab', activeTab === 'kode_etik' ? 'active' : '']"
        >
          <i class="fa-solid fa-book-bookmark"></i> Kode Etik Guru
        </button>
        <button 
          @click="gantiTab('ikrar_guru')" 
          :class="['btn-tab', activeTab === 'ikrar_guru' ? 'active' : '']"
        >
          <i class="fa-solid fa-hands-praying"></i> Ikrar Guru
        </button>
        <button 
          @click="gantiTab('tata_tertib')" 
          :class="['btn-tab', activeTab === 'tata_tertib' ? 'active' : '']"
        >
          <i class="fa-solid fa-clipboard-list"></i> Tata Tertib Guru
        </button>

        <button 
        @click="gantiTab('pembiasaan_guru')" 
        :class="['btn-tab', activeTab === 'pembiasaan_guru' ? 'active' : '']"
      >
        <i class="fa-solid fa-square-check"></i> Pembiasaan Guru
      </button>
      </div>

      <div class="card-box editor-area">
        <h3 style="margin-top: 0; color: #1E5631; border-bottom: 1px solid #FFE0B2; padding-bottom: 10px;">
          Edit: {{ namaDokumenAktif }}
        </h3>
        
        <div v-if="isLoading" class="text-center" style="padding: 40px; color: #689F38;">
          <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
          <p>Memuat data...</p>
        </div>

        <div v-else>
          <textarea 
            v-model="dokumenContent" 
            class="textarea-custom" 
            placeholder="Ketik atau paste dokumen di sini..."
            rows="15"
          ></textarea>

          <div style="text-align: right; margin-top: 15px;">
            <button @click="simpanDokumen" class="btn-save" :disabled="isSaving">
              <i v-if="isSaving" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-floppy-disk"></i>
              {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api'; // Sesuaikan path jika berbeda
import Swal from 'sweetalert2';

const activeTab = ref('kode_etik');
const dokumenContent = ref('');
const isLoading = ref(false);
const isSaving = ref(false);

const Toast = Swal.mixin({
  toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
  background: '#1E5631', color: '#FFE0B2', iconColor: '#FBC02D'
});

const namaDokumenAktif = computed(() => {
  if (activeTab.value === 'kode_etik') return 'Kode Etik Guru';
  if (activeTab.value === 'ikrar_guru') return 'Ikrar Guru';
  if (activeTab.value === 'tata_tertib') return 'Tata Tertib Guru';
  if (activeTab.value === 'pembiasaan_guru') return 'Pembiasaan Guru'; // <-- Tambahkan ini
  return '';
});

const gantiTab = (tabName) => {
  activeTab.value = tabName;
  ambilDataDokumen();
};

const ambilDataDokumen = async () => {
  isLoading.value = true;
  try {
    const res = await api.get(`/dokumen-statis`, { params: { jenis: activeTab.value } });
    dokumenContent.value = res.data?.data?.isi_dokumen || '';
  } catch (error) {
    dokumenContent.value = '';
    Toast.fire({ icon: 'error', title: 'Gagal mengambil data.' });
  } finally {
    isLoading.value = false;
  }
};

const simpanDokumen = async () => {
  if (!dokumenContent.value.trim()) {
    Swal.fire('Peringatan', 'Isi dokumen tidak boleh kosong!', 'warning');
    return;
  }
  isSaving.value = true;
  try {
    await api.post(`/dokumen-statis`, {
      jenis: activeTab.value,
      isi: dokumenContent.value
    });
    Toast.fire({ icon: 'success', title: `${namaDokumenAktif.value} tersimpan!` });
  } catch (error) {
    Swal.fire('Gagal', 'Terjadi kesalahan sistem saat menyimpan.', 'error');
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  ambilDataDokumen();
});
</script>

<style scoped>
.card-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.layout-flex {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.sidebar-tab {
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-tab {
  background-color: white;
  border: 1px solid #689F38;
  color: #1E5631;
  padding: 12px 15px;
  border-radius: 5px;
  text-align: left;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-tab:hover {
  background-color: #e8f5e9;
}

.btn-tab.active {
  background-color: #689F38;
  color: white;
  border-left: 5px solid #FBC02D;
}

.editor-area {
  flex: 1;
}

.textarea-custom {
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  box-sizing: border-box;
}

.textarea-custom:focus {
  outline: none;
  border-color: #689F38;
  box-shadow: 0 0 5px rgba(104, 159, 56, 0.3);
}

.btn-save {
  background-color: #1E5631;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: 0.3s;
}

.btn-save:hover {
  background-color: #143d20;
}

.btn-save:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.text-center { text-align: center; }
</style>