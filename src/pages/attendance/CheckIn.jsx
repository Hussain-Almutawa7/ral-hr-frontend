import { useEffect, useState } from "react";
import { getMyCheckins, createCheckin } from "../../services/attendanceService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";

const CheckIn = () => {
    const [checkins, setCheckins] = useState([]);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            setIsSubmitting(true);
            setError("");
            setMessage("");

            await createCheckin({ logType, source: "Web" });

            setMessage(logType === "IN" ? "Checked in successfully." : "Checked out successfully.");

            await loadCheckins();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) return <LoadingSpinner message="Loading checkins..." />

    return (
        <>
            <div>
                <h1>Check In / Out</h1>

                <Message type="error">{error}</Message>
                <Message>{message}</Message>

                <div className="actions">
                    <Button variant="success" onClick={() => handleCheckin("IN")} disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Check In"}
                    </Button>

                    <Button variant="secondary" onClick={() => handleCheckin("OUT")} disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Check Out"}
                    </Button>
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