"use client"
import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
// import toast from 'react-hot-toast'
import { Separator } from '@/components/ui/separator'
import { api_endpoints } from '@/utils/api_constants'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const CreateUserSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email().min(1, { message: "Email is required" }),
    role: z.string().min(1, { message: "Role is required" }),
    password: z.string().min(8, { message: "A minimum of 8 characters is required" }),

})


const CreateUserForm = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()


    const form = useForm<z.infer<typeof CreateUserSchema>>({
        resolver: zodResolver(CreateUserSchema),
        defaultValues: {
            name:"",
            email:"",
            role:"",
            password:""
        }
    })

    const onSubmit = async (values: z.infer<typeof CreateUserSchema>) => {
        try {
            setLoading(true)

            const body = {
                "fullname": values.name,
                "email": values.email,
                "password": values.password,
                "role": values.role
            }
            const response = await fetch(api_endpoints.createUser, {
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
                router.push("/admin/users")
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

        <div className='shadow-lg border p-6 rounded-2xl'>
            <div className='mb-10'>

                <p className='text-2xl font-bold'>Add a user </p>
                <p className='text-sm mb-1'>Add a user to manage the POS devices</p>
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">email</FormLabel>
                                <FormControl>
                                    <Input
                                        type='email'
                                        placeholder=""
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type='text'
                                        placeholder="@asda#EJ.-+12"
                                        {...field}

                                    />
                                </FormControl>
                                <FormMessage className="" />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>

                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>

                                        <SelectItem value="admin">
                                            admin
                                        </SelectItem>

                                    </SelectContent>
                                </Select>

                                <FormDescription>
                                    Select the role of the user
                                </FormDescription>
                                <FormMessage />
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
                            "Add user"
                        )}
                    </Button>


                </form>
            </Form>
        </div>

    )
}

export default CreateUserForm