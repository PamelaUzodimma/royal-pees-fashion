'use client';

import { ProductWithStock } from '@/types';
import { ProductCard } from './ProductCard';

export function ProductGrid({
  products,
  emptyLabel = 'No design items found in this category.',
  onOpenDetail,
}: {
  products: ProductWithStock[];
  emptyLabel?: string;
  onOpenDetail: (productId: string) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="py-10 text-center text-muted">📭 {emptyLabel}</div>
    );
  }

  const bySubCategory = new Map<string, ProductWithStock[]>();
  for (const p of products) {
    const list = bySubCategory.get(p.subCategoryName) ?? [];
    list.push(p);
    bySubCategory.set(p.subCategoryName, list);
  }

  return (
    <>
      {Array.from(bySubCategory.entries()).map(([subName, items]) => (
        <section key={subName} className="mb-2">
          <div className="mb-3.5 mt-6 flex items-center gap-2.5 first:mt-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
              {subName}
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} onOpenDetail={onOpenDetail} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
