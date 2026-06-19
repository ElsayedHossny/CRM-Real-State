import React from "react";
import { Property } from "@/types/properites";
import PropertyCard from "./PropertyCard";
import { MapPin, Bath, BedDouble, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PropertyListProps {
  properties: Property[];
  viewMode: "grid" | "list";
}

export default function PropertyList({
  properties,
  viewMode,
}: PropertyListProps) {
  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من مسح هذا العقار؟")) {
      console.log(`Deleting property with id: ${id}`);
    }
  };

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10">
        <p className="text-neutral-400 text-lg">لا توجد نتائج</p>
      </div>
    );
  }

  // ─── وضع الجدول المتجاوب (RESPONSIVE LIST VIEW) ───
  if (viewMode === "list") {
    return (
      /* التعديل هنا: أضفنا سحب أفقي مخصص للموبايل مع إخفاء الـ scrollbar الافتراضي ليكون شكله أنيق */
      <div
        dir="rtl"
        className="w-full overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm scrollbar-thin scrollbar-thumb-slate-200"
      >
        {/* min-w-[800px] تضمن أن الجدول يحتفظ بهيبته وشكله المفرود على الموبايل ويقبل السحب */}
        <table className="w-full min-w-[800px] text-right border-collapse text-sm layout-fixed">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-neutral-500 font-medium">
              <th className="p-4 pr-6 w-[30%]">العقار</th>
              <th className="p-4 w-[20%]">الموقع</th>
              <th className="p-4 w-[15%]">المساحة</th>
              <th className="p-4 w-[15%]">الغرف / الحمامات</th>
              <th className="p-4 w-[12%]">السعر</th>
              <th className="p-4 pl-6 w-[8%] text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-slate-50/50 transition-colors text-neutral-800"
              >
                {/* العقار */}
                <td className="p-4 pr-6 flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-neutral-900 text-sm truncate">
                      {p.title}
                    </span>
                    <span className="text-xs text-neutral-400 truncate max-w-[180px]">
                      {p.description}
                    </span>
                  </div>
                </td>

                {/* الموقع */}
                <td className="p-4 text-neutral-600">
                  <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full text-xs font-medium">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    {p.location}
                  </span>
                </td>

                {/* المساحة */}
                <td className="p-4 text-emerald-700 font-semibold">
                  {p.area} متر
                </td>

                {/* الغرف */}
                <td className="p-4 text-neutral-500 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-neutral-400" />{" "}
                      {p.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-neutral-400" />{" "}
                      {p.baths}
                    </span>
                  </div>
                </td>

                {/* السعر */}
                <td className="p-4 font-bold text-neutral-900">
                  {p.price.toLocaleString()}{" "}
                  <span className="text-xs font-normal text-neutral-400">
                    ج.م
                  </span>
                </td>

                {/* الإجراءات */}
                <td className="p-4 pl-6 text-left">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`products/${p.id}`}
                      className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-neutral-900 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`products/update/${p.id}`}
                      className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-neutral-900 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ─── وضع الشبكة المتجاوب تلقائياً (GRID VIEW) ───
  return (
    /* أضفنا كلاسات التجاوب للـ grid لتبدأ من عمود واحد للموبايل وتزيد تدريجياً حسب حجم الشاشة */
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 md:p-5">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
