const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api`;

// Company
const getCompany = async () => {
    try {
        const res = await fetch(`${BASE_URL}/company`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.err);

        return data;
    } catch (e) {
        throw Error(e.mesage);
    }
}

const updateCompany = async (companyData) => {
    try {
        const res = await fetch(`${BASE_URL}/company`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(companyData)
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.err);

        return data;
    } catch (e) {
        throw Error(e.message);
    }
}

export {
    getCompany,
    updateCompany,
}