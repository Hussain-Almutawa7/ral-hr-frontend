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
                <Link className="nav-link" to="/">
                    Home
                </Link>

                <Link className="nav-link" to="/">
                    <button className="nav-signout" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </Link>

            </div>
        </nav>
    )
}

export default Nav;