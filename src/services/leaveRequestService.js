const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/leave`

const index = async () => {
    try {
        const res = await fetch(`${BASE_URL}/requests`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return res.json()
    } catch (error) {
        console.log(error)
    }
}

const show = async (leaveRequestId) => {
    try {
        const res = await fetch(`${BASE_URL}/requests/${leaveRequestId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return res.json()
    } catch (error) {
        console.log(error)
    }
}

const create = async (leaveRequestFormData) => {
    try {
        const res = await fetch(`${BASE_URL}/requests`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leaveRequestFormData),
        })
        const data = await res.json()

        return data
    } catch (error) {
        console.log(error)
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

        return data
    } catch (error) {
        console.log(error)
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
        console.log(error)
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
        console.log(error)
    }
}

const calendar = async () => {
    try {
        const res = await fetch(`${BASE_URL}/calendar`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return res.json()
    } catch (error) {
        console.log(error)
    }
}

export {
    index,
    show,
    create,
    submit,
    review,
    cancel,
    calendar,
}