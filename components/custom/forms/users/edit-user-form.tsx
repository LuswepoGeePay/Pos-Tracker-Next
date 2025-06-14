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
import { User } from '@/utils/types/User'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const EditUserSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    role: z.string().optional(),
    status: z.boolean().optional()
})



interface EditUserFormProps {
    user: User | null;

}

const EditUserForm: React.FC<EditUserFormProps> = ({ user }) => {

    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const form = useForm<z.infer<typeof EditUserSchema>>({
        resolver: zodResolver(EditUserSchema),
        defaultValues: {
            name: user?.fullname,
            id: user?.id,
            email: user?.email,
        }
    })
    const onSubmit = async (values: z.infer<typeof EditUserSchema>) => {
        try {
            setLoading(true)
            const body = {
                fullname: values.name,
                id: user?.id,
                email: values.email,
                role: values.role,
                status: values.status
            }


            const response = await fetch(api_endpoints.editUser, {
                method: 'POST',
                headers: {
                    // Remove 'Content-Type': FormData sets it automatically
                    "Authorization": `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(body),
            })

            const result = await response.json()

            if (result.status === 'success') {
                toast.success("User updated successfully created!")
                window.location.reload()

            } else if (result.status === "failure") {
                toast.error(result.error)
            } else {
                toast.error("Failed to update user information")
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
                <p className="text-2xl font-bold">Edit Userlication information</p>
                <Separator />
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2  gap-5"
                >
                   
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Name</FormLabel>
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
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
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



                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Active</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={(value) => field.onChange(value === "true")} // Convert string to boolean
                                        value={field.value ? "true" : "false"} // Bind boolean to string for RadioGroup
                                        className="flex flex-col space-y-1"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="true" id="true" />
                                            <Label htmlFor="true">True</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="false" id="false" />
                                            <Label htmlFor="false">False</Label>
                                        </div>
                                    </RadioGroup>
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
                                Updating user...
                            </>
                        ) : (
                            "Update user"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )

}

export default EditUserForm