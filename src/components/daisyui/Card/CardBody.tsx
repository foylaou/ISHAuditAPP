import { HTMLAttributes, forwardRef } from "react";

import { cn } from "@/helpers";

import { IComponentBaseProps } from "../types";

export type CardBodyProps = HTMLAttributes<HTMLDivElement> & IComponentBaseProps;

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(({ className, ...props }, ref) => (
    <div {...props} className={cn("card-body", className)} ref={ref} />
));

CardBody.displayName = "Card Body";

export default CardBody;
