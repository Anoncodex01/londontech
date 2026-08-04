"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import {
  AdminButton,
  AdminTable,
  EmptyState,
  Field,
  Modal,
  PageHeader,
  Panel,
  StatusBadge,
  TableWrap,
  Td,
  TextInput,
  TextSelect,
  TextTextarea,
  Th,
} from "@/components/admin/ui";
import { useAdminStore } from "@/lib/admin/store";
import type { AdminReview } from "@/lib/admin/types";
import { formatDate, uid } from "@/lib/admin/utils";

const blank = (): AdminReview => ({
  id: "",
  name: "",
  city: "",
  rating: 5,
  text: "",
  productName: "",
  status: "pending",
  createdAt: new Date().toISOString(),
});

export default function AdminReviewsPage() {
  const { data, ready, upsertReview, deleteReview } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AdminReview>(blank());

  if (!ready) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    upsertReview({
      ...form,
      id: form.id || uid("REV"),
      rating: Number(form.rating) || 5,
    });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Reviews"
        description="Moderate customer reviews before they appear on the storefront."
        actions={
          <AdminButton
            type="button"
            onClick={() => {
              setForm({
                ...blank(),
                productName: data.products[0]?.name || "",
              });
              setOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add review
          </AdminButton>
        }
      />

      <Panel>
        <TableWrap>
          <AdminTable>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>Product</Th>
                <Th>Rating</Th>
                <Th>Review</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.reviews.map((review) => (
                <tr key={review.id}>
                  <Td>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-xs text-ink-soft">
                      {review.city} · {formatDate(review.createdAt)}
                    </div>
                  </Td>
                  <Td>{review.productName}</Td>
                  <Td>{review.rating}/5</Td>
                  <Td className="max-w-xs">{review.text}</Td>
                  <Td>
                    <StatusBadge status={review.status} />
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-2">
                      {review.status !== "published" && (
                        <AdminButton
                          type="button"
                          onClick={() =>
                            upsertReview({ ...review, status: "published" })
                          }
                        >
                          Publish
                        </AdminButton>
                      )}
                      <AdminButton
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setForm(review);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        type="button"
                        onClick={() => deleteReview(review.id)}
                      >
                        Delete
                      </AdminButton>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </TableWrap>
        {data.reviews.length === 0 && (
          <EmptyState message="No reviews yet." />
        )}
      </Panel>

      <Modal
        open={open}
        title={form.id ? "Edit review" : "Add review"}
        onClose={() => setOpen(false)}
        wide
      >
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <TextInput
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="City">
            <TextInput
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </Field>
          <Field label="Product">
            <TextSelect
              required
              value={form.productName}
              onChange={(e) =>
                setForm({ ...form, productName: e.target.value })
              }
            >
              {data.products.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </TextSelect>
          </Field>
          <Field label="Rating">
            <TextSelect
              value={form.rating}
              onChange={(e) =>
                setForm({ ...form, rating: Number(e.target.value) })
              }
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </TextSelect>
          </Field>
          <Field label="Status">
            <TextSelect
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as AdminReview["status"],
                })
              }
            >
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="hidden">Hidden</option>
            </TextSelect>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Review text">
              <TextTextarea
                required
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <AdminButton variant="secondary" type="button" onClick={() => setOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton type="submit">Save</AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
