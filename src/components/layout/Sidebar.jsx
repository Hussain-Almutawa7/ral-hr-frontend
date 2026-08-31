import { NavLink } from "react-router";
import logo from "../../assets/branding/RAL-logo-white-transparent.png";

const Sidebar = ({ user }) => {

    const isHR = ["HR Officer", "HR Manager"].includes(user.role);
    const isHRManager = user.role === "HR Manager";
    const isOperationalRole = ["Employee", "Manager", "HR Officer", "HR Manager"].includes(user.role);
    const isManager = user.role === "Manager";

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
                        <NavLink to="/attendance" end className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                            My Attendance
                        </NavLink>

                        <NavLink to="/attendance/check-in" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                            Check In / Out
                        </NavLink>

                        {isManager && (
                            <>
                                <NavLink to="/attendance/team" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                                    Team Attendance
                                </NavLink>

                                <NavLink to="/attendance/corrections" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                                    Attendance Corrections
                                </NavLink>
                            </>
                        )}

                        {isHR && (
                            <>
                                <NavLink to="/attendance/manage" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                                    Attendance Management
                                </NavLink>

                                <NavLink to="/attendance/corrections" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                                    Attendance Corrections
                                </NavLink>
                            </>

                        )}

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