import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
	HTMLTextAreaElement,
	React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
	return (
		<textarea
			className={cn(
				"min-h-[100px] w-full resize-y rounded-xl border border-gray-200 px-4 py-2 text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 ease-in-out focus:border-transparent focus:ring-2 focus:ring-primary",
				className
			)}
			ref={ref}
			{...props}
		/>
	);
});
Textarea.displayName = "Textarea";

export { Textarea };
