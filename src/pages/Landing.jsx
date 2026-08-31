import { Link } from "react-router";

function Landing() {
    return (
        <div>
            <h1>Welcome!</h1>
            <p>Sign in to see your dashboard.</p>

            <Link to="/sign-in">Sign In</Link>
        </div>
    )
}

export default Landing;