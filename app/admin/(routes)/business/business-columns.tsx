"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Business } from "@/utils/types/Business"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"



type UserActionsProps = {
    row: Business;
    onView: (Business: Business) => void;
    onEdit: (Business: Business) => void;
    onDelete: (Business: Business) => void;

};



const UserActions: React.FC<UserActionsProps> = ({ row, onEdit, onDelete }) => {

    const businessID = row.id

    const router = useRouter()

    const handleViewUser = async() =>{
        
        router.push(`/admin/business/${businessID}`)
    }

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
                    <DropdownMenuItem onClick={() => handleViewUser()}>View</DropdownMenuItem>
                    <DropdownMenuItem  onClick={() => onEdit(row)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="hidden" onClick={() => onDelete(row)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    );
};




const StatusCell = ({ row }: { row: Row<Business> }) => {
    const status = row.original.status === true
    return (
        <>
             <div className={`p-1 w-full max-w-lg rounded-2xl text-white ${status ? "bg-green-500" : "bg-red-500"}`}>
      {status ? <p>Active</p> : <p>Inactive</p>}
    </div>
        </>
    )
}

export const BusinessColumns = (
    setViewUser: (Business: Business | null) => void,
    setEditUser: (Business: Business | null) => void,
    onDelete: (Business: Business) => void,

): ColumnDef<Business>[] => [
        {
            accessorKey: "name",
            header: "Business name",
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                         Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },

        {
            accessorKey: "email",
            header: "Email",
        },

        {
            accessorKey: "phone",
            header: "Phone"
        },
        {
            accessorKey: "address",
            header: "Address"
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: StatusCell
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