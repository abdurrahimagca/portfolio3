import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { getLocale, getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { H1, Small } from "@/components/text";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const post = getPostBySlug(slug, locale);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.createdAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("blog");
  const post = getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.createdAt));

  return (
    <div className="flex flex-col items-center py-sq-1">
      <article className="w-full">
        <Link
          href="/blog"
          className="inline-flex items-center gap-sq-1-8 text-muted-foreground hover:text-foreground transition-colors mb-sq-1-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {t("backToBlog")}
        </Link>

        <div className="flex flex-row flex-wrap gap-sq-1-8 mb-sq-1-4">
          {post.topics.map(topic => (
            <Badge key={topic} variant="outline">
              {topic}
            </Badge>
          ))}
        </div>

        <H1 className="mb-sq-1-4">{post.title}</H1>

        <Small>{formattedDate}</Small>

        <Separator className="my-sq-1-2" />

        <div className="prose prose-invert max-w-none">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </div>
  );
}
