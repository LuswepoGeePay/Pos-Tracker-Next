"use client"
import { api_endpoints } from '@/utils/api_constants'
import { Business } from '@/utils/types/Business'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const SingleBusiness = () => {

    const { businessID } = useParams()
    const { data: session, status } = useSession();
    const [business, setBusiness] = useState<Business | null>(null)



    const fetchBusiness = async () => {

        try {

            const response = await fetch(`${api_endpoints.getBusinessById}/${businessID}`, {
                headers: {
                    "Authorization": `Bearer ${session?.accessToken}`
                }
            })


            const data = await response.json()

            console.log('data', data)

            if (data["status"] == "success") {
                
                setBusiness(data.business)
            }

            else if (data["status"] == "failure") {
                toast.error(`Unable to fetch business information\n${data.error} `)
            }
            else {

            }
        } catch (error) {
            toast.error("Unable to fetch business information")
            console.log('error', error)
        }

    }

    useEffect(() => {
        if (status === 'authenticated' && session?.accessToken) {
            fetchBusiness();
        }
    }, [status, session?.accessToken,]);

      if (!business) return <p>Loading...</p>
    return (
    <main className="p-4 space-y-6">
      {/* Business Info */}
      <div className="flex items-center gap-4">
        <img src={business.business_logo} alt="Business Logo" className="w-16 h-16 object-contain" />
        <div>
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <p className="text-gray-600">{business.address}</p>
        </div>
      </div>

      {/* Devices List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Devices ({Array.isArray(business.device) ? business.device.length : 0})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Array.isArray(business.device) ? business.device : business.device ? [business.device] : []).map((dev, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <p className="font-bold">{dev.name}</p>
              <p className="text-sm text-gray-500">Model: {dev.device_model}</p>
              <p className="text-sm">OS: {dev.operating_system}</p>
              <p className="text-sm">Version: {dev.current_app_version}</p>
              <p className="text-sm">Serial #: {dev.serial_number}</p>
              <p className="text-sm text-gray-600">
                Last Location: {dev.last_known_latitude}, {dev.last_known_longitude}
              </p>
              <p className={`text-sm mt-1 font-medium ${dev.status === 'offline' ? 'text-red-500' : 'text-green-600'}`}>
                Status: {dev.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default SingleBusiness