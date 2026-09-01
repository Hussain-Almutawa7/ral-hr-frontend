import { useEffect, useState } from "react";
import { getAllShiftAssignments, createShiftAssignment, updateShiftAssignment, getAllEmployees, getAllShiftTypes } from "../../services/settingsService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import Modal from "../../components/common/Modal";

import formatDate from "../../utils/formatDate";

const ShiftAssignments = ({ user }) => {
    const canEdit = ["HR Officer", "HR Manager"].includes(user.role);

    const [assignments, setAssignments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [shiftTypes, setShiftTypes] = useState([]);

    const [formData, setFormData] = useState({
        employee: "",
        shiftType: "",
        fromDate: "",
        toDate: ""
    });

    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [isModal, setIsModal] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadAssignments = async () => {
        try {
            setError("");

            const assignmentData = await getAllShiftAssignments();
            const employeeData = await getAllEmployees();
            const shiftTypeData = await getAllShiftTypes();

            setAssignments(assignmentData);
            setEmployees(employeeData);
            setShiftTypes(shiftTypeData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadAssignments();
    }, []);

    const handleOpenCreate = () => {
        setSelectedAssignment(null);

        setFormData({
            employee: "",
            shiftType: "",
            fromDate: "",
            toDate: ""
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleOpenEdit = assignment => {
        setSelectedAssignment(assignment);

        setFormData({
            employee: assignment.employee?._id || assignment.employee || "",
            shiftType: assignment.shiftType?._id || assignment.shiftType || "",
            fromDate: assignment.fromDate ? assignment.fromDate.split("T")[0] : "",
            toDate: assignment.toDate ? assignment.toDate.split("T")[0] : ""
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");
            setMessage("");

            const assignmentData = {
                ...formData,
                toDate: formData.toDate || null
            };

            if (selectedAssignment) {
                await updateShiftAssignment(selectedAssignment._id, assignmentData);
                setMessage("Shift assignment updated successfully.");
            } else {
                await createShiftAssignment(assignmentData);
                setMessage("Shift assignment created successfully.");
            }

            setIsModal(false);
            setSelectedAssignment(null);

            await loadAssignments();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) return <LoadingSpinner message="Loading shift assignments..." />

    return (
        <div>
            <h1>Shift Assignments</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            {canEdit && (
                <div className="actions">
                    <Button onClick={handleOpenCreate}>Add Shift Assignment</Button>
                </div>
            )}

            {assignments.length === 0 ? (
                <p>No shift assignments found</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Employee Code</th>
                            <th>Employee</th>
                            <th>Shift Type</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            {canEdit && <th>Actions</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {assignments.map(assignment => (
                            <tr key={assignment._id}>
                                <td>{assignment.employee?.employeeCode || "-"}</td>
                                <td>{assignment.employee?.nameEn || "-"}</td>
                                <td>{assignment.shiftType?.shiftName || "-"}</td>
                                <td>{formatDate(assignment.fromDate)}</td>
                                <td>{assignment.toDate ? formatDate(assignment.toDate) : "Open Ended"}</td>

                                {canEdit && (
                                    <td>
                                        <div className="actions">
                                            <Button variant="secondary" onClick={() => handleOpenEdit(assignment)}>
                                                Edit
                                            </Button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Modal isOpen={isModal} onClose={() => setIsModal(false)}>
                <form onSubmit={handleSubmit}>
                    <h2>
                        {selectedAssignment ? "Edit Shift Assignment" : "Add Shift Assignment"}
                    </h2>

                    <label>
                        Employee
                        <select name="employee" value={formData.employee} onChange={handleChange} disabled={selectedAssignment !== null} required>
                            <option value="">Select Employee</option>

                            {employees.map(employee => (
                                <option key={employee._id} value={employee._id}>
                                    {employee.employeeCode} - {employee.nameEn}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Shift Type
                        <select name="shiftType" value={formData.shiftType} onChange={handleChange} required>
                            <option value="">Select Shift Type</option>

                            {shiftTypes.map(type => (
                                <option key={type._id} value={type._id}>
                                    {type.shiftName}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        From Date
                        <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} required />
                    </label>

                    <label>
                        To Date
                        <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} />
                    </label>

                    <div className="actions">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : selectedAssignment ? "Save Changes" : "Add Shift Assignment"}
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

export default ShiftAssignments;