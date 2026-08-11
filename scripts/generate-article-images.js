/**
 * Comprehensive image prompts for ALL 102 articles
 * Designed to be generated in batches with AI image generator
 */

const ALL_ARTICLE_IMAGES = {
  // E-commerce (10)
  "ecommerce-algeria-2025-guide": "Modern Algerian online shopping concept with smartphone showing marketplace app, packages ready for shipping, professional photography, 16:9",
  "online-business-low-capital-algeria": "Young Algerian entrepreneur working from home office with laptop, affordable startup concept, professional photography, 16:9",
  "yassir-heetch-business-lessons": "Successful ride-sharing app on smartphone, urban Algeria city street, modern transportation, professional photography, 16:9",
  "ecommerce-payment-methods-algeria": "Multiple payment methods including credit card, mobile wallet, cash on delivery, modern payment terminal, professional photography, 16:9",
  "facebook-marketplace-selling-guide": "Facebook marketplace on smartphone with product listings, social commerce concept, professional photography, 16:9",
  "dropshipping-algeria-feasibility": "Dropshipping workflow with packages shipping from supplier to customer, modern logistics, professional photography, 16:9",
  "credit-card-vs-cod-algeria": "Two hands holding different payment methods, cash vs credit card comparison, modern payment concept, professional photography, 16:9",
  "best-selling-products-algeria": "Top selling products in Algeria, phone cases, clothing accessories, beautiful product photography, 16:9",
  "boutique-en-ligne-algeria-guide": "Successful online store dashboard with e-commerce analytics, modern business, clean design, professional photography, 16:9",
  "ecommerce-customer-service-algeria": "Customer service representative with headset in modern support center, professional photography, 16:9",

  // Marketing (5)
  "facebook-ads-algeria-pricing-2025": "Facebook advertising dashboard with targeting metrics, ROI analytics, professional digital marketing, modern photography, 16:9",
  "instagram-vs-tiktok-algeria-2025": "Instagram and TikTok app icons side by side, social media marketing concept, professional photography, 16:9",
  "social-media-content-strategy-algeria": "Content creator planning social media strategy on calendar, professional workspace, modern photography, 16:9",
  "google-ads-algeria-ecommerce": "Google Ads dashboard with search campaigns and conversion tracking, professional PPC marketing, modern photography, 16:9",
  "whatsapp-business-algeria-guide": "WhatsApp Business on smartphone with business profile, professional messaging app, modern design, 16:9",

  // Services (20)
  "product-photography-algeria-business": "Professional product photography setup with softbox lights and white background, modern camera equipment, professional studio photography, 16:9",
  "car-wash-business-algeria": "Mobile car wash service with pressure washer cleaning a vehicle, professional detailing, sparkling clean car, 16:9",
  "coffee-shop-business-algeria": "Authentic Algerian coffee shop with traditional espresso machine, professional barista preparing coffee, warm atmosphere, 16:9",
  "solar-panel-cleaning-algeria": "Technician cleaning photovoltaic solar panels with blue sky background, clean energy concept, professional photography, 16:9",
  "home-cleaning-business-algeria": "Professional home cleaning service with sparkling clean modern interior, satisfied customer, professional photography, 16:9",
  "bicycle-repair-algeria": "Bicycle repair shop with professional mechanic fixing a bike, tools organized, modern workshop, professional photography, 16:9",
  "social-media-manager-algeria": "Social media manager at work with multiple screens showing analytics, professional digital marketing workspace, 16:9",
  "mobile-repair-shop-algeria": "Phone repair shop interior with technician fixing smartphone with professional tools, modern workshop, 16:9",
  "home-staging-algeria": "Home staging professional arranging beautiful furniture in modern decorated living room, professional photography, 16:9",
  "fitness-gym-business-algeria": "Modern fitness gym interior with professional equipment, motivated people working out, health and wellness, 16:9",
  "language-school-algeria": "Language school classroom with students learning English, teacher at whiteboard, modern educational setting, 16:9",
  "pet-shop-business-algeria": "Pet shop interior with dogs, cats, and accessories, professional pet care products display, 16:9",
  "salon-coiffure-algeria": "Modern hair salon with professional barber cutting client hair, clean stylish interior, 16:9",
  "laundry-service-algeria": "Professional laundry service with modern washing machines, clean organized workspace, 16:9",
  "event-planning-algeria": "Wedding event planning with beautifully decorated venue, professional event coordinator, 16:9",
  "printing-press-business-algeria": "Printing press business with professional printing equipment, colorful printed materials, 16:9",
  "boutique-clothing-algeria": "Modern clothing boutique interior with fashionable clothes on display, stylish shopping environment, 16:9",
  "mobile-store-algeria": "Mobile phone store with latest smartphones on display, professional retail environment, 16:9",
  "driving-school-algeria": "Driving school with instructor teaching student driver, car with dual controls, professional driving education, 16:9",
  "restaurant-business-algeria": "Successful restaurant business with beautifully plated food, busy dining room, professional hospitality, 16:9",

  // More services (10)
  "bakery-business-algeria-complete": "Artisan bakery interior with fresh bread and pastries on display, baker working, warm traditional atmosphere, 16:9",
  "pharmacy-assistant-algeria": "Modern pharmacy interior with pharmacist organizing medicines, professional healthcare environment, 16:9",
  "video-production-algeria": "Video production team at work with professional camera and lighting setup, modern filming studio, 16:9",
  "mobile-electronics-repair-shop": "Electronics repair shop with technician fixing circuit board, professional tools, organized workspace, 16:9",
  "elderly-care-services-algeria": "Compassionate caregiver helping elderly person, home care service, warm caring atmosphere, 16:9",
  "qahwa-traditionnelle-business": "Traditional Algerian coffee shop with ornate decoration, mint tea service, cultural authentic atmosphere, 16:9",
  "tailoring-business-algeria": "Professional tailor working on traditional Algerian garment, sewing machine, beautiful fabrics, 16:9",
  "ceramics-pottery-algeria": "Artisan pottery workshop with hands shaping clay on wheel, traditional Algerian ceramics, 16:9",
  "language-translation-agency": "Professional translator at work with multiple language documents, modern office setup, 16:9",
  "wholesale-business-algeria": "Wholesale warehouse full of products, organized shelves with inventory, busy business activity, 16:9",
  "solar-installation-business-algeria": "Solar panel installation with workers mounting photovoltaic panels on rooftop, renewable energy, 16:9",
  "car-detailing-mobile": "Mobile car detailing service, professional cleaning a luxury vehicle, on-site service, 16:9",
  "car-wash-station-algeria": "Fixed car wash station with multiple vehicles being cleaned, professional car care facility, 16:9",

  // Agriculture (5)
  "agricultural-investment-algeria": "Modern agricultural investment with large greenhouse and vegetables, professional farming, abundant harvest, 16:9",
  "olive-oil-business-algeria": "Premium olive oil production with golden bottles, olive grove in background, Mediterranean tradition, 16:9",
  "fish-farming-algeria": "Modern fish farming facility with fresh fish in clean tanks, aquaculture business, 16:9",
  "poultry-farm-algeria": "Modern poultry farm with healthy chickens in clean facility, professional poultry business, 16:9",
  "beekeeping-honey-algeria": "Beekeeper harvesting honey from hives with golden honey dripping, professional beekeeping, 16:9",

  // Real estate (5)
  "real-estate-brokerage-algeria": "Real estate broker showing property to client, modern apartment interior, professional consultation, 16:9",
  "car-rental-business-algeria": "Car rental business with fleet of clean modern cars, professional customer service, 16:9",
  "apartment-rental-algeria-monthly": "Furnished apartment ready for short-term rental, cozy modern interior, Airbnb-style, 16:9",
  "tourism-guide-algeria": "Professional tour guide showing beautiful Algerian landmark to tourists, cultural tourism, 16:9",

  // Content creation (5)
  "youtube-channel-algeria": "YouTuber creating content in home studio with ring light and camera setup, modern content creation, 16:9",
  "podcast-business-algeria": "Professional podcast studio setup with microphone and headphones, modern broadcasting, 16:9",
  "online-course-creator-algeria": "Online course creator filming educational content, professional studio setup, 16:9",
  "stock-photography-algeria": "Photographer reviewing stock photos on camera, portfolio images, professional photography business, 16:9",
  "youtuber-algeria-monetization": "YouTube monetization success with creator showing revenue analytics, professional content creation, 16:9",

  // Freelancing (10)
  "print-on-demand-algeria": "Print on demand products with custom t-shirt and mug, modern design software, creative print business, 16:9",
  "dropservicing-algeria": "Dropservicing business concept with services delivered digitally, modern laptop, 16:9",
  "affiliate-marketing-algeria": "Affiliate marketing concept with laptop showing affiliate dashboard, commission earnings, 16:9",
  "freelance-accounting-algeria": "Professional accountant working with spreadsheets, modern accounting software, 16:9",
  "freelance-graphic-design-algeria": "Graphic designer at work designing logos and visuals, professional design workspace, 16:9",
  "tutoring-online-algeria": "Online tutor teaching student via video call, modern home office setup, 16:9",
  "freelance-web-development": "Web developer coding on laptop, modern programming setup, professional workspace, 16:9",
  "online-surveys-algeria": "Online survey on smartphone with person filling questionnaire, modern side hustle, 16:9",
  "freelance-arabic-platforms": "Freelancer working on Mostaql platform, Arabic freelance work, professional remote work, 16:9",
  "virtual-assistant-algeria": "Virtual assistant working remotely with organized digital workspace, multiple screens, 16:9",
  "translation-services-algeria": "Professional translator working on multilingual documents, modern translation setup, 16:9",
  "mobile-photography-business-algeria": "Mobile photographer taking professional photos with smartphone, product photography setup, 16:9",
  "luxury-honey-business-algeria": "Premium luxury honey product in elegant packaging, gift box presentation, 16:9",
  "fashion-design-algeria": "Algerian fashion designer at work, traditional and modern clothing design, fabric selection, 16:9",

  // Education (3)
  "tutoring-business-algeria": "Tutor teaching students at home with educational materials, modern learning environment, 16:9",

  // Technology (2)
  "mobile-app-developer-algeria": "Mobile app developer coding on laptop, modern development environment, smartphone showing app, 16:9",
  "tech-startup-algeria-funding": "Algerian tech startup team in modern office, working on laptops, innovation concept, 16:9",

  // Specialized (3)
  "perfume-business-algeria-deep-analysis": "Luxury perfume bottles elegantly displayed, premium fragrance business, beautiful packaging, 16:9",

  // Photography (3)
  "wedding-photography-algeria": "Wedding photographer with professional camera capturing bride and groom, beautiful moment, 16:9",
  "event-photography-algeria": "Event photographer with camera and flash, professional event coverage, 16:9",
  "mobile-photography": "Mobile photography setup, smartphone camera, professional product shots, modern photography, 16:9",

  // Seasonal (4)
  "ramadan-business-ideas-algeria": "Ramadan business setup with traditional dates and pastries, festive atmosphere, warm Ramadan vibes, 16:9",
  "back-to-school-business-algeria": "Back to school shopping with school supplies, backpacks and books, students preparing, 16:9",
  "aid-al-adha-business-ideas": "Eid al-Adha celebration business with sheep, traditional sweets, festive family atmosphere, 16:9",
  "summer-business-ideas-algeria": "Summer business at the beach with tourists enjoying summer activities, coastal tourism, 16:9",

  // Capital studies (2)
  "50k-dzd-business-ideas-algeria": "Young entrepreneur with small startup budget of 50,000 DZD, motivating atmosphere, 16:9",
  "100k-dzd-business-deep-dive": "Professional entrepreneur with medium-sized venture of 100,000 DZD, success and growth, 16:9",

  // Trade (8)
  "second-hand-clothing-algeria": "Second-hand clothing business with racks of sorted thrift clothes, organized thrift store, 16:9",
  "import-business-algeria-legal": "Container shipping and import business with cargo containers at port, international trade, 16:9",
  "export-business-algeria-opportunities": "Algerian products for export including dates, olive oil, traditional goods, 16:9",
  "used-car-business-algeria": "Used car dealership with multiple vehicles for sale, professional car lot, 16:9",
  "perfume-oils-refill": "Perfume oils and refill station, beautiful fragrance bottles, aromatic workshop, 16:9",
  "mobile-coffee-cart": "Mobile coffee cart in business district, professional barista serving coffee, modern cart design, 16:9",
  "boutique-clothing-algeria-real": "Modern clothing boutique with fashionable display, stylish retail environment, 16:9",
  "home-sweets-bakery": "Home bakery setup with traditional Algerian sweets and pastries, fresh baked goods, 16:9",

  // Investment (1)
  "investment-gold-algeria": "Investment gold business with gold bars and coins, professional precious metals, 16:9",

  // Legal (1)
  "auto-entrepreneur-status-algeria-guide": "Self-employed business card and documentation, professional freelance work, 16:9",

  // Logistics (1)
  "yalidine-pricing-2025-algeria": "Delivery service with packages and courier, professional logistics, modern shipping, 16:9",
};

module.exports = ALL_ARTICLE_IMAGES;
