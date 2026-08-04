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
  TextTextarea,
  Th,
} from "@/components/admin/ui";
import { useAdminStore } from "@/lib/admin/store";
import type { AdminFaq } from "@/lib/admin/types";
import { uid } from "@/lib/admin/utils";

const blank = (): AdminFaq => ({
  id: "",
  question: "",
  answer: "",
  active: true,
});

export default function AdminFaqsPage() {
  const { data, ready, upsertFaq, deleteFaq } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AdminFaq>(blank());

  if (!ready) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    upsertFaq({
      ...form,
      id: form.id || uid("FAQ"),
    });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="FAQs"
        description="Update frequently asked questions shown on the storefront."
        actions={
          <AdminButton
            type="button"
            onClick={() => {
              setForm(blank());
              setOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add FAQ
          </AdminButton>
        }
      />

      <Panel>
        <TableWrap>
          <AdminTable>
            <thead>
              <tr>
                <Th>Question</Th>
                <Th>Answer</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.faqs.map((faq) => (
                <tr key={faq.id}>
                  <Td className="font-semibold">{faq.question}</Td>
                  <Td className="max-w-md text-ink-soft">{faq.answer}</Td>
                  <Td>
                    <StatusBadge status={faq.active ? "active" : "hidden"} />
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <AdminButton
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setForm(faq);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        type="button"
                        onClick={() => deleteFaq(faq.id)}
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
        {data.faqs.length === 0 && <EmptyState message="No FAQs yet." />}
      </Panel>

      <Modal
        open={open}
        title={form.id ? "Edit FAQ" : "Add FAQ"}
        onClose={() => setOpen(false)}
        wide
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Question">
            <TextInput
              required
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />
          </Field>
          <Field label="Answer">
            <TextTextarea
              required
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
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
