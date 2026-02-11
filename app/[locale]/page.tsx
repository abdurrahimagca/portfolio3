import { HeroComponent } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { ServiceCard } from "@/components/service-card";
import { ExperienceCard } from "@/components/experience-card";
import {
  TagIcon,
  LinkIcon,
  CodeIcon,
  ServerIcon,
  SmartphoneIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react";
import { H2 } from "@/components/text";
import { getMessages } from "next-intl/server";

const iconMap: Record<string, LucideIcon> = {
  code: CodeIcon,
  server: ServerIcon,
  smartphone: SmartphoneIcon,
  settings: SettingsIcon,
  tag: TagIcon,
  link: LinkIcon,
};

type ServiceItem = {
  title: string;
  description: string;
  icon?: string;
};

type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  description: string;
};

type ProjectLink = {
  href: string;
  label: string;
  icon?: string;
};

type ProjectItem = {
  title: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
};

type Messages = {
  services: { title: string; items: ServiceItem[] };
  experiences: { title: string; items: ExperienceItem[] };
  projects: { title: string; items: ProjectItem[] };
};

export default async function Page() {
  const messages = (await getMessages()) as unknown as Messages;

  const { services, experiences, projects } = messages;

  return (
    <div className="flex flex-col items-center gap-sq-1">
      <HeroComponent />

      <H2 className="text-primary">{services.title}</H2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-sq-1-2 w-full">
        {services.items.map(service => {
          const Icon = service.icon ? iconMap[service.icon] : undefined;
          return (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              icon={Icon ? <Icon className="w-5 h-5" /> : undefined}
            />
          );
        })}
      </div>

      <H2 className="text-primary">{experiences.title}</H2>
      <div className="flex flex-col gap-sq-1-2 w-full">
        {experiences.items.map(exp => (
          <ExperienceCard
            key={exp.role}
            role={exp.role}
            company={exp.company}
            period={exp.period}
            description={exp.description}
          />
        ))}
      </div>

      <H2 className="text-primary">{projects.title}</H2>
      <div className="flex flex-col gap-sq-1-2 w-full">
        {projects.items.map(project => {
          const tagAttributes = project.tags.map(tag => ({
            label: tag,
            variant: "default" as const,
            icon: <TagIcon className="w-4 h-4" />,
          }));

          const linkAttributes = project.links
            .filter(link => link.href && link.href !== "N/A")
            .map(link => {
              const Icon = link.icon ? iconMap[link.icon] : undefined;
              return {
                href: link.href,
                label: link.label,
                icon: Icon ? <Icon className="w-4 h-4" /> : undefined,
              };
            });

          return (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              tagAttributes={tagAttributes}
              linkAttributes={linkAttributes}
            />
          );
        })}
      </div>
    </div>
  );
}
