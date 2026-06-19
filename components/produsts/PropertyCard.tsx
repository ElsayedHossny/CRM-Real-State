import {
  MapPin,
  Bath,
  BedDouble,
  Maximize2,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { Property } from "@/types/properites";
import Link from "next/link";

export default function PropertyCard({ property }: { property: Property }) {
  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من مسح هذا العقار؟")) {
      console.log(`Deleting property with id: ${id}`);
    }
  };

  return (
    <div
      dir="rtl"
      className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        <div className="relative h-52 w-full">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover"
          />
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 text-neutral-800 shadow-sm">
            <MapPin className="w-3 h-3 text-emerald-600" />
            {property.location}
          </span>
        </div>

        <div className="p-4 pb-2">
          <div className="flex items-center gap-4 text-xs text-neutral-500 mb-2">
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
              {property.area} متر
            </span>
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5 text-neutral-400" />
              {property.beds}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-neutral-400" />
              {property.baths}
            </span>
          </div>

          <h3 className="font-semibold text-base text-neutral-900">
            {property.title}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 min-h-[32px]">
            {property.description}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 mt-2">
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-xs text-neutral-400 font-medium">السعر</p>
            <p className="font-bold text-sm text-neutral-900">
              {property.price.toLocaleString()}{" "}
              <span className="text-xs font-normal text-neutral-500">ج.م</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`products/${property.id}`}
              className="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl transition-colors border border-slate-100"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <Link
              href={`products/update/${property.id}`}
              className="p-2 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-600 rounded-xl transition-colors border border-slate-100"
            >
              <Pencil className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => handleDelete(property.id)}
              className="p-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl transition-colors border border-slate-100 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
