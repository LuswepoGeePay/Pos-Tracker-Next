"use client"
import React, { useEffect, useState } from 'react'
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
import { signIn, useSession } from "next-auth/react";
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Link from 'next/link'


const SigninSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" })
})


const SignInForm = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars                                      
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { data: session } = useSession();

    const [toggleHidePassword, setToggleHidePassword] = useState<boolean>(false);

    const form = useForm<z.infer<typeof SigninSchema>>({
        resolver: zodResolver(SigninSchema),
        defaultValues: {
            email: '',
            password: '',

        }
    })

    const { status } = useSession();
    const onSubmit = async (values: z.infer<typeof SigninSchema>) => {

        try {
            setLoading(true)
            const signInResponse = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            });

            if (signInResponse?.error) {
                toast.error("Invalid Credentials!");
                setIsAuthenticated(false);
            }



            else {
                setLoading(false)
                setIsAuthenticated(true);
                router.refresh();
            }


        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars                                          
        catch (error) {
            setLoading(false);
            toast.error(`An Unexpected error Happened! Try Again`);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {

        if (status === "authenticated" && session && session.tokenExpiry) {
            const expiryDate = new Date(session.tokenExpiry).getTime();
            if (Date.now() > expiryDate) {
                // Token has expired, redirect to login page
                router.push("/auth/signin");
            }

            toast.success("Authenticated");
            router.push("/admin/dashboard");
        }
    }, [status, session]);


    const handleVisibility = async () => {
        setToggleHidePassword(!toggleHidePassword)
    }

    return (
        <div className="min-h-screen  flex items-center justify-center p-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl">
               
                {/* Login Form Section */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold ">Sign In</h1>
                                <p className="text-gray-700">Welcome back to the POS Master</p>
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your email"
                                                {...field}
                                                className="  placeholder-gray-400 focus:border-amber-500"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
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
                                            <div className='flex'>
                                                <Input
                                                    type={toggleHidePassword ? "password" : "text"}
                                                    placeholder="Enter your password"
                                                    {...field}
                                                    className="  placeholder-gray-400 focus:border-amber-500"
                                                />
                                                <Button
                                                    type='reset'
                                                    variant="ghost" onClick={handleVisibility}>{toggleHidePassword ? <FaEye /> : <FaEyeSlash />}</Button>
                                            </div>


                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                                disabled={loading}
                             >
                                {loading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>

                            <div className='flex gap-2'>
                                <span>Forget your password?</span>
                                <Link href={"/pages/reset"} className='text-blue-600'>Reset it</Link>
                            </div>

                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default SignInForm