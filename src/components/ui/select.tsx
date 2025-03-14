"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { FaCircle } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { Label } from "./label";

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Root
			className={cn("flex flex-row gap-5", className)}
			{...props}
			ref={ref}
		/>
	);
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
		label?: string;
	}
>(({ className, label, id, ...props }, ref) => {
	return (
		<div className="relative flex items-center gap-2">
			<style jsx global>{`
				.radio-input:not(:checked):not(:active):hover {
					background-color: #f9fafb;
				}
			`}</style>
			<div className="relative flex items-center justify-center">
				<RadioGroupPrimitive.Item
					ref={ref}
					className={cn(
						"radio-input group peer relative h-[18px] w-[18px] shrink-0 appearance-none rounded-full border border-gray-300 bg-white transition-all duration-150 checked:border-blue-500 checked:bg-white focus:border-blue-500 focus:outline-none active:scale-90 active:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
						className
					)}
					{...props}
				>
					<RadioGroupPrimitive.Indicator className="absolute inset-0 flex items-center justify-center text-blue-500">
						<FaCircle className="h-[10px] w-[10px] origin-center scale-100 opacity-100 transition-all duration-200" />
					</RadioGroupPrimitive.Indicator>
				</RadioGroupPrimitive.Item>
			</div>
			{label && (
				<Label htmlFor={id} className="cursor-pointer">
					{label}
				</Label>
			)}
		</div>
	);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
