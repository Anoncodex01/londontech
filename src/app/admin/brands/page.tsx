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
import type { AdminBrand } from "@/lib/admin/types";
import { slugify, uid } from "@/lib/admin/utils";

const blank = (): AdminBrand => ({
  id: "",
  name: "",
  active: true,
});

export default function AdminBrandsPage() {
  const { data, ready, upsertBrand, deleteBrand } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AdminBrand>(blank());

  if (!ready) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    upsertBrand({
      ...form,
      id: form.id || slugify(form.name) || uid("brand"),
    });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Brands"
        description="Manage trusted brands shown on the storefront."
        actions={
          <AdminButton
            type="button"
            onClick={() => {
              setForm(blank());
              setOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add brand
          </AdminButton>
        }
      />

      <Panel>
        <TableWrap>
          <AdminTable>
            <thead>
              <tr>
                <Th>Brand</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.brands.map((brand) => (
                <tr key={brand.id}>
                  <Td className="font-semibold">{brand.name}</Td>
                  <Td>
                    <StatusBadge status={brand.active ? "active" : "hidden"} />
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <AdminButton
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setForm(brand);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        type="button"
                        onClick={() => deleteBrand(brand.id)}
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
        {data.brands.length === 0 && <EmptyState message="No brands yet." />}
      </Panel>

      <Modal
        open={open}
        title={form.id ? "Edit brand" : "Add brand"}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Brand name">
            <TextInput
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active
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
