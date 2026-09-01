import { useState, useEffect } from "react";
import {
    getCorrections,
    correctAttendance,
    approveCorrection,
    rejectCorrection
} from "../../services/attendanceService";

import formatDate from "../../utils/formatDate";
import formatTime from "../../utils/formatTime";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

const AttendanceCorrections = ({ user }) => {
    const [corrections, setCorrections] = useState([]);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const [selectedCorrection, setSelectedCorrection] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const isHR = ["HR Officer", "HR Manager"].includes(user.role)
    const isManager = user.role === "Manager";

    const loadCorrections = async () => {
        try {
            const correctionData = await getCorrections();
            setCorrections(correctionData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCorrect = async correctionId => {
        try {
            setActionLoading(correctionId);
            setError("");
            setMessage("");

            await correctAttendance(correctionId);

            setMessage("Attendance corrected successfully");

            await loadCorrections();
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    }

    const handleApprove = async correctionId => {
        try {
            setActionLoading(correctionId);
            setError("");
            setMessage("");

            await approveCorrection(correctionId);

            setMessage("Correction approved successfully");

            await loadCorrections();
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    }

    const handleOpenReject = correction => {
        setSelectedCorrection(correction);
        setRejectionReason("");
        setError("");
    }

    const handleReject = async e => {
        e.preventDefault();

        try {
            setError("");
            setMessage("");

            await rejectCorrection(selectedCorrection._id, rejectionReason);

            setMessage("Correction rejected successfully.");

            setSelectedCorrection(null);
            setRejectionReason("");

            await loadCorrections();
        } catch (e) {
            setError(e.message);
        }
    }

    useEffect(() => {
        loadCorrections();
    }, []);

    if (isLoading) return <LoadingSpinner message="Loading corrections..." />

    return (
        <div>
            <h1>Attendance Corrections</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            {corrections.length === 0 ? (
                <p>No attendance corrections found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Requested In</th>
                            <th>Requested Out</th>
                            <th>Requested Status</th>
                            <th>Status</th>
                            <th>Rejection Reason</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {corrections.map(correction => (
                            <tr key={correction._id}>
                                <td>{correction.employee?.nameEn || "-"}</td>
                                <td>{formatDate(correction.date)}</td>
                                <td>{correction.reason}</td>
                                <td>{formatTime(correction.requestedInTime)}</td>
                                <td>{formatTime(correction.requestedOutTime)}</td>
                                <td>{correction.requestedStatus || "-"}</td>

                                <td>
                                    <StatusBadge status={correction.status} />
                                </td>

                                <td>{correction.rejectionReason || "-"}</td>

                                <td>
                                    {isHR && correction.status === "Requested" && (
                                        <Button variant="primary" onClick={() => handleCorrect(correction._id)} disabled={actionLoading === correction._id}>
                                            Correct
                                        </Button>
                                    )}

                                    {isManager && correction.status === "Corrected by HR" && (
                                        <div className="actions">
                                            <Button variant="success" onClick={() => handleApprove(correction._id)} disabled={actionLoading === correction._id}>
                                                Approve
                                            </Button>

                                            <Button variant="danger" onClick={() => handleOpenReject(correction)} disabled={actionLoading === correction._id}>
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Modal isOpen={selectedCorrection !== null} onClose={() => setSelectedCorrection(null)}>
                <form onSubmit={handleReject}>
                    <h2>Reject Correction</h2>

                    <label>
                        Rejection Reason
                        <input type="text" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} required />
                    </label>

                    <div className="actions">
                        <Button type="submit" variant="danger">Reject</Button>
                        <Button variant="secondary" onClick={() => setSelectedCorrection(null)}>Cancel</Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default AttendanceCorrections;