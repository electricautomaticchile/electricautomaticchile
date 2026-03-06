const NOTION_TOKEN = process.env.NOTION_TOKEN!;
const DB_ID = process.env.NOTION_BLOG_DB_ID!;

const headers = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
};

export type BlogPost = {
  id: string;
  titulo: string;
  slug: string;
  resumen: string;
  categoria: string;
  estado: string;
  fecha: string;
  lectura: string;
  portada: string | null;
};

function getText(rich: any[]): string {
  return (rich ?? []).map((r: any) => r.plain_text).join("");
}

function getCover(page: any): string | null {
  const cover = page.cover;
  if (!cover) return null;
  if (cover.type === "external") return cover.external?.url ?? null;
  if (cover.type === "file") return cover.file?.url ?? null;
  return null;
}

function pageToPost(page: any): BlogPost {
  const p = page.properties;
  return {
    id: page.id,
    titulo: getText(p["Name"]?.title ?? []),
    slug: getText(p["Slug"]?.rich_text ?? []),
    resumen: getText(p["Resumen"]?.rich_text ?? []),
    categoria: p["Categoría"]?.select?.name ?? "",
    estado: p["Estado"]?.select?.name ?? "",
    fecha: p["Fecha"]?.date?.start ?? "",
    lectura: getText(p["Tiempo de lectura"]?.rich_text ?? []),
    portada: getCover(page),
  };
}

async function getFirstImageFromBlocks(pageId: string): Promise<string | null> {
  const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
    headers,
    cache: "no-store",
  });
  const data = await res.json();
  const imageBlock = (data.results ?? []).find((b: any) => b.type === "image");
  if (!imageBlock) return null;
  const img = imageBlock.image;
  return img?.type === "external" ? img.external?.url ?? null : img?.file?.url ?? null;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      filter: { property: "Estado", select: { equals: "Publicado" } },
      sorts: [{ property: "Fecha", direction: "descending" }],
    }),
    cache: "no-store",
  });
  const data = await res.json();
  const posts: BlogPost[] = await Promise.all(
    (data.results ?? []).map(async (page: any) => {
      const post = pageToPost(page);
      if (!post.portada) {
        post.portada = await getFirstImageFromBlocks(post.id);
      }
      return post;
    })
  );
  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      filter: { property: "Slug", rich_text: { equals: slug } },
    }),
    cache: "no-store",
  });
  const data = await res.json();
  if (!data.results?.length) return null;
  return pageToPost(data.results[0]);
}

export async function getPostBlocks(pageId: string): Promise<any[]> {
  const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
    headers,
    cache: "no-store",
  });
  const data = await res.json();
  return data.results ?? [];
}
