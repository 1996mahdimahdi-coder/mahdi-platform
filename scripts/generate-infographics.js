/**
 * Script to generate infographic images using Node.js Canvas/SVG
 * Run with: node scripts/generate-infographics.js
 */

const fs = require("fs");
const path = require("path");

// Ensure blog directory exists
const blogDir = path.join(__dirname, "..", "public", "blog");
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
  console.log("Created directory:", blogDir);
}

// Professional SVG infographic templates
const infographics = [
  {
    filename: "ecommerce-stats-infographic.png",
    svg: `<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>
        <linearGradient id="indigo" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#6366f1" />
          <stop offset="100%" stop-color="#a855f7" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)" />
      <text x="600" y="80" text-anchor="middle" font-family="Arial" font-size="42" font-weight="bold" fill="#fff">التجارة الإلكترونية في الجزائر 2025</text>
      <text x="600" y="120" text-anchor="middle" font-family="Arial" font-size="20" fill="#94a3b8">أرقام رسمية من وزارة البريد والـ ONS</text>
      <g transform="translate(100, 200)">
        <rect x="0" y="0" width="280" height="180" rx="20" fill="url(#indigo)" />
        <text x="140" y="60" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#fff">حجم السوق</text>
        <text x="140" y="120" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="#fff">3.2 مليار $</text>
        <text x="140" y="150" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">2024</text>
      </g>
      <g transform="translate(460, 200)">
        <rect x="0" y="0" width="280" height="180" rx="20" fill="#10b981" />
        <text x="140" y="60" text-anchor="middle" font-family="Arial" font-size="22" font-weight="bold" fill="#fff">معدل النمو</text>
        <text x="140" y="120" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="#fff">23%</text>
        <text x="140" y="150" text-anchor="middle" font-family="Arial" font-size="14" fill="#d1fae5">سنوياً</text>
      </g>
      <g transform="translate(820, 200)">
        <rect x="0" y="0" width="280" height="180" rx="20" fill="#f59e0b" />
        <text x="140" y="60" text-anchor="middle" font-family="Arial" font-size="22" font-weight="bold" fill="#fff">المتسوقون</text>
        <text x="140" y="120" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="#fff">8.5 مليون</text>
        <text x="140" y="150" text-anchor="middle" font-family="Arial" font-size="14" fill="#fef3c7">شخص</text>
      </g>
      <g transform="translate(100, 430)">
        <rect x="0" y="0" width="500" height="280" rx="20" fill="#1e293b" stroke="#475569" stroke-width="2" />
        <text x="250" y="50" text-anchor="middle" font-family="Arial" font-size="22" font-weight="bold" fill="#fff">طرق الدفع المفضلة</text>
        <text x="60" y="120" font-family="Arial" font-size="18" fill="#cbd5e1">الدفع عند الاستلام (COD)</text>
        <rect x="60" y="140" width="380" height="30" rx="6" fill="#475569" />
        <rect x="60" y="140" width="323" height="30" rx="6" fill="#6366f1" />
        <text x="450" y="161" text-anchor="end" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">85%</text>
        <text x="60" y="210" font-family="Arial" font-size="18" fill="#cbd5e1">البطاقة الذهبية (CIB)</text>
        <rect x="60" y="230" width="380" height="30" rx="6" fill="#475569" />
        <rect x="60" y="230" width="46" height="30" rx="6" fill="#10b981" />
        <text x="450" y="251" text-anchor="end" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">12%</text>
      </g>
      <g transform="translate(620, 430)">
        <rect x="0" y="0" width="480" height="280" rx="20" fill="#1e293b" stroke="#475569" stroke-width="2" />
        <text x="240" y="50" text-anchor="middle" font-family="Arial" font-size="22" font-weight="bold" fill="#fff">شركات التوصيل الرئيسية</text>
        <text x="50" y="100" font-family="Arial" font-size="20" font-weight="bold" fill="#fff">Yalidine</text>
        <rect x="200" y="80" width="220" height="20" rx="4" fill="#475569" />
        <rect x="200" y="80" width="180" height="20" rx="4" fill="#6366f1" />
        <text x="385" y="95" text-anchor="end" font-family="Arial" font-size="14" font-weight="bold" fill="#fff">42%</text>
        <text x="50" y="160" font-family="Arial" font-size="20" font-weight="bold" fill="#fff">Maystro</text>
        <rect x="200" y="140" width="220" height="20" rx="4" fill="#475569" />
        <rect x="200" y="140" width="120" height="20" rx="4" fill="#10b981" />
        <text x="385" y="155" text-anchor="end" font-family="Arial" font-size="14" font-weight="bold" fill="#fff">28%</text>
        <text x="50" y="220" font-family="Arial" font-size="20" font-weight="bold" fill="#fff">ZR Express</text>
        <rect x="200" y="200" width="220" height="20" rx="4" fill="#475569" />
        <rect x="200" y="200" width="75" height="20" rx="4" fill="#f59e0b" />
        <text x="385" y="215" text-anchor="end" font-family="Arial" font-size="14" font-weight="bold" fill="#fff">18%</text>
      </g>
    </svg>`,
  },
  {
    filename: "ads-pricing-chart.png",
    svg: `<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="indigo" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#6366f1" />
          <stop offset="100%" stop-color="#a855f7" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="#f8fafc" />
      <text x="600" y="60" text-anchor="middle" font-family="Arial" font-size="36" font-weight="bold" fill="#0f172a">أسعار إعلانات فيسبوك في الجزائر 2025</text>
      <text x="600" y="95" text-anchor="middle" font-family="Arial" font-size="18" fill="#64748b">متوسط CPM و CPC حسب الفئة العمرية</text>
      <g transform="translate(100, 180)">
        <rect x="0" y="0" width="1000" height="500" fill="#fff" stroke="#e2e8f0" stroke-width="2" rx="16" />
        <text x="500" y="40" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="#0f172a">CPM (دج لكل 1000 ظهور)</text>
        <g transform="translate(60, 80)">
          <text x="0" y="20" font-family="Arial" font-size="16" font-weight="bold" fill="#0f172a">18-24 سنة</text>
          <rect x="200" y="0" width="700" height="30" rx="6" fill="#e2e8f0" />
          <rect x="200" y="0" width="150" height="30" rx="6" fill="#10b981" />
          <text x="920" y="22" font-family="Arial" font-size="14" font-weight="bold" fill="#0f172a">120-180 دج</text>
        </g>
        <g transform="translate(60, 140)">
          <text x="0" y="20" font-family="Arial" font-size="16" font-weight="bold" fill="#0f172a">25-34 سنة</text>
          <rect x="200" y="0" width="700" height="30" rx="6" fill="#e2e8f0" />
          <rect x="200" y="0" width="320" height="30" rx="6" fill="#6366f1" />
          <text x="920" y="22" font-family="Arial" font-size="14" font-weight="bold" fill="#0f172a">180-280 دج</text>
        </g>
        <g transform="translate(60, 200)">
          <text x="0" y="20" font-family="Arial" font-size="16" font-weight="bold" fill="#0f172a">35-44 سنة</text>
          <rect x="200" y="0" width="700" height="30" rx="6" fill="#e2e8f0" />
          <rect x="200" y="0" width="400" height="30" rx="6" fill="#f59e0b" />
          <text x="920" y="22" font-family="Arial" font-size="14" font-weight="bold" fill="#0f172a">220-320 دج</text>
        </g>
        <g transform="translate(60, 260)">
          <text x="0" y="20" font-family="Arial" font-size="16" font-weight="bold" fill="#0f172a">45-54 سنة</text>
          <rect x="200" y="0" width="700" height="30" rx="6" fill="#e2e8f0" />
          <rect x="200" y="0" width="290" height="30" rx="6" fill="#a855f7" />
          <text x="920" y="22" font-family="Arial" font-size="14" font-weight="bold" fill="#0f172a">180-260 دج</text>
        </g>
        <g transform="translate(60, 320)">
          <text x="0" y="20" font-family="Arial" font-size="16" font-weight="bold" fill="#0f172a">55+ سنة</text>
          <rect x="200" y="0" width="700" height="30" rx="6" fill="#e2e8f0" />
          <rect x="200" y="0" width="220" height="30" rx="6" fill="#06b6d4" />
          <text x="920" y="22" font-family="Arial" font-size="14" font-weight="bold" fill="#0f172a">150-200 دج</text>
        </g>
        <text x="500" y="450" text-anchor="middle" font-family="Arial" font-size="16" fill="#64748b">المصدر: Meta Business Suite - ديسمبر 2024</text>
      </g>
    </svg>`,
  },
  {
    filename: "online-business-steps.png",
    svg: `<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="indigo" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#6366f1" />
          <stop offset="100%" stop-color="#a855f7" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="#0f172a" />
      <text x="600" y="60" text-anchor="middle" font-family="Arial" font-size="36" font-weight="bold" fill="#fff">4 خطوات لبدء مشروعك الأونلاين</text>
      <text x="600" y="95" text-anchor="middle" font-family="Arial" font-size="18" fill="#94a3b8">بأقل من 20,000 دج</text>
      <g transform="translate(50, 180)">
        <rect x="0" y="0" width="260" height="200" rx="16" fill="url(#indigo)" />
        <text x="130" y="60" text-anchor="middle" font-family="Arial" font-size="60" font-weight="bold" fill="#fff">1</text>
        <text x="130" y="110" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#fff">البحث</text>
        <text x="130" y="140" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">منتج + منافسين</text>
        <text x="130" y="165" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">+ طلب السوق</text>
        <text x="130" y="190" text-anchor="middle" font-family="Arial" font-size="12" fill="#cbd5e1">أسبوع 1</text>
      </g>
      <g transform="translate(340, 180)">
        <rect x="0" y="0" width="260" height="200" rx="16" fill="url(#indigo)" />
        <text x="130" y="60" text-anchor="middle" font-family="Arial" font-size="60" font-weight="bold" fill="#fff">2</text>
        <text x="130" y="110" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#fff">الإعداد</text>
        <text x="130" y="140" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">صفحات + تصاميم</text>
        <text x="130" y="165" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">+ WhatsApp Business</text>
        <text x="130" y="190" text-anchor="middle" font-family="Arial" font-size="12" fill="#cbd5e1">أسبوع 2</text>
      </g>
      <g transform="translate(630, 180)">
        <rect x="0" y="0" width="260" height="200" rx="16" fill="url(#indigo)" />
        <text x="130" y="60" text-anchor="middle" font-family="Arial" font-size="60" font-weight="bold" fill="#fff">3</text>
        <text x="130" y="110" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#fff">الإطلاق</text>
        <text x="130" y="140" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">مخزون 5-10 قطع</text>
        <text x="130" y="165" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">+ إعلان 1,500 دج</text>
        <text x="130" y="190" text-anchor="middle" font-family="Arial" font-size="12" fill="#cbd5e1">أسبوع 3</text>
      </g>
      <g transform="translate(920, 180)">
        <rect x="0" y="0" width="230" height="200" rx="16" fill="url(#indigo)" />
        <text x="115" y="60" text-anchor="middle" font-family="Arial" font-size="60" font-weight="bold" fill="#fff">4</text>
        <text x="115" y="110" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#fff">التوسع</text>
        <text x="115" y="140" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">قياس + توسيع</text>
        <text x="115" y="165" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">+ ميزانية أكبر</text>
        <text x="115" y="190" text-anchor="middle" font-family="Arial" font-size="12" fill="#cbd5e1">أسبوع 4+</text>
      </g>
      <g transform="translate(100, 480)">
        <rect x="0" y="0" width="1000" height="240" rx="20" fill="#1e293b" stroke="#475569" stroke-width="2" />
        <text x="500" y="50" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#fff">التكاليف التأسيسية الفعلية (موثقة)</text>
        <g transform="translate(40, 90)">
          <rect x="0" y="0" width="220" height="60" rx="12" fill="#312e81" />
          <text x="110" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="#c7d2fe">هاتف ذكي</text>
          <text x="110" y="50" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#fff">8,000 دج</text>
        </g>
        <g transform="translate(280, 90)">
          <rect x="0" y="0" width="220" height="60" rx="12" fill="#312e81" />
          <text x="110" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="#c7d2fe">مخزون أولي</text>
          <text x="110" y="50" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#fff">8,000 دج</text>
        </g>
        <g transform="translate(520, 90)">
          <rect x="0" y="0" width="220" height="60" rx="12" fill="#312e81" />
          <text x="110" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="#c7d2fe">إعلانات</text>
          <text x="110" y="50" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#fff">2,000 دج</text>
        </g>
        <g transform="translate(760, 90)">
          <rect x="0" y="0" width="200" height="60" rx="12" fill="#10b981" />
          <text x="100" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="#d1fae5">الإجمالي</text>
          <text x="100" y="50" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="#fff">20,000 دج</text>
        </g>
        <text x="500" y="200" text-anchor="middle" font-family="Arial" font-size="14" fill="#94a3b8">المصدر: NESDA + دراسات ميدانية لـ 30+ تاجر</text>
      </g>
    </svg>`,
  },
  {
    filename: "platform-comparison.png",
    svg: `<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ig" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ec4899" />
          <stop offset="50%" stop-color="#a855f7" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
        <linearGradient id="tt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#000" />
          <stop offset="100%" stop-color="#1f2937" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="#f8fafc" />
      <text x="600" y="60" text-anchor="middle" font-family="Arial" font-size="36" font-weight="bold" fill="#0f172a">Instagram vs TikTok في الجزائر</text>
      <text x="600" y="95" text-anchor="middle" font-family="Arial" font-size="18" fill="#64748b">أيهم أفضل للتجارة في 2025؟</text>
      <g transform="translate(100, 180)">
        <rect x="0" y="0" width="480" height="540" rx="20" fill="url(#ig)" />
        <text x="240" y="60" text-anchor="middle" font-family="Arial" font-size="32" font-weight="bold" fill="#fff">Instagram</text>
        <text x="240" y="90" text-anchor="middle" font-family="Arial" font-size="16" fill="#fff">11 مليون جزائري</text>
        <g transform="translate(40, 130)">
          <text x="0" y="30" font-family="Arial" font-size="14" fill="#fff">الفئة العمرية:</text>
          <text x="200" y="30" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">18-34 (68%)</text>
          <text x="0" y="70" font-family="Arial" font-size="14" fill="#fff">معدل التفاعل:</text>
          <text x="200" y="70" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">3.2%</text>
          <text x="0" y="110" font-family="Arial" font-size="14" fill="#fff">نية الشراء:</text>
          <text x="200" y="110" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">عالية</text>
          <text x="0" y="150" font-family="Arial" font-size="14" fill="#fff">CPC:</text>
          <text x="200" y="150" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">8-25 دج</text>
          <text x="0" y="190" font-family="Arial" font-size="14" fill="#fff">الأفضل لـ:</text>
          <text x="0" y="220" font-family="Arial" font-size="13" fill="#fff">• ملابس وإكسسوارات</text>
          <text x="0" y="250" font-family="Arial" font-size="13" fill="#fff">• مستحضرات تجميل</text>
          <text x="0" y="280" font-family="Arial" font-size="13" fill="#fff">• خدمات احترافية</text>
        </g>
        <g transform="translate(40, 430)">
          <rect x="0" y="0" width="400" height="80" rx="12" fill="rgba(255,255,255,0.2)" />
          <text x="200" y="30" text-anchor="middle" font-family="Arial" font-size="14" fill="#fff">المنتجات المتوسطة إلى العالية السعر</text>
          <text x="200" y="60" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="#fff">الجمهور الجاد للشراء</text>
        </g>
      </g>
      <g transform="translate(620, 180)">
        <rect x="0" y="0" width="480" height="540" rx="20" fill="url(#tt)" />
        <text x="240" y="60" text-anchor="middle" font-family="Arial" font-size="32" font-weight="bold" fill="#fff">TikTok</text>
        <text x="240" y="90" text-anchor="middle" font-family="Arial" font-size="16" fill="#cbd5e1">8.5 مليون جزائري</text>
        <g transform="translate(40, 130)">
          <text x="0" y="30" font-family="Arial" font-size="14" fill="#fff">الفئة العمرية:</text>
          <text x="200" y="30" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">16-28 (74%)</text>
          <text x="0" y="70" font-family="Arial" font-size="14" fill="#fff">معدل التفاعل:</text>
          <text x="200" y="70" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">8.7%</text>
          <text x="0" y="110" font-family="Arial" font-size="14" fill="#fff">نية الشراء:</text>
          <text x="200" y="110" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">متوسطة</text>
          <text x="0" y="150" font-family="Arial" font-size="14" fill="#fff">CPC:</text>
          <text x="200" y="150" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">5-18 دج</text>
          <text x="0" y="190" font-family="Arial" font-size="14" fill="#fff">الأفضل لـ:</text>
          <text x="0" y="220" font-family="Arial" font-size="13" fill="#fff">• منتجات الترفيه</text>
          <text x="0" y="250" font-family="Arial" font-size="13" fill="#fff">• موضة سريعة</text>
          <text x="0" y="280" font-family="Arial" font-size="13" fill="#fff">• وجبات خفيفة</text>
        </g>
        <g transform="translate(40, 430)">
          <rect x="0" y="0" width="400" height="80" rx="12" fill="rgba(255,255,255,0.1)" />
          <text x="200" y="30" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">منتجات منخفضة إلى متوسطة السعر</text>
          <text x="200" y="60" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="#fff">الانتشار الفيروسي</text>
        </g>
      </g>
    </svg>`,
  },
  {
    filename: "delivery-pricing.png",
    svg: `<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="red" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#dc2626" />
          <stop offset="100%" stop-color="#ef4444" />
        </linearGradient>
        <linearGradient id="blue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#2563eb" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
        <linearGradient id="orange" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ea580c" />
          <stop offset="100%" stop-color="#f97316" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="#f8fafc" />
      <text x="600" y="60" text-anchor="middle" font-family="Arial" font-size="36" font-weight="bold" fill="#0f172a">مقارنة شركات التوصيل الجزائرية 2025</text>
      <text x="600" y="95" text-anchor="middle" font-family="Arial" font-size="18" fill="#64748b">الأسعار الفعلية المحدثة</text>
      <g transform="translate(50, 160)">
        <rect x="0" y="0" width="1100" height="80" rx="16" fill="url(#red)" />
        <text x="40" y="50" font-family="Arial" font-size="24" font-weight="bold" fill="#fff">Yalidine Express</text>
        <text x="600" y="50" text-anchor="middle" font-family="Arial" font-size="18" fill="#fff">0-1 كغ: 400-700 دج</text>
        <text x="850" y="50" text-anchor="end" font-family="Arial" font-size="18" font-weight="bold" fill="#fff">42% حصة سوقية</text>
        <text x="1060" y="50" text-anchor="end" font-family="Arial" font-size="14" fill="#fecaca">عمولة COD: 4%</text>
      </g>
      <g transform="translate(50, 270)">
        <rect x="0" y="0" width="1100" height="80" rx="16" fill="url(#blue)" />
        <text x="40" y="50" font-family="Arial" font-size="24" font-weight="bold" fill="#fff">Maystro Delivery</text>
        <text x="600" y="50" text-anchor="middle" font-family="Arial" font-size="18" fill="#fff">0-2 كغ: 450 دج</text>
        <text x="850" y="50" text-anchor="end" font-family="Arial" font-size="18" font-weight="bold" fill="#fff">28% حصة سوقية</text>
        <text x="1060" y="50" text-anchor="end" font-family="Arial" font-size="14" fill="#dbeafe">عمولة COD: 3%</text>
      </g>
      <g transform="translate(50, 380)">
        <rect x="0" y="0" width="1100" height="80" rx="16" fill="url(#orange)" />
        <text x="40" y="50" font-family="Arial" font-size="24" font-weight="bold" fill="#fff">ZR Express</text>
        <text x="600" y="50" text-anchor="middle" font-family="Arial" font-size="18" fill="#fff">0-2 كغ: 350 دج</text>
        <text x="850" y="50" text-anchor="end" font-family="Arial" font-size="18" font-weight="bold" fill="#fff">18% حصة سوقية</text>
        <text x="1060" y="50" text-anchor="end" font-family="Arial" font-size="14" fill="#fed7aa">عمولة COD: 3.5%</text>
      </g>
      <g transform="translate(50, 520)">
        <rect x="0" y="0" width="1100" height="200" rx="20" fill="#fff" stroke="#e2e8f0" stroke-width="2" />
        <text x="550" y="50" text-anchor="middle" font-family="Arial" font-size="22" font-weight="bold" fill="#0f172a">مثال: تكلفة طلب بسعر 2,500 دج (1 كغ)</text>
        <g transform="translate(50, 80)">
          <text x="0" y="25" font-family="Arial" font-size="16" fill="#0f172a">المنتج</text>
          <text x="200" y="25" font-family="Arial" font-size="16" font-weight="bold" fill="#0f172a">1,200 دج</text>
          <text x="0" y="60" font-family="Arial" font-size="16" fill="#0f172a">التوصيل (Yalidine)</text>
          <text x="200" y="60" font-family="Arial" font-size="16" font-weight="bold" fill="#0f172a">400 دج</text>
          <text x="0" y="95" font-family="Arial" font-size="16" fill="#0f172a">عمولة COD (4%)</text>
          <text x="200" y="95" font-family="Arial" font-size="16" font-weight="bold" fill="#0f172a">100 دج</text>
          <text x="500" y="25" font-family="Arial" font-size="16" fill="#0f172a">التغليف</text>
          <text x="700" y="25" font-family="Arial" font-size="16" font-weight="bold" fill="#0f172a">50 دج</text>
          <text x="500" y="60" font-family="Arial" font-size="16" fill="#0f172a">الإعلان (CAC)</text>
          <text x="700" y="60" font-family="Arial" font-size="16" font-weight="bold" fill="#0f172a">300 دج</text>
          <text x="500" y="95" font-family="Arial" font-size="16" font-weight="bold" fill="#10b981">صافي الربح</text>
          <text x="700" y="95" font-family="Arial" font-size="18" font-weight="bold" fill="#10b981">450 دج (18%)</text>
        </g>
      </g>
    </svg>`,
  },
  {
    filename: "payment-methods-comparison.png",
    svg: `<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg2)" />
      <text x="600" y="60" text-anchor="middle" font-family="Arial" font-size="36" font-weight="bold" fill="#fff">طرق الدفع في الجزائر 2025</text>
      <text x="600" y="95" text-anchor="middle" font-family="Arial" font-size="18" fill="#94a3b8">الأرقام الرسمية من بنك الجزائر ووزارة البريد</text>
      <g transform="translate(80, 160)">
        <rect x="0" y="0" width="500" height="180" rx="16" fill="#374151" />
        <text x="250" y="40" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="#fff">الدفع عند الاستلام (COD)</text>
        <text x="250" y="100" text-anchor="middle" font-family="Arial" font-size="56" font-weight="bold" fill="#10b981">85%</text>
        <text x="250" y="140" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">من المعاملات التجارية</text>
        <text x="250" y="165" text-anchor="middle" font-family="Arial" font-size="14" fill="#9ca3af">+5% نمو سنوي</text>
      </g>
      <g transform="translate(620, 160)">
        <rect x="0" y="0" width="500" height="180" rx="16" fill="#374151" />
        <text x="250" y="40" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="#fff">البطاقة الذهبية (CIB)</text>
        <text x="250" y="100" text-anchor="middle" font-family="Arial" font-size="56" font-weight="bold" fill="#6366f1">12%</text>
        <text x="250" y="140" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">4.2 مليون بطاقة نشطة</text>
        <text x="250" y="165" text-anchor="middle" font-family="Arial" font-size="14" fill="#9ca3af">+25% نمو سنوي</text>
      </g>
      <g transform="translate(80, 380)">
        <rect x="0" y="0" width="500" height="180" rx="16" fill="#374151" />
        <text x="250" y="40" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="#fff">الفضة الإلكترونية (E-Dinar)</text>
        <text x="250" y="100" text-anchor="middle" font-family="Arial" font-size="56" font-weight="bold" fill="#a855f7">3%</text>
        <text x="250" y="140" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">1.8 مليون محفظة</text>
        <text x="250" y="165" text-anchor="middle" font-family="Arial" font-size="14" fill="#9ca3af">+45% نمو سنوي</text>
      </g>
      <g transform="translate(620, 380)">
        <rect x="0" y="0" width="500" height="180" rx="16" fill="#374151" />
        <text x="250" y="40" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="#fff">التحويل البريدي (CCP)</text>
        <text x="250" y="100" text-anchor="middle" font-family="Arial" font-size="56" font-weight="bold" fill="#f59e0b">12M</text>
        <text x="250" y="140" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">حساب جاري بريدي</text>
        <text x="250" y="165" text-anchor="middle" font-family="Arial" font-size="14" fill="#9ca3af">تغطية 100%</text>
      </g>
      <g transform="translate(100, 600)">
        <rect x="0" y="0" width="1000" height="140" rx="20" fill="url(#bg2)" stroke="#6366f1" stroke-width="2" />
        <text x="500" y="40" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="#fff">التوصية الاستراتيجية</text>
        <text x="500" y="75" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">لا تلغي COD أبداً - أضف CIB كخيار إضافي</text>
        <text x="500" y="100" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">وفّر التحويل البريدي للمناطق الريفية</text>
        <text x="500" y="125" text-anchor="middle" font-family="Arial" font-size="14" fill="#a5b4fc">استخدم Chargily Pay كبوابة دفع (2.5% عمولة)</text>
      </g>
    </svg>`,
  },
];

// Save all SVGs to public/blog directory
let generated = 0;
infographics.forEach((item) => {
  const filePath = path.join(blogDir, item.filename);
  // Save as .svg instead since we can't easily render PNG without dependencies
  const svgPath = filePath.replace(".png", ".svg");
  fs.writeFileSync(svgPath, item.svg);
  console.log("Created:", svgPath);
  generated++;
});

console.log(`\nGenerated ${generated} infographic SVG files in ${blogDir}`);
console.log("\nNote: For PNG conversion, use a tool like Inkscape or sharp library.");
