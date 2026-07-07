import axios from 'axios';
import router from '../router';


// 1. Buat instance Axios dengan URL dinamis dari .env
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 2. Pasang INTERCEPTOR (Satpam Otomatis sebelum request dikirim)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');

        // Jika token ada di brankas, selipkan ke dalam Header secara otomatis
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Pasang INTERCEPTOR (Otomatis deteksi respon error dari server)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Jika server merespon 401 (Token kedaluwarsa / tidak valid)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token'); // Bersihkan token palsu
            router.push('/'); // Tendang langsung ke halaman login
        }
        return Promise.reject(error);
    }
);

export default api;