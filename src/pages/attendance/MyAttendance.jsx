import { useState, useEffect } from "react";
import { getMyAttendance } from "../../services/attendanceService";
import { Link } from "react-router";
import formatDate from "../../utils/formatDate";
import formatTime from "../../utils/formatTime";

const MyAttendance = () => {
    const [attendances, setAttendances] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const loadAttendance = async () => {
        try {
            const attendanceData = await getMyAttendance();
            setAttendances(attendanceData)
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadAttendance();
    }, []);

    if(isLoading) return <p>Loading attendance....</p>

    return(
        <div>
        <h1>My Attendance</h1>
        <Link to="/attendance/check-in">Check In / Out</Link>

        {error && <p>{error}</p>}

        {attendances.length === 0 ? (
            <p>No attendance records found.</p>
        ) : (
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>In</th>
                        <th>Out</th>
                        <th>Worked Hours</th>
                        <th>Late</th>
                        <th>Early Exit</th>
                        <th>Incomplete</th>
                        <th>Overtime</th>
                        <th>Overtime status</th>
                    </tr>
                </thead>

                <tbody>
                    {attendances.map(attendance => (
                        <tr key={attendance._id}>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
        </div>
    );
};

export default MyAttendance;