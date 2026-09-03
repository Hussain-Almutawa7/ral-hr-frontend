import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getAllEmployees } from "../../services/employeeService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import StatusBadge from "../../components/common/StatusBadge";

const EmployeeList = () => {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);

    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const loadEmployees = async () => {
        try {
            setError("");

            const employeeData = await getAllEmployees();
            setEmployees(employeeData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadEmployees();
    }, []);

    const departments = [...new Map(employees.filter(employee => employee.department).map(employee => [employee.department._id, employee.department])).values()];

    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = search === "" || employee.nameEn?.toLowerCase().includes(search.toLowerCase()) || employee.employeeCode?.toLowerCase().includes(search.toLowerCase());
        const matchesDepartment = departmentFilter === "" || employee.department?._id === departmentFilter;
        const matchesStatus = statusFilter === "" || employee.status === statusFilter;

        return matchesSearch && matchesDepartment && matchesStatus;
    });

    if (isLoading) return <LoadingSpinner message="Loading employees..." />

    return (
        <div>
            <h1>Employees</h1>

            <Message type="error">{error}</Message>

            <div className="actions page-actions">
                <Button onClick={() => navigate("/employees/new")}>
                    Add Employee
                </Button>
            </div>

            <div className="filters">
                <div className="filter-field">
                    <label htmlFor="employeeSearch">Employee</label>
                    <input id="employeeSearch" type="text" placeholder="Name or employee code" value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <div className="filter-field">
                    <label htmlFor="departmentFilter">Department</label>
                    <select id="departmentFilter" value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
                        <option value="">All Departments</option>

                        {departments.map(department => (
                            <option key={department._id} value={department._id}>
                                {department.nameEn}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-field">
                    <label htmlFor="statusFilter">Status</label>

                    <select id="statusFilter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Left">Left</option>
                    </select>
                </div>

                <Button variant="secondary" onClick={() => { setSearch(""); setDepartmentFilter(""); setStatusFilter(""); }}>
                    Clear Filters
                </Button>
            </div>

            {filteredEmployees.length === 0 ? (
                <p>No employees match the selected filters.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee Code</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Reports To</th>
                                <th>Employment Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredEmployees.map(employee => (
                                <tr key={employee._id}>
                                    <td>{employee.employeeCode}</td>
                                    <td>{employee.nameEn}</td>
                                    <td>{employee.department?.nameEn || "-"}</td>
                                    <td>{employee.designation?.nameEn || "-"}</td>
                                    <td>{employee.reportsTo?.nameEn || "-"}</td>
                                    <td>{employee.employmentType}</td>

                                    <td>
                                        <StatusBadge status={employee.status} />
                                    </td>

                                    <td>
                                        <div className="actions">
                                            <Button variant="secondary" onClick={() => navigate(`/employees/${employee._id}`)}>
                                                View
                                            </Button>

                                            <Button variant="secondary" onClick={() => navigate(`/employees/${employee._id}/edit`)}>
                                                Edit
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default EmployeeList;