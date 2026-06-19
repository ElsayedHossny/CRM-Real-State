"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Property } from "@/types/properites";
import {
  ArrowRight,
  Image as ImageIcon,
  Loader2,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";

const numericFields = ["price", "area", "baths", "beds"];

// الأقسام الافتراضية للفرونت إند لحين جلبها من الـ API
const defaultCategories = [
  { _id: "1", name: "شقق", slug: "apartment" },
  { _id: "2", name: "فلل", slug: "villa" },
  { _id: "3", name: "شاليهات", slug: "chalet" },
];

export default function PropertyForm({ property }: { property: Property }) {
  const [formData, setFormData] = useState<Property>(property);

  // الـ States الخاصة بالملفات والتحميل والأقسام
  const [categories, setCategories] = useState(defaultCategories);
  const [imageFile, setImageFile] = useState<File | null>(null);
  // نضع الصورة الحالية القادمة من العقار كمعاينة افتراضية أولية
  const [imagePreview, setImagePreview] = useState<string | null>(
    property.image || null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // جلب الأقسام المتوفرة ليعرضها في قائمة "النوع"
  useEffect(() => {
    const localCats = localStorage.getItem("custom_categories");
    if (localCats) {
      const parsed = JSON.parse(localCats);
      setCategories([...defaultCategories, ...parsed]);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  // معالجة تغيير أو تحديث الصورة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // تحديث المعاينة الفورية
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    if (!formData.title || !formData.type || !formData.location) {
      setError("برجاء ملء الحقول الأساسية (العنوان، الموقع، ونوع العقار)");
      setIsSaving(false);
      return;
    }

    try {
      // ─── تجهيز الـ FormData لإرسال البيانات والتعديلات للسيرفر ───
      const dataToSend = new FormData();
      dataToSend.append("id", String(formData.id));
      dataToSend.append("title", formData.title);
      dataToSend.append("location", formData.location);
      dataToSend.append("type", formData.type);
      dataToSend.append("price", String(formData.price));
      dataToSend.append("area", String(formData.area));
      dataToSend.append("baths", String(formData.baths));
      dataToSend.append("beds", String(formData.beds));
      dataToSend.append("bookType", formData.bookType);
      dataToSend.append("description", formData.description);

      if (imageFile) {
        dataToSend.append("image", imageFile); // نرسل ملف الصورة الجديد فقط في حال تم تحديثه
      }

      // ─── كود الـ API الجاهز للتشغيل عند ربط الباك إند ───
      /*
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${formData.id}`, {
        method: "PUT", // أو POST حسب رغبة الباك إند لتعديل البيانات مع FormData
        body: dataToSend,
      });
      if (!res.ok) throw new Error("فشل تحديث بيانات العقار في السيرفر");
      */

      console.log("تم تحديث البيانات وجاهزة للإرسال:", formData, imageFile);

      alert("تم حفظ التعديلات بنجاح!");
      router.push("/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "حصل خطأ أثناء الحفظ، حاول مرة أخرى");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mt-4 p-6 md:p-8 space-y-6 bg-white border border-slate-100 rounded-2xl shadow-sm"
      dir="rtl"
    >
      {/* الهيدر وزر العودة للهيكلية المتناسقة */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            تعديل بيانات العقار
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تحديث تفاصيل العقار الحالي، ستظهر التغييرات فوراً في القوائم
            الرئيسية.
          </p>
        </div>

        <Link
          href="/products"
          className="px-3 py-2 hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>إلغاء والرجوع</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl border border-red-100 font-medium text-center">
          {error}
        </div>
      )}

      {/* صف: العنوان والموقع لعرض الشاشة الكاملة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="العنوان (اسم الإعلان البديل)">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="عنوان العقار"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
          />
        </Field>

        <Field label="الموقع الحالي">
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="الموقع"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
          />
        </Field>
      </div>

      {/* صف: نوع العقار ونوع الحجز */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="نوع العقار (التصنيف الديناميكي)">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all cursor-pointer"
          >
            <option value="">اختر النوع..</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="نوع الحجز">
          <select
            name="bookType"
            value={formData.bookType}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all cursor-pointer"
          >
            <option value="">اختر المدة..</option>
            <option value="Daily">يومي (Daily)</option>
            <option value="Weekly">أسبوعي (Weekly)</option>
            <option value="Monthly">شهري (Monthly)</option>
            <option value="Yearly">سنوي (Yearly)</option>
          </select>
        </Field>
      </div>

      {/* شبكة الأرقام الأربعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Field label="السعر (ج.م)">
          <input
            name="price"
            type="number"
            value={formData.price || ""}
            onChange={handleChange}
            placeholder="0"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
          />
        </Field>

        <Field label="المساحة (م²)">
          <input
            name="area"
            type="number"
            value={formData.area || ""}
            onChange={handleChange}
            placeholder="0"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
          />
        </Field>

        <Field label="الحمامات">
          <input
            name="baths"
            type="number"
            value={formData.baths || ""}
            onChange={handleChange}
            placeholder="0"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
          />
        </Field>

        <Field label="الغرف">
          <input
            name="beds"
            type="number"
            value={formData.beds || ""}
            onChange={handleChange}
            placeholder="0"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
          />
        </Field>
      </div>

      {/* حقل تحديث الصورة بلمسة عصرية عريضة */}
      <Field label="تحديث صورة العقار">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          <label className="sm:col-span-3 border-2 border-dashed border-slate-200 hover:border-green-600 bg-slate-50/50 hover:bg-white rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all h-28 text-center group">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSaving}
              className="hidden"
            />
            <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-green-600 transition-colors" />
            <span className="text-xs font-semibold text-slate-700">
              اضغط هنا لاستبدال صورة العقار الحالية
            </span>
            <span className="text-[10px] text-slate-400">
              اتركها فارغة إذا لم تكن ترغب بتغييرها
            </span>
          </label>

          {/* بوكس المعاينة الذكي للصورة المرفوعة حالياً أو السابقة */}
          <div className="border border-slate-100 bg-slate-50 rounded-xl h-28 overflow-hidden flex items-center justify-center relative shadow-inner">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Property Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-slate-400">
                <ImageIcon className="w-4 h-4" />
                <span className="text-[10px]">لا توجد صورة</span>
              </div>
            )}
          </div>
        </div>
      </Field>

      {/* الوصف */}
      <Field label="الوصف والملاحظات">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="تعديل تفاصيل الوصف المكمل للعقار.."
          rows={4}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all resize-none"
        />
      </Field>

      {/* أزرار الحفظ والإرسال المحدثة */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto sm:min-w-[180px] px-6 h-12 bg-green-700 hover:bg-green-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري حفظ التعديلات...</span>
            </>
          ) : (
            <span>حفظ وتحديث البيانات</span>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700">{label}</label>
      {children}
    </div>
  );
}
