import { useState, useEffect } from "react";
import { getTeamAttendance, updateOvertime } from "../../services/attendanceService";

const TeamAttendance = () => {
    const [attendances, setAttendances] = useState([]);
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
                                <td>{attendance.date}</td>
                                <td>{attendance.status}</td>
                                <td>{attendance.inTime}</td>
                                <td>{attendance.outTime}</td>
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default TeamAttendance;