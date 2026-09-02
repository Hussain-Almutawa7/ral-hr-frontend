import { useEffect, useState } from "react";
import { getAllUsers, createUser, updateUser, updateUserStatus } from "../../services/userService";
import { getAllEmployees } from "../../services/employeeService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

const UserManagement = () => {
    const roles = [
        "Employee",
        "Manager",
        "HR Officer",
        "HR Manager",
        "Owner/Finance"
    ];

    const [users, setUsers] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [formData, setFormData] = useState({
        employee: "",
        email: "",
        password: "",
        role: "Employee"
    });

    const [selectedUser, setSelectedUser] = useState(null);
    const [isModal, setIsModal] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const loadUsers = async () => {
        try {
            setError("");

            const userData = await getAllUsers();
            const employeeData = await getAllEmployees();

            setUsers(userData);
            setEmployees(employeeData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    const handleOpenCreate = () => {
        setSelectedUser(null);

        setFormData({
            employee: "",
            email: "",
            password: "",
            role: "Employee"
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleOpenEdit = user => {
        setSelectedUser(user);

        setFormData({
            employee: user.employee?._id || user.employee || "",
            email: user.email || "",
            password: "",
            role: user.role || "Employee"
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleChange = e => {
        setFormData({  ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");
            setMessage("");

            if (selectedUser) {
                const updateData = {
                    email: formData.email,
                    role: formData.role
                };

                if (formData.password) {
                    updateData.password = formData.password;
                }

                await updateUser(selectedUser._id, updateData);

                setMessage("User updated successfully.");
            } else {
                await createUser(formData);

                setMessage("User created successfully.");
            }

            setIsModal(false);
            setSelectedUser(null);

            await loadUsers();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleStatus = async user => {
        try {
            setActionLoading(user._id);
            setError("");
            setMessage("");

            await updateUserStatus(user._id, !user.isActive);

            setMessage(user.isActive ? "User deactivated successfully."  : "User activated successfully.");

            await loadUsers();
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    }

    const availableEmployees = employees.filter(employee => {
        return !users.some(user => {
            const userEmployeeId = user.employee?._id || user.employee;

            return userEmployeeId === employee._id;
        });
    });

    if (isLoading) return <LoadingSpinner message="Loading users..." />

    return (
        <div>
            <h1>User Management</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            <div className="actions page-actions">
                <Button onClick={handleOpenCreate}>
                    Add User
                </Button>
            </div>

            {users.length === 0 ? (
                <p>No users found</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee Code</th>
                                <th>Employee</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.employee?.employeeCode || "-"}</td>
                                    <td>{user.employee?.nameEn || "-"}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>

                                    <td>
                                        <StatusBadge status={user.isActive ? "Active" : "Inactive"} />
                                    </td>

                                    <td>
                                        <div className="actions">
                                            <Button variant="secondary" onClick={() => handleOpenEdit(user)}>
                                                Edit
                                            </Button>

                                            <Button variant={user.isActive ? "danger" : "success"} onClick={() => handleStatus(user)} disabled={actionLoading === user._id} >
                                                {user.isActive ? "Deactivate" : "Activate"}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModal} onClose={() => setIsModal(false)}>
                <form onSubmit={handleSubmit}>
                    <h2>
                        {selectedUser ? "Edit User" : "Add User"}
                    </h2>

                    {!selectedUser && (
                        <label htmlFor="employee">
                            Employee
                            <select id="employee" name="employee" value={formData.employee} onChange={handleChange} required>
                                <option value="">Select Employee</option>

                                {availableEmployees.map(employee => (
                                    <option key={employee._id} value={employee._id}>
                                        {employee.employeeCode} - {employee.nameEn}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}

                    <label htmlFor="email">
                        Email
                        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </label>

                    <label htmlFor="role">
                        Role
                        <select id="role" name="role" value={formData.role} onChange={handleChange} required>
                            {roles.map(role => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label htmlFor="password">
                        {selectedUser ? "New Password (optional)" : "Password"}

                        <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required={!selectedUser}/>
                    </label>

                    <div className="actions">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : selectedUser ? "Save Changes" : "Add User"}
                        </Button>

                        <Button variant="secondary" onClick={() => setIsModal(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default UserManagement;