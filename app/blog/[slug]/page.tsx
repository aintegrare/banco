import type { Metadata } from "next"
import { getPostBySlug } from "@/lib/blog-utils"
import { BlogPostPageClient } from "./BlogPostPageClient"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post não encontrado | Blog Integrare",
      description: "O post que você está procurando não foi encontrado.",
    }
  }

  return {
    title: `${post.title} | Blog Integrare`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.featured_image }],
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author?.name],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostPageClient params={params} />
}
