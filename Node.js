const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

// ฟังก์ชันจะทำงานอัตโนมัติทันทีที่มีออเดอร์ใหม่ถูกบันทึกใน Firestore (collection ชื่อ orders)
exports.sendOrderToShippop = functions.firestore
    .document("orders/{orderId}")
    .onCreate(async (snap, context) => {
        const orderData = snap.data();
        
        // ข้อมูลการเชื่อมต่อ API ตามที่คุณให้มา
        const apiKey = "dvc0a7acf2a0bce848afdcafe2d4eaf063425a4d486aaabf63f71b3f0724ef85c492fab379f7987e2c1784778615"; 
        const url = "http://mkpservice.shippop.dev/v1/create_order"; // (เปลี่ยน Endpoint ตามคู่มือ Postman ของคุณถ้าจำเป็น)

        // รวมร่างที่อยู่ที่แยกช่องกันให้อยู่ในบรรทัดเดียวกัน
        const houseNo = orderData.address || "";       // บ้านเลขที่ / รายละเอียด
        const subDistrict = orderData.subdistrict || ""; // ตำบล/แขวง
        const district = orderData.district || "";       // อำเภอ/เขต
        const province = orderData.province || "";       // จังหวัด

        const fullAddress = `${houseNo} ตำบล/แขวง ${subDistrict} อำเภอ/เขต ${district} จังหวัด ${province}`.trim();

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + apiKey
                },
                body: JSON.stringify({
                    origin: {
                        name: "ชื่อร้านของคุณ",
                        phone: "เบอร์ร้านของคุณ",
                        address: "ที่อยู่ต้นทางร้านของคุณ",
                        postcode: "10400"
                    },
                    destination: {
                        name: orderData.name,       // ชื่อลูกค้าจากฟอร์ม
                        phone: orderData.phone,     // เบอร์โทรลูกค้า
                        address: fullAddress,       // ที่อยู่ที่รวมร่างแล้ว
                        postcode: orderData.zipcode // รหัสไปรษณีย์ลูกค้า
                    }
                })
            });

            const result = await response.json();
            console.log("ส่งข้อมูลไป SHIPPOP สำเร็จ:", result);
            return null;
            
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการส่งข้อมูลไป SHIPPOP:", error);
            return null;
        }
    });