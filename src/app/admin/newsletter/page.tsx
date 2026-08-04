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
import type { AdminSubscriber } from "@/lib/admin/types";
import { uid } from "@/lib/admin/utils";

const blank = (): AdminSubscriber => ({
  id: "",
  email: "",
  subscribedAt: new Date().toISOString().slice(0, 10),
  active: true,
});

export default function AdminNewsletterPage() {
  const { data, ready, upsertSubscriber, deleteSubscriber } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AdminSubscriber>(blank());

  if (!ready) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    upsertSubscriber({
      ...form,
      id: form.id || uid("SUB"),
    });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Newsletter"
        description="Manage subscribers receiving offers and product launches."
        actions={
          <AdminButton
            type="button"
            onClick={() => {
              setForm(blank());
              setOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add subscriber
          </AdminButton>
        }
      />

      <Panel>
        <TableWrap>
          <AdminTable>
            <thead>
              <tr>
                <Th>Email</Th>
                <Th>Subscribed</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <Td className="font-semibold">{subscriber.email}</Td>
                  <Td>{subscriber.subscribedAt}</Td>
                  <Td>
                    <StatusBadge
                      status={subscriber.active ? "active" : "hidden"}
                    />
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <AdminButton
                        variant="secondary"
                        type="button"
                        onClick={() =>
                          upsertSubscriber({
                            ...subscriber,
                            active: !subscriber.active,
                          })
                        }
                      >
                        {subscriber.active ? "Disable" : "Enable"}
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        type="button"
                        onClick={() => deleteSubscriber(subscriber.id)}
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
        {data.subscribers.length === 0 && (
          <EmptyState message="No subscribers yet." />
        )}
      </Panel>

      <Modal
        open={open}
        title="Add subscriber"
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Email">
            <TextInput
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
