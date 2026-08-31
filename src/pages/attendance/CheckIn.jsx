import { useEffect, useState } from "react";
import { getMyCheckins, createCheckin } from "../../services/attendanceService";

const CheckIn = () => {
    const [checkins, setCheckins] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

        const loadCheckins = async () => {
            try {
                const checkinData = await getMyCheckins();
                setCheckins(checkinData);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        }

    useEffect(() => {
        loadCheckins();
    }, []);

    const handleCheckin = async (logType) => {
        try {
            setIsLoading(true);
            setError("");
            setMessage("");

            await createCheckin({logType, source: "Web"});

            setMessage(logType === "IN" ? "Checked in successfully." : "Checked out successfully");

            await loadCheckins();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <>
            <div>
                <h1>Check In / Out</h1>

                {error && <p>{error}</p>}
                {message && <p>{message}</p>}

                <div>
                    <button onClick={() => handleCheckin("IN")} disabled={isLoading}>Check In</button>
                     <button onClick={() => handleCheckin("OUT")} disabled={isLoading}>Check Out</button>
                </div>

                <h2>Check-in History</h2>

                {checkins.length === 0 ? (
                    <p>No check-ins found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Time</th>
                                <th>Source</th>
                            </tr>
                        </thead>

                        <tbody>
                            {checkins.map(checkin => (
                                <tr key={checkin._id}>
                                    <td>{checkin.logType}</td>
                                    <td>
                                        {new Date(checkin.timestamp).toLocaleString()}
                                    </td>
                                    <td>{checkin.source}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
}

export default CheckIn;