const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api`;

const getDashboard = async () => {
    try {
        const res = await fetch(`${BASE_URL}/dashboard`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.err);

        return data;
    } catch (e) {
        throw Error(e.message);
    }
}

export {
    getDashboard,
}