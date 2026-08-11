import jsPDF from "jspdf";

export interface ProjectPdfData {
  projectName: string;
  projectId?: string;
  category?: string;
  description?: string;

  minCapital?: number;
  recommendedCapital?: number;
  maxCapital?: number;

  riskLevel?: string;
  difficulty?: string;
  scalability?: string;
  timeRequired?: string;

  homeBased?: boolean;
  onlinePossible?: boolean;
  transportRequired?: boolean;

  seasonality?: string;
  competitionLevel?: string;
  targetArea?: string;

  advantages?: string[];
  risks?: string[];
  launchPlan?: string[];

  calc?: {
    grossRevenue?: number;
    totalExpenses?: number;
    netProfitMonthly?: number;
    breakEvenUnits?: number;
    profitMarginPercent?: number;
  };

  scenarios?: {
    conservative?: {
      netProfitMonthly?: number;
    };
    base?: {
      netProfitMonthly?: number;
    };
    optimistic?: {
      netProfitMonthly?: number;
    };
  };

  capitalAllocation?: unknown;

  shouldIStart?: {
    verdict?: string;
    explanation?: string;
  };

  selectedCapital?: number;
}

export interface ResultsPdfData {
  userInput?: Record<string, unknown>;

  top5Results?: Array<{
    project?: {
      projectName?: string;
      projectId?: string;
      category?: string;
      recommendedCapital?: number;
    };

    totalScore?: number;
    recommendation?: string;
    reasons?: string[];
  }>;

  explanationText?: string;
}

/* =========================================================
   Arabic fonts
   ========================================================= */

let fontRegularBase64: string | null = null;
let fontBoldBase64: string | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(
      i,
      Math.min(i + chunkSize, bytes.length)
    );

    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

async function loadArabicFonts(pdf: jsPDF): Promise<void> {
  if (!fontRegularBase64 || !fontBoldBase64) {
    const [regularResponse, boldResponse] = await Promise.all([
      fetch("/fonts/static/NotoNaskhArabic-Regular.ttf"),
      fetch("/fonts/static/NotoNaskhArabic-Bold.ttf"),
    ]);

    if (!regularResponse.ok) {
      throw new Error(
        "Could not load Noto Naskh Arabic Regular font."
      );
    }

    if (!boldResponse.ok) {
      throw new Error(
        "Could not load Noto Naskh Arabic Bold font."
      );
    }

    fontRegularBase64 = arrayBufferToBase64(
      await regularResponse.arrayBuffer()
    );

    fontBoldBase64 = arrayBufferToBase64(
      await boldResponse.arrayBuffer()
    );
  }

  pdf.addFileToVFS(
    "NotoNaskhArabic-Regular.ttf",
    fontRegularBase64
  );

  pdf.addFont(
    "NotoNaskhArabic-Regular.ttf",
    "NotoNaskhArabic",
    "normal"
  );

  pdf.addFileToVFS(
    "NotoNaskhArabic-Bold.ttf",
    fontBoldBase64
  );

  pdf.addFont(
    "NotoNaskhArabic-Bold.ttf",
    "NotoNaskhArabic",
    "bold"
  );

  pdf.setFont("NotoNaskhArabic", "normal");

  /*
   * jsPDF has RTL support.
   * This makes Arabic text flow from right to left.
   */
  try {
    pdf.setR2L(true);
  } catch {
    // Older jsPDF versions may not expose setR2L.
  }
}

/* =========================================================
   Formatting helpers
   ========================================================= */

function textValue(value: unknown): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  return String(value);
}

function formatNumber(value: unknown): string {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "-";
  }

  return new Intl.NumberFormat("ar-DZ").format(value);
}

function formatMoney(value: unknown): string {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "-";
  }

  return `${new Intl.NumberFormat("ar-DZ").format(value)} دج`;
}

function formatBoolean(value: unknown): string {
  if (value === true) {
    return "نعم";
  }

  if (value === false) {
    return "لا";
  }

  return "-";
}

/* =========================================================
   Arabic text preparation
   ========================================================= */

function prepareArabicText(text: string): string {
  const value = String(text ?? "");

  if (!value) {
    return "";
  }

  /*
   * jsPDF's Arabic support uses processArabic()
   * to shape Arabic characters correctly.
   */
  try {
    const api = jsPDF.API as unknown as {
      processArabic?: (input: string) => string;
    };

    if (typeof api.processArabic === "function") {
      return api.processArabic(value);
    }
  } catch {
    // Keep original text if Arabic processing is unavailable.
  }

  return value;
}

/* =========================================================
   Text rendering
   ========================================================= */

function addText(
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  width: number,
  fontSize = 10
): number {
  pdf.setFont("NotoNaskhArabic", "normal");
  pdf.setFontSize(fontSize);

  const preparedText = prepareArabicText(text);

  const lines = pdf.splitTextToSize(
    preparedText,
    width
  );

  pdf.text(lines, x, y, {
    align: "right",
    isInputRtl: true,
  } as any);

  return y + lines.length * (fontSize * 0.55 + 2);
}

/* =========================================================
   File name
   ========================================================= */

function safeFileName(value: string): string {
  return String(value || "project")
    .replace(/[<>:"/|?*]+/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   PDF creation
   ========================================================= */

function createPdf(): jsPDF {
  return new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
}

/* =========================================================
   Page header
   ========================================================= */

function addPageHeader(
  pdf: jsPDF,
  title: string,
  pageWidth: number,
  margin: number
): number {
  pdf.setFont("NotoNaskhArabic", "bold");
  pdf.setFontSize(18);

  pdf.text(
    prepareArabicText(title),
    pageWidth - margin,
    20,
    {
      align: "right",
      isInputRtl: true,
    } as any
  );

  pdf.setLineWidth(0.3);

  pdf.line(
    margin,
    25,
    pageWidth - margin,
    25
  );

  return 34;
}

/* =========================================================
   Section title
   ========================================================= */

function addSectionTitle(
  pdf: jsPDF,
  title: string,
  pageWidth: number,
  margin: number,
  y: number
): number {
  pdf.setFont("NotoNaskhArabic", "bold");
  pdf.setFontSize(13);

  pdf.text(
    prepareArabicText(title),
    pageWidth - margin,
    y,
    {
      align: "right",
      isInputRtl: true,
    } as any
  );

  return y + 8;
}

/* =========================================================
   Project PDF
   ========================================================= */

export async function downloadProjectPdf(
  data: ProjectPdfData
): Promise<void> {
  const pdf = createPdf();

  await loadArabicFonts(pdf);

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  const margin = 18;

  const contentWidth =
    pageWidth - margin * 2;

  let y = addPageHeader(
    pdf,
    "دراسة مشروع",
    pageWidth,
    margin
  );

  const ensureSpace = (
    required: number
  ): void => {
    if (y + required > pageHeight - 20) {
      pdf.addPage();

      pdf.setFont(
        "NotoNaskhArabic",
        "normal"
      );

      y = 20;
    }
  };

  /* Project name */

  pdf.setFont(
    "NotoNaskhArabic",
    "bold"
  );

  pdf.setFontSize(20);

  pdf.text(
    prepareArabicText(
      textValue(data.projectName)
    ),
    pageWidth - margin,
    y,
    {
      align: "right",
      isInputRtl: true,
    } as any
  );

  y += 12;

  /* Basic information */

  if (data.projectId) {
    y = addText(
      pdf,
      `المعرّف: ${data.projectId}`,
      pageWidth - margin,
      y,
      contentWidth
    );
  }

  if (data.category) {
    y = addText(
      pdf,
      `التصنيف: ${data.category}`,
      pageWidth - margin,
      y,
      contentWidth
    );
  }

  /* Description */

  if (data.description) {
    ensureSpace(25);

    y = addSectionTitle(
      pdf,
      "وصف المشروع",
      pageWidth,
      margin,
      y + 5
    );

    y = addText(
      pdf,
      data.description,
      pageWidth - margin,
      y,
      contentWidth
    );
  }

  /* Financial information */

  ensureSpace(35);

  y = addSectionTitle(
    pdf,
    "المعلومات المالية",
    pageWidth,
    margin,
    y + 8
  );

  const financialRows: Array<
    [string, string]
  > = [
    [
      "رأس المال الأدنى",
      formatMoney(data.minCapital),
    ],
    [
      "رأس المال المقترح",
      formatMoney(data.recommendedCapital),
    ],
    [
      "رأس المال الأقصى",
      formatMoney(data.maxCapital),
    ],
    [
      "رأس المال المختار",
      formatMoney(data.selectedCapital),
    ],
    [
      "الإيرادات الشهرية",
      formatMoney(data.calc?.grossRevenue),
    ],
    [
      "المصاريف الشهرية",
      formatMoney(data.calc?.totalExpenses),
    ],
    [
      "صافي الربح الشهري",
      formatMoney(data.calc?.netProfitMonthly),
    ],
    [
      "نقطة التعادل",
      formatNumber(data.calc?.breakEvenUnits),
    ],
    [
      "هامش الربح",
      data.calc?.profitMarginPercent !== undefined
        ? `${formatNumber(
            data.calc.profitMarginPercent
          )}%`
        : "-",
    ],
  ];

  for (const [label, value] of financialRows) {
    ensureSpace(12);

    y = addText(
      pdf,
      `${label}: ${value}`,
      pageWidth - margin,
      y,
      contentWidth
    );

    y += 1;
  }

  /* Characteristics */

  ensureSpace(35);

  y = addSectionTitle(
    pdf,
    "خصائص المشروع",
    pageWidth,
    margin,
    y + 8
  );

  const characteristics: Array<
    [string, string]
  > = [
    [
      "مستوى المخاطر",
      textValue(data.riskLevel),
    ],
    [
      "درجة الصعوبة",
      textValue(data.difficulty),
    ],
    [
      "قابلية التوسع",
      textValue(data.scalability),
    ],
    [
      "الوقت المطلوب",
      textValue(data.timeRequired),
    ],
    [
      "يمكن العمل من المنزل",
      formatBoolean(data.homeBased),
    ],
    [
      "يمكن العمل عبر الإنترنت",
      formatBoolean(data.onlinePossible),
    ],
    [
      "يتطلب النقل",
      formatBoolean(data.transportRequired),
    ],
    [
      "الموسمية",
      textValue(data.seasonality),
    ],
    [
      "مستوى المنافسة",
      textValue(data.competitionLevel),
    ],
    [
      "المنطقة المستهدفة",
      textValue(data.targetArea),
    ],
  ];

  for (const [label, value] of characteristics) {
    ensureSpace(12);

    y = addText(
      pdf,
      `${label}: ${value}`,
      pageWidth - margin,
      y,
      contentWidth
    );

    y += 1;
  }

  /* Advantages */

  if (data.advantages?.length) {
    ensureSpace(25);

    y = addSectionTitle(
      pdf,
      "مزايا المشروع",
      pageWidth,
      margin,
      y + 8
    );

    for (const item of data.advantages) {
      ensureSpace(12);

      y = addText(
        pdf,
        `• ${item}`,
        pageWidth - margin,
        y,
        contentWidth
      );

      y += 2;
    }
  }

  /* Risks */

  if (data.risks?.length) {
    ensureSpace(25);

    y = addSectionTitle(
      pdf,
      "المخاطر",
      pageWidth,
      margin,
      y + 8
    );

    for (const item of data.risks) {
      ensureSpace(12);

      y = addText(
        pdf,
        `• ${item}`,
        pageWidth - margin,
        y,
        contentWidth
      );

      y += 2;
    }
  }

  /* Launch plan */

  if (data.launchPlan?.length) {
    ensureSpace(25);

    y = addSectionTitle(
      pdf,
      "خطة الإطلاق",
      pageWidth,
      margin,
      y + 8
    );

    data.launchPlan.forEach(
      (item, index) => {
        ensureSpace(12);

        y = addText(
          pdf,
          `${index + 1}. ${item}`,
          pageWidth - margin,
          y,
          contentWidth
        );

        y += 2;
      }
    );
  }

  /* Profit scenarios */

  if (data.scenarios) {
    ensureSpace(35);

    y = addSectionTitle(
      pdf,
      "سيناريوهات الربح",
      pageWidth,
      margin,
      y + 8
    );

    const scenarios = [
      [
        "السيناريو المحافظ",
        data.scenarios.conservative
          ?.netProfitMonthly,
      ],
      [
        "السيناريو الأساسي",
        data.scenarios.base
          ?.netProfitMonthly,
      ],
      [
        "السيناريو المتفائل",
        data.scenarios.optimistic
          ?.netProfitMonthly,
      ],
    ] as const;

    for (const [label, value] of scenarios) {
      ensureSpace(12);

      y = addText(
        pdf,
        `${label}: ${formatMoney(value)}`,
        pageWidth - margin,
        y,
        contentWidth
      );

      y += 1;
    }
  }

  /* Should I start? */

  if (data.shouldIStart) {
    ensureSpace(35);

    y = addSectionTitle(
      pdf,
      "هل أنصحك بالبدء؟",
      pageWidth,
      margin,
      y + 8
    );

    if (data.shouldIStart.verdict) {
      y = addText(
        pdf,
        `النتيجة: ${data.shouldIStart.verdict}`,
        pageWidth - margin,
        y,
        contentWidth
      );

      y += 3;
    }

    if (data.shouldIStart.explanation) {
      y = addText(
        pdf,
        data.shouldIStart.explanation,
        pageWidth - margin,
        y,
        contentWidth
      );
    }
  }

  /* Footer */

  pdf.setFont(
    "NotoNaskhArabic",
    "normal"
  );

  pdf.setFontSize(9);

  pdf.text(
    prepareArabicText(
      "تم إنشاء هذا التقرير بواسطة منصة دراسة المشاريع."
    ),
    pageWidth - margin,
    pageHeight - 12,
    {
      align: "right",
      isInputRtl: true,
    } as any
  );

  const safeName = safeFileName(
    data.projectName || "project"
  );

  pdf.save(
    `project-${safeName || "report"}.pdf`
  );
}

/* =========================================================
   Results PDF
   ========================================================= */

export async function downloadResultsPdf(
  data: ResultsPdfData
): Promise<void> {
  const pdf = createPdf();

  await loadArabicFonts(pdf);

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  const margin = 18;

  const contentWidth =
    pageWidth - margin * 2;

  let y = addPageHeader(
    pdf,
    "نتائج تقييم المشاريع",
    pageWidth,
    margin
  );

  const ensureSpace = (
    required: number
  ): void => {
    if (y + required > pageHeight - 20) {
      pdf.addPage();

      pdf.setFont(
        "NotoNaskhArabic",
        "normal"
      );

      y = 20;
    }
  };

  /* Explanation */

  if (data.explanationText) {
    y = addSectionTitle(
      pdf,
      "التحليل",
      pageWidth,
      margin,
      y
    );

    y = addText(
      pdf,
      data.explanationText,
      pageWidth - margin,
      y,
      contentWidth
    );

    y += 8;
  }

  /* Top 5 projects */

  if (data.top5Results?.length) {
    y = addSectionTitle(
      pdf,
      "أفضل المشاريع المقترحة",
      pageWidth,
      margin,
      y
    );

    for (
      let index = 0;
      index < data.top5Results.length;
      index++
    ) {
      const result =
        data.top5Results[index];

      ensureSpace(45);

      pdf.setFont(
        "NotoNaskhArabic",
        "bold"
      );

      pdf.setFontSize(12);

      pdf.text(
        prepareArabicText(
          `${index + 1}. ${textValue(
            result.project?.projectName
          )}`
        ),
        pageWidth - margin,
        y,
        {
          align: "right",
          isInputRtl: true,
        } as any
      );

      y += 8;

      y = addText(
        pdf,
        `التصنيف: ${textValue(
          result.project?.category
        )}`,
        pageWidth - margin,
        y,
        contentWidth
      );

      y = addText(
        pdf,
        `رأس المال المقترح: ${formatMoney(
          result.project?.recommendedCapital
        )}`,
        pageWidth - margin,
        y,
        contentWidth
      );

      y = addText(
        pdf,
        `النتيجة: ${formatNumber(
          result.totalScore
        )}`,
        pageWidth - margin,
        y,
        contentWidth
      );

      if (result.recommendation) {
        y = addText(
          pdf,
          `التوصية: ${result.recommendation}`,
          pageWidth - margin,
          y,
          contentWidth
        );
      }

      if (result.reasons?.length) {
        for (const reason of result.reasons) {
          ensureSpace(12);

          y = addText(
            pdf,
            `• ${reason}`,
            pageWidth - margin,
            y,
            contentWidth
          );

          y += 1;
        }
      }

      y += 6;
    }
  }

  /* Footer */

  pdf.setFont(
    "NotoNaskhArabic",
    "normal"
  );

  pdf.setFontSize(9);

  pdf.text(
    prepareArabicText(
      "تم إنشاء هذا التقرير بواسطة منصة دراسة المشاريع."
    ),
    pageWidth - margin,
    pageHeight - 12,
    {
      align: "right",
      isInputRtl: true,
    } as any
  );

  pdf.save(
    `NABDA-Assessment-${Date.now()}.pdf`
  );
}

