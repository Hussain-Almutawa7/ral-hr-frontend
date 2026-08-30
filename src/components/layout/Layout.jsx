import "../../styles/layout.css";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";

const Layout = ({ user, setUser }) => {
    return (
        <div className="app-layout">
            <Sidebar user={user} />

            <div className="app-content">
                <Nav user={user} setUser={setUser} />

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;