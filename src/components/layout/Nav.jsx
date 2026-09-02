import { Link, useNavigate} from "react-router";

const Nav = ({ user, setUser }) => {
    const navigate = useNavigate();

const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/", { replace: true });
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

                <button className="nav-signout" onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>
        </nav>
    )
}

export default Nav;