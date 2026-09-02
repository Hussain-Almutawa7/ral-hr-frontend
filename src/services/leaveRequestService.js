const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/leave`

const index = async () => {
    try {
        const res = await fetch(`${BASE_URL}/requests`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return res.json()
    } catch (error) {
        throw Error(error.message)
    }
}

const show = async (leaveRequestId) => {
    try {
        const res = await fetch(`${BASE_URL}/requests/${leaveRequestId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return res.json()
    } catch (error) {
        throw Error(error.message)
    }
}

const downloadRequestDocument = async (requestId, fileName) => {
    try {
        const res = await fetch(`${BASE_URL}/requests/${requestId}/document`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        if (!res.ok) throw new Error("Failed to download document")

        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName || "document"
        a.click()
        window.URL.revokeObjectURL(url)
    } catch (error) {
        throw Error(error.message);
    }
}

const create = async formData => {
    try {
        const res = await fetch(`${BASE_URL}/requests`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        })
        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.err || "Something went wrong")
        }

        return data
    } catch (error) {
        throw Error(error.message)
    }
}

const submit = async (leaveRequestId) => {
    try {
        const res = await fetch(`${BASE_URL}/requests/${leaveRequestId}/submit`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.err || "Something went wrong")
        }

        return data
    } catch (error) {
        throw Error(error.message)
    }
}

const review = async (leaveRequestId, leaveRequestFormData) => {
    try {
        const res = await fetch(`${BASE_URL}/requests/${leaveRequestId}/review`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leaveRequestFormData),
        })
        const data = await res.json()

        return data
    } catch (error) {
        throw Error(error.message)
    }
}

const cancel = async (leaveRequestId, leaveRequestFormData) => {
    try {
        const res = await fetch(`${BASE_URL}/requests/${leaveRequestId}/cancel`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leaveRequestFormData),
        })
        const data = await res.json()

        return data
    } catch (error) {
        throw Error(error.message)
    }
}

const calendar = async () => {
    try {
        const res = await fetch(`${BASE_URL}/calendar`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return res.json()
    } catch (error) {
        throw Error(error.message)
    }
}

export {
    index,
    show,
    downloadRequestDocument,
    create,
    submit,
    review,
    cancel,
    calendar,
}