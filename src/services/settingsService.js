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
            method: "PATCH",
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

const getAllDepartments = async () => {
    try {
        const res = await fetch(`${BASE_URL}/departments`, {
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

const createDepartment = async (formData) => {
    try {
        const res = await fetch(`${BASE_URL}/departments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.err);

        return data;
    } catch (e) {
        throw Error(e.mesage);
    }
}

export {
    getCompany,
    updateCompany,
    getAllDepartments,
    createDepartment,
}