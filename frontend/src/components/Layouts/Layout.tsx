import type { ReactNode } from "react";
import NavBar from "../Navbar";
import Sidebar from "../SideBar";


const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="auth-layout">
            <div className="bg-white">
                <NavBar />
                <div className="flex min-h-screen bg-gray-100">
                    <Sidebar />
                    <div className="relative isolate px-6 pt-14 lg:px-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Layout;