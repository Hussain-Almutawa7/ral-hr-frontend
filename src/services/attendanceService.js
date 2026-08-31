const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api`;

const CHECK_IN_URL = `${BASE_URL}/checkins`;
const ATTENDANCE_URL = `${BASE_URL}/attendances`;
const CORRECTION_URL = `${BASE_URL}/attendance-corrections`;

const createCheckin = async (checkinData) => {
    try {
        const res = await fetch(`${CHECK_IN_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(checkinData)
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.err);

        return data;
    } catch (e) {
        throw Error(e.message);
    }
}

export {
    createCheckin,
}