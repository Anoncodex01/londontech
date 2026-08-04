"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { formatPrice } from "@/data/catalog";
import {
  AdminButton,
  AdminTable,
  EmptyState,
  Field,
  Modal,
  PageHeader,
  Panel,
  TableWrap,
  Td,
  TextInput,
  Th,
} from "@/components/admin/ui";
import { useAdminStore } from "@/lib/admin/store";
import type { AdminCustomer } from "@/lib/admin/types";
import { uid } from "@/lib/admin/utils";

const blank = (): AdminCustomer => ({
  id: "",
  name: "",
  phone: "",
  email: "",
  city: "",
  orders: 0,
  spent: 0,
  joinedAt: new Date().toISOString().slice(0, 10),
});

export default function AdminCustomersPage() {
  const { data, ready, upsertCustomer, deleteCustomer } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AdminCustomer>(blank());

  if (!ready) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    upsertCustomer({
      ...form,
      id: form.id || uid("CUS"),
      orders: Number(form.orders) || 0,
      spent: Number(form.spent) || 0,
    });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Customer records for repeat buyers and support follow-up."
        actions={
          <AdminButton
            type="button"
            onClick={() => {
              setForm(blank());
              setOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add customer
          </AdminButton>
        }
      />

      <Panel>
        <TableWrap>
          <AdminTable>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>Contact</Th>
                <Th>City</Th>
                <Th>Orders</Th>
                <Th>Spent</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.customers.map((customer) => (
                <tr key={customer.id}>
                  <Td>
                    <div className="font-semibold">{customer.name}</div>
                    <div className="text-xs text-ink-soft">
                      Joined {customer.joinedAt}
                    </div>
                  </Td>
                  <Td>
                    <div>{customer.phone}</div>
                    <div className="text-xs text-ink-soft">{customer.email}</div>
                  </Td>
                  <Td>{customer.city}</Td>
                  <Td>{customer.orders}</Td>
                  <Td>{formatPrice(customer.spent)}</Td>
                  <Td>
                    <div className="flex gap-2">
                      <AdminButton
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setForm(customer);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        type="button"
                        onClick={() => deleteCustomer(customer.id)}
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
        {data.customers.length === 0 && (
          <EmptyState message="No customers yet." />
        )}
      </Panel>

      <Modal
        open={open}
        title={form.id ? "Edit customer" : "Add customer"}
        onClose={() => setOpen(false)}
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
          <Field label="Phone">
            <TextInput
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <TextInput
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Orders">
            <TextInput
              type="number"
              value={form.orders}
              onChange={(e) =>
                setForm({ ...form, orders: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Total spent (TZS)">
            <TextInput
              type="number"
              value={form.spent}
              onChange={(e) =>
                setForm({ ...form, spent: Number(e.target.value) })
              }
            />
          </Field>
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
