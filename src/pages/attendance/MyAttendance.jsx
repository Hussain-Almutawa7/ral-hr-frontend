import { useState, useEffect } from "react";
import { getMyAttendance } from "../../services/attendanceService";
import { Link } from "react-router";

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

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            time: "Asia/Bahrain"
        });
    }

    const formatTime = (time) => {
        if(!time) return "-";

        return new Date(time).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Bahrain"
        });
    }

    if(isLoading) return <p>Loading attendance....</p>

    return(
        <>
        <h1>My Attendance</h1>
        <Link to="/attendance/check-in">Check In / Out</Link>
        </>
    );
};

export default MyAttendance;