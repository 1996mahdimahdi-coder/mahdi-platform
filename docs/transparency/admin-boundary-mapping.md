# خريطة المطابقة بين التقسيم الإداري التاريخي (RGPH 2008) والتقسيم الحالي (69 ولاية / 1541 بلدية)

> هذا ملف تحليلي محلي — أُنشئ في المرحلة 3B (READ-ONLY). لا يُستخدم مباشرة للإدخال في قاعدة البيانات.
> التقسيم الحالي مُثبت من قاعدة NABDA المحلية (69 ولاية / 1541 بلدية) ويعادل رسميًا القانون رقم 06-26 لسنة 2026 (العدد 25 من الجريدة الرسمية).
> التقسيم التاريخي المرجعي لبيانات السكان: RGPH 2008 (ONS) — 48 ولاية / 1540 بلدية (تقسيم تاريخي).

## 1) نطاق الملف
- يحوي كل البلديات الحالية (1541) من قاعدة NABDA المحلية مع الحقول: current_wilaya_id | current_wilaya_code | current_wilaya_name_ar | current_commune_id | current_commune_name_ar.
- الحقول التاريخية (historical_name / historical_wilaya / historical_commune) تُترك فارغة حتى التحقق من قائمة RGPH 2008 الرسمية (ملفات ONS بنمط wXX_pXX.pdf).
- قاعدة صارمة: لا تُستخدم مطابقة الأسماء وحدها أبدًا. يوجد 46 اسمًا عربيًا مكررًا بين ولايات مختلفة.

## 2) التقسيمان المعنيان
| التقسيم | السنة | الولايات | البلديات | المصدر | نوعه |
|---|---|---|---|---|---|
| RGPH 2008 | 2008 | 48 | 1540 | ONS (تعداد) | historical administrative division |
| قبل 2019 | <=2018 | 48 | 1540 | قانون 84-09 المعدل | historical |
| 2019 | 2019 | 58 | 1541 | القانون 19-12 | historical |
| 2026 (حالي) | 2026 | 69 | 1541 | القانون 06-26 (العدد 25، 2026/04/05) | current — مطابق لقاعدة NABDA |

## 3) أنواع المطابقة (التصنيف)
| النوع | المعنى |
|---|---|
| EXACT | البلدية الحالية == البلدية التاريخية بوضوح |
| RENAMED | نفس البلدية لكن الاسم تغير |
| TRANSFERRED | البلدية أصبحت تابعة لولاية أخرى (مثال: بلديات الولايات 49–69 الجديدة) |
| SPLIT | بلدية تاريخية انقسمت إلى أكثر من بلدية |
| MERGED | عدة بلديات تاريخية أصبحت بلدية واحدة |
| CREATED | بلدية جديدة بلا رقم مباشر في RGPH 2008 |
| UNCERTAIN | لا يمكن إثبات المطابقة |

## 4) قواعد الثقة
- حقل confidence لا يُعتمد (يبقى pending) حتى إثبات: مطابقة بالاسم الرسمي + الرمز + مصدر المطابقة (JORADP / قائمة ONS).
- أي بلدية من ولاية مستحدثة (49–69) = مرشح TRANSFERRED بثقة منخفضة فقط حتى تُقابل قائمة RGPH 2008.
- لا تُنسب أي قيمة سكان/مساحة قبل اكتمال المطابقة (القاعدة الصارمة — القسمان 6 و7 من المرحلة 3B).

## 5) تحليل تكرار الأسماء (من قاعدة NABDA المحلية — 1541 بلدية)
- عدد الأسماء العربية المكررة بين ولايات مختلفة: 46
- عدد الأسماء الفرنسية المكررة بين ولايات مختلفة: 36
- عدد التكرارات داخل نفس الولاية: 0
- أمثلة حرجة (نفس الاسم في ولايات مختلفة — خطر نسبة رقم لبلدية خاطئة):
- المرسى (16,2,21)
- سيدي عبد الرحمن (14,2)
- العامرية (4,46)
- عين البيضاء (30,4)
- الحاسي (48,5)
- تيمزريت (35,6)
- الأربعاء (38,9)
- الشريعة (12,9)
- أولاد يعيش (48,9)
- بوقرة (64,9)
- المعمورة (10,20)
- عين الترك (10,31)
- عين الحجر (10,19,20)
- الحمامات (12,16)
- العقلة (12,39)
- العوينات (12,26)
- عين الكبيرة (13,19)
- منصورة (13,27)
- السبت (14,21)
- سيدي نعمان (15,26)
- المحمدية (16,29)
- سيدي امحمد (16,28)
- العنصر (18,31)
- الحامة (19,40)
- العلمة (19,23)
- الولجة (19,40,48)
- الحساسنة (20,46)
- أولاد إبراهيم (20,26)
- عين السلطان (20,44)
- الزيتونة (21,36)
- سيدي خالد (22,51)
- المطارفة (28,49)
- عين فارس (28,29)
- عين الكرمة (31,36)
- سيدي سليمان (32,38,55)
- سيدي عامر (32,42,68)
- الماين (34,44)
- المنصورة (34,47)
- أولاد سيدي ابراهيم (34,68)
- بن داود (34,48)
- أولاد عيسى (35,49)
- سوق الحد (35,48)
- العيون (36,38)
- خميستي (38,42)
- الشعيبة (42,51)
- دلدول (49,66)

> ملاحظة مهمة: البلديتان المحملتان حاليًا في commune_stats (محليًا فقط) تحملان نفس الاسم: المحمدية في ولاية الجزائر (16، id=492) والمحمدية في ولاية معسكر (29، id=929). هذا يؤكد أن المطابقة بالاسم وحده ممنوعة.

## 6) الولايات المستحدثة (ما بعد 2008) — بلدياتها مرشحة TRANSFERRED
الولايات ذات الأكواد 49–69 (21 ولاية: 10 من قانون 2019 و11 من قانون 2026).
عدد بلدياتها في قاعدة NABDA: 150 (من إجمالي 1541). كل بلدية فيها تحتاج إثبات هوية مقابل قائمة RGPH 2008 (معظمها موجودة باسم ثابت، ويجب إثبات ذلك بالمصدر).

## 7) الجدول الكامل (1541 صفًا — جاهز لملء الحقول التاريخية)
الأعمدة: current_wilaya_id | current_wilaya_code | current_wilaya_name_ar | current_commune_id | current_commune_name_ar | historical_name | historical_wilaya | historical_commune | source | source_year | mapping_type | confidence | notes

| current_wilaya_id | current_wilaya_code | current_wilaya_name_ar | current_commune_id | current_commune_name_ar | historical_name | historical_wilaya | historical_commune | source | source_year | mapping_type | confidence | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | 01 | أدرار | 4 | أدرار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 15 | 01 | أدرار | 15 | اقبلي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 9 | 01 | أدرار | 9 | السبع |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 3 | 01 | أدرار | 3 | أولاد أحمد تيمي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 16 | 01 | أدرار | 16 | أولف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 2 | 01 | أدرار | 2 | بودة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 11 | 01 | أدرار | 11 | تامست |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 12 | 01 | أدرار | 12 | تامنطيط |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 10 | 01 | أدرار | 10 | تسابيت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 13 | 01 | أدرار | 13 | تيت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1 | 01 | أدرار | 1 | تيمقتن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 7 | 01 | أدرار | 7 | رقان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 14 | 01 | أدرار | 14 | زاوية كنتة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 8 | 01 | أدرار | 8 | سالي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 6 | 01 | أدرار | 6 | عين زغمير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 5 | 01 | أدرار | 5 | فنوغيل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 41 | 02 | الشلف | 41 | أبو الحسن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 50 | 02 | الشلف | 50 | الأبيض مجاجة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 19 | 02 | الشلف | 19 | الحجاج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 18 | 02 | الشلف | 18 | الزبوجة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 43 | 02 | الشلف | 43 | الشطية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 29 | 02 | الشلف | 29 | الشلف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 48 | 02 | الشلف | 48 | الصبحة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 51 | 02 | الشلف | 51 | الظهرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 36 | 02 | الشلف | 36 | الكريمية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 28 | 02 | الشلف | 28 | المرسى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: المرسى (16,2,21) |
| 26 | 02 | الشلف | 26 | الهرانفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 30 | 02 | الشلف | 30 | أم الدروع |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 20 | 02 | الشلف | 20 | أولاد بن عبد القادر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 23 | 02 | الشلف | 23 | أولاد عباس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 45 | 02 | الشلف | 45 | أولاد فارس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 22 | 02 | الشلف | 22 | بريرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 49 | 02 | الشلف | 49 | بنايرية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 35 | 02 | الشلف | 35 | بني بوعتاب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 40 | 02 | الشلف | 40 | بني حواء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 25 | 02 | الشلف | 25 | بني راشد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 38 | 02 | الشلف | 38 | بوزغاية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 46 | 02 | الشلف | 46 | بوقادير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 27 | 02 | الشلف | 27 | تاجنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 39 | 02 | الشلف | 39 | تاوقريت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 17 | 02 | الشلف | 17 | تلعصة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 34 | 02 | الشلف | 34 | تنس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 37 | 02 | الشلف | 37 | حرشون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 31 | 02 | الشلف | 31 | سنجاس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 32 | 02 | الشلف | 32 | سيدي عبد الرحمن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: سيدي عبد الرحمن (14,2) |
| 33 | 02 | الشلف | 33 | سيدي عكاشة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 21 | 02 | الشلف | 21 | عين مران |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 44 | 02 | الشلف | 44 | مصدق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 24 | 02 | الشلف | 24 | وادي الفضة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 47 | 02 | الشلف | 47 | وادي سلي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 42 | 02 | الشلف | 42 | وادي قوسين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 57 | 03 | الأغواط | 57 | الأغواط |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 52 | 03 | الأغواط | 52 | البيضاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 64 | 03 | الأغواط | 64 | الحويطة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 65 | 03 | الأغواط | 65 | الخنق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 59 | 03 | الأغواط | 59 | العسافية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 66 | 03 | الأغواط | 66 | بن ناصر بن شهرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 56 | 03 | الأغواط | 56 | تاجرونة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 55 | 03 | الأغواط | 55 | تاجموت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 61 | 03 | الأغواط | 61 | حاسي الدلاعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 62 | 03 | الأغواط | 62 | حاسي الرمل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 60 | 03 | الأغواط | 60 | سيدي مخلوف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 54 | 03 | الأغواط | 54 | عين سيدي علي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 63 | 03 | الأغواط | 63 | عين ماضي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 58 | 03 | الأغواط | 58 | قصر الحيران |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 53 | 03 | الأغواط | 53 | قلتة سيدي سعد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 72 | 04 | أم البواقي | 72 | البلالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 92 | 04 | أم البواقي | 92 | الجازية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 94 | 04 | أم البواقي | 94 | الحرملية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 70 | 04 | أم البواقي | 70 | الرحية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 83 | 04 | أم البواقي | 83 | الزرق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 91 | 04 | أم البواقي | 91 | الضلعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 87 | 04 | أم البواقي | 87 | العامرية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: العامرية (4,46) |
| 68 | 04 | أم البواقي | 68 | الفجوج بوغرارة سعودي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 77 | 04 | أم البواقي | 77 | أم البواقي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 86 | 04 | أم البواقي | 86 | أولاد حملة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 76 | 04 | أم البواقي | 76 | أولاد زواي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 85 | 04 | أم البواقي | 85 | أولاد قاسم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 73 | 04 | أم البواقي | 73 | بحير الشرقي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 82 | 04 | أم البواقي | 82 | بريش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 80 | 04 | أم البواقي | 80 | بئر الشهداء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 75 | 04 | أم البواقي | 75 | سوق نعمان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 88 | 04 | أم البواقي | 88 | سيقوس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 81 | 04 | أم البواقي | 81 | عين البيضاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين البيضاء (30,4) |
| 90 | 04 | أم البواقي | 90 | عين الديس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 79 | 04 | أم البواقي | 79 | عين الزيتون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 78 | 04 | أم البواقي | 78 | عين ببوش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 69 | 04 | أم البواقي | 69 | عين فكرون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 93 | 04 | أم البواقي | 93 | عين كرشة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 84 | 04 | أم البواقي | 84 | عين مليلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 67 | 04 | أم البواقي | 67 | فكيرينة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 74 | 04 | أم البواقي | 74 | قصر الصباحي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 71 | 04 | أم البواقي | 71 | مسكيانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 95 | 04 | أم البواقي | 95 | هنشير تومغني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 89 | 04 | أم البواقي | 89 | وادي نيني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 129 | 05 | باتنة | 129 | أريس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 134 | 05 | باتنة | 134 | إشمول |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 132 | 05 | باتنة | 132 | الحاسي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الحاسي (48,5) |
| 104 | 05 | باتنة | 104 | الرحبات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 139 | 05 | باتنة | 139 | الشمرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 97 | 05 | باتنة | 97 | القصبات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 106 | 05 | باتنة | 106 | القيقبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 123 | 05 | باتنة | 123 | المعذر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 105 | 05 | باتنة | 105 | أولاد سلام |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 100 | 05 | باتنة | 100 | أولاد سي سليمان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 146 | 05 | باتنة | 146 | أولاد عوف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 145 | 05 | باتنة | 145 | أولاد فاضل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 135 | 05 | باتنة | 135 | إينوغيسن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 108 | 05 | باتنة | 108 | باتنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 144 | 05 | باتنة | 144 | بني فضالة الحقانية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 136 | 05 | باتنة | 136 | بوزينة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 138 | 05 | باتنة | 138 | بولهيلات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 126 | 05 | باتنة | 126 | بومقر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 121 | 05 | باتنة | 121 | بومية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 125 | 05 | باتنة | 125 | تازولت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 99 | 05 | باتنة | 99 | تاكسلانت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 102 | 05 | باتنة | 102 | تالخمت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 119 | 05 | باتنة | 119 | تغرغار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 142 | 05 | باتنة | 142 | تكوت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 130 | 05 | باتنة | 130 | تيغانمين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 98 | 05 | باتنة | 98 | تيمقاد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 107 | 05 | باتنة | 107 | ثنية العابد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 122 | 05 | باتنة | 122 | جرمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 111 | 05 | باتنة | 111 | حيدوسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 103 | 05 | باتنة | 103 | رأس العيون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 117 | 05 | باتنة | 117 | زانة البيضاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 116 | 05 | باتنة | 116 | سريانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 128 | 05 | باتنة | 128 | سفيان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 147 | 05 | باتنة | 147 | شير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 143 | 05 | باتنة | 143 | عين التوتة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 131 | 05 | باتنة | 131 | عين جاسر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 120 | 05 | باتنة | 120 | عين ياقوت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 124 | 05 | باتنة | 124 | عيون العصافير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 140 | 05 | باتنة | 140 | غسيرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 109 | 05 | باتنة | 109 | فسديس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 133 | 05 | باتنة | 133 | فم الطوب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 112 | 05 | باتنة | 112 | قصر بلزمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 141 | 05 | باتنة | 141 | كيمل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 137 | 05 | باتنة | 137 | لارباع |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 115 | 05 | باتنة | 115 | لازرو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 101 | 05 | باتنة | 101 | لمسان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 113 | 05 | باتنة | 113 | مروانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 96 | 05 | باتنة | 96 | معافة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 118 | 05 | باتنة | 118 | منعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 127 | 05 | باتنة | 127 | نقاوس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 110 | 05 | باتنة | 110 | وادي الشعبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 148 | 05 | باتنة | 148 | وادي الطاقة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 114 | 05 | باتنة | 114 | وادي الماء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 181 | 06 | بجاية | 181 | أدكار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 186 | 06 | بجاية | 186 | اغرم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 175 | 06 | بجاية | 175 | إغيل علي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 184 | 06 | بجاية | 184 | أقبو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 195 | 06 | بجاية | 195 | أكفادو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 151 | 06 | بجاية | 151 | الفلاي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 156 | 06 | بجاية | 156 | القصر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 188 | 06 | بجاية | 188 | أمالو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 200 | 06 | بجاية | 200 | أميزور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 199 | 06 | بجاية | 199 | أوزلاقن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 179 | 06 | بجاية | 179 | أوقاس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 176 | 06 | بجاية | 176 | أيت إسماعيل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 174 | 06 | بجاية | 174 | أيت رزين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 161 | 06 | بجاية | 161 | بجاية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 150 | 06 | بجاية | 150 | برباشة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 164 | 06 | بجاية | 164 | بني جليل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 182 | 06 | بجاية | 182 | بني كسيلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 163 | 06 | بجاية | 163 | بني معوش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 192 | 06 | بجاية | 192 | بني مليكش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 193 | 06 | بجاية | 193 | بو جليل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 189 | 06 | بجاية | 189 | بوحمزة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 171 | 06 | بجاية | 171 | بوخليفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 194 | 06 | بجاية | 194 | تازمالت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 178 | 06 | بجاية | 178 | تاسكريوت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 172 | 06 | بجاية | 172 | تالة حمزة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 170 | 06 | بجاية | 170 | تامريجت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 187 | 06 | بجاية | 187 | تامقرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 183 | 06 | بجاية | 183 | تاوريرت إغيل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 158 | 06 | بجاية | 158 | توجة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 180 | 06 | بجاية | 180 | تيزي نبربر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 173 | 06 | بجاية | 173 | تيشي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 154 | 06 | بجاية | 154 | تيفرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 167 | 06 | بجاية | 167 | تيمزريت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: تيمزريت (35,6) |
| 155 | 06 | بجاية | 155 | تينبدار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 160 | 06 | بجاية | 160 | خراطة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 177 | 06 | بجاية | 177 | درقينة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 159 | 06 | بجاية | 159 | ذراع القايد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 166 | 06 | بجاية | 166 | سمعون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 197 | 06 | بجاية | 197 | سوق اوفلا |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 169 | 06 | بجاية | 169 | سوق لإثنين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 149 | 06 | بجاية | 149 | سيدي عياد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 153 | 06 | بجاية | 153 | سيدي عيش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 185 | 06 | بجاية | 185 | شلاطة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 196 | 06 | بجاية | 196 | شميني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 191 | 06 | بجاية | 191 | صدوق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 198 | 06 | بجاية | 198 | طيبان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 165 | 06 | بجاية | 165 | فرعون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 157 | 06 | بجاية | 157 | فناية الماثن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 152 | 06 | بجاية | 152 | كنديرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 168 | 06 | بجاية | 168 | مالبو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 190 | 06 | بجاية | 190 | مسيسنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 162 | 06 | بجاية | 162 | وادي غير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 209 | 07 | بسكرة | 209 | الحاجب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 218 | 07 | بسكرة | 218 | الحوش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 212 | 07 | بسكرة | 212 | الغروس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 201 | 07 | بسكرة | 201 | الفيض |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 207 | 07 | بسكرة | 207 | المزيرعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 214 | 07 | بسكرة | 214 | أورلال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 215 | 07 | بسكرة | 215 | أوماش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 213 | 07 | بسكرة | 213 | برج بن عزوز |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 208 | 07 | بسكرة | 208 | بسكرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 203 | 07 | بسكرة | 203 | بوشقرون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 205 | 07 | بسكرة | 205 | خنقة سيدي ناجي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 206 | 07 | بسكرة | 206 | زريبة الوادي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 219 | 07 | بسكرة | 219 | سيدي عقبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 217 | 07 | بسكرة | 217 | شتمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 222 | 07 | بسكرة | 222 | طولقة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 216 | 07 | بسكرة | 216 | عين الناقة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 211 | 07 | بسكرة | 211 | فوغالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 202 | 07 | بسكرة | 202 | ليشانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 221 | 07 | بسكرة | 221 | ليوة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 204 | 07 | بسكرة | 204 | مخادمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 220 | 07 | بسكرة | 220 | مشونش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 210 | 07 | بسكرة | 210 | مليلي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 229 | 08 | بشار | 229 | العبادلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 234 | 08 | بشار | 234 | القنادسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 227 | 08 | بشار | 227 | المريجة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 223 | 08 | بشار | 223 | بشار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 232 | 08 | بشار | 232 | بني ونيف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 224 | 08 | بشار | 224 | بوكايس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 228 | 08 | بشار | 228 | تاغيت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 233 | 08 | بشار | 233 | تبلبالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 230 | 08 | بشار | 230 | عرق فراج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 225 | 08 | بشار | 225 | لحمر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 231 | 08 | بشار | 231 | مشرع هواري بومدين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 226 | 08 | بشار | 226 | موغل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 241 | 09 | البليدة | 241 | الأربعاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الأربعاء (38,9) |
| 259 | 09 | البليدة | 259 | البليدة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 256 | 09 | البليدة | 256 | الشبلي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 251 | 09 | البليدة | 251 | الشريعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الشريعة (12,9) |
| 246 | 09 | البليدة | 246 | الشفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 242 | 09 | البليدة | 242 | الصومعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 249 | 09 | البليدة | 249 | العفرون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 236 | 09 | البليدة | 236 | اولاد سلامة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 250 | 09 | البليدة | 250 | أولاد يعيش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: أولاد يعيش (48,9) |
| 254 | 09 | البليدة | 254 | بن خليل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 255 | 09 | البليدة | 255 | بني تامو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 235 | 09 | البليدة | 235 | بني مراد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 258 | 09 | البليدة | 258 | بوعرفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 257 | 09 | البليدة | 257 | بوعينان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 244 | 09 | البليدة | 244 | بوفاريك |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 239 | 09 | البليدة | 239 | بوقرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: بوقرة (64,9) |
| 252 | 09 | البليدة | 252 | جبابرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 238 | 09 | البليدة | 238 | حمام ملوان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 240 | 09 | البليدة | 240 | صوحان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 247 | 09 | البليدة | 247 | عين الرمانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 243 | 09 | البليدة | 243 | قرواو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 245 | 09 | البليدة | 245 | مفتاح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 237 | 09 | البليدة | 237 | موزاية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 253 | 09 | البليدة | 253 | وادي العلايق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 248 | 09 | البليدة | 248 | وادي جر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 271 | 10 | البويرة | 271 | آث منصور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 292 | 10 | البويرة | 292 | أعمر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 282 | 10 | البويرة | 282 | أغبالو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 300 | 10 | البويرة | 300 | الأخضرية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 274 | 10 | البويرة | 274 | الأسنام |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 286 | 10 | البويرة | 286 | البويرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 266 | 10 | البويرة | 266 | الحاكمية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 261 | 10 | البويرة | 261 | الحجرة الزرقاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 284 | 10 | البويرة | 284 | الخبوزية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 269 | 10 | البويرة | 269 | الدشمية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 273 | 10 | البويرة | 273 | العجيبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 265 | 10 | البويرة | 265 | المعمورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: المعمورة (10,20) |
| 290 | 10 | البويرة | 290 | المقراني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 294 | 10 | البويرة | 294 | الهاشمية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 275 | 10 | البويرة | 275 | أمشدالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 267 | 10 | البويرة | 267 | أهل القصر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 280 | 10 | البويرة | 280 | أولاد راشد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 288 | 10 | البويرة | 288 | أيت لعزيز |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 276 | 10 | البويرة | 276 | برج أوخريص |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 270 | 10 | البويرة | 270 | بشلول |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 297 | 10 | البويرة | 297 | بودربالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 298 | 10 | البويرة | 298 | بوكرم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 285 | 10 | البويرة | 285 | بئر غبالو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 296 | 10 | البويرة | 296 | تاغزوت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 263 | 10 | البويرة | 263 | تاقديت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 293 | 10 | البويرة | 293 | جباحية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 278 | 10 | البويرة | 278 | حنيف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 295 | 10 | البويرة | 295 | حيزر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 268 | 10 | البويرة | 268 | ديرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 283 | 10 | البويرة | 283 | روراوة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 264 | 10 | البويرة | 264 | ريدان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 303 | 10 | البويرة | 303 | زبربر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 272 | 10 | البويرة | 272 | سحاريج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 277 | 10 | البويرة | 277 | سور الغزلان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 291 | 10 | البويرة | 291 | سوق الخميس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 279 | 10 | البويرة | 279 | شرفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 287 | 10 | البويرة | 287 | عين الترك |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين الترك (10,31) |
| 281 | 10 | البويرة | 281 | عين الحجر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين الحجر (10,19,20) |
| 260 | 10 | البويرة | 260 | عين العلوي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 289 | 10 | البويرة | 289 | عين بسام |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 302 | 10 | البويرة | 302 | قادرية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 299 | 10 | البويرة | 299 | قرومة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 262 | 10 | البويرة | 262 | مزدور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 301 | 10 | البويرة | 301 | معلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 304 | 10 | البويرة | 304 | وادي البردي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 306 | 11 | تمنراست | 306 | ابلسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 309 | 11 | تمنراست | 309 | أدلس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 305 | 11 | تمنراست | 305 | تاظروك |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 307 | 11 | تمنراست | 307 | تمنراست |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 308 | 11 | تمنراست | 308 | عين امقل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 332 | 12 | تبسة | 332 | الحمامات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الحمامات (12,16) |
| 310 | 12 | تبسة | 310 | الحويجبات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 330 | 12 | تبسة | 330 | الشريعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الشريعة (12,9) |
| 325 | 12 | تبسة | 325 | العقلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: العقلة (12,39) |
| 311 | 12 | تبسة | 311 | العوينات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: العوينات (12,26) |
| 333 | 12 | تبسة | 333 | الكويف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 320 | 12 | تبسة | 320 | الماء الابيض |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 322 | 12 | تبسة | 322 | المريج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 326 | 12 | تبسة | 326 | المزرعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 321 | 12 | تبسة | 321 | الونزة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 318 | 12 | تبسة | 318 | أم علي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 327 | 12 | تبسة | 327 | بجن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 316 | 12 | تبسة | 316 | بكارية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 319 | 12 | تبسة | 319 | بوخضرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 317 | 12 | تبسة | 317 | بولحاف الدير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 313 | 12 | تبسة | 313 | بئر الذهب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 312 | 12 | تبسة | 312 | بئر مقدم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 331 | 12 | تبسة | 331 | تبسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 329 | 12 | تبسة | 329 | ثليجان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 324 | 12 | تبسة | 324 | سطح قنطيس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 314 | 12 | تبسة | 314 | صفصاف الوسرى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 323 | 12 | تبسة | 323 | عين الزرقاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 315 | 12 | تبسة | 315 | قريقر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 328 | 12 | تبسة | 328 | مرسط |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 354 | 13 | تلمسان | 354 | الحناية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 367 | 13 | تلمسان | 367 | الرمشي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 373 | 13 | تلمسان | 373 | السواحلية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 369 | 13 | تلمسان | 369 | السواني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 372 | 13 | تلمسان | 372 | الغزوات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 366 | 13 | تلمسان | 366 | الفحول |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 353 | 13 | تلمسان | 353 | أولاد رياح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 377 | 13 | تلمسان | 377 | أولاد ميمون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 334 | 13 | تلمسان | 334 | باب العسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 357 | 13 | تلمسان | 357 | بن سكران |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 348 | 13 | تلمسان | 348 | بني بوسعيد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 343 | 13 | تلمسان | 343 | بني خلاد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 375 | 13 | تلمسان | 375 | بني صميل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 337 | 13 | تلمسان | 337 | بني مستر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 365 | 13 | تلمسان | 365 | بني وارسوس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 349 | 13 | تلمسان | 349 | بوحلو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 361 | 13 | تلمسان | 361 | تلمسان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 374 | 13 | تلمسان | 374 | تيانت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 335 | 13 | تلمسان | 335 | تيرني بني هديل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 378 | 13 | تلمسان | 378 | جبالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 351 | 13 | تلمسان | 351 | حمام بوغرارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 371 | 13 | تلمسان | 371 | دار يغمراسن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 352 | 13 | تلمسان | 352 | زناتة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 368 | 13 | تلمسان | 368 | سبعة شيوخ |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 356 | 13 | تلمسان | 356 | سوق الثلاثاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 355 | 13 | تلمسان | 355 | سيدي العبدلي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 347 | 13 | تلمسان | 347 | سيدي مجاهد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 339 | 13 | تلمسان | 339 | شتوان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 370 | 13 | تلمسان | 370 | صبرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 340 | 13 | تلمسان | 340 | عمير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 359 | 13 | تلمسان | 359 | عين الكبيرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين الكبيرة (13,19) |
| 362 | 13 | تلمسان | 362 | عين النحالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 363 | 13 | تلمسان | 363 | عين تالوت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 338 | 13 | تلمسان | 338 | عين غرابة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 360 | 13 | تلمسان | 360 | عين فتاح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 341 | 13 | تلمسان | 341 | عين فزة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 364 | 13 | تلمسان | 364 | عين يوسف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 358 | 13 | تلمسان | 358 | فلاوسن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 346 | 13 | تلمسان | 346 | مرسى بن مهيدي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 345 | 13 | تلمسان | 345 | مسيردة الفواقة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 350 | 13 | تلمسان | 350 | مغنية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 336 | 13 | تلمسان | 336 | منصورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: منصورة (13,27) |
| 344 | 13 | تلمسان | 344 | ندرومة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 342 | 13 | تلمسان | 342 | هنين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 376 | 13 | تلمسان | 376 | وادي الخضر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 414 | 14 | تيارت | 414 | الرحوية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 387 | 14 | تيارت | 387 | السبت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: السبت (14,21) |
| 381 | 14 | تيارت | 381 | السبعين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 384 | 14 | تيارت | 384 | السوقر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 382 | 14 | تيارت | 382 | الفايجة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 404 | 14 | تيارت | 404 | الناظورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 411 | 14 | تيارت | 411 | النعيمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 402 | 14 | تيارت | 402 | تاقدمت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 391 | 14 | تيارت | 391 | تخمرت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 385 | 14 | تيارت | 385 | توسنينة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 405 | 14 | تيارت | 405 | تيارت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 403 | 14 | تيارت | 403 | تيدة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 393 | 14 | تيارت | 393 | جبيلات الرصفاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 400 | 14 | تيارت | 400 | جيلالي بن عمار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 413 | 14 | تيارت | 413 | دحموني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 383 | 14 | تيارت | 383 | سي عبد الغني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 408 | 14 | تيارت | 408 | سيدي بختي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 388 | 14 | تيارت | 388 | سيدي حسني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 396 | 14 | تيارت | 396 | سيدي عبد الرحمن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: سيدي عبد الرحمن (14,2) |
| 399 | 14 | تيارت | 399 | سيدي علي ملال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 410 | 14 | تيارت | 410 | شحيمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 389 | 14 | تيارت | 389 | عين الحديد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 409 | 14 | تيارت | 409 | عين الذهب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 412 | 14 | تيارت | 412 | عين بوشقيف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 380 | 14 | تيارت | 380 | عين دزاريت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 392 | 14 | تيارت | 392 | عين كرمس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 390 | 14 | تيارت | 390 | فرندة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 397 | 14 | تيارت | 397 | قرطوفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 394 | 14 | تيارت | 394 | مادنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 406 | 14 | تيارت | 406 | مدروسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 395 | 14 | تيارت | 395 | مدريسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 401 | 14 | تيارت | 401 | مشرع الصفا |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 386 | 14 | تيارت | 386 | مغيلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 407 | 14 | تيارت | 407 | ملاكو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 379 | 14 | تيارت | 379 | مهدية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 398 | 14 | تيارت | 398 | وادي ليلي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 446 | 15 | تيزي وزو | 446 | إبودرارن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 448 | 15 | تيزي وزو | 448 | أبي يوسف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 427 | 15 | تيزي وزو | 427 | أزفون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 430 | 15 | تيزي وزو | 430 | أسي يوسف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 466 | 15 | تيزي وزو | 466 | إعــكورن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 424 | 15 | تيزي وزو | 424 | أغريب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 480 | 15 | تيزي وزو | 480 | إفــرحــونان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 428 | 15 | تيزي وزو | 428 | إفليـــسن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 451 | 15 | تيزي وزو | 451 | اقبيل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 426 | 15 | تيزي وزو | 426 | أقرو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 420 | 15 | تيزي وزو | 420 | أقني قغران |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 470 | 15 | تيزي وزو | 470 | الأربعــاء ناث إيراثن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 462 | 15 | تيزي وزو | 462 | إمســوحال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 471 | 15 | تيزي وزو | 471 | أيت أومالو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 421 | 15 | تيزي وزو | 421 | أيت بــوادو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 438 | 15 | تيزي وزو | 438 | أيت بومهدي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 439 | 15 | تيزي وزو | 439 | أيت تودرت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 442 | 15 | تيزي وزو | 442 | أيت خليلي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 425 | 15 | تيزي وزو | 425 | أيت شافع |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 468 | 15 | تيزي وزو | 468 | أيت عقـواشة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 473 | 15 | تيزي وزو | 473 | أيت عيسى ميمون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 478 | 15 | تيزي وزو | 478 | أيت محمود |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 455 | 15 | تيزي وزو | 455 | أيت يحي موسى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 450 | 15 | تيزي وزو | 450 | أيت يحيى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 416 | 15 | تيزي وزو | 416 | إيجــار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 469 | 15 | تيزي وزو | 469 | إيرجـــن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 465 | 15 | تيزي وزو | 465 | إيفيغاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 419 | 15 | تيزي وزو | 419 | إيلولة أومـــالو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 461 | 15 | تيزي وزو | 461 | إيلـيــلتـن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 417 | 15 | تيزي وزو | 417 | بني دوالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 479 | 15 | تيزي وزو | 479 | بنــــي زمنزار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 418 | 15 | تيزي وزو | 418 | بني زيكــي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 440 | 15 | تيزي وزو | 440 | بني عيسي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 445 | 15 | تيزي وزو | 445 | بني يني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 452 | 15 | تيزي وزو | 452 | بوجيمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 481 | 15 | تيزي وزو | 481 | بوزقــن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 431 | 15 | تيزي وزو | 431 | بوغني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 432 | 15 | تيزي وزو | 432 | بونوح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 436 | 15 | تيزي وزو | 436 | تادمايت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 437 | 15 | تيزي وزو | 437 | تيرمتين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 472 | 15 | تيزي وزو | 472 | تيزي راشد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 459 | 15 | تيزي وزو | 459 | تيزي غنيف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 423 | 15 | تيزي وزو | 423 | تيزي نثلاثة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 447 | 15 | تيزي وزو | 447 | تيزي وزو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 429 | 15 | تيزي وزو | 429 | تيقـزيرت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 475 | 15 | تيزي وزو | 475 | تيمـيزار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 456 | 15 | تيزي وزو | 456 | ذراع الميزان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 434 | 15 | تيزي وزو | 434 | ذراع بن خدة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 467 | 15 | تيزي وزو | 467 | زكري |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 477 | 15 | تيزي وزو | 477 | سوق الإثنين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 435 | 15 | تيزي وزو | 435 | سيدي نعمان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: سيدي نعمان (15,26) |
| 444 | 15 | تيزي وزو | 444 | صوامـــع |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 463 | 15 | تيزي وزو | 463 | عزازقة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 449 | 15 | تيزي وزو | 449 | عين الحمام |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 454 | 15 | تيزي وزو | 454 | عين الزاوية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 464 | 15 | تيزي وزو | 464 | فريحة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 457 | 15 | تيزي وزو | 457 | فريقات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 453 | 15 | تيزي وزو | 453 | ماكودة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 433 | 15 | تيزي وزو | 433 | مشطراس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 476 | 15 | تيزي وزو | 476 | معـــاتقة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 443 | 15 | تيزي وزو | 443 | مقــلع |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 458 | 15 | تيزي وزو | 458 | مكيرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 415 | 15 | تيزي وزو | 415 | ميزرانـــة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 441 | 15 | تيزي وزو | 441 | واسيف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 422 | 15 | تيزي وزو | 422 | واضية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 474 | 15 | تيزي وزو | 474 | واقنون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 460 | 15 | تيزي وزو | 460 | يطــافن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 528 | 16 | الجزائر | 528 | ابن عكنون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 531 | 16 | الجزائر | 531 | الابيار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 514 | 16 | الجزائر | 514 | الجزائر الوسطى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 534 | 16 | الجزائر | 534 | الحراش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 512 | 16 | الجزائر | 512 | الحمامات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الحمامات (12,16) |
| 508 | 16 | الجزائر | 508 | الخرايسية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 490 | 16 | الجزائر | 490 | الدار البيضاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 506 | 16 | الجزائر | 506 | الدرارية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 505 | 16 | الجزائر | 505 | الدويرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 522 | 16 | الجزائر | 522 | الرايس حميدو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 500 | 16 | الجزائر | 500 | الرحمانية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 498 | 16 | الجزائر | 498 | الرويبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 518 | 16 | الجزائر | 518 | السحاولة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 510 | 16 | الجزائر | 510 | الشراقة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 507 | 16 | الجزائر | 507 | العاشور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 485 | 16 | الجزائر | 485 | القبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 520 | 16 | الجزائر | 520 | القصبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 483 | 16 | الجزائر | 483 | الكاليتوس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 492 | 16 | الجزائر | 492 | المحمدية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: المحمدية (16,29) |
| 515 | 16 | الجزائر | 515 | المدنية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 516 | 16 | الجزائر | 516 | المرادية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 491 | 16 | الجزائر | 491 | المرسى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: المرسى (16,2,21) |
| 499 | 16 | الجزائر | 499 | المعالمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 527 | 16 | الجزائر | 527 | المغارية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 494 | 16 | الجزائر | 494 | اولاد شبل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 513 | 16 | الجزائر | 513 | اولاد فايت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 488 | 16 | الجزائر | 488 | باب الزوار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 538 | 16 | الجزائر | 538 | باب الوادي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 504 | 16 | الجزائر | 504 | بابا حسن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 532 | 16 | الجزائر | 532 | باش جراح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 536 | 16 | الجزائر | 536 | براقي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 537 | 16 | الجزائر | 537 | برج البحري |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 489 | 16 | الجزائر | 489 | برج الكيفان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 529 | 16 | الجزائر | 529 | بني مسوس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 533 | 16 | الجزائر | 533 | بوروبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 530 | 16 | الجزائر | 530 | بوزريعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 519 | 16 | الجزائر | 519 | بولوغين بن زيري |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 493 | 16 | الجزائر | 493 | بئر توتة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 524 | 16 | الجزائر | 524 | بئر خادم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 523 | 16 | الجزائر | 523 | بئر مراد رايس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 495 | 16 | الجزائر | 495 | تسالة المرجة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 525 | 16 | الجزائر | 525 | جسر قسنطينة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 482 | 16 | الجزائر | 482 | حسين داي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 526 | 16 | الجزائر | 526 | حيدرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 511 | 16 | الجزائر | 511 | دالي ابراهيم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 497 | 16 | الجزائر | 497 | رغاية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 503 | 16 | الجزائر | 503 | زرالدة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 502 | 16 | الجزائر | 502 | سطاوالي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 501 | 16 | الجزائر | 501 | سويدانية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 517 | 16 | الجزائر | 517 | سيدي امحمد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: سيدي امحمد (16,28) |
| 484 | 16 | الجزائر | 484 | سيدي موسى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 509 | 16 | الجزائر | 509 | عين بنيان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 487 | 16 | الجزائر | 487 | عين طاية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 486 | 16 | الجزائر | 486 | محمد بلوزداد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 496 | 16 | الجزائر | 496 | هراوة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 535 | 16 | الجزائر | 535 | وادي السمار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 521 | 16 | الجزائر | 521 | وادي قريش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 550 | 17 | الجلفة | 550 | الادريسية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 552 | 17 | الجلفة | 552 | الجلفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 542 | 17 | الجلفة | 542 | الشارف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 541 | 17 | الجلفة | 541 | القديد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 543 | 17 | الجلفة | 543 | بن يعقوب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 547 | 17 | الجلفة | 547 | تعظميت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 539 | 17 | الجلفة | 539 | حاسي العش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 555 | 17 | الجلفة | 555 | حاسي بحبح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 546 | 17 | الجلفة | 546 | دار الشيوخ |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 549 | 17 | الجلفة | 549 | دويس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 553 | 17 | الجلفة | 553 | زعفران |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 548 | 17 | الجلفة | 548 | زكار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 544 | 17 | الجلفة | 544 | سيدي بايزيد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 540 | 17 | الجلفة | 540 | عين الإبل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 551 | 17 | الجلفة | 551 | عين الشهداء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 554 | 17 | الجلفة | 554 | عين معبد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 556 | 17 | الجلفة | 556 | مجبارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 545 | 17 | الجلفة | 545 | مليليحة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 560 | 18 | جيجل | 560 | أراقن سويسي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 564 | 18 | جيجل | 564 | الامير عبد القادر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 584 | 18 | جيجل | 584 | الجمعة بني حبيبي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 575 | 18 | جيجل | 575 | السطارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 563 | 18 | جيجل | 563 | الشحنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 567 | 18 | جيجل | 567 | الشقفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 566 | 18 | جيجل | 566 | الطاهير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 577 | 18 | جيجل | 577 | العنصر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: العنصر (18,31) |
| 558 | 18 | جيجل | 558 | العوانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 568 | 18 | جيجل | 568 | القنار نشفي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 570 | 18 | جيجل | 570 | الميلية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 572 | 18 | جيجل | 572 | أولاد رابح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 571 | 18 | جيجل | 571 | أولاد يحيى خدروش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 582 | 18 | جيجل | 582 | برج الطهر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 583 | 18 | جيجل | 583 | بودريعة بني ياجيس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 576 | 18 | جيجل | 576 | بوراوي بلهادف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 561 | 18 | جيجل | 561 | بوسيف أولاد عسكر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 581 | 18 | جيجل | 581 | تاكسنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 557 | 18 | جيجل | 557 | جيجل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 579 | 18 | جيجل | 579 | جيملة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 578 | 18 | جيجل | 578 | خيري واد عجول |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 562 | 18 | جيجل | 562 | زيامة منصورية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 559 | 18 | جيجل | 559 | سلمى بن زيادة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 569 | 18 | جيجل | 569 | سيدي عبد العزيز |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 573 | 18 | جيجل | 573 | سيدي معروف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 574 | 18 | جيجل | 574 | غبالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 580 | 18 | جيجل | 580 | قاوس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 565 | 18 | جيجل | 565 | وجانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 598 | 19 | سطيف | 598 | التلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 601 | 19 | سطيف | 601 | الحامة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الحامة (19,40) |
| 619 | 19 | سطيف | 619 | الدهامشة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 585 | 19 | سطيف | 585 | الرصفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 597 | 19 | سطيف | 597 | الطاية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 633 | 19 | سطيف | 633 | العلمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: العلمة (19,23) |
| 626 | 19 | سطيف | 626 | الولجة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الولجة (19,40,48) |
| 613 | 19 | سطيف | 613 | أوريسيا |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 602 | 19 | سطيف | 602 | أولاد تبان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 591 | 19 | سطيف | 591 | أولاد سي أحمد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 631 | 19 | سطيف | 631 | أولاد صابر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 620 | 19 | سطيف | 620 | أولاد عدوان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 593 | 19 | سطيف | 593 | ايت تيزي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 592 | 19 | سطيف | 592 | أيت نوال مزادة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 643 | 19 | سطيف | 643 | بابور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 632 | 19 | سطيف | 632 | بازر سكرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 624 | 19 | سطيف | 624 | بلاعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 638 | 19 | سطيف | 638 | بني شبانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 622 | 19 | سطيف | 622 | بني عزيز |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 635 | 19 | سطيف | 635 | بني فودة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 640 | 19 | سطيف | 640 | بني موحلي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 639 | 19 | سطيف | 639 | بني ورتيلان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 612 | 19 | سطيف | 612 | بني وسين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 595 | 19 | سطيف | 595 | بوسلام |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 600 | 19 | سطيف | 600 | بوطالب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 594 | 19 | سطيف | 594 | بوعنداس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 614 | 19 | سطيف | 614 | بوقاعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 625 | 19 | سطيف | 625 | بئر العرش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 608 | 19 | سطيف | 608 | بئر حدادة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 607 | 19 | سطيف | 607 | بيضاء برج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 627 | 19 | سطيف | 627 | تاشودة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 628 | 19 | سطيف | 628 | تالة إيفاسن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 587 | 19 | سطيف | 587 | تيزي نبشار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 636 | 19 | سطيف | 636 | جميلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 610 | 19 | سطيف | 610 | حربيل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 596 | 19 | سطيف | 596 | حمام السخنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 616 | 19 | سطيف | 616 | حمام قرقور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 615 | 19 | سطيف | 615 | ذراع قبيلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 629 | 19 | سطيف | 629 | سرج الغول |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 617 | 19 | سطيف | 617 | سطيف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 604 | 19 | سطيف | 604 | صالح باي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 603 | 19 | سطيف | 603 | عموشة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 642 | 19 | سطيف | 642 | عين أرنات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 605 | 19 | سطيف | 605 | عين أزال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 606 | 19 | سطيف | 606 | عين الحجر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين الحجر (10,19,20) |
| 611 | 19 | سطيف | 611 | عين الروى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 621 | 19 | سطيف | 621 | عين السبت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 618 | 19 | سطيف | 618 | عين الكبيرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين الكبيرة (13,19) |
| 641 | 19 | سطيف | 641 | عين عباسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 637 | 19 | سطيف | 637 | عين لقراج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 599 | 19 | سطيف | 599 | عين ولمان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 630 | 19 | سطيف | 630 | قجال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 590 | 19 | سطيف | 590 | قصر الابطال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 589 | 19 | سطيف | 589 | قلال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 634 | 19 | سطيف | 634 | قلتة زرقاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 609 | 19 | سطيف | 609 | قنزات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 644 | 19 | سطيف | 644 | ماوكلان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 588 | 19 | سطيف | 588 | مزلوق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 623 | 19 | سطيف | 623 | معاوية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 586 | 19 | سطيف | 586 | واد البارد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 650 | 20 | سعيدة | 650 | الحساسنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الحساسنة (20,46) |
| 649 | 20 | سعيدة | 649 | المعمورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: المعمورة (10,20) |
| 647 | 20 | سعيدة | 647 | أولاد إبراهيم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: أولاد إبراهيم (20,26) |
| 653 | 20 | سعيدة | 653 | أولاد خالد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 646 | 20 | سعيدة | 646 | تيرسين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 656 | 20 | سعيدة | 656 | دوي ثابت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 645 | 20 | سعيدة | 645 | سعيدة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 657 | 20 | سعيدة | 657 | سيدي احمد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 652 | 20 | سعيدة | 652 | سيدي بوبكر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 660 | 20 | سعيدة | 660 | سيدي عمر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 659 | 20 | سعيدة | 659 | عين الحجر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين الحجر (10,19,20) |
| 651 | 20 | سعيدة | 651 | عين السخونة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 648 | 20 | سعيدة | 648 | عين السلطان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين السلطان (20,44) |
| 658 | 20 | سعيدة | 658 | مولاي العربي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 654 | 20 | سعيدة | 654 | هونت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 655 | 20 | سعيدة | 655 | يوب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 663 | 21 | سكيكدة | 663 | الحدائق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 678 | 21 | سكيكدة | 678 | الحروش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 679 | 21 | سكيكدة | 679 | الزيتونة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الزيتونة (21,36) |
| 689 | 21 | سكيكدة | 689 | السبت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: السبت (14,21) |
| 683 | 21 | سكيكدة | 683 | الشرايع |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 676 | 21 | سكيكدة | 676 | الغدير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 682 | 21 | سكيكدة | 682 | القل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 677 | 21 | سكيكدة | 677 | الكركرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 686 | 21 | سكيكدة | 686 | المرسى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: المرسى (16,2,21) |
| 674 | 21 | سكيكدة | 674 | الولجة بولبلوط |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 675 | 21 | سكيكدة | 675 | أم الطوب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 665 | 21 | سكيكدة | 665 | أولاد حبابة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 680 | 21 | سكيكدة | 680 | أولاد عطية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 688 | 21 | سكيكدة | 688 | بكوش لخضر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 687 | 21 | سكيكدة | 687 | بن عزوز |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 668 | 21 | سكيكدة | 668 | بني بشير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 684 | 21 | سكيكدة | 684 | بني زيد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 666 | 21 | سكيكدة | 666 | بني ولبان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 692 | 21 | سكيكدة | 692 | بوشطاطة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 670 | 21 | سكيكدة | 670 | بين الويدان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 672 | 21 | سكيكدة | 672 | تمالوس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 697 | 21 | سكيكدة | 697 | جندل سعدي محمد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 694 | 21 | سكيكدة | 694 | حمادي كرومة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 685 | 21 | سكيكدة | 685 | خناق مايو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 669 | 21 | سكيكدة | 669 | رمضان جمال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 664 | 21 | سكيكدة | 664 | زردازة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 695 | 21 | سكيكدة | 695 | سكيكدة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 667 | 21 | سكيكدة | 667 | سيدي مزغيش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 662 | 21 | سكيكدة | 662 | صالح بو الشعور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 691 | 21 | سكيكدة | 691 | عزابة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 661 | 21 | سكيكدة | 661 | عين بوزيان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 696 | 21 | سكيكدة | 696 | عين زويت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 690 | 21 | سكيكدة | 690 | عين شرشار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 673 | 21 | سكيكدة | 673 | عين قشرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 693 | 21 | سكيكدة | 693 | فلفلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 698 | 21 | سكيكدة | 698 | قنواع |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 671 | 21 | سكيكدة | 671 | مجاز الدشيش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 681 | 21 | سكيكدة | 681 | وادي الزهور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 701 | 22 | سيدي بلعباس | 701 | الحصيبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 733 | 22 | سيدي بلعباس | 733 | السهالة الثورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 739 | 22 | سيدي بلعباس | 739 | الضاية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 713 | 22 | سيدي بلعباس | 713 | العمارنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 718 | 22 | سيدي بلعباس | 718 | بضرابين المقراني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 735 | 22 | سيدي بلعباس | 735 | بلعربي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 717 | 22 | سيدي بلعباس | 717 | بن باديس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 707 | 22 | سيدي بلعباس | 707 | بن عشيبة شلية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 721 | 22 | سيدي بلعباس | 721 | بوجبهة البرج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 714 | 22 | سيدي بلعباس | 714 | بوخنفيس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 747 | 22 | سيدي بلعباس | 747 | بئر الحمام |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 750 | 22 | سيدي بلعباس | 750 | تاودموت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 734 | 22 | سيدي بلعباس | 734 | تسالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 741 | 22 | سيدي بلعباس | 741 | تغاليمت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 749 | 22 | سيدي بلعباس | 749 | تفسور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 742 | 22 | سيدي بلعباس | 742 | تلاغ |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 737 | 22 | سيدي بلعباس | 737 | تلموني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 703 | 22 | سيدي بلعباس | 703 | تنيرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 705 | 22 | سيدي بلعباس | 705 | حاسي دحو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 715 | 22 | سيدي بلعباس | 715 | حاسي زهانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 728 | 22 | سيدي بلعباس | 728 | راس الماء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 727 | 22 | سيدي بلعباس | 727 | رجم دموش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 738 | 22 | سيدي بلعباس | 738 | زروالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 719 | 22 | سيدي بلعباس | 719 | سفيزف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 712 | 22 | سيدي بلعباس | 712 | سيدي ابراهيم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 731 | 22 | سيدي بلعباس | 731 | سيدي بلعباس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 723 | 22 | سيدي بلعباس | 723 | سيدي حمادوش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 710 | 22 | سيدي بلعباس | 710 | سيدي خالد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: سيدي خالد (22,51) |
| 746 | 22 | سيدي بلعباس | 746 | سيدي دحو الزاير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 724 | 22 | سيدي بلعباس | 724 | سيدي شعيب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 699 | 22 | سيدي بلعباس | 699 | سيدي علي بن يوب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 745 | 22 | سيدي بلعباس | 745 | سيدي علي بوسيدي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 709 | 22 | سيدي بلعباس | 709 | سيدي لحسن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 708 | 22 | سيدي بلعباس | 708 | سيدي يعقوب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 716 | 22 | سيدي بلعباس | 716 | شيطوان البلايلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 711 | 22 | سيدي بلعباس | 711 | طابية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 722 | 22 | سيدي بلعباس | 722 | عين أدن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 726 | 22 | سيدي بلعباس | 726 | عين البرد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 732 | 22 | سيدي بلعباس | 732 | عين الثريد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 702 | 22 | سيدي بلعباس | 702 | عين تندمين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 743 | 22 | سيدي بلعباس | 743 | عين قادة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 744 | 22 | سيدي بلعباس | 744 | لمطار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 730 | 22 | سيدي بلعباس | 730 | مرحوم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 748 | 22 | سيدي بلعباس | 748 | مرين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 740 | 22 | سيدي بلعباس | 740 | مزاورو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 720 | 22 | سيدي بلعباس | 720 | مسيد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 736 | 22 | سيدي بلعباس | 736 | مصطفى بن ابراهيم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 725 | 22 | سيدي بلعباس | 725 | مكدرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 700 | 22 | سيدي بلعباس | 700 | مولاي سليسن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 729 | 22 | سيدي بلعباس | 729 | وادي السبع |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 706 | 22 | سيدي بلعباس | 706 | وادي تاوريرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 704 | 22 | سيدي بلعباس | 704 | وادي سفيون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 757 | 23 | عنابة | 757 | البوني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 761 | 23 | عنابة | 761 | التريعات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 755 | 23 | عنابة | 755 | الحجار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 759 | 23 | عنابة | 759 | الشرفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 760 | 23 | عنابة | 760 | العلمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: العلمة (19,23) |
| 753 | 23 | عنابة | 753 | برحال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 752 | 23 | عنابة | 752 | سرايدي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 756 | 23 | عنابة | 756 | سيدي عمار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 762 | 23 | عنابة | 762 | شطايبي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 751 | 23 | عنابة | 751 | عنابة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 758 | 23 | عنابة | 758 | عين الباردة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 754 | 23 | عنابة | 754 | واد العنب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 767 | 24 | قالمة | 767 | الدهوارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 766 | 24 | قالمة | 766 | الركنية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 776 | 24 | قالمة | 776 | الفجوج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 783 | 24 | قالمة | 783 | برج صباط |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 792 | 24 | قالمة | 792 | بلخير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 796 | 24 | قالمة | 796 | بن جراح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 793 | 24 | قالمة | 793 | بني مزلين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 790 | 24 | قالمة | 790 | بوحشانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 764 | 24 | قالمة | 764 | بوحمدان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 772 | 24 | قالمة | 772 | بوشقوف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 775 | 24 | قالمة | 775 | بوعاتي محمود |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 770 | 24 | قالمة | 770 | بومهرة أحمد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 788 | 24 | قالمة | 788 | تاملوكة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 782 | 24 | قالمة | 782 | جبالة الخميسي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 768 | 24 | قالمة | 768 | حمام النبايل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 765 | 24 | قالمة | 765 | حمام دباغ |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 780 | 24 | قالمة | 780 | رأس العقبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 781 | 24 | قالمة | 781 | سلاوة عنونة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 786 | 24 | قالمة | 786 | عين العربي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 771 | 24 | قالمة | 771 | عين بن بيضاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 785 | 24 | قالمة | 785 | عين رقادة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 789 | 24 | قالمة | 789 | عين صندل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 787 | 24 | قالمة | 787 | عين مخلوف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 769 | 24 | قالمة | 769 | قالمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 794 | 24 | قالمة | 794 | قلعة بوصبع |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 791 | 24 | قالمة | 791 | لخزارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 773 | 24 | قالمة | 773 | مجاز الصفاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 778 | 24 | قالمة | 778 | مجاز عمار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 763 | 24 | قالمة | 763 | نشماية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 779 | 24 | قالمة | 779 | هواري بومدين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 777 | 24 | قالمة | 777 | هيليوبوليس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 784 | 24 | قالمة | 784 | وادي الزناتي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 795 | 24 | قالمة | 795 | وادي الشحم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 774 | 24 | قالمة | 774 | وادي فراغة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 805 | 25 | قسنطينة | 805 | أبن باديس الهرية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 806 | 25 | قسنطينة | 806 | ابن زياد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 802 | 25 | قسنطينة | 802 | الخروب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 803 | 25 | قسنطينة | 803 | أولاد رحمون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 799 | 25 | قسنطينة | 799 | بني حميدان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 807 | 25 | قسنطينة | 807 | بوجريو مسعود |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 798 | 25 | قسنطينة | 798 | حامة بوزيان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 797 | 25 | قسنطينة | 797 | ديدوش مراد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 800 | 25 | قسنطينة | 800 | زيغود يوسف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 801 | 25 | قسنطينة | 801 | عين السمارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 804 | 25 | قسنطينة | 804 | عين عبيد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 808 | 25 | قسنطينة | 808 | قسنطينة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 822 | 26 | المدية | 822 | البرواقية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 838 | 26 | المدية | 838 | الحمدانية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 829 | 26 | المدية | 829 | الحوضان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 824 | 26 | المدية | 824 | الربعية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 827 | 26 | المدية | 827 | الزبيرية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 810 | 26 | المدية | 810 | العزيزية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 847 | 26 | المدية | 847 | العمارية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 842 | 26 | المدية | 842 | العوينات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: العوينات (12,26) |
| 828 | 26 | المدية | 828 | العيساوية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 850 | 26 | المدية | 850 | القلب الكبير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 843 | 26 | المدية | 843 | الكاف الاخضر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 835 | 26 | المدية | 835 | المدية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 848 | 26 | المدية | 848 | أولاد إبراهيم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: أولاد إبراهيم (20,26) |
| 844 | 26 | المدية | 844 | أولاد امعرف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 818 | 26 | المدية | 818 | أولاد بوعشرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 823 | 26 | المدية | 823 | أولاد دايد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 859 | 26 | المدية | 859 | أولاد عنتر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 809 | 26 | المدية | 809 | أولاد هلال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 846 | 26 | المدية | 846 | بعطة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 837 | 26 | المدية | 837 | بن شكاو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 816 | 26 | المدية | 816 | بني سليمان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 820 | 26 | المدية | 820 | بوسكن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 856 | 26 | المدية | 856 | بوشراحيل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 817 | 26 | المدية | 817 | بوعيشون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 832 | 26 | المدية | 832 | بوغار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 849 | 26 | المدية | 849 | بئر بن عابد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 831 | 26 | المدية | 831 | تابلاط |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 855 | 26 | المدية | 855 | تفراوت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 836 | 26 | المدية | 836 | تمسقيدة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 840 | 26 | المدية | 840 | تيزي مهدي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 826 | 26 | المدية | 826 | ثلاث دوائر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 813 | 26 | المدية | 813 | حناشة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 857 | 26 | المدية | 857 | خمس جوامع |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 834 | 26 | المدية | 834 | ذراع السمار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 851 | 26 | المدية | 851 | سدراية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 833 | 26 | المدية | 833 | سغوان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 819 | 26 | المدية | 819 | سي المحجوب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 821 | 26 | المدية | 821 | سيدي الربيع |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 845 | 26 | المدية | 845 | سيدي دامد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 858 | 26 | المدية | 858 | سيدي نعمان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: سيدي نعمان (15,26) |
| 853 | 26 | المدية | 853 | شلالة العذاورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 854 | 26 | المدية | 854 | شنيقل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 814 | 26 | المدية | 814 | عوامري |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 852 | 26 | المدية | 852 | عين اقصير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 841 | 26 | المدية | 841 | عين بوسيف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 825 | 26 | المدية | 825 | مجبر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 830 | 26 | المدية | 830 | مزغنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 811 | 26 | المدية | 811 | مغراوة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 812 | 26 | المدية | 812 | ميهوب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 815 | 26 | المدية | 815 | وادي حربيل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 839 | 26 | المدية | 839 | وزرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 862 | 27 | مستغانم | 862 | الحسيان (بني ياحي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 885 | 27 | مستغانم | 885 | السوافلية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 889 | 27 | مستغانم | 889 | الطواهرية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 881 | 27 | مستغانم | 881 | أولاد بوغالم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 891 | 27 | مستغانم | 891 | أولاد مع الله |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 874 | 27 | مستغانم | 874 | بن عبد المالك رمضان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 882 | 27 | مستغانم | 882 | بوقيراط |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 873 | 27 | مستغانم | 873 | تزقايت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 863 | 27 | مستغانم | 863 | حاسي ماماش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 876 | 27 | مستغانم | 876 | حجاج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 879 | 27 | مستغانم | 879 | خضرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 870 | 27 | مستغانم | 870 | خير الدين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 865 | 27 | مستغانم | 865 | ستيدية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 868 | 27 | مستغانم | 868 | سور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 867 | 27 | مستغانم | 867 | سيدي بلعطار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 872 | 27 | مستغانم | 872 | سيدي علي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 877 | 27 | مستغانم | 877 | سيدي لخضر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 884 | 27 | مستغانم | 884 | سيرات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 883 | 27 | مستغانم | 883 | صفصاف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 871 | 27 | مستغانم | 871 | صيادة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 878 | 27 | مستغانم | 878 | عشعاشة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 869 | 27 | مستغانم | 869 | عين بودينار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 866 | 27 | مستغانم | 866 | عين تادلس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 886 | 27 | مستغانم | 886 | عين سيدي الشريف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 890 | 27 | مستغانم | 890 | عين نويسي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 860 | 27 | مستغانم | 860 | فرناقة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 888 | 27 | مستغانم | 888 | ماسرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 864 | 27 | مستغانم | 864 | مزغران |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 875 | 27 | مستغانم | 875 | مستغانم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 887 | 27 | مستغانم | 887 | منصورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: منصورة (13,27) |
| 880 | 27 | مستغانم | 880 | نكمارية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 861 | 27 | مستغانم | 861 | وادي الخير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 923 | 28 | المسيلة | 923 | السوامع |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 914 | 28 | المسيلة | 914 | المسيلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 920 | 28 | المسيلة | 920 | المطارفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: المطارفة (28,49) |
| 919 | 28 | المسيلة | 919 | المعاضيد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 905 | 28 | المسيلة | 905 | الهامل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 912 | 28 | المسيلة | 912 | امجدل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 922 | 28 | المسيلة | 922 | أولاد دراج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 925 | 28 | المسيلة | 925 | أولاد عدي لقبالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 893 | 28 | المسيلة | 893 | أولاد ماضي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 917 | 28 | المسيلة | 917 | أولاد منصور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 896 | 28 | المسيلة | 896 | برهوم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 895 | 28 | المسيلة | 895 | بلعايبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 899 | 28 | المسيلة | 899 | بني يلمان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 904 | 28 | المسيلة | 904 | بوسعادة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 900 | 28 | المسيلة | 900 | بوطي السايح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 910 | 28 | المسيلة | 910 | بئر فضة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 918 | 28 | المسيلة | 918 | تارمونت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 915 | 28 | المسيلة | 915 | حمام الضلعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 894 | 28 | المسيلة | 894 | خطوطي سد الجير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 897 | 28 | المسيلة | 897 | دهاهنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 911 | 28 | المسيلة | 911 | سيدي امحمد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: سيدي امحمد (16,28) |
| 901 | 28 | المسيلة | 901 | سيدي عيسى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 903 | 28 | المسيلة | 903 | سيدي هجرس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 892 | 28 | المسيلة | 892 | شلال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 902 | 28 | المسيلة | 902 | عين الحجل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 924 | 28 | المسيلة | 924 | عين الخضراء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 909 | 28 | المسيلة | 909 | عين الريش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 907 | 28 | المسيلة | 907 | عين الملح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 908 | 28 | المسيلة | 908 | عين فارس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين فارس (28,29) |
| 921 | 28 | المسيلة | 921 | معاريف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 898 | 28 | المسيلة | 898 | مقرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 913 | 28 | المسيلة | 913 | مناعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 906 | 28 | المسيلة | 906 | ولتام |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 916 | 28 | المسيلة | 916 | ونوغة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 953 | 29 | معسكر | 953 | البرج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 968 | 29 | معسكر | 968 | الحشم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 965 | 29 | معسكر | 965 | السهايلية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 940 | 29 | معسكر | 940 | الشرفاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 938 | 29 | معسكر | 938 | العلايمية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 933 | 29 | معسكر | 933 | الغمري |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 962 | 29 | معسكر | 962 | القرط |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 943 | 29 | معسكر | 943 | القطنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 935 | 29 | معسكر | 935 | القعدة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 942 | 29 | معسكر | 942 | المأمونية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 929 | 29 | معسكر | 929 | المحمدية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: المحمدية (16,29) |
| 955 | 29 | معسكر | 955 | المطمور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 952 | 29 | معسكر | 952 | المنور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 946 | 29 | معسكر | 946 | بنيان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 959 | 29 | معسكر | 959 | بوحنيفية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 941 | 29 | معسكر | 941 | بوهني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 964 | 29 | معسكر | 964 | تيزي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 930 | 29 | معسكر | 930 | تيغنيف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 961 | 29 | معسكر | 961 | حسين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 951 | 29 | معسكر | 951 | خلوية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 936 | 29 | معسكر | 936 | رأس عين عميروش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 970 | 29 | معسكر | 970 | زلامطة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 934 | 29 | معسكر | 934 | زهانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 928 | 29 | معسكر | 928 | سجرارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 954 | 29 | معسكر | 954 | سيدي بوسعيد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 967 | 29 | معسكر | 967 | سيدي عبد الجبار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 927 | 29 | معسكر | 927 | سيدي عبد المومن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 956 | 29 | معسكر | 956 | سيدي قادة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 939 | 29 | معسكر | 939 | سيق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 937 | 29 | معسكر | 937 | عقاز |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 947 | 29 | معسكر | 947 | عوف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 949 | 29 | معسكر | 949 | عين أفرص |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 944 | 29 | معسكر | 944 | عين فارس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين فارس (28,29) |
| 971 | 29 | معسكر | 971 | عين فراح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 950 | 29 | معسكر | 950 | عين فكان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 945 | 29 | معسكر | 945 | غروس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 960 | 29 | معسكر | 960 | غريس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 932 | 29 | معسكر | 932 | فراقيق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 963 | 29 | معسكر | 963 | فروحة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 948 | 29 | معسكر | 948 | قرجوم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 957 | 29 | معسكر | 957 | ماقضة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 966 | 29 | معسكر | 966 | ماوسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 958 | 29 | معسكر | 958 | معسكر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 931 | 29 | معسكر | 931 | مقطع الدوز |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 969 | 29 | معسكر | 969 | نسمط |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 926 | 29 | معسكر | 926 | وادي الأبطال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 972 | 29 | معسكر | 972 | وادي التاغية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 978 | 30 | ورقلة | 978 | البرمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 979 | 30 | ورقلة | 979 | الرويسات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 980 | 30 | ورقلة | 980 | انقوسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 976 | 30 | ورقلة | 976 | حاسي بن عبد الله |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 974 | 30 | ورقلة | 974 | حاسي مسعود |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 977 | 30 | ورقلة | 977 | سيدي خويلد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 975 | 30 | ورقلة | 975 | عين البيضاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين البيضاء (30,4) |
| 973 | 30 | ورقلة | 973 | ورقلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 990 | 31 | وهران | 990 | أرزيو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1000 | 31 | وهران | 1000 | البراية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 988 | 31 | وهران | 988 | السانية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 997 | 31 | وهران | 997 | العنصر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: العنصر (18,31) |
| 987 | 31 | وهران | 987 | الكرمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 998 | 31 | وهران | 998 | المرسى الكبير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 993 | 31 | وهران | 993 | بطيوة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 989 | 31 | وهران | 989 | بن فريحة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1003 | 31 | وهران | 1003 | بوتليليس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1005 | 31 | وهران | 1005 | بوسفر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 999 | 31 | وهران | 999 | بوفاتيس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 983 | 31 | وهران | 983 | بئر الجير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 984 | 31 | وهران | 984 | حاسي بن عقبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 986 | 31 | وهران | 986 | حاسي بونيف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 982 | 31 | وهران | 982 | حاسي مفسوخ |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 981 | 31 | وهران | 981 | سيدي الشحمي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 991 | 31 | وهران | 991 | سيدي بن يبقى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1006 | 31 | وهران | 1006 | طفراوي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 992 | 31 | وهران | 992 | عين البية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 995 | 31 | وهران | 995 | عين الترك |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين الترك (10,31) |
| 1002 | 31 | وهران | 1002 | عين الكرمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين الكرمة (31,36) |
| 985 | 31 | وهران | 985 | قديل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 994 | 31 | وهران | 994 | مرسى الحجاج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1004 | 31 | وهران | 1004 | مسرغين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1001 | 31 | وهران | 1001 | وادي تليلات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 996 | 31 | وهران | 996 | وهران |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1015 | 32 | البيض | 1015 | البيض |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1011 | 32 | البيض | 1011 | الخيثر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1019 | 32 | البيض | 1019 | الشقيق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1018 | 32 | البيض | 1018 | الكاف الأحمر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1017 | 32 | البيض | 1017 | المحرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1009 | 32 | البيض | 1009 | بوعلام |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1010 | 32 | البيض | 1010 | بوقطب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1012 | 32 | البيض | 1012 | توسمولين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1016 | 32 | البيض | 1016 | رقاصة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1014 | 32 | البيض | 1014 | ستيتن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1007 | 32 | البيض | 1007 | سيدي سليمان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: سيدي سليمان (32,38,55) |
| 1013 | 32 | البيض | 1013 | سيدي طيفور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1008 | 32 | البيض | 1008 | سيدي عامر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: سيدي عامر (32,42,68) |
| 1020 | 32 | البيض | 1020 | شلالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1024 | 33 | إليزي | 1024 | إيليزي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1021 | 33 | إليزي | 1021 | برج عمر إدريس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1022 | 33 | إليزي | 1022 | دبداب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1023 | 33 | إليزي | 1023 | عين أمناس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1025 | 34 | برج بوعريريج | 1025 | الحمادية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1047 | 34 | برج بوعريريج | 1047 | الرابطة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1034 | 34 | برج بوعريريج | 1034 | العش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1030 | 34 | برج بوعريريج | 1030 | العناصر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1044 | 34 | برج بوعريريج | 1044 | القصور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1041 | 34 | برج بوعريريج | 1041 | القلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1039 | 34 | برج بوعريريج | 1039 | الماين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الماين (34,44) |
| 1045 | 34 | برج بوعريريج | 1045 | المنصورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: المنصورة (34,47) |
| 1043 | 34 | برج بوعريريج | 1043 | المهير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1048 | 34 | برج بوعريريج | 1048 | الياشير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1052 | 34 | برج بوعريريج | 1052 | أولاد أبراهم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1055 | 34 | برج بوعريريج | 1055 | أولاد دحمان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1026 | 34 | برج بوعريريج | 1026 | أولاد سيدي ابراهيم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: أولاد سيدي ابراهيم (34,68) |
| 1033 | 34 | برج بوعريريج | 1033 | برج الغدير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1057 | 34 | برج بوعريريج | 1057 | برج بوعريرج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1054 | 34 | برج بوعريريج | 1054 | برج زمورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1029 | 34 | برج بوعريريج | 1029 | بليمور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1058 | 34 | برج بوعريريج | 1058 | بن داود |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: بن داود (34,48) |
| 1037 | 34 | برج بوعريريج | 1037 | بئر قاصد علي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1056 | 34 | برج بوعريريج | 1056 | تسامرت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1038 | 34 | برج بوعريريج | 1038 | تفرق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1032 | 34 | برج بوعريريج | 1032 | تقلعيت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1028 | 34 | برج بوعريريج | 1028 | تيكستار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1042 | 34 | برج بوعريريج | 1042 | ثنية النصر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1040 | 34 | برج بوعريريج | 1040 | جعافرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1046 | 34 | برج بوعريريج | 1046 | حرازة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1049 | 34 | برج بوعريريج | 1049 | حسناوة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1036 | 34 | برج بوعريريج | 1036 | خليل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1053 | 34 | برج بوعريريج | 1053 | رأس الوادي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1035 | 34 | برج بوعريريج | 1035 | سيدي أمبارك |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1027 | 34 | برج بوعريريج | 1027 | عين تاغروت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1051 | 34 | برج بوعريريج | 1051 | عين تسرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1031 | 34 | برج بوعريريج | 1031 | غيلاسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1050 | 34 | برج بوعريريج | 1050 | مجانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1062 | 35 | بومرداس | 1062 | أعفير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1069 | 35 | بومرداس | 1069 | الاربعطاش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1063 | 35 | بومرداس | 1063 | الثنية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1059 | 35 | بومرداس | 1059 | الخروبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1073 | 35 | بومرداس | 1073 | الناصرية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1072 | 35 | بومرداس | 1072 | أولاد عيسى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: أولاد عيسى (35,49) |
| 1083 | 35 | بومرداس | 1083 | أولاد موسى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1082 | 35 | بومرداس | 1082 | أولاد هداج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1086 | 35 | بومرداس | 1086 | برج منايل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1077 | 35 | بومرداس | 1077 | بغلية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1061 | 35 | بومرداس | 1061 | بن شود |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1064 | 35 | بومرداس | 1064 | بني عمران |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1087 | 35 | بومرداس | 1087 | بودواو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1088 | 35 | بومرداس | 1088 | بودواو البحري |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1074 | 35 | بومرداس | 1074 | بوزقزة قدارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1084 | 35 | بومرداس | 1084 | بومرداس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1089 | 35 | بومرداس | 1089 | تاورقة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1080 | 35 | بومرداس | 1080 | تيجلابين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1067 | 35 | بومرداس | 1067 | تيمزريت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: تيمزريت (35,6) |
| 1079 | 35 | بومرداس | 1079 | جنات |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1090 | 35 | بومرداس | 1090 | حمادي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1065 | 35 | بومرداس | 1065 | خميس الخشنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1060 | 35 | بومرداس | 1060 | دلس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1068 | 35 | بومرداس | 1068 | زموري |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1075 | 35 | بومرداس | 1075 | سوق الحد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: سوق الحد (35,48) |
| 1081 | 35 | بومرداس | 1081 | سي مصطفى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1076 | 35 | بومرداس | 1076 | سيدي داود |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1071 | 35 | بومرداس | 1071 | شعبة العامر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1066 | 35 | بومرداس | 1066 | عمال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1085 | 35 | بومرداس | 1085 | قورصو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1078 | 35 | بومرداس | 1078 | لقاطة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1070 | 35 | بومرداس | 1070 | يسر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1095 | 36 | الطارف | 1095 | البسباس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1114 | 36 | الطارف | 1114 | الذرعـان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1094 | 36 | الطارف | 1094 | الزيتونة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الزيتونة (21,36) |
| 1106 | 36 | الطارف | 1106 | السوارخ |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1109 | 36 | الطارف | 1109 | الشافية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1103 | 36 | الطارف | 1103 | الشط |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1093 | 36 | الطارف | 1093 | الطارف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1104 | 36 | الطارف | 1104 | العيون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: العيون (36,38) |
| 1105 | 36 | الطارف | 1105 | القالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1110 | 36 | الطارف | 1110 | بحيرة الطيور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1101 | 36 | الطارف | 1101 | بريحان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1100 | 36 | الطارف | 1100 | بن مهيدي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1108 | 36 | الطارف | 1108 | بوثلجة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1097 | 36 | الطارف | 1097 | بوحجار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1092 | 36 | الطارف | 1092 | بوقوس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1098 | 36 | الطارف | 1098 | حمام بني صالح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1112 | 36 | الطارف | 1112 | رمل السوق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1107 | 36 | الطارف | 1107 | زريزر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1102 | 36 | الطارف | 1102 | شبيطة مختار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1111 | 36 | الطارف | 1111 | شحاني |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1113 | 36 | الطارف | 1113 | عصفور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1091 | 36 | الطارف | 1091 | عين العسل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1096 | 36 | الطارف | 1096 | عين الكرمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين الكرمة (31,36) |
| 1099 | 36 | الطارف | 1099 | وادي الزيتون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1116 | 37 | تندوف | 1116 | أم العسل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1115 | 37 | تندوف | 1115 | تندوف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1128 | 38 | تيسمسيلت | 1128 | الأربعاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الأربعاء (38,9) |
| 1129 | 38 | تيسمسيلت | 1129 | الأزهرية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1132 | 38 | تيسمسيلت | 1132 | العيون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: العيون (36,38) |
| 1137 | 38 | تيسمسيلت | 1137 | المعاصم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1131 | 38 | تيسمسيلت | 1131 | الملعب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1134 | 38 | تيسمسيلت | 1134 | اليوسفية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1119 | 38 | تيسمسيلت | 1119 | أولاد بسام |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1135 | 38 | تيسمسيلت | 1135 | برج الأمير عبد القادر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1138 | 38 | تيسمسيلت | 1138 | برج بونعامة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1123 | 38 | تيسمسيلت | 1123 | بني شعيب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1124 | 38 | تيسمسيلت | 1124 | بني لحسن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1127 | 38 | تيسمسيلت | 1127 | بوقائد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1133 | 38 | تيسمسيلت | 1133 | تملاحت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1121 | 38 | تيسمسيلت | 1121 | تيسمسيلت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1118 | 38 | تيسمسيلت | 1118 | ثنية الاحد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1117 | 38 | تيسمسيلت | 1117 | خميستي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: خميستي (38,42) |
| 1122 | 38 | تيسمسيلت | 1122 | سيدي العنتري |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1120 | 38 | تيسمسيلت | 1120 | سيدي بوتوشنت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1126 | 38 | تيسمسيلت | 1126 | سيدي سليمان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: سيدي سليمان (32,38,55) |
| 1125 | 38 | تيسمسيلت | 1125 | سيدي عابد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1136 | 38 | تيسمسيلت | 1136 | عماري |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1130 | 38 | تيسمسيلت | 1130 | لرجام |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1145 | 39 | الوادي | 1145 | البياضة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1152 | 39 | الوادي | 1152 | الحمراية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1154 | 39 | الوادي | 1154 | الدبيلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1147 | 39 | الوادي | 1147 | الرباح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1153 | 39 | الوادي | 1153 | الرقيبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1158 | 39 | الوادي | 1158 | الطالب العربي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1157 | 39 | الوادي | 1157 | الطريفاوي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1140 | 39 | الوادي | 1140 | العقلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: العقلة (12,39) |
| 1141 | 39 | الوادي | 1141 | المقرن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1146 | 39 | الوادي | 1146 | النخلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1160 | 39 | الوادي | 1160 | الوادي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1143 | 39 | الوادي | 1143 | اميه وانسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1149 | 39 | الوادي | 1149 | بن قشة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1151 | 39 | الوادي | 1151 | تغزوت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1156 | 39 | الوادي | 1156 | حاسي خليفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1155 | 39 | الوادي | 1155 | حساني عبد الكريم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1139 | 39 | الوادي | 1139 | دوار الماء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1142 | 39 | الوادي | 1142 | سيدي عون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1148 | 39 | الوادي | 1148 | قمار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1144 | 39 | الوادي | 1144 | كوينين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1159 | 39 | الوادي | 1159 | وادي العلندة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1150 | 39 | الوادي | 1150 | ورماس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1173 | 40 | خنشلة | 1173 | الحامة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الحامة (19,40) |
| 1170 | 40 | خنشلة | 1170 | الرميلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1163 | 40 | خنشلة | 1163 | المحمل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1179 | 40 | خنشلة | 1179 | الولجة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الولجة (19,40,48) |
| 1174 | 40 | خنشلة | 1174 | انسيغة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1164 | 40 | خنشلة | 1164 | أولاد رشاش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1162 | 40 | خنشلة | 1162 | بابار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1172 | 40 | خنشلة | 1172 | بغاي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1178 | 40 | خنشلة | 1178 | بوحمامة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1171 | 40 | خنشلة | 1171 | تاوزيانت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1165 | 40 | خنشلة | 1165 | جلال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1167 | 40 | خنشلة | 1167 | خنشلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1161 | 40 | خنشلة | 1161 | خيران |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1181 | 40 | خنشلة | 1181 | ششار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1169 | 40 | خنشلة | 1169 | شلية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1175 | 40 | خنشلة | 1175 | طامزة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1176 | 40 | خنشلة | 1176 | عين الطويلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1168 | 40 | خنشلة | 1168 | قايس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1177 | 40 | خنشلة | 1177 | متوسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1180 | 40 | خنشلة | 1180 | مصارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1166 | 40 | خنشلة | 1166 | يابوس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1197 | 41 | سوق أهراس | 1197 | الحدادة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1185 | 41 | سوق أهراس | 1185 | الحنانشة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1198 | 41 | سوق أهراس | 1198 | الخضارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1194 | 41 | سوق أهراس | 1194 | الدريعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1193 | 41 | سوق أهراس | 1193 | الراقوبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1196 | 41 | سوق أهراس | 1196 | الزعرورية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1207 | 41 | سوق أهراس | 1207 | الزوابي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1200 | 41 | سوق أهراس | 1200 | المراهنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1186 | 41 | سوق أهراس | 1186 | المشروحة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1190 | 41 | سوق أهراس | 1190 | أم العظايم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1188 | 41 | سوق أهراس | 1188 | أولاد إدريس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1199 | 41 | سوق أهراس | 1199 | أولاد مومن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1203 | 41 | سوق أهراس | 1203 | بئر بوحوش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1195 | 41 | سوق أهراس | 1195 | تاورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1189 | 41 | سوق أهراس | 1189 | ترقالت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1192 | 41 | سوق أهراس | 1192 | تيفاش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1205 | 41 | سوق أهراس | 1205 | خميسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1204 | 41 | سوق أهراس | 1204 | سافل الويدان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1184 | 41 | سوق أهراس | 1184 | سدراتة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1182 | 41 | سوق أهراس | 1182 | سوق أهراس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1202 | 41 | سوق أهراس | 1202 | سيدي فرج |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1187 | 41 | سوق أهراس | 1187 | عين الزانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1183 | 41 | سوق أهراس | 1183 | عين سلطان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1206 | 41 | سوق أهراس | 1206 | مداوروش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1191 | 41 | سوق أهراس | 1191 | وادي الكبريت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1201 | 41 | سوق أهراس | 1201 | ويلان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1226 | 42 | تيبازة | 1226 | أحمر العين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1211 | 42 | تيبازة | 1211 | أغبال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1220 | 42 | تيبازة | 1220 | الأرهاط |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1230 | 42 | تيبازة | 1230 | الحطاطبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1219 | 42 | تيبازة | 1219 | الداموس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1231 | 42 | تيبازة | 1231 | الشعيبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الشعيبة (42,51) |
| 1232 | 42 | تيبازة | 1232 | القليعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1212 | 42 | تيبازة | 1212 | الناظور |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1235 | 42 | تيبازة | 1235 | بني ميلك |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1224 | 42 | تيبازة | 1224 | بواسماعيل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1227 | 42 | تيبازة | 1227 | بورقيقة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1223 | 42 | تيبازة | 1223 | بوهارون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1234 | 42 | تيبازة | 1234 | تيبازة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1217 | 42 | تيبازة | 1217 | حجرة النص |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1208 | 42 | تيبازة | 1208 | حجوط |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1225 | 42 | تيبازة | 1225 | خميستي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: خميستي (38,42) |
| 1228 | 42 | تيبازة | 1228 | دواودة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1229 | 42 | تيبازة | 1229 | سيدي راشد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1233 | 42 | تيبازة | 1233 | سيدي سميان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1213 | 42 | تيبازة | 1213 | سيدي عامر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: سيدي عامر (32,42,68) |
| 1218 | 42 | تيبازة | 1218 | سيدي غيلاس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1216 | 42 | تيبازة | 1216 | شرشال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1222 | 42 | تيبازة | 1222 | عين تاقورايت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1221 | 42 | تيبازة | 1221 | فوكة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1214 | 42 | تيبازة | 1214 | قوراية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1209 | 42 | تيبازة | 1209 | مراد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1215 | 42 | تيبازة | 1215 | مسلمون |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1210 | 42 | تيبازة | 1210 | مناصر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1253 | 43 | ميلة | 1253 | أحمد راشدي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1241 | 43 | ميلة | 1241 | اعميرة اراس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1258 | 43 | ميلة | 1258 | التلاغمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1249 | 43 | ميلة | 1249 | الرواشد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1245 | 43 | ميلة | 1245 | الشيقارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1237 | 43 | ميلة | 1237 | العياضي برباس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1247 | 43 | ميلة | 1247 | القرارم قوقة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1256 | 43 | ميلة | 1256 | أولاد اخلوف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1257 | 43 | ميلة | 1257 | بن يحي عبد الرحمن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1267 | 43 | ميلة | 1267 | بوحاتم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1254 | 43 | ميلة | 1254 | تاجنانت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1240 | 43 | ميلة | 1240 | ترعي باينان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1239 | 43 | ميلة | 1239 | تسالة لمطاعي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1242 | 43 | ميلة | 1242 | تسدان حدادة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1248 | 43 | ميلة | 1248 | تيبرقنت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1246 | 43 | ميلة | 1246 | حمالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1250 | 43 | ميلة | 1250 | دراحي بوصلاح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1251 | 43 | ميلة | 1251 | زغاية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1265 | 43 | ميلة | 1265 | سيدي خليفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1244 | 43 | ميلة | 1244 | سيدي مروان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1262 | 43 | ميلة | 1262 | شلغوم العيد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1238 | 43 | ميلة | 1238 | عين البيضاء أحريش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1261 | 43 | ميلة | 1261 | عين التين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1255 | 43 | ميلة | 1255 | عين الملوك |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1264 | 43 | ميلة | 1264 | فرجيوة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1236 | 43 | ميلة | 1236 | مشيرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1266 | 43 | ميلة | 1266 | ميلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1243 | 43 | ميلة | 1243 | مينار زارزة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1260 | 43 | ميلة | 1260 | وادي العثمانية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1252 | 43 | ميلة | 1252 | وادي النجاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1259 | 43 | ميلة | 1259 | وادي سقان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1263 | 43 | ميلة | 1263 | يحي بني قشة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1300 | 44 | عين الدفلة | 1300 | الحسانية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1274 | 44 | عين الدفلة | 1274 | الحسينية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1293 | 44 | عين الدفلة | 1293 | الروينة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1278 | 44 | عين الدفلة | 1278 | العامرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1282 | 44 | عين الدفلة | 1282 | العبادية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1279 | 44 | عين الدفلة | 1279 | العطاف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1292 | 44 | عين الدفلة | 1292 | الماين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الماين (34,44) |
| 1303 | 44 | عين الدفلة | 1303 | المخاطرية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1284 | 44 | عين الدفلة | 1284 | بربوش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1296 | 44 | عين الدفلة | 1296 | برج الأمير خالد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1298 | 44 | عين الدفلة | 1298 | بطحية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1299 | 44 | عين الدفلة | 1299 | بلعاص |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1286 | 44 | عين الدفلة | 1286 | بن علال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1273 | 44 | عين الدفلة | 1273 | بوراشد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1288 | 44 | عين الدفلة | 1288 | بومدفع |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1295 | 44 | عين الدفلة | 1295 | بئر ولد خليفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1283 | 44 | عين الدفلة | 1283 | تاشتة زقاغة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1280 | 44 | عين الدفلة | 1280 | تبركانين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1275 | 44 | عين الدفلة | 1275 | جليدة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1277 | 44 | عين الدفلة | 1277 | جمعة أولاد الشيخ |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1285 | 44 | عين الدفلة | 1285 | جندل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1272 | 44 | عين الدفلة | 1272 | حمام ريغة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1268 | 44 | عين الدفلة | 1268 | خميس مليانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1294 | 44 | عين الدفلة | 1294 | زدين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1269 | 44 | عين الدفلة | 1269 | سيدي الأخضر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1297 | 44 | عين الدفلة | 1297 | طارق بن زياد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1276 | 44 | عين الدفلة | 1276 | عريب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1289 | 44 | عين الدفلة | 1289 | عين الاشياخ |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1270 | 44 | عين الدفلة | 1270 | عين البنيان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1271 | 44 | عين الدفلة | 1271 | عين التركي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1301 | 44 | عين الدفلة | 1301 | عين الدفلى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1290 | 44 | عين الدفلة | 1290 | عين السلطان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: عين السلطان (20,44) |
| 1281 | 44 | عين الدفلة | 1281 | عين بويحيى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1302 | 44 | عين الدفلة | 1302 | مليانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1291 | 44 | عين الدفلة | 1291 | واد الجمعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1287 | 44 | عين الدفلة | 1287 | وادي الشرفاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1311 | 45 | النعامة | 1311 | البيوض |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1307 | 45 | النعامة | 1307 | القصدير |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1310 | 45 | النعامة | 1310 | المشرية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1313 | 45 | النعامة | 1313 | النعامة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1304 | 45 | النعامة | 1304 | تيوت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1314 | 45 | النعامة | 1314 | جنين بورزق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1315 | 45 | النعامة | 1315 | سفيسيفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1306 | 45 | النعامة | 1306 | عسلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1309 | 45 | النعامة | 1309 | عين الصفراء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1312 | 45 | النعامة | 1312 | عين بن خليل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1305 | 45 | النعامة | 1305 | مغرار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1308 | 45 | النعامة | 1308 | مكمن بن عمار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1327 | 46 | عين تيموشنت | 1327 | أغلال |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1333 | 46 | عين تيموشنت | 1333 | الأمير عبد القادر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1332 | 46 | عين تيموشنت | 1332 | الحساسنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الحساسنة (20,46) |
| 1324 | 46 | عين تيموشنت | 1324 | العامرية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: العامرية (4,46) |
| 1319 | 46 | عين تيموشنت | 1319 | المالح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1338 | 46 | عين تيموشنت | 1338 | المساعيد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1320 | 46 | عين تيموشنت | 1320 | أولاد الكيحل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1326 | 46 | عين تيموشنت | 1326 | أولاد بوجمعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1331 | 46 | عين تيموشنت | 1331 | بني صاف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1342 | 46 | عين تيموشنت | 1342 | بوزجار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1322 | 46 | عين تيموشنت | 1322 | تارقة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1317 | 46 | عين تيموشنت | 1317 | تامزورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1325 | 46 | عين تيموشنت | 1325 | حاسي الغلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1343 | 46 | عين تيموشنت | 1343 | حمام بوحجر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1340 | 46 | عين تيموشنت | 1340 | سيدي بن عدة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1316 | 46 | عين تيموشنت | 1316 | سيدي بومدين |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1334 | 46 | عين تيموشنت | 1334 | سيدي صافي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1336 | 46 | عين تيموشنت | 1336 | سيدي ورياش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1318 | 46 | عين تيموشنت | 1318 | شعبة اللحم |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1321 | 46 | عين تيموشنت | 1321 | شنتوف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1330 | 46 | عين تيموشنت | 1330 | عقب الليل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1337 | 46 | عين تيموشنت | 1337 | عين الأربعاء |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1329 | 46 | عين تيموشنت | 1329 | عين الطلبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1328 | 46 | عين تيموشنت | 1328 | عين الكيحل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1341 | 46 | عين تيموشنت | 1341 | عين تموشنت |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1323 | 46 | عين تيموشنت | 1323 | وادي الصباح |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1339 | 46 | عين تيموشنت | 1339 | وادي برقش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1335 | 46 | عين تيموشنت | 1335 | ولهاصة الغرابة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1346 | 47 | غرداية | 1346 | العطف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1349 | 47 | غرداية | 1349 | القرارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1345 | 47 | غرداية | 1345 | المنصورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: المنصورة (34,47) |
| 1352 | 47 | غرداية | 1352 | بريان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1347 | 47 | غرداية | 1347 | بونورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1348 | 47 | غرداية | 1348 | زلفانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1350 | 47 | غرداية | 1350 | سبسب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1344 | 47 | غرداية | 1344 | ضاية بن ضحوة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1353 | 47 | غرداية | 1353 | غرداية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1351 | 47 | غرداية | 1351 | متليلي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1383 | 48 | غليزان | 1383 | الحاسي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الحاسي (48,5) |
| 1390 | 48 | غليزان | 1390 | الحمادنة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1391 | 48 | غليزان | 1391 | الرمكة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1354 | 48 | غليزان | 1354 | القطار |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1370 | 48 | غليزان | 1370 | القلعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1362 | 48 | غليزان | 1362 | المطمر |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1367 | 48 | غليزان | 1367 | الولجة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: الولجة (19,40,48) |
| 1380 | 48 | غليزان | 1380 | أولاد سيدي الميهوب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1355 | 48 | غليزان | 1355 | أولاد يعيش |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: أولاد يعيش (48,9) |
| 1361 | 48 | غليزان | 1361 | بلعسل بوزقزة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1381 | 48 | غليزان | 1381 | بن داود |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: بن داود (34,48) |
| 1356 | 48 | غليزان | 1356 | بني درقن |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1386 | 48 | غليزان | 1386 | بني زنطيس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1359 | 48 | غليزان | 1359 | جديوية |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1366 | 48 | غليزان | 1366 | حد الشكالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1360 | 48 | غليزان | 1360 | حمري |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1357 | 48 | غليزان | 1357 | دار بن عبد الله |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1358 | 48 | غليزان | 1358 | زمورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1373 | 48 | غليزان | 1373 | سوق الحد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone | NAME COLLISION across wilayas: سوق الحد (35,48) |
| 1384 | 48 | غليزان | 1384 | سيدي أمحمد بن علي |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1364 | 48 | غليزان | 1364 | سيدي امحمد بن عودة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1363 | 48 | غليزان | 1363 | سيدي خطاب |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1371 | 48 | غليزان | 1371 | سيدي سعادة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1376 | 48 | غليزان | 1376 | سيدي لزرق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1377 | 48 | غليزان | 1377 | عمي موسى |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1369 | 48 | غليزان | 1369 | عين الرحمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1365 | 48 | غليزان | 1365 | عين طارق |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1389 | 48 | غليزان | 1389 | غليزان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1388 | 48 | غليزان | 1388 | لحلاف |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1368 | 48 | غليزان | 1368 | مازونة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1385 | 48 | غليزان | 1385 | مديونة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1379 | 48 | غليزان | 1379 | مرجة سيدي عابد |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1374 | 48 | غليزان | 1374 | منداس |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1387 | 48 | غليزان | 1387 | وادي الجمعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1375 | 48 | غليزان | 1375 | وادي السلام |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1382 | 48 | غليزان | 1382 | وادي رهيو |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1378 | 48 | غليزان | 1378 | واريزان |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1372 | 48 | غليزان | 1372 | يلل |  |  |  | NABDA DB (current division 69/1541) | 2026 | UNCERTAIN | pending | match to RGPH 2008 commune list pending; do NOT match by name alone |
| 1395 | 49 | تيميمون | 1395 | المطارفة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 49 (تيميمون); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) | NAME COLLISION across wilayas: المطارفة (28,49) |
| 1399 | 49 | تيميمون | 1399 | أوقروت |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 49 (تيميمون); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1394 | 49 | تيميمون | 1394 | أولاد السعيد |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 49 (تيميمون); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1397 | 49 | تيميمون | 1397 | أولاد عيسى |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 49 (تيميمون); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) | NAME COLLISION across wilayas: أولاد عيسى (35,49) |
| 1392 | 49 | تيميمون | 1392 | تنركوك |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 49 (تيميمون); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1393 | 49 | تيميمون | 1393 | تيميمون |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 49 (تيميمون); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1400 | 49 | تيميمون | 1400 | دلدول |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 49 (تيميمون); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) | NAME COLLISION across wilayas: دلدول (49,66) |
| 1398 | 49 | تيميمون | 1398 | شروين |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 49 (تيميمون); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1396 | 49 | تيميمون | 1396 | طالمين |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 49 (تيميمون); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1401 | 49 | تيميمون | 1401 | قصر قدور |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 49 (تيميمون); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1403 | 50 | برج باجي مختار | 1403 | برج باجي مختار |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 50 (برج باجي مختار); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1402 | 50 | برج باجي مختار | 1402 | تيمياوين |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 50 (برج باجي مختار); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1407 | 51 | أولاد جلال | 1407 | الدوسن |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 51 (أولاد جلال); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1408 | 51 | أولاد جلال | 1408 | الشعيبة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 51 (أولاد جلال); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) | NAME COLLISION across wilayas: الشعيبة (42,51) |
| 1409 | 51 | أولاد جلال | 1409 | أولاد جلال |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 51 (أولاد جلال); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1405 | 51 | أولاد جلال | 1405 | بسباس |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 51 (أولاد جلال); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1404 | 51 | أولاد جلال | 1404 | رأس الميعاد |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 51 (أولاد جلال); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1406 | 51 | أولاد جلال | 1406 | سيدي خالد |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 51 (أولاد جلال); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) | NAME COLLISION across wilayas: سيدي خالد (22,51) |
| 1412 | 52 | بني عباس | 1412 | إقلي |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 52 (بني عباس); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1417 | 52 | بني عباس | 1417 | القصابي |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 52 (بني عباس); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1413 | 52 | بني عباس | 1413 | الواتة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 52 (بني عباس); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1414 | 52 | بني عباس | 1414 | أولاد خضير |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 52 (بني عباس); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1418 | 52 | بني عباس | 1418 | بن يخلف |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 52 (بني عباس); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1410 | 52 | بني عباس | 1410 | بني عباس |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 52 (بني عباس); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1411 | 52 | بني عباس | 1411 | تامترت |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 52 (بني عباس); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1416 | 52 | بني عباس | 1416 | تيمودي |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 52 (بني عباس); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1415 | 52 | بني عباس | 1415 | كرزاز |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 52 (بني عباس); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1420 | 53 | عين صالح | 1420 | عين صالح |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 53 (عين صالح); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1419 | 53 | عين صالح | 1419 | عين غار |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 53 (عين صالح); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1421 | 53 | عين صالح | 1421 | فقارة الزوى |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 53 (عين صالح); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1422 | 54 | عين قزام | 1422 | تين زواتين |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 54 (عين قزام); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1423 | 54 | عين قزام | 1423 | عين قزام |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 54 (عين قزام); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1433 | 55 | تقرت | 1433 | الحجيرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 55 (تقرت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1436 | 55 | تقرت | 1436 | الزاوية العابدية |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 55 (تقرت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1431 | 55 | تقرت | 1431 | الطيبات |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 55 (تقرت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1432 | 55 | تقرت | 1432 | العالية |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 55 (تقرت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1426 | 55 | تقرت | 1426 | المقارين |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 55 (تقرت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1435 | 55 | تقرت | 1435 | المنقر |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 55 (تقرت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1427 | 55 | تقرت | 1427 | النزلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 55 (تقرت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1428 | 55 | تقرت | 1428 | بلدة اعمر |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 55 (تقرت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1434 | 55 | تقرت | 1434 | بن ناصر |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 55 (تقرت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1429 | 55 | تقرت | 1429 | تبسبست |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 55 (تقرت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1430 | 55 | تقرت | 1430 | تقرت |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 55 (تقرت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1424 | 55 | تقرت | 1424 | تماسين |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 55 (تقرت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1425 | 55 | تقرت | 1425 | سيدي سليمان |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 55 (تقرت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) | NAME COLLISION across wilayas: سيدي سليمان (32,38,55) |
| 1438 | 56 | جانت | 1438 | برج الحواس |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 56 (جانت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1437 | 56 | جانت | 1437 | جانت |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 56 (جانت); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1441 | 57 | المغير | 1441 | المرارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 57 (المغير); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1444 | 57 | المغير | 1444 | المغير |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 57 (المغير); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1439 | 57 | المغير | 1439 | أم الطيور |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 57 (المغير); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1443 | 57 | المغير | 1443 | تندلة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 57 (المغير); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1442 | 57 | المغير | 1442 | جامعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 57 (المغير); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1445 | 57 | المغير | 1445 | سطيل |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 57 (المغير); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1446 | 57 | المغير | 1446 | سيدي خليل |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 57 (المغير); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1440 | 57 | المغير | 1440 | سيدي عمران |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 57 (المغير); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1447 | 58 | المنيعة | 1447 | المنيعة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 58 (المنيعة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1449 | 58 | المنيعة | 1449 | حاسي الفحل |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 58 (المنيعة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1448 | 58 | المنيعة | 1448 | حاسي القارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 58 (المنيعة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1458 | 59 | أفلو | 1458 | أفلو |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 59 (أفلو); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1451 | 59 | أفلو | 1451 | الحاج مشري |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 59 (أفلو); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1453 | 59 | أفلو | 1453 | الغيشة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 59 (أفلو); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1450 | 59 | أفلو | 1450 | بريدة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 59 (أفلو); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1452 | 59 | أفلو | 1452 | تاويالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 59 (أفلو); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1454 | 59 | أفلو | 1454 | سبقاق |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 59 (أفلو); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1455 | 59 | أفلو | 1455 | سيدي بوزيد |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 59 (أفلو); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1456 | 59 | أفلو | 1456 | وادي مرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 59 (أفلو); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1457 | 59 | أفلو | 1457 | وادي مزي |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 59 (أفلو); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1465 | 60 | بريكة | 1465 | الجزار |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 60 (بريكة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1463 | 60 | بريكة | 1463 | إمدوكل |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 60 (بريكة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1466 | 60 | بريكة | 1466 | أولاد عمار |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 60 (بريكة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1461 | 60 | بريكة | 1461 | بريكة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 60 (بريكة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1462 | 60 | بريكة | 1462 | بيطام |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 60 (بريكة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1460 | 60 | بريكة | 1460 | تيلاطو |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 60 (بريكة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1459 | 60 | بريكة | 1459 | سقانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 60 (بريكة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1464 | 60 | بريكة | 1464 | عزيل عبد القادر |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 60 (بريكة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1470 | 61 | القنطرة | 1470 | القنطرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 61 (القنطرة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1469 | 61 | القنطرة | 1469 | الوطاية |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 61 (القنطرة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1468 | 61 | القنطرة | 1468 | برانيس |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 61 (القنطرة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1467 | 61 | القنطرة | 1467 | جمورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 61 (القنطرة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1471 | 61 | القنطرة | 1471 | عين زعطوط |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 61 (القنطرة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1474 | 62 | بئر العاتر | 1474 | العقلة المالحة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 62 (بئر العاتر); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1475 | 62 | بئر العاتر | 1475 | بئر العاتر |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 62 (بئر العاتر); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1472 | 62 | بئر العاتر | 1472 | فركان |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 62 (بئر العاتر); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1473 | 62 | بئر العاتر | 1473 | نقرين |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 62 (بئر العاتر); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1477 | 63 | العريشة | 1477 | البويهي |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 63 (العريشة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1480 | 63 | العريشة | 1480 | العريشة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 63 (العريشة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1483 | 63 | العريشة | 1483 | العزايل |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 63 (العريشة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1479 | 63 | العريشة | 1479 | القور |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 63 (العريشة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1481 | 63 | العريشة | 1481 | بني بهدل |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 63 (العريشة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1482 | 63 | العريشة | 1482 | بني سنوس |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 63 (العريشة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1478 | 63 | العريشة | 1478 | سبدو |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 63 (العريشة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1476 | 63 | العريشة | 1476 | سيدي الجيلالي |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 63 (العريشة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1489 | 64 | قصر الشلالة | 1489 | الرشايقة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 64 (قصر الشلالة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1487 | 64 | قصر الشلالة | 1487 | بوقرة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 64 (قصر الشلالة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) | NAME COLLISION across wilayas: بوقرة (64,9) |
| 1488 | 64 | قصر الشلالة | 1488 | حمادية |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 64 (قصر الشلالة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1486 | 64 | قصر الشلالة | 1486 | زمالة الأمير عبد القادر |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 64 (قصر الشلالة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1485 | 64 | قصر الشلالة | 1485 | سرغين |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 64 (قصر الشلالة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1484 | 64 | قصر الشلالة | 1484 | قصر الشلالة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 64 (قصر الشلالة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1495 | 65 | عين وسارة | 1495 | الخميس |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 65 (عين وسارة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1499 | 65 | عين وسارة | 1499 | بنهار |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 65 (عين وسارة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1491 | 65 | عين وسارة | 1491 | بويرة الأحداب |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 65 (عين وسارة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1496 | 65 | عين وسارة | 1496 | بيرين |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 65 (عين وسارة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1494 | 65 | عين وسارة | 1494 | حاسي فدول |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 65 (عين وسارة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1490 | 65 | عين وسارة | 1490 | حد الصحاري |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 65 (عين وسارة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1493 | 65 | عين وسارة | 1493 | سيدي لعجال |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 65 (عين وسارة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1492 | 65 | عين وسارة | 1492 | عين فقه |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 65 (عين وسارة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1498 | 65 | عين وسارة | 1498 | عين وسارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 65 (عين وسارة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1497 | 65 | عين وسارة | 1497 | قرنيني |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 65 (عين وسارة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1505 | 66 | مسعد | 1505 | أم العظام |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 66 (مسعد); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1504 | 66 | مسعد | 1504 | دلدول |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 66 (مسعد); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) | NAME COLLISION across wilayas: دلدول (49,66) |
| 1501 | 66 | مسعد | 1501 | سد الرحال |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 66 (مسعد); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1500 | 66 | مسعد | 1500 | سلمانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 66 (مسعد); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1507 | 66 | مسعد | 1507 | عمورة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 66 (مسعد); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1506 | 66 | مسعد | 1506 | فيض البطمة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 66 (مسعد); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1503 | 66 | مسعد | 1503 | قطارة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 66 (مسعد); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1502 | 66 | مسعد | 1502 | مسعد |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 66 (مسعد); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1511 | 67 | قصر البخاري | 1511 | السانق |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 67 (قصر البخاري); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1508 | 67 | قصر البخاري | 1508 | السواقي |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 67 (قصر البخاري); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1514 | 67 | قصر البخاري | 1514 | الشهبونية |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 67 (قصر البخاري); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1517 | 67 | قصر البخاري | 1517 | أم الجليل |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 67 (قصر البخاري); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1512 | 67 | قصر البخاري | 1512 | بوعيش |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 67 (قصر البخاري); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1513 | 67 | قصر البخاري | 1513 | بوغزول |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 67 (قصر البخاري); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1518 | 67 | قصر البخاري | 1518 | جواب |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 67 (قصر البخاري); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1516 | 67 | قصر البخاري | 1516 | دراق |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 67 (قصر البخاري); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1519 | 67 | قصر البخاري | 1519 | سيدي زهار |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 67 (قصر البخاري); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1520 | 67 | قصر البخاري | 1520 | سيدي زيان |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 67 (قصر البخاري); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1515 | 67 | قصر البخاري | 1515 | عزيز |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 67 (قصر البخاري); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1509 | 67 | قصر البخاري | 1509 | قصر البخاري |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 67 (قصر البخاري); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1510 | 67 | قصر البخاري | 1510 | مفاتحة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 67 (قصر البخاري); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1531 | 68 | بوسعادة | 1531 | الحوامد |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 68 (بوسعادة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1527 | 68 | بوسعادة | 1527 | أولاد سليمان |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 68 (بوسعادة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1522 | 68 | بوسعادة | 1522 | أولاد سيدي ابراهيم |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 68 (بوسعادة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) | NAME COLLISION across wilayas: أولاد سيدي ابراهيم (34,68) |
| 1521 | 68 | بوسعادة | 1521 | بن زوه |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 68 (بوسعادة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1525 | 68 | بوسعادة | 1525 | بن سرور |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 68 (بوسعادة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1524 | 68 | بوسعادة | 1524 | تامسة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 68 (بوسعادة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1529 | 68 | بوسعادة | 1529 | جبل مساعد |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 68 (بوسعادة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1532 | 68 | بوسعادة | 1532 | خبانة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 68 (بوسعادة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1528 | 68 | بوسعادة | 1528 | زرزور |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 68 (بوسعادة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1530 | 68 | بوسعادة | 1530 | سليم |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 68 (بوسعادة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1523 | 68 | بوسعادة | 1523 | سيدي عامر |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 68 (بوسعادة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) | NAME COLLISION across wilayas: سيدي عامر (32,42,68) |
| 1526 | 68 | بوسعادة | 1526 | محمد بوضياف |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 68 (بوسعادة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1533 | 68 | بوسعادة | 1533 | مسيف |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 68 (بوسعادة); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1541 | 69 | الأبيض سيدي الشيخ | 1541 | اربوات |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 69 (الأبيض سيدي الشيخ); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1539 | 69 | الأبيض سيدي الشيخ | 1539 | الأبيض سيدي الشيخ |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 69 (الأبيض سيدي الشيخ); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1536 | 69 | الأبيض سيدي الشيخ | 1536 | البنود |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 69 (الأبيض سيدي الشيخ); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1538 | 69 | الأبيض سيدي الشيخ | 1538 | الغاسول |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 69 (الأبيض سيدي الشيخ); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1537 | 69 | الأبيض سيدي الشيخ | 1537 | بريزينة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 69 (الأبيض سيدي الشيخ); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1540 | 69 | الأبيض سيدي الشيخ | 1540 | بوسمغون |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 69 (الأبيض سيدي الشيخ); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1534 | 69 | الأبيض سيدي الشيخ | 1534 | عين العراك |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 69 (الأبيض سيدي الشيخ); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |
| 1535 | 69 | الأبيض سيدي الشيخ | 1535 | كراكدة |  |  |  | NABDA DB (current division 69/1541) | 2026 | TRANSFERRED | low (candidate) | commune in post-2008 wilaya 69 (الأبيض سيدي الشيخ); identity vs RGPH2008 list pending verification against JORADP decrees (2019/2026) |

## 8) ملخص العدّ (قابل للتحديث بعد مطابقة قائمة RGPH 2008)
| التصنيف | العدد الحالي |
|---|---|
| إجمالي البلديات الحالية | 1541 |
| مرشح TRANSFERRED (ولايات مستحدثة 49–69) | 150 |
| UNCERTAIN (بانتظار قائمة RGPH 2008) | 1391 |
| EXACT / RENAMED / SPLIT / MERGED / CREATED | 0 (يُحتسب بعد الحصول على قائمة 2008 الرسمية) |

## 9) قواعد إدخال البيانات اللاحقة (من المرحلة 3B)
- السكان: لا يُدخل رقم قبل: تحديد البلدية التاريخية + الولاية التاريخية + التحقق من التقسيم + إثبات المطابقة + تسجيل المصدر + نوع المطابقة + درجة الثقة.
- المساحات: ممنوعة تمامًا في هذه المرحلة — لا area_km2 حتى وجود مؤسسة/وثيقة/سنة/رابط/رقم أصلي/وحدة/مستوى/طريقة/ثقة.
- الكثافة: density = population / area_km2 ولا تُحسب إلا بشرطين موثقين معًا.
- communes.population_density قيمة legacy qualitative — لا تُستخدم كمصدر ولا تُحوَّل إلى رقم.
