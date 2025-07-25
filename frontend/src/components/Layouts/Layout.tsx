import type { ReactNode } from "react";
import NavBar from "@/components/Navbar";
import Sidebar from "@/components/SideBar";


const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="auth-layout">
            <div className="bg-white">
                <NavBar />
                <div className="flex bg-gray-100">
                    <div className="min-h-screen w-1/5 min-w-[300px] max-w-xs hidden md:flex flex-col bg-white shadow-md px-6 py-8 space-y-6">
                        <Sidebar />
                    </div>
                    <div className="relative isolate px-6 pt-14 lg:px-8 w-4/4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Layout;