import { useEffect, useState } from "react";
import { index } from "../services/userService";

function Dashboard({ user }) {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await index();
                setUsers(fetchedUsers);
            } catch (e) {
                console.log("Error: ", e.message);
            }
        }

        if (user) fetchUsers();
    }, []);

    return (
        <>
            <h1>Hello {user.email}</h1>
            {users.map(user => (
                <p className="display" key={user._id}>Email: {user.email}</p>
            ))}
        </>
    )
}

export default Dashboard;