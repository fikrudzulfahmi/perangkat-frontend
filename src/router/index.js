import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginView
    },
    {
        // Cangkang Utama Admin
        path: '/admin',
        component: AdminLayout,
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/DashboardView.vue')
            },
            {
                path: '/data-guru',
                name: 'Data Guru',
                component: () => import('../views/DataGuruView.vue')
            },
            {
                path: '/mata-pelajaran',
                name: 'MataPelajaran',
                component: () => import('../views/MataPelajaranView.vue')
            },
            {
                path: '/kelas',
                name: 'Kelas',
                component: () => import('../views/KelasView.vue')
            },
            {
                path: '/tahun-pelajaran',
                name: 'TahunPelajaran',
                component: () => import('../views/TahunPelajaranView.vue')
            },
            {
                path: '/plotting',
                name: 'Plotting',
                component: () => import('../views/PlottingView.vue')
            },
            {
                path: '/siswa',
                name: 'siswa.index',
                component: () => import('../views/SiswaView.vue')
            },
            {
                path: '/kalender-efektif',
                name: 'kalender.index',
                component: () => import('../views/KalenderEfektifView.vue')
            },
            {
                path: '/kurikulum',
                name: 'kurikulum.index',
                component: () => import('../views/KurikulumView.vue')
            },
            {
                path: '/dokumen-statis',
                name: 'DokumenStatis',
                component: () => import('../views/DokumenStatisView.vue')
            },
            {
                path: '/jadwal-mengajar',
                name: 'JadwalMengajar',
                component: () => import('../views/JadwalMengajarView.vue')
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
                component: () => import('../views/guru/DashboardGuruView.vue')
            },
            {
                path: 'atp',
                name: 'guru.atp',
                component: () => import('../views/guru/AtpView.vue')
            },
            {
                path: 'kktp',
                name: 'guru.kktp',
                component: () => import('../views/guru/KktpView.vue')
            },
            {
                path: 'modul-ajar',
                name: 'guru.modul-ajar',
                component: () => import('../views/guru/ModulAjarView.vue')
            },
            {
                path: 'modul-ajar/create',
                name: 'guru.modul-ajar.create',
                component: () => import('../views/guru/ModulAjarCreateView.vue')
            },
            // 🟢 (Opsional sekalian) Tambahkan rute untuk halaman Edit nantinya

            {
                path: 'buku-pegangan', // tidak pakai /guru/ di depan jika diletakkan di children
                name: 'guru.buku-pegangan',
                component: () => import('../views/guru/BukuPeganganView.vue')
            },
            {
                path: '/guru/prosem',
                name: 'guru.prosem',
                component: () => import('../views/guru/ProsemView.vue')
            },
            {
                path: 'bank-soal',
                name: 'guru.bank-soal',
                component: () => import('../views/guru/BankSoalView.vue')
            },
            // Bank Soal - Form Create
            {
                path: 'bank-soal/tambah',
                name: 'guru.bank-soal.create',
                component: () => import('../views/guru/BankSoalFormView.vue')
            },
            // Bank Soal - Form Edit
            {
                path: 'bank-soal/edit/:id',
                name: 'guru.bank-soal.edit',
                component: () => import('../views/guru/BankSoalFormView.vue')
            },
            {
                path: '/guru/cetak-perangkat',
                name: 'guru.cetak-perangkat',
                component: () => import('../views/guru/CetakPerangkat.vue') // 🟢 Jalur file utama cetak perangkat guru
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

export default router;