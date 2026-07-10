<template>
  <div class="rte-wrapper" :class="{ 'rte-focused': isFocused }">
    <div class="rte-toolbar">
      <button type="button" class="rte-btn" :class="{ active: fmt.bold }" @mousedown.prevent="exec('bold')" title="Tebal (Bold)">
        <i class="fa-solid fa-bold"></i>
      </button>
      <button type="button" class="rte-btn" :class="{ active: fmt.underline }" @mousedown.prevent="exec('underline')" title="Garis Bawah (Underline)">
        <i class="fa-solid fa-underline"></i>
      </button>
      <span class="rte-sep"></span>
      <button type="button" class="rte-btn" :class="{ active: fmt.ol }" @mousedown.prevent="exec('insertOrderedList')" title="Penomoran (1. 2. 3.)">
        <i class="fa-solid fa-list-ol"></i>
      </button>
      <button type="button" class="rte-btn" :class="{ active: fmt.ul }" @mousedown.prevent="exec('insertUnorderedList')" title="Bullet List">
        <i class="fa-solid fa-list-ul"></i>
      </button>
      <span class="rte-sep"></span>
      <button type="button" class="rte-btn" @mousedown.prevent="exec('removeFormat')" title="Hapus Format">
        <i class="fa-solid fa-eraser"></i>
      </button>
    </div>

    <div
      ref="editorRef"
      class="rte-editor"
      contenteditable="true"
      :style="{ minHeight: minHeight }"
      :data-placeholder="placeholder"
      @input="onInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keyup="refreshFormatState"
      @mouseup="refreshFormatState"
      @paste="onPaste"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  rows: { type: Number, default: 4 }
});
const emit = defineEmits(['update:modelValue']);

const editorRef = ref(null);
const isFocused = ref(false);
const fmt = ref({ bold: false, underline: false, ol: false, ul: false });
const minHeight = (props.rows * 22 + 14) + 'px';

// Cek apakah string sudah berupa HTML (mengandung tag) atau masih teks polos (data lama dari textarea)
const looksLikeHtml = (str) => /<[a-z][\s\S]*>/i.test(str || '');

// Konversi teks polos (dengan \n) dari data lama agar tampil rapi di editor
const plainToHtml = (str) => (str || '').replace(/\n/g, '<br>');

function setEditorContent(value) {
  if (!editorRef.value) return;
  const html = looksLikeHtml(value) ? (value || '') : plainToHtml(value);
  if (editorRef.value.innerHTML !== html) {
    editorRef.value.innerHTML = html;
  }
}

onMounted(() => {
  setEditorContent(props.modelValue);
});

// Sinkronisasi jika value diubah dari luar (misal fitur "Salin Isi Modul Lain" / ambil dari Buku Pegangan)
watch(() => props.modelValue, (newVal) => {
  if (!editorRef.value) return;
  // Jangan timpa saat user sedang mengetik di dalamnya (hindari kursor loncat)
  if (document.activeElement === editorRef.value) return;
  setEditorContent(newVal);
});

function onInput() {
  emit('update:modelValue', editorRef.value.innerHTML);
}

function exec(command) {
  if (editorRef.value) editorRef.value.focus();
  document.execCommand(command, false, null);
  onInput();
  refreshFormatState();
}

// Paksa konten yang di-paste (dari Word, halaman web lain, dsb) jadi teks polos.
// Ini mencegah markup asing/berbahaya ikut tersimpan, dan hasil paste tetap rapi
// mengikuti gaya form ini. User masih bisa menerapkan Bold/Underline/List manual setelahnya.
function onPaste(e) {
  e.preventDefault();
  const teks = (e.clipboardData || window.clipboardData).getData('text/plain');
  document.execCommand('insertText', false, teks);
  onInput();
}

function refreshFormatState() {
  try {
    fmt.value.bold = document.queryCommandState('bold');
    fmt.value.underline = document.queryCommandState('underline');
    fmt.value.ol = document.queryCommandState('insertOrderedList');
    fmt.value.ul = document.queryCommandState('insertUnorderedList');
  } catch (e) {
    // queryCommandState bisa gagal di beberapa browser lama, aman untuk diabaikan
  }
}
</script>

<style scoped>
.rte-wrapper {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.rte-wrapper.rte-focused {
  border-color: #689F38;
  box-shadow: 0 0 5px rgba(104, 159, 56, 0.3);
}

.rte-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  background: #f4f8ee;
  border-bottom: 1px solid #e0e0e0;
}

.rte-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #555;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.rte-btn:hover {
  background: #e0eccb;
  color: #1E5631;
}
.rte-btn.active {
  background: #689F38;
  color: white;
}

.rte-sep {
  width: 1px;
  height: 18px;
  background: #d8d8d8;
  margin: 0 4px;
}

.rte-editor {
  padding: 12px;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  outline: none;
  overflow-y: auto;
  color: #333;
}
.rte-editor :deep(ol) {
  padding-left: 22px;
  margin: 6px 0;
}
.rte-editor :deep(ul) {
  padding-left: 22px;
  margin: 6px 0;
}
.rte-editor :deep(b),
.rte-editor :deep(strong) {
  font-weight: 700;
}

.rte-editor:empty:before {
  content: attr(data-placeholder);
  color: #999;
  white-space: pre-wrap;
  pointer-events: none;
}
</style>