"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { User } from "@/utils/types/User"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

type UserActionsProps = {
    row: User;
    onView: (User: User) => void;
    onEdit: (User: User) => void;
    onDelete: (User: User) => void;
  
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




const StatusCell = ({ row }: { row: Row<User> }) => {
      const isActive = row.original.status === true;
    return (
       <div className={`p-1 w-full max-w-lg rounded-2xl text-white ${isActive ? "bg-green-500" : "bg-red-500"}`}>
      {isActive ? <p>Active</p> : <p>Inactive</p>}
    </div>
    )
}


const RoleCell = ({ row }: { row: Row<User> }) => {
      const role = row.original
    return (
     <>
     <p className="capitalize">{role.role}</p>
     </>
    )
}


export const UserColumns = (
    setViewUser: (User: User | null) => void,
    setEditUser: (User: User | null) => void,
    onDelete: (User: User) => void,
  
): ColumnDef<User>[] => [
      {
            accessorKey: "id",
            header: "Id",
            
        },
        {
            accessorKey: "fullname",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                      Full Name
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
            accessorKey: "role",
              header: "Role",
              cell:RoleCell
        },
      
        
         {
            accessorKey: "status",
              header: "Account Status",
              cell:StatusCell
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