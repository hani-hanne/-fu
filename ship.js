// --- 1. การกำหนดค่า Config ของ SHIPPOP API ---
const SHIPPOP_CONFIG = {
    domain: "shippop.dev",
    baseUrl: "http://mkpservice.shippop.dev",
    apiKey: "dvc0a7acf2a0bce848afdcafe2d4eaf063425a4d486aaabf63f71b3f0724ef85c492fab379f7987e2c1784778615",
    marketId: "B-3376",
    name: "pichamon chongrengpean"
};

// ฟังก์ชันตัวอย่างสำหรับเรียกใช้งาน Shippop API
async function fetchShippopData() {
    try {
        const response = await fetch(`${SHIPPOP_CONFIG.baseUrl}/api/courier/information`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${SHIPPOP_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log("SHIPPOP Data Loaded:", data);
    } catch (error) {
        console.error("Error connecting to SHIPPOP API:", error);
    }
}

// --- 2. ฟังก์ชันสั่งซื้อ (อยู่นอก DOMContentLoaded เพื่อให้ HTML เรียก onclick ได้) ---
function finishOrder() {
    alert('สั่งซื้อสำเร็จ! ขอบคุณที่อุดหนุนนะคะ');
    window.location.href = 'final.html'; // ✔️ เปลี่ยนมาที่หน้าขอบคุณ
}

// --- 3. การทำงานเมื่อโหลดหน้าเว็บเสร็จ ---
document.addEventListener("DOMContentLoaded", function() {
    // จัดการดึงยอดเงินและเปลี่ยน QR Code
    const savedTotal = sessionStorage.getItem('orderTotal');
    const finalAmountEl = document.getElementById('final-amount');
    const qrImage = document.getElementById('qrImage');
    
    if (savedTotal && finalAmountEl) {
        finalAmountEl.innerText = savedTotal;
        const totalAmount = parseFloat(savedTotal);

        if (qrImage) {
            if (totalAmount === 790) {
                qrImage.src = 'img/my-qr-code-1.jpg'; // 1 เล่ม
            } else if (totalAmount === 1580) {
                qrImage.src = 'img/my-qr-code-2.jpg'; // 2 เล่ม
            } else if (totalAmount === 2370) {
                qrImage.src = 'img/my-qr-code-3.jpg'; // 3 เล่ม
            } else {
                qrImage.src = 'img/my-qr-code-1.jpg'; // ค่าเริ่มต้น
            }
        }
    }
    
    // ระบบสลับ Theme (Dark / Light Mode)
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            if (themeIcon) { 
                themeIcon.className = 'fa-solid fa-sun'; 
                themeIcon.style.color = '#f59e0b'; 
            }
        } else {
            body.classList.remove('dark-theme');
            if (themeIcon) { 
                themeIcon.className = 'fa-solid fa-moon'; 
                themeIcon.style.color = '#94a3b8'; 
            }
        }
        localStorage.setItem('selectedTheme', theme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const currentTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
            applyTheme(currentTheme);
        });
    }

    const savedTheme = localStorage.getItem('selectedTheme') || 'light';
    applyTheme(savedTheme);

    // เรียกใช้งาน API หากต้องการดึงข้อมูลตั้งแต่โหลดหน้าเว็บ
    // fetchShippopData();
});