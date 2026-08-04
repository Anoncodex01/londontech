"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { AdminBlogPost } from "@/lib/admin/types";
import { formatDate } from "@/lib/admin/utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchPublishedBlogPosts } from "@/lib/supabase/api";
import { blogPosts as seedTitles } from "@/data/catalog";

function seedPosts(): AdminBlogPost[] {
  return seedTitles.map((title, index) => ({
    id: `seed-blog-${index + 1}`,
    title,
    excerpt: "Buying guide and tips from London Technologies.",
    content: `${title}\n\nThis guide helps you compare options, understand key features, and choose the right product for your needs in Tanzania.\n\nFor personalized advice, contact London Technologies by phone or WhatsApp.`,
    status: "published",
    createdAt: new Date().toISOString().slice(0, 10),
  }));
}

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDatabase, setFromDatabase] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        if (!isSupabaseConfigured()) {
          if (!cancelled) {
            setPosts(seedPosts());
            setFromDatabase(false);
          }
          return;
        }
        const published = await fetchPublishedBlogPosts();
        if (cancelled) return;
        if (published.length > 0) {
          setPosts(published);
          setFromDatabase(true);
        } else {
          setPosts(seedPosts());
          setFromDatabase(false);
        }
      } catch {
        if (!cancelled) {
          setPosts(seedPosts());
          setFromDatabase(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container-shell section-pad py-10 md:py-14">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Blog</span>
      </nav>

      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
          Our Blog
        </p>
        <h1 className="section-title mt-2">Technology Tips & Buying Guides</h1>
        <p className="section-copy">
          Articles to help you buy smarter — projectors, CCTV, networking, and
          more.
        </p>
      </div>

      {loading ? (
        <p className="mt-10 text-ink-soft">Loading articles...</p>
      ) : posts.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border border-dashed border-line bg-white/70 px-6 py-16 text-center">
          <p className="font-display text-xl font-semibold text-ink">
            No published articles yet
          </p>
          <p className="mt-2 text-ink-soft">
            Publish posts from Admin → Blog to show them here.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group flex flex-col rounded-2xl border border-line bg-white/90 p-5 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_12px_30px_rgba(37,150,190,0.12)]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">
                  Guide {String(index + 1).padStart(2, "0")}
                </p>
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <h2 className="mt-3 font-display text-lg leading-snug font-semibold text-ink group-hover:text-brand">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-soft">
                {post.excerpt}
              </p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-soft">
                <CalendarDays className="size-3.5" />
                {formatDate(post.createdAt)}
                {!fromDatabase && post.id.startsWith("seed-") ? " · Sample" : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
