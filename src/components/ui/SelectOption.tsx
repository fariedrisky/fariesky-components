"use client";

import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectGroup,
} from "@/components/ui/select";

interface SelectOption {
	value: string;
	label: string;
}

interface SelectOptionProps {
	options: SelectOption[];
	value: string | undefined;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	id?: string;
	disabled?: boolean;
}

export default function SelectOption({
	options,
	value,
	onChange,
	placeholder = "Select an option",
	className = "",
	id,
	disabled = false,
}: SelectOptionProps) {
	const selectId =
		id || `select-${Math.random().toString(36).substring(2, 9)}`;

	return (
		<Select value={value} onValueChange={onChange} disabled={disabled}>
			<SelectTrigger id={selectId} className={className}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
