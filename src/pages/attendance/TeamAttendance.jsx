import { useState, useEffect } from "react";
import { getTeamAttendance } from "../../services/attendanceService";

const TeamAttendance = () => {
    const [attendances, setAttendances] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // const loadTeamAttendance = async 

    return (
        <div>

        </div>
    )
}

export default TeamAttendance;