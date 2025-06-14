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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AppVersion } from '@/utils/types/Apps'

const EditAppVersionSchema = z.object({
    app_id: z.string().optional(),
    versionNumber: z.string().optional().optional(),
    version_id: z.string().optional(),
    releaseNotes: z.string().optional(),
    is_active: z.boolean().optional(),
    is_latest_stable: z.boolean().optional(),
    apk: z.instanceof(File).optional().refine((file) => {
        return !file || (file && file.size <= 200 * 1024 * 1024);
    }, "File must be under 200mb"),
})

interface EditAppVersionFormProps {
    version: AppVersion | null;

}


const EditAppVersionForm: React.FC<EditAppVersionFormProps> = ({ version }) => {
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const form = useForm<z.infer<typeof EditAppVersionSchema>>({
        resolver: zodResolver(EditAppVersionSchema),
        defaultValues: {
            app_id: version?.app_id,
            versionNumber: version?.version_number,
            version_id: version?.version_id,
            releaseNotes: version?.release_notes,
            is_active: version?.is_active,
            is_latest_stable: version?.is_latest_stable, // Default to false
        },
    })

    const onSubmit = async (values: z.infer<typeof EditAppVersionSchema>) => {
        try {
            setLoading(true)

            const formData = new FormData()

            const appData = {
                version_number: values.versionNumber,
                release_notes: values.releaseNotes,
                is_latest_stable: values.is_latest_stable,
                version_id:values.version_id,
                is_active:values.is_active
            }

            formData.append("version", JSON.stringify(appData))
         

            if (values.apk) {
                formData.append("file", values.apk)
            }

            const response = await fetch(api_endpoints.editAppVersion, {
                method: 'POST',
                headers: {
                    // Remove 'Content-Type': FormData sets it automatically
                    "Authorization": `Bearer ${session?.accessToken}`,
                },
                body: formData,
            })

            const result = await response.json()

            if (result.status === 'success') {
                toast.success("App Version successfully updated!")
               window.location.reload()
            } else if (result.status === "failure") {
                   console.log('error', result.error)
                toast.error(result.error)
            } else {
                toast.error("Failed to update app version")
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
                <p className="text-2xl font-bold">Edit an app version</p>
                {/* <p className="text-sm mb-1">Add an app version for easy Identification and filtering</p> */}
                <Separator />
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >

                    <p>Version ID {version?.version_id}</p>

                    <FormField
                        control={form.control}
                        name="versionNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Version Number</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="releaseNotes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Release Notes</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="apk"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-blue-900">Upload APK</FormLabel>
                                <FormControl>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-3 text-blue-900" />
                                                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                                                <p className="text-xs text-gray-500">.apk (max 200mb)</p>
                                            </div>
                                            <Input
                                                type="file"
                                                className="hidden"
                                                accept=".apk"
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
                    <FormField
                        control={form.control}
                        name="is_active"
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
                    
                    <FormField
                        control={form.control}
                        name="is_latest_stable"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Latest Stable Release</FormLabel>
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
                        className='col-start-1 row-start-4'
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating app...
                            </>
                        ) : (
                            "Edit app version"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default EditAppVersionForm