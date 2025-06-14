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
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { api_endpoints } from '@/utils/api_constants'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { Textarea } from '@/components/ui/textarea'
import { App } from '@/utils/types/Apps'

const EditAppSchema = z.object({
     id: z.string().optional(),  
    name: z.string().optional(),
    description: z.string().optional(),
   })



interface EditAppFormProps {
    app: App | null;

}

const EditAppForm: React.FC<EditAppFormProps> = ({ app }) => {
   
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const form = useForm<z.infer<typeof EditAppSchema>>({
        resolver: zodResolver(EditAppSchema),
        defaultValues: {
            name: app?.name,
            id: app?.id,
            description: app?.description,
         }
    })
    const onSubmit = async (values: z.infer<typeof EditAppSchema>) => {
        try {
            setLoading(true)
            const body = {
            name: values.name,
            id: app?.id,
            description: values.description,
           }


            const response = await fetch(api_endpoints.editApp, {
                method: 'POST',
                headers: {
                    // Remove 'Content-Type': FormData sets it automatically
                    "Authorization": `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(body),
            })

            const result = await response.json()

            if (result.status === 'success') {
                toast.success("App updated successfully created!")
                     window.location.reload()   
  
            } else if (result.status === "failure") {
                toast.error(result.error)
            } else {
                toast.error("Failed to update app information")
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
                <p className="text-2xl font-bold">Edit Application information</p>
                <Separator />
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1  gap-5"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>App Name</FormLabel>
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
                                <FormLabel>App Description</FormLabel>
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
                                Updating application information...
                            </>
                        ) : (
                            "Update app"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
   
}

export default EditAppForm