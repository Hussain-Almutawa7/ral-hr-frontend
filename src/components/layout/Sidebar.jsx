import { NavLink } from "react-router";
import logo from "../../assets/branding/RAL-logo-white-transparent.png";

const Sidebar = ({ user }) => {

    const isHR = ["HR Officer", "HR Manager"].includes(user.role);
    const isHRManager = user.role === "HR Manager";
    const isOperationalRole = ["Employee", "Manager", "HR Officer", "HR Manager"].includes(user.role);
    const canManageTeam = ["Manager", "HR Manager"].includes(user.role);

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
                    <div className="sidebar-section">
                        <p className="sidebar-section-title">People</p>

                        <NavLink to="/employees" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                            Employees
                        </NavLink>
                    </div>
                )}


                {isOperationalRole && (
                    <div className="sidebar-section">
                        <p className="sidebar-section-title">Attendance</p>

                        <NavLink to="/attendance" end className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                            My Attendance
                        </NavLink>

                        <NavLink to="/attendance/check-in" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                            Check In / Out
                        </NavLink>

                        {canManageTeam && (
                            <NavLink to="/attendance/team" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                                Team Attendance
                            </NavLink>
                        )}

                        {isHR && (
                            <NavLink to="/attendance/manage" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                                Attendance Management
                            </NavLink>
                        )}

                        {(user.role === "Manager" || isHR) && (
                            <NavLink to="/attendance/corrections" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                                Attendance Corrections
                            </NavLink>
                        )}
                    </div>
                )}


                {isOperationalRole && (
                    <div className="sidebar-section">
                        <p className="sidebar-section-title">Leave</p>

                        <NavLink to="/leave" end className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                            My Leave
                        </NavLink>

                        <NavLink to="/leave/calendar" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                            Leave Calendar
                        </NavLink>

                        {isHR && (
                            <>
                                <NavLink to="/leave/manage" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                                    Leave Management
                                </NavLink>

                                <NavLink to="/leave/allocations" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                                    Leave Allocations
                                </NavLink>
                            </>
                        )}
                    </div>
                )}


                {isOperationalRole && (
                    <div className="sidebar-section">
                        <p className="sidebar-section-title">Documents</p>

                        <NavLink to="/documents" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                            Documents
                        </NavLink>
                    </div>
                )}


                {isHR && (
                    <div className="sidebar-section">
                        <p className="sidebar-section-title">Settings</p>

                        <NavLink to="/settings/company" className={({ isActive }) => `sidebar-link sidebar-sub-link ${isActive ? "active" : ""}`}>
                            Company
                        </NavLink>

                        <NavLink to="/settings/departments" className={({ isActive }) => `sidebar-link sidebar-sub-link ${isActive ? "active" : ""}`}>
                            Departments
                        </NavLink>

                        <NavLink to="/settings/designations" className={({ isActive }) => `sidebar-link sidebar-sub-link ${isActive ? "active" : ""}`}>
                            Designations
                        </NavLink>

                        <NavLink to="/settings/banks" className={({ isActive }) => `sidebar-link sidebar-sub-link ${isActive ? "active" : ""}`}>
                            Banks
                        </NavLink>

                        <NavLink to="/leave/types" className={({ isActive }) => `sidebar-link sidebar-sub-link ${isActive ? "active" : ""}`}>
                            Leave Types
                        </NavLink>

                        <NavLink to="/settings/document-types" className={({ isActive }) => `sidebar-link sidebar-sub-link ${isActive ? "active" : ""}`}>
                            Document Types
                        </NavLink>

                        <NavLink to="/settings/shift-types" className={({ isActive }) => `sidebar-link sidebar-sub-link ${isActive ? "active" : ""}`}>
                            Shift Types
                        </NavLink>

                        <NavLink to="/settings/shift-assignments" className={({ isActive }) => `sidebar-link sidebar-sub-link ${isActive ? "active" : ""}`}>
                            Shift Assignments
                        </NavLink>

                        <NavLink to="/settings/holiday-lists" className={({ isActive }) => `sidebar-link sidebar-sub-link ${isActive ? "active" : ""}`}>
                            Holiday Lists
                        </NavLink>

                        <NavLink to="/settings/holidays" className={({ isActive }) => `sidebar-link sidebar-sub-link ${isActive ? "active" : ""}`}>
                            Holidays
                        </NavLink>
                    </div>
                )}

            </nav>
        </aside>
    );
};

export default Sidebar;