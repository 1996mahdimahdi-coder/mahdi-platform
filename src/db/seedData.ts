export const INITIAL_WEIGHTS = {
  financialWeight: 25,
  personalWeight: 15,
  workspaceWeight: 10,
  locationWeight: 15,
  riskWeight: 10,
  startabilityWeight: 10,
  scalabilityWeight: 10,
  timeWeight: 5,
};

export const ALGERIAN_WILAYAS = [
  { code: "01", nameAr: "أدرار", nameFr: "Adrar", areaType: "desert", communes: ["أدرار", "رقان", "تيمياوين", "تمنطيط", "فنوغيل"] },
  { code: "02", nameAr: "الشلف", nameFr: "Chlef", areaType: "coastal", communes: ["الشلف", "تنس", "أبو الحسن", "بوقادير", "تاجموت"] },
  { code: "03", nameAr: "الأغواط", nameFr: "Laghouat", areaType: "rural", communes: ["الأغواط", "أفلو", "حاسي الرمل", "قصر الحيران", "سيدي مخلوف"] },
  { code: "04", nameAr: "أم البواقي", nameFr: "Oum El Bouaghi", areaType: "rural", communes: ["أم البواقي", "عين البيضاء", "عين مليلة", "مسكيانة", "فكيرينة"] },
  { code: "05", nameAr: "باتنة", nameFr: "Batna", areaType: "urban", communes: ["باتنة", "بريكة", "عين التوتة", "مروانة", "أريس"] },
  { code: "06", nameAr: "بجاية", nameFr: "Béjaïa", areaType: "coastal", communes: ["بجاية", "أقبو", "القصر", "أميزور", "سوق الإثنين"] },
  { code: "07", nameAr: "ببسكرة", nameFr: "Biskra", areaType: "rural", communes: ["بسكرة", "طولقة", "سيدي عقبة", "زريبة الوادي", "أورلال"] },
  { code: "08", nameAr: "بشار", nameFr: "Béchar", areaType: "desert", communes: ["بشار", "القنادسة", "تاغيت", "العبادلة", "لحمر"] },
  { code: "09", nameAr: "البليدة", nameFr: "Blida", areaType: "urban", communes: ["البليدة", "بوفاريك", "العفرون", "موزاية", "شبلي"] },
  { code: "10", nameAr: "البويرة", nameFr: "Bouira", areaType: "rural", communes: ["البويرة", "سور الغزلان", "الأخضرية", "عين بسام", "مشدالة"] },
  { code: "11", nameAr: "تمنراست", nameFr: "Tamanghasset", areaType: "desert", communes: ["تمنراست", "عين أمقل", "إدلس", "أبالسة"] },
  { code: "12", nameAr: "تبسة", nameFr: "Tébessa", areaType: "rural", communes: ["تبسة", "الشريعة", "الونزة", "بئر العاتر", "العوينات"] },
  { code: "13", nameAr: "تلمسان", nameFr: "Tlemcen", areaType: "urban", communes: ["تلمسان", "مغنية", "منصورة", "الرمشي", "الغزوات"] },
  { code: "14", nameAr: "تيارت", nameFr: "Tiaret", areaType: "rural", communes: ["تيارت", "السوقر", "فرندة", "قصر الشلالة", "مشرع الصفا"] },
  { code: "15", nameAr: "تيزي وزو", nameFr: "Tizi Ouzou", areaType: "urban", communes: ["تيزي وزو", "تزازرت", "أزازقة", "ذراع الميزان", "عين الحمام"] },
  { code: "16", nameAr: "الجزائر العاصمة", nameFr: "Alger", areaType: "urban", communes: ["الجزائر الوسطى", "باب الوادي", "القبة", "الشراقة", "الرويبة", "حيدرة", "بئر خادم", "الدرارية"] },
  { code: "17", nameAr: "الجلفة", nameFr: "Djelfa", areaType: "rural", communes: ["الجلفة", "مسعد", "عين وسارة", "حاسي بحبح", "دار الشيوخ"] },
  { code: "18", nameAr: "جيجل", nameFr: "Jijel", areaType: "coastal", communes: ["جيجل", "الميلية", "الطاهير", "العوانة", "زيامة منصورية"] },
  { code: "19", nameAr: "سطيف", nameFr: "Sétif", areaType: "urban", communes: ["سطيف", "العلمة", "عين ولمان", "عين أزال", "بوقاعة"] },
  { code: "20", nameAr: "سعيدة", nameFr: "Saïda", areaType: "rural", communes: ["سعيدة", "الحساسنة", "عين الحجر", "أولاد خالد", "يوب"] },
  { code: "21", nameAr: "سكيكدة", nameFr: "Skikda", areaType: "coastal", communes: ["سكيكدة", "الحروش", "عزابة", "القُل", "تمالوس"] },
  { code: "22", nameAr: "سيدي بلعباس", nameFr: "Sidi Bel Abbès", areaType: "urban", communes: ["سيدي بلعباس", "سفيزف", "بن باديس", "تلاغ", "عين البرد"] },
  { code: "23", nameAr: "عنابة", nameFr: "Annaba", areaType: "coastal", communes: ["عنابة", "البوني", "الحجار", "برحال", "سرايدي"] },
  { code: "24", nameAr: "قالمة", nameFr: "Guelma", areaType: "rural", communes: ["قالمة", "وادي الزناتي", "بوشقوف", "هليوبوليس", "حمام دباغ"] },
  { code: "25", nameAr: "قسنطينة", nameFr: "Constantine", areaType: "urban", communes: ["قسنطينة", "الخروب", "علي منجلي", "حامة بوزيان", "زيغود يوسف"] },
  { code: "26", nameAr: "المدية", nameFr: "Médéa", areaType: "rural", communes: ["المدية", "البرواقية", "قصر البخاري", "تابلاط", "عزيز"] },
  { code: "27", nameAr: "مستغانم", nameFr: "Mostaganem", areaType: "coastal", communes: ["مستغانم", "عين تدلس", "حاسي مُمش", "سيدي علي", "ماسرة"] },
  { code: "28", nameAr: "المسيلة", nameFr: "M'Sila", areaType: "rural", communes: ["المسيلة", "بوسعادة", "سيدي عيسى", "مقرة", "أولاد دراج"] },
  { code: "29", nameAr: "معسكر", nameFr: "Mascara", areaType: "rural", communes: ["معسكر", "سيق", "محمدية", "تيغنيف", "غريس"] },
  { code: "30", nameAr: "ورقلة", nameFr: "Ouargla", areaType: "desert", communes: ["ورقلة", "حاسي مسعود", "الرويسات", "الأنقوسة"] },
  { code: "31", nameAr: "وهران", nameFr: "Oran", areaType: "urban", communes: ["وهران", "بئر الجير", "السانية", "أرزيو", "عين الترك", "السواني"] },
  { code: "32", nameAr: "البيض", nameFr: "El Bayadh", areaType: "rural", communes: ["البيض", "الأبيض سيدي الشيخ", "بوقطب", "بريزينة"] },
  { code: "33", nameAr: "إليزي", nameFr: "Illizi", areaType: "desert", communes: ["إليزي", "عين أمناس", "برج الحواس"] },
  { code: "34", nameAr: "برج بوعريريج", nameFr: "Bordj Bou Arréridj", areaType: "urban", communes: ["برج بوعريريج", "رأس الوادي", "العش", "برج غدير"] },
  { code: "35", nameAr: "بومرداس", nameFr: "Boumerdès", areaType: "coastal", communes: ["بومرداس", "خميس الخشنة", "بودواو", "برج منايل", "دلس"] },
  { code: "36", nameAr: "الطارف", nameFr: "El Tarf", areaType: "coastal", communes: ["الطارف", "القالة", "بوثلجة", "ذعانة", "بن مهيدي"] },
  { code: "37", nameAr: "تندوف", nameFr: "Tindouf", areaType: "desert", communes: ["تندوف", "أم العسل"] },
  { code: "38", nameAr: "تيسمسيلت", nameFr: "Tissemsilt", areaType: "rural", communes: ["تيسمسيلت", "ثنية الأحد", "برج بونعامة", "خميستي"] },
  { code: "39", nameAr: "الوادي", nameFr: "El Oued", areaType: "desert", communes: ["الوادي", "جامعة", "المغير", "قمار", "الرقيبة"] },
  { code: "40", nameAr: "خنشلة", nameFr: "Khenchela", areaType: "rural", communes: ["خنشلة", "قايس", "ششار", "محمل", "بابار"] },
  { code: "41", nameAr: "سوق أهراس", nameFr: "Souk Ahras", areaType: "rural", communes: ["سوق أهراس", "سدراتة", "المداوروش", "تاورة"] },
  { code: "42", nameAr: "تيبازة", nameFr: "Tipaza", areaType: "coastal", communes: ["تيبازة", "شرشال", "القليعة", "بوسماعيل", "فوكة"] },
  { code: "43", nameAr: "ميلة", nameFr: "Mila", areaType: "rural", communes: ["ميلة", "شلغوم العيد", "تاجنانت", "فرجيوة", "القرارم قوقة"] },
  { code: "44", nameAr: "عين الدفلى", nameFr: "Aïn Defla", nameFr1: "", areaType: "rural", communes: ["عين الدفلى", "خميس مليانة", "العطاف", "مليانة", "بوراشد"] },
  { code: "45", nameAr: "النعامة", nameFr: "Naâma", areaType: "rural", communes: ["النعامة", "المشرية", "عين الصفراء", "مكمن بن عمار"] },
  { code: "46", nameAr: "عين تموشنت", nameFr: "Aïn Témouchent", areaType: "coastal", communes: ["عين تموشنت", "بني صاف", "حمام بوحجر", "المالح"] },
  { code: "47", nameAr: "غرداية", nameFr: "Ghardaïa", areaType: "desert", communes: ["غرداية", "بني يزقن", "القرارة", "متليلي", "الظاية"] },
  { code: "48", nameAr: "غليزان", nameFr: "Relizane", areaType: "rural", communes: ["غليزان", "وادي ارهيو", "مازونة", "عمي موسى", "زمورة"] },
  { code: "49", nameAr: "تيميمون", nameFr: "Timimoun", areaType: "desert", communes: ["تيميمون", "أوقروت", "شروين"] },
  { code: "50", nameAr: "برج باجي مختار", nameFr: "Bordj Badji Mokhtar", areaType: "desert", communes: ["برج باجي مختار", "تيمياوين"] },
  { code: "51", nameAr: "أولاد جلال", nameFr: "Ouled Djellal", areaType: "desert", communes: ["أولاد جلال", "سيدي خالد", "الدوسن"] },
  { code: "52", nameAr: "بني عباس", nameFr: "Béni Abbès", areaType: "desert", communes: ["بني عباس", "الواتة", "كرزاز"] },
  { code: "53", nameAr: "عين صالح", nameFr: "In Salah", areaType: "desert", communes: ["عين صالح", "فقارة الزاوية", "إينغر"] },
  { code: "54", nameAr: "عين قزام", nameFr: "In Guezzam", areaType: "desert", communes: ["عين قزام", "تين زواتين"] },
  { code: "55", nameAr: "تقرت", nameFr: "Touggourt", areaType: "desert", communes: ["تقرت", "النزلة", "تماسين", "المقارين"] },
  { code: "56", nameAr: "جانت", nameFr: "Djanet", areaType: "desert", communes: ["جانت", "برج الحواس"] },
  { code: "57", nameAr: "المغير", nameFr: "El M'Ghair", areaType: "desert", communes: ["المغير", "جامعة", "أم الطيور"] },
  { code: "58", nameAr: "المنيعة", nameFr: "El Meniaa", areaType: "desert", communes: ["المنيعة", "حاسي القارة"] },
];

export const INITIAL_PROJECTS = [
  {
    projectId: "phone-accessories",
    projectName: "تجارة إكسسوارات الهواتف",
    category: "تجارة",
    description: "بيع واقيات الشاشة (Incassable)، أغطية الهواتف (Pochettes)، الشواحن، والسماعات عبر متجر مصغر أو من المنزل عبر منصات التواصل والتوصيل.",
    minCapital: 25000,
    recommendedCapital: 80000,
    maxCapital: 250000,
    riskLevel: "متوسطة",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["البيع", "التسويق", "الهواتف والإلكترونيات"],
    timeRequired: "2-4 ساعات",
    difficulty: "سهل",
    scalability: "مرتفعة",
    seasonality: "طوال السنة",
    competitionLevel: "مرتفعة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "طابعة ملصقات صغيرة وتغليف", cost: 8000 },
      { item: "حامل تصوير منتجات وإضاءة LED", cost: 4000 }
    ],
    initialStock: 50000,
    fixedCosts: 5000,
    variableCostsPercent: 12,
    pricingMethod: "هامش ربح 40% - 70% للقطعة",
    profitFormula: "(سعر البيع - سعر الشراء) * عدد الوحدات - مصاريف التوصيل والتسويق",
    breakEvenFormula: "التكاليف الثابتة / هامش الربح للقطعة الواحدة",
    risks: [
      "تغير موديلات الهواتف بسرعة مما قد يسبب بقاء مخزون للموديلات القديمة",
      "منافسة شديدة في السوق المحلي"
    ],
    advantages: [
      "سرعة دوران رأس المال",
      "طلب مستمر وعالي جدًا طوال السنة",
      "سهولة الشحن والتخزين من المنزل"
    ],
    disadvantages: [
      "تغير التكنولوجيا يقتضي متابعة دائمة للموديلات الجديدة"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "دراسة السوق والموردين", tasks: ["البحث عن موردي الجملة في العلمة أو العاصمة", "تحديد أكثر الموديلات طلبًا (iPhone/Samsung/Redmi)"] },
      { week: "الأسبوع 2", title: "طلب المخزون التجريبي والتصوير", tasks: ["شراء مخزون أولى بقيمة 30,000 دج", "إنشاء صفحة TikTok و Instagram وتصوير المنتجات"] },
      { week: "الأسبوع 3", title: "إطلاق الإعلانات واستقبال الطلبات", tasks: ["إطلاق إعلان ممول بقيمة 3000 دج", "الارتباط مع شركة توصيل مثل Yalidine أو Express"] },
      { week: "الأسبوع 4", title: "التقييم والتوسع", tasks: ["تحليل أفضل المنتجات مبيعًا", "إعادة استثمار الأرباح لشراء الموديلات الأكثر طلبًا"] }
    ],
    legalNotes: "يمكن البدء كنشاط تجاري إلكتروني مصغر، مع استخراج بطاقة مقاول ذاتي (Auto-entrepreneur) لاحقًا للعمل القانوني.",
    source: "سوق تجارة التجزئة والتجارة الإلكترونية في الجزائر"
  },
  {
    projectId: "product-photography",
    projectName: "تصوير المنتجات وصناعة المحتوى للمحلات",
    category: "خدمات",
    description: "تقديم خدمة تصوير احترافي وصناعة فيديوهات Reels للمطاعم، المحلات التجارية، والعلامات التجارية المحلية بعقود شهرية.",
    minCapital: 30000,
    recommendedCapital: 90000,
    maxCapital: 300000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: true,
    skillsRequired: ["التصوير", "التصميم", "صناعة المحتوى", "التسويق"],
    timeRequired: "4-6 ساعات",
    difficulty: "متوسط",
    scalability: "مرتفعة",
    seasonality: "طوال السنة",
    competitionLevel: "متوسطة",
    targetArea: "مدن كبيرة",
    equipment: [
      { item: "هاتف ذكي بكاميرا عالية (مثل iPhone 12+) أو كاميرا مستعملة", cost: 65000 },
      { item: "مانع اهتزاز Gimbal وإضاءة محمولة Ring Light", cost: 15000 },
      { item: "خلفيات تصوير وأدوات ديكور مصغرة", cost: 10000 }
    ],
    initialStock: 0,
    fixedCosts: 4000,
    variableCostsPercent: 5,
    pricingMethod: "اشتراك شهري للمحل (من 20,000 دج إلى 50,000 دج) مقابل 8-12 فيديو",
    profitFormula: "عدد العملاء الشهريين * قيمة الاشتراك - تكاليف المواصلات والبرامج",
    breakEvenFormula: "تغطية اشتراك برامج التعديل والتنقل بعقد عميل واحد فقط",
    risks: [
      "صعوبة إقناع بعض التجار التقليديين بجدوى التسويق بالفيديو",
      "الحاجة لتطوير المهارات الفنية باستمرار"
    ],
    advantages: [
      "هامش ربح مرتفع جدًا (أكثر من 80%)",
      "لا يحتاج شراء مخزون ولا خطر البضائع المتبقية",
      "دخول شهري متكرر من العملاء الدائمين"
    ],
    disadvantages: [
      "يتطلب وسيلة نقل أو تنقل مستمر للمحلات"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "بناء المعرض الشخصي (Portfolio)", tasks: ["تصوير 5 منتجات مجانية أو منزلية بشكل احترافي", "تجهيز صفحة أنستغرام مخصصة للخدمة"] },
      { week: "الأسبوع 2", title: "التواصل المباشر مع التجار", tasks: ["زيارة 10 محلات ومطاعم محليًا وعرض جلسة تصوير تجريبية مجانية", "تقديم عرض قيمة واضح"] },
      { week: "الأسبوع 3", title: "تنفيذ العقود الأولى", tasks: ["توقع توقيع عقدين برقم أعمال 40,000 دج", "تسليم الفيديوهات في الوقت المحدد"] },
      { week: "الأسبوع 4", title: "طلب توصيات وزيادة الأسعار", tasks: ["طلب أراء العملاء وشرح نتائج زيادة المشاهدات للمحلات", "التعاقد مع محلات جديدة"] }
    ],
    legalNotes: "تخصص مثالي لبطاقة مقاول ذاتي (Auto-entrepreneur) في رمز خدمات التصوير والمحتوى.",
    source: "دليل المقاول الذكي للخدمات الرقمية بالجزائر"
  },
  {
    projectId: "home-sweets-bakery",
    projectName: "صناعة الحلويات والمخبوزات المنزلية",
    category: "صناعة تقليدية",
    description: "إعداد الحلويات التقليدية الجزائرية (مقروط، بقلواوة، شراك، كعيكعات) وحلويات المناسبات والطلبيات المباشرة من المنزل.",
    minCapital: 20000,
    recommendedCapital: 60000,
    maxCapital: 180000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["الطبخ", "التسويق", "البيع"],
    timeRequired: "4-6 ساعات",
    difficulty: "متوسط",
    scalability: "متوسطة",
    seasonality: "مرتفعة بالمناسبات والأعياد",
    competitionLevel: "مرتفعة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "خلاط كهربائي وموازين دقيقة", cost: 12000 },
      { item: "قوالب وأدوات تشكيل وتغليف احترافي", cost: 15000 }
    ],
    initialStock: 15000,
    fixedCosts: 3000,
    variableCostsPercent: 40,
    pricingMethod: "تكلفة المواد + 60% إلى 100% هامش مصاريف وجُهد",
    profitFormula: "(سعر الصينية/العلبة - تكلفة المواد والغاز) * عدد الطلبيات",
    breakEvenFormula: "بيع 15 علبة حلويات يغطي استثمار الأدوات الأولي",
    risks: [
      "ارتفاع أسعار المواد الأولية (اللوز، الجوز، الفرينة، الزبدة)",
      "تلف المنتجات في حال عدم الاستلام"
    ],
    advantages: [
      "بدء فورية من المطبخ العائلي بدون مصاريف إيجار",
      "طلب عالي جدًا في الأعياد والأعراس والحفلات"
    ],
    disadvantages: [
      "تطلب جُهد بدني ووقت في الإعداد"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "إعداد العينات والوصفات", tasks: ["تحضير 4 أنواع حلويات شهيرة وتغليفها بشكل أنيق", "تصوير صور وفيديوهات عالية الجودة"] },
      { week: "الأسبوع 2", title: "التسويق للمحيط والأقارب", tasks: ["توزيع عينات مجانية على قاعات الحفلات أو الأقارب والمقاهي المجاورة", "إنشاء صفحة فيسبوك وأنستغرام"] },
      { week: "الأسبوع 3", title: "استقبال طلبيات الأسبوع الأول", tasks: ["أخذ طلبيات مسبقة بشروط عربون (30% مقدمًا)", "تسليم الطلبيات بالمواعيد"] },
      { week: "الأسبوع 4", title: "التوسع بعروض الأعراس والشبابيك", tasks: ["تقديم باقات خاصة بالخطوبة والختان والأعراس"] }
    ],
    legalNotes: "يمكن الحصول على بطاقة حرفي (Chambre des Métiers) للحصول على شهادة والتأمين.",
    source: "قطاع الصناعات الحرفية والأغذية المنزلية"
  },
  {
    projectId: "natural-honey-oils",
    projectName: "تجارة العسل الطبيعي والزيوت والأعشاب",
    category: "تجارة",
    description: "تعبئة وبيع العسل الحر والزيوت الطبيعية (زيت الزيتون، زيت الأرغان، زيوت الشعر) بأسماء وتغليف تجاري راقٍ أونلاين ومحليًا.",
    minCapital: 40000,
    recommendedCapital: 120000,
    maxCapital: 400000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["البيع", "التسويق", "الزراعة"],
    timeRequired: "2-4 ساعات",
    difficulty: "سهل",
    scalability: "مرتفعة",
    seasonality: "طوال السنة (ترتفع بالشتاء)",
    competitionLevel: "متوسطة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "قارورات زجاجية وطباعة ملصقات واحترافية", cost: 12000 },
      { item: "ميزان إلكتروني دقيق ومصفاة عسل", cost: 8000 }
    ],
    initialStock: 60000,
    fixedCosts: 4000,
    variableCostsPercent: 15,
    pricingMethod: "شراء بالجملة من مناحل موثوقة + 50% هامش ربح",
    profitFormula: "(سعر بيع الكيلو - سعر الشراء والتغليف) * الكيلوغرامات المباعة",
    breakEvenFormula: "بيع 20 كغ عسل يغطي كامل التكاليف الثابتة والتغليف",
    risks: [
      "ضرورة التحقق من جودة العسل لتفادي الغش والحفاظ على الثقة",
      "ارتفاع تكلفة التوصيل للقارورات الزجاجية"
    ],
    advantages: [
      "منتج صحي مطلوب جدًا لدى العائلات الجزائرية",
      "صلاحية تخزين طويلة بدون تلف سريع"
    ],
    disadvantages: [
      "يحتاج بناء ثقة قوية مع الزبائن"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "اختبار الجودة وتوفير العينات", tasks: ["الشراء من مناحل مجربة ومضمونة في البليدة أو جيجل أو الجلفة", "فحص العسل وتجهيز الهوية البصرية"] },
      { week: "الأسبوع 2", title: "التغليف وتجهيز العلب", tasks: ["طباعة المطبوعات ذات مظهر طبيعي وأنيق", "إنشاء مقاطع فيديو تشرح فوائد العسل المصدر"] },
      { week: "الأسبوع 3", title: "حملة إعلانات ممولة للتوصيل 58 ولاية", tasks: ["إطلاق إعلانات Facebook Target للعائلات المهتمة بالصحة", "تأمين الشحن التوصيل للمنازل"] },
      { week: "الأسبوع 4", title: "بناء قائمة زبائن دائمين", tasks: ["متابعة رضا الزبائن وإعطائهم تخفيضات في الشراء الثاني"] }
    ],
    legalNotes: "سجل تجاري إلكتروني أو بطاقة مقاول ذاتي تتيح العمل بكل أريحية.",
    source: "سوق المنتجات الطبيعية والغذائية في الجزائر"
  },
  {
    projectId: "custom-printing-gifts",
    projectName: "الطباعة الحرارية وتخصيص الهدايا (Sublimation)",
    category: "صناعة تقليدية",
    description: "الطباعة على الكؤوس (Mugs)، القمصان (T-shirts)، الوسائد، الميداليات والدروع التذكارية للمناسبات والمؤسسات.",
    minCapital: 60000,
    recommendedCapital: 180000,
    maxCapital: 500000,
    riskLevel: "متوسطة",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["التصميم", "التسويق", "البيع", "الحرف"],
    timeRequired: "4-6 ساعات",
    difficulty: "متوسط",
    scalability: "مرتفعة",
    seasonality: "مرتفعة بمواسم التخرج والأعياد",
    competitionLevel: "متوسطة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "مكبس حراري متعدد الاستعمالات (Press 5 in 1)", cost: 65000 },
      { item: "طابعة أحبار حرارية (Epson Sublimation)", cost: 45000 },
      { item: "ورق ورسوم حرارية مستهلكة", cost: 10000 }
    ],
    initialStock: 30000,
    fixedCosts: 5000,
    variableCostsPercent: 20,
    pricingMethod: "تكلفة الكأس الخام (200 دج) + طباعة (50 دج) يُباع بـ 800 - 1200 دج",
    profitFormula: "الإيرادات - (تكلفة القطعة الخام + الحبر + الكهرباء والتغليف)",
    breakEvenFormula: "بيع 70 كأس أو قميص مخصص يغطي الاستثمار الأولي للمعدات",
    risks: [
      "تلف بعض القطع أثناء التجربة الأولى والتسخين",
      "أعطال الطابعة إن لم تُستخدم بانتظام"
    ],
    advantages: [
      "هامش ربح ممتاز جداً يتجاوز 100%",
      "إمكانية التعاقد مع مدارس ومؤسسات ومحلات"
    ],
    disadvantages: [
      "يحتاج مهارة أولية في برامج Photoshop أو Canva"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "شراء العتاد وتجربة الطباعة", tasks: ["شراء المكبس والطابعة والتجربة على 10 عينات", "تعلم ضبط الحرارة والوقت لكل مادة"] },
      { week: "الأسبوع 2", title: "إنشاء الكتالوج والرقمي", tasks: ["تصميم تصاميم هدايا التخرج والخطوبة والأطفال", "نشر الفيديوهات وتفاعلية الشغل"] },
      { week: "الأسبوع 3", title: "التسويق أونلاين والمحلي", tasks: ["الترويج لهدايا شخصية في رمضان ومواسم النجاح", "مراسلة أصحاب المدارس الخاصة والنوادي"] },
      { week: "الأسبوع 4", title: "تنفيذ طلبيات الجملة والتجزئة", tasks: ["تلبية الطلبيات وإدماج شركات التوصيل السريع"] }
    ],
    legalNotes: "نشاط طباعة مصغرة، يندرج ضمن الحرف والخدمات الرقمية.",
    source: "دليل ورشات الطباعة المصغرة في الجزائر"
  },
  {
    projectId: "fast-food-delivery-hub",
    projectName: "خدمة التوصيل والوجبات السريعة المحلية",
    category: "خدمات",
    description: "تقديم وجبات سريعة خفيفة (ساندويتشات، بيتزا، طاجين محلي) مع خدمة التوصيل المباشر للمكاتب والمحلات والعمال في المنطقة.",
    minCapital: 50000,
    recommendedCapital: 150000,
    maxCapital: 400000,
    riskLevel: "متوسطة",
    requiresShop: true,
    homeBased: true,
    onlinePossible: true,
    transportRequired: true,
    skillsRequired: ["الطبخ", "الخدمات المنزلية", "السيارات"],
    timeRequired: "دوام كامل",
    difficulty: "متوسط",
    scalability: "متوسطة",
    seasonality: "طوال السنة",
    competitionLevel: "مرتفعة",
    targetArea: "مدن كبيرة",
    equipment: [
      { item: "معدات طهي ومقلاة كهربائية وحافظات حرارية", cost: 35000 },
      { item: "دراجة نارية للتوصيل (أو التعامل مع سائق)", cost: 80000 }
    ],
    initialStock: 20000,
    fixedCosts: 10000,
    variableCostsPercent: 45,
    pricingMethod: "سعر الوجبة + رسوم توصيل رمزية (100 - 200 دج)",
    profitFormula: "عدد الوجبات المباعة * متوسط هامش الوجبة (250 دج)",
    breakEvenFormula: "بيع 15 وجبة يومياً لتغطية كامل مصاريف العمالة والغاز والتوصيل",
    risks: [
      "شروط النظافة وصلاحية المواد الغذائية",
      "تأخر التوصيل في أوقات الذروة"
    ],
    advantages: [
      "دفق نقدي يومي سريع",
      "طلب يومي مستمر خصوصاً للموظفين والتجار"
    ],
    disadvantages: [
      "يتطلب ساعات عمل ملتزمة وقت الغداء والعشاء"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "تحديد قائمة الوجبات (Menu)", tasks: ["اختيار 5 وجبات سريعة ومطلوبة وبسيطة التحضير", "حساب التكلفة بدقة لكل وجبة"] },
      { week: "الأسبوع 2", title: "توزيع القوائم على المكاتب والمحلات", tasks: ["طباعة مطويات وتوزيعها على أصحاب المحلات المجاورة", "إنشاء رقم WhatsApp للطلبات السريعة"] },
      { week: "الأسبوع 3", title: "إطلاق التوصيل التجريبي", tasks: ["توفير حافظة حرارية وضمان توصيل أسرع من 30 دقيقة"] },
      { week: "الأسبوع 4", title: "العقود الأسبوعية للموظفين", tasks: ["تقديم باقة اشتراك أسبوعية للموظفين بأسعار تنافسية"] }
    ],
    legalNotes: "يتطلب مراعاة قواعد السلامة الصحية وشروط النظافة المقررة قانوناً.",
    source: "دراسة قطاع الإطعام السريع والتوصيل"
  },
  {
    projectId: "mobile-repair-freelance",
    projectName: "صيانة الهواتف والبرمجيات (Flash & Repair)",
    category: "خدمات",
    description: "تقديم خدمات إصلاح الشاشات، البطاريات، وتحديث وتفليش الهواتف من المنزل أو عبر التعامل مع محلات الهواتف المجاورة.",
    minCapital: 35000,
    recommendedCapital: 110000,
    maxCapital: 350000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["الهواتف والإلكترونيات", "البرمجة", "الحرف"],
    timeRequired: "4-6 ساعات",
    difficulty: "متوسط",
    scalability: "متوسطة",
    seasonality: "طوال السنة",
    competitionLevel: "متوسطة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "محطة لحام ومسدس هواء ساخن (Hot Air Station)", cost: 22000 },
      { item: "مجموعة أدوات مفاتيح ودقائق الفك والتركيب", cost: 8000 },
      { item: "حاسوب للبرمجيات والتفليش (Flash)", cost: 45000 }
    ],
    initialStock: 15000,
    fixedCosts: 3000,
    variableCostsPercent: 15,
    pricingMethod: "تكلفة القطعة + 1500 إلى 4000 دج أيدٍ عاملة حسب صعوبة العطل",
    profitFormula: "عدد الهواتف المصلحة * أُجرة اليد العاملة - تكلفة المواد المستهلكة",
    breakEvenFormula: "إصلاح 10 هواتف فقط يغطي تكلفة الأدوات الأساسية",
    risks: [
      "خطر إتلاف شاشة أو شريحة أثناء الفك إن لم تتوفر الدقة",
      "التطور السريع لبرامج الحماية بالهواتف"
    ],
    advantages: [
      "ربحية مرتفعة على اليد العاملة والخبرة",
      "يمكنك أخذ قطع الغيار من الزبون مسبقاً"
    ],
    disadvantages: [
      "يتطلب تدريباً عملياً ودقة عالية"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "التدريب والتمرس", tasks: ["إصلاح 5 هواتف قديمة للتدريب على فك الشاشات", "تحميل البرامج والبوكسات المجانية للتفليش"] },
      { week: "الأسبوع 2", title: "التعاقد مع محلات الهواتف", tasks: ["عرض خدمات الإصلاح بالجملة للمحلات التي لا تملك تقني صيانة"] },
      { week: "الأسبوع 3", title: "التسويق عبر فيسبوك والمجموعات المحلية", tasks: ["نشر فيديوهات قبل وبعد الإصلاح لاستقطاب الزبائن المباشرين"] },
      { week: "الأسبوع 4", title: "توفير خدمة الإصلاح السريع في المنزل", tasks: ["استلام الهاتف وإصلاحه وإرجاعه للزبون بنفس اليوم"] }
    ],
    legalNotes: "بطاقة مقاول ذاتي تخصص صيانة الأجهزة الإلكترونية والهواتف.",
    source: "دليل فنيي صيانة الإلكترونيات بالجزائر"
  },
  {
    projectId: "social-media-management",
    projectName: "إدارة صفحات التواصل والإنستغرام للمحلات",
    category: "أونلاين",
    description: "إدارة صفحات الفيس بوك، الانستغرام، والتيك توك للمحلات والشركات المحلية، نشر التصاميم، الرد على الرسائل والمتابعة.",
    minCapital: 15000,
    recommendedCapital: 40000,
    maxCapital: 100000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["التسويق", "التصميم", "صناعة المحتوى", "البرمجة"],
    timeRequired: "2-4 ساعات",
    difficulty: "سهل",
    scalability: "مرتفعة",
    seasonality: "طوال السنة",
    competitionLevel: "متوسطة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "حاسوب متصل بالإنترنت أو هاتف قوي", cost: 30000 },
      { item: "اشتراك Canva Pro وباقة إنترنت سريعة", cost: 5000 }
    ],
    initialStock: 0,
    fixedCosts: 4000,
    variableCostsPercent: 2,
    pricingMethod: "باقات إدارية شهرية (من 15,000 دج إلى 40,000 دج للصفحة الواحدة)",
    profitFormula: "عدد الصفحات المدارة * قيمة الاشتراك الشهرية - اشتراكات الأدوات",
    breakEvenFormula: "عقد إدارة صفحة واحدة بسعر 15,000 دج يغطي كل المصاريف السنوية للإنترنت والأدوات",
    risks: [
      "تغير خوارزميات المنصات أو حظر الحسابات الإعلانية",
      "عدم استجابة الزبائن إن لم تتأكد من تناسق المبيعات"
    ],
    advantages: [
      "يمكن العمل بالكامل من المنزل وفي أي وقت",
      "مدخول شهري ثابت ومستقر لكل مشروع تحصله"
    ],
    disadvantages: [
      "يتطلب انضباط في المواعيد ورد سريع على الرسائل"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "تجهيز النماذج والعروض", tasks: ["إنشاء خطة محتوى نموذجية لمتجر ملابس أو مطعم", "تصميم 10 منشورات ببرنامج Canva"] },
      { week: "الأسبوع 2", title: "التواصل وإرسال العروض", tasks: ["مراسلة 20 صفحة محلات محلية لا تنشر باستمرار", "تقديم أسبوع تجريبي مجاني"] },
      { week: "الأسبوع 3", title: "توقيع العقود الأولى", tasks: ["الاتفاق مع صفحتين للبدء بالعمل التجاري مقابل 25,000 دج شهرياً"] },
      { week: "الأسبوع 4", title: "التوسع وتحسين النتائج", tasks: ["تقديم تقارير وصول وتفاعل إيجابية للتجار لإبقاء العقود واستقطاب المزيد"] }
    ],
    legalNotes: "نشاط خدمات تسويق إلكتروني وتحرير محتوى أونلاين.",
    source: "مجتمع التسويق الرقمي والمستقلين بالجزائر"
  },
  {
    projectId: "tutoring-learning-hub",
    projectName: "دروس الدعم والدورات التدريبية المخصصة",
    category: "تعليم",
    description: "تقديم دروس دعم في المواد الأساسية (رياضيات، علوم، لغات) للتلاميذ أو دورات تدريبية مصغرة في مهارات العمل أونلاين ومحلياً.",
    minCapital: 10000,
    recommendedCapital: 35000,
    maxCapital: 120000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["التعليم", "الإدارة", "صناعة المحتوى"],
    timeRequired: "2-4 ساعات",
    difficulty: "سهل",
    scalability: "مرتفعة",
    seasonality: "مرتفعة بالموسم الدراسي",
    competitionLevel: "متوسطة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "سبورة ودفاتر ومطبوعات تعليمية", cost: 8000 },
      { item: "كاميرا هاتف ومكرفون لشرح أونلاين (Zoom/Google Meet)", cost: 12000 }
    ],
    initialStock: 0,
    fixedCosts: 2000,
    variableCostsPercent: 5,
    pricingMethod: "اشتراك شهري للطالب (2000 - 4000 دج) أو بالحصة",
    profitFormula: "عدد الطلاب * الاشتراك الشهر - مصاريف الطباعة والقاعة أو الإنترنت",
    breakEvenFormula: "طالبان فقط يغطيان كافة المصاريف التشغيلية الأولية",
    risks: [
      "موسمية العمل وانخفاض الإقبال في العطلة الصيفية"
    ],
    advantages: [
      "رأس مال شبه منعدم، الاعتماد الأساسي على المهارة والمعرفة",
      "طلب عالي دائم من الأولياء لرفع مستوى أبنائهم"
    ],
    disadvantages: [
      "يحتاج قدرة على الشرح وتطوير أسلوب ممتع"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "تحديد البرنامج والمستوى", tasks: ["إعداد ملخصات ممتازة وسلسلة تمارين محلولة", "تحديد الفئة المستهدفة (ثانوي/متوسط)"] },
      { week: "الأسبوع 2", title: "الإعلان في المجموعات المحلية", tasks: ["نشر إعلانات في المجموعات السكنية والفيسبوك", "تقديم حصة تجريبية مجانية"] },
      { week: "الأسبوع 3", title: "تشكيل المجموعات", tasks: ["بدء التدريس لمجموعة من 6 إلى 10 تلاميذ حظورياً أو عبر Zoom"] },
      { week: "الأسبوع 4", title: "قياس التقدم والشهادات", tasks: ["إجراء تقييم دوري وإعلام الأولياء بالنتائج لضمان الاستمرارية"] }
    ],
    legalNotes: "تقديم دروس حرة أو الاعتماد على مراكز تدريب معتمدة مؤجرة بالساعة.",
    source: "دليل التعليم ودروس الدعم في الجزائر"
  },
  {
    projectId: "clothing-e-commerce",
    projectName: "التجارة الإلكترونية للملابس والأحذية",
    category: "تجارة",
    description: "شراء ملابس رجالية/نسائية أو ملابس أطفال بالجملة (من العلمة، العاصمة أو الاستيراد المصغر) وبيعها أونلاين عبر الشحن لمختلف الولايات.",
    minCapital: 70000,
    recommendedCapital: 200000,
    maxCapital: 800000,
    riskLevel: "متوسطة",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["البيع", "التسويق", "الملابس"],
    timeRequired: "4-6 ساعات",
    difficulty: "متوسط",
    scalability: "مرتفعة",
    seasonality: "طوال السنة (ترتفع بالمواسم والأعياد)",
    competitionLevel: "مرتفعة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "مانكان (Mannequin) للتصوير وعلاقات ملابس", cost: 12000 },
      { item: "أكياس تغليف احترافية مع لوغو", cost: 10000 }
    ],
    initialStock: 120000,
    fixedCosts: 8000,
    variableCostsPercent: 20,
    pricingMethod: "تكلفة السلعة + 800 إلى 2000 دج هامش فائدة للقطعة",
    profitFormula: "المبيعات - (سعر الجملة + الإعلانات الممولة + المرتجعات + الشحن)",
    breakEvenFormula: "بيع 30 قطعة ملابس يغطي التكاليف التسويقية والثابتة",
    risks: [
      "نسبة المرتجعات (Retour) في التوصيل لعدم ملاءمة القياسات",
      "تغير الموضة والقياسات المتبقية (سيري غير مكتمل)"
    ],
    advantages: [
      "سوق هائل جداً وتفضيل وافي للشراء أونلاين بالجزائر",
      "إمكانية تحقيق أرباح وتوسع متسارع مع الإعلانات"
    ],
    disadvantages: [
      "يحتاج تسيير دقيق للمقاسات والألوان وتكاليف الإعلان"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "اختيار النيش والسعر", tasks: ["التركيز على فئة معينة (مثلاً: ملابس رياضية رجالية أو ملابس أطفال)", "زيارة أسواق الجملة وتحديد المورد"] },
      { week: "الأسبوع 2", title: "تصوير وتجهيز المحتوى", tasks: ["ارتداء الملابس والتصوير بشكل واقعي واحترافي", "تحديد الجدول القياسي للمقاسات S/M/L/XL"] },
      { week: "الأسبوع 3", title: "إطلاق حملة الإعلانات الممولة", tasks: ["حملة على Facebook / TikTok بإصدار فيديوهات كواواليتي عالية", "إدارة الطلبيات هاتفياً تأكيد القياس"] },
      { week: "الأسبوع 4", title: "تصفية المخزون والتوسع", tasks: ["عمل عروض التخفيضات للبضاعة البطيئة واستيراد موديلات جديدة"] }
    ],
    legalNotes: "سجل تجاري إلكتروني للتجارة بالملابس أو بطاقة مقاول ذاتي.",
    source: "دراسة التجارة الإلكترونية وسوق الملابس بالجزائر"
  },
  {
    projectId: "car-detailing-mobile",
    projectName: "تنظيف وغسيل السيارات المتنقل والمعالج",
    category: "خدمات",
    description: "تقديم خدمة غسيل السيارات الاحترافي بالبخار والتنظيف الجاف للمقاعد والمحركات أمام منازل ومكاتب الزبائن.",
    minCapital: 80000,
    recommendedCapital: 220000,
    maxCapital: 600000,
    riskLevel: "متوسطة",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: true,
    skillsRequired: ["السيارات", "الخدمات المنزلية", "البيع"],
    timeRequired: "دوام كامل",
    difficulty: "متوسط",
    scalability: "مرتفعة",
    seasonality: "طوال السنة (تزداد بالصيف والأعراس)",
    competitionLevel: "متوسطة",
    targetArea: "مدن كبيرة",
    equipment: [
      { item: "آلة غسيل بالضغط العالي (Kärcher High Pressure)", cost: 45000 },
      { item: "مضخة شفط مياه وأتربة احترافية (Injecteur / Extracteur)", cost: 55000 },
      { item: "مجموعة المنظفات والشامبو والمواد الملمعة", cost: 20000 }
    ],
    initialStock: 15000,
    fixedCosts: 6000,
    variableCostsPercent: 15,
    pricingMethod: "غسيل شامل للمركبة (من 2500 دج إلى 7000 دج) حسب الفئة ونظافة المقاعد",
    profitFormula: "الإيرادات - (المواد المستهلكة + الوقود والمواصلات)",
    breakEvenFormula: "تنظيف 15 سيارة غسيلاً شاملاً يغطي كامل العتاد الأولي",
    risks: [
      "صعوبة التنقل بدون سيارة خاصة لإنزال المعدات",
      "استهلاك المواد والأدوات"
    ],
    advantages: [
      "خدمة مريحة جداً يفضلها أصحاب السيارات الفخمة والموظفين",
      "هامش ربح صافي يزيد عن 70%"
    ],
    disadvantages: [
      "مجهود بدني عالي ويتطلب عناية بالدقة"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "تجهيز العتاد والمجربات", tasks: ["شراء آلة الرغوة والشفاط وتجربتها على سيارتك أو سيارات الأقارب", "تسجيل فيديوهات قبل وبعد التنظيف"] },
      { week: "الأسبوع 2", title: "التسويق لأصحاب السيارات والشركات", tasks: ["إنشاء صفحة Facebook وكارت فيزيت ذكي", "مراسلة أصحاب سيارات الكراء والتاكسي"] },
      { week: "الأسبوع 3", title: "استقبال المواعيد الميدانية", tasks: ["تنظيم جدول المواعيد حسَب البلديات المجاورة لتقليل مصاريف البنزين"] },
      { week: "الأسبوع 4", title: "باقة الاشتراك الدوري", tasks: ["تقديم غسيل دوري أسبوعي بأسعار تفضيلية للمشتركين الدائمين"] }
    ],
    legalNotes: "خدمات تنظيف وتلميع المركبات المتنقلة.",
    source: "سوق خدمات السيارات والعناية بالمركبات في الجزائر"
  },
  {
    projectId: "home-maintenance-agency",
    projectName: "وساطة وخدمات الصيانة المنزلية (Plumber/Electrician)",
    category: "خدمات",
    description: "منصة أو مكتب وساطة يربط بين الفنيين (سباك، كهربائي، تصليح مبردات Clim) مع العائلات والمحلات عبر رقم موحد وضمان الجودة.",
    minCapital: 20000,
    recommendedCapital: 50000,
    maxCapital: 150000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["الخدمات المنزلية", "الإدارة", "البيع", "التسويق"],
    timeRequired: "4-6 ساعات",
    difficulty: "سهل",
    scalability: "مرتفعة",
    seasonality: "طوال السنة (ترتفع بالصيف للمبردات)",
    competitionLevel: "منخفضة",
    targetArea: "مدن كبيرة",
    equipment: [
      { item: "هاتف مخصص للرد مع خطوط هاتفية وبطاقات عمل", cost: 15000 },
      { item: "مطبوعات ورقية ملصقة في العمارات والمجمعات السكنية", cost: 10000 }
    ],
    initialStock: 0,
    fixedCosts: 3000,
    variableCostsPercent: 5,
    pricingMethod: "عمولة 20% - 30% من قيمة التدخل الفني أو سعر ثابت لكل تدفق",
    profitFormula: "مجموع العمولات المستلمة من الفنيين - تكاليف الإعلانات والاتصالات",
    breakEvenFormula: "10 التدخلات الفنية شهرياً تغطي كامل التكاليف التشغيلية",
    risks: [
      "عدم التزام بعض الفنيين بمواعيدهم أو جودة عملهم",
      "تجاوز الزبون للفني بعد التدخل الأول"
    ],
    advantages: [
      "رأس مال بسيط جدًا وبدون مخاطرة مخزون",
      "حل مشكلة حقيقية لدى العائلات الجزائرية في إيجاد حرفي موثوق"
    ],
    disadvantages: [
      "يحتاج اختيار حرفيين متخلقين وموثوقين"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "شبكة الحرفيين المعتمدين", tasks: ["الالتقاء بـ 10 حرفيين (سباكين، كهربائيين، تقنيي التكييف) والاتفاق على نسبة العمولة", "فحص مهاراتهم وسوابقهم"] },
      { week: "الأسبوع 2", title: "التسويق في المجمعات السكنية", tasks: ["تعليق ملصقات في الإقامات السكنية وAdmains الأحياء", "إنشاء صفحة Facebook مستهدفة"] },
      { week: "الأسبوع 3", title: "استقبال المكالمات وتوجيه الفنيين", tasks: ["متابعة كل طلبية وتقييم الزبون للخدمة بعد الانتهاء"] },
      { week: "الأسبوع 4", title: "التعاقد مع إدارات ومحلات", tasks: ["عرض خدمات صيانة دورية للشركات والمطاعم"] }
    ],
    legalNotes: "مكتب خدمات ووساطة إدارية وحرفية.",
    source: "دليل المبادرات والخدمات السريعة"
  },
  {
    projectId: "perfume-oils-refill",
    projectName: "تركيب وبيع العطور الفاخرة (Parfums de Grasse)",
    category: "تجارة",
    description: "تركيب العطور المركزة المستوردة وإعادة عبئها في زجاجات أنيقة بتركيزات عالية وتوصيلها أونلاين أو عبر طاولة/محل صغير.",
    minCapital: 35000,
    recommendedCapital: 95000,
    maxCapital: 300000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["البيع", "التسويق", "الحرف"],
    timeRequired: "2-4 ساعات",
    difficulty: "سهل",
    scalability: "مرتفعة",
    seasonality: "طوال السنة",
    competitionLevel: "مرتفعة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "مشارب ومحاقن دقيقة لعيارات العطور الزيتية", cost: 5000 },
      { item: "قارورات زجاجية ذات رشاش أنيق والتغليف", cost: 20000 }
    ],
    initialStock: 45000,
    fixedCosts: 3500,
    variableCostsPercent: 10,
    pricingMethod: "تكلفة الزيت العطري والكحول والقارورة (600 دج) تُباع بـ 1800 إلى 3000 دج",
    profitFormula: "المبيعات - (التكلفة المباشرة للعطر + الزجاجة + الإعلان)",
    breakEvenFormula: "بيع 25 قارورة عطر يغطي كامل المصاريف والمواد الأولى",
    risks: [
      "شراء زيوت عطيرة رديئة الثبات",
      "تسرب السوائل أثناء الشحن البريدي"
    ],
    advantages: [
      "هامش ربح ضخم (غالباً تتجاوز الفائدة 150%)",
      "منتج خفيف الشحن وسهل التخزين بالمنزل"
    ],
    disadvantages: [
      "تقتضي تجربة العطور والأذواق الشائعة"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "شراء الزيوت العطرية الشهيرة", tasks: ["شراء أكثر 10 عطور عالمية طلبًا من موردي فرنسا أو إسبانيا بالجملة", "شراء الكحول العطري المخفف المخصص"] },
      { week: "الأسبوع 2", title: "التركيب والتعبئة والتصوير", tasks: ["تجهيز عينات بتركيز 30% لثبات يدوم 24 ساعة", "تصوير فيديو للتعبئة الأنيقة"] },
      { week: "الأسبوع 3", title: "التسويق عبر حزم العروض (Packs)", tasks: ["عرض باقة عطرين + عطر مجاني مع شحن مخفض"] },
      { week: "الأسبوع 4", title: "نقاط البيع في الصيدليات والمحلات", tasks: ["وضع حامل عروض مصغر لدى حلاقين ومحلات الملابس"] }
    ],
    legalNotes: "سجل تجاري مواد التجميل أو بطاقة مقاول ذاتي.",
    source: "سوق صناعة وتركيب العطور بالجزائر"
  },
  {
    projectId: "graphics-web-freelancing",
    projectName: "تصميم الجرافيك والإنفوجرافيك للمؤسسات",
    category: "أونلاين",
    description: "تصميم الهويات البصرية (Logos)، والشعارات والمطبوعات، وتصاميم الإعلانات للتجار والشركات الجزائرية أونلاين.",
    minCapital: 20000,
    recommendedCapital: 60000,
    maxCapital: 200000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["التصميم", "البرمجة", "التسويق", "صناعة المحتوى"],
    timeRequired: "4-6 ساعات",
    difficulty: "متوسط",
    scalability: "مرتفعة",
    seasonality: "طوال السنة",
    competitionLevel: "متوسطة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "حاسوب جافافيكس ذو مواصفات جيدة وشاشة مريحة", cost: 50000 },
      { item: "لوح رسم رقمي (Graphic Tablet) اختياري", cost: 10000 }
    ],
    initialStock: 0,
    fixedCosts: 3000,
    variableCostsPercent: 2,
    pricingMethod: "سعر الشعار (10,000 دج إلى 35,000 دج) أو الهوية الكاملة (60,000 دج)",
    profitFormula: "عدد المشاريع * قيمة المشروع - مصاريف الإنترنت والاشتراكات",
    breakEvenFormula: "مشروع تصميم هوية واحد يغطي كامل استثمار البرامج والعتاد",
    risks: [
      "كثرة التعديلات المطلوبة من الزبون إن لم تُحدد شروط العقد",
      "تأخر الدفع من بعض الشركات"
    ],
    advantages: [
      "عمل رقمي خالص بدون أي مصاريف شحن أو مخزون",
      "إكانية العمل مع عملاء خارج الجزائر بالعملة الصعبة"
    ],
    disadvantages: [
      "يتطلب معارف وإتقان لبرامج Adobe Photoshop & Illustrator"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "بناء معرض الأعمال (Behance / Instagram)", tasks: ["تصميم 4 هويات بصرية خيالية احترافية لعرض الإمكانيات"] },
      { week: "الأسبوع 2", title: "التواصل وإرسال الملاحظات للمحلات", tasks: ["اقتراح إعادة تصميم شعارات محلات محلية ذات هويات قديمة"] },
      { week: "الأسبوع 3", title: "تلقي أول الطلبيات بأربون 50%", tasks: ["تطبيق عقد ببدء العمل بعد استلام النصف وتأكيد الخريطة"] },
      { week: "الأسبوع 4", title: "التعاقد مع وكالات إعلامية", tasks: ["تقديم خدمات التصميم عن بعد لوكالات التسويق بالعاصمة ووهران"] }
    ],
    legalNotes: "بطاقة مقاول ذاتي رمز مصمم جرافيك ومطور واجهات.",
    source: "دليل العمل الحر بالجزائر"
  },
  {
    projectId: "agricultural-seedlings-honey",
    projectName: "مشتل النباتات الشجرية والمزهرة المنزلية",
    category: "زراعة",
    description: "إكثار وبيع شتلات الزينة، الشجيرات المثمرة المصغرة، والنعناع والأعشاب المنكهة في أوانٍ فخارية وبلاستيكية للمنازل والحدائق.",
    minCapital: 25000,
    recommendedCapital: 70000,
    maxCapital: 200000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["الزراعة", "البيع", "الحرف"],
    timeRequired: "2-4 ساعات",
    difficulty: "سهل",
    scalability: "متوسطة",
    seasonality: "ربيعي وخريفي",
    competitionLevel: "منخفضة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "أوانٍ بلاستيكية وتربة خصيبة (Pottage) ومخصبات", cost: 15000 },
      { item: "أدوات تقليم ونظام سقي مصغر", cost: 10000 }
    ],
    initialStock: 20000,
    fixedCosts: 2000,
    variableCostsPercent: 10,
    pricingMethod: "تكلفة الشتلة (100 دج) تباع بـ 500 إلى 1500 دج في أصيص تزين",
    profitFormula: "المبيعات - (تكلفة الشتلات + التربة + الأصص + المياه)",
    breakEvenFormula: "بيع 40 أصيص نبات زينة يغطي كامل التكاليف الأولية",
    risks: [
      "جفاف أو تلف بعض النباتات في حالة الإهمال في السقي",
      "الآفات الزراعية الموسمية"
    ],
    advantages: [
      "مشروع ممتع ومريح نفسياً ورأس ماله منخفض",
      "زيادة إقبال الجزائرين على تزيين البيوت والشرفات"
    ],
    disadvantages: [
      "يتطلب شغفاً بالتعامل مع النباتات والماء"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "التكثير وشراء الشتلات الصغرى", tasks: ["شراء الشتلات الخام من المشتل الرئيسي بالجملة", "غرسها في أصص جذابة مع سماد طبيعي"] },
      { week: "الأسبوع 2", title: "التصوير والتجميل", tasks: ["تصوير الشتلات في زوايا منازل أنيقة لإبراز قيمتها الديكورية"] },
      { week: "الأسبوع 3", title: "البيع في الأسواق والمجمعات", tasks: ["الترويج في مجموعات السكن وأمام محلات الديكور"] },
      { week: "الأسبوع 4", title: "إضافة خدمة العناية بالحدائق", tasks: ["عرض تنسيق حدائق منازل ومؤسسات كخدمة إضافية"] }
    ],
    legalNotes: "نشاط فلاحي حرة ومشتل معتمد.",
    source: "دليل المبادرات الزراعية المنزلية بالجزائر"
  },
  {
    projectId: "used-books-online",
    projectName: "تجارة الكتب المستعملة والجديدة أونلاين",
    category: "تجارة",
    description: "جمع وشراء الكتب المستعملة، الروايات، والمراجع الجامعية وتوفيرها للطلاب والقراء مع خدمة الشحن والتوصيل للمنازل.",
    minCapital: 15000,
    recommendedCapital: 45000,
    maxCapital: 150000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["البيع", "التعليم", "التسويق"],
    timeRequired: "2-4 ساعات",
    difficulty: "سهل",
    scalability: "متوسطة",
    seasonality: "طوال السنة (ترتفع ببدء الموسم الدراسي)",
    competitionLevel: "منخفضة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "رفوف تخزين كتب بسيطة بالمنزل", cost: 5000 },
      { item: "أغلفة حماية وأظرف شحن مقواة", cost: 4000 }
    ],
    initialStock: 25000,
    fixedCosts: 1500,
    variableCostsPercent: 5,
    pricingMethod: "شراء الكتاب بـ 200 - 400 دج ويُباع بـ 800 - 1500 دج حسب ندرته",
    profitFormula: "إجمالي المبيعات - (تكلفة شراء الكتب + أظرف التغليف والتسويق)",
    breakEvenFormula: "بيع 30 كتاباً يغطي الاستثمار الأولي بالمشروع",
    risks: [
      "بقاء بعض الكتب القليلة الطلب بالرفوف لفترة طويلة"
    ],
    advantages: [
      "لا تتلف البضاعة وتزداد قيمتها الندرة بمرور الوقت",
      "شغف متزايد لدى الشباب وقراء المطالعة"
    ],
    disadvantages: [
      "تقتضي القراءة ومعرفة العناوين المطلوبة"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "تجميع الكتب والمراجع", tasks: ["شراء مجموعات كتب مستعملة من أسواق المعرض أو الطلبة المتخرجين"] },
      { week: "الأسبوع 2", title: "تصنيف وفهرسة الكتب", tasks: ["تصوير غلاف كل كتاب وإعداد الملخص المشوق والمجال"] },
      { week: "الأسبوع 3", title: "النشر في مجموعات الجامعات والفيسبوك", tasks: ["استهداف طلبة الطب، الحقوق، والأدب والمطالعين"] },
      { week: "الأسبوع 4", title: "عروض الحزم الذكية (Box Lecteur)", tasks: ["تجهيز صندوق القارئ يحتوي على كتابين + فاصل كتاب (Bookmark) + شاي/قهوة"] }
    ],
    legalNotes: "تجارة التجزئة للكتب والمطبوعات الإلكترونية.",
    source: "دليل المكتبات وسوق الكتاب في الجزائر"
  },
  {
    projectId: "home-event-planning",
    projectName: "تنسيق ديكور الحفلات والمناسبات المصغرة",
    category: "خدمات",
    description: "تأجير وتنسيق خلفيات البالونات، الطاولات المضاءة، وديكورات أعياد الميلاد، الخطوبة، والختان في المنازل وقاعات الحفلات.",
    minCapital: 45000,
    recommendedCapital: 130000,
    maxCapital: 350000,
    riskLevel: "متوسطة",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: true,
    skillsRequired: ["التصميم", "الحرف", "التسويق", "البيع"],
    timeRequired: "4-6 ساعات",
    difficulty: "متوسط",
    scalability: "مرتفعة",
    seasonality: "مرتفعة في نهاية الأسبوع والمواسم",
    competitionLevel: "متوسطة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "هيكل دائري وخلفيات أكريليك لتنسيق البالونات", cost: 35000 },
      { item: "منفاخ بالونات كهربائي ومجموعة أكسسوارات إضاءة", cost: 18000 }
    ],
    initialStock: 20000,
    fixedCosts: 4000,
    variableCostsPercent: 15,
    pricingMethod: "تنسيق الحفلة (من 12,000 دج إلى 35,000 دج) حسب الحجم",
    profitFormula: "سعر الخدمة - (تكلفة البالونات المستهلكة + التنقل والنقل)",
    breakEvenFormula: "تنسيق 5 حفلات يغطي تكلفة الهيكل والأدوات الدائمة بالكامل",
    risks: [
      "تلف بعض الأدوات أو خدش الأكريليك أثناء النقل",
      "ضغط الوقت أثناء التركيب قبل وصول الضيوف"
    ],
    advantages: [
      "الأدوات تُستعمل مئات المرات بدون استهلاك",
      "هامش ربح مرتفع ورضا وسعادة لدى العائلات"
    ],
    disadvantages: [
      "يتطلب تنقلاً ونقلاً بالسيارة"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "شراء الهياكل وتجربة التنسيق", tasks: ["تركيب أول خلفية بالونات بالمنزل وتصويرها فيديو بدقة عالية"] },
      { week: "الأسبوع 2", title: "التسويق للأمهات في الفيسبوك وإنستغرام", tasks: ["نشر باقات التنسيق (باك الخطوبة، باك العقيقة)"] },
      { week: "الأسبوع 3", title: "تنفيذ أول مناسبة حقيقية", tasks: ["الالتزام بالدقة في الموعد والتركيب قبل الحفلة بساعتين"] },
      { week: "الأسبوع 4", title: "الشراكة مع المصورين والحلوانيين", tasks: ["تقديم عمولات متبادلة مع مصوري الحفلات وصانعي الكعك"] }
    ],
    legalNotes: "تنسيق وتنظيم المناسبات والحفلات الخاصة.",
    source: "دليل تنظيم المناسبات بالجزائر"
  },
  {
    projectId: "home-appliance-spareparts",
    projectName: "قطع غيار الأجهزة الكهرومنزلية ومستلزماتها",
    category: "تجارة",
    description: "توفير وبيع قطع الغيار الأكثر تعطلاً (أنابيب الغسالات، أزرار الأفران، أغطية الخلاطات، مصافي الآلات) أونلاين وللفنيين.",
    minCapital: 50000,
    recommendedCapital: 140000,
    maxCapital: 400000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["البيع", "الخدمات المنزلية", "التسويق"],
    timeRequired: "2-4 ساعات",
    difficulty: "سهل",
    scalability: "مرتفعة",
    seasonality: "طوال السنة",
    competitionLevel: "منخفضة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "رفوف وصناديق تصنيف البضائع", cost: 10000 },
      { item: "أدوات قياس وتأكيد الموديلات (Pied à coulisse)", cost: 5000 }
    ],
    initialStock: 80000,
    fixedCosts: 3000,
    variableCostsPercent: 8,
    pricingMethod: "هامش ربح 50% - 100% لكل قطعة غيار",
    profitFormula: "المبيعات - (سعر الجملة للقطع + تكاليف التوصيل والإعلانات)",
    breakEvenFormula: "بيع 40 قطعة غيار يغطي مصاريف التأسيس والشحن",
    risks: [
      "ضرورة التحقق الدقيق من توافق القطعة مع موديل الزبون"
    ],
    advantages: [
      "طلب اضطراري من الزبون (عند عطل الآلة يبحث فوراً عن القطعة)",
      "منافسة ضعيفة على الإنترنت مقارنة بالملابس"
    ],
    disadvantages: [
      "تنوع الموديلات والشركات (Condor, Iris, LG, Brand)"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "حصر القطع الأكثر طلباً", tasks: ["الالتقاء بـ 3 فنيين وسؤالهم عن القطع الأكثر عطلاً في الغسالات والأفران"] },
      { week: "الأسبوع 2", title: "الشراء من بائعي الجملة بالعاصمة أو العلمة", tasks: ["شراء تشكيلة أزرار، مضخات مياه غسالات، ومحركات خلاطات"] },
      { week: "الأسبوع 3", title: "النشر بأسماء القطع والشركات", tasks: ["استهداف البحث في جوجل وفيسبوك بأرقام قطع الغيار"] },
      { week: "الأسبوع 4", title: "التوصيل المباشر والتوسع", tasks: ["ربط الشحن والتوصيل للمنازل بالولايات"] }
    ],
    legalNotes: "تجارة التجزئة لقطع الغيار والمعدات.",
    source: "دليل تجارة قطع الغيار والكهرومنزليات"
  },
  {
    projectId: "custom-leather-handicrafts",
    projectName: "صناعة الجلديات والمحفظات اليدوية (Cuir Veritable)",
    category: "صناعة تقليدية",
    description: "تصنيع المحافظ الجلدية، أحزمة السراويل، وأغلفة الوثائق من الجلد الطبيعي بطريقة يدوية خياطة فاخرة.",
    minCapital: 30000,
    recommendedCapital: 85000,
    maxCapital: 250000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["الحرف", "التصميم", "البيع"],
    timeRequired: "4-6 ساعات",
    difficulty: "متوسط",
    scalability: "مرتفعة",
    seasonality: "طوال السنة",
    competitionLevel: "منخفضة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "أدوات تقطيع وتخريم الجلد والخيوط المشمعة", cost: 18000 },
      { item: "آلة حفر حراري للاسم والتخصيص (Gravure)", cost: 12000 }
    ],
    initialStock: 25000,
    fixedCosts: 2500,
    variableCostsPercent: 12,
    pricingMethod: "تكلفة الجلد والقطع (800 دج) تُباع المحفظة المخصصة بـ 3500 إلى 6000 دج",
    profitFormula: "المبيعات - (تكلفة أوراق الجلد والمستهلكات والتغليف)",
    breakEvenFormula: "بيع 12 محفظة جلدية فاخرة يغطي استثمار الأدوات الأولي",
    risks: [
      "تطلب وقتاً ومهارة يدوية وصبر في الخياطة"
    ],
    advantages: [
      "منتج ذو قيمة عالية وعمر طويل، مطلوب جداً كهدية قيمة للرجال والنساء",
      "إمكانية تخصيص كتابة اسم الزبون على الجلد"
    ],
    disadvantages: [
      "إنتاجية يدوية محددة بعدد القطع يومياً"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "تعلم وتقنيات الخياطة السرجية", tasks: ["صنع 3 نماذج محافظ جيب وأغلفة جواز سفر من الجلد الطبيعي"] },
      { week: "الأسبوع 2", title: "التصوير العالي الجودة", tasks: ["إبراز جودة الخياطة اليدوية والتخصيص بالحفر الحراري"] },
      { week: "الأسبوع 3", title: "التسويق لهدايا المناسبات والترقيات", tasks: ["استهداف الموظفين والراغبين في إهداء أزواجهم"] },
      { week: "الأسبوع 4", title: "الطلب المسبق بالتأكيد", tasks: ["إنتاج الطلبيات حسب الطلب والموديل المحدد من الزبون"] }
    ],
    legalNotes: "حرفة صناعة الجلديات بالصناعات التقليدية.",
    source: "قطاع الصناعة التقليدية والجلديات بالجزائر"
  },
  {
    projectId: "poultry-egg-distribution",
    projectName: "تربية وتوزيع بيض الدجاج البلدي والسمان",
    category: "زراعة",
    description: "إنتاج أو شراء البيض البلدي المخصب وبيض السمان من المزارع وتغليفه وتوزيعه على الصيدليات، محلات المواد الغذائية، والمستهلكين.",
    minCapital: 40000,
    recommendedCapital: 120000,
    maxCapital: 350000,
    riskLevel: "متوسطة",
    requiresShop: false,
    homeBased: true,
    onlinePossible: false,
    transportRequired: true,
    skillsRequired: ["الزراعة", "البيع", "السيارات"],
    timeRequired: "2-4 ساعات",
    difficulty: "سهل",
    scalability: "متوسطة",
    seasonality: "طوال السنة",
    competitionLevel: "منخفضة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "أطباق كرتونية وتغليف صحي", cost: 8000 },
      { item: "فقاسة بيض صغيرة (اختياري)", cost: 25000 }
    ],
    initialStock: 40000,
    fixedCosts: 3000,
    variableCostsPercent: 25,
    pricingMethod: "طبق البيض البلدي (30 بيضة) هامش فائدة 300 إلى 500 دج للطبق",
    profitFormula: "عدد الأطباق المباعة * هامش الربح للطبق - مصاريف النقل",
    breakEvenFormula: "توزيع 25 طبق بيض أسبوعياً يغطي المصاريف التشغيلية",
    risks: [
      "كسر البيض أثناء النقل في حال عدم تثبيته جيداً",
      "صلاحية وتاريخ الإنتاج"
    ],
    advantages: [
      "طلب عالي وقيمة غذائية يفضلها الجزائريون على البيض العادي",
      "دوران سريع جداً للمال"
    ],
    disadvantages: [
      "يتطلب سيارة أو وسيلة نقل للتوزيع الميداني"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "التعاقد مع المزارع والمنتجين", tasks: ["الأتفاق مع مربي الدجاج البلدي في المناطق الريفية لشراء الإنتاج يومياً"] },
      { week: "الأسبوع 2", title: "التعبئة ووضع العلامة", tasks: ["تغليف نظيف بأطباق كرتونية تحمل ملصق (بيض بلدي طبيعي 100%)"] },
      { week: "الأسبوع 3", title: "التوزيع على المحلات والصيدليات", tasks: ["زيارة 20 محل مواد غذائية وقصبة وإعطائهم أطباق باليد"] },
      { week: "الأسبوع 4", title: "جدول التوريد الدوري", tasks: ["الالتزام بتموين المحلات مرتين في الأسبوع"] }
    ],
    legalNotes: "نشاط فلاحي وتوزيع المنتجات الفلاحية.",
    source: "دليل المنتجات الفلاحية المحلية"
  },
  {
    projectId: "home-cleaning-services",
    projectName: "فريق تنظيف المنازل والشقق الجديدة (Nettoyage)",
    category: "خدمات",
    description: "تقديم خدمات التنظيف العميق للمنازل والشقق بعد البناء (Post-chantier) والسجاد والمفارش باستخدام معدات شفط حديثة.",
    minCapital: 40000,
    recommendedCapital: 110000,
    maxCapital: 300000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: true,
    skillsRequired: ["الخدمات المنزلية", "الإدارة", "البيع"],
    timeRequired: "4-6 ساعات",
    difficulty: "سهل",
    scalability: "مرتفعة",
    seasonality: "طوال السنة (ترتفع بالأعياد وسكنات AADL الجديدة)",
    competitionLevel: "متوسطة",
    targetArea: "مدن كبيرة",
    equipment: [
      { item: "آلة تنظيف الشقق والمفارش بالبخار والشفط", cost: 55000 },
      { item: "سلالم تلسكوبية ومواد تنظيف احترافية للزجاج والرخام", cost: 15000 }
    ],
    initialStock: 10000,
    fixedCosts: 4000,
    variableCostsPercent: 10,
    pricingMethod: "تنظيف شقة F3 (من 15,000 دج إلى 30,000 دج) حسب حالتها",
    profitFormula: "الإيرادات - (أجر العمال المشاركين + مواد التنظيف والتنقل)",
    breakEvenFormula: "تنظيف 4 شقق فقط يغطي الاستثمار الأولي للمعدات",
    risks: [
      "مجهود بدني والحاجة لعمالة مساعدة موثوقة"
    ],
    advantages: [
      "طلب ضخم جداً مع تسليم أحياء AADL والترقيات العقارية الجديدة بالجزائر",
      "أرباح ممتازة ونقدية فورية عند تسليم الشقة"
    ],
    disadvantages: [
      "يتطلب تنقلاً وعملاً ميدانياً"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "شراء المعدات وتجربتها", tasks: ["تجربة تنظيف شقة عائلية وتصوير تحول الشقة قبل وبعد"] },
      { week: "الأسبوع 2", title: "الإعلان في مجموعات أحياء عدل والعمارات الجديدة", tasks: ["نشر عروض الشقق الجديدة بسعر تشجيعي"] },
      { week: "الأسبوع 3", title: "تنفيذ التدخلات الأولى", tasks: ["التركيز على النظافة التامة للزجاج والأرضيات لضمان توصية الزبون لجيرانه"] },
      { week: "الأسبوع 4", title: "تكوين فريق عمل عند كثرة الطلبيات", tasks: ["الاستعانة بعمال بالساعة عند وجود أكثر من شقة باليوم"] }
    ],
    legalNotes: "مؤسسة مصغرة لخدمات النظافة والصيانة العامة.",
    source: "دليل شركات خدمات التنظيف بالجزائر"
  },
  {
    projectId: "car-accessories-dashcam",
    projectName: "مستلزمات وإكسسوارات السيارات الذكية (Dashcam & GPS)",
    category: "تجارة",
    description: "بيع كاميرات المراقبة للسيارات (Dashcam)، أجهزة تتبع المركبات GPS، وشواحن وحوامل الهواتف الذكية للسيارات أونلاين.",
    minCapital: 60000,
    recommendedCapital: 170000,
    maxCapital: 500000,
    riskLevel: "متوسطة",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["البيع", "السيارات", "التسويق", "الهواتف والإلكترونيات"],
    timeRequired: "2-4 ساعات",
    difficulty: "سهل",
    scalability: "مرتفعة",
    seasonality: "طوال السنة",
    competitionLevel: "متوسطة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "أدوات فحص وتجربة الكاميرات والأجهزة", cost: 5000 },
      { item: "علب تغليف ومطبوعات تعليمية بالعربية للتركيب", cost: 8000 }
    ],
    initialStock: 100000,
    fixedCosts: 6000,
    variableCostsPercent: 12,
    pricingMethod: "تكلفة الـ Dashcam (4500 دج) تُباع بـ 9500 إلى 14000 دج",
    profitFormula: "المبيعات - (تكلفة الشراء + الإعلانات الممولة + التوصيل)",
    breakEvenFormula: "بيع 18 كاميرا سيارة يغطي التكاليف التشغيلية الأولية",
    risks: [
      "ضرورة تقديم شرح بسيط للزبون عن طريقة التركيب الذاتي"
    ],
    advantages: [
      "ارتفاع الوعي لدى سائقي السيارات بأهمية الكاميرات للحماية من الحوادث",
      "منتج ذو سعر مرتفع وهامش فائدة ممتاز بالجزائر"
    ],
    disadvantages: [
      "استيراد وشراء السلع الإلكترونية يتطلب معايير جودة"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "استيراد/شراء دفعة أجهزة Dashcam 4K", tasks: ["اختيار 3 موديلات مجربة وعالية الجودة بميزة الرؤية الليلية"] },
      { week: "الأسبوع 2", title: "تصوير فيديو توضيحي داخل السيارة", tasks: ["تبيين كيف حمت الكاميرا السائق وكيفية تسديد السلك ببساطة"] },
      { week: "الأسبوع 3", title: "إعلانات مستهدفة لسائقي السيارات والتاكسي", tasks: ["استهداف محبي السيارات وسائقي التطبيقات (Yassir/Heetch)"] },
      { week: "الأسبوع 4", title: "تقديم خدمة التركيب المنزلي اختياريًا", tasks: ["التعامل مع كهربائي سيارات لتقديم خدمة التركيب للراغبين"] }
    ],
    legalNotes: "تجارة التجزئة لمعدات وإكسسوارات السيارات.",
    source: "سوق مستلزمات السيارات بالجزائر"
  },
  {
    projectId: "coffee-tea-kiosk",
    projectName: "كشك أو عربة الشاي والقهوة والمشروبات التقليدية",
    category: "تجارة",
    description: "تقديم الشاي الصحراوي المنعنع والقهوة العصرية والمكسرات في نقطة حيوية (محطة حافلات، شاطئ، أو سوق) عبر طاولة أو كشك أنيق.",
    minCapital: 50000,
    recommendedCapital: 160000,
    maxCapital: 450000,
    riskLevel: "متوسطة",
    requiresShop: true,
    homeBased: false,
    onlinePossible: false,
    transportRequired: true,
    skillsRequired: ["البيع", "الطبخ", "الخدمات المنزلية"],
    timeRequired: "دوام كامل",
    difficulty: "متوسط",
    scalability: "متوسطة",
    seasonality: "طوال السنة (ترتفع بالصيف والشتاء)",
    competitionLevel: "مرتفعة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "آلة قهوة أو إبريق شاي صحراوي نحاسي كبير", cost: 35000 },
      { item: "طاولة عرض إينوكس ومظلة خشبية جذابة", cost: 40000 },
      { item: "كؤوس ورقية وقارورات غاز محمولة", cost: 10000 }
    ],
    initialStock: 25000,
    fixedCosts: 8000,
    variableCostsPercent: 30,
    pricingMethod: "كأس الشاي/القهوة (50 - 100 دج) التكلفة المباشرة لا تتجاوز 15 دج",
    profitFormula: "عدد الكؤوس المباعة يومياً * الفائدة الصافية - حقوق الموقع والغاز",
    breakEvenFormula: "بيع 50 كأس يومياً لتغطية كامل مصاريف الإيجار والغاز والمواد",
    risks: [
      "موقع غير ممتلئ بالمارة",
      "التقلبات الجوية في الأيام الممطرة"
    ],
    advantages: [
      "سيولة نقدية يومية ممتازة وكاش مباشر",
      "هامش فائدة كبير جداً في المشروبات الساخنة"
    ],
    disadvantages: [
      "وقوف وساعات عمل طويلة طوال اليوم"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "تحديد الموقع ذو الكثافة العالية", tasks: ["استئجار مساحة مصغرة أو التنسيق مع صاحب محل أو محطة"] },
      { week: "الأسبوع 2", title: "سر إبريق الشاي والخلطة", tasks: ["ضبط خلطة الشاي الصحراوي بالنعناع والمكسرات لضمان طعم مميز"] },
      { week: "الأسبوع 3", title: "الافتتاح والتقديم السريع", tasks: ["الاهتمام بالنظافة والديكور التراثي الجذاب"] },
      { week: "الأسبوع 4", title: "إضافة المكسرات والحلويات التقليدية", tasks: ["بيع المكسرات وقلب اللوز لزيادة متوسط الفاتورة"] }
    ],
    legalNotes: "ترخيص كشك تجاري أو بيع المشروبات الخفيفة.",
    source: "دراسة الأنشطة التجارية الخفيفة بالجزائر"
  },
  {
    projectId: "translator-redaction-desk",
    projectName: "خدمات الترجمة والكتابة الإدارية والأكاديمية",
    category: "خدمات",
    description: "تقديم خدمات كتابة الرسائل الإدارية، سيرة ذاتية CV احترافية، ترجمة الوثائق، وتنسيق مذكرات التخرج للطلبة أونلاين.",
    minCapital: 10000,
    recommendedCapital: 30000,
    maxCapital: 90000,
    riskLevel: "منخفض",
    requiresShop: false,
    homeBased: true,
    onlinePossible: true,
    transportRequired: false,
    skillsRequired: ["التعليم", "الإدارة", "البرمجة", "التسويق"],
    timeRequired: "2-4 ساعات",
    difficulty: "سهل",
    scalability: "مرتفعة",
    seasonality: "مرتفعة بمواسم مذكرات التخرج (ماي-جوان)",
    competitionLevel: "منخفضة",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "حاسوب محمول للطباعة والكتابة", cost: 25000 },
      { item: "طابعة ومطاطات للتجميع (اختياري)", cost: 15000 }
    ],
    initialStock: 0,
    fixedCosts: 1500,
    variableCostsPercent: 2,
    pricingMethod: "كتابة CV احترافي (1500 - 3000 دج)، ترجمة الصفحة (800 - 1500 دج)",
    profitFormula: "الإيرادات - مصاريف الإنترنت والكهرباء والورق",
    breakEvenFormula: "إنجاز 10 سير ذاتية يغطي الاستثمار الأولي بأكمله",
    risks: [
      "مراعاة الدقة اللغوية والأملائية والتنسيق"
    ],
    advantages: [
      "مشروع سريع البدء وبدون أي تكلفة رأس مالية تقريباً",
      "طلب عالي جداً من الجامعيين والباحثين عن عمل"
    ],
    disadvantages: [
      "يتطلب إتقان اللغة العربية، الفرنسية، والإنكليزية"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "تجهيز نماذج السير الذاتية الكندية والأوروبية", tasks: ["تصميم 5 نماذج CV جذابة بـ Canva وWord"] },
      { week: "الأسبوع 2", title: "النشر في مجموعات التوظيف والجامعات", tasks: ["عرض خدمة تحسين السيرة الذاتية واجتياز المقابلات"] },
      { week: "الأسبوع 3", title: "تقديم خدمة تنسيق مذكرات Master / Licence", tasks: ["الترويج لتنسيق المراجع والخرائط والفهارس للطلبة"] },
      { week: "الأسبوع 4", title: "التوسع للترجمة التجارية للشركات", tasks: ["ترجمة المواقع والكتالوجات للمؤسسات الصغرى"] }
    ],
    legalNotes: "خدمات كتابة وترجمة حرة.",
    source: "دليل الخدمات الطلابية والأكاديمية"
  },
  {
    projectId: "solar-cleaning-consulting",
    projectName: "صيانة وتنظيف الألواح الشمسية ومضخات المياه",
    category: "خدمات",
    description: "تقديم خدمات غسيل الألواح الشمسية في المناطق الفلاحية والصحراوية وصيانتها الدورية لضمان كفاءة إنتاج الكهرباء والمضخات.",
    minCapital: 50000,
    recommendedCapital: 150000,
    maxCapital: 400000,
    riskLevel: "متوسطة",
    requiresShop: false,
    homeBased: true,
    onlinePossible: false,
    transportRequired: true,
    skillsRequired: ["الهواتف والإلكترونيات", "الزراعة", "الخدمات المنزلية", "السيارات"],
    timeRequired: "4-6 ساعات",
    difficulty: "متوسط",
    scalability: "مرتفعة",
    seasonality: "طوال السنة (ترتفع بمواسم الغبار والصيف)",
    competitionLevel: "منخفضة جداً",
    targetArea: "جميع المناطق",
    equipment: [
      { item: "فرشاة تنظيف تلسكوبية مخصصة للألواح الشمسية 6 أمتار", cost: 38000 },
      { item: "مقياس جهد كهربائي ومضخة مياه خفيفة", cost: 25000 }
    ],
    initialStock: 5000,
    fixedCosts: 3500,
    variableCostsPercent: 10,
    pricingMethod: "تنظيف محطة فلاحية (من 10,000 دج إلى 40,000 دج) حسب عدد الألواح",
    profitFormula: "قيمة العقد - (تكاليف النقل والعمال والمياه المعالجة)",
    breakEvenFormula: "تنظيف 5 محطات شمسية يغطي العتاد الخاص بالكامل",
    risks: [
      "ضرورة عدم استعمال مياه ذات كلس عالي تفادياً للخدش",
      "العمل تحت الشمس في الفترات الصباحية"
    ],
    advantages: [
      "انتشار هائل للطاقة الشمسية في الفلاحة والمستثمرات بالجنوب والهضاب",
      "التنظيف يزيد إنتاجية الطاقة بـ 30% مما يجعل الفلاح يدفعه برحابة صدر"
    ],
    disadvantages: [
      "يتطلب تنقلاً للمزارع والمستثمرات"
    ],
    launchPlan: [
      { week: "الأسبوع 1", title: "شراء عتاد الفرشاة التلسكوبية", tasks: ["تجربة التنظيف على نظام شمسي فلاحي محلي واستعراض قياس الطاقة قبل وبعد"] },
      { week: "الأسبوع 2", title: "زيارة المستثمرات الفلاحية مباشرة", tasks: ["التحدث مع الفلاحين وإبراز الفرق في ضخ المياه بعد الغسيل"] },
      { week: "الأسبوع 3", title: "توقيع عقود تنظيف دوري (كل شهرين)", tasks: ["الاتفاق مع 4 مزارع كبيرة لعقود صيانة دائمية"] },
      { week: "الأسبوع 4", title: "إضافة فحص البطاريات والمحولات", tasks: ["تقديم تقرير صيانة شامل للفلاح"] }
    ],
    legalNotes: "صيانة وخدمات التركيبات الكهروميكانيكية والطاقة الشمسية.",
    source: "دراسة سوق الطاقة الشمسية والفلاحة بالجزائر"
  }
];

export const INITIAL_SOURCES = [
  {
    title: "قانون المقاول الذاتي بالجزائر (الجريدة الرسمية)",
    sourceUrl: "https://www.joradp.dz",
    category: "قوانين",
    notes: "يمنح بطاقة مقاول ذاتي مع نسبة ضريبة رمضية 0.5% لجميع الأنشطة الخدماتية والتجارية الإلكترونية المصغرة."
  },
  {
    title: "المركز الوطني للسجل التجاري CNRC",
    sourceUrl: "https://sidjilcom.cnrc.dz",
    category: "سجلي تجاري",
    notes: "تحديث رموز الأنشطة التجارية الإلكترونية والحرفية لعام 2024/2025."
  },
  {
    title: "دليل الوكالة الوطنية لدعم وتنمية المقاولاتية NESDA (أنسيج سابقاً)",
    sourceUrl: "https://www.nesda.dz",
    category: "تمويل",
    notes: "شروط تمويل المشاريع المصغرة ودراسات الجدوى الميدانية للشباب."
  }
];

// Note: Blog posts are now sourced from articlesData.ts, moreArticles.ts, and finalArticles.ts
// Import them in seed.ts to keep the file smaller
export const INITIAL_BLOG_POSTS: any[] = [];

