import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ErrorMessagesProps {
	/**
	 * The error message content as children
	 */
	children?: ReactNode;

	/**
	 * Optional additional CSS classes
	 */
	className?: string;

	/**
	 * Whether to show the error even if it's empty (used for spacing)
	 */
	showEmpty?: boolean;
}

/**
 * ErrorMessages component for standardized display of form validation errors
 */
export default function ErrorMessages({
	children,
	className,
	showEmpty = false,
}: ErrorMessagesProps) {
	// Don't render anything if there's no message and we're not showing empty errors
	if (!children && !showEmpty) {
		return null;
	}

	return (
		<p
			className={cn(
				"mt-1 text-xs text-red-500",
				!children && "opacity-0",
				className
			)}
			role="alert"
			aria-live="polite"
		>
			{children || ""}
		</p>
	);
}
