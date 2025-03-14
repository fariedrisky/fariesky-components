"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
		label?: React.ReactNode;
	}
>(({ className, label, id, ...props }, ref) => (
	<div className="flex items-center gap-3">
		<div className="relative flex items-center justify-center">
			<style jsx global>{`
				.checkbox-root:not([data-state="checked"]):not(:active):hover {
					background-color: #f9fafb;
				}

				.checkmark-path {
					stroke-dasharray: 23;
					stroke-dashoffset: 23;
					transition: stroke-dashoffset 250ms ease-in-out;
				}

				.checkbox-root[data-state="checked"] .checkmark-path {
					stroke-dashoffset: 0;
					animation: draw-checkmark 250ms ease-in-out forwards;
				}

				@keyframes draw-checkmark {
					0% {
						stroke-dashoffset: 23;
					}
					100% {
						stroke-dashoffset: 0;
					}
				}
			`}</style>

			<CheckboxPrimitive.Root
				id={id}
				ref={ref}
				className={cn(
					"checkbox-root peer relative h-[18px] w-[18px] shrink-0 rounded-md border border-gray-300 bg-white transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-blue-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500",
					className
				)}
				{...props}
			>
				<CheckboxPrimitive.Indicator
					className={cn(
						"absolute inset-0 flex items-center justify-center text-white"
					)}
				>
					<svg
						viewBox="0 0 24 24"
						className="h-[14px] w-[14px]"
						fill="none"
						stroke="currentColor"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M4 12L9 17L20 5" className="checkmark-path" />
					</svg>
				</CheckboxPrimitive.Indicator>
			</CheckboxPrimitive.Root>
		</div>
		{label && (
			<Label htmlFor={id} className="cursor-pointer">
				{label}
			</Label>
		)}
	</div>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
