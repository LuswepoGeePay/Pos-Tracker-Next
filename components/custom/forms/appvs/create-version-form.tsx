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
import { Loader2, Upload } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { api_endpoints } from '@/utils/api_constants'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const CreateAppVersionSchema = z.object({
    name: z.string(),
    description: z.string(),
    versionNumber: z.string().min(1, { message: "Version Number is required" }),
    buildNumber: z.string().min(1, { message: "Build Number is required" }),
    releaseNotes: z.string().min(1, { message: "Release notes is required" }),
    fileSize: z.string().min(1, { message: "File Size in Bytes" }),
    isLastestStable: z.boolean(),
    apk: z.instanceof(File).optional().refine((file) => {
        return !file || (file && file.size <= 200 * 1024 * 1024);
    }, "File must be under 200mb"),
})

const CreateAppVersionForm = ({ appid }: { appid: string }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const form = useForm<z.infer<typeof CreateAppVersionSchema>>({
        resolver: zodResolver(CreateAppVersionSchema),
        defaultValues: {
            name: "",
            description: "",
            versionNumber: "",
            buildNumber: "",
            releaseNotes: "",
            fileSize: "",
            isLastestStable: false, // Default to false
        },
    })

    const onSubmit = async (values: z.infer<typeof CreateAppVersionSchema>) => {
        try {
            setLoading(true)

            const formData = new FormData()

            const appData = {
                app_id: appid,
                version_number: values.versionNumber,
                build_number: values.buildNumber,
                release_notes: values.releaseNotes,
                file_size_bytes: values.fileSize,
                is_latest_stable: values.isLastestStable,
            }

            formData.append("version", JSON.stringify(appData))
            formData.append("name", values.name)

            if (values.apk) {
                formData.append("file", values.apk)
            }

            const response = await fetch(api_endpoints.createAppVersion, {
                method: 'POST',
                headers: {
                    // Remove 'Content-Type': FormData sets it automatically
                    "Authorization": `Bearer ${session?.accessToken}`,
                },
                body: formData,
            })

            const result = await response.json()

            if (result.status === 'success') {
                toast.success("App Version successfully created!")
                router.push("/admin/apps/versions")
                router.refresh() // Prefer router.refresh() over window.location.reload() for Next.js
            } else if (result.status === "failure") {
                toast.error(result.error)
            } else {
                toast.error("Failed to create app version")
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
                <p className="text-2xl font-bold">Create an app</p>
                <p className="text-sm mb-1">Create an app for easy Identification and filtering</p>
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
                        name="buildNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Build Number</FormLabel>
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
                        name="fileSize"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>File Size</FormLabel>
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
                        name="isLastestStable"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Is Latest Stable Release</FormLabel>
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
                                Uploading app...
                            </>
                        ) : (
                            "Create AppVersion"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default CreateAppVersionForm