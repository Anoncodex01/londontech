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
import type { AdminBlogPost } from "@/lib/admin/types";
import { uid } from "@/lib/admin/utils";

const blank = (): AdminBlogPost => ({
  id: "",
  title: "",
  excerpt: "",
  content: "",
  status: "draft",
  createdAt: new Date().toISOString().slice(0, 10),
});

export default function AdminBlogPage() {
  const { data, ready, upsertBlogPost, deleteBlogPost } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AdminBlogPost>(blank());

  if (!ready) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    upsertBlogPost({
      ...form,
      id: form.id || uid("BLOG"),
    });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Publish buying guides and technology tips for the storefront blog."
        actions={
          <AdminButton
            type="button"
            onClick={() => {
              setForm(blank());
              setOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add article
          </AdminButton>
        }
      />

      <Panel>
        <TableWrap>
          <AdminTable>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Excerpt</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.blogPosts.map((post) => (
                <tr key={post.id}>
                  <Td className="font-semibold">{post.title}</Td>
                  <Td className="max-w-sm text-ink-soft">{post.excerpt}</Td>
                  <Td>{post.createdAt}</Td>
                  <Td>
                    <StatusBadge status={post.status} />
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <AdminButton
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setForm(post);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        type="button"
                        onClick={() => deleteBlogPost(post.id)}
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
        {data.blogPosts.length === 0 && (
          <EmptyState message="No blog articles yet." />
        )}
      </Panel>

      <Modal
        open={open}
        title={form.id ? "Edit article" : "Add article"}
        onClose={() => setOpen(false)}
        wide
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Title">
            <TextInput
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Excerpt">
            <TextTextarea
              required
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </Field>
          <Field label="Full article">
            <TextTextarea
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="min-h-40"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date">
              <TextInput
                type="date"
                required
                value={form.createdAt}
                onChange={(e) =>
                  setForm({ ...form, createdAt: e.target.value })
                }
              />
            </Field>
            <Field label="Status">
              <TextSelect
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as AdminBlogPost["status"],
                  })
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </TextSelect>
            </Field>
          </div>
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
