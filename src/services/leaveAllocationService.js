const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/leave/allocations`

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

const create = async (leaveAllocationFormData) => {
    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leaveAllocationFormData),
        })
        const data = await res.json()

        return data
    } catch (error) {
        throw Error(error.message)
    }
}

const update = async (leaveAllocationId, updatedLeaveAllocation) => {
    try {
        const res = await fetch(`${BASE_URL}/${leaveAllocationId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedLeaveAllocation),
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