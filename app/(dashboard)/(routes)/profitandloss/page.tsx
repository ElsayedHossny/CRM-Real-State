"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateCategory() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("برجاء إدخال اسم القسم أولاً");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // ─── الوضع الحالي (STATIC / LOCALSTORAGE) ───
      // بنجيب الأقسام القديمة المتخزنة لو موجودة، ونضيف عليها الجديد
      const localCats = localStorage.getItem("custom_categories");
      const currentCats = localCats ? JSON.parse(localCats) : [];

      const newCategory = {
        _id: `local_${Date.now()}`,
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
      };

      currentCats.push(newCategory);
      localStorage.setItem("custom_categories", JSON.stringify(currentCats));

      // ─── مكان ربط الـ API مستقبلاً ───
      /*
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", "https://placehold.co/600x400/png?text=Category"); // صوره وهميه لإرضاء الـ API
      await propertyService.createCategory(formData);
      */

      alert("تم إضافة القسم الجديد بنجاح!");
      router.push("/products");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50/50 p-4 md:p-8 flex items-center justify-center"
      dir="rtl"
    >
      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
        {/* الهيدر */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-neutral-950">
                إضافة قسم جديد
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                الاسم فقط بدون الحاجة لرفع صور
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="p-2 hover:bg-slate-50 border border-slate-150 text-slate-500 hover:text-neutral-900 rounded-xl transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>رجوع للعقارات</span>
          </Link>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-800 block">
              اسم القسم الجديد
            </label>
            <input
              type="text"
              placeholder="مثال: تجاري، إداري، أراضي، قصور..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 h-11 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>حفظ وإنشاء القسم</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
