import { Link } from "react-router";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">RAL HR</div>

            <nav className="sidebar-nav">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/employees">Employees</Link>
                <Link to="/attendance">Attendance</Link>
                <Link to="/leave">Leave</Link>
                <Link to="/documents">Documents</Link>
                <Link to="/settings">Settings</Link>
            </nav>
        </aside>
    );
};

export default Sidebar;