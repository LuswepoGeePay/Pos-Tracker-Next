"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { App } from "@/utils/types/Apps"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"



type UserActionsProps = {
    row: App;
    onView: (App: App) => void;
    onEdit: (App: App) => void;
    onDelete: (App: App) => void;
  
};



const UserActions: React.FC<UserActionsProps> = ({ row, onView, onEdit, onDelete }) => {

    const appID = row.id;
      const router = useRouter()
    
      const handleAddApk = () => {
        router.push(`/admin/apps/versions/${appID}`)
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
                    <DropdownMenuItem onClick={handleAddApk}>Add apk</DropdownMenuItem>

                    <DropdownMenuItem onClick={() => onView(row)}>View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(row)}>Edit</DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => onDelete(row)}>Delete</DropdownMenuItem>
                   
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    );
};




const DescriptionCell = ({ row }: { row: Row<App> }) => {
    const description = row.original
    return (
        <>
            <div className="max-h-[100px] overflow-hidden text-ellipsis">
                <p className="line-clamp-3">{description.description}</p>
            </div>
        </>
    )
}

export const AppColumns = (
    setViewUser: (App: App | null) => void,
    setEditUser: (App: App | null) => void,
    onDelete: (App: App) => void,
  
): ColumnDef<App>[] => [
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
            accessorKey: "description",
            header: "Description",
              cell: DescriptionCell
        },

        // {
        //     accessorKey: "createdAt",
        //     header: "Date Created"
        // },

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