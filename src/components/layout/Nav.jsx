import { Link } from "react-router";

const Nav = ({ user, setUser }) => {

    const handleSignOut = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <nav className="top-nav">
            <Link className="nav-brand" to="/">
                RAL HR
            </Link>

            <div className="nav-right">
                <span className="nav-user">
                    {user.email}
                </span>

                <Link className="nav-link" to="/">
                    Home
                </Link>

                <button className="nav-signout" onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>
        </nav>
    )
}

export default Nav;