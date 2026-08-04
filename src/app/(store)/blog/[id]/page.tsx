"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { blogPosts as seedTitles } from "@/data/catalog";
import type { AdminBlogPost } from "@/lib/admin/types";
import { formatDate } from "@/lib/admin/utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  fetchPublishedBlogPostById,
  fetchPublishedBlogPosts,
} from "@/lib/supabase/api";

function seedPostById(id: string): AdminBlogPost | null {
  const match = /^seed-blog-(\d+)$/.exec(id);
  if (!match) return null;
  const index = Number(match[1]) - 1;
  const title = seedTitles[index];
  if (!title) return null;
  return {
    id,
    title,
    excerpt: "Buying guide and tips from London Technologies.",
    content: `${title}\n\nThis guide helps you compare options, understand key features, and choose the right product for your needs in Tanzania.\n\nLook for warranty coverage, delivery time to your city, and genuine brand support before you buy.\n\nNeed help deciding? Contact London Technologies by phone or WhatsApp and our team will recommend the best option for your budget.`,
    status: "published",
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

function paragraphsFromContent(content: string, excerpt: string) {
  const source = (content || excerpt || "").trim();
  if (!source) return [];
  return source
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function BlogDetailPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<AdminBlogPost | null>(null);
  const [related, setRelated] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        if (!isSupabaseConfigured() || params.id.startsWith("seed-")) {
          const seed = seedPostById(params.id);
          if (!cancelled) {
            setPost(seed);
            setRelated(
              seedTitles
                .map((title, index) => ({
                  id: `seed-blog-${index + 1}`,
                  title,
                  excerpt: "Buying guide and tips from London Technologies.",
                  content: "",
                  status: "published" as const,
                  createdAt: new Date().toISOString().slice(0, 10),
                }))
                .filter((item) => item.id !== params.id)
                .slice(0, 3),
            );
            if (!seed) setError("Article not found.");
          }
          return;
        }

        const [found, published] = await Promise.all([
          fetchPublishedBlogPostById(params.id),
          fetchPublishedBlogPosts(),
        ]);

        if (cancelled) return;

        if (found) {
          setPost(found);
          setRelated(
            published.filter((item) => item.id !== found.id).slice(0, 3),
          );
        } else {
          const seed = seedPostById(params.id);
          setPost(seed);
          setRelated(published.filter((item) => item.id !== params.id).slice(0, 3));
          if (!seed) setError("Article not found.");
        }
      } catch {
        const seed = seedPostById(params.id);
        if (!cancelled) {
          setPost(seed);
          if (!seed) setError("Could not load this article.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const paragraphs = useMemo(
    () => (post ? paragraphsFromContent(post.content, post.excerpt) : []),
    [post],
  );

  if (loading) {
    return (
      <div className="container-shell section-pad py-20 text-ink-soft">
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-shell section-pad py-20">
        <h1 className="font-display text-3xl font-bold text-ink">
          {error || "Article not found"}
        </h1>
        <Link href="/blog" className="btn-primary mt-6 inline-flex">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container-shell section-pad py-10 md:py-14">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-brand">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{post.title}</span>
      </nav>

      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          <ArrowLeft className="size-4" />
          All articles
        </Link>

        <p className="mt-6 text-sm font-semibold tracking-[0.16em] text-brand uppercase">
          Buying guide
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink-soft">
          <CalendarDays className="size-4" />
          {formatDate(post.createdAt)}
        </p>

        {post.excerpt && (
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            {post.excerpt}
          </p>
        )}

        <div className="mt-8 space-y-4 border-t border-line pt-8 text-base leading-relaxed text-ink">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-line bg-brand-soft/50 p-5">
          <p className="font-display text-lg font-semibold text-ink">
            Need a recommendation?
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Browse the shop or contact us for help choosing the right product.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary">
              Shop products
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact us
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-14 max-w-3xl border-t border-line pt-10">
          <h2 className="font-display text-2xl font-bold text-ink">
            More guides
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/blog/${item.id}`}
                className="rounded-2xl border border-line bg-white/90 p-4 transition-colors hover:border-brand"
              >
                <h3 className="font-display text-sm font-semibold text-ink hover:text-brand">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
