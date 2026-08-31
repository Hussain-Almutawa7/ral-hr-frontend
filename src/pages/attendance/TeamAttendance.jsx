import { useState, useEffect } from "react";
import { getTeamAttendance, updateOvertime, createCorrection } from "../../services/attendanceService";
import formatDate from "../../utils/formatDate";
import formatTime from "../../utils/formatTime";

const TeamAttendance = () => {
    const correctionFormData = {
        reason: "",
        requestedInTime: "",
        requestedOutTime: "",
        requestedStatus: "",
    }

    const [attendances, setAttendances] = useState([]);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [correctionForm, setCorrectionForm] = useState(correctionFormData);

    const [error, setError] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const loadTeamAttendance = async () => {
        try {
            const attendanceData = await getTeamAttendance();
            setAttendances(attendanceData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadTeamAttendance();
    }, []);

    const handleOvertime = async (attendanceId, approved) => {
        try {
            setActionLoading(attendanceId);
            setError("");

            await updateOvertime(attendanceId, approved);

            await loadTeamAttendance();
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    }

    const handleOpenCorrection = attendance => {
        setSelectedAttendance(attendance);
        setCorrectionForm(correctionFormData);

        setError("");
    }

    const handleChange = e => {
        setCorrectionForm({ ...correctionForm, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setError("");

            if (!correctionForm.requestedInTime && !correctionForm.requestedOutTime && !correctionForm.requestedStatus) {
                setError("Please provide at least one requested correction.");
                return;
            }

            const correctionData = {
                attendance: selectedAttendance._id,
                reason: correctionForm.reason,
            };

            if (correctionForm.requestedInTime)
                correctionData.requestedInTime = new Date(correctionForm.requestedInTime).toISOString();

            if (correctionForm.requestedOutTime)
                correctionData.requestedOutTime = new Date(correctionForm.requestedOutTime).toISOString();

            if (correctionForm.requestedStatus)
                correctionData.requestedStatus = correctionForm.requestedStatus;

            await createCorrection(correctionData);

            setSelectedAttendance(null);

        } catch (e) {
            setError(e.message);
        }
    }

    if (isLoading) return <p>Loading team attendance...</p>;

    return (
        <div>
            <h1>Team Attendance</h1>

            {error && <p>{error}</p>}

            {attendances.length === 0 ? (
                <p>No team attendance records found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>In</th>
                            <th>Out</th>
                            <th>Worked Hours</th>
                            <th>Late</th>
                            <th>Early Exit</th>
                            <th>Overtime</th>
                            <th>OT Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {attendances.map(attendance => (
                            <tr key={attendance._id}>
                                <td>{attendance.employee?.nameEn || "-"}</td>
                                <td>{formatDate(attendance.date)}</td>
                                <td>{attendance.status}</td>
                                <td>{formatTime(attendance.inTime)}</td>
                                <td>{formatTime(attendance.outTime)}</td>
                                <td>{attendance.workedHours}</td>
                                <td>{attendance.isLateEntry ? "Yes" : "No"}</td>
                                <td>{attendance.isEarlyExit ? "Yes" : "No"}</td>
                                <td>{attendance.overtimeHours}</td>
                                <td>{attendance.overtimeStatus || "-"}</td>
                                <td>
                                    {attendance.overtimeHours > 0 &&
                                        attendance.overtimeStatus === "Pending" && (
                                            <>
                                                <button
                                                    onClick={() => handleOvertime(attendance._id, true)}
                                                    disabled={actionLoading === attendance._id}
                                                >
                                                    Approve OT
                                                </button>

                                                <button
                                                    onClick={() => handleOvertime(attendance._id, false)}
                                                    disabled={actionLoading === attendance._id}
                                                >
                                                    Reject OT
                                                </button>
                                            </>
                                        )}

                                    <button onClick={() => handleOpenCorrection(attendance)}>
                                        Request Correction
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedAttendance && (
                <form onSubmit={handleSubmit}>
                    <h2>Request Attendance Correction</h2>

                    <p>Employee: {selectedAttendance.employee?.nameEn}</p>

                    <label>
                        Reason
                        <input type="text" name="reason" value={correctionForm.reason} onChange={handleChange} required />
                    </label>

                    <label>
                        Requested In Time
                        <input type="datetime-local" name="requestedInTime" value={correctionForm.requestedInTime} onChange={handleChange} />
                    </label>

                    <label>
                        Requested Out Time
                        <input type="datetime-local" name="requestedOutTime" value={correctionForm.requestedOutTime} onChange={handleChange} />
                    </label>

                    <label>
                        Requested Status
                        <select name="requestedStatus" value={correctionForm.requestedStatus} onChange={handleChange}>
                            <option value="">No status change</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Half Day">Half Day</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Holiday">Holiday</option>
                            <option value="Weekly Off">Weekly Off</option>
                        </select>
                    </label>

                    <button type="submit">Submit</button>
                    <button type="button" onClick={() => setSelectedAttendance(null)}>Cancel</button>
                </form>
            )}
        </div>
    )
}

export default TeamAttendance;