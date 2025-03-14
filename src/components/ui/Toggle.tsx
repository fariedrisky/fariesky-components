interface ToggleProps {
	checked: boolean;
	disabled?: boolean;
	onChange: () => void;
}

export default function Toggle({
	checked,
	disabled = false,
	onChange,
}: ToggleProps) {
	return (
		<label className="relative inline-flex cursor-pointer items-center">
			<input
				type="checkbox"
				className="peer sr-only"
				checked={checked}
				disabled={disabled}
				onChange={onChange}
			/>
			<div
				className={`peer h-6 w-11 rounded-full bg-gray-100 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-200 after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-[#00D1FF] peer-checked:after:translate-x-full peer-checked:after:border-[#00D1FF] peer-checked:after:bg-white peer-focus:outline-none ${
					disabled
						? "cursor-not-allowed opacity-50"
						: "cursor-pointer"
				}`}
			/>
		</label>
	);
}
