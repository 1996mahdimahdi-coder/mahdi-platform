/**
 * Generate SVG-based cover images for all articles
 * Each SVG is unique to its topic and 100% copyright-free
 */

const fs = require("fs");
const path = require("path");

const blogDir = path.join(__dirname, "..", "public", "blog");
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

// Article-specific SVG designs
const articleSVGs = {
  "ecommerce-algeria-2025-guide": `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#g1)"/>
    <circle cx="900" cy="200" r="150" fill="#6366f1" opacity="0.2"/>
    <circle cx="200" cy="500" r="200" fill="#a855f7" opacity="0.15"/>
    <g transform="translate(600,337)">
      <rect x="-200" y="-130" width="400" height="260" rx="20" fill="#1e293b" stroke="#6366f1" stroke-width="3"/>
      <rect x="-180" y="-110" width="360" height="20" rx="4" fill="#6366f1"/>
      <rect x="-180" y="-70" width="150" height="100" rx="6" fill="#334155"/>
      <text x="-105" y="-15" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">منتج 1</text>
      <rect x="-20" y="-70" width="150" height="100" rx="6" fill="#334155"/>
      <text x="55" y="-15" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">منتج 2</text>
      <rect x="-180" y="40" width="310" height="40" rx="6" fill="#10b981"/>
      <text x="-25" y="65" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">اطلب الآن - 2,500 دج</text>
    </g>
    <text x="600" y="120" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="#fff">التجارة الإلكترونية في الجزائر</text>
    <text x="600" y="160" text-anchor="middle" font-family="Arial" font-size="20" fill="#94a3b8">دليل شامل 2025</text>
  </svg>`,

  "online-business-low-capital-algeria": `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10b981"/>
        <stop offset="100%" stop-color="#059669"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#g2)"/>
    <g transform="translate(600,300)">
      <rect x="-180" y="-100" width="360" height="200" rx="12" fill="#fff"/>
      <rect x="-160" y="-80" width="320" height="30" rx="4" fill="#10b981"/>
      <text x="0" y="-60" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">متجرك الأونلاين</text>
      <rect x="-160" y="-30" width="100" height="80" rx="6" fill="#e5e7eb"/>
      <rect x="-50" y="-30" width="100" height="80" rx="6" fill="#e5e7eb"/>
      <rect x="60" y="-30" width="100" height="80" rx="6" fill="#e5e7eb"/>
    </g>
    <text x="600" y="100" text-anchor="middle" font-family="Arial" font-size="40" font-weight="bold" fill="#fff">20,000 دج فقط لبداية</text>
    <text x="600" y="140" text-anchor="middle" font-family="Arial" font-size="22" fill="#d1fae5">مشروع أونلاين من المنزل</text>
    <g transform="translate(600,580)">
      <text x="0" y="0" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#fff">💰 رأس مال منخفض | ⏰ مرونة كاملة | 🌍 سوق 58 ولاية</text>
    </g>
  </svg>`,

  "yassir-heetch-business-lessons": `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#000"/>
        <stop offset="100%" stop-color="#1f2937"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#g3)"/>
    <g transform="translate(600,300)">
      <rect x="-100" y="-150" width="200" height="300" rx="30" fill="#111827" stroke="#10b981" stroke-width="4"/>
      <rect x="-80" y="-130" width="160" height="220" rx="6" fill="#000"/>
      <text x="0" y="20" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="#10b981">10M+</text>
      <text x="0" y="50" text-anchor="middle" font-family="Arial" font-size="14" fill="#10b981">مستخدم</text>
    </g>
    <text x="600" y="100" text-anchor="middle" font-family="Arial" font-size="42" font-weight="bold" fill="#fff">دروس من Yassir و Heetch</text>
    <text x="600" y="600" text-anchor="middle" font-family="Arial" font-size="18" fill="#9ca3af">كيف تطبقها في مشروعك الصغير</text>
  </svg>`,

  "facebook-ads-algeria-pricing-2025": `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1877f2"/>
        <stop offset="100%" stop-color="#0c4eaf"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#g4)"/>
    <g transform="translate(600,300)">
      <rect x="-220" y="-100" width="440" height="200" rx="12" fill="#fff" opacity="0.95"/>
      <text x="0" y="-60" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#1e293b">إعلانات فيسبوك</text>
      <text x="0" y="0" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="#1877f2">CPM: 180-350 دج</text>
      <text x="0" y="50" text-anchor="middle" font-family="Arial" font-size="16" fill="#64748b">CPC: 8-25 دج | CTR: 1.8-3.2%</text>
    </g>
    <text x="600" y="80" text-anchor="middle" font-family="Arial" font-size="40" font-weight="bold" fill="#fff">أسعار إعلانات فيسبوك</text>
    <text x="600" y="120" text-anchor="middle" font-family="Arial" font-size="22" fill="#dbeafe">الجزائر 2025 - أرقام رسمية</text>
  </svg>`,

  "instagram-vs-tiktok-algeria-2025": `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="ig" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ec4899"/>
        <stop offset="50%" stop-color="#a855f7"/>
        <stop offset="100%" stop-color="#3b82f6"/>
      </linearGradient>
      <linearGradient id="tt" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#000"/>
        <stop offset="100%" stop-color="#1f2937"/>
      </linearGradient>
    </defs>
    <rect width="600" height="675" fill="url(#ig)"/>
    <rect x="600" width="600" height="675" fill="url(#tt)"/>
    <g transform="translate(300,300)">
      <text x="0" y="-50" text-anchor="middle" font-family="Arial" font-size="80" font-weight="bold" fill="#fff">IG</text>
      <text x="0" y="20" text-anchor="middle" font-family="Arial" font-size="32" font-weight="bold" fill="#fff">11M</text>
      <text x="0" y="50" text-anchor="middle" font-family="Arial" font-size="14" fill="#fff">مستخدم جزائري</text>
    </g>
    <g transform="translate(900,300)">
      <text x="0" y="-50" text-anchor="middle" font-family="Arial" font-size="80" font-weight="bold" fill="#fff">TT</text>
      <text x="0" y="20" text-anchor="middle" font-family="Arial" font-size="32" font-weight="bold" fill="#fff">8.5M</text>
      <text x="0" y="50" text-anchor="middle" font-family="Arial" font-size="14" fill="#cbd5e1">مستخدم جزائري</text>
    </g>
    <text x="300" y="100" text-anchor="middle" font-family="Arial" font-size="36" font-weight="bold" fill="#fff">Instagram</text>
    <text x="900" y="100" text-anchor="middle" font-family="Arial" font-size="36" font-weight="bold" fill="#fff">TikTok</text>
  </svg>`,

  "yalidine-pricing-2025-algeria": `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#dc2626"/>
        <stop offset="100%" stop-color="#991b1b"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#g5)"/>
    <g transform="translate(600,300)">
      <rect x="-200" y="-100" width="400" height="200" rx="12" fill="#fff" opacity="0.95"/>
      <text x="0" y="-50" text-anchor="middle" font-family="Arial" font-size="22" font-weight="bold" fill="#dc2626">Yalidine Express</text>
      <text x="0" y="0" text-anchor="middle" font-family="Arial" font-size="36" font-weight="bold" fill="#1e293b">400-700 دج</text>
      <text x="0" y="30" text-anchor="middle" font-family="Arial" font-size="14" fill="#64748b">0-1 كغ | 58 ولاية</text>
      <text x="0" y="60" text-anchor="middle" font-family="Arial" font-size="14" fill="#64748b">COD: 4% | 24-72 ساعة</text>
    </g>
    <text x="600" y="80" text-anchor="middle" font-family="Arial" font-size="38" font-weight="bold" fill="#fff">شركات التوصيل في الجزائر</text>
    <text x="600" y="120" text-anchor="middle" font-family="Arial" font-size="20" fill="#fecaca">مقارنة 2025</text>
  </svg>`,

  "50k-dzd-business-ideas-algeria": `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#g6)"/>
    <g transform="translate(600,337)">
      <text x="0" y="-100" text-anchor="middle" font-family="Arial" font-size="120" font-weight="bold" fill="#fff">50,000</text>
      <text x="0" y="-30" text-anchor="middle" font-family="Arial" font-size="32" font-weight="bold" fill="#fef3c7">دج فقط</text>
      <text x="0" y="40" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#fff">7 مشاريع مربحة</text>
      <text x="0" y="80" text-anchor="middle" font-family="Arial" font-size="18" fill="#fef3c7">دراسات جدوى موثقة</text>
    </g>
  </svg>`,

  "100k-dzd-business-deep-dive": `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="g7" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6366f1"/>
        <stop offset="100%" stop-color="#4338ca"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#g7)"/>
    <g transform="translate(600,337)">
      <text x="0" y="-100" text-anchor="middle" font-family="Arial" font-size="120" font-weight="bold" fill="#fff">100,000</text>
      <text x="0" y="-30" text-anchor="middle" font-family="Arial" font-size="32" font-weight="bold" fill="#c7d2fe">دج - 10 ملايين سنتيم</text>
      <text x="0" y="40" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#fff">10 مشاريع متوسطة</text>
      <text x="0" y="80" text-anchor="middle" font-family="Arial" font-size="18" fill="#c7d2fe">دراسات جدوى كاملة</text>
    </g>
  </svg>`,

  "ramadan-business-ideas-algeria": `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
    <defs>
      <radialGradient id="ramadan" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#7c2d12"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#ramadan)"/>
    <g transform="translate(600,300)">
      <path d="M 0,-80 Q 80,-80 80,0 Q 80,80 0,80 Q -80,80 -80,0 Q -80,-80 0,-80 Z" fill="#fef3c7" opacity="0.3"/>
      <circle cx="0" cy="0" r="60" fill="#fbbf24"/>
      <path d="M -30,-30 L 0,0 L 30,-30" stroke="#7c2d12" stroke-width="3" fill="none"/>
    </g>
    <text x="600" y="100" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="#fff">مشاريع رمضان 2025</text>
    <text x="600" y="140" text-anchor="middle" font-family="Arial" font-size="24" fill="#fde68a">فرص ذهبية للشهر الكريم</text>
  </svg>`,

  "ai-image-generator": `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="g8" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8b5cf6"/>
        <stop offset="100%" stop-color="#6d28d9"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#g8)"/>
    <text x="600" y="280" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="#fff">صور احترافية</text>
    <text x="600" y="340" text-anchor="middle" font-family="Arial" font-size="24" fill="#ddd6fe">بتقنية الذكاء الاصطناعي</text>
  </svg>`,
};

let count = 0;
for (const [slug, svg] of Object.entries(articleSVGs)) {
  const filePath = path.join(blogDir, `${slug}.svg`);
  fs.writeFileSync(filePath, svg);
  count++;
}
console.log(`Created ${count} article-specific SVG covers`);

// Generate generic SVG covers for other articles with topic-based theming
const topicThemes = {
  // E-commerce
  "ecommerce": { color1: "#6366f1", color2: "#a855f7", icon: "🛒" },
  // Marketing
  "marketing": { color1: "#ec4899", color2: "#8b5cf6", icon: "📢" },
  // Services
  "services": { color1: "#06b6d4", color2: "#0891b2", icon: "🛠️" },
  // Trade
  "trade": { color1: "#f59e0b", color2: "#d97706", icon: "🏪" },
  // Freelance
  "freelance": { color1: "#10b981", color2: "#059669", icon: "💼" },
  // Agriculture
  "agriculture": { color1: "#16a34a", color2: "#15803d", icon: "🌾" },
  // Tourism
  "tourism": { color1: "#0ea5e9", color2: "#0284c7", icon: "🏖️" },
  // Education
  "education": { color1: "#8b5cf6", color2: "#7c3aed", icon: "📚" },
  // Technology
  "technology": { color1: "#475569", color2: "#1e293b", icon: "💻" },
  // Photography
  "photography": { color1: "#a855f7", color2: "#7c3aed", icon: "📷" },
  // Real estate
  "realestate": { color1: "#0891b2", color2: "#0e7490", icon: "🏠" },
  // Legal
  "legal": { color1: "#64748b", color2: "#334155", icon: "⚖️" },
  // Logistics
  "logistics": { color1: "#dc2626", color2: "#991b1b", icon: "🚚" },
  // Investment
  "investment": { color1: "#ca8a04", color2: "#854d0e", icon: "💰" },
  // Content creation
  "content": { color1: "#ec4899", color2: "#be185d", icon: "🎬" },
  // Seasonal
  "seasonal": { color1: "#fb923c", color2: "#c2410c", icon: "📅" },
};

// Categorize articles to themes
const articleThemeMap = {};
const allSlugs = [
  // E-commerce
  "facebook-marketplace-selling-guide", "dropshipping-algeria-feasibility", "credit-card-vs-cod-algeria",
  "best-selling-products-algeria", "boutique-en-ligne-algeria-guide", "ecommerce-customer-service-algeria",
  "ecommerce-payment-methods-algeria", "salla-vs-youcan", "yassir-heetch-business-lessons", "ecommerce-growth-algeria",
  // Marketing
  "google-ads-algeria-ecommerce", "social-media-content-strategy-algeria", "whatsapp-business-algeria-guide",
  "social-media-content-strategy",
  // Services
  "car-wash-business-algeria", "coffee-shop-business-algeria", "solar-panel-cleaning-algeria",
  "home-cleaning-business-algeria", "bicycle-repair-algeria", "social-media-manager-algeria",
  "mobile-repair-shop-algeria", "home-staging-algeria", "fitness-gym-business-algeria",
  "language-school-algeria", "pet-shop-business-algeria", "salon-coiffure-algeria",
  "laundry-service-algeria", "car-wash-station-algeria", "event-planning-algeria",
  "printing-press-business-algeria", "boutique-clothing-algeria", "mobile-store-algeria",
  "driving-school-algeria", "restaurant-business-algeria", "bakery-business-algeria-complete",
  "pharmacy-assistant-algeria", "video-production-algeria", "mobile-electronics-repair-shop",
  "elderly-care-services-algeria", "qahwa-traditionnelle-business", "tailoring-business-algeria",
  "ceramics-pottery-algeria", "language-translation-agency", "wholesale-business-algeria",
  "solar-installation-business-algeria", "car-detailing-mobile", "mobile-coffee-cart",
  "salla-vs-youcan",
  // Freelance
  "print-on-demand-algeria", "dropservicing-algeria", "affiliate-marketing-algeria",
  "freelance-accounting-algeria", "freelance-graphic-design-algeria", "tutoring-online-algeria",
  "freelance-web-development", "online-surveys-algeria", "freelance-arabic-platforms",
  "virtual-assistant-algeria", "translation-services-algeria", "mobile-photography-business-algeria",
  "freelance-graphic-design-algeria", "freelance-web-development",
  // Agriculture
  "fish-farming-algeria", "poultry-farm-algeria", "beekeeping-honey-algeria",
  "agricultural-investment-algeria", "olive-oil-business-algeria",
  // Real estate
  "car-rental-business-algeria", "apartment-rental-algeria-monthly", "tourism-guide-algeria",
  "real-estate-brokerage-algeria",
  // Tourism
  "tourism-guide-algeria",
  // Education
  "online-course-creator-algeria", "tutoring-business-algeria",
  // Technology
  "mobile-app-developer-algeria", "tech-startup-algeria-funding",
  // Photography
  "wedding-photography-algeria", "event-photography-algeria", "mobile-photography",
  "wedding-photography-algeria-extra", "wedding-photography-algeria-wed",
  "wedding-photography-algeria-real", "event-photography-algeria-real",
  // Real estate
  "real-estate-brokerage-algeria",
  // Legal
  "auto-entrepreneur-status-algeria-guide",
  // Logistics
  "yalidine-pricing-2025-algeria",
  // Investment
  "investment-gold-algeria",
  // Content
  "youtube-channel-algeria", "podcast-business-algeria", "stock-photography-algeria",
  "youtuber-algeria-monetization",
  // Seasonal
  "back-to-school-business-algeria", "aid-al-adha-business-ideas", "summer-business-ideas-algeria",
  "ramadan-business-ideas-algeria",
  // Trade
  "second-hand-clothing-algeria", "import-business-algeria-legal", "export-business-algeria-opportunities",
  "used-car-business-algeria", "perfume-oils-refill", "boutique-clothing-algeria-real",
  "home-sweets-bakery", "perfume-business-algeria-deep-analysis",
  "luxury-honey-business-algeria", "fashion-design-algeria",
];

// Create generic SVGs for each article slug with unique colors
const uniqueSlugs = [...new Set(allSlugs)].sort();
const colorPalette = [
  { c1: "#6366f1", c2: "#8b5cf6", i: "📱" },
  { c1: "#ec4899", c2: "#f43f5e", i: "💡" },
  { c1: "#10b981", c2: "#14b8a6", i: "📈" },
  { c1: "#f59e0b", c2: "#f97316", i: "💰" },
  { c1: "#06b6d4", c2: "#0ea5e9", i: "🛠️" },
  { c1: "#8b5cf6", c2: "#a855f7", i: "📚" },
  { c1: "#dc2626", c2: "#ef4444", i: "🚚" },
  { c1: "#16a34a", c2: "#22c55e", i: "🌱" },
  { c1: "#0891b2", c2: "#06b6d4", i: "🏠" },
  { c1: "#475569", c2: "#334155", i: "💻" },
  { c1: "#a855f7", c2: "#7c3aed", i: "📷" },
  { c1: "#fb923c", c2: "#f97316", i: "🎬" },
  { c1: "#fbbf24", c2: "#f59e0b", i: "📅" },
  { c1: "#7c2d12", c2: "#dc2626", i: "🥩" },
  { c1: "#1e40af", c2: "#3b82f6", i: "🌊" },
  { c1: "#0e7490", c2: "#0891b2", i: "🐟" },
  { c1: "#166534", c2: "#16a34a", i: "🐔" },
  { c1: "#92400e", c2: "#d97706", i: "🍯" },
  { c1: "#0c4a6e", c2: "#0ea5e9", i: "✈️" },
  { c1: "#831843", c2: "#be185d", i: "🌹" },
];

let svgCount = 0;
uniqueSlugs.forEach((slug, idx) => {
  if (articleSVGs[slug]) return; // skip if custom SVG exists
  const colors = colorPalette[idx % colorPalette.length];
  const titleFromSlug = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const svg = `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="g${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${colors.c1}"/>
        <stop offset="100%" stop-color="${colors.c2}"/>
      </linearGradient>
      <pattern id="dots${idx}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="2" fill="#fff" opacity="0.1"/>
      </pattern>
    </defs>
    <rect width="1200" height="675" fill="url(#g${idx})"/>
    <rect width="1200" height="675" fill="url(#dots${idx})"/>
    <g transform="translate(600,337)" opacity="0.3">
      <circle cx="-300" cy="0" r="200" fill="#fff" opacity="0.2"/>
      <circle cx="300" cy="0" r="250" fill="#fff" opacity="0.15"/>
    </g>
    <g transform="translate(600,300)">
      <circle cx="0" cy="0" r="80" fill="#fff" opacity="0.95"/>
      <text x="0" y="30" text-anchor="middle" font-family="Arial" font-size="80">${colors.i}</text>
    </g>
    <text x="600" y="500" text-anchor="middle" font-family="Arial" font-size="32" font-weight="bold" fill="#fff">NABDA - نابدا</text>
    <text x="600" y="540" text-anchor="middle" font-family="Arial" font-size="18" fill="#fff" opacity="0.9">قبل ما تبدأ مشروعك... اختبره</text>
  </svg>`;
  const filePath = path.join(blogDir, `${slug}.svg`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, svg);
    svgCount++;
  }
});
console.log(`Created ${svgCount} topic-themed SVG covers`);
console.log(`\nTotal cover images in ${blogDir}:`);
const files = fs.readdirSync(blogDir);
console.log(`- AI generated (jpg): ${files.filter(f => f.endsWith('.jpg')).length}`);
console.log(`- SVG covers: ${files.filter(f => f.endsWith('.svg')).length}`);
console.log(`- Total: ${files.length}`);
