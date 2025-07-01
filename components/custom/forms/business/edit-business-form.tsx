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
import { Loader2, Upload } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { api_endpoints } from '@/utils/api_constants'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { Business } from '@/utils/types/Business'

const EditBusinessSchema = z.object({
    name: z.string().min(1, {message:"Business name is required"}),
    email: z.string().email().min(1, {message:"Email is required"}),
    address: z.string().min(1, { message: "Business address is required" }),
    phone: z.string().min(1, { message: "Build Number is required" }),
    logo: z.instanceof(File).optional().refine((file) => {
        return !file || (file && file.size <= 10 * 1024 * 1024);
    }, "File must be under 10mb"),
    business_id:z.string(),
})



interface EditBusinessFormProps {
    business: Business | null;

}

const EditBusinessForm: React.FC<EditBusinessFormProps> = ({ business }) => {
   
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const form = useForm<z.infer<typeof EditBusinessSchema>>({
        resolver: zodResolver(EditBusinessSchema),
        defaultValues: {
             name: business?.name,
            email: business?.email,
            address: business?.address,
            phone: business?.phone,
            business_id:business?.id
        }
    })
    const onSubmit = async (values: z.infer<typeof EditBusinessSchema>) => {
        try {
            setLoading(true)

            const formData = new FormData()

            const businessData = {
                name: values.name,
                email: values.email,
                address: values.address,
                phone: values.phone,
              }

            formData.append("business", JSON.stringify(businessData))
            
            if (values.logo) {
                formData.append("file", values.logo)
            }

            const response = await fetch(api_endpoints.createBusiness, {
                method: 'POST',
                headers: {
                    // Remove 'Content-Type': FormData sets it automatically
                    "Authorization": `Bearer ${session?.accessToken}`,
                },
                body: formData,
            })

            const result = await response.json()

            if (result.status === 'success') {
                toast.success("Business successfully created!")
               window.location.reload()
                // router.refresh() // Prefer router.refresh() over window.location.reload() for Next.js
            } else if (result.status === "failure") {
                toast.error(result.error)
            } else {
                toast.error("Failed to create business")
            }
        } catch (error) {
            console.log('error', error)
            toast.error("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="">
            <div className="mb-10">
                <p className="text-2xl font-bold">Create a business</p>
                <p className="text-sm mb-1">Create a business easy POS Identification and filtering</p>
                <Separator />
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="logo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-blue-900">Upload Business Logo</FormLabel>
                                <FormControl>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-3 text-blue-900" />
                                                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                                                <p className="text-xs text-gray-500">.png .jpeg .jpg(max 10mb)</p>
                                            </div>
                                            <Input
                                                type="file"
                                                className="hidden"
                                                accept=".png,.jpeg,.jpg"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) {
                                                        field.onChange(file)
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </FormControl>
                                <FormMessage />
                                {field.value && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Uploaded: {field.value.name}
                                    </div>
                                )}
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                        className='md:row-start-5 md:col-start-1 bg-[#3c3c8c] '
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating business...
                            </>
                        ) : (
                            "Update Business"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
   
}

export default EditBusinessForm