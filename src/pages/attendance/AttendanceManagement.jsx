import { useEffect, useState } from "react";
import { getAttendances, generateAttendance } from "../../services/attendanceService";

import formatDate from "../../utils/formatDate";
import formatTime from "../../utils/formatTime";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import StatusBadge from "../../components/common/StatusBadge";

const AttendanceManagement = () => {
    const [attendances, setAttendances] = useState([]);
    const [date, setDate] = useState("");

    const [search, setSearch] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

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

    const handleGenerate = async () => {
        try {
            setError("");
            setMessage("");

            if (!date) {
                setError("Please select a date.");
                return;
            }

            setIsGenerating(true);

            const result = await generateAttendance(date);
            setMessage(`Generated: ${result.generated || 0}, Skipped: ${result.skipped || 0}`);

            await loadAttendance();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsGenerating(false);
        }
    }

    const filteredAttendances = attendances.filter(attendance => {
        const matchesSearch = attendance.employee?.nameEn?.toLowerCase().includes(search.toLocaleLowerCase());
        const matchesDate = filterDate === "" || new Date(attendance.date).toISOString().split("T")[0] === filterDate;
        const matchsStatus = statusFilter === "" || attendance.status === statusFilter;

        return matchesSearch && matchesDate && matchsStatus;
    });

    if (isLoading) return <LoadingSpinner message="Loading attendance..." />

    return (
        <div>
            <h1>Attendance Management</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            <div className="attendance-generate">
                <div className="attendance-generate-field">
                    <label htmlFor="attendanceDate"> Generate Attendance For</label>
                    <input id="attendanceDate" type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>

                <Button variant="primary" onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? "Generating..." : "Generate"}
                </Button>
            </div>

            <div className="filters">
                <div className="filter-field">
                    <label htmlFor="attendanceSearch">Employee</label>
                    <input id="attendanceSearch" type="text" placeholder="Search employee" value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <div className="filter-field">
                    <label htmlFor="filterDate">Date</label>
                    <input id="filterDate" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                </div>

                <div className="filter-field">
                    <label htmlFor="statusFilter">Status</label>
                    <select id="statusFilter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Half Day">Half Day</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Holiday">Holiday</option>
                        <option value="Weekly Off">Weekly Off</option>
                    </select>
                </div>

                <Button variant="secondary" onClick={() => { setSearch(""); setFilterDate(""); setStatusFilter(""); }}>
                    Clear Filters
                </Button>
            </div>

            {filteredAttendances.length === 0 ? (
                <p>No attendance records match the selected filters.</p>
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
                        {filteredAttendances.map(attendance => (
                            <tr key={attendance._id}>
                                <td>{attendance.employee?.nameEn || "-"}</td>
                                <td>{formatDate(attendance.date)}</td>

                                <td>
                                    <StatusBadge status={attendance.status} />
                                </td>

                                <td>{formatTime(attendance.inTime)}</td>
                                <td>{formatTime(attendance.outTime)}</td>
                                <td>{attendance.workedHours}</td>
                                <td>{attendance.isLateEntry ? "Yes" : "No"}</td>
                                <td>{attendance.isEarlyExit ? "Yes" : "No"}</td>
                                <td>{attendance.isIncomplete ? "Yes" : "No"}</td>
                                <td>{attendance.overtimeHours}</td>

                                <td>
                                    <StatusBadge status={attendance.overtimeStatus} />
                                </td>

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