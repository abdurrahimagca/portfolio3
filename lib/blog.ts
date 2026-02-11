import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content", "blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  topics: string[];
  keywords: string[];
  createdAt: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export function getAllPosts(locale: string): BlogPostMeta[] {
  const localeDir = path.join(contentDir, locale);

  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const files = fs.readdirSync(localeDir).filter(f => f.endsWith(".mdx"));

  const posts: BlogPostMeta[] = files.map(file => {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(localeDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      topics: data.topics ?? [],
      keywords: data.keywords ?? [],
      createdAt: data.createdAt ?? "",
    };
  });

  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPostBySlug(slug: string, locale: string): BlogPost | null {
  const filePath = path.join(contentDir, locale, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    topics: data.topics ?? [],
    keywords: data.keywords ?? [],
    createdAt: data.createdAt ?? "",
    content,
  };
}

export function getAllTopics(locale: string): string[] {
  const posts = getAllPosts(locale);
  const topicSet = new Set<string>();

  for (const post of posts) {
    for (const topic of post.topics) {
      topicSet.add(topic);
    }
  }

  return Array.from(topicSet).sort();
}

export function getAllSlugs(): string[] {
  const enDir = path.join(contentDir, "en");

  if (!fs.existsSync(enDir)) {
    return [];
  }

  return fs
    .readdirSync(enDir)
    .filter(f => f.endsWith(".mdx"))
    .map(f => f.replace(/\.mdx$/, ""));
}
