const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/notifications`

const index = async () => {
    try {
        const res = await fetch(BASE_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

const read = async (notificationId) => {
    try {
        const res = await fetch(`${BASE_URL}/${notificationId}/read`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

const readAll = async () => {
    try {
        const res = await fetch(`${BASE_URL}/read-all`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

export {
    index,
    read,
    readAll,
}