import { ScoredProjectResult, UserAssessmentInput } from "./scoringEngine";

export async function generateAnalysisExplanation(
  user: UserAssessmentInput,
  topResults: ScoredProjectResult[]
): Promise<string> {
  const topMatch = topResults[0];
  if (!topMatch) return "لم يتم العثور على مشاريع متوافقة بناءً على المدخلات.";

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "أنت خبير واستشاري مشاريع مصغرة في الجزائر منصة 'NABDA - نابدا' (قبل ما تبدأ مشروعك... اختبره). مهمتك تقديم شرح مبسط، مشجع وواقعي لنتائج التحليل المالية والشخصية بدون تقديم ضمانات وهمية.",
            },
            {
              role: "user",
              content: `
المستخدم أدخل المعطيات التالية:
- رأس المال: ${user.capital.toLocaleString()} دج
- مكان العمل: ${user.workspace}
- الولاية: ${user.wilayaName || "غير محددة"}
- الوقت المتاح: ${user.availableHours}
- الخبرات: ${user.skills.join("، ") || "بدون خبرة محددة"}
- مستوى المخاطرة المقبول: ${user.riskLevel}

أفضل مشروع مقترح:
- الاسم: ${topMatch.project.projectName}
- درجة الملاءمة: ${topMatch.totalScore}/100
- التوصية: ${topMatch.recommendation}

يرجى كتابة فقرة توضيحية قصيرة (من 3 إلى 4 أسطر) تشرح للمستخدم بلغة عربية سلسة ومناسبة للجزائريين لماذا هذا المشروع هو الأكثر ملاءمة لظروفه الحالية.
              `,
            },
          ],
          temperature: 0.7,
          max_tokens: 250,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text.trim();
      }
    } catch (e) {
      console.warn("AI API call failed, falling back to rule-based explanation:", e);
    }
  }

  // Fallback dynamic generator
  return `تم اختيار مشروع **"${topMatch.project.projectName}"** كأفضل خيار لظروفك الحالية بـ **${
    topMatch.totalScore
  }/100 نقطة** لأن رأس مالك المتاح (${user.capital.toLocaleString()} دج) يتيح لك انطلاقة متوازنة، كما أن صيغة العمل (${
    user.workspace
  }) تتوافق مع نمط التشغيل المعتمد للمشروع، ويمنحك مرونة عالية للتوسع بدون مخاطرة كبيرة.`;
}

export async function analyzeCustomIdea(
  ideaTitle: string,
  ideaCategory: string,
  userCapital: number,
  userWorkspace: string,
  userSkills: string[],
  userRisk: string
): Promise<{
  score: number;
  verdict: string;
  financialFitText: string;
  strengths: string[];
  weaknesses: string[];
  risksText: string;
  recommendedSteps: string[];
}> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "أنت محلل جدوى ودراسة أفكار مشاريع في السوق الجزائري ضمن منصة 'NABDA - نابدا'. يرجى إرجاع النتيجة بصيغة JSON فقط بهذه الحقول: score (عدد من 0 لـ 100), verdict, financialFitText, strengths (قائمة نصية), weaknesses (قائمة نصية), risksText, recommendedSteps (قائمة نصية).",
            },
            {
              role: "user",
              content: `فكرة المستخدم: "${ideaTitle}" في مجال "${ideaCategory}". المعطيات: رأس المال ${userCapital} دج، مكان العمل: ${userWorkspace}، المهارات: ${userSkills.join(
                ", "
              )}، المخاطرة: ${userRisk}.`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.6,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
        if (parsed.score !== undefined) {
          return {
            score: parsed.score || 70,
            verdict: parsed.verdict || "فكرة واعدة تحتاج إلى اختبار ميداني أولاً",
            financialFitText: parsed.financialFitText || `رأس المال المتاح (${userCapital.toLocaleString()} دج) يسمح بتجربة نموذج مصغر.`,
            strengths: parsed.strengths || ["مرونة في التشغيل", "إمكانية الاستفادة من المهارات المتاحة"],
            weaknesses: parsed.weaknesses || ["تحدي المنافسة المحلية", "ضرورة المتابعة والتسويق"],
            risksText: parsed.risksText || "تذبذب أسعار المواد والتأخر في استقطاب الزبائن الأولى.",
            recommendedSteps: parsed.recommendedSteps || ["دراسة أسعار المنافسين", "إطلاق تجربة مصغرة لمدة 15 يوماً"],
          };
        }
      }
    } catch (e) {
      console.warn("AI Idea analysis call failed, using fallback:", e);
    }
  }

  // Fallback rule-based custom idea analyzer
  let calculatedScore = 70;
  if (userCapital >= 50000) calculatedScore += 10;
  if (userWorkspace === "من المنزل" || userWorkspace === "أونلاين") calculatedScore += 5;

  return {
    score: Math.min(95, calculatedScore),
    verdict: "فكرة قابلة للتنفيذ كنموذج تجريبي مصغر بالجزائر",
    financialFitText: `مبلغ ${userCapital.toLocaleString()} دج كافٍ لإطلاق مرحلة تجربة الطلب أولاً دون شراء مخزون كبير.`,
    strengths: [
      "إمكانية الانطلاق الفوري بدون تعقيدات إدارية كبيرة",
      "الاستفادة المباشرة من شبكة العلاقات والفيسبوك لتسويق الفكرة",
      "التحكم الكامل في مصاريف التشغيل اليومية"
    ],
    weaknesses: [
      "ضرورة التحقق المسبق من وجود طلب حقيقي في منطقتك",
      "الحاجة للتسويق المباشر وبناء الثقة في بداية المشروع"
    ],
    risksText: "خطر الشراء المفرط للبضائع أو التجهيزات قبل التأكد من رضا وإقبال الزبائن.",
    recommendedSteps: [
      "حدد أربعة منافسين مباشرين في ولايتك وادرس أسعارهم وخدماتهم.",
      "اصنع نموذجًا أوليًا أو انشر إعلانًا تجريبيًا لقياس حجم الطلب قبل الانفاق الكلي.",
      "احسب التكاليف المتغيرة بدقة وضبط هامش ربح لا يقل عن 30%."
    ],
  };
}
