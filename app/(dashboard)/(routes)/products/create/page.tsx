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

const numericFields = ["price", "area", "baths"];

const emptyProperty: Omit<Property, "id" | "image"> = {
  title: "",
  location: "",
  type: "", // بيشيل الـ slug أو اسم الـ category
  price: 0,
  area: 0,
  baths: 0,
  beds: "",
  bookType: "",
  areaRange: "",
  description: "",
};

// الأقسام الافتراضية للفرونت إند لحين الربط
const defaultCategories = [
  { _id: "1", name: "شقق", slug: "apartment" },
  { _id: "2", name: "فلل", slug: "villa" },
  { _id: "3", name: "شاليهات", slug: "chalet" },
];

export default function PropertyCreateForm() {
  const [formData, setFormData] =
    useState<Omit<Property, "id" | "image">>(emptyProperty);

  // الـ States الخاصة بالملفات والتحميل والأقسام
  const [categories, setCategories] = useState(defaultCategories);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  // معالجة اختيار ملف الصورة وعمل معاينة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // رابط مؤقت للمعاينة البصرية
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    // التحقق من الحقول الأساسية
    if (!formData.title || !formData.type || !formData.location) {
      setError("برجاء ملء الحقول الأساسية (العنوان، الموقع، ونوع العقار)");
      setIsSaving(false);
      return;
    }

    try {
      // ─── تجهيز الـ FormData للـ API الحقيقية مستقبلاً ───
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("location", formData.location);
      dataToSend.append("type", formData.type);
      dataToSend.append("price", String(formData.price));
      dataToSend.append("area", String(formData.area));
      dataToSend.append("baths", String(formData.baths));
      dataToSend.append("beds", formData.beds);
      dataToSend.append("bookType", formData.bookType);
      dataToSend.append("description", formData.description);

      if (imageFile) {
        dataToSend.append("image", imageFile); // إرسال ملف الصورة الحقيقي هنا
      }

      // ─── كود الـ API الجاهز للتشغيل مستقبلاً ───
      /*
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/products", {
        method: "POST",
        body: dataToSend, // نرسل الـ FormData مباشرة دون Headers (المتصفح سيقوم بوضعها تلقائياً)
      });
      if (!res.ok) throw new Error("فشل إضافة العقار في السيرفر");
      */

      // محاكاة حفظ مؤقت في السيرفر حالياً
      console.log(
        "تم تجميع البيانات بنجاح وجاهزة للـ API:",
        formData,
        imageFile,
      );

      alert("تم إضافة العقار بنجاح!");
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
      className=" mt-6 mx-auto p-6 md:p-8 space-y-6 bg-white border border-slate-100 rounded-2xl shadow-sm"
      dir="rtl"
    >
      {/* هيدر الصفحة وأزرار الانتقال */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">إضافة عقار جديد</h2>
          <p className="text-xs text-slate-400 mt-1">
            أدخل بيانات العقار بدقة، وسيتم تحديث الفلاتر والأعداد تلقائياً.
          </p>
        </div>

        <Link
          href="/products"
          className="px-3 py-2 hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع للقائمة</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl border border-red-100 font-medium text-center animate-shake">
          {error}
        </div>
      )}

      {/* صف: العنوان والموقع */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="عنوان العقار (اسم الإعلان)">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="مثال: شقة مودرن مطلة على البحر"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
          />
        </Field>

        <Field label="الموقع المنطقي">
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="مثال: القاهرة، التجمع الخامس"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
          />
        </Field>
      </div>

      {/* صف: نوع العقار ونوع الحجز */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="نوع العقار (التصنيف)">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all cursor-pointer"
          >
            <option value="">اختر نوع العقار من هنا..</option>
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
            <option value="">اختر مدة الحجز..</option>
            <option value="Daily">يومي (Daily)</option>
            <option value="Weekly">أسبوعي (Weekly)</option>
            <option value="Monthly">شهري (Monthly)</option>
            <option value="Yearly">سنوي (Yearly)</option>
          </select>
        </Field>
      </div>

      {/* شبكة الأرقام الأربعة المتجاوبة */}
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

        <Field label="الغرف / الطابق">
          <input
            name="beds"
            value={formData.beds}
            onChange={handleChange}
            placeholder="مثال: 3 غرف"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
          />
        </Field>
      </div>

      {/* حقل رفع الصورة الجديد بالكامل مع الـ المعاينة البصرية */}
      <Field label="صورة العقار الرئيسية">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <label className="md:col-span-3 border-2 border-dashed border-slate-200 hover:border-green-600 bg-slate-50/50 hover:bg-white rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all h-28 text-center group">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSaving}
              className="hidden"
            />
            <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-green-600 transition-colors" />
            <span className="text-xs font-semibold text-slate-700">
              اضغط لرفع صورة العقار الفورية
            </span>
            <span className="text-[10px] text-slate-400">
              يدعم صيغ JPG, PNG, WEBP
            </span>
          </label>

          {/* بوكس المعاينة */}
          <div className="border border-slate-100 bg-slate-50 rounded-xl h-28 overflow-hidden flex items-center justify-center relative shadow-inner">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
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
      <Field label="الوصف والتفاصيل الإضافية">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="اكتب وصفاً تفصيلياً لعوامل جذب العقار والميزات الخاصة هنا.."
          rows={4}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all resize-none"
        />
      </Field>

      {/* زر الحفظ الأخضر المحاذي لأسفل */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full md:w-auto md:min-w-[160px] px-6 h-12 bg-green-700 hover:bg-green-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <span>إضافة العقار وحفظه</span>
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
