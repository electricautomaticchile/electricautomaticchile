import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
  children: React.ReactNode;
}

export function Breadcrumb({
  separator = <ChevronRight className="h-4 w-4" />,
  children,
  className,
  ...props
}: BreadcrumbProps) {
  const childrenArray = React.Children.toArray(children);
  const childrenWithSeparators = childrenArray.map((child, index) => {
    if (index === childrenArray.length - 1) {
      return child;
    }
    return (
      <React.Fragment key={index}>
        {child}
        <li className="mx-2 text-gray-400 select-none flex items-center">{separator}</li>
      </React.Fragment>
    );
  });

  return (
    <nav aria-label="Breadcrumb" {...props}>
      <ol className={cn("flex items-center", className)}>
        {childrenWithSeparators}
      </ol>
    </nav>
  );
}

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

export function BreadcrumbItem({ children, className, ...props }: BreadcrumbItemProps) {
  return (
    <li className={cn("inline-flex items-center", className)} {...props}>
      {children}
    </li>
  );
}

export interface BreadcrumbLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  href: string;
  isCurrentPage?: boolean;
  children: React.ReactNode;
}

export function BreadcrumbLink({
  asChild = false,
  href,
  isCurrentPage = false,
  children,
  className,
  ...props
}: BreadcrumbLinkProps) {
  const Comp = asChild ? React.Fragment : "a";
  
  return (
    <Comp
      href={href}
      aria-current={isCurrentPage ? "page" : undefined}
      className={cn(
        "inline-flex items-center text-sm font-medium transition-colors",
        isCurrentPage
          ? "text-gray-800 dark:text-gray-50 pointer-events-none"
          : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
} 