import { Card, CardContent, CardHeader } from "./ui/card";
import { H4, P, Small } from "./text";

interface ExperienceCardProps {
  role: string;
  company: string;
  period: string;
  description: string;
}

const ExperienceCard = ({
  role,
  company,
  period,
  description,
}: ExperienceCardProps) => {
  return (
    <Card className="p-sq-1-2">
      <CardHeader className="gap-sq-1-8">
        <H4>{role}</H4>
        <div className="flex items-center gap-sq-1-8">
          <Small>{company}</Small>
          <span className="text-muted-foreground">•</span>
          <Small>{period}</Small>
        </div>
      </CardHeader>
      <CardContent className="pt-sq-1-8">
        <P>{description}</P>
      </CardContent>
    </Card>
  );
};

export { ExperienceCard, type ExperienceCardProps };
