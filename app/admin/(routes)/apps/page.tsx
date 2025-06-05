"use client"
import CreateAppForm from '@/components/custom/forms/apps/create-app-form'
import { App } from '@/utils/types/Apps'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AppDataTable } from './apps-data-table'
import { AppColumns } from './apps-columns'
import toast from 'react-hot-toast'
import { api_endpoints } from '@/utils/api_constants'
import ViewAppDialog from '@/components/custom/dialogs/apps/view-app-dialog'
import EditAppDialog from '@/components/custom/dialogs/apps/edit-app-dialog'


const AppsPage = () => {

  const [appData, setAppData] = useState<App[]>([])
  const [viewApp, setViewApp] = useState<App | null>(null);
  const [editApp, setEditApp] = useState<App | null>(null);
  const [deleteApp, setDeleteApp] = useState<App | null>(null);
const { data: session, status } = useSession();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [totalPages, setTotalPages] = useState(0);


  const fetchApps = async () => {
      console.log('first', session?.id)
    const body = {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    };

    const response = await fetch(api_endpoints.getApps, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.accessToken}`
      },
      body: JSON.stringify(body)
    });

    console.log('first', session?.accessToken)

    const responseBody = await response.json();
    if (responseBody["status"] === "success") {
      if (responseBody?.apps?.app) {
        const apps = responseBody.apps.app.map((app: App) => ({
          id: app.id,
          description:app.description,
          name:app.name
        }))
        setAppData(apps);
        setTotalPages(responseBody.apps.totalPages || 0);

        console.log('appData', appData)
      } // Set the fetched data
    }
    else if (responseBody["status"] == "failure") {
      toast.error(`${responseBody.error}\n${responseBody.detail}`)
    }


    else {
      toast.error("Failed to fetch app data");
    }

  }

useEffect(() => {
  if (status === 'authenticated' && session?.accessToken) {
    fetchApps();
  }
}, [status, session?.accessToken, pagination.pageIndex, pagination.pageSize]);

  const handleDeleteApp = async () => {
    if (deleteApp) {
      try {
        const response = await fetch(`${api_endpoints.deleteApp}/${deleteApp.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${session?.accessToken}`
          }
        });

        const responseBody = await response.json();

        if (responseBody["status"] === "success") {
          toast.success(responseBody["message"]);
          window.location.reload()
          fetchApps(); // Refresh the data instead of reloading the page
        } else {
          toast.error(responseBody["error"]);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catch (error) {
        toast.error(`Something went wrong, please try again`);
      } finally {
        setDeleteApp(null);
      }
    }
  };


  return (
    <main className='m-10'>

  

      <CreateAppForm />

      <Card className='w-[340px] md:w-full my-20'>

        <CardContent className='p-8'>
          <div className='mb-10'>
            <p className='text-2xl font-bold'>Applications</p>
            <p className='text-sm mb-1'>View, edit, delete, existing Applications</p>
            <Separator />
          </div>
          
          <div className={viewApp || editApp ? 'hidden ' : ''}>
            <AppDataTable
              columns={AppColumns(setViewApp, setEditApp, setDeleteApp)}
              data={appData} />

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

          <ViewAppDialog
            app={viewApp}
            open={!!viewApp}
            onClose={() => setViewApp(null)}
          />
          <EditAppDialog
            App={editApp}
            open={!!editApp}
            onClose={() => setEditApp(null)}
          />

          <Dialog open={!!deleteApp} onOpenChange={(open) => !open && setDeleteApp(null)}>
            <DialogContent className='w-[350px] md:w-[800px] rounded-lg'>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to delete this App? This action cannot be undone.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteApp(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteApp}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </CardContent>
      </Card>
    </main>
  )
}

export default AppsPage