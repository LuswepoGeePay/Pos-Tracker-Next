import SignInForm from '@/components/custom/forms/auth/sign-in-form'
import React from 'react'

const SignInPage = () => {
  return (
    <main className='min-h-screen w-full flex items-center '>
      <div className='h-full hidden lg:block lg:max-w-1/2'>
        <img
          alt=''
          src="/images/auth/hero.jpg"
          className='object-cover h-screen'
        />
      </div>

      <div className='lg:max-w-1/2 flex flex-col items-center w-full'>
        <SignInForm />
      </div>


    </main>
  )
}

export default SignInPage