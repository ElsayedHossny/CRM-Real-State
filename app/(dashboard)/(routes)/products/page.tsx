"use client";

import React, { useMemo, useState } from "react";
import PropertyList from "@/components/produsts/PropertyList";
import { properties } from "@/data/properites";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  PropertyTypeFilters,
  PropertyTypeFilter,
  AreaFilter,
} from "@/components/produsts/PropertyFilters";

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<PropertyTypeFilter>("all");
  const [activeAreaFilter, setActiveAreaFilter] = useState<AreaFilter>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const itemsPerPage = 4;

  const counts = useMemo(() => {
    return {
      all: properties.length,
      apartment: properties.filter((p) => p.type === "apartment").length,
      villa: properties.filter((p) => p.type === "villa").length,
      chalet: properties.filter((p) => p.type === "chalet").length,
    };
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchType = activeFilter === "all" || p.type === activeFilter;

      let matchArea = true;
      if (activeAreaFilter === "small") matchArea = p.area < 100;
      else if (activeAreaFilter === "medium")
        matchArea = p.area >= 100 && p.area <= 250;
      else if (activeAreaFilter === "large")
        matchArea = p.area > 250 && p.area <= 400;
      else if (activeAreaFilter === "xlarge") matchArea = p.area > 400;

      return matchType && matchArea;
    });
  }, [activeFilter, activeAreaFilter]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredProperties.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleFilterChange = (type: PropertyTypeFilter) => {
    setActiveFilter(type);
    setCurrentPage(1);
  };

  const handleAreaFilterChange = (area: AreaFilter) => {
    setActiveAreaFilter(area);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      {/* الفلاتر المحدثة التي تحتوي على كل عناصر التحكم وزر الإضافة */}
      <PropertyTypeFilters
        active={activeFilter}
        onChange={handleFilterChange}
        counts={counts}
        activeArea={activeAreaFilter}
        onAreaChange={handleAreaFilterChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* منطقة عرض البيانات */}
      <div className="w-full">
        {filteredProperties.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            لا توجد عقارات تطابق خيارات التصفية الحالية
          </p>
        ) : (
          <PropertyList properties={currentData} viewMode={viewMode} />
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => goToPage(currentPage - 1)}
                className="cursor-pointer"
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => goToPage(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => goToPage(currentPage + 1)}
                className="cursor-pointer"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
