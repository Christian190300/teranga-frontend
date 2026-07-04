import {type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            navigate("/");
        } catch {
            setError("Email ou mot de passe incorrect.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Se connecter</h1>
                <p className="auth-card__subtitle">Accédez à votre espace Talent Sénégal.</p>

                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="email">Adresse email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="vous@exemple.com"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn btn--primary" disabled={loading}>
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>

                <p className="auth-card__switch">
                    Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
                </p>
            </div>
        </div>
    );
}