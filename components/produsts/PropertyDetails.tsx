"use client";
import { properties } from "@/data/properites";
import {
  ArrowRight,
  Bath,
  Bed,
  Calendar,
  CheckCircle2,
  MapPin,
  Maximize2,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PropertyDetailsPage() {
  const { productID } = useParams();
  // replace by API
  const property = properties.find((item) => item.id === Number(productID));

  if (!property) {
    return (
      <div className="p-10 text-center text-gray-500">Property not found</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8" dir="rtl">
      {/* زر العودة العلوي */}
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="px-3 py-2 hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-neutral-900 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع للعقارات</span>
        </Link>
      </div>

      {/* منطقة الصورة الرئيسية العريضة الفاخرة */}
      <div className="relative w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-md group">
        <Image
          src={
            property.image ||
            "https://placehold.co/1200x600/png?text=Property+Image"
          }
          alt={property.title}
          fill
          priority
          className="object-cover group-hover:scale-102 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* تفاصيل العقار (توزيع الأعمدة المتجاوب) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* الجزء الأيمن العريض: التفاصيل والوصف */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-1.5 text-slate-500 text-sm">
              <MapPin className="w-4 h-4 text-green-700 shrink-0" />
              <span>{property.location}</span>
            </div>
          </div>

          {/* البادجات والأيقونات التوضيحية لسمات العقار */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <span className="bg-emerald-50 text-emerald-700 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {property.bookType || "غير محدد"}
            </span>

            <span className="bg-slate-50 border border-slate-100 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              {property.area} م²
            </span>

            <span className="bg-slate-50 border border-slate-100 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              {property.baths} حمام
            </span>

            <span className="bg-slate-50 border border-slate-100 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              الغرف: {property.beds}
            </span>
          </div>

          <hr className="border-slate-100" />

          {/* تفاصيل الوصف المكتوب */}
          <div className="space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900">الوصف التفصيلي</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {property.description ||
                "لا يوجد وصف إضافي متوفر لهذا العقار حالياً."}
            </p>
          </div>
        </div>

        {/* الكارت الأيسر الجانبي: تفاصيل السعر والحجز الفوري */}
        <div className="w-full">
          <div className="border border-slate-100 rounded-2xl p-6 bg-white shadow-sm h-fit sticky top-6 space-y-5">
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">
                السعر المطلوب
              </span>
              <div className="flex items-baseline gap-1 text-green-700">
                <span className="text-3xl font-black">
                  {property.price?.toLocaleString()}
                </span>
                <span className="text-xs font-bold">جنيه مصري</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                الدفع لكل {property.bookType || "فترة حجز"}
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* زر الحجز بلون مشروعك الموحد */}
            <div className="space-y-2">
              <button
                onClick={() =>
                  alert(`تم بدء إجراءات حجز العقار: ${property.title}`)
                }
                className="w-full bg-green-700 text-white py-3 rounded-xl text-sm font-bold hover:bg-green-800 shadow-md shadow-green-700/10 transition-colors cursor-pointer text-center block"
              >
                احجز العقار الآن
              </button>
            </div>

            {/* ميزات توضيحية بصرية مريحة للعين */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تأكيد فوري للبيانات</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>مراجعة وتدقيق معتمد</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>عقار موثق بالكامل</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
