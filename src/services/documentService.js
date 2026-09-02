const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api`;

const getAllDocuments = async () => {
    try {
        const res = await fetch(`${BASE_URL}/documents`, {
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

const uploadDocument = async formData => {
    try {
        const res = await fetch(`${BASE_URL}/documents`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.err);

        return data;
    } catch (e) {
        throw Error(e.message);
    }
}

const verifyDocument = async id => {
    try {
        const res = await fetch(`${BASE_URL}/documents/${id}/verify`, {
            method: "PATCH",
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

const rejectDocument = async (id, rejectionReason) => {
    try {
        const res = await fetch(`${BASE_URL}/documents/${id}/reject`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ rejectionReason })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.err);

        return data;
    } catch (e) {
        throw Error(e.message);
    }
}

const archiveDocument = async id => {
    try {
        const res = await fetch(`${BASE_URL}/documents/${id}/archive`, {
            method: "PATCH",
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

const downloadDocument = async (id, fileName) => {
    try {
        const res = await fetch(`${BASE_URL}/documents/${id}/download` , {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.err);
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download =  fileName || "document";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    } catch (e) {
        throw Error(e.message);
    }
}

export {
    getAllDocuments,
    uploadDocument,
    verifyDocument,
    rejectDocument,
    archiveDocument,
    downloadDocument,
}