import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { getPublishedPosts } from "@/lib/notion";

export const metadata: Metadata = {
  title: "Blog | Electricautomaticchile",
  description: "Artículos sobre IoT, electricidad inteligente y eficiencia energética para hogares y empresas en Chile.",
};

export const revalidate = 60;

const coloresCat: Record<string, string> = {
  IoT: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Eficiencia energética": "bg-green-500/20 text-green-300 border-green-500/30",
  Condominios: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Tecnología: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Seguridad: "bg-red-500/20 text-red-300 border-red-500/30",
  Automatización: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Energía: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="relative overflow-hidden bg-black min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-orange-950/40 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">
            <span className="text-sm font-medium text-orange-300">Contenido educativo</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Blog de <span className="text-orange-500">Electricautomaticchile</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Artículos sobre IoT, electricidad inteligente y eficiencia energética
            para que tomes mejores decisiones en tu hogar o empresa.
          </p>
        </div>

        {/* Artículos */}
        {posts.length === 0 ? (
          <div className="text-center text-white/40 py-20 text-lg">No hay posts publicados aún.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug || post.id}`}>
                <article className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-colors h-full cursor-pointer">
                  {post.portada ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.portada}
                      alt={post.titulo}
                      className="w-full h-36 object-cover border-b border-white/10"
                    />
                  ) : (
                    <div className="h-36 bg-gradient-to-br from-orange-500/20 to-orange-900/20 flex items-center justify-center border-b border-white/10">
                      <span className="text-5xl">⚡</span>
                    </div>
                  )}
                  <div className="p-5">
                    {post.categoria && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                          coloresCat[post.categoria] ?? "bg-white/10 text-white/60 border-white/20"
                        }`}
                      >
                        {post.categoria}
                      </span>
                    )}
                    <h2 className="font-bold text-white text-base mt-3 mb-2 line-clamp-2">{post.titulo}</h2>
                    {post.resumen && (
                      <p className="text-sm text-white/50 mb-4 line-clamp-3">{post.resumen}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-white/40">
                      {post.fecha && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.fecha).toLocaleDateString("es-CL", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      {post.lectura && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.lectura}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Newsletter */}
        <div className="text-center border border-white/10 rounded-2xl p-12 bg-white/5">
          <h2 className="text-2xl font-bold text-white mb-2">Mantente al día</h2>
          <p className="text-white/50 mb-6 text-sm">
            Recibe los últimos artículos sobre electricidad inteligente e IoT en tu correo.
          </p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="tu@correo.com"
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Suscribir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
