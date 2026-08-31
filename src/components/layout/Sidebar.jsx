import { NavLink } from "react-router";
import logo from "../../assets/branding/RAL-logo-white-transparent.png";

const Sidebar = ({ user }) => {

    const isHR = ["HR Officer", "HR Manager"].includes(user.role);
    const isHRManager = user.role === "HR Manager";
    const isOperationalRole = ["Employee", "Manager", "HR Officer", "HR Manager"].includes(user.role);

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <img src={logo} alt="RAL Technologies" className="sidebar-logo" />
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                    Dashboard
                </NavLink>

                {isHR && (
                    <NavLink to="/employees" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                        Employees
                    </NavLink>
                )}

                {isOperationalRole && (
                    <>
                        <NavLink to="/attendance" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                            Attendance
                        </NavLink>

                        <NavLink to="/leave" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                            Leave
                        </NavLink>

                        <NavLink to="/documents" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                            Documents
                        </NavLink>
                    </>
                )}

                {isHR && (
                    <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                        Settings
                    </NavLink>
                )}

                {isHRManager && (
                    <>
                        <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                            User Management
                        </NavLink>

                        <NavLink to="/audit-logs" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                            Audit Logs
                        </NavLink>
                    </>
                )}

            </nav>
        </aside>
    );
};

export default Sidebar;