"use client";

import { formatPrice } from "@/data/catalog";
import {
  AdminButton,
  AdminTable,
  EmptyState,
  PageHeader,
  Panel,
  StatusBadge,
  TableWrap,
  Td,
  Th,
} from "@/components/admin/ui";
import { useAdminStore } from "@/lib/admin/store";

export default function AdminDealsPage() {
  const { data, ready, upsertProduct } = useAdminStore();

  if (!ready) return null;

  const deals = data.products.filter((product) => product.deal);
  const candidates = data.products.filter((product) => !product.deal);

  return (
    <div>
      <PageHeader
        title="Hot Deals"
        description="Toggle limited-time offers shown in Today’s Hot Deals."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-ink">
              Active deals ({deals.length})
            </h2>
          </div>
          <TableWrap>
            <AdminTable>
              <thead>
                <tr>
                  <Th>Product</Th>
                  <Th>Price</Th>
                  <Th>Stock</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {deals.map((product) => (
                  <tr key={product.id}>
                    <Td className="font-semibold">{product.name}</Td>
                    <Td>
                      <div>{formatPrice(product.price)}</div>
                      {product.originalPrice && (
                        <div className="text-xs text-ink-soft line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </Td>
                    <Td>
                      <StatusBadge status={product.stock} />
                    </Td>
                    <Td>
                      <AdminButton
                        variant="secondary"
                        type="button"
                        onClick={() =>
                          upsertProduct({ ...product, deal: false })
                        }
                      >
                        Remove
                      </AdminButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          </TableWrap>
          {deals.length === 0 && (
            <EmptyState message="No active deals. Promote a product below." />
          )}
        </Panel>

        <Panel>
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-ink">
              Promote to deal
            </h2>
          </div>
          <TableWrap>
            <AdminTable>
              <thead>
                <tr>
                  <Th>Product</Th>
                  <Th>Price</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((product) => (
                  <tr key={product.id}>
                    <Td className="font-semibold">{product.name}</Td>
                    <Td>{formatPrice(product.price)}</Td>
                    <Td>
                      <AdminButton
                        type="button"
                        onClick={() =>
                          upsertProduct({ ...product, deal: true })
                        }
                      >
                        Make deal
                      </AdminButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          </TableWrap>
          {candidates.length === 0 && (
            <EmptyState message="All products are already marked as deals." />
          )}
        </Panel>
      </div>
    </div>
  );
}
