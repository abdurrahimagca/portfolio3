"use client";

import { useState } from "react";
import { BlogCard } from "@/components/blog-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface BlogPostItem {
  slug: string;
  title: string;
  description: string;
  topics: string[];
  keywords: string[];
  createdAt: string;
}

interface BlogListClientProps {
  posts: BlogPostItem[];
  topics: string[];
  locale: string;
}

export function BlogListClient({ posts, topics, locale }: BlogListClientProps) {
  const t = useTranslations("blog");
  const [search, setSearch] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const clearTopics = () => {
    setSelectedTopics([]);
  };

  const filteredPosts = posts.filter(post => {
    const query = search.toLowerCase();

    const matchesSearch =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.topics.some(t => t.toLowerCase().includes(query)) ||
      post.keywords.some(k => k.toLowerCase().includes(query));

    const matchesTopics =
      selectedTopics.length === 0 ||
      selectedTopics.every(t => post.topics.includes(t));

    return matchesSearch && matchesTopics;
  });

  return (
    <>
      <Input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full"
      />

      <div className="flex flex-row flex-wrap gap-sq-1-8 w-full">
        <Badge
          variant={selectedTopics.length === 0 ? "default" : "outline"}
          className="cursor-pointer"
          onClick={clearTopics}
        >
          {t("allTopics")}
        </Badge>
        {topics.map(topic => (
          <Badge
            key={topic}
            variant={selectedTopics.includes(topic) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTopic(topic)}
          >
            {topic}
          </Badge>
        ))}
      </div>

      <div className="flex flex-col gap-sq-1-2 w-full">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <BlogCard key={post.slug} {...post} locale={locale} />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-sq-1">
            {t("noResults")}
          </p>
        )}
      </div>
    </>
  );
}
