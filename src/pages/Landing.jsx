import { Link } from "react-router";
import Button from "../components/common/Button";

function Landing() {
    return (
        <div className="landing-page">
            <div className="card">
                <h1>Welcome to RAL Technologies!</h1>
                <p>Sign in to see your dashboard.</p>

                <Link to="/sign-in">
                    <Button variant="secondary" onClick={() => navigate("/sign-in")}>Sign in</Button>
                </Link>
            </div>
        </div>
    )
}

export default Landing;