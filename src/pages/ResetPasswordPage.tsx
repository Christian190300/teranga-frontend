import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { reinitialiserMotDePasse } from "../api/authService";
import "./authPage.css";

function LogoMark({ size = 36, light = false }: { size?: number; light?: boolean }) {
    return (
        <span className="logo-mark" style={{ width: size, height: size }}>
            <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8.2A8.2 8.2 0 1 0 20 15.8" stroke={light ? "white" : "var(--ap-navy)"} strokeWidth="2.1" strokeLinecap="round" />
                <path d="M16.2 4.6l.85 1.9 1.9.85-1.9.85-.85 1.9-.85-1.9-1.9-.85 1.9-.85.85-1.9Z" fill="var(--ap-gold)" />
            </svg>
        </span>
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
            <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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

function IconAlert() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 7.5v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="16.3" r="1" fill="currentColor" />
        </svg>
    );
}

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") ?? "";

    const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);

        if (!token) {
            setError("Ce lien de réinitialisation est invalide. Redemandez un nouveau lien.");
            return;
        }
        if (nouveauMotDePasse !== confirmation) {
            setError("Les deux mots de passe ne correspondent pas.");
            return;
        }
        if (nouveauMotDePasse.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        setLoading(true);
        try {
            await reinitialiserMotDePasse(token, nouveauMotDePasse);
            navigate("/connexion", { state: { motDePasseReinitialise: true } });
        } catch {
            setError("Ce lien a expiré ou a déjà été utilisé. Redemandez un nouveau lien.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
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
                        Définissez un nouveau
                        <br />
                        <span>mot de passe</span>
                    </h1>
                    <p className="auth-panel__text">
                        Choisissez un mot de passe fort que vous n'utilisez sur aucun autre site.
                    </p>
                </div>
            </div>

            <div className="auth-panel-form">
                <div className="auth-card">
                    <Link to="/" className="auth-card__brand">
                        <LogoMark size={30} />
                        <span>
                            Talent<strong>Sénégal</strong>
                        </span>
                    </Link>

                    <span className="auth-card__eyebrow">Nouveau mot de passe</span>
                    <h1>Réinitialiser votre mot de passe</h1>
                    <p className="auth-card__subtitle">Choisissez un nouveau mot de passe pour votre compte.</p>

                    {error && (
                        <div className="form-error">
                            <IconAlert />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="field">
                            <label htmlFor="nouveauMotDePasse">Nouveau mot de passe</label>
                            <div className="input-with-icon">
                                <span className="input-with-icon__icon">
                                    <IconLock />
                                </span>
                                <input
                                    id="nouveauMotDePasse"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    value={nouveauMotDePasse}
                                    onChange={(e) => setNouveauMotDePasse(e.target.value)}
                                    placeholder="8 caractères minimum"
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

                        <div className="field">
                            <label htmlFor="confirmation">Confirmer le mot de passe</label>
                            <div className="input-with-icon">
                                <span className="input-with-icon__icon">
                                    <IconLock />
                                </span>
                                <input
                                    id="confirmation"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    value={confirmation}
                                    onChange={(e) => setConfirmation(e.target.value)}
                                    placeholder="Ressaisissez le mot de passe"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn--primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="btn__spinner" aria-hidden="true" />
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    Définir le mot de passe
                                    <span className="btn__arrow" aria-hidden="true">→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="auth-card__switch">
                        <Link to="/connexion">← Retour à la connexion</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}