import { NavLink } from "react-router";
import logo from "../../assets/branding/RAL-logo-white-transparent.png";

const Sidebar = ({ user }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <img src={logo} alt="RAL Technologies" className="sidebar-logo" />
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                    Dashboard
                </NavLink>

                <NavLink to="/employees" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                    Employees
                </NavLink>

                <NavLink to="/attendance" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                    Attendance
                </NavLink>

                <NavLink to="/leave" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                    Leave
                </NavLink>

                <NavLink to="/documents" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                    Documents
                </NavLink>

                <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                    Settings
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;