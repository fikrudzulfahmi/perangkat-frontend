import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginView,
        meta: { title: 'Login' }
    },
    {
        // Cangkang Utama Admin
        path: '/admin',
        component: AdminLayout,
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/DashboardView.vue'),
                meta: { title: 'Dashboard' }
            },
            {
                path: '/data-guru',
                name: 'Data Guru',
                component: () => import('../views/DataGuruView.vue'),
                meta: { title: 'Data Guru' }
            },
            {
                path: '/mata-pelajaran',
                name: 'MataPelajaran',
                component: () => import('../views/MataPelajaranView.vue'),
                meta: { title: 'Mata Pelajaran' }
            },
            {
                path: '/kelas',
                name: 'Kelas',
                component: () => import('../views/KelasView.vue'),
                meta: { title: 'Kelas' }
            },
            {
                path: '/tahun-pelajaran',
                name: 'TahunPelajaran',
                component: () => import('../views/TahunPelajaranView.vue'),
                meta: { title: 'Tahun Pelajaran' }
            },
            {
                path: '/plotting',
                name: 'Plotting',
                component: () => import('../views/PlottingView.vue'),
                meta: { title: 'Plotting' }
            },
            {
                path: '/siswa',
                name: 'siswa.index',
                component: () => import('../views/SiswaView.vue'),
                meta: { title: 'Data Siswa' }
            },
            {
                path: '/kalender-efektif',
                name: 'kalender.index',
                component: () => import('../views/KalenderEfektifView.vue'),
                meta: { title: 'Kalender Efektif' }
            },
            {
                path: '/kurikulum',
                name: 'kurikulum.index',
                component: () => import('../views/KurikulumView.vue'),
                meta: { title: 'Kurikulum' }
            },
            {
                path: '/dokumen-statis',
                name: 'DokumenStatis',
                component: () => import('../views/DokumenStatisView.vue'),
                meta: { title: 'Dokumen Statis' }
            },
            {
                path: '/jadwal-mengajar',
                name: 'JadwalMengajar',
                component: () => import('../views/JadwalMengajarView.vue'),
                meta: { title: 'Jadwal Mengajar' }
            },
        ]
    },
    {
        path: '/guru',
        component: () => import('../layouts/GuruLayout.vue'),
        children: [
            {
                path: 'dashboard',
                name: 'guru.dashboard',
                component: () => import('../views/guru/DashboardGuruView.vue'),
                meta: { title: 'Dashboard Guru' }
            },
            {
                path: 'atp',
                name: 'guru.atp',
                component: () => import('../views/guru/AtpView.vue'),
                meta: { title: 'ATP' }
            },
            {
                path: 'kktp',
                name: 'guru.kktp',
                component: () => import('../views/guru/KktpView.vue'),
                meta: { title: 'KKTP' }
            },
            {
                path: 'modul-ajar',
                name: 'guru.modul-ajar',
                component: () => import('../views/guru/ModulAjarView.vue'),
                meta: { title: 'Modul Ajar' }
            },
            {
                path: 'modul-ajar/create',
                name: 'guru.modul-ajar.create',
                component: () => import('../views/guru/ModulAjarCreateView.vue'),
                meta: { title: 'Tambah Modul Ajar' }
            },
            {
                path: '/guru/modul-ajar/:id/edit', // :id untuk menangkap ID modul
                name: 'guru.modul-ajar.edit',
                component: () => import('../views/guru/ModulAjarEditView.vue'), // Pastikan folder/path-nya sesuai
                meta: { title: 'Edit Modul Ajar' }
            },
            // 🟢 (Opsional sekalian) Tambahkan rute untuk halaman Edit nantinya

            {
                path: 'buku-pegangan', // tidak pakai /guru/ di depan jika diletakkan di children
                name: 'guru.buku-pegangan',
                component: () => import('../views/guru/BukuPeganganView.vue'),
                meta: { title: 'Buku Pegangan' }
            },
            {
                path: '/guru/prosem',
                name: 'guru.prosem',
                component: () => import('../views/guru/ProsemView.vue'),
                meta: { title: 'Prosem' }
            },
            {
                path: 'bank-soal',
                name: 'guru.bank-soal',
                component: () => import('../views/guru/BankSoalView.vue'),
                meta: { title: 'Bank Soal' }
            },
            // Bank Soal - Form Create
            {
                path: 'bank-soal/tambah',
                name: 'guru.bank-soal.create',
                component: () => import('../views/guru/BankSoalFormView.vue'),
                meta: { title: 'Tambah Bank Soal' }
            },
            // Bank Soal - Form Edit
            {
                path: 'bank-soal/edit/:id',
                name: 'guru.bank-soal.edit',
                component: () => import('../views/guru/BankSoalFormView.vue'),
                meta: { title: 'Edit Bank Soal' }
            },
            {
                path: '/guru/cetak-perangkat',
                name: 'guru.cetak-perangkat',
                component: () => import('../views/guru/CetakPerangkat.vue'), // 🟢 Jalur file utama cetak perangkat guru
                meta: { title: 'Cetak Perangkat' }
            },

        ]
    }
]

// 1. Definisikan variabel router DI SINI
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// 2. Guard Auth Pintar (Mendeteksi Role Admin vs Guru)
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('auth_token');
    const userRole = localStorage.getItem('user_role'); // 🟢 Ambil data role yang disimpan saat login

    // Kondisi 1: Jika BELUM login dan mencoba akses selain halaman login
    if (to.name !== 'login' && !isAuthenticated) {
        next({ name: 'login' });
    }

    // Kondisi 2: Jika SUDAH login tapi mencoba membuka halaman login lagi
    else if (to.name === 'login' && isAuthenticated) {
        if (userRole === 'admin') {
            next({ name: 'Dashboard' }); // Lempar ke Dashboard Admin
        } else if (userRole === 'guru') {
            next({ name: 'guru.dashboard' }); // Lempar ke Dashboard Guru
        } else {
            next();
        }
    }

    // Kondisi 3: Proteksi Keamanan "Salah Kamar" setelah Login
    else {
        // Jika akun GURU mencoba memaksa masuk ke rute-rute ADMIN
        if (!to.path.startsWith('/guru') && to.name !== 'login' && userRole === 'guru') {
            next({ name: 'guru.dashboard' }); // Paksa balikkan ke area guru
        }
        // Jika akun ADMIN mencoba memaksa masuk ke rute-rute GURU (/guru/*)
        else if (to.path.startsWith('/guru') && userRole === 'admin') {
            next({ name: 'Dashboard' }); // Paksa balikkan ke area admin
        }
        // Jika role sesuai dengan kamar masing-masing, izinkan lewat
        else {
            next();
        }
    }
});

// 3. Set judul tab browser secara dinamis sesuai meta.title tiap route
const APP_NAME = 'Perangkat Mengajar';

router.afterEach((to) => {
    document.title = to.meta?.title
        ? `${to.meta.title} | ${APP_NAME}`
        : APP_NAME;
});

export default router;