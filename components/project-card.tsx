import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { H3, P } from "./text";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  tagAttributes: {
    label: string;
    variant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "ghost"
      | "link";
    icon: React.ReactNode;
  }[];
  linkAttributes: {
    href: string;
    label: string;
    icon: React.ReactNode;
  }[];
}

const ProjectCard = ({
  title,
  description,
  tagAttributes,
  linkAttributes,
}: ProjectCardProps) => {
  return (
    <Card className="p-sq-1-2">
      <CardHeader className="gap-sq-1-4">
        <div className="flex flex-row flex-wrap gap-sq-1-8">
          {tagAttributes.map(tag => (
            <Badge key={tag.label} variant={tag.variant}>
              {tag.icon}
              {tag.label}
            </Badge>
          ))}
        </div>
        <H3>{title}</H3>
      </CardHeader>
      <CardContent className="pt-sq-1-8">
        <P>{description}</P>
      </CardContent>
      <CardFooter className="pt-sq-1-4">
        <div className="flex flex-row flex-wrap gap-sq-1-4">
          {linkAttributes.map(link => (
            <Link key={link.href} href={link.href}>
              <Button variant="secondary">
                {link.icon}
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export { ProjectCard, type ProjectCardProps };
