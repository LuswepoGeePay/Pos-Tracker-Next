"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { LHistory } from "@/utils/types/PosDevices"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"



type UserActionsProps = {
    row: LHistory;
    onView: (LHistory: LHistory) => void;
    onEdit: (LHistory: LHistory) => void;
    onDelete: (LHistory: LHistory) => void;
    onViewMap: (LHistory: LHistory) => void;

};



const UserActions: React.FC<UserActionsProps> = ({ row,  onViewMap, onView, onEdit, onDelete }) => {


    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onViewMap(row)}>View on Map</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onView(row)}>View Details</DropdownMenuItem>
                    <DropdownMenuItem className="hidden" onClick={() => onEdit(row)}>Edit</DropdownMenuItem>

                    <DropdownMenuItem className="hidden" onClick={() => onDelete(row)}>Delete</DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

        </>
    );
};




const LocationCell = ({ row }: { row: Row<LHistory> }) => {
    const location = row.original
    return (
        <>
           <div className="flex gap-2">
            <p>{location.region}{","}</p>
            <p>{location.city}</p>

           </div>
        </>
    )
}

export const LocationColumns = (
    setViewUser: (LHistory: LHistory | null) => void,
    setEditUser: (LHistory: LHistory | null) => void,
    onDelete: (LHistory: LHistory) => void,
     onViewMap: (LHistory: LHistory) => void

): ColumnDef<LHistory>[] => [
        {
            accessorKey: "posdevice_id",
            header: "POS Device ID",
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Device Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },

        {
            accessorKey: "longitude",
            header: "Longitude",
        },

        {
            accessorKey: "latitude",
            header: "Latitude"
        },
        {
            accessorKey: "region",
            header: "Location",
            cell: LocationCell

        },
        {
            accessorKey: "timestamp",
            header: "Ping Time",
        },


        {
            id: "Actions",
            header: "Actions",
            cell: ({ row }) => (
                <UserActions
                    row={row.original}
                    onView={setViewUser}
                    onEdit={setEditUser}
                    onDelete={onDelete}
                       onViewMap={onViewMap}

                />
            ),
        }
    ]