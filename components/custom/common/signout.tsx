"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

const SignOut = () => {

    useEffect(() => {
        // Allow NextAuth to handle redirection after signOut
        signOut({
            callbackUrl: "/auth/signin", // where you want to redirect after sign out
            redirect: true, // this lets NextAuth manage the redirect itself
        });
    }, []);

    return null;
};

export default SignOut;

