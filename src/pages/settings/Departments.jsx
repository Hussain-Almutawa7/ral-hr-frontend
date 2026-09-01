import { useEffect, useState } from "react";
import { getAllDepartments, createDepartment, updateDepartment, updateDepartmentStatus } from "../../services/settingsService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

const Departments = () => {
    const [departments, setDepartments] = useState([]);

    const [formData, setFormData] = useState({
        nameEn: "",
        nameAr: "",
    });

    const [selectedDepartments, setSelectedDepartments] = useState(null);
    const [isModal, setIsModal] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const loadDepartments = async () => {
        try {
            setError("");

            const departmentData = await getAllDepartments();
            setDepartments(departmentData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadDepartments();
    }, []);

    const handleOpenCreate = () => {
        setSelectedDepartments(null);

        setFormData({
            nameEn: "",
            nameAr: ""
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleOpenEdit = department => {
        setSelectedDepartments(department);

        setFormData({
            nameEn: department.nameEn || "",
            nameAr: department.nameAr || ""
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");
            setMessage("");

            if(selectedDepartments) {
                 await updateDepartment(selectedDepartments._id, formData);
                 setMessage("Department updated successfully.");
            } else {
                await createDepartment(formData);
                setMessage("Department created successfully.");
            }

            setIsModal(false);
            setSelectedDepartments(null);

            await loadDepartments();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleStatus = async department => {
        try {
            setActionLoading(department._id);
            setError("");
            setMessage("");

            await updateDepartmentStatus(department._id, !department.isActive)

            setMessage(department.isActive ? "Department deactivated successfully." : "Department activated successfully.");

            await loadDepartments();
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    }

    if(isLoading) return <LoadingSpinner message="Loading departments..." />

    return(
        <div>
            <h1>Departments</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            <div className="actions page-actions">
                <Button onClick={handleOpenCreate}>Add Department</Button>
            </div>

            {departments.length === 0 ? (
                <p>No departments found</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name (English)</th>
                            <th>Name (Arabic)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {departments.map(department => (
                            <tr key={department._id}>
                                <td>{department.nameEn}</td>
                                <td>{department.nameAr || "-"}</td>

                                <td>
                                    <StatusBadge status={department.isActive ? "Active" : "Inactive"} />
                                </td>

                                <td>
                                    <div className="actions">
                                        <Button variant="secondary" onClick={() => handleOpenEdit(department)}>
                                            Edit
                                        </Button>

                                        <Button 
                                        variant={department.isActive ? "danger" : "success"}
                                        onClick={() => handleStatus(department)}
                                        disabled={actionLoading === department._id}
                                        >
                                            {department.isActive ? "Deactivate" : "Activate"}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Modal isOpen={isModal} onClose={() => setIsModal(false)}>
                <form onSubmit={handleSubmit}>
                    <h2>
                        {selectedDepartments ? "Edit Department" : "Add Department"}
                    </h2>

                    <label>
                        Department Name (English)
                        <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} required />
                    </label>

                    <label>
                        Department Name (Arabic)
                        <input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} />
                    </label>

                    <div className="actions">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : selectedDepartments ? "Save Changes" : "Add Department"}
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

export default Departments;