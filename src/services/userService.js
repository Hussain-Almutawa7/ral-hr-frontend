const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api`

async function index() {
    try {
        const res = await fetch(`${BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();

        if (data.err) {
            throw new Error(data.err)
        }

        return data;

    } catch (e) {
        throw new Error(e);
    }
}

export {
    index,
}