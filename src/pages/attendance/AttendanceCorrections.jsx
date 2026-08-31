import { useState, useEffect } from "react";
import {
    getCorrections,
    correctAttendance,
    approveCorrection,
    rejectCorrection
} from "../../services/attendanceService";

const AttendanceCorrections = () => {
    const [corrections, setCorrections] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const [selectedCorrection, setSelectedCorrection] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

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

            setMessage("");

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

                </table>
            )}
        </div>
    )
}

export default AttendanceCorrections;