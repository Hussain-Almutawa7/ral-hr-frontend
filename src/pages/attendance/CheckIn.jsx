import { useEffect, useState } from "react";
import { getMyCheckins, createCheckin } from "../../services/attendanceService";

const CheckIn = () => {
    const [checkins, setCheckins] = useState = ([]);
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

            await createCheckin({logType});

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

        </>
    )
}

export default CheckIn;