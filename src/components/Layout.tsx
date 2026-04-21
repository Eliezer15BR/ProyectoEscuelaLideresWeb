import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout(){
    return(
        <div className="bg-linear-to-b from-blue-300 to-blue-200 min-h-screen">
            <Sidebar></Sidebar>
            <Outlet />
        </div>
    )
}
export default Layout;