import { useState, useEffect } from "react";
import {
    getCorrections,
    correctAttendance,
    approveCorrection,
    rejectCorrection
} from "../../services/attendanceService";

import formatDate from "../../utils/formatDate";
import formatTime from "../../utils/formatTime";

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
        selectedCorrection(correction);
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

    if (isLoading) return <p>Loading corrections...</p>

    return (
        <div>
            <h1>Attendance Corrections</h1>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

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
                                <td>{correction.status}</td>
                                <td>{correction.rejectionReason}</td>

                                <td>
                                    {isHR && correction.status === "Requested" && (
                                        <button onClick={() => handleCorrect(correction._id)} disabled={actionLoading === correction._id}>
                                            Correct
                                        </button>
                                    )}

                                    {isManager && correction.status === "Corrected by HR" && (
                                        <>
                                            <button onClick={() => handleApprove(correction._id)} disabled={actionLoading === correction._id}>
                                                Approve
                                            </button>

                                            <button onClick={() => handleOpenReject(correction)} disabled={actionLoading === correction._id}>
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedCorrection && (
                <form onSubmit={handleReject}>
                    <h2>Reject Correction</h2>

                    <label>
                        Rejection Reason
                        <input type="text" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} required />
                    </label>

                    <button type="submit">Submit</button>
                    <button type="button" onClick={() => setSelectedCorrection(null)}>Cancel</button>
                </form>
            )}
        </div>
    )
}

export default AttendanceCorrections;