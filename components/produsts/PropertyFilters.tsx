"use client";

import { cn } from "@/lib/utils";
import {
  Building2,
  Home,
  Umbrella,
  LayoutGrid,
  List,
  ChevronDown,
  Plus,
} from "lucide-react";
import Link from "next/link";

export type PropertyTypeFilter = "all" | "apartment" | "villa" | "chalet";
export type AreaFilter = "all" | "small" | "medium" | "large" | "xlarge";

const filters: {
  id: PropertyTypeFilter;
  label: string;
  icon: typeof LayoutGrid;
}[] = [
  { id: "all", label: "الكل", icon: LayoutGrid },
  { id: "apartment", label: "شقق", icon: Building2 },
  { id: "villa", label: "فلل", icon: Home },
  { id: "chalet", label: "شاليهات", icon: Umbrella },
];

export const areaOptions = [
  { id: "all", label: "كل المساحات" },
  { id: "small", label: "أقل من 100 متر" },
  { id: "medium", label: "100 - 250 متر" },
  { id: "large", label: "250 - 400 متر" },
  { id: "xlarge", label: "أكبر من 400 متر" },
];

type Props = {
  active: PropertyTypeFilter;
  onChange: (type: PropertyTypeFilter) => void;
  counts: Record<PropertyTypeFilter, number>;

  // فلاتر المساحة والـ View Mode
  activeArea: AreaFilter;
  onAreaChange: (area: AreaFilter) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
};

export function PropertyTypeFilters({
  active,
  onChange,
  counts,
  activeArea,
  onAreaChange,
  viewMode,
  onViewModeChange,
}: Props) {
  return (
    <div
      dir="rtl"
      className="flex flex-wrap items-center justify-between gap-4 w-full border-b border-slate-100 pb-5"
    >
      {/* الجزء الأيمن: الأزرار الدائرية لتصفية النوع */}
      <div className="flex flex-wrap gap-2.5">
        {filters.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(id)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all cursor-pointer",
                isActive
                  ? "border-transparent bg-green-700 text-white shadow-sm"
                  : "border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              <span
                className={cn(
                  "flex h-[22px] w-[22px] items-center justify-center rounded-full text-xs font-medium",
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {counts[id] ?? 0}
              </span>
              <span className="font-medium">{label}</span>
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-white" : "text-muted-foreground",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* الجزء الأيسر: الـ View Toggle والـ Dropdowns وزر الإضافة متراصين في الآخر تماماً */}
      <div className="flex items-center flex-wrap sm:flex-nowrap gap-3">
        {/* 1. قائمة منسدلة: تصفية النوع */}
        <div className="relative min-w-[140px]">
          <select
            value={active}
            onChange={(e) => onChange(e.target.value as PropertyTypeFilter)}
            className="w-full appearance-none text-right rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm font-medium text-slate-800 outline-none transition-all hover:bg-slate-50 cursor-pointer h-10"
          >
            {filters.map((option) => (
              <option key={option.id} value={option.id}>
                {option.id === "all" ? "كل الحالات" : option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        </div>

        {/* 2. قائمة منسدلة: تصفية المساحة */}
        <div className="relative min-w-[140px]">
          <select
            value={activeArea}
            onChange={(e) => onAreaChange(e.target.value as AreaFilter)}
            className="w-full appearance-none text-right rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm font-medium text-slate-800 outline-none transition-all hover:bg-slate-50 cursor-pointer h-10"
          >
            {areaOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.id === "all" ? "كل المخزون" : option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        </div>

        {/* 3. الـ View Toggle المحدث (مطابق تماماً لترتيب أيقونات الصورة الخاصة بك) */}
        <div className="flex items-center border border-slate-200 bg-white p-1 rounded-xl h-10">
          {/* زر عرض القائمة List (على اليمين في الترتيب البصري داخل الـ container) */}
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={cn(
              "p-1.5 rounded-lg transition-all cursor-pointer",
              viewMode === "list"
                ? "bg-green-700 text-white"
                : "text-slate-400 hover:text-slate-600",
            )}
          >
            <List className="h-4 w-4" />
          </button>

          {/* زر عرض الشبكة Grid (على اليسار في الترتيب البصري داخل الـ container) */}
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-1.5 rounded-lg transition-all cursor-pointer",
              viewMode === "grid"
                ? "bg-green-700 text-white"
                : "text-slate-400 hover:text-slate-600",
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>

        {/* 4. زر إضافة عقار جديد مدمج ومحاذي بارتفاع h-10 */}
        <Link
          href="/products/create"
          className="h-10 px-4 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>اضافه عقار جديد</span>
        </Link>
      </div>
    </div>
  );
}
