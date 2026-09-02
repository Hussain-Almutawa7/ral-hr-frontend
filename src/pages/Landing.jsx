import { Link } from "react-router";
import logo from "../assets/branding/RAL-logo-white-transparent.png";

function Landing() {
    return (
        <main className="landing-page">
            <div className="landing-card">
                <div className="landing-logo">
                    <img src={logo} alt="RAL Technologies" />
                </div>

                <div className="landing-content">
                    <h1>Welcome to RAL HR</h1>

                    <p>
                        Manage your attendance, leave, documents, and employee information in one place.
                    </p>

                    <Link className="landing-signin" to="/sign-in">
                        Sign In
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default Landing;