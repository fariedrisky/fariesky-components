"use client";

import React, { useState, ReactNode } from "react";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
	ColumnDef,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Pencil, Trash2, Loader2 } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import SelectOption from "@/components/ui/SelectOption";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Column<T> {
	key: keyof T | string;
	title: string;
	render?: (value: T[keyof T], item: T) => ReactNode;
}

export interface DetailField<T> {
	key: keyof T;
	label: string;
	render?: (value: T[keyof T], item: T) => ReactNode;
}

export interface DetailConfig<T> {
	fields: DetailField<T>[];
}

export interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	details?: DetailConfig<T>;
	showEntries?: boolean;
	showSearch?: boolean;
	onSearch?: (query: string) => void;
	onEntriesChange?: (entries: number) => void;
	onEdit?: (id: number) => void;
	onDelete?: (id: number) => void;
	mobileColumns?: string[];
	isLoading?: boolean; // New prop for loading state
}

export default function DataTable<T extends { id: number }>({
	data,
	columns,
	details,
	showEntries = true,
	showSearch = true,
	onSearch,
	onEntriesChange,
	onEdit,
	onDelete,
	mobileColumns = [],
	isLoading = false, // Added default value
}: DataTableProps<T>) {
	const [expandedRow, setExpandedRow] = useState<number | null>(null);
	const [globalFilter, setGlobalFilter] = useState<string>("");

	type TableRow = {
		original: T;
		index: number;
		getValue: (columnId: string) => T[keyof T];
	};

	// Check if there are any hidden fields or additional details to show
	const hasHiddenContent = () => {
		const visibleColumns =
			mobileColumns.length > 0 && window.innerWidth < 768
				? mobileColumns
				: columns.slice(0, 6).map((col) => col.key.toString());

		const hasHiddenColumns = columns.some(
			(col) => !visibleColumns.includes(col.key.toString())
		);
		const hasDetailFields = details?.fields && details.fields.length > 0;

		return hasHiddenColumns || hasDetailFields;
	};

	// Get detail fields for a row
	const getDetailFields = (row: T) => {
		// Get columns that aren't shown in the current view's table header
		const visibleColumns =
			mobileColumns.length > 0 && window.innerWidth < 768
				? mobileColumns
				: columns.slice(0, 6).map((col) => col.key.toString());

		const hiddenColumns = columns
			.filter((col) => !visibleColumns.includes(col.key.toString()))
			.map((col) => ({
				key: col.key as keyof T,
				label: col.title,
				render: col.render,
				value: row[col.key as keyof T],
				item: row,
			}));

		// Add any additional detail fields
		const additionalDetails =
			details?.fields.map((field) => ({
				key: field.key,
				label: field.label,
				render: field.render,
				value: row[field.key],
				item: row,
			})) || [];

		return [...hiddenColumns, ...additionalDetails];
	};

	const tableColumns: ColumnDef<T>[] = [
		{
			id: "expander",
			header: "#",
			cell: ({ row }: { row: TableRow }) => (
				<div className="flex items-center gap-2">
					{hasHiddenContent() && (
						<Button
							variant="ghost"
							onClick={() =>
								setExpandedRow(
									expandedRow === row.original.id
										? null
										: row.original.id
								)
							}
							className="!p-2 hover:bg-gray-100"
						>
							{expandedRow === row.original.id ? (
								<ChevronUp className="h-4 w-4" />
							) : (
								<ChevronDown className="h-4 w-4" />
							)}
						</Button>
					)}
					<span className="text-xs sm:text-sm">{row.index + 1}</span>
				</div>
			),
		},
		...columns.map((col) => ({
			id: col.key.toString(),
			header: col.title,
			accessorKey: col.key.toString(),
			cell: ({ row }: { row: TableRow }) => {
				const value = row.getValue(col.key.toString());
				const isMobileColumn = mobileColumns.includes(
					col.key.toString()
				);
				return (
					<div
						className={cn(
							"text-xs sm:text-sm",
							!isMobileColumn &&
								mobileColumns.length > 0 &&
								"hidden md:block"
						)}
					>
						{col.render
							? col.render(value, row.original)
							: String(value)}
					</div>
				);
			},
		})),
		{
			id: "actions",
			header: "Aksi",
			cell: ({ row }: { row: TableRow }) => (
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onEdit?.(row.original.id)}
						className="h-8 w-8 p-0 hover:bg-gray-100"
						disabled={isLoading}
					>
						<Pencil className="h-4 w-4 text-blue-500" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onDelete?.(row.original.id)}
						className="h-8 w-8 p-0 hover:bg-gray-100"
						disabled={isLoading}
					>
						<Trash2 className="h-4 w-4 text-red-500" />
					</Button>
				</div>
			),
		},
	];

	const table = useReactTable({
		data,
		columns: tableColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			globalFilter,
			pagination: {
				pageSize: showEntries ? 10 : data.length,
				pageIndex: 0,
			},
		},
		onGlobalFilterChange: setGlobalFilter,
	});

	const renderDetailField = (
		field: DetailField<T> & { value: T[keyof T]; item: T }
	) => {
		if (field.render) {
			return field.render(field.value, field.item);
		}

		if (typeof field.value === "boolean") {
			return field.value ? "Ya" : "Tidak";
		}

		if (field.value instanceof Date) {
			return field.value.toLocaleDateString("id-ID");
		}

		return String(field.value ?? "-");
	};

	const entriesOptions = [
		{ value: "10", label: "10" },
		{ value: "25", label: "25" },
		{ value: "50", label: "50" },
	];

	return (
		<div>
			<div className="mb-4 flex flex-col gap-4 sm:flex-row">
				{showEntries && (
					<div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
						<span className="text-nowrap text-xs sm:text-sm">
							Show entries
						</span>
						<SelectOption
							options={entriesOptions}
							value={table
								.getState()
								.pagination.pageSize.toString()}
							onChange={(value) => {
								table.setPageSize(Number(value));
								onEntriesChange?.(Number(value));
							}}
							placeholder="10"
							className="w-24"
							disabled={isLoading}
						/>
					</div>
				)}

				{showSearch && (
					<div className="flex flex-col gap-2 sm:ml-auto sm:flex-row sm:items-center">
						<span className="text-xs sm:text-sm">Search:</span>
						<Input
							type="text"
							value={globalFilter}
							onChange={(e) => {
								setGlobalFilter(e.target.value);
								onSearch?.(e.target.value);
							}}
							placeholder="Search..."
							className="w-full sm:w-64"
							disabled={isLoading}
						/>
					</div>
				)}
			</div>

			<div className="overflow-x-auto rounded-lg">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const isRegularColumn = ![
										"expander",
										"actions",
									].includes(header.id);
									const isMobileColumn =
										mobileColumns.includes(header.id);
									return (
										<TableHead
											key={header.id}
											className={cn(
												"text-xs sm:text-sm",
												isRegularColumn &&
													!isMobileColumn &&
													mobileColumns.length > 0 &&
													"hidden md:table-cell"
											)}
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={columns.length + 2}
									className="h-24 text-center"
								>
									<div className="flex items-center justify-center">
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										<span className="text-sm text-gray-500">
											Memuat data...
										</span>
									</div>
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows.length > 0 ? (
							table.getRowModel().rows.map((row) => (
								<React.Fragment key={row.id}>
									<TableRow>
										{row.getVisibleCells().map((cell) => {
											const isRegularColumn = ![
												"expander",
												"actions",
											].includes(cell.column.id);
											const isMobileColumn =
												mobileColumns.includes(
													cell.column.id
												);
											return (
												<TableCell
													key={cell.id}
													className={cn(
														"text-xs sm:text-sm",
														isRegularColumn &&
															!isMobileColumn &&
															mobileColumns.length >
																0 &&
															"hidden md:table-cell"
													)}
												>
													{flexRender(
														cell.column.columnDef
															.cell,
														cell.getContext()
													)}
												</TableCell>
											);
										})}
									</TableRow>
									{hasHiddenContent() && (
										<tr>
											<td
												colSpan={columns.length + 2}
												className="p-0"
											>
												<div
													className={cn(
														"transform overflow-hidden transition-[max-height] duration-700 ease-in-out",
														expandedRow ===
															row.original.id
															? "max-h-screen"
															: "max-h-0"
													)}
												>
													<div className="bg-gray-50/50 p-4 md:p-6">
														<div className="flex flex-col space-y-4">
															{getDetailFields(
																row.original
															).map((field) => (
																<div
																	key={field.key.toString()}
																	className="flex min-w-0 items-start text-xs sm:text-sm"
																>
																	<div className="w-40 min-w-[10rem] shrink-0 font-medium text-gray-600">
																		{
																			field.label
																		}
																	</div>
																	<div className="shrink-0 px-2 font-medium">
																		:
																	</div>
																	<div className="flex-1 text-gray-900">
																		{renderDetailField(
																			field
																		)}
																	</div>
																</div>
															))}
														</div>
													</div>
												</div>
											</td>
										</tr>
									)}
								</React.Fragment>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length + 2}
									className="h-24 text-center"
								>
									<div className="text-sm text-gray-500">
										No data available
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{table.getRowModel().rows.length > 0 && !isLoading && (
				<div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage() || isLoading}
							className="px-3 py-1 disabled:opacity-50"
						>
							<span className="text-xs sm:text-sm">Previous</span>
						</Button>
						<Button
							variant="outline"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage() || isLoading}
							className="px-3 py-1 disabled:opacity-50"
						>
							<span className="text-xs sm:text-sm">Next</span>
						</Button>
					</div>
					<span className="text-xs sm:text-sm">
						Page{" "}
						<strong>
							{table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount()}
						</strong>
					</span>
				</div>
			)}
		</div>
	);
}
