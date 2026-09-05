"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2, X, AlertTriangle, Save, ChevronDown } from "lucide-react";
import { getCsrfToken } from "@/lib/clientCsrf";
import { emptyPaidStudyDraft } from "@/lib/noCapital/studyValidation";
import type {
  PaidStudy,
  StudyClientAcquisition,
  StudyCompetition,
  StudyEquipment,
  StudyGrowthStep,
  StudyMarketing,
  StudyMistake,
  StudyPlanWeekBlock,
  StudyPricing,
  StudyRedFlag,
  StudySource,
  StudyWorkflowStep,
  StudyIdealClient,
} from "@/lib/noCapital/types";

const SOURCE_STATUS_OPTIONS = ["VERIFIED", "BENCHMARK", "SUGGESTED", "NEEDS_VALIDATION"] as const;
const PRICING_MODEL_OPTIONS = ["per_word", "per_minute", "per_project", "monthly_retainer", "package"] as const;
const DIFFICULTY_OPTIONS = ["low", "medium", "high"] as const;
const EQUIPMENT_TIER_OPTIONS = ["free", "pro"] as const;
const WEEK_OPTIONS = [1, 2, 3, 4] as const;
const SOURCE_TYPE_OPTIONS = ["OFFICIAL", "BENCHMARK", "REFERENCE"] as const;
const STATUS_OPTIONS = [
  { value: "draft", label: "Draft (مسودة)" },
  { value: "review", label: "Review (مراجعة)" },
  { value: "approved", label: "Approved (معتمدة)" },
];

type RepeatableConfig<T> = {
  key: keyof PaidStudy;
  label: string;
  empty: () => T;
  render: (item: T, update: (next: T) => void, remove: () => void) => React.ReactNode;
};

// Small presentational helpers -------------------------------------------------

function Section({ title, children, hint }: { title: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3">
      <div>
        <h3 className="text-sm font-black text-slate-800">{title}</h3>
        {hint && <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[11px] font-bold text-slate-600 block mb-1">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

const inputCls =
  "w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm bg-white";
const textareaCls =
  "w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-mono resize-y";

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 2,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea className={textareaCls} rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type="number"
        className={inputCls}
        value={value != null ? String(value) : ""}
        onChange={(e) => {
          if (e.target.value === "") return onChange(undefined);
          const n = Number(e.target.value);
          onChange(Number.isFinite(n) ? n : undefined);
        }}
      />
    </div>
  );
}

function SelectInput<T extends string | number>({
  label,
  value,
  options,
  onChange,
  render,
}: {
  label: string;
  value: T | undefined;
  options: readonly T[];
  onChange: (v: T | undefined) => void;
  render: (v: T) => string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        className={inputCls}
        value={value != null ? String(value) : ""}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") return onChange(undefined);
          const found = options.find((o) => String(o) === raw);
          onChange(found);
        }}
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={String(o)} value={String(o)}>
            {render(o)}
          </option>
        ))}
      </select>
    </div>
  );
}

function TagsInput({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  hint?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {hint && <p className="text-[10px] text-slate-400 -mt-1 mb-1">{hint}</p>}
      <textarea
        className={textareaCls}
        rows={3}
        value={value.join("\n")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(/[\n,،]/)
              .map((s) => s.trim())
              .filter(Boolean)
          )
        }
      />
    </div>
  );
}

function BoolInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select className={inputCls} value={value ? "true" : "false"} onChange={(e) => onChange(e.target.value === "true")}>
        <option value="true">نعم</option>
        <option value="false">لا</option>
      </select>
    </div>
  );
}

function RowCard({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50 relative">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
        title="إزالة"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
      {children}
    </div>
  );
}

function RepeatableRows<T>({
  items,
  onChange,
  empty,
  render,
  addLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  empty: () => T;
  render: (item: T, update: (next: T) => void, remove: () => void) => React.ReactNode;
  addLabel: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) =>
        render(
          item,
          (next) => {
            const copy = [...items];
            copy[i] = next;
            onChange(copy);
          },
          () => onChange(items.filter((_, idx) => idx !== i))
        )
      )}
      <button
        type="button"
        onClick={() => onChange([...items, empty()])}
        className="px-3 py-2 rounded-xl border border-dashed border-emerald-400 text-emerald-600 text-xs font-extrabold hover:bg-emerald-50 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> {addLabel}
      </button>
    </div>
  );
}

function SimpleTagsRow({
  value,
  onChange,
  label,
  hint,
  empty,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  label: string;
  hint?: string;
  empty?: string;
}) {
  return (
    <div className="py-1">
      <Label>{label}</Label>
      {hint && <p className="text-[10px] text-slate-400 -mt-1 mb-1">{hint}</p>}
      <textarea
        className={textareaCls}
        rows={3}
        value={value.join("\n")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(/[\n,،]/)
              .map((s) => s.trim())
              .filter(Boolean)
          )
        }
        placeholder={empty}
      />
    </div>
  );
}

// Main editor ---------------------------------------------------------------

type EditorProps = {
  initial: PaidStudy;
  onSave: (next: PaidStudy) => void;
  saving: boolean;
  error: string | null;
};

export default function PaidStudyEditor({ initial, onSave, saving, error }: EditorProps) {
  const [study, setStudy] = useState<PaidStudy>(() =>
    initial && initial.summary ? initial : emptyPaidStudyDraft()
  );
  const [activeSection, setActiveSection] = useState<string>("summary");

  const set = <K extends keyof PaidStudy>(key: K, value: PaidStudy[K]) =>
    setStudy((s) => ({ ...s, [key]: value }));

  const sections: { id: string; title: string }[] = [
    { id: "summary", title: "1. Summary" },
    { id: "capital", title: "2. Capital (رأس المال)" },
    { id: "idealClients", title: "3. Ideal Clients" },
    { id: "skills", title: "4. Skills" },
    { id: "equipment", title: "5. Equipment" },
    { id: "pricing", title: "6. Pricing" },
    { id: "profitModel", title: "7. Profit Model" },
    { id: "businessModel", title: "8. Business Model" },
    { id: "firstClientAcquisition", title: "9. First Client Acquisition" },
    { id: "workflow", title: "10. Workflow" },
    { id: "marketCompetition", title: "11. Competition" },
    { id: "commonMistakes", title: "12. Common Mistakes" },
    { id: "redFlags", title: "13. Red Flags" },
    { id: "marketing", title: "14. Marketing" },
    { id: "plan30Days", title: "15. 30-Day Plan" },
    { id: "growthPath", title: "16. Growth" },
    { id: "legalDz", title: "17. Legal Algeria" },
    { id: "caseStudy", title: "18. Case Study" },
    { id: "sources", title: "19. Sources" },
    { id: "meta", title: "20. Meta / Review" },
  ];

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header + status */}
      <Section title="حالة الدراسة (Status)">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[180px] flex-1">
            <Label>الحالة</Label>
            <select
              className={inputCls}
              value={study.status}
              onChange={(e) => set("status", e.target.value as PaidStudy["status"])}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <NumberInput label="الإصدار (version)" value={study.version} onChange={(v) => set("version", v ?? 1)} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-amber-600 mt-1">
              ملاحظة: حتى تكون الدراسة «approved»، لن تُعرض لأي مستخدم. المسودة (draft) ممنوعة من الظهور في أي طريق عام.
            </p>
          </div>
        </div>
      </Section>

      {/* Section nav */}
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            className={`px-3 py-2 rounded-xl text-[11px] font-extrabold transition-colors ${
              activeSection === s.id ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-400"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold block mb-0.5">تنبيه</span>
            {error}
          </div>
        </div>
      )}

      {/* Active section body */}
      <div className="space-y-4">
        {activeSection === "summary" && (
          <Section title="الملخص (Summary)">
            <TextArea
              label="الوصف العام (overview)"
              value={study.summary.overview}
              onChange={(v) => set("summary", { ...study.summary, overview: v })}
              rows={3}
              placeholder="نظرة عامة مميزة للدراسة المدفوعة..."
            />
          </Section>
        )}

        {activeSection === "capital" && (
          <Section title="رأس المال (Capital)" hint="خاص بمشاريع رأس المال — المُعبّأ تلقائياً من الأعمدة الكلاسيكية min/rec/max.">
            <div className="grid sm:grid-cols-3 gap-4">
              <NumberInput
                label="الحد الأدنى (min DZD)"
                value={study.startupCapital?.min}
                onChange={(v) =>
                  set("startupCapital", {
                    min: v ?? 0,
                    recommended: study.startupCapital?.recommended ?? 0,
                    max: study.startupCapital?.max ?? 0,
                  })
                }
              />
              <NumberInput
                label="الموصى به (recommended DZD)"
                value={study.startupCapital?.recommended}
                onChange={(v) =>
                  set("startupCapital", {
                    min: study.startupCapital?.min ?? 0,
                    recommended: v ?? 0,
                    max: study.startupCapital?.max ?? 0,
                  })
                }
              />
              <NumberInput
                label="الحد الأقصى (max DZD)"
                value={study.startupCapital?.max}
                onChange={(v) =>
                  set("startupCapital", {
                    min: study.startupCapital?.min ?? 0,
                    recommended: study.startupCapital?.recommended ?? 0,
                    max: v ?? 0,
                  })
                }
              />
            </div>

            <TagsInput
              label="نقاط القوة (strengths)"
              hint="من عمود المزايا الكلاسيكي (advantages)"
              value={study.strengths ?? []}
              onChange={(v) => set("strengths", v)}
            />

            <Section title="خطة اختبار السوق (marketTestPlan)" hint="استراتيجية اختبار السوق قبل الإطلاق (خاصة بمشاريع رأس المال).">
              <TagsInput label="الخطوات (steps)" value={study.marketTestPlan?.steps ?? []} onChange={(v) => set("marketTestPlan", { ...(study.marketTestPlan ?? { steps: [] }), steps: v })} />
              <TagsInput label="القنوات (channels)" value={study.marketTestPlan?.channels ?? []} onChange={(v) => set("marketTestPlan", { ...(study.marketTestPlan ?? { steps: [] }), channels: v })} />
              <TagsInput label="مؤشرات القياس (kpis)" value={study.marketTestPlan?.kpis ?? []} onChange={(v) => set("marketTestPlan", { ...(study.marketTestPlan ?? { steps: [] }), kpis: v })} />
            </Section>
          </Section>
        )}

        {activeSection === "idealClients" && (
          <Section title="العملاء المثاليون (Ideal Clients)" hint="من يدفع لخدمتك ولماذا؟">
            <RepeatableRows
              items={study.idealClients}
              onChange={(v) => set("idealClients", v)}
              empty={(): StudyIdealClient => ({ persona: "" })}
              addLabel="إضافة عميل مثالي"
              render={(item, update, remove) => (
                <RowCard onRemove={remove}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <TextInput label="الشخص/الصورة (persona) *" value={item.persona} onChange={(v) => update({ ...item, persona: v })} />
                    <TextInput label="نوع المنظمة (orgType)" value={item.orgType ?? ""} onChange={(v) => update({ ...item, orgType: v })} />
                    <TextInput label="المنصة (platform)" value={item.platform ?? ""} onChange={(v) => update({ ...item, platform: v })} />
                    <div className="flex items-end">
                      <BoolInput label="مؤهل للسوق الجزائري (dzEligible)" value={item.dzEligible ?? false} onChange={(v) => update({ ...item, dzEligible: v })} />
                    </div>
                    <div className="sm:col-span-2">
                      <TextArea label="ملاحظات (notes)" value={item.notes ?? ""} onChange={(v) => update({ ...item, notes: v })} rows={1} />
                    </div>
                  </div>
                </RowCard>
              )}
            />
          </Section>
        )}

        {activeSection === "skills" && (
          <Section title="المهارات (Skills)">
            <div className="grid sm:grid-cols-2 gap-4">
              <TagsInput label="الحد الأدنى من المهارات (minimum)" value={study.skills.minimum} onChange={(v) => set("skills", { ...study.skills, minimum: v })} />
              <TagsInput label="المهارات المتقدمة (advanced)" value={study.skills.advanced} onChange={(v) => set("skills", { ...study.skills, advanced: v })} />
            </div>
          </Section>
        )}

        {activeSection === "equipment" && (
          <Section title="المعدات والأدوات (Equipment)" hint="كل سطر معدن بطبقة ومصدر التوثيق">
            <RepeatableRows
              items={study.equipment}
              onChange={(v) => set("equipment", v)}
              empty={(): StudyEquipment => ({ item: "", tier: "free", sourceStatus: "NEEDS_VALIDATION" })}
              addLabel="إضافة معدة"
              render={(item, update, remove) => (
                <RowCard onRemove={remove}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <TextInput label="القطعة (item) *" value={item.item} onChange={(v) => update({ ...item, item: v })} />
                    <SelectInput
                      label="الطبقة (tier)"
                      value={item.tier}
                      options={EQUIPMENT_TIER_OPTIONS}
                      onChange={(v) => update({ ...item, tier: v ?? "free" })}
                      render={(v) => (v === "free" ? "free" : "pro")}
                    />
                    <NumberInput label="التكلفة التقديرية (cost DZD)" value={item.cost} onChange={(v) => update({ ...item, cost: v })} />
                    <div className="sm:col-span-2">
                      <TextArea label="الغرض (purpose)" value={item.purpose ?? ""} onChange={(v) => update({ ...item, purpose: v })} rows={1} />
                    </div>
                    <TextInput label="المصدر (source)" value={item.source ?? ""} onChange={(v) => update({ ...item, source: v })} />
                    <SelectInput
                      label="حالة المصدر (sourceStatus) *"
                      value={item.sourceStatus}
                      options={SOURCE_STATUS_OPTIONS}
                      onChange={(v) => update({ ...item, sourceStatus: v ?? "NEEDS_VALIDATION" })}
                      render={(v) => v}
                    />
                  </div>
                </RowCard>
              )}
            />
          </Section>
        )}

        {activeSection === "pricing" && (
          <Section title="التسعير (Pricing)" hint="افصل الأسعار العالمية (USD) عن المقترح الجزائري (DZD). لا تدخل سعر DZD غير مؤكد.">
            <RepeatableRows
              items={study.pricing}
              onChange={(v) => set("pricing", v)}
              empty={(): StudyPricing => ({ model: "per_project", dzPriceStatus: "NEEDS_VALIDATION" })}
              addLabel="إضافة بند تسعير"
              render={(item, update, remove) => (
                <RowCard onRemove={remove}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <SelectInput
                      label="نموذج التسعير (model) *"
                      value={item.model}
                      options={PRICING_MODEL_OPTIONS}
                      onChange={(v) => update({ ...item, model: v ?? "per_project" })}
                      render={(v) => v}
                    />
                    <SelectInput
                      label="حالة سعر DZD (dzPriceStatus) *"
                      value={item.dzPriceStatus}
                      options={SOURCE_STATUS_OPTIONS}
                      onChange={(v) => update({ ...item, dzPriceStatus: v ?? "NEEDS_VALIDATION" })}
                      render={(v) => v}
                    />
                    <NumberInput label="الحد الأدنى عالمياً (globalMinUsd)" value={item.globalMinUsd} onChange={(v) => update({ ...item, globalMinUsd: v })} />
                    <NumberInput label="الحد الأعلى عالمياً (globalMaxUsd)" value={item.globalMaxUsd} onChange={(v) => update({ ...item, globalMaxUsd: v })} />
                    <NumberInput label="مقترح DZD (dzSuggestedDzd)" value={item.dzSuggestedDzd} onChange={(v) => update({ ...item, dzSuggestedDzd: v })} />
                    <TextInput label="المصدر (source)" value={item.source ?? ""} onChange={(v) => update({ ...item, source: v })} />
                    <div className="sm:col-span-2">
                      <TextArea label="ملاحظة (note)" value={item.note ?? ""} onChange={(v) => update({ ...item, note: v })} rows={1} />
                    </div>
                  </div>
                </RowCard>
              )}
            />
          </Section>
        )}

        {activeSection === "profitModel" && (
          <Section title="نموذج الربح ونقطة التعادل (Profit Model)">
            <div className="grid sm:grid-cols-2 gap-4">
              <TextInput label="مرساة التسعير (priceAnchor)" value={study.profitModel.priceAnchor ?? ""} onChange={(v) => set("profitModel", { ...study.profitModel, priceAnchor: v })} />
              <NumberInput label="ساعات لكل وحدة (hoursPerUnit)" value={study.profitModel.hoursPerUnit} onChange={(v) => set("profitModel", { ...study.profitModel, hoursPerUnit: v })} />
              <NumberInput label="إجمالي لكل ساعة (grossPerHour)" value={study.profitModel.grossPerHour} onChange={(v) => set("profitModel", { ...study.profitModel, grossPerHour: v })} />
              <NumberInput label="وحدات التعادل (breakEvenUnits)" value={study.profitModel.breakEvenUnits} onChange={(v) => set("profitModel", { ...study.profitModel, breakEvenUnits: v })} />
              <div className="sm:col-span-2">
                <TextArea label="ملاحظات (notes)" value={study.profitModel.notes ?? ""} onChange={(v) => set("profitModel", { ...study.profitModel, notes: v })} rows={2} />
              </div>
            </div>
          </Section>
        )}

        {activeSection === "businessModel" && (
          <Section title="نموذج العمل (Business Model)">
            <div className="space-y-4">
              <TextArea label="نموذج العرض (offerModel)" value={study.businessModel.offerModel ?? ""} onChange={(v) => set("businessModel", { ...study.businessModel, offerModel: v })} rows={1} />
              <TextArea label="عرض القيمة (valueProposition)" value={study.businessModel.valueProposition ?? ""} onChange={(v) => set("businessModel", { ...study.businessModel, valueProposition: v })} rows={1} />
              <TextArea label="استراتيجية العميل المتكرر (repeatClientStrategy)" value={study.businessModel.repeatClientStrategy ?? ""} onChange={(v) => set("businessModel", { ...study.businessModel, repeatClientStrategy: v })} rows={1} />
            </div>
          </Section>
        )}

        {activeSection === "firstClientAcquisition" && (
          <Section title="الحصول على أول عميل (First Client Acquisition)">
            <RepeatableRows
              items={study.firstClientAcquisition}
              onChange={(v) => set("firstClientAcquisition", v)}
              empty={(): StudyClientAcquisition => ({ channel: "" })}
              addLabel="إضافة قناة اكتساب"
              render={(item, update, remove) => (
                <RowCard onRemove={remove}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <TextInput label="القناة (channel) *" value={item.channel} onChange={(v) => update({ ...item, channel: v })} />
                    <SelectInput
                      label="الصعوبة (difficulty)"
                      value={item.difficulty}
                      options={DIFFICULTY_OPTIONS}
                      onChange={(v) => update({ ...item, difficulty: v })}
                      render={(v) => v}
                    />
                    <NumberInput label="عدد أهداف التواصل (outreachTargetCount)" value={item.outreachTargetCount} onChange={(v) => update({ ...item, outreachTargetCount: v })} />
                    <TextInput label="نص الرسالة (messageScript)" value={item.messageScript ?? ""} onChange={(v) => update({ ...item, messageScript: v })} />
                    <div className="sm:col-span-2">
                      <TextArea label="نص المتابعة (followUpScript)" value={item.followUpScript ?? ""} onChange={(v) => update({ ...item, followUpScript: v })} rows={1} />
                    </div>
                  </div>
                </RowCard>
              )}
            />
          </Section>
        )}

        {activeSection === "workflow" && (
          <Section title="سير العمل (Workflow)" hint="المرحلة من الطلب إلى التسليم">
            <RepeatableRows
              items={study.workflow}
              onChange={(v) => set("workflow", v)}
              empty={(): StudyWorkflowStep => ({ stage: "", detail: "" })}
              addLabel="إضافة مرحلة"
              render={(item, update, remove) => (
                <RowCard onRemove={remove}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <TextInput label="المرحلة (stage) *" value={item.stage} onChange={(v) => update({ ...item, stage: v })} />
                    <TextInput label="التسليم (deliverable)" value={item.deliverable ?? ""} onChange={(v) => update({ ...item, deliverable: v })} />
                    <div className="sm:col-span-2">
                      <TextArea label="التفاصيل (detail) *" value={item.detail} onChange={(v) => update({ ...item, detail: v })} rows={1} />
                    </div>
                  </div>
                </RowCard>
              )}
            />
          </Section>
        )}

        {activeSection === "marketCompetition" && (
          <Section title="المنافسة (Competition)">
            <RepeatableRows
              items={study.marketCompetition}
              onChange={(v) => set("marketCompetition", v)}
              empty={(): StudyCompetition => ({ segment: "" })}
              addLabel="إضافة شريحة منافسة"
              render={(item, update, remove) => (
                <RowCard onRemove={remove}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <TextInput label="الشريحة (segment) *" value={item.segment} onChange={(v) => update({ ...item, segment: v })} />
                    <SelectInput
                      label="الشدة (intensity)"
                      value={item.intensity}
                      options={DIFFICULTY_OPTIONS}
                      onChange={(v) => update({ ...item, intensity: v })}
                      render={(v) => v}
                    />
                    <TextInput label="التمركز (positioning)" value={item.positioning ?? ""} onChange={(v) => update({ ...item, positioning: v })} />
                    <div className="sm:col-span-2">
                      <TextArea label="ملاحظات (notes)" value={item.notes ?? ""} onChange={(v) => update({ ...item, notes: v })} rows={1} />
                    </div>
                  </div>
                </RowCard>
              )}
            />
          </Section>
        )}

        {activeSection === "commonMistakes" && (
          <Section title="الأخطاء الشائعة (Common Mistakes)">
            <RepeatableRows
              items={study.commonMistakes}
              onChange={(v) => set("commonMistakes", v)}
              empty={(): StudyMistake => ({ mistake: "" })}
              addLabel="إضافة خطأ"
              render={(item, update, remove) => (
                <RowCard onRemove={remove}>
                  <TextInput label="الخطأ (mistake) *" value={item.mistake} onChange={(v) => update({ ...item, mistake: v })} />
                  <TextArea label="الوقاية (prevention)" value={item.prevention ?? ""} onChange={(v) => update({ ...item, prevention: v })} rows={1} />
                </RowCard>
              )}
            />
          </Section>
        )}

        {activeSection === "redFlags" && (
          <Section title="العلامات الحمراء (Red Flags)" hint="تحذيرات للعميل قبل الانطلاق">
            <RepeatableRows
              items={study.redFlags}
              onChange={(v) => set("redFlags", v)}
              empty={(): StudyRedFlag => ({ flag: "" })}
              addLabel="إضافة علامة حمراء"
              render={(item, update, remove) => (
                <RowCard onRemove={remove}>
                  <TextInput label="العلامة (flag) *" value={item.flag} onChange={(v) => update({ ...item, flag: v })} />
                  <TextArea label="لماذا (why)" value={item.why ?? ""} onChange={(v) => update({ ...item, why: v })} rows={1} />
                  <TextArea label="الحماية (protection)" value={item.protection ?? ""} onChange={(v) => update({ ...item, protection: v })} rows={1} />
                </RowCard>
              )}
            />
          </Section>
        )}

        {activeSection === "marketing" && (
          <Section title="التسويق (Marketing)">
            <TagsInput label="القنوات (channels)" value={study.marketing.channels} onChange={(v) => set("marketing", { ...study.marketing, channels: v })} />
            <TagsInput label="أنواع المحتوى (contentTypes)" value={study.marketing.contentTypes} onChange={(v) => set("marketing", { ...study.marketing, contentTypes: v })} />
            <TagsInput label="مؤشرات القياس (kpis)" value={study.marketing.kpis} onChange={(v) => set("marketing", { ...study.marketing, kpis: v })} />
            <TextInput label="دعوة للفعل (cta)" value={study.marketing.cta ?? ""} onChange={(v) => set("marketing", { ...study.marketing, cta: v })} />
          </Section>
        )}

        {activeSection === "plan30Days" && (
          <Section title="خطة 30 يوم (30-Day Plan)" hint="كل أسبوع بمهام ومحتوى وتواصل">
            <RepeatableRows
              items={study.plan30Days}
              onChange={(v) => set("plan30Days", v)}
              empty={(): StudyPlanWeekBlock => ({ week: 1, tasks: [] })}
              addLabel="إضافة أسبوع"
              render={(item, update, remove) => (
                <RowCard onRemove={remove}>
                  <SelectInput
                    label="الأسبوع (week) *"
                    value={item.week}
                    options={WEEK_OPTIONS}
                    onChange={(v) => update({ ...item, week: v ?? 1 })}
                    render={(v) => `الأسبوع ${v}`}
                  />
                  <TagsInput label="المهام (tasks)" value={item.tasks} onChange={(v) => update({ ...item, tasks: v })} />
                  <TagsInput label="أنشطة التواصل (outreach)" value={item.outreach ?? []} onChange={(v) => update({ ...item, outreach: v })} />
                  <TagsInput label="المحتوى (content)" value={item.content ?? []} onChange={(v) => update({ ...item, content: v })} />
                  <TagsInput label="مؤشرات (kpis)" value={item.kpis ?? []} onChange={(v) => update({ ...item, kpis: v })} />
                </RowCard>
              )}
            />
          </Section>
        )}

        {activeSection === "growthPath" && (
          <Section title="مسار النمو (Growth)">
            <RepeatableRows
              items={study.growthPath}
              onChange={(v) => set("growthPath", v)}
              empty={(): StudyGrowthStep => ({ from: "", to: "", tactic: "" })}
              addLabel="إضافة خطوة نمو"
              render={(item, update, remove) => (
                <RowCard onRemove={remove}>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <TextInput label="من (from)" value={item.from} onChange={(v) => update({ ...item, from: v })} />
                    <TextInput label="إلى (to)" value={item.to} onChange={(v) => update({ ...item, to: v })} />
                    <TextInput label="الأسلوب (tactic)" value={item.tactic} onChange={(v) => update({ ...item, tactic: v })} />
                  </div>
                </RowCard>
              )}
            />
          </Section>
        )}

        {activeSection === "legalDz" && (
          <Section title="القانون الجزائري (Legal Algeria)" hint="لا تدخل معلومات قانونية نهائية دون إعادة تحقق.">
            <div className="grid sm:grid-cols-2 gap-4">
              <TextArea label="Auto-entrepreneur" value={study.legalDz.autoEntrepreneur ?? ""} onChange={(v) => set("legalDz", { ...study.legalDz, autoEntrepreneur: v })} rows={1} />
              <TextArea label="IFU" value={study.legalDz.ifu ?? ""} onChange={(v) => set("legalDz", { ...study.legalDz, ifu: v })} rows={1} />
              <TextArea label="CASNOS" value={study.legalDz.casnos ?? ""} onChange={(v) => set("legalDz", { ...study.legalDz, casnos: v })} rows={1} />
              <TextArea label="TVA" value={study.legalDz.tva ?? ""} onChange={(v) => set("legalDz", { ...study.legalDz, tva: v })} rows={1} />
              <TextArea label="Crypto" value={study.legalDz.crypto ?? ""} onChange={(v) => set("legalDz", { ...study.legalDz, crypto: v })} rows={1} />
              <div className="sm:col-span-2">
                <TextArea label="ملاحظات (notes)" value={study.legalDz.notes ?? ""} onChange={(v) => set("legalDz", { ...study.legalDz, notes: v })} rows={2} />
              </div>
              <BoolInput label="يتطلب إعادة تحقق (needsValidation)" value={study.legalDz.needsValidation} onChange={(v) => set("legalDz", { ...study.legalDz, needsValidation: v })} />
            </div>
          </Section>
        )}

        {activeSection === "caseStudy" && (
          <Section title="دراسة الحالة (Case Study)">
            <div className="space-y-4">
              <TextArea label="السيناريو (scenario) *" value={study.caseStudy.scenario} onChange={(v) => set("caseStudy", { ...study.caseStudy, scenario: v })} rows={2} />
              <TagsInput label="المدخلات (inputs)" value={study.caseStudy.inputs ?? []} onChange={(v) => set("caseStudy", { ...study.caseStudy, inputs: v })} />
              <TextArea label="النتيجة (outcome)" value={study.caseStudy.outcome ?? ""} onChange={(v) => set("caseStudy", { ...study.caseStudy, outcome: v })} rows={2} />
              <p className="text-[11px] text-slate-400">isSample ثابت على true في هذه المرحلة.</p>
            </div>
          </Section>
        )}

        {activeSection === "sources" && (
          <Section title="المصادر (Sources)">
            <RepeatableRows
              items={study.sources}
              onChange={(v) => set("sources", v)}
              empty={(): StudySource => ({ title: "", sourceType: "REFERENCE" })}
              addLabel="إضافة مصدر"
              render={(item, update, remove) => (
                <RowCard onRemove={remove}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <TextInput label="العنوان (title) *" value={item.title} onChange={(v) => update({ ...item, title: v })} />
                    <SelectInput
                      label="النوع (sourceType)"
                      value={item.sourceType}
                      options={SOURCE_TYPE_OPTIONS}
                      onChange={(v) => update({ ...item, sourceType: v ?? "REFERENCE" })}
                      render={(v) => v}
                    />
                    <TextInput label="الرابط (url)" value={item.url ?? ""} onChange={(v) => update({ ...item, url: v })} />
                    <TextInput label="تاريخ التحقق (verifiedAt)" value={item.verifiedAt ?? ""} onChange={(v) => update({ ...item, verifiedAt: v })} />
                    <div className="sm:col-span-2">
                      <TextArea label="ملاحظات (notes)" value={item.notes ?? ""} onChange={(v) => update({ ...item, notes: v })} rows={1} />
                    </div>
                  </div>
                </RowCard>
              )}
            />
          </Section>
        )}

        {activeSection === "meta" && (
          <Section title="البيانات الوصفية / المراجعة (Meta / Review)">
            <div className="grid sm:grid-cols-3 gap-4">
              <NumberInput label="نقاط القيمة المدفوعة (paidValueScore 0-10)" value={study.meta.paidValueScore} onChange={(v) => set("meta", { ...study.meta, paidValueScore: v })} />
              <TextInput label="آخر تحقق (lastVerified)" value={study.meta.lastVerified ?? ""} onChange={(v) => set("meta", { ...study.meta, lastVerified: v })} />
              <TextInput label="إصدار البحث (researchVersion)" value={study.meta.researchVersion ?? ""} onChange={(v) => set("meta", { ...study.meta, researchVersion: v })} />
              <SelectInput
                label="نوع الدراسة (studyKind)"
                value={study.meta.studyKind ?? "no_capital"}
                options={["no_capital", "capital"] as const}
                onChange={(v) => set("meta", { ...study.meta, studyKind: v ?? "no_capital" })}
                render={(v) => (v === "capital" ? "Capital (رأس مال)" : "No-capital (بدون رأس مال)")}
              />
            </div>
          </Section>
        )}
      </div>

      {/* Save bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 flex items-center justify-end gap-3 sticky bottom-4">
        <button
          type="button"
          onClick={() => onSave(study)}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ الدراسة
        </button>
      </div>
    </div>
  );
}