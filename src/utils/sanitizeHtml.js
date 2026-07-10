// Utilitas sanitasi HTML sederhana (tanpa library tambahan) untuk konten yang berasal
// dari RichTextEditor, sebelum ditampilkan lewat v-html di halaman lain.
//
// Hanya tag format dasar yang diizinkan, dan SEMUA atribut dibuang (termasuk onclick,
// style, href="javascript:...", dst). Ini mencegah script/HTML berbahaya yang mungkin
// ikut ter-paste dari sumber luar (Word, halaman web lain, dsb) ikut tersimpan & jalan
// saat ditampilkan.
//
// Pakai fungsi ini di SETIAP tempat yang menampilkan field hasil RichTextEditor dengan v-html.

const ALLOWED_TAGS = new Set([
    'B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE',
    'OL', 'UL', 'LI', 'BR', 'P', 'DIV', 'SPAN',
    'TABLE', 'THEAD', 'TBODY', 'TR', 'TD', 'TH'
]);

export function sanitizeHtml(html) {
    if (!html) return '';

    // <template> membuat elemen di dalamnya "inert": script tidak dieksekusi,
    // gambar tidak dimuat, dsb — aman dipakai untuk parsing sebelum dibersihkan.
    const template = document.createElement('template');
    template.innerHTML = html;

    const bersihkan = (parent) => {
        [...parent.childNodes].forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                if (!ALLOWED_TAGS.has(child.tagName)) {
                    // Tag tidak dikenal/berbahaya (script, img, iframe, dll) -> ganti dengan teksnya saja
                    const teks = document.createTextNode(child.textContent || '');
                    parent.replaceChild(teks, child);
                    return;
                }
                // Buang semua atribut (onerror, onclick, style, href, dll)
                [...child.attributes].forEach((attr) => child.removeAttribute(attr.name));
                bersihkan(child);
            } else if (child.nodeType !== Node.TEXT_NODE) {
                // Buang node lain (komentar, dsb)
                parent.removeChild(child);
            }
        });
    };

    bersihkan(template.content);
    return template.innerHTML;
}