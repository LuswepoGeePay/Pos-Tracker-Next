"use client"
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from 'next-themes'

export default function Layout({ children }: { children: React.ReactNode }) {

  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
 
  return (
     <main className="flex h-screen overflow-hidden bg-gray-50 dark:bg-inherit w-full">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-auto w-full">
          <header className="bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center">
                <SidebarTrigger className="mr-4" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-white">
                </span>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? <FaSun /> : <FaMoon />}
                </Button>
              </div>
            </div>
          </header>
          <div className="p-6 w-full">
            {children}
          </div>

        </div>
        
      </SidebarProvider>
    </main>
    )
  }
  