"use client"
import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { api_endpoints } from '@/utils/api_constants'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { PosDevice } from '@/utils/types/PosDevices'
import { Textarea } from '@/components/ui/textarea'

const PosDeviceSchema = z.object({
    last_known_longitude: z.string().optional().optional(),
    serial_number: z.string().optional(),
    name: z.string().optional(),
    current_app_version: z.string().optional(),
    last_known_latitude: z.string().optional(),
    id: z.string().optional(),
    status: z.string().optional(),
    device_model: z.string().optional(),
    operating_system: z.string().optional(),
    description: z.string().optional(),
    business_name: z.string().optional(),
})



interface EditPosDeviceFormProps {
    pos: PosDevice | null;

}

const EditPosDeviceForm: React.FC<EditPosDeviceFormProps> = ({ pos }) => {
   
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const form = useForm<z.infer<typeof PosDeviceSchema>>({
        resolver: zodResolver(PosDeviceSchema),
        defaultValues: {
            last_known_longitude: pos?.last_known_longitude,
            serial_number: pos?.serial_number,
            name: pos?.name,
            current_app_version: pos?.current_app_version,
            last_known_latitude: pos?.last_known_latitude,
            id: pos?.id,
            status: pos?.status,
            device_model: pos?.device_model,
            operating_system: pos?.operating_system,
            description: pos?.description,
            business_name: pos?.business_name
        }
    })
    const onSubmit = async (values: z.infer<typeof PosDeviceSchema>) => {
        try {
            setLoading(true)
            const body = {
            last_known_longitude: values.last_known_longitude,
            serial_number: values.serial_number,
            name: values.name,
            current_app_version: values.current_app_version,
            last_known_latitude: values.last_known_latitude,
            id: pos?.id,
            status: values.status,
            device_model: values.device_model,
            operating_system: values.operating_system,
            description: values.description,
            business_name: values.business_name
         }


            const response = await fetch(api_endpoints.editPosDevice, {
                method: 'POST',
                headers: {
                    // Remove 'Content-Type': FormData sets it automatically
                    "Authorization": `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(body),
            })

            const result = await response.json()

            if (result.status === 'success') {
                toast.success("Device updated successfully created!")
                     window.location.reload()   
  
            } else if (result.status === "failure") {
                toast.error(result.error)
            } else {
                toast.error("Failed to update device information")
            }
        } catch (error) {
            console.log('error', error)
            toast.error(`An error occurred. Please try again.\n${error}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="">
            <div className="mb-10">
                <p className="text-2xl font-bold">Edit POS Device</p>
                <Separator />
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                    <FormField
                        control={form.control}
                        name="business_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Entity</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Device Name</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="serial_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Serial Number/Device ID</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="current_app_version"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current App Version</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="last_known_latitude"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last known Latitude</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="last_known_longitude"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Known Longitude</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Device Status</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Device Status</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Device Status</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                    className='min-h-[120px]'
                                    placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                      
                    
                    
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading device...
                            </>
                        ) : (
                            "Update Pos Device"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
   
}

export default EditPosDeviceForm