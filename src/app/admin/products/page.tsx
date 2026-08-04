"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import { ImagePlus, Plus, Search, X } from "lucide-react";
import { formatPrice } from "@/data/catalog";
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
import type { AdminProduct, StockStatus } from "@/lib/admin/types";
import { slugify, uid } from "@/lib/admin/utils";
import { uploadProductImages } from "@/lib/supabase/api";

const emptyProduct = (): AdminProduct => ({
  id: "",
  name: "",
  category: "",
  brand: "",
  price: 0,
  originalPrice: undefined,
  rating: 4.5,
  reviews: 0,
  stock: "in-stock",
  warranty: "12 months",
  delivery: "1–3 days",
  badge: "",
  accent: "#2596be",
  specs: [],
  featured: false,
  bestSeller: false,
  newArrival: false,
  deal: false,
  quantity: 10,
  active: true,
  imageUrl: "",
  imageUrls: [],
});

type PendingImage = {
  id: string;
  file: File;
  preview: string;
};

export default function AdminProductsPage() {
  const { data, ready, usingDatabase, upsertProduct, deleteProduct } =
    useAdminStore();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<AdminProduct>(emptyProduct());
  const [specsText, setSpecsText] = useState("");
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return data.products.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q),
    );
  }, [data.products, query]);

  const existingImages = form.imageUrls?.length
    ? form.imageUrls
    : form.imageUrl
      ? [form.imageUrl]
      : [];

  if (!ready) return null;

  function resetPending() {
    pendingImages.forEach((item) => URL.revokeObjectURL(item.preview));
    setPendingImages([]);
  }

  function openCreate() {
    const blank = emptyProduct();
    blank.category = data.categories[0]?.name || "";
    blank.brand = data.brands[0]?.name || "";
    resetPending();
    setForm(blank);
    setSpecsText("");
    setFormError("");
    setOpen(true);
  }

  function openEdit(product: AdminProduct) {
    resetPending();
    const imageUrls =
      product.imageUrls?.length
        ? product.imageUrls
        : product.imageUrl
          ? [product.imageUrl]
          : [];
    setForm({ ...product, imageUrls, imageUrl: imageUrls[0] || "" });
    setSpecsText(product.specs.join(", "));
    setFormError("");
    setOpen(true);
  }

  function addImageFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const next = Array.from(fileList).map((file) => ({
      id: uid("img"),
      file,
      preview: URL.createObjectURL(file),
    }));
    setPendingImages((prev) => [...prev, ...next]);
  }

  function removeExistingImage(url: string) {
    const next = existingImages.filter((item) => item !== url);
    setForm({
      ...form,
      imageUrls: next,
      imageUrl: next[0] || "",
    });
  }

  function removePendingImage(id: string) {
    setPendingImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((item) => item.id !== id);
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    try {
      const id = form.id || slugify(form.name) || uid("prd");
      let imageUrls = [...existingImages];

      if (pendingImages.length > 0) {
        if (!usingDatabase) {
          throw new Error(
            "Connect Supabase and run schema SQL before uploading images.",
          );
        }
        setUploading(true);
        const uploaded = await uploadProductImages(
          pendingImages.map((item) => item.file),
          id,
        );
        imageUrls = [...imageUrls, ...uploaded];
      }

      await upsertProduct({
        ...form,
        id,
        price: Number(form.price) || 0,
        originalPrice: form.originalPrice
          ? Number(form.originalPrice)
          : undefined,
        quantity: Number(form.quantity) || 0,
        rating: Number(form.rating) || 0,
        reviews: Number(form.reviews) || 0,
        specs: specsText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        badge: form.badge || undefined,
        imageUrls,
        imageUrl: imageUrls[0] || undefined,
      });
      resetPending();
      setOpen(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save product.",
      );
    } finally {
      setUploading(false);
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Create and manage catalog items, gallery images, stock, pricing, and flags."
        actions={
          <AdminButton type="button" onClick={openCreate}>
            <Plus className="size-4" />
            Add product
          </AdminButton>
        }
      />

      <Panel className="mb-4 p-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
          <TextInput
            className="pl-10"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </Panel>

      <Panel>
        <TableWrap>
          <AdminTable>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>Category</Th>
                <Th>Price</Th>
                <Th>Stock</Th>
                <Th>Flags</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const cover =
                  product.imageUrls?.[0] || product.imageUrl || "";
                const count = product.imageUrls?.length || (cover ? 1 : 0);
                return (
                  <tr key={product.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 overflow-hidden rounded-xl bg-brand-soft">
                          {cover ? (
                            <Image
                              src={cover}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] font-semibold text-brand">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-xs text-ink-soft">
                            {product.brand}
                            {count > 0 ? ` · ${count} photo${count > 1 ? "s" : ""}` : ""}
                          </div>
                        </div>
                      </div>
                    </Td>
                    <Td>{product.category}</Td>
                    <Td>{formatPrice(product.price)}</Td>
                    <Td>
                      <StatusBadge status={product.stock} />
                      <div className="mt-1 text-xs text-ink-soft">
                        Qty: {product.quantity}
                      </div>
                    </Td>
                    <Td className="text-xs text-ink-soft">
                      {[
                        product.featured && "Featured",
                        product.bestSeller && "Best seller",
                        product.newArrival && "New",
                        product.deal && "Deal",
                      ]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </Td>
                    <Td>
                      <div className="flex gap-2">
                        <AdminButton
                          variant="secondary"
                          type="button"
                          onClick={() => openEdit(product)}
                        >
                          Edit
                        </AdminButton>
                        <AdminButton
                          variant="danger"
                          type="button"
                          onClick={() => void deleteProduct(product.id)}
                        >
                          Delete
                        </AdminButton>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </AdminTable>
        </TableWrap>
        {filtered.length === 0 && <EmptyState message="No products found." />}
      </Panel>

      <Modal
        open={open}
        title={form.id ? "Edit product" : "Add product"}
        onClose={() => {
          resetPending();
          setOpen(false);
        }}
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
          <Field label="Brand">
            <TextSelect
              required
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            >
              {data.brands.map((brand) => (
                <option key={brand.id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </TextSelect>
          </Field>
          <Field label="Category">
            <TextSelect
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {data.categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </TextSelect>
          </Field>
          <Field label="Badge">
            <TextInput
              value={form.badge || ""}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
            />
          </Field>
          <Field label="Price (TZS)">
            <TextInput
              type="number"
              required
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Original price (TZS)">
            <TextInput
              type="number"
              value={form.originalPrice || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  originalPrice: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </Field>
          <Field label="Quantity">
            <TextInput
              type="number"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Stock status">
            <TextSelect
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value as StockStatus })
              }
            >
              <option value="in-stock">In stock</option>
              <option value="limited">Limited</option>
              <option value="out-of-stock">Out of stock</option>
            </TextSelect>
          </Field>
          <Field label="Warranty">
            <TextInput
              value={form.warranty}
              onChange={(e) => setForm({ ...form, warranty: e.target.value })}
            />
          </Field>
          <Field label="Delivery">
            <TextInput
              value={form.delivery}
              onChange={(e) => setForm({ ...form, delivery: e.target.value })}
            />
          </Field>

          <div className="sm:col-span-2 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-ink">Product photos</p>
              <p className="text-xs text-ink-soft">
                First photo is the cover. Select multiple or add more anytime.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {existingImages.map((url, index) => (
                <div
                  key={url}
                  className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-brand-soft"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-brand-deeper">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label="Remove image"
                    className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-rose-600"
                    onClick={() => removeExistingImage(url)}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}

              {pendingImages.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square overflow-hidden rounded-2xl border border-dashed border-brand bg-brand-soft/50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-white">
                    New
                  </span>
                  <button
                    type="button"
                    aria-label="Remove pending image"
                    className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-rose-600"
                    onClick={() => removePendingImage(item.id)}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}

              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-surface text-brand transition hover:border-brand hover:bg-brand-soft">
                <ImagePlus className="size-6" />
                <span className="px-2 text-center text-xs font-semibold">
                  Add photos
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    addImageFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            <p className="text-xs text-ink-soft">
              Uploads to Supabase Storage bucket <code>product-images</code>{" "}
              (max 5MB each). You can pick several files at once.
            </p>
          </div>

          <div className="sm:col-span-2">
            <Field label="Specs (comma separated)">
              <TextTextarea
                value={specsText}
                onChange={(e) => setSpecsText(e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm sm:col-span-2">
            {(
              [
                ["featured", "Featured"],
                ["bestSeller", "Best seller"],
                ["newArrival", "New arrival"],
                ["deal", "Hot deal"],
                ["active", "Active"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(form[key])}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.checked })
                  }
                />
                {label}
              </label>
            ))}
          </div>

          {formError && (
            <p className="sm:col-span-2 text-sm font-medium text-rose-600">
              {formError}
            </p>
          )}

          <div className="sm:col-span-2 flex justify-end gap-2">
            <AdminButton
              variant="secondary"
              type="button"
              onClick={() => {
                resetPending();
                setOpen(false);
              }}
            >
              Cancel
            </AdminButton>
            <AdminButton type="submit" disabled={saving || uploading}>
              {uploading
                ? `Uploading ${pendingImages.length || ""} photo(s)...`
                : saving
                  ? "Saving..."
                  : "Save product"}
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
