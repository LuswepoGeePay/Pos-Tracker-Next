"use client"
import { SessionProvider } from "next-auth/react";
import {ThemeProvider} from "next-themes";

interface ProviderProps{
    children: React.ReactNode | React.ReactNode[];
}


const Provider = ({children}: ProviderProps)=>{
    return(
        <SessionProvider>
           <ThemeProvider attribute= "class" defaultTheme ="system" enableSystem>
            {children}
            </ThemeProvider>
        </SessionProvider>
    );
}


export default Provider