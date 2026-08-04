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
import type { AdminInstallation } from "@/lib/admin/types";
import { uid } from "@/lib/admin/utils";

const services = [
  "CCTV Cameras",
  "Wi-Fi Routers",
  "Smart Home Devices",
  "Projectors",
];

const blank = (): AdminInstallation => ({
  id: "",
  customerName: "",
  phone: "",
  service: services[0],
  city: "",
  preferredDate: new Date().toISOString().slice(0, 10),
  status: "requested",
  notes: "",
});

export default function AdminInstallationsPage() {
  const { data, ready, upsertInstallation, deleteInstallation } =
    useAdminStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AdminInstallation>(blank());

  if (!ready) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    upsertInstallation({
      ...form,
      id: form.id || uid("INS"),
    });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Installations"
        description="Manage booking requests for CCTV, routers, smart home, and projectors."
        actions={
          <AdminButton
            type="button"
            onClick={() => {
              setForm(blank());
              setOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add booking
          </AdminButton>
        }
      />

      <Panel>
        <TableWrap>
          <AdminTable>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>Service</Th>
                <Th>City / Date</Th>
                <Th>Status</Th>
                <Th>Notes</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.installations.map((item) => (
                <tr key={item.id}>
                  <Td>
                    <div className="font-semibold">{item.customerName}</div>
                    <div className="text-xs text-ink-soft">{item.phone}</div>
                  </Td>
                  <Td>{item.service}</Td>
                  <Td>
                    <div>{item.city}</div>
                    <div className="text-xs text-ink-soft">
                      {item.preferredDate}
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge status={item.status} />
                  </Td>
                  <Td className="max-w-xs text-ink-soft">{item.notes}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-2">
                      <AdminButton
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setForm(item);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        type="button"
                        onClick={() => deleteInstallation(item.id)}
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
        {data.installations.length === 0 && (
          <EmptyState message="No installation bookings yet." />
        )}
      </Panel>

      <Modal
        open={open}
        title={form.id ? "Edit booking" : "Add booking"}
        onClose={() => setOpen(false)}
        wide
      >
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Customer name">
            <TextInput
              required
              value={form.customerName}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
            />
          </Field>
          <Field label="Phone">
            <TextInput
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Service">
            <TextSelect
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
            >
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </TextSelect>
          </Field>
          <Field label="City">
            <TextInput
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </Field>
          <Field label="Preferred date">
            <TextInput
              type="date"
              required
              value={form.preferredDate}
              onChange={(e) =>
                setForm({ ...form, preferredDate: e.target.value })
              }
            />
          </Field>
          <Field label="Status">
            <TextSelect
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as AdminInstallation["status"],
                })
              }
            >
              <option value="requested">Requested</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </TextSelect>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <TextTextarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
