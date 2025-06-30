"use client"
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import toast from 'react-hot-toast'
import { api_endpoints } from '@/utils/api_constants'
import { Business } from '@/utils/types/Business'
import { BusinessDataTable } from './business-data-table'
import { BusinessColumns } from './business-columns'
import CreateBusinessForm from '@/components/custom/forms/business/create-business-form'
import ViewBusinessDialog from '@/components/custom/dialogs/business/view-business-dialog'
import EditBusinessDialog from '@/components/custom/dialogs/business/edit-business-dialog'


const AllBusinessesPage = () => {

  const [businessData, setbusinessData] = useState<Business[]>([])
  const [viewBusiness, setViewBusiness] = useState<Business | null>(null);
  const [editBusiness, setEditBusiness] = useState<Business | null>(null);
  const [deleteBusiness, setDeleteBusiness] = useState<Business | null>(null);
  const { data: session, status } = useSession();

  const [count, setCount] = useState<number | null>(0);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [totalPages, setTotalPages] = useState(0);


  const fetchBusinesss = async () => {
    const body = {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    };

    const response = await fetch(api_endpoints.getBusinesses, {
      method: "POST",
      headers: {
        "Content-Type": "businesslication/json",
        "Authorization": `Bearer ${session?.accessToken}`
      },
      body: JSON.stringify(body)
    });

    const responseBody = await response.json();
    if (responseBody["status"] === "success") {
      if (responseBody?.businesss?.business) {
        const businesss = responseBody.businesss.business.map((business: Business) => ({
          name: business.name,
          email: business.email,
          status: business.status,
          phone: business.phone,
          id: business.id,
          address: business.address
        }))

        
        setbusinessData(businesss);
        setTotalPages(responseBody.businesss.totalPages || 0);
        setCount(responseBody.businesss.count || 0);


      } // Set the fetched data
    }
    else if (responseBody["status"] == "failure") {
      toast.error(`${responseBody.error}\n${responseBody.detail}`)
    }


    else {
      toast.error("Failed to fetch business data");
    }

  }

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchBusinesss();
    }
  }, [status, session?.accessToken, pagination.pageIndex, pagination.pageSize]);

  const handleDeleteBusiness = async () => {
    if (deleteBusiness) {
      try {
        const response = await fetch(`${api_endpoints.deleteBusiness}/${deleteBusiness.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${session?.accessToken}`
          }
        });

        const responseBody = await response.json();

        if (responseBody["status"] === "success") {
          toast.success(responseBody["message"]);
          window.location.reload()
          fetchBusinesss(); // Refresh the data instead of reloading the page
        } else {
          toast.error(responseBody["error"]);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catch (error) {
        toast.error(`Something went wrong, please try again`);
      } finally {
        setDeleteBusiness(null);
      }
    }
  };


  return (
    <main className='m-10'>

      <Card>
        <CardContent>
          <CreateBusinessForm />
        </CardContent>
      </Card>
      <Card className='w-[340px] md:w-full my-20'>

        <CardContent className='p-8'>
          <div className='mb-10'>
            <p className='text-2xl font-bold'>Businesss</p>
            <p className='text-sm mb-1'>View, edit, delete, existing business history entries</p>
            <Separator />
          </div>
          <div className='flex justify-between'>
            <div>

            </div>
            <div className='flex gap-3'>
              <p className='text-sm font-semibold'>Total Businesses:</p>
              <p className='text-sm font-semibold'>{count}</p>
            </div>
          </div>

          <div className={viewBusiness || editBusiness ? 'hidden ' : ''}>
            <BusinessDataTable
              columns={BusinessColumns(setViewBusiness, setEditBusiness, setDeleteBusiness)}
              data={businessData} />

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

          <EditBusinessDialog
            business={editBusiness}
            open={!!editBusiness}
            onClose={() => setEditBusiness(null)}
          />

          <ViewBusinessDialog
            business={viewBusiness}
            open={!!viewBusiness}
            onClose={() => setViewBusiness(null)}
          />

          <Dialog open={!!deleteBusiness} onOpenChange={(open) => !open && setDeleteBusiness(null)}>
            <DialogContent className='w-[350px] md:w-[800px] rounded-lg'>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to delete this Business? This action cannot be undone.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteBusiness(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteBusiness}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </CardContent>
      </Card>
    </main>
  )
}

export default AllBusinessesPage