import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"w-full rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 ease-in-out focus:border-transparent focus:ring-2 focus:ring-primary sm:text-sm",
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Input.displayName = "Input";

export { Input };
