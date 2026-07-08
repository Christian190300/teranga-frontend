import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMonCompte } from "../api/authService";
import "./authPage.css"

function LogoMark({ size = 36, light = false }: { size?: number; light?: boolean }) {
    return (
        <span className="logo-mark" style={{ width: size, height: size }}>
            <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M20 8.2A8.2 8.2 0 1 0 20 15.8"
                    stroke={light ? "white" : "var(--ap-navy)"}
                    strokeWidth="2.1"
                    strokeLinecap="round"
                />
                <path
                    d="M16.2 4.6l.85 1.9 1.9.85-1.9.85-.85 1.9-.85-1.9-1.9-.85 1.9-.85.85-1.9Z"
                    fill="var(--ap-gold)"
                />
            </svg>
        </span>
    );
}

function IconMail() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 6.5l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconLock() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M7.5 10.5V7.8a4.5 4.5 0 0 1 9 0v2.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function IconEye() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function IconEyeOff() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3 3l18 18M10.6 5.2A10.9 10.9 0 0 1 12 5c7 0 10.5 7 10.5 7a13.2 13.2 0 0 1-3.1 3.9M6.5 6.6C3.4 8.5 1.5 12 1.5 12S5 19 12 19a10.6 10.6 0 0 0 4.2-.85M9.9 9.9a3 3 0 0 0 4.2 4.2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconCheck() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12.5l5.2 5.5L20 6" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconAlert() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 7.5v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="16.3" r="1" fill="currentColor" />
        </svg>
    );
}

const features = [
    "Profils vérifiés, candidatures suivies en temps réel",
    "Messagerie directe avec les recruteurs",
    "Accès à des centaines d'offres actives",
];

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);

            const compte = await getMonCompte();

            const authorities = compte.compte.authorities;

            if (authorities.includes("ROLE_ADMIN")) {
                navigate("/admin");
            } else if (authorities.includes("ROLE_RECRUTEUR")) {
                navigate("/recruteur/offres");
            } else if (authorities.includes("ROLE_CANDIDAT")) {
                navigate("/offres");
            } else {
                navigate("/");
            }

        } catch {
            setError("Email ou mot de passe incorrect.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            {/* Panneau de marque */}
            <div className="auth-panel">
                <div className="auth-panel__glow" />
                <div className="auth-panel__content">
                    <Link to="/" className="auth-panel__brand">
                        <LogoMark light />
                        <span>
                            Talent<strong>Sénégal</strong>
                        </span>
                    </Link>

                    <h1 className="auth-panel__title">
                        La plateforme digitale
                        <br />
                        pour les <span>talents</span> et les <span>entreprises</span>
                    </h1>

                    <p className="auth-panel__text">
                        Connectez-vous avec les entreprises les plus innovantes et les talents
                        les plus prometteurs du Sénégal.
                    </p>

                    <ul className="auth-panel__features">
                        {features.map((feature) => (
                            <li key={feature}>
                                <span className="auth-panel__check">
                                    <IconCheck />
                                </span>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <div className="auth-panel__stats">
                        <div className="auth-panel__stat">
                            <strong>203+</strong>
                            <span>Offres actives</span>
                        </div>
                        <div className="auth-panel__stat">
                            <strong>21+</strong>
                            <span>Entreprises</span>
                        </div>
                        <div className="auth-panel__stat">
                            <strong>98%</strong>
                            <span>Satisfaction</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Panneau formulaire */}
            <div className="auth-panel-form">
                <div className="auth-card">
                    <Link to="/" className="auth-card__brand">
                        <LogoMark size={30} />
                        <span>
                            Talent<strong>Sénégal</strong>
                        </span>
                    </Link>

                    <span className="auth-card__eyebrow">Espace personnel</span>
                    <h1>Bon retour !</h1>
                    <p className="auth-card__subtitle">Connectez-vous à votre espace Talent Sénégal.</p>

                    {error && (
                        <div className="form-error">
                            <IconAlert />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="field">
                            <label htmlFor="email">Adresse email</label>
                            <div className="input-with-icon">
                                <span className="input-with-icon__icon">
                                    <IconMail />
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre@email.com"
                                />
                            </div>
                        </div>

                        <div className="field">
                            <div className="field__label-row">
                                <label htmlFor="password">Mot de passe</label>
                                <Link to="/mot-de-passe-oublie" className="field__forgot-link">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <div className="input-with-icon">
                                <span className="input-with-icon__icon">
                                    <IconLock />
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Au moins 8 caractères"
                                />
                                <button
                                    type="button"
                                    className="input-with-icon__action"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                >
                                    {showPassword ? <IconEyeOff /> : <IconEye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn--primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="btn__spinner" aria-hidden="true" />
                                    Connexion...
                                </>
                            ) : (
                                <>
                                    Se connecter
                                    <span className="btn__arrow" aria-hidden="true">→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>ou</span>
                    </div>

                    <p className="auth-card__switch">
                        Pas encore de compte ? <Link to="/inscription">Créer un compte gratuit</Link>
                    </p>

                    <p className="auth-card__terms">
                        En vous connectant, vous acceptez nos <Link to="/cgu">CGU</Link> et notre{" "}
                        <Link to="/confidentialite">Politique de Confidentialité</Link>.
                    </p>

                    <Link to="/" className="auth-card__back">
                        <span aria-hidden="true">←</span> Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}