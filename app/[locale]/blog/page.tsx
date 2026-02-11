import { getAllPosts, getAllTopics } from "@/lib/blog";
import { H2 } from "@/components/text";
import { getLocale, getTranslations } from "next-intl/server";
import { BlogListClient } from "./blog-list-client";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  const meta = await getTranslations("metadata");

  return {
    title: `${t("title")} - ${meta("title")}`,
    description: meta("description"),
  };
}

export default async function BlogPage() {
  const locale = await getLocale();
  const t = await getTranslations("blog");
  const posts = getAllPosts(locale);
  const topics = getAllTopics(locale);

  const postProps = posts.map(post => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    topics: post.topics,
    keywords: post.keywords,
    createdAt: post.createdAt,
    locale,
  }));

  return (
    <div className="flex flex-col items-center gap-sq-1-2 py-sq-1">
      <H2 className="text-primary">{t("title")}</H2>
      <BlogListClient posts={postProps} topics={topics} locale={locale} />
    </div>
  );
}
