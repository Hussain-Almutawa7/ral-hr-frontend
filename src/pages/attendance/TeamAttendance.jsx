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
            
        </div>
    )
}

export default TeamAttendance;