<template>
  <div class="rte-wrapper" :class="{ 'rte-focused': isFocused }">
    <div class="rte-toolbar">
      <button type="button" class="rte-btn" :class="{ active: fmt.bold }" @mousedown.prevent="exec('bold')" title="Tebal (Bold)">
        <i class="fa-solid fa-bold"></i>
      </button>
      <button type="button" class="rte-btn" :class="{ active: fmt.underline }" @mousedown.prevent="exec('underline')" title="Garis Bawah (Underline)">
        <i class="fa-solid fa-underline"></i>
      </button>
      <button type="button" class="rte-btn" :class="{ active: fmt.italic }" @mousedown.prevent="exec('italic')" title="Miring (Italic)">
        <i class="fa-solid fa-italic"></i>
      </button>
      <span class="rte-sep"></span>
      <button type="button" class="rte-btn" :class="{ active: fmt.ol }" @mousedown.prevent="exec('insertOrderedList')" title="Penomoran (1. 2. 3.)">
        <i class="fa-solid fa-list-ol"></i>
      </button>
      <button type="button" class="rte-btn" :class="{ active: fmt.ul }" @mousedown.prevent="exec('insertUnorderedList')" title="Bullet List">
        <i class="fa-solid fa-list-ul"></i>
      </button>
      <span class="rte-sep"></span>
      <div class="rte-table-picker-wrap" ref="tablePickerWrapRef">
        <button type="button" class="rte-btn" @mousedown.prevent="showTablePicker = !showTablePicker" title="Sisipkan Tabel">
          <i class="fa-solid fa-table"></i>
        </button>
        <div v-if="showTablePicker" class="rte-table-picker">
          <label>
            Baris
            <input type="number" min="1" max="20" v-model.number="tableRows" />
          </label>
          <label>
            Kolom
            <input type="number" min="1" max="10" v-model.number="tableCols" />
          </label>
          <div class="rte-table-picker-actions">
            <button type="button" class="rte-mini-btn rte-mini-btn-cancel" @mousedown.prevent="showTablePicker = false">Batal</button>
            <button type="button" class="rte-mini-btn rte-mini-btn-primary" @mousedown.prevent="insertTable">Sisipkan</button>
          </div>
        </div>
      </div>
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
      @keydown="onEditorKeydown"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  rows: { type: Number, default: 4 }
});
const emit = defineEmits(['update:modelValue']);

const editorRef = ref(null);
const isFocused = ref(false);
const fmt = ref({ bold: false, underline: false, italic: false, ol: false, ul: false });
const minHeight = (props.rows * 22 + 14) + 'px';

// State untuk popover "Sisipkan Tabel"
const showTablePicker = ref(false);
const tableRows = ref(3);
const tableCols = ref(3);
const tablePickerWrapRef = ref(null);

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
  document.addEventListener('mousedown', onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentClick);
});

function onDocumentClick(e) {
  if (showTablePicker.value && tablePickerWrapRef.value && !tablePickerWrapRef.value.contains(e.target)) {
    showTablePicker.value = false;
  }
}

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
    fmt.value.italic = document.queryCommandState('italic');
    fmt.value.ol = document.queryCommandState('insertOrderedList');
    fmt.value.ul = document.queryCommandState('insertUnorderedList');
  } catch (e) {
    // queryCommandState bisa gagal di beberapa browser lama, aman untuk diabaikan
  }
}

// --- Sisipkan Tabel ---
function insertTable() {
  const rows = Math.max(1, Math.min(20, parseInt(tableRows.value) || 1));
  const cols = Math.max(1, Math.min(10, parseInt(tableCols.value) || 1));

  let html = '<table><tbody>';
  for (let r = 0; r < rows; r++) {
    html += '<tr>';
    for (let c = 0; c < cols; c++) {
      html += '<td><br></td>';
    }
    html += '</tr>';
  }
  html += '</tbody></table><p><br></p>'; // baris kosong setelah tabel, biar kursor bisa keluar dari tabel

  if (editorRef.value) editorRef.value.focus();
  document.execCommand('insertHTML', false, html);
  showTablePicker.value = false;
  onInput();
}

// --- Navigasi Tab antar sel tabel (Tab = sel berikutnya, Shift+Tab = sel sebelumnya) ---
function getCellNode(node) {
  while (node && node !== editorRef.value) {
    if (node.nodeType === 1 && (node.tagName === 'TD' || node.tagName === 'TH')) return node;
    node = node.parentNode;
  }
  return null;
}

function focusCell(cell) {
  if (!cell) return;
  const range = document.createRange();
  range.selectNodeContents(cell);
  range.collapse(true);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function onEditorKeydown(e) {
  if (e.key !== 'Tab') return;

  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const cell = getCellNode(sel.anchorNode);
  if (!cell) return; // di luar tabel, biarkan perilaku Tab default

  e.preventDefault();
  const row = cell.parentElement;
  const table = row.closest('table');
  if (!table) return;

  const cellsInRow = Array.from(row.children);
  const cellIndex = cellsInRow.indexOf(cell);
  const rows = Array.from(table.querySelectorAll('tr'));
  const rowIndex = rows.indexOf(row);

  let target = null;
  if (!e.shiftKey) {
    if (cellIndex < cellsInRow.length - 1) target = cellsInRow[cellIndex + 1];
    else if (rowIndex < rows.length - 1) target = rows[rowIndex + 1].children[0];
  } else {
    if (cellIndex > 0) target = cellsInRow[cellIndex - 1];
    else if (rowIndex > 0) target = rows[rowIndex - 1].children[rows[rowIndex - 1].children.length - 1];
  }

  focusCell(target);
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

.rte-table-picker-wrap {
  position: relative;
}
.rte-table-picker {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 160px;
}
.rte-table-picker label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  color: #555;
  gap: 8px;
}
.rte-table-picker input[type="number"] {
  width: 55px;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
}
.rte-table-picker-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 4px;
}
.rte-mini-btn {
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}
.rte-mini-btn-cancel {
  background: #f0f0f0;
  color: #555;
}
.rte-mini-btn-cancel:hover {
  background: #e2e2e2;
}
.rte-mini-btn-primary {
  background: #689F38;
  color: white;
}
.rte-mini-btn-primary:hover {
  background: #1E5631;
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
.rte-editor :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}
.rte-editor :deep(td),
.rte-editor :deep(th) {
  border: 1px solid #ccc;
  padding: 6px 8px;
  min-width: 40px;
  vertical-align: top;
}
.rte-editor :deep(th) {
  background: #f4f8ee;
  font-weight: 700;
}

.rte-editor:empty:before {
  content: attr(data-placeholder);
  color: #999;
  white-space: pre-wrap;
  pointer-events: none;
}
</style>