import { useEffect, useState } from "react";
import { getAttendances, generateAttendance } from "../../services/attendanceService";
import formatDate from "../../utils/formatDate";
import formatTime from "../../utils/formatTime";

const AttendanceManagement = () => {
    const [attendances, setAttendances] = useState([]);
    const [date, setDate] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const loadAttendance = async () => {
        try {
            const attendanceDate = await getAttendances();
            setAttendances(attendanceDate);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadAttendance();
    }, []);

    const handleGenerate = async date => {
        try {
            setError("");
            setMessage("");

            if (!date) {
                setError("Please select a date.");
                return;
            }

            setIsGenerating(true);

            const result = await generateAttendance(date);
            setMessage(`Generated: ${result.generated || 0}, Skipped: ${result.skipped} || 0`);

            await loadAttendance();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsGenerating(false);
        }
    }

    if (!isLoading) return <p>Loading attendance...</p>

    return (
        <div>
            <h1>Attendance Management</h1>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            <div>
                <label>
                    Generate Attendance For
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                </label>

                <button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? "Generating..." : "Generate"}
                </button>
            </div>

            {attendances.length === 0 ? (
                <p>No attendance records found.</p>
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
                            <th>Incomplete</th>
                            <th>Overtime</th>
                            <th>OT Status</th>
                            <th>Corrected</th>
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
                                <td>{attendance.isIncomplete ? "Yes" : "No"}</td>
                                <td>{attendance.overtimeHours}</td>
                                <td>{attendance.overtimeStatus || "-"}</td>
                                <td>{attendance.isCorrected ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default AttendanceManagement;