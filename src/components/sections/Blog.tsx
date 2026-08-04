"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { blogPosts as seedTitles } from "@/data/catalog";
import type { AdminBlogPost } from "@/lib/admin/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchPublishedBlogPosts } from "@/lib/supabase/api";

export function Blog() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!isSupabaseConfigured()) {
          if (!cancelled) {
            setPosts(
              seedTitles.slice(0, 5).map((title, index) => ({
                id: `seed-blog-${index + 1}`,
                title,
                excerpt: "",
                content: "",
                status: "published" as const,
                createdAt: new Date().toISOString().slice(0, 10),
              })),
            );
          }
          return;
        }

        const published = await fetchPublishedBlogPosts();
        if (cancelled) return;

        if (published.length > 0) {
          setPosts(published.slice(0, 6));
        } else {
          setPosts(
            seedTitles.slice(0, 5).map((title, index) => ({
              id: `seed-blog-${index + 1}`,
              title,
              excerpt: "",
              content: "",
              status: "published" as const,
              createdAt: new Date().toISOString().slice(0, 10),
            })),
          );
        }
      } catch {
        if (!cancelled) {
          setPosts(
            seedTitles.slice(0, 5).map((title, index) => ({
              id: `seed-blog-${index + 1}`,
              title,
              excerpt: "",
              content: "",
              status: "published" as const,
              createdAt: new Date().toISOString().slice(0, 10),
            })),
          );
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="blog" className="container-shell section-pad py-16 md:py-20">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">
            Our Blog
          </p>
          <h2 className="section-title mt-2">Technology Tips & Buying Guides</h2>
          <p className="section-copy">Latest articles to help you buy smarter.</p>
        </div>
        <Link href="/blog" className="btn-secondary">
          Read More Articles
        </Link>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="group flex items-start justify-between gap-4 rounded-2xl border border-line bg-white/80 p-5 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_12px_30px_rgba(37,150,190,0.12)]"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">
                Guide {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-lg leading-snug font-semibold text-ink group-hover:text-brand">
                {post.title}
              </h3>
            </div>
            <span className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
