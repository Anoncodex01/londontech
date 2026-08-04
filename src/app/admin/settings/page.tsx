"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AdminButton,
  Field,
  PageHeader,
  Panel,
  TextInput,
} from "@/components/admin/ui";
import { useAdminStore } from "@/lib/admin/store";
import type { AdminSettings } from "@/lib/admin/types";

export default function AdminSettingsPage() {
  const { data, ready, usingDatabase, updateSettings, refresh } =
    useAdminStore();
  const [form, setForm] = useState<AdminSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready) setForm(data.settings);
  }, [ready, data.settings]);

  if (!ready || !form) return null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError("");
    try {
      await updateSettings(form);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings.");
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Update store contact details, hours, delivery info, and social links."
        actions={
          <AdminButton
            variant="secondary"
            type="button"
            onClick={() => void refresh()}
          >
            Reload from database
          </AdminButton>
        }
      />
      <p className="mb-4 text-sm text-ink-soft">
        Source: {usingDatabase ? "Supabase database" : "Not connected"}
      </p>
      {error && (
        <p className="mb-4 text-sm font-medium text-rose-600">{error}</p>
      )}

      <Panel className="p-5 md:p-6">
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <Field label="Store name">
            <TextInput
              required
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            />
          </Field>
          <Field label="Tagline">
            <TextInput
              required
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <TextInput
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="WhatsApp">
            <TextInput
              required
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <TextInput
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Weekday hours">
            <TextInput
              value={form.weekdayHours}
              onChange={(e) =>
                setForm({ ...form, weekdayHours: e.target.value })
              }
            />
          </Field>
          <Field label="Sunday hours">
            <TextInput
              value={form.sundayHours}
              onChange={(e) =>
                setForm({ ...form, sundayHours: e.target.value })
              }
            />
          </Field>
          <Field label="Delivery (Dar)">
            <TextInput
              value={form.deliveryDar}
              onChange={(e) =>
                setForm({ ...form, deliveryDar: e.target.value })
              }
            />
          </Field>
          <Field label="Delivery (Regions)">
            <TextInput
              value={form.deliveryRegions}
              onChange={(e) =>
                setForm({ ...form, deliveryRegions: e.target.value })
              }
            />
          </Field>
          <Field label="Instagram">
            <TextInput
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            />
          </Field>
          <Field label="Facebook">
            <TextInput
              value={form.facebook}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
            />
          </Field>
          <Field label="TikTok">
            <TextInput
              value={form.tiktok}
              onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
            />
          </Field>
          <Field label="YouTube">
            <TextInput
              value={form.youtube}
              onChange={(e) => setForm({ ...form, youtube: e.target.value })}
            />
          </Field>
          <Field label="LinkedIn">
            <TextInput
              value={form.linkedin}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            />
          </Field>

          <div className="md:col-span-2 flex items-center justify-between gap-3 pt-2">
            {saved ? (
              <p className="text-sm font-medium text-emerald-700">
                Settings saved locally.
              </p>
            ) : (
              <p className="text-sm text-ink-soft">
                Changes are saved in this browser (localStorage).
              </p>
            )}
            <AdminButton type="submit">Save settings</AdminButton>
          </div>
        </form>
      </Panel>
    </div>
  );
}
