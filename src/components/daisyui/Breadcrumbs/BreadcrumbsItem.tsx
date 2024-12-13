import Link from "next/link";
import { LiHTMLAttributes, ReactElement, forwardRef } from "react";

export type BreadcrumbsItemProps = LiHTMLAttributes<HTMLLIElement> & {
    href?: string;
};

const BreadcrumbsItem = forwardRef<HTMLLIElement, BreadcrumbsItemProps>(
    ({ children, href, ...props }, ref): ReactElement => {
        return (
            <li {...props} ref={ref}>
                {href ? <Link href={href}>{children}</Link> : <>{children}</>}
            </li>
        );
    },
);

BreadcrumbsItem.displayName = "Breadcrumbs Item";

export default BreadcrumbsItem;
