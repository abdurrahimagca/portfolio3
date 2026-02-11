import { Card, CardContent, CardHeader } from "./ui/card";
import { H4, P } from "./text";

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const ServiceCard = ({ title, description, icon }: ServiceCardProps) => {
  return (
    <Card className="p-sq-1-2">
      <CardHeader className="gap-sq-1-4">
        <div className="flex items-center gap-sq-1-4">
          {icon && <span className="text-primary shrink-0">{icon}</span>}
          <H4>{title}</H4>
        </div>
      </CardHeader>
      <CardContent className="pt-sq-1-8">
        <P>{description}</P>
      </CardContent>
    </Card>
  );
};

export { ServiceCard, type ServiceCardProps };
