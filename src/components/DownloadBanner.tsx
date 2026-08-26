"use client";

import { useEffect, useState } from "react";
import { Smartphone, Download } from "lucide-react";
import { isCapacitor } from "@/lib/capacitor";

export default function DownloadBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!isCapacitor());
  }, []);

  if (!visible) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center gap-8 border border-indigo-500/20 shadow-xl">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <Smartphone className="w-10 h-10 text-indigo-300" />
        </div>
        <div className="flex-1 text-center sm:text-right space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold">
            حمّل تطبيق NABDA DZ
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            استمتع بأدوات NABDA ومحتواه مباشرة من هاتفك.
          </p>
          <p className="text-xs text-slate-400">
            نظام Android 7.0 فأكثر &middot; حجم التحميل ~5.8 MB
          </p>
        </div>
        <a
          href="/downloads/nabda-dz.apk"
          download="nabda-dz.apk"
          className="shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white font-extrabold text-base shadow-xl shadow-indigo-900/30 hover:shadow-indigo-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Download className="w-5 h-5" />
          <span>تحميل APK</span>
        </a>
      </div>
    </section>
  );
}
