"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { PosDevice } from "@/utils/types/PosDevices"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"



type UserActionsProps = {
    row: PosDevice;
    onView: (PosDevice: PosDevice) => void;
    onEdit: (PosDevice: PosDevice) => void;
    onDelete: (PosDevice: PosDevice) => void;
  
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


const StatusCell = ({ row }: { row: Row<PosDevice> }) => {
    const status = row.original.status
    return (
        <>
            <div className={status =="online" ? "bg-green-500 p-1 w-full max-w-lg rounded-2xl" : "bg-red-500 p-2 rounded-2xl"}>
               <p >{status =="online" ?  <p className="text-green-100">Online</p> : <p>Offline</p> }</p>             </div>
        </>
    )
}




// const DescriptionCell = ({ row }: { row: Row<PosDevice> }) => {
//     const description = row.original
//     return (
//         <>
//             <div className="max-h-[100px] overflow-hidden text-ellipsis">
//                 <p className="line-clamp-3">{description.description}</p>
//             </div>
//         </>
//     )
// }

export const PosDeviceColumns = (
    setViewUser: (PosDevice: PosDevice | null) => void,
    setEditUser: (PosDevice: PosDevice | null) => void,
    onDelete: (PosDevice: PosDevice) => void,
  
): ColumnDef<PosDevice>[] => [
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
            accessorKey: "business_name",
              header: "Entity",
        },
         {
            accessorKey: "serial_number",
              header: "Serial Number",
        },
         {
            accessorKey: "current_app_version",
              header: "Current app version",
        },
        
        {
            accessorKey: "status",
            header: "Status",
            cell:StatusCell
        },

       
        {
            accessorKey: "last_long",
            header: "Last known longitude",
       
        },
        
         {
            accessorKey: "last_lat",
              header: "Last known latitude",
        },

         {
            accessorKey: "loc_last",
              header: "Location last updated",
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