import { Outlet } from "react-router-dom";
import Cursos from "./Cursos";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout(){
    return(
        <div className="bg-linear-to-b from-blue-300 to-blue-200 min-h-screen">
            <Sidebar></Sidebar>
            <div className="ml-70">
                <Navbar></Navbar>
                <main>
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}
export default Layout;