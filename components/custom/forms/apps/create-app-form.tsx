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
// import toast from 'react-hot-toast'
import { Separator } from '@/components/ui/separator'
import { api_endpoints } from '@/utils/api_constants'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { Textarea } from '@/components/ui/textarea'


const CreateAppSchema = z.object({
    name: z.string(),
    description: z.string(),
})


const CreateAppForm = () => {
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const form = useForm<z.infer<typeof CreateAppSchema>>({
        resolver: zodResolver(CreateAppSchema),
        defaultValues: {

        }
    })

    const onSubmit = async (values: z.infer<typeof CreateAppSchema>) => {
        try {
            setLoading(true)

            const body = {
                "name": values.name,
                "description":values.description
            }
            const response = await fetch(api_endpoints.createApp, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify(body)
            })

            const result = await response.json()

            if (result.status === 'success') {
                toast.success("App successfully created!")
                window.location.reload()
            } else if (result["status"] == "failure") {
                toast.error(result["error"])
            } 
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (error) {
            toast.error("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (

        <div className='shadow-lg p-8 border rounded-2xl'>
            <div className='mb-10'>

                <p className='text-2xl font-bold'>Create an app </p>
                <p className='text-sm mb-1'>Create an app for easy Identification and filtering</p>
                <Separator />
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 "
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder=""
                                        {...field}
                                        className=""
                                    />
                                </FormControl>
                                <FormMessage className="" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder=""
                                        {...field}
                                        className="min-h-[120px]"
                                    />
                                </FormControl>
                                <FormMessage className="" />
                            </FormItem>
                        )}
                    />


                    <Button
                        type="submit"
                        className="row-start-3"
                        disabled={loading}
                     
                    >
                        {loading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating app...</>
                        ) : (
                            "Create App"
                        )}
                    </Button>


                </form>
            </Form>
        </div>

    )
}

export default CreateAppForm