


import Image from 'next/image'
import React from 'react'

import Link from 'next/link'
import LoginForm from './_components/login-form'

const page = () => {
    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Sign In</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <LoginForm />
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="underline">
                            Sign up
                        </Link>
                    </div>
                    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                        By clicking continue, you agree to our <Link href="/terms">Terms of Service</Link>{" "}
                        and <Link href="/privacy">Privacy Policy</Link>.
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <Image
                    src="/login.jpg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-screen w-full object-cover"
                />
            </div>
        </div>
    )
}

export default page