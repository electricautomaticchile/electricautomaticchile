import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { getPostBySlug, getPostBlocks, getPublishedPosts } from "@/lib/notion";
import { notFound } from "next/navigation";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    return posts.map((p) => ({ slug: p.slug || p.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug).catch(() => null);
  if (!post) return {};
  return {
    title: `${post.titulo} | Blog Electricautomaticchile`,
    description: post.resumen,
  };
}

function renderBlock(block: BlockObjectResponse) {
  const b = block as any;
  const getText = (rich: any[]) => rich?.map((r: any) => r.plain_text).join("") ?? "";

  switch (block.type) {
    case "paragraph":
      return <p key={block.id} className="text-white/70 leading-relaxed">{getText(b.paragraph.rich_text)}</p>;
    case "heading_1":
      return <h1 key={block.id} className="text-3xl font-bold text-white mt-8 mb-3">{getText(b.heading_1.rich_text)}</h1>;
    case "heading_2":
      return <h2 key={block.id} className="text-2xl font-bold text-white mt-6 mb-2">{getText(b.heading_2.rich_text)}</h2>;
    case "heading_3":
      return <h3 key={block.id} className="text-xl font-semibold text-white mt-4 mb-2">{getText(b.heading_3.rich_text)}</h3>;
    case "bulleted_list_item":
      return <li key={block.id} className="ml-5 list-disc text-white/70">{getText(b.bulleted_list_item.rich_text)}</li>;
    case "numbered_list_item":
      return <li key={block.id} className="ml-5 list-decimal text-white/70">{getText(b.numbered_list_item.rich_text)}</li>;
    case "quote":
      return <blockquote key={block.id} className="border-l-4 border-orange-500 pl-4 italic text-white/60">{getText(b.quote.rich_text)}</blockquote>;
    case "code":
      return (
        <pre key={block.id} className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto">
          <code className="text-orange-300 text-sm font-mono">{getText(b.code.rich_text)}</code>
        </pre>
      );
    case "divider":
      return <hr key={block.id} className="border-white/10 my-6" />;
    case "image": {
      const imgData = b.image;
      const url = imgData?.type === "external"
        ? imgData.external?.url
        : imgData?.file?.url;
      if (!url) return null;
      const caption = getText(imgData.caption ?? []);
      return (
        <figure key={block.id} className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={caption || "imagen del post"} className="rounded-xl w-full object-cover border border-white/10" />
          {caption && <figcaption className="text-center text-sm text-white/40 mt-2">{caption}</figcaption>}
        </figure>
      );
    }
    case "callout":
      return (
        <div key={block.id} className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex gap-3">
          <span>{b.callout.icon?.emoji ?? "💡"}</span>
          <p className="text-white/70">{getText(b.callout.rich_text)}</p>
        </div>
      );
    default:
      return null;
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const blocks = await getPostBlocks(post.id);

  return (
    <div className="relative overflow-hidden bg-black min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-orange-950/40 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="container mx-auto px-4 py-20 max-w-3xl relative z-10">

        <Link href="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-orange-400 transition-colors text-sm mb-10">
          <ArrowLeft className="w-4 h-4" /> Volver al blog
        </Link>

        {/* Header */}
        <div className="mb-10">
          {post.categoria && (
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30 mb-4 inline-block">
              {post.categoria}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{post.titulo}</h1>
          {post.resumen && <p className="text-lg text-white/60 mb-6">{post.resumen}</p>}
          <div className="flex items-center gap-4 text-sm text-white/40 border-t border-white/10 pt-4">
            {post.fecha && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.fecha).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            )}
            {post.lectura && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />{post.lectura}
              </span>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
          {blocks.map(renderBlock)}
        </div>

        <div className="mt-10 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 font-medium px-6 py-3 rounded-lg transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Ver más artículos
          </Link>
        </div>

      </div>
    </div>
  );
}
