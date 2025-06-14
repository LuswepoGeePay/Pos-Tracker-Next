"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {  AppVersion } from "@/utils/types/Apps"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"



type UserActionsProps = {
    row: AppVersion;
    onView: (AppVersion: AppVersion) => void;
    onEdit: (AppVersion: AppVersion) => void;
    onDelete: (AppVersion: AppVersion) => void;
  
};



const UserActions: React.FC<UserActionsProps> = ({ row, onView, onEdit, onDelete }) => {


    
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

                    <DropdownMenuItem onClick={() => onView(row)}>View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(row)}>Edit</DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => onDelete(row)}>Delete</DropdownMenuItem>
                   
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    );
};




const DescriptionCell = ({ row }: { row: Row<AppVersion> }) => {
    const description = row.original
    return (
        <>
            <div className="max-h-[100px] overflow-hidden text-ellipsis">
                <p className="line-clamp-3">{description.release_notes}</p>
            </div>
        </>
    )
}

const StableCell = ({ row }: { row: Row<AppVersion> }) => {
    const latest = row.original
    return (
        <>
            <div className={latest.is_latest_stable ?`bg-green-500 text-white rounded-2xl`: `bg-red-500 text-white rounded-2xl`}>
                <p className="">{latest.is_latest_stable ? "Yes" :"No"}</p>
            </div>
        </>
    )
}



const ActiveCell = ({ row }: { row: Row<AppVersion> }) => {
    const active = row.original
    return (
        <>
            <div className={active.is_active ?`bg-green-500 text-white rounded-2xl `: ` bg-red-500 text-white rounded-2xl`}>
                <p className="">{active.is_active ? "Yes" :"No"}</p>
            </div>
        </>
    )
}


export const VersionColumns = (
    setViewUser: (AppVersion: AppVersion | null) => void,
    setEditUser: (AppVersion: AppVersion | null) => void,
    onDelete: (AppVersion: AppVersion) => void,
  
): ColumnDef<AppVersion>[] => [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                      App Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
         {
            accessorKey: "version_number",
              header: "Version Number",
        },
        {
            accessorKey: "release_notes",
            header: "Release Notes",
              cell: DescriptionCell
        },
        
         {
            accessorKey: "is_latest_stable",
              header: "Latest",
              cell:StableCell
        },
           {
            accessorKey: "is_active",
              header: "Active",
              cell:ActiveCell
        },
        {
            accessorKey: "released_at",
            header: "Date Created"
        
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
                 
                />
            ),
        }
    ]