import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// This component wraps its children in a container
// that limits the maximum width and adds horizontal padding.
const MaxWidthWrapper = ({
    className,
    children,
}: {
    className?: string;
    children?: ReactNode;
}) => {
    return (
        // Merges default styling with any extra classes passed in
        <div
            className={cn("h-full mx-auto w-full max-w-screen-xl px-2.5 md:px 20", className)}
        >
            {children}
        </div>
    );
};

export default MaxWidthWrapper;