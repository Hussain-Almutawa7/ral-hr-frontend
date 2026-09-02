import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { getEmployeeById, updateEmployeeStatus } from "../../services/employeeService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

import formatDate from "../../utils/formatDate";

const EmployeeDetails = () => {
    const navigate = useNavigate();
    const { employeeId } = useParams();

    const [employee, setEmployee] = useState(null);

    const [statusData, setStatusData] = useState({
        status: "",
        dateOfLeaving: ""
    });

    const [isStatusModal, setIsStatusModal] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadEmployee = async () => {
        try {
            setError("");

            const employeeData = await getEmployeeById(employeeId);
            setEmployee(employeeData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadEmployee();
    }, [employeeId]);

    const handleOpenStatus = () => {
        setStatusData({
            status: employee.status || "",
            dateOfLeaving: employee.dateOfLeaving ? employee.dateOfLeaving.split("T")[0] : ""
        });

        setError("");
        setMessage("");
        setIsStatusModal(true);
    }

    const handleStatusChange = e => {
        setStatusData({ ...statusData, [e.target.name]: e.target.value });
    }

    const handleStatusSubmit = async e => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");
            setMessage("");

            const data = {
                status: statusData.status
            };

            if (statusData.status === "Left") {
                data.dateOfLeaving = statusData.dateOfLeaving;
            }

            await updateEmployeeStatus(employeeId, data);

            setMessage("Employee status updated successfully.");
            setIsStatusModal(false);

            await loadEmployee();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) return <LoadingSpinner message="Loading employee..." />

    if (!employee) return <Message type="error">{error || "Employee not found."}</Message>

    return (
        <div>
            <h1>{employee.nameEn}</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            <div className="actions page-actions">
                <Button variant="secondary" onClick={() => navigate("/employees")}>
                    Back
                </Button>

                <Button onClick={() => navigate(`/employees/${employee._id}/edit`)}>
                    Edit Employee
                </Button>

                <Button variant="secondary" onClick={handleOpenStatus}>
                    Change Status
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
                            <strong>Name (English)</strong>
                            <span>{employee.nameEn}</span>
                        </div>

                        <div>
                            <strong>Name (Arabic)</strong>
                            <span>{employee.nameAr || "-"}</span>
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
                            <strong>Gender</strong>
                            <span>{employee.gender}</span>
                        </div>

                        <div>
                            <strong>Nationality</strong>
                            <span>{employee.nationality}</span>
                        </div>

                        <div>
                            <strong>Bahraini</strong>
                            <span>{employee.isBahraini ? "Yes" : "No"}</span>
                        </div>

                        <div>
                            <strong>Worker Category</strong>
                            <span>{employee.workerCategory}</span>
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
                            <strong>Probation End Date</strong>
                            <span>{employee.probationEndDate ? formatDate(employee.probationEndDate) : "-"}</span>
                        </div>

                        <div>
                            <strong>Employment Type</strong>
                            <span>{employee.employmentType}</span>
                        </div>

                        <div>
                            <strong>Status</strong>
                            <span>
                                <StatusBadge status={employee.status} />
                            </span>
                        </div>

                        <div>
                            <strong>Date of Leaving</strong>
                            <span>{employee.dateOfLeaving ? formatDate(employee.dateOfLeaving) : "-"}</span>
                        </div>
                    </div>
                </section>


                <section className="details-section">
                    <h2>Work Setup</h2>

                    <div className="details-grid">
                        <div>
                            <strong>Shift Type</strong>
                            <span>{employee.shiftType?.shiftName || "-"}</span>
                        </div>

                        <div>
                            <strong>Holiday List</strong>
                            <span>{employee.holidayList?.name || "-"}</span>
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


                <section className="details-section">
                    <h2>Bank Information</h2>

                    <div className="details-grid">
                        <div>
                            <strong>Bank</strong>
                            <span>{employee.bankName?.nameEn || "-"}</span>
                        </div>

                        <div>
                            <strong>IBAN</strong>
                            <span>{employee.iban}</span>
                        </div>
                    </div>
                </section>

            </div>


            <Modal isOpen={isStatusModal} onClose={() => setIsStatusModal(false)}>
                <form onSubmit={handleStatusSubmit}>
                    <h2>Change Employee Status</h2>

                    <label>
                        Status
                        <select name="status" value={statusData.status} onChange={handleStatusChange} required>
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Left">Left</option>
                        </select>
                    </label>

                    {statusData.status === "Left" && (
                        <label>
                            Date of Leaving
                            <input type="date" name="dateOfLeaving" value={statusData.dateOfLeaving} onChange={handleStatusChange} required />
                        </label>
                    )}

                    <div className="actions">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Status"}
                        </Button>

                        <Button variant="secondary" onClick={() => setIsStatusModal(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>

        </div>
    )
}

export default EmployeeDetails;