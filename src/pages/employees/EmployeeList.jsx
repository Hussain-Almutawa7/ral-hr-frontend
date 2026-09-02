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

            {employees.length === 0 ? (
                <p>No employees found</p>
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
                            {employees.map(employee => (
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