import type * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '../../lib/utils/cn';

type BreadcrumbProps = React.ComponentPropsWithoutRef<'nav'> & {
  separator?: React.ReactNode;
};

const Breadcrumb = ({ ...props }: BreadcrumbProps) => (
  <nav aria-label="breadcrumb" {...props} />
);
Breadcrumb.displayName = 'Breadcrumb';

type BreadcrumbListProps = React.ComponentPropsWithoutRef<'ol'>;

const BreadcrumbList = ({ className, ...props }: BreadcrumbListProps) => (
  <ol
    className={cn(
      'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
      className
    )}
    {...props}
  />
);
BreadcrumbList.displayName = 'BreadcrumbList';

type BreadcrumbItemProps = React.ComponentPropsWithoutRef<'li'>;

const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => (
  <li
    className={cn('inline-flex items-center gap-1.5', className)}
    {...props}
  />
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

type BreadcrumbLinkProps = React.ComponentPropsWithoutRef<'a'> & {
  asChild?: boolean;
};

const BreadcrumbLink = ({
  asChild,
  className,
  ...props
}: BreadcrumbLinkProps) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      className={cn('transition-colors hover:text-foreground', className)}
      {...props}
    />
  );
};
BreadcrumbLink.displayName = 'BreadcrumbLink';

type BreadcrumbPageProps = React.ComponentPropsWithoutRef<'a'>;

const BreadcrumbPage = ({ className, ...props }: BreadcrumbPageProps) => (
  <a
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('font-normal text-foreground', className)}
    {...props}
  />
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:w-3.5 [&>svg]:h-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
