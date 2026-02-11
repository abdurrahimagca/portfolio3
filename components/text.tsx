import { cn } from "@/lib/utils";

type TypographyProps<T extends React.ElementType = "p"> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

function H1({ className, ...props }: TypographyProps<"h1">) {
  return (
    <h1
      className={cn(
        "text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl font-[family-name:var(--font-playfair)]",
        className
      )}
      {...props}
    />
  );
}

function H2({ className, ...props }: TypographyProps<"h2">) {
  return (
    <h2
      className={cn(
        "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl",
        className
      )}
      {...props}
    />
  );
}

function H3({ className, ...props }: TypographyProps<"h3">) {
  return (
    <h3
      className={cn(
        "text-xl font-semibold tracking-tight text-foreground sm:text-2xl",
        className
      )}
      {...props}
    />
  );
}

function H4({ className, ...props }: TypographyProps<"h4">) {
  return (
    <h4
      className={cn(
        "text-lg font-medium tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}

function P({ className, ...props }: TypographyProps<"p">) {
  return (
    <p
      className={cn(
        "text-base leading-relaxed text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function Lead({ className, ...props }: TypographyProps<"p">) {
  return (
    <p
      className={cn(
        "text-lg leading-relaxed text-muted-foreground sm:text-xl",
        className
      )}
      {...props}
    />
  );
}

function Small({ className, ...props }: TypographyProps<"span">) {
  return (
    <span
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function InlineCode({ className, ...props }: TypographyProps<"code">) {
  return (
    <code
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 font-mono text-sm",
        className
      )}
      {...props}
    />
  );
}

export { H1, H2, H3, H4, P, Lead, Small, InlineCode };
