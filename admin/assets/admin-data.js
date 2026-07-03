/* ==========================================================================
   admin-data.js — ข้อมูลตัวอย่าง (Mock Data) สำหรับระบบหลังบ้าน (ร่าง/Draft)
   TODO: แทนที่ทั้งหมดนี้ด้วยการดึงข้อมูลจริงจาก Google Sheets ผ่าน Google Apps
   Script (Web App API) ตามโครงสร้างแท็บใน handover.md ส่วนที่ 3
   โครงสร้างฟิลด์ด้านล่างออกแบบให้ตรงกับคอลัมน์ในแต่ละแท็บของ Google Sheet
   เพื่อให้สลับไปใช้ข้อมูลจริงได้ง่ายที่สุด
   ========================================================================== */

// ---------------- categories (ตรงกับแท็บ categories) ----------------
const ADMIN_CATEGORIES = [
  { code:"N-PSILK", mainCat:"new",    name:"ผ้าไหมพรีเมี่ยม",        order:1, highlight:true,  status:"เปิด" },
  { code:"N-SILK",  mainCat:"new",    name:"ผ้าไหม",                  order:2, highlight:false, status:"เปิด" },
  { code:"N-SHIRT", mainCat:"new",    name:"เสื้อ",                    order:3, highlight:false, status:"เปิด" },
  { code:"N-SKIRT", mainCat:"new",    name:"ผ้าถุง/กระโปรง",          order:4, highlight:false, status:"เปิด" },
  { code:"N-PANT",  mainCat:"new",    name:"กางเกง",                  order:5, highlight:false, status:"เปิด" },
  { code:"N-DRESS", mainCat:"new",    name:"เดรส",                    order:6, highlight:false, status:"เปิด" },
  { code:"N-FRAME", mainCat:"new",    name:"ผ้าไหมกรอบรูปที่ระลึก",   order:7, highlight:false, status:"เปิด" },
  { code:"N-SCARF", mainCat:"new",    name:"ผ้าพันคอ/คลุมไหล่",       order:8, highlight:false, status:"เปิด" },
  { code:"U-SILK",  mainCat:"second", name:"ผ้าไหม",                  order:1, highlight:false, status:"เปิด" },
  { code:"U-SHIRT", mainCat:"second", name:"เสื้อ",                    order:2, highlight:false, status:"เปิด" },
  { code:"U-SKIRT", mainCat:"second", name:"ผ้าถุง/กระโปรง",          order:3, highlight:false, status:"เปิด" },
  { code:"U-PANT",  mainCat:"second", name:"กางเกง",                  order:4, highlight:false, status:"เปิด" },
  { code:"U-DRESS", mainCat:"second", name:"เดรส",                    order:5, highlight:false, status:"เปิด" },
  { code:"U-FRAME", mainCat:"second", name:"ผ้าไหมกรอบรูปที่ระลึก",   order:6, highlight:false, status:"เปิด" },
  { code:"U-SCARF", mainCat:"second", name:"ผ้าพันคอ/คลุมไหล่",       order:7, highlight:false, status:"ปิด" },
];

// ---------------- products (ตรงกับแท็บ products) ----------------
// field "cost" = ต้นทุนสินค้าต่อชิ้น (บาท), field "spec" = สเปกละเอียดตามหมวด (ดู SPEC_TEMPLATES ใน admin.js)
const ADMIN_PRODUCTS = [
  { code:"N-PSILK-0001", name:"ผ้าไหมพรีเมี่ยมยกดอก ทอมือแท้ 100%", mainCat:"new", type:"ผ้าไหมพรีเมี่ยม", price:8500, cost:4200, stock:3, status:"คงเหลือ", highlight:true, publishedTo:["line","fb1","web"], updated:"2026-07-02",
    spec:{ kind:"silk", subtype:"ขิดยกดอก", pattern:"ลายพิกุลทอง", colorName:"ทองอิฐ", colorHex:"#b5622c", width:100, length:220, defect:"ไม่มี", defectNote:"" } },
  { code:"N-PSILK-0002", name:"ผ้าไหมพรีเมี่ยมมัดหมี่ ลายราชสำนัก", mainCat:"new", type:"ผ้าไหมพรีเมี่ยม", price:9900, cost:4800, stock:1, status:"คงเหลือ", highlight:true, publishedTo:["line","web"], updated:"2026-07-01",
    spec:{ kind:"silk", subtype:"ยกดอกลำพูน", pattern:"ลายราชสำนัก", colorName:"กรมท่าเข้ม", colorHex:"#142a44", width:110, length:230, defect:"มี", defectNote:"มีจุดสีไม่สม่ำเสมอเล็กน้อยที่มุมผ้า ประมาณ 2 ซม." } },
  { code:"N-SILK-0001",  name:"ผ้าไหมมัดหมี่ลายโบราณ สีทองอิฐ", mainCat:"new", type:"ผ้าไหม", price:3900, cost:2100, stock:6, status:"คงเหลือ", highlight:false, publishedTo:["line","fb1","web"], updated:"2026-06-29",
    spec:{ kind:"silk", subtype:"มัดหมี่ 3 ตะกอ", pattern:"ลายโบราณ", colorName:"ทองอิฐ", colorHex:"#b5622c", width:90, length:200, defect:"ไม่มี", defectNote:"" } },
  { code:"N-DRESS-0004", name:"เดรสผ้าไหมทรงสุภาพ สีเบจนวล", mainCat:"new", type:"เดรส", price:5200, cost:2600, stock:2, status:"คงเหลือ", highlight:false, publishedTo:["fb1","web"], updated:"2026-06-27",
    spec:{ kind:"measure", finish:["ซับใน"], measurements:{"อก":34,"เอว":28,"สะโพก":36,"ยาว":40}, notes:"ทรงสุภาพ ใส่ทำงานได้", defect:"ไม่มี", defectNote:"" } },
  { code:"N-SHIRT-0012", name:"เสื้อผ้าไหมแขนสามส่วน ปักลายไทย", mainCat:"new", type:"เสื้อ", price:2450, cost:1300, stock:0, status:"ของหมด", highlight:false, publishedTo:["web"], updated:"2026-06-20",
    spec:{ kind:"measure", finish:["อัดกาว"], measurements:{"อก":36,"เอว":30,"ยาว":24}, notes:"แขนสามส่วน ปักลายไทยที่อก", defect:"ไม่มี", defectNote:"" } },
  { code:"N-SKIRT-0007", name:"ผ้าถุงไหมทอมือ ลายดอกพิกุล", mainCat:"new", type:"ผ้าถุง/กระโปรง", price:3200, cost:1700, stock:4, status:"คงเหลือ", highlight:false, publishedTo:["line","web"], updated:"2026-06-18" },
  { code:"U-SILK-0015",  name:"ผ้าไหมมือสอง ลายโบราณหายาก", mainCat:"second", type:"ผ้าไหม", price:2500, cost:1200, stock:1, status:"คงเหลือ", highlight:false, publishedTo:["fb2","web"], updated:"2026-06-30" },
  { code:"U-DRESS-0021", name:"เดรสผ้าไทยมือสอง สภาพดี ทรงคลาสสิก", mainCat:"second", type:"เดรส", price:1800, cost:900, stock:0, status:"ขายแล้ว", highlight:false, publishedTo:["fb2"], updated:"2026-06-15" },
  { code:"U-SHIRT-0006",name:"เสื้อคลุมผ้าไหมมือสอง สีม่วงเปลือกมังคุด", mainCat:"second", type:"เสื้อ", price:1650, cost:800, stock:1, status:"มีคนจอง", highlight:false, publishedTo:["line","fb2"], updated:"2026-06-10" },
];

// ---------------- orders (ตรงกับแท็บ orders) ----------------
const ADMIN_ORDERS = [
  { orderId:"ORD-1042", customer:"คุณสมศรี ใจดี", lineUser:"@somsri88", productCode:"N-PSILK-0001", productName:"ผ้าไหมพรีเมี่ยมยกดอก ทอมือแท้ 100%", amount:8500, status:"รอชำระเงิน", date:"2026-07-03", tracking:"" },
  { orderId:"ORD-1041", customer:"คุณวิไล พรสวรรค์", lineUser:"@wilai_p", productCode:"N-DRESS-0004", productName:"เดรสผ้าไหมทรงสุภาพ สีเบจนวล", amount:5200, status:"ชำระแล้ว", date:"2026-07-02", tracking:"" },
  { orderId:"ORD-1040", customer:"คุณประภา รุ่งเรือง", lineUser:"@prapa_r", productCode:"U-SILK-0015", productName:"ผ้าไหมมือสอง ลายโบราณหายาก", amount:2500, status:"จัดส่งแล้ว", date:"2026-06-30", tracking:"TH1234567890" },
  { orderId:"ORD-1039", customer:"คุณมาลี ทองดี", lineUser:"@malee_t", productCode:"N-SILK-0001", productName:"ผ้าไหมมัดหมี่ลายโบราณ สีทองอิฐ", amount:3900, status:"จัดส่งแล้ว", date:"2026-06-28", tracking:"TH1234500001" },
  { orderId:"ORD-1038", customer:"คุณสุดา แสงจันทร์", lineUser:"@suda_s", productCode:"U-SHIRT-0006", productName:"เสื้อคลุมผ้าไหมมือสอง สีม่วงเปลือกมังคุด", amount:1650, status:"รอชำระเงิน", date:"2026-06-27", tracking:"" },
  { orderId:"ORD-1037", customer:"คุณอรทัย ศรีสุข", lineUser:"@orathai_s", productCode:"N-SKIRT-0007", productName:"ผ้าถุงไหมทอมือ ลายดอกพิกุล", amount:3200, status:"ยกเลิก", date:"2026-06-24", tracking:"" },
  { orderId:"ORD-1036", customer:"คุณกัลยา บุญมี", lineUser:"@kanlaya_b", productCode:"U-DRESS-0021", productName:"เดรสผ้าไทยมือสอง สภาพดี ทรงคลาสสิก", amount:1800, status:"จัดส่งแล้ว", date:"2026-06-20", tracking:"TH1234400002" },
];

// ---------------- promotions (ตรงกับแท็บ promotions) ----------------
const ADMIN_PROMOTIONS = [
  { code:"PROMO001", name:"ลดต้อนรับสมาชิกใหม่", type:"เปอร์เซ็นต์", discount:"10%", condition:"ซื้อครบ 1,000 บาท", start:"2026-07-01", end:"2026-07-31", channel:"LINE + เว็บ", status:"เปิดใช้งาน" },
  { code:"PROMO002", name:"Flash Sale ผ้าไหมพรีเมี่ยม", type:"เปอร์เซ็นต์", discount:"15%", condition:"เฉพาะสมาชิก LINE วันนี้เท่านั้น", start:"2026-07-03", end:"2026-07-03", channel:"LINE", status:"เปิดใช้งาน" },
  { code:"PROMO003", name:"ส่งฟรีทั่วประเทศ", type:"ส่งฟรี", discount:"ค่าส่ง 0 บาท", condition:"ซื้อครบ 2,500 บาท", start:"2026-06-15", end:"2026-07-15", channel:"LINE + เว็บ + เพจ", status:"เปิดใช้งาน" },
  { code:"PROMO004", name:"ลดล้างสต็อกสินค้ามือสอง", type:"บาท", discount:"ลด 200 บาท", condition:"สินค้าหมวดมือสองทุกชิ้น", start:"2026-05-01", end:"2026-05-31", channel:"เพจไหมใหม่ไม่ใหม่", status:"หมดอายุ" },
];

// ---------------- ยอดขาย 7 วันล่าสุด (ใช้ในแดชบอร์ด — mock) ----------------
const ADMIN_SALES_7D = [
  { day:"27 มิ.ย.", value:2400 },
  { day:"28 มิ.ย.", value:5200 },
  { day:"29 มิ.ย.", value:3900 },
  { day:"30 มิ.ย.", value:6400 },
  { day:"1 ก.ค.",  value:1800 },
  { day:"2 ก.ค.",  value:5200 },
  { day:"3 ก.ค.",  value:4200 },
];

// ---------------- ยอดขายรายเดือน 6 เดือนล่าสุด แยกใหม่/มือสอง (ใช้ในหน้าวิเคราะห์ — mock) ----------------
const ADMIN_SALES_6M = [
  { month:"ก.พ. 69", newAmount:29000, secondAmount:13000 },
  { month:"มี.ค. 69", newAmount:26000, secondAmount:12000 },
  { month:"เม.ย. 69", newAmount:35000, secondAmount:16000 },
  { month:"พ.ค. 69", newAmount:31000, secondAmount:16000 },
  { month:"มิ.ย. 69", newAmount:44000, secondAmount:19000 },
  { month:"ก.ค. 69 (เดือนนี้)", newAmount:11000, secondAmount:4600 },
];

// ---------------- ต้นทุนการดำเนินการ (operating costs) — TODO: เชื่อมแท็บใหม่ใน Google Sheet ----------------
const ADMIN_OPERATING_COSTS = [
  { code:"OPEX001", category:"แพ็กเกจ LINE OA", item:"LINE OA แพ็กเกจ Basic", amount:1280, frequency:"รายเดือน", date:"2026-07-01", note:"Broadcast ได้ 15,000 ข้อความ/เดือน" },
  { code:"OPEX002", category:"โดเมนเนม", item:"ค่าโดเมน khunmaruay.com", amount:450, frequency:"รายปี", date:"2026-01-15", note:"ต่ออายุปีละครั้ง" },
  { code:"OPEX003", category:"คลังภาพ/ลายน้ำ", item:"Cloudinary แพ็กเกจใช้งาน", amount:0, frequency:"รายเดือน", date:"2026-07-01", note:"ยังอยู่แพ็กเกจฟรี (มีโควตา) — อัปเกรดเมื่อภาพเยอะขึ้น" },
  { code:"OPEX004", category:"บรรจุภัณฑ์/ค่าส่ง", item:"ถุง/กล่องพัสดุ + ค่าส่งเฉลี่ยต่อออเดอร์", amount:65, frequency:"ต่อออเดอร์", date:"2026-07-01", note:"เฉลี่ยจากค่าส่งจริงเดือนที่ผ่านมา" },
  { code:"OPEX005", category:"การตลาด/โฆษณา", item:"ยิงโฆษณาเฟซบุ๊กช่วงเปิดตัว LINE OA", amount:1500, frequency:"ครั้งเดียว", date:"2026-06-20", note:"แคมเปญย้ายลูกค้าเข้า LINE" },
  { code:"OPEX006", category:"อื่นๆ", item:"ค่าธรรมเนียมโอนเงิน/PromptPay", amount:120, frequency:"รายเดือน", date:"2026-07-01", note:"ประมาณการจากยอดธุรกรรม" },
];

// ---------------- บันทึกการเผยแพร่คอนเทนต์ (LINE OA + เพจเฟซบุ๊ก + เว็บ) — TODO: เชื่อมแท็บ broadcast_log จริง ----------------
const ADMIN_CONTENT_LOG = [
  { date:"2026-07-02 18:30", channel:"line", type:"สินค้าใหม่", title:"ผ้าไหมพรีเมี่ยมยกดอก ทอมือแท้ 100%", reach:412, engagement:58 },
  { date:"2026-07-02 18:31", channel:"fb1", type:"สินค้าใหม่", title:"ผ้าไหมพรีเมี่ยมยกดอก ทอมือแท้ 100%", reach:960, engagement:74 },
  { date:"2026-07-01 09:00", channel:"line", type:"โปรโมชั่น", title:"Flash Sale ผ้าไหมพรีเมี่ยม ลด 15%", reach:498, engagement:121 },
  { date:"2026-06-30 20:00", channel:"fb2", type:"สินค้ามือสอง", title:"ผ้าไหมมือสอง ลายโบราณหายาก", reach:640, engagement:52 },
  { date:"2026-06-29 12:00", channel:"web", type:"วนซ้ำสินค้า", title:"ผ้าไหมมัดหมี่ลายโบราณ สีทองอิฐ", reach:210, engagement:9 },
  { date:"2026-06-28 08:15", channel:"line", type:"แจ้งพัสดุ", title:"แจ้งเลขพัสดุ ORD-1039", reach:1, engagement:1 },
  { date:"2026-06-27 19:00", channel:"fb1", type:"สินค้าใหม่", title:"เดรสผ้าไหมทรงสุภาพ สีเบจนวล", reach:1120, engagement:96 },
  { date:"2026-06-24 10:00", channel:"fb2", type:"วนซ้ำสินค้า", title:"เสื้อคลุมผ้าไหมมือสอง สีม่วงเปลือกมังคุด", reach:530, engagement:41 },
  { date:"2026-06-20 21:00", channel:"line", type:"สินค้าใหม่", title:"เสื้อผ้าไหมแขนสามส่วน ปักลายไทย", reach:380, engagement:33 },
  { date:"2026-06-18 17:45", channel:"web", type:"สินค้าใหม่", title:"ผ้าถุงไหมทอมือ ลายดอกพิกุล", reach:180, engagement:7 },
];

// ---------------- บันทึกการแจ้งเตือนลูกค้า (เลขพัสดุ/ขอรีวิว) — TODO: เชื่อมกับ LINE Messaging API จริง ----------------
const ADMIN_NOTIFICATION_LOG = [
  { date:"2026-06-30 14:20", orderId:"ORD-1040", customer:"คุณประภา รุ่งเรือง", channel:"LINE", type:"แจ้งเลขพัสดุ", tracking:"TH1234567890", message:"พัสดุของคุณจัดส่งแล้วค่ะ! หมายเลขพัสดุ TH1234567890 ตรวจสอบสถานะได้ที่ลิงก์ติดตามพัสดุ ขอบคุณที่อุดหนุนบ้านผ้าคุณมารวยค่ะ" },
  { date:"2026-06-28 08:15", orderId:"ORD-1039", customer:"คุณมาลี ทองดี", channel:"LINE", type:"แจ้งเลขพัสดุ", tracking:"TH1234500001", message:"พัสดุของคุณจัดส่งแล้วค่ะ! หมายเลขพัสดุ TH1234500001 ตรวจสอบสถานะได้ที่ลิงก์ติดตามพัสดุ ขอบคุณที่อุดหนุนบ้านผ้าคุณมารวยค่ะ" },
  { date:"2026-06-23 10:05", orderId:"ORD-1036", customer:"คุณกัลยา บุญมี", channel:"LINE", type:"ขอรีวิวสินค้า", tracking:"TH1234400002", message:"ของถึงมือลูกค้าแล้วหรือยังคะ ร้านขอรบกวนขอรีวิว/ภาพใส่จริงเพื่อเป็นกำลังใจให้ร้านด้วยนะคะ ขอบคุณค่ะ" },
];
