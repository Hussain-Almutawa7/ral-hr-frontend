const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api`;

const getAllEmployees = async () => {
    try {
        const res = await fetch(`${BASE_URL}/employees`, {
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

const getEmployeeById = async id => {
    try {
        const res = await fetch(`${BASE_URL}/employees/${id}`, {
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

const updateEmployeeStatus = async (id, statusData) => {
    try {
        const res = await fetch(`${BASE_URL}/employees/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(statusData)
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.err);

        return data;
    } catch (e) {
        throw Error(e.message);
    }
}

const createEmployee = async (formData) => {
    try {
        const res = await fetch(`${BASE_URL}/employees`, {
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
        throw Error(e.message);
    }
}

const updateEmployee = async (id, formData) => {
    try {
        const res = await fetch(`${BASE_URL}/employees/${id}`, {
            method: "PATCH",
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
        throw Error(e.message);
    }
}

export {
    getAllEmployees,
    getEmployeeById,
    updateEmployeeStatus,
    createEmployee,
    updateEmployee,
}