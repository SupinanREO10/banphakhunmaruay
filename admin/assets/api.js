/* ==========================================================================
   api.js — ตัวช่วยเรียก Google Apps Script Web App จากระบบหลังบ้าน
   ต้องโหลดหลัง ../../config.js (มี API_BASE_URL) และหลัง admin-data.js
   (เพราะ loadAdminData() เขียนทับข้อมูลลงในตัวแปร ADMIN_* ที่ admin-data.js สร้างไว้)

   ⚠️ ข้อควรระวังสำคัญ: ห้ามตั้ง header 'Content-Type': 'application/json' เอง
   ตอนเรียก fetch เพราะจะทำให้เบราว์เซอร์ส่ง preflight request (OPTIONS) ก่อน ซึ่ง
   Google Apps Script Web App ไม่รองรับ/ไม่ตอบสนอง OPTIONS ทำให้คำขอ fail ทันที
   ปล่อยให้ fetch ส่ง body เป็น text/plain ตามค่าเริ่มต้น (ฝั่ง Apps Script อ่านจาก
   e.postData.contents แล้ว JSON.parse เองอยู่แล้ว ไม่มีปัญหา)
   ========================================================================== */

const ADMIN_TOKEN_KEY = 'khunmaruay_admin_token';

function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}
function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}
function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

// เรียกที่บนสุดของทุกหน้าแอดมิน (ยกเว้น login.html) เพื่อเด้งไปหน้าล็อกอินถ้ายังไม่ได้เข้าสู่ระบบ
function requireLogin() {
  if (!getAdminToken()) {
    location.href = 'login.html';
    throw new Error('REDIRECT_TO_LOGIN');
  }
}

function checkApiConfigured_() {
  if (typeof API_BASE_URL === 'undefined' || !API_BASE_URL || API_BASE_URL.indexOf('REPLACE_WITH') !== -1) {
    throw new Error('ยังไม่ได้ตั้งค่า API_BASE_URL ใน config.js — ดูคู่มือติดตั้งข้อ 2 (Deploy Apps Script Web App)');
  }
}

async function apiRequest_(action, payload, withToken) {
  checkApiConfigured_();
  const body = Object.assign({ action: action }, payload || {});
  if (withToken) body.token = getAdminToken();
  const res = await fetch(API_BASE_URL, { method: 'POST', body: JSON.stringify(body) });
  const json = await res.json();
  if (!json.ok) {
    if (json.error === 'UNAUTHORIZED') {
      clearAdminToken();
      location.href = 'login.html';
    }
    throw new Error(json.message || json.error || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ');
  }
  return json.data;
}

// เรียก action ที่ต้องล็อกอิน (แนบ token อัตโนมัติ)
function apiCall(action, payload) {
  return apiRequest_(action, payload, true);
}

// เรียก action สาธารณะ (login, storefront) ไม่ต้องแนบ token
function apiPublic(action, payload) {
  return apiRequest_(action, payload, false);
}

function replaceArrayContents(arr, items) {
  arr.length = 0;
  (items || []).forEach((item) => arr.push(item));
}

// ดึงข้อมูลทั้งหมดจาก backend มาแทนที่ข้อมูลตัวอย่างใน admin-data.js
// (ตัวแปร ADMIN_* ยังเป็น const เดิม แต่แก้ "เนื้อหา" ในอาร์เรย์แทนการสร้างใหม่)
async function loadAdminData() {
  const data = await apiCall('data.listAll', {});
  replaceArrayContents(ADMIN_PRODUCTS, data.products);
  replaceArrayContents(ADMIN_CATEGORIES, data.categories);
  replaceArrayContents(ADMIN_ORDERS, data.orders);
  replaceArrayContents(ADMIN_PROMOTIONS, data.promotions);
  replaceArrayContents(ADMIN_OPERATING_COSTS, data.operatingCosts);
  replaceArrayContents(ADMIN_CONTENT_LOG, data.contentLog);
  replaceArrayContents(ADMIN_NOTIFICATION_LOG, data.notificationLog);
  replaceArrayContents(ADMIN_SALES_7D, data.sales7d);
  replaceArrayContents(ADMIN_SALES_6M, data.sales6m);
  return data;
}

// แสดง error จาก apiCall เป็น alert ภาษาไทยอ่านง่าย (ใช้ใน catch ของทุกปุ่มบันทึก)
function showApiError(err) {
  alert('เกิดข้อผิดพลาด: ' + (err && err.message ? err.message : err));
}
