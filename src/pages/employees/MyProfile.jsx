import { useEffect, useState } from "react";

import { getMyEmployee, updateMyContact } from "../../services/employeeService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

import formatDate from "../../utils/formatDate";

const MyProfile = () => {
    const [employee, setEmployee] = useState(null);

    const [formData, setFormData] = useState({
        mobile: "",
        emailPersonal: ""
    });

    const [isModal, setIsModal] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadEmployee = async () => {
        try {
            setError("");

            const employeeData = await getMyEmployee();
            setEmployee(employeeData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadEmployee();
    }, []);

    const handleOpenEdit = () => {
        setFormData({
            mobile: employee.mobile || "",
            emailPersonal: employee.emailPersonal || ""
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");
            setMessage("");

            await updateMyContact({
                mobile: formData.mobile,
                emailPersonal: formData.emailPersonal || null
            });

            setMessage("Contact information updated successfully.");
            setIsModal(false);

            await loadEmployee();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) return <LoadingSpinner message="Loading profile..." />

    if (!employee) {
        return <Message type="error">{error || "Employee profile not found."}</Message>
    }

    return (
        <div>
            <h1>My Profile</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            <div className="actions page-actions">
                <Button onClick={handleOpenEdit}>
                    Edit Contact Information
                </Button>
            </div>

            <div className="employee-details">

                <section className="details-section">
                    <h2>Personal Information</h2>

                    <div className="details-grid">
                        <div>
                            <strong>Employee Code</strong>
                            <span>{employee.employeeCode}</span>
                        </div>

                        <div>
                            <strong>Name</strong>
                            <span>{employee.nameEn}</span>
                        </div>

                        <div>
                            <strong>CPR Number</strong>
                            <span>{employee.cprNumber}</span>
                        </div>

                        <div>
                            <strong>Date of Birth</strong>
                            <span>{formatDate(employee.dateOfBirth)}</span>
                        </div>

                        <div>
                            <strong>Nationality</strong>
                            <span>{employee.nationality}</span>
                        </div>

                        <div>
                            <strong>Status</strong>
                            <span>
                                <StatusBadge status={employee.status} />
                            </span>
                        </div>
                    </div>
                </section>


                <section className="details-section">
                    <h2>Employment Information</h2>

                    <div className="details-grid">
                        <div>
                            <strong>Department</strong>
                            <span>{employee.department?.nameEn || "-"}</span>
                        </div>

                        <div>
                            <strong>Designation</strong>
                            <span>{employee.designation?.nameEn || "-"}</span>
                        </div>

                        <div>
                            <strong>Reports To</strong>
                            <span>{employee.reportsTo?.nameEn || "-"}</span>
                        </div>

                        <div>
                            <strong>Date of Joining</strong>
                            <span>{formatDate(employee.dateOfJoining)}</span>
                        </div>

                        <div>
                            <strong>Employment Type</strong>
                            <span>{employee.employmentType}</span>
                        </div>
                    </div>
                </section>


                <section className="details-section">
                    <h2>Contact Information</h2>

                    <div className="details-grid">
                        <div>
                            <strong>Mobile</strong>
                            <span>{employee.mobile}</span>
                        </div>

                        <div>
                            <strong>Personal Email</strong>
                            <span>{employee.emailPersonal || "-"}</span>
                        </div>

                        <div>
                            <strong>Work Email</strong>
                            <span>{employee.emailWork || "-"}</span>
                        </div>
                    </div>
                </section>

            </div>


            <Modal isOpen={isModal} onClose={() => setIsModal(false)}>
                <form onSubmit={handleSubmit}>
                    <h2>Edit Contact Information</h2>

                    <label>
                        Mobile
                        <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} maxLength="8" required />
                    </label>

                    <label>
                        Personal Email
                        <input type="email" name="emailPersonal" value={formData.emailPersonal} onChange={handleChange} />
                    </label>

                    <div className="actions">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
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

export default MyProfile;