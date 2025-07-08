// "use client"
// import { api_endpoints } from '@/utils/api_constants';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useSession } from 'next-auth/react';
// import { useParams } from 'next/navigation'
// import React, { useState } from 'react'
// import { useForm } from 'react-hook-form';
// import z from 'zod';


// const ChangePasswordSchema = z.object({
//   start_date: z.string().optional(),
//   end_date: z.string().optional(),
//   appversion: z.string().optional(),
// })



// const ChangePassword = () => {
  
//   const form = useForm<z.infer<typeof ChangePasswordSchema>>({
//     resolver: zodResolver(ChangePasswordSchema),
//     defaultValues: {
//       start_date: '',
//       end_date: '',
//       appversion: ""

//     }
//   })
//     const {data: session, status } = useSession();
//     const [count, setCount] = useState<number | null>(0);
//     const [loading, setLoading] = useState(true);

//     const onSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
//           try {
//               setLoading(true)
  
//               const body = {
//                   "name": values.name,
//                   "description":values.description
//               }
//               const response = await fetch(api_endpoints.createApp, {
//                   method: 'POST',
//                   headers: {
//                       'Content-Type': 'application/json',
//                       "Authorization": `Bearer ${session?.accessToken}`
//                   },
//                   body: JSON.stringify(body)
//               })
  
//               const result = await response.json()
  
//               if (result.status === 'success') {
//                   toast.success("App successfully created!")
//                   window.location.reload()
//               } else if (result["status"] == "failure") {
//                   toast.error(result["error"])
//               } 
//           }
//           // eslint-disable-next-line @typescript-eslint/no-unused-vars
//           catch (error) {
//               toast.error("An error occurred. Please try again.")
//           } finally {
//               setLoading(false)
//           }
//       }
  
//   const { user_id } = useParams()
//   return (
//     <main>
      
//       {/* <Card>
//         <CardContent>
//           <div className="text-center mb-6">
//             <h1 className="text-2xl font-bold ">Filter</h1>
//             <p className="text-gray-700">Filter by status, date, app version</p>
//           </div>

//           <Form {...form}>
//             <form
//               // onSubmit={form.handleSubmit(onSubmit)}
//               className="grid grid-cols-1 md:grid-cols-2 gap-5"
//             >


//               <FormField
//                 control={form.control}
//                 name="start_date"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="">Start Date</FormLabel>
//                     <FormControl>
//                       <Input
//                         type='date'
//                         placeholder="Enter your start date"
//                         {...field}
//                         className="  placeholder-gray-400 focus:border-amber-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="end_date"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="">End Date</FormLabel>
//                     <FormControl>
//                       <div className='flex'>
//                         <Input
//                           type='date'
//                           placeholder="Enter your end date"
//                           {...field}
//                           className="  placeholder-gray-400 focus:border-amber-500"
//                         />
//                       </div>

//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="appversion"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="">App Version</FormLabel>
//                     <FormControl>
//                       <div className='flex'>
//                         <Input
//                           placeholder="Enter your end date"
//                           {...field}
//                           className="  placeholder-gray-400 focus:border-amber-500"
//                         />
//                       </div>

//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 type="submit"
//                 className="w-full bg-[#00aeff] hover:bg-[#3c3c8c] text-white md:row-start-3 m"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Filtering</>
//                 ) : (
//                   "Apply Filters"
//                 )}
//               </Button>

//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full md:row-start-3"
//                 onClick={() => {
//                   form.reset();
//                   setStartDate(null);
//                   setEndDate(null);
//                   setAppVersion(null);
//                   setPagination({ pageIndex: 0, pageSize: 20 });
//                 }}
//               >
//                 Clear Filters
//               </Button>



//             </form>
//           </Form>
//         </CardContent>
//       </Card> */}

//       <div>ChangePassword</div>
//       <p>{user_id}</p>
//     </main>
//   )
// }

// export default ChangePassword