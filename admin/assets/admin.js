/* ==========================================================================
   admin.js — ฟังก์ชันกลางสำหรับระบบหลังบ้าน (ร่าง/Draft)
   สร้างเมนูด้านข้าง (sidebar) แบบสคริปต์เดียวใช้ร่วมทุกหน้า, ตัวช่วย modal/toast,
   และ helper จัดรูปแบบตัวเลข/สถานะ ทั้งหมดยังเป็นข้อมูลจำลอง ไม่เชื่อมต่อ
   Google Apps Script จริง (ดูจุด TODO ในแต่ละหน้า)
   ========================================================================== */

const NAV_ITEMS = [
  { key:"dashboard",   href:"index.html",       icon:"&#127968;", label:"แดชบอร์ด" },
  { key:"products",    href:"products.html",    icon:"&#129525;", label:"จัดการสินค้า" },
  { key:"categories",  href:"categories.html",  icon:"&#128194;", label:"หมวดหมู่สินค้า" },
  { key:"orders",      href:"orders.html",      icon:"&#128230;", label:"คำสั่งซื้อ" },
  { key:"promotions",  href:"promotions.html",  icon:"&#127991;&#65039;", label:"โปรโมชั่น" },
  { key:"costs",       href:"costs.html",       icon:"&#128176;", label:"ต้นทุน/ค่าใช้จ่าย" },
  { key:"analytics",   href:"analytics.html",   icon:"&#128200;", label:"วิเคราะห์ผลงาน" },
];

function renderSidebar(activeKey){
  const mount = document.getElementById('sidebarMount');
  if(!mount) return;

  const navHtml = NAV_ITEMS.map(item => `
    <a class="nav-item${item.key === activeKey ? ' active' : ''}" href="${item.href}">
      <span class="ic">${item.icon}</span><span>${item.label}</span>
    </a>
  `).join('');

  mount.innerHTML = `
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <img src="../logo หลัก.png" alt="โลโก้" />
        <div>
          <div class="name">บ้านผ้าคุณมารวย</div>
          <div class="sub">ระบบหลังบ้าน (ร่าง)</div>
        </div>
      </div>
      <nav>
        <div class="nav-section-label">เมนูหลัก</div>
        ${navHtml}
      </nav>
      <div class="sidebar-foot">
        กลับไปหน้าร้าน &rarr; <a href="../index.html" target="_blank" rel="noopener">เปิดเว็บแคตตาล็อก</a>
        <div class="mt-8"><a href="#" id="sidebarLogout">&#128274; ออกจากระบบ</a></div>
      </div>
    </aside>
  `;

  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const toggleBtn = document.getElementById('menuToggleBtn');
  function openSidebar(){ sidebar.classList.add('open'); overlay.classList.add('show'); }
  function closeSidebar(){ sidebar.classList.remove('open'); overlay.classList.remove('show'); }
  if(toggleBtn) toggleBtn.addEventListener('click', openSidebar);
  if(overlay) overlay.addEventListener('click', closeSidebar);

  const logoutLink = document.getElementById('sidebarLogout');
  if(logoutLink){
    logoutLink.addEventListener('click', async function(e){
      e.preventDefault();
      try { if(typeof apiCall === 'function') await apiCall('auth.logout', {}); } catch(err){ /* เซสชันอาจหมดอายุอยู่แล้ว ไม่เป็นไร */ }
      if(typeof clearAdminToken === 'function') clearAdminToken();
      location.href = 'login.html';
    });
  }
}

// ---------------- Modal helpers ----------------
function openModal(id){
  const el = document.getElementById(id);
  if(el) el.classList.add('show');
}
function closeModal(id){
  const el = document.getElementById(id);
  if(el) el.classList.remove('show');
}

// ---------------- Toast ----------------
let toastTimer = null;
function showToast(message, icon){
  let toast = document.getElementById('globalToast');
  if(!toast){
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'globalToast';
    toast.innerHTML = `<span class="ic" id="toastIcon">&#9989;</span><span id="toastMsg"></span>`;
    document.body.appendChild(toast);
  }
  document.getElementById('toastIcon').innerHTML = icon || '&#9989;';
  document.getElementById('toastMsg').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove('show'), 3200);
}

// ---------------- Safe HTML helpers ----------------
function escapeHtml(value){
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));
}

function safeAttr(value){
  return escapeHtml(value);
}

// ---------------- Formatters ----------------
function formatBaht(n){
  return Number(n).toLocaleString('th-TH') + ' บาท';
}
function formatNumber(n){
  return Number(n).toLocaleString('th-TH');
}

// ---------------- Status badge helpers ----------------
const ORDER_STATUS_BADGE = {
  "รอชำระเงิน": "badge-warn",
  "ชำระแล้ว": "badge-info",
  "จัดส่งแล้ว": "badge-ok",
  "ยกเลิก": "badge-gray",
};
const PRODUCT_STATUS_BADGE = {
  "คงเหลือ": "badge-ok",
  "มีคนจอง": "badge-warn",
  "ของหมด": "badge-gray",
  "ขายแล้ว": "badge-gray",
};
const PROMO_STATUS_BADGE = {
  "เปิดใช้งาน": "badge-ok",
  "หมดอายุ": "badge-gray",
  "ปิดใช้งาน": "badge-gray",
};

function badgeHtml(text, cls){
  return `<span class="badge ${safeAttr(cls)}">${escapeHtml(text)}</span>`;
}

// ---------------- Publish channel icons (ใช้ในหน้าจัดการสินค้า) ----------------
const CHANNEL_ICON = {
  line: { label:"LINE OA", icon:"&#128172;" },
  fb1:  { label:"เพจบ้านผ้าคุณมารวย", icon:"&#128240;" },
  fb2:  { label:"เพจไหมใหม่ไม่ใหม่", icon:"&#128240;" },
  web:  { label:"เว็บแคตตาล็อก", icon:"&#127760;" },
};

/* ==========================================================================
   ฟิลด์สเปกสินค้าแบบไดนามิกตามหมวด + การจับคู่รหัสสีอัตโนมัติ
   ใช้ในหน้าจัดการสินค้า (products.html) — ตามรายการฟิลด์ที่ผู้ใช้กำหนด
   ========================================================================== */

const GARMENT_FINISH_OPTIONS = ["อัดกาว","ไม่อัดกาว","ซับใน"];

const SPEC_TEMPLATES = {
  "ผ้าไหมพรีเมี่ยม": { kind:"silk", subtypeOptions:["ขิดยกดอก","ยกดอกลำพูน","ยกดอกสุรินทร์"] },
  "ผ้าไหม": { kind:"silk", subtypeOptions:["มัดหมี่ 3 ตะกอ","มัดหมี่ 2 ตะกอ","ผ้าสีพื้น","ผ้าสีพื้นเกรดเพชร","ผ้าตัดชุด 3 ตะกอ","ผ้าตัดชุด 2 ตะกอ"] },
  "เสื้อ": { kind:"measure", measures:["อก","เอว","ยาว"] },
  "กางเกง": { kind:"measure", measures:["เอว","สะโพก","ยาว"] },
  "ผ้าถุง/กระโปรง": { kind:"measure", measures:["เอว","สะโพก","ยาว"] },
  "เดรส": { kind:"measure", measures:["อก","เอว","สะโพก","ยาว"] },
  // สองหมวดนี้ผู้ใช้ยังไม่ได้ระบุฟิลด์ชัดเจน — ใช้แบบฟอร์มผ้าไหมทั่วไป (ไม่มีตัวเลือกประเภทย่อย) เป็นค่าเริ่มต้นไปก่อน
  "ผ้าไหมกรอบรูปที่ระลึก": { kind:"silk", subtypeOptions:[] },
  "ผ้าพันคอ/คลุมไหล่": { kind:"silk", subtypeOptions:[] },
};

// ตารางเทียบชื่อสี (ภาษาไทย) เป็นรหัสสี — ชุดตัวอย่าง แอดมินปรับ/เพิ่มเองได้เสมอผ่านช่อง "รหัสสี"
const THAI_COLOR_MAP = {
  "ทองอิฐ":"#b5622c", "แดงอิฐ":"#b5432b", "เบจ":"#f0e6cf", "ครีม":"#f5eedc",
  "ไข่ไก่":"#f0e2b6", "งาช้าง":"#fff5e1", "หงส์เหิน":"#fff5e1",
  "น้ำตาลเข้ม":"#4a2f1d", "น้ำตาลอ่อน":"#a9784c", "น้ำตาล":"#6b4a30",
  "ม่วงเปลือกมังคุด":"#5b3758", "ม่วง":"#6a4c93", "บานเย็น":"#e0218a",
  "เขียวมรกต":"#0f6b4c", "เขียวขี้ม้า":"#6b6b3a", "เขียว":"#2e7d32",
  "แดงเลือดหมู":"#6e0f17", "แดง":"#c62828",
  "กรมท่าเข้ม":"#142a44", "กรมท่า":"#1b3a57", "น้ำเงิน":"#1e3a8a", "ฟ้า":"#7ec8e3",
  "เหลือง":"#f4d35e", "ส้ม":"#e67e22", "พีช":"#ffdab9",
  "ดำ":"#1a1a1a", "ขาว":"#fafafa", "เทา":"#9a9a9a", "กากี":"#c3b091",
  "ทองคำ":"#d4af37", "ทอง":"#c9a227", "เงิน":"#c0c0c0", "ทองแดง":"#b87333",
  "มอคค่า":"#6f4e37", "ชมพูโบราณ":"#d89aa0", "ชมพู":"#e8a0bf",
};

function matchColor(input){
  if(!input) return null;
  const norm = input.trim();
  if(!norm) return null;
  if(THAI_COLOR_MAP[norm]) return { name: norm, hex: THAI_COLOR_MAP[norm] };
  const keys = Object.keys(THAI_COLOR_MAP);
  const found = keys.find(k => norm.includes(k) || k.includes(norm));
  return found ? { name: found, hex: THAI_COLOR_MAP[found] } : null;
}

function defectFieldHtml(){
  return `
    <div class="form-field full">
      <label>ตำหนิ</label>
      <div class="checkbox-group">
        <label class="checkbox-row"><input type="radio" name="specDefect" value="ไม่มี" checked onchange="toggleDefectNote()" /> ไม่มีตำหนิ</label>
        <label class="checkbox-row"><input type="radio" name="specDefect" value="มี" onchange="toggleDefectNote()" /> มีตำหนิ</label>
      </div>
      <input type="text" id="specDefectNote" placeholder="ระบุรายละเอียดตำหนิ เช่น มีจุดสีตกที่ชายผ้า" style="display:none; margin-top:8px;" />
    </div>`;
}

function toggleDefectNote(){
  const checked = document.querySelector('input[name="specDefect"]:checked');
  const note = document.getElementById('specDefectNote');
  if(!note) return;
  note.style.display = (checked && checked.value === 'มี') ? 'block' : 'none';
}

function updateColorSwatch(){
  const input = document.getElementById('specColorName');
  const swatch = document.getElementById('specColorSwatch');
  const hexInput = document.getElementById('specColorHex');
  if(!input || !swatch) return;
  const match = matchColor(input.value);
  if(match){
    swatch.innerHTML = `<span style="display:inline-block; width:18px; height:18px; border-radius:5px; background:${safeAttr(match.hex)}; border:1px solid var(--border);"></span> จับคู่: ${escapeHtml(match.name)}`;
    if(hexInput) hexInput.value = match.hex;
  } else if(input.value.trim()){
    swatch.innerHTML = `<span style="color:var(--warn);">&#9888;&#65039; ไม่พบสีที่ตรงกัน กรุณาเลือกรหัสสีเทียบเคียงเอง</span>`;
  } else {
    swatch.innerHTML = '';
  }
}

// สร้าง HTML ของฟิลด์สเปกตามหมวดสินค้า (เรียกใหม่ทุกครั้งที่แอดมินเปลี่ยน "ประเภทสินค้า")
function specFieldsHtml(typeName){
  const tpl = SPEC_TEMPLATES[typeName];
  if(!tpl){
    return `<div class="form-field full"><label>รายละเอียดเพิ่มเติม</label><textarea id="specNotesFallback" placeholder="รายละเอียดสินค้า"></textarea></div>`;
  }
  if(tpl.kind === 'silk'){
    const subtypeField = (tpl.subtypeOptions && tpl.subtypeOptions.length) ? `
      <div class="form-field">
        <label>ประเภท *</label>
        <select id="specSubtype">
          ${tpl.subtypeOptions.map(o => `<option value="${o}">${o}</option>`).join('')}
        </select>
      </div>` : '';
    return `
      ${subtypeField}
      <div class="form-field">
        <label>ลาย</label>
        <input type="text" id="specPattern" placeholder="เช่น ลายดอกพิกุล" />
      </div>
      <div class="form-field">
        <label>สี</label>
        <input type="text" id="specColorName" placeholder="เช่น ทองอิฐ, ม่วงเปลือกมังคุด" oninput="updateColorSwatch()" />
        <div class="mt-8" id="specColorSwatch" style="display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--muted);"></div>
      </div>
      <div class="form-field">
        <label>รหัสสี (ปรับได้หากระบบเทียบไม่ตรง)</label>
        <div style="display:flex; align-items:center; gap:10px;">
          <input type="color" id="specColorHex" value="#c9a227" style="width:46px; height:40px; border:1px solid var(--border); border-radius:8px; padding:2px; cursor:pointer;" />
          <span class="hint">แอดมินปรับสีเองได้เสมอ</span>
        </div>
      </div>
      <div class="form-field">
        <label>ขนาด (ซม.)</label>
        <div style="display:flex; align-items:center; gap:8px;">
          <input type="number" id="specWidth" min="0" placeholder="กว้าง" style="width:100%;" />
          <span>&times;</span>
          <input type="number" id="specLength" min="0" placeholder="ยาว" style="width:100%;" />
        </div>
      </div>
      ${defectFieldHtml()}
    `;
  }
  if(tpl.kind === 'measure'){
    const measureInputs = tpl.measures.map(m => `
      <div class="form-field">
        <label>${m} (นิ้ว)</label>
        <input type="number" min="0" step="0.5" id="specMeasure_${m}" placeholder="เช่น 34" />
      </div>`).join('');
    const finishChecks = GARMENT_FINISH_OPTIONS.map(o => `
      <label class="checkbox-row"><input type="checkbox" class="spec-finish" value="${o}" /> ${o}</label>`).join('');
    return `
      <div class="form-field full">
        <label>ประเภท (เลือกได้หลายข้อ)</label>
        <div class="checkbox-group">${finishChecks}</div>
      </div>
      ${measureInputs}
      <div class="form-field full">
        <label>อื่นๆ</label>
        <textarea id="specNotes" placeholder="รายละเอียดเพิ่มเติม"></textarea>
      </div>
      ${defectFieldHtml()}
    `;
  }
  return '';
}

// รวบรวมค่าจากฟอร์มสเปกเป็น object (เรียกตอนกดบันทึก/เผยแพร่สินค้า)
function collectSpecFromForm(typeName){
  const tpl = SPEC_TEMPLATES[typeName];
  if(!tpl){
    const fallback = document.getElementById('specNotesFallback');
    return fallback ? { notes: fallback.value.trim() } : {};
  }
  const defectChecked = document.querySelector('input[name="specDefect"]:checked');
  const defect = defectChecked ? defectChecked.value : 'ไม่มี';
  const defectNoteEl = document.getElementById('specDefectNote');
  const defectNote = (defect === 'มี' && defectNoteEl) ? defectNoteEl.value.trim() : '';

  if(tpl.kind === 'silk'){
    const subtypeEl = document.getElementById('specSubtype');
    return {
      kind: 'silk',
      subtype: subtypeEl ? subtypeEl.value : '',
      pattern: (document.getElementById('specPattern') || {}).value || '',
      colorName: (document.getElementById('specColorName') || {}).value || '',
      colorHex: (document.getElementById('specColorHex') || {}).value || '',
      width: Number((document.getElementById('specWidth') || {}).value) || 0,
      length: Number((document.getElementById('specLength') || {}).value) || 0,
      defect, defectNote,
    };
  }
  if(tpl.kind === 'measure'){
    const finish = Array.from(document.querySelectorAll('.spec-finish:checked')).map(cb => cb.value);
    const measurements = {};
    tpl.measures.forEach(m => {
      const el = document.getElementById('specMeasure_' + m);
      measurements[m] = el ? (Number(el.value) || 0) : 0;
    });
    return {
      kind: 'measure',
      finish, measurements,
      notes: (document.getElementById('specNotes') || {}).value || '',
      defect, defectNote,
    };
  }
  return {};
}

// เติมค่าสเปกเดิมกลับเข้าฟอร์ม (เรียกหลัง specFieldsHtml render แล้ว ตอนแก้ไขสินค้าเดิม)
function fillSpecToForm(typeName, spec){
  if(!spec) return;
  const tpl = SPEC_TEMPLATES[typeName];
  if(!tpl){
    const fallback = document.getElementById('specNotesFallback');
    if(fallback) fallback.value = spec.notes || '';
    return;
  }
  if(tpl.kind === 'silk'){
    if(document.getElementById('specSubtype')) document.getElementById('specSubtype').value = spec.subtype || '';
    if(document.getElementById('specPattern')) document.getElementById('specPattern').value = spec.pattern || '';
    if(document.getElementById('specColorName')) document.getElementById('specColorName').value = spec.colorName || '';
    if(document.getElementById('specColorHex')) document.getElementById('specColorHex').value = spec.colorHex || '#c9a227';
    if(document.getElementById('specWidth')) document.getElementById('specWidth').value = spec.width || '';
    if(document.getElementById('specLength')) document.getElementById('specLength').value = spec.length || '';
    updateColorSwatch();
  }
  if(tpl.kind === 'measure'){
    document.querySelectorAll('.spec-finish').forEach(cb => cb.checked = (spec.finish || []).includes(cb.value));
    tpl.measures.forEach(m => {
      const el = document.getElementById('specMeasure_' + m);
      if(el && spec.measurements) el.value = spec.measurements[m] || '';
    });
    if(document.getElementById('specNotes')) document.getElementById('specNotes').value = spec.notes || '';
  }
  const defectRadio = document.querySelector(`input[name="specDefect"][value="${spec.defect || 'ไม่มี'}"]`);
  if(defectRadio) defectRadio.checked = true;
  if(document.getElementById('specDefectNote')) document.getElementById('specDefectNote').value = spec.defectNote || '';
  toggleDefectNote();
}

// สรุปสเปกแบบย่อไว้แสดงในตารางสินค้า
// สร้าง "ชื่อสินค้า" อัตโนมัติจากประเภท + สเปกที่กรอก (แอดมินไม่ต้องพิมพ์ชื่อเอง)
function composeProductName(typeName, spec){
  if(!typeName) return '';
  const tpl = SPEC_TEMPLATES[typeName];
  if(!tpl || !spec) return typeName;
  const parts = [typeName];
  if(tpl.kind === 'silk'){
    if(spec.subtype) parts.push(spec.subtype);
    if(spec.pattern) parts.push('ลาย' + spec.pattern);
    if(spec.colorName) parts.push('สี' + spec.colorName);
  } else if(tpl.kind === 'measure'){
    if(spec.finish && spec.finish.length) parts.push(spec.finish.join('/'));
    if(spec.notes) parts.push(spec.notes);
  } else if(spec.notes){
    parts.push(spec.notes);
  }
  return parts.join(' ');
}

function specSummaryHtml(spec){
  if(!spec || Object.keys(spec).length === 0) return '<span class="cell-muted">-</span>';
  const parts = [];
  if(spec.kind === 'silk'){
    if(spec.subtype) parts.push(spec.subtype);
    if(spec.pattern) parts.push('ลาย ' + spec.pattern);
    if(spec.colorName) parts.push('สี ' + spec.colorName);
    if(spec.width && spec.length) parts.push(spec.width + 'x' + spec.length + ' ซม.');
  } else if(spec.kind === 'measure'){
    if(spec.measurements){
      const ms = Object.entries(spec.measurements).filter(([k,v]) => v).map(([k,v]) => `${k} ${v}`).join(' / ');
      if(ms) parts.push(ms + ' นิ้ว');
    }
    if(spec.finish && spec.finish.length) parts.push(spec.finish.join(', '));
  } else if(spec.notes){
    parts.push(spec.notes);
  }
  let html = `<span class="cell-muted">${escapeHtml(parts.join(' · ') || '-')}</span>`;
  if(spec.defect === 'มี'){
    html += `<div class="mt-8"><span class="badge badge-danger">&#9888;&#65039; มีตำหนิ</span></div>`;
  }
  return html;
}
