const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/leave/types`

const index = async () => {
    try {
        const res = await fetch(BASE_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return res.json()
    } catch (error) {
        throw Error(error.message)
    }
}

const create = async (leaveTypeFormData) => {
    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leaveTypeFormData),
        })
        const data = await res.json()

        return data
    } catch (error) {
        throw Error(error.message)
    }
}

const update = async (leaveTypeId, updatedLeaveType) => {
    try {
        const res = await fetch(`${BASE_URL}/${leaveTypeId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedLeaveType),
        })
        const data = await res.json()

        return data
    } catch (error) {
        throw Error(error.message)
    }
}

export {
    index,
    create,
    update,
}