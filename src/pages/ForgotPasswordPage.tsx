import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { demanderResetMotDePasse } from "../api/authService";
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

function IconMail() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 6.5l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconCheckCircle() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 12.3l2.6 2.7L16.3 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [envoye, setEnvoye] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        try {
            await demanderResetMotDePasse(email);
        } finally {
            // On affiche toujours le même message de succès, que l'email existe ou non
            // (le backend ne révèle jamais si un compte existe pour cet email).
            setEnvoye(true);
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
                        Récupérez l'accès
                        <br />à votre <span>compte</span>
                    </h1>
                    <p className="auth-panel__text">
                        Indiquez votre adresse email et nous vous enverrons un lien pour définir un nouveau mot de passe.
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

                    <span className="auth-card__eyebrow">Mot de passe oublié</span>
                    <h1>Réinitialiser mon mot de passe</h1>
                    <p className="auth-card__subtitle">
                        Saisissez l'adresse email associée à votre compte.
                    </p>

                    {envoye ? (
                        <div className="form-success">
                            <IconCheckCircle />
                            <span>
                                Si un compte existe pour cette adresse, un email contenant un lien de réinitialisation vient
                                d'être envoyé. Pensez à vérifier vos spams.
                            </span>
                        </div>
                    ) : (
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

                            <button type="submit" className="btn btn--primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="btn__spinner" aria-hidden="true" />
                                        Envoi...
                                    </>
                                ) : (
                                    <>
                                        Envoyer le lien
                                        <span className="btn__arrow" aria-hidden="true">→</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <p className="auth-card__switch">
                        <Link to="/connexion">← Retour à la connexion</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}