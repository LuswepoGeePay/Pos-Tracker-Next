"use client"

import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import toast from 'react-hot-toast'
import { api_endpoints } from '@/utils/api_constants'
import { User } from '@/utils/types/User'
import { UserDataTable } from './users-data-table'
import { UserColumns } from './users-columns'
import { useRouter } from 'next/navigation'
import ViewUserDialog from '@/components/custom/dialogs/users/view-user-dialog'
import EditUserDialog from '@/components/custom/dialogs/users/edit-user-dialog'


const AllUsersPage = () => {

  const [userData, setUserData] = useState<User[]>([])
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter()
  const [count, setCount] = useState<number | null>(0);


  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [totalPages, setTotalPages] = useState(0);


  const fetchUsers = async () => {
    
    const queryParams = new URLSearchParams({
      page: String(pagination.pageIndex + 1),
      pageSize: String(pagination.pageSize),
    });

    const response = await fetch(`${api_endpoints.getUsers}?${queryParams}`, {
      headers: {
        "Authorization": `Bearer ${session?.accessToken}`
      }
    });

    

    const responseBody = await response.json();
    if (responseBody["status"] === "success") {
      if (responseBody?.users?.user) {
        const users = responseBody.users.user.map((user: User) => ({
          id: user.id,
          fullname: user.fullname,
          role: user.role,
          status: user.status ?? false,
          email: user.email
        }))
        setUserData(users);
        setTotalPages(responseBody.users.totalPages || 0);
        setCount(responseBody.users.count || 0)
      } // Set the fetched data
    }
    else if (responseBody["status"] == "failure") {
      toast.error(`${responseBody.error}\n${responseBody.detail}`)
    }


    else {
      toast.error("Failed to fetch user version data");
    }

  }

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchUsers();
    }
  }, [status, session?.accessToken, pagination.pageIndex, pagination.pageSize]);

  const handleDeleteUser = async () => {
    if (deleteUser) {
      try {
        const response = await fetch(`${api_endpoints.deleteUser}/${deleteUser.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${session?.accessToken}`
          }
        });

        const responseBody = await response.json();

        if (responseBody["status"] === "success") {
          toast.success(responseBody["message"]);
          window.location.reload()
          fetchUsers(); // Refresh the data instead of reloading the page
        } else {
          toast.error(responseBody["error"]);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catch (error) {
        toast.error(`Something went wrong, please try again`);
      } finally {
        setDeleteUser(null);
      }
    }
  };


  return (
    <main className='m-10'>


      <Card className='w-[340px] md:w-full my-20'>

        <CardContent className='p-8'>
          <div className='mb-10 '>
            <div className='flex justify-between'>
              <div>
                <p className='text-2xl font-bold'>Users</p>
                <p className='text-sm mb-1'>View, edit, delete, users</p>

              </div>
              <Button
                onClick={() => router.push("/admin/users/create")}
              >
                Create
              </Button>

            </div>
            <Separator />
          </div>


              <div className='flex justify-between'>
                <div>

                </div>
                <div className='flex gap-3'>
                  <p className='text-sm font-semibold'>Total Users:</p>
                  <p className='text-sm font-semibold'>{count}</p>
                </div>
              </div>

          <div className={viewUser || editUser ? 'hidden ' : ''}>
            <UserDataTable
              columns={UserColumns(setViewUser, setEditUser, setDeleteUser)}
              data={userData} />

          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.max(prev.pageIndex - 1, 0),
                }))
              }
              disabled={pagination.pageIndex === 0}
            >
              Previous
            </Button>
            <span>
              Page {pagination.pageIndex + 1} of {totalPages}
            </span>
            <Button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex + 1,
                }))
              }
              disabled={pagination.pageIndex + 1 >= totalPages}
            >
              Next
            </Button>
          </div>

          <ViewUserDialog
            user={viewUser}
            open={!!viewUser}
            onClose={() => setViewUser(null)}
          />
          <EditUserDialog
            user={editUser}
            open={!!editUser}
            onClose={() => setEditUser(null)}
          />

          <Dialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
            <DialogContent className='w-[350px] md:w-[800px] rounded-lg'>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to delete this User? This action cannot be undone.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </CardContent>
      </Card>
    </main>
  )
}

export default AllUsersPage