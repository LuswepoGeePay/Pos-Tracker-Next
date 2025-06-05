"use client"

import * as React from "react"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function PosDeviceDataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0, // Start at the first page (zero-based index)
        pageSize: 10, // Default number of items per page
    });

    const table = useReactTable({
        data,
        columns,
        pageCount: -1, // Set to -1 for server-side pagination
        state: {
            sorting,
            columnFilters,
            pagination,
        },
        manualPagination: true, // Enable manual (server-side) pagination
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="w-full space-y-4 dark:bg-[#0d1b2a]">
            <div className="flex flex-col sm:flex-row sm:items-center py-4 gap-3 dark:bg-[#0d1b2a]">
                <Input
                    placeholder="Filter names..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm dark:bg-[#0d1b2a] dark:border-gray-600"
                />
            </div>
            
            {/* Mobile view (card-like layout) */}
            <div className="block sm:hidden">
                <div className="space-y-4">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <div
                                key={row.id}
                                className="bg-white dark:bg-[#1b2a3b] p-4 rounded-lg shadow border dark:border-gray-600"
                            >
                                {row.getVisibleCells().map((cell) => {
                                    // Skip rendering the Actions column header in the card view
                                    if (cell.column.id === "Actions") {
                                        return (
                                            <div key={cell.id} className="mt-4 flex justify-end">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        );
                                    }
                                    if (cell.column.id === "about") {
                                        return (
                                            <div key={cell.id} className="hidden">
                                                <div >{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                                            </div>
                                        );
                                    }

                                    // For other columns, show the label and value
                                    const header = cell.column.columnDef.header;
                                    const headerContent = typeof header === 'string' 
                                        ? header 
                                        : cell.column.id.charAt(0).toUpperCase() + cell.column.id.slice(1);

                                    return (
                                        <div key={cell.id} className="flex justify-between py-2 border-b dark:border-gray-600 last:border-0">
                                            <span className="font-medium">
                                                {headerContent}
                                            </span>
                                            <span>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4">No results.</div>
                    )}
                </div>
            </div>

            {/* Desktop view (traditional table) */}
            <div className="hidden sm:block">
                <div className="rounded-md border dark:border-gray-600">
                    <ScrollArea className="w-full">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className="text-center">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="text-center">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}