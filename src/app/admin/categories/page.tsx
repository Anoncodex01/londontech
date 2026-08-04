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
  Th,
} from "@/components/admin/ui";
import { useAdminStore } from "@/lib/admin/store";
import type { AdminCategory } from "@/lib/admin/types";
import { slugify, uid } from "@/lib/admin/utils";

const blank = (): AdminCategory => ({
  id: "",
  name: "",
  slug: "",
  icon: "Package",
  active: true,
});

export default function AdminCategoriesPage() {
  const { data, ready, upsertCategory, deleteCategory } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AdminCategory>(blank());

  if (!ready) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const slug = form.slug || slugify(form.name);
    upsertCategory({
      ...form,
      id: form.id || slug || uid("cat"),
      slug,
    });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize the storefront shop-by-category section."
        actions={
          <AdminButton
            type="button"
            onClick={() => {
              setForm(blank());
              setOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add category
          </AdminButton>
        }
      />

      <Panel>
        <TableWrap>
          <AdminTable>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Slug</Th>
                <Th>Icon</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.categories.map((category) => (
                <tr key={category.id}>
                  <Td className="font-semibold">{category.name}</Td>
                  <Td>{category.slug}</Td>
                  <Td>{category.icon}</Td>
                  <Td>
                    <StatusBadge status={category.active ? "active" : "hidden"} />
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <AdminButton
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setForm(category);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        type="button"
                        onClick={() => deleteCategory(category.id)}
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
        {data.categories.length === 0 && (
          <EmptyState message="No categories yet." />
        )}
      </Panel>

      <Modal
        open={open}
        title={form.id ? "Edit category" : "Add category"}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Name">
            <TextInput
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                  slug: form.id ? form.slug : slugify(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Slug">
            <TextInput
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </Field>
          <Field label="Icon key">
            <TextInput
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active on storefront
          </label>
          <div className="flex justify-end gap-2">
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
