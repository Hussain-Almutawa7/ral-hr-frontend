import Nav from "./Nav";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";

const Layout = () => {
    return (
        <div className="app-layout">
            <Sidebar />

            <div className="app-content">
                <Nav />

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;