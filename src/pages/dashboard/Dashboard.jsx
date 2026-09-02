import { useEffect, useState } from "react";
import { Link } from "react-router";

import { getDashboard } from "../../services/dashboardService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";

const Dashboard = ({ user }) => {
    const [counts, setCounts] = useState({});

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setError("");

                const data = await getDashboard();

                setCounts(data.counts);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadDashboard();
    }, []);

    const dashboardItems = {
        Employee: [
            {
                title: "Pending Leave",
                value: counts.pendingLeave,
                description: "Leave requests waiting for approval.",
                link: "/leave"
            },
            {
                title: "Pending Documents",
                value: counts.pendingDocuments,
                description: "Documents waiting for HR verification.",
                link: "/documents"
            },
            {
                title: "Rejected Documents",
                value: counts.rejectedDocuments,
                description: "Documents that require your attention.",
                link: "/documents"
            }
        ],

        Manager: [
            {
                title: "Team Members",
                value: counts.teamMembers,
                description: "Employees reporting directly to you.",
                link: "/attendance/team"
            },
            {
                title: "Pending Team Leave",
                value: counts.pendingTeamLeave,
                description: "Team leave requests waiting for review.",
                link: "/leave/manage"
            },
            {
                title: "Pending Documents",
                value: counts.pendingDocuments,
                description: "Your documents waiting for verification.",
                link: "/documents"
            }
        ],

        "HR Officer": [
            {
                title: "Total Employees",
                value: counts.totalEmployees,
                description: "Employee records in the system.",
                link: "/employees"
            },
            {
                title: "Active Employees",
                value: counts.activeEmployees,
                description: "Employees currently marked as active.",
                link: "/employees"
            },
            {
                title: "Pending Leave",
                value: counts.pendingLeave,
                description: "Leave requests awaiting review.",
                link: "/leave/manage"
            },
            {
                title: "Pending Documents",
                value: counts.pendingDocuments,
                description: "Documents awaiting HR verification.",
                link: "/documents"
            }
        ],

        "HR Manager": [
            {
                title: "Total Employees",
                value: counts.totalEmployees,
                description: "Employee records in the system.",
                link: "/employees"
            },
            {
                title: "Active Employees",
                value: counts.activeEmployees,
                description: "Employees currently marked as active.",
                link: "/employees"
            },
            {
                title: "Pending Leave",
                value: counts.pendingLeave,
                description: "Leave requests awaiting review.",
                link: "/leave/manage"
            },
            {
                title: "Pending Documents",
                value: counts.pendingDocuments,
                description: "Documents awaiting verification.",
                link: "/documents"
            },
            {
                title: "User Accounts",
                value: counts.totalUsers,
                description: "Login accounts in the system.",
                link: "/users"
            },
            {
                title: "Inactive Accounts",
                value: counts.inactiveUsers,
                description: "User accounts currently deactivated.",
                link: "/users"
            }
        ],

        "Owner/Finance": [
            {
                title: "Total Employees",
                value: counts.totalEmployees,
                description: "Total employees in the organisation."
            },
            {
                title: "Active Employees",
                value: counts.activeEmployees,
                description: "Employees currently marked as active."
            },
            {
                title: "Employees On Leave",
                value: counts.employeesOnLeave,
                description: "Employees currently marked as on leave."
            }
        ]
    };

    const items = dashboardItems[user.role] || [];

    if (isLoading) return <LoadingSpinner message="Loading dashboard..." />

    return (
        <div>
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome to RAL HR.</p>
                </div>

                <span className="dashboard-role">
                    {user.role}
                </span>
            </div>

            <Message type="error">{error}</Message>

            <div className="dashboard-grid">
                {items.map(item => (
                    item.link ? (
                        <Link key={item.title} to={item.link} className="dashboard-card">
                            <span className="dashboard-count">
                                {item.value ?? 0}
                            </span>

                            <h2>{item.title}</h2>

                            <p>{item.description}</p>

                            <span className="dashboard-open">
                                View →
                            </span>
                        </Link>
                    ) : (
                        <div key={item.title} className="dashboard-card">
                            <span className="dashboard-count">
                                {item.value ?? 0}
                            </span>

                            <h2>{item.title}</h2>

                            <p>{item.description}</p>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}

export default Dashboard;