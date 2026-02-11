import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { H3, P, Small } from "./text";
import { Link } from "@/i18n/routing";

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  topics: string[];
  createdAt: string;
  locale: string;
}

const BlogCard = ({
  slug,
  title,
  description,
  topics,
  createdAt,
  locale,
}: BlogCardProps) => {
  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(createdAt));

  return (
    <Link href={`/blog/${slug}`} className="block group">
      <Card className="p-sq-1-2 transition-colors group-hover:border-primary/40">
        <CardHeader className="gap-sq-1-4">
          <div className="flex flex-row flex-wrap gap-sq-1-8">
            {topics.map(topic => (
              <Badge key={topic} variant="outline">
                {topic}
              </Badge>
            ))}
          </div>
          <H3 className="group-hover:text-primary transition-colors">
            {title}
          </H3>
        </CardHeader>
        <CardContent className="pt-sq-1-8">
          <P className="line-clamp-2">{description}</P>
        </CardContent>
        <CardFooter className="pt-sq-1-4">
          <Small>{formattedDate}</Small>
        </CardFooter>
      </Card>
    </Link>
  );
};

export { BlogCard, type BlogCardProps };
