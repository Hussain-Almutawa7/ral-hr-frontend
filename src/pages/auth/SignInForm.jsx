import { useNavigate } from "react-router";
import { useState } from "react";

import { signIn } from "../../services/auth";

import Button from "../../components/common/Button";
import Message from "../../components/common/Message";

const SignInForm = ({ setUser }) => {

    const navigate = useNavigate();

    const initialState = {
        email: "",
        password: "",
    }

    const [formData, setFormData] = useState(initialState);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = e => {
        setMessage("");

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setMessage("");

            const signedInUser = await signIn(formData);

            setUser(signedInUser);
            setFormData(initialState);

            navigate("/");
        } catch (e) {
            setMessage(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="card auth-card">
                <header>
                    <h1>Sign In</h1>
                    <p>Sign in to RAL HR</p>
                </header>

                <Message type="error">{message}</Message>

                <form onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input type="email" name="email" value={formData.email} required onChange={handleChange} />
                    </label>

                    <label>
                        Password
                        <input type="password" name="password" value={formData.password} required onChange={handleChange} />
                    </label>

                    <div className="actions auth-actions">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Signing In..." : "Sign In"}
                        </Button>

                        <Button variant="secondary" onClick={() => navigate("/")}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </section>
        </main>
    )
}

export default SignInForm;