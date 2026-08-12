import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { renvoyerVerification } from "../api/authService";
import "./authPage.css";

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

function IconMailOpen() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3 8.5l8.3 5.8a1.4 1.4 0 0 0 1.4 0L21 8.5"
                stroke="var(--ap-gold)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect x="3" y="5.5" width="18" height="13" rx="2.4" stroke="var(--ap-navy)" strokeWidth="1.8" />
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

function IconAlert() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 7.5v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="16.3" r="1" fill="currentColor" />
        </svg>
    );
}

interface LocationState {
    email?: string;
}

export function VerificationEnvoyeePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = (location.state as LocationState | null)?.email;

    const [renvoiEnCours, setRenvoiEnCours] = useState(false);
    const [renvoiFait, setRenvoiFait] = useState(false);
    const [erreurRenvoi, setErreurRenvoi] = useState<string | null>(null);

    async function handleRenvoyer() {
        if (!email) return;
        setRenvoiEnCours(true);
        setErreurRenvoi(null);
        try {
            await renvoyerVerification(email);
            setRenvoiFait(true);
        } catch {
            setErreurRenvoi("Impossible de renvoyer l'email pour le moment. Réessayez dans quelques instants.");
        } finally {
            setRenvoiEnCours(false);
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
                        Plus qu'une étape
                        <br />
                        avant de <span>commencer</span>
                    </h1>

                    <p className="auth-panel__text">
                        La vérification de votre adresse email protège votre compte et garantit que
                        les recruteurs et candidats sur Talent Sénégal sont bien qui ils prétendent être.
                    </p>
                </div>
            </div>

            {/* Panneau principal */}
            <div className="auth-panel-form">
                <div className="auth-card">
                    <Link to="/" className="auth-card__brand">
                        <LogoMark size={30} />
                        <span>
                            Talent<strong>Sénégal</strong>
                        </span>
                    </Link>

                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                        <span
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                background: "var(--ap-gold-soft, #fbf3e2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <IconMailOpen />
                        </span>
                    </div>

                    <span className="auth-card__eyebrow" style={{ textAlign: "center", display: "block" }}>
                        Compte créé
                    </span>
                    <h1 style={{ textAlign: "center" }}>Vérifiez votre boîte mail</h1>
                    <p className="auth-card__subtitle" style={{ textAlign: "center" }}>
                        {email ? (
                            <>
                                Nous avons envoyé un lien de confirmation à <strong>{email}</strong>. Cliquez dessus
                                pour activer votre compte.
                            </>
                        ) : (
                            <>Un lien de confirmation vient de vous être envoyé par email. Cliquez dessus pour activer votre compte.</>
                        )}
                    </p>

                    {renvoiFait && (
                        <div className="form-success">
                            <IconCheckCircle />
                            <span>Un nouvel email vient d'être envoyé.</span>
                        </div>
                    )}
                    {erreurRenvoi && (
                        <div className="form-error">
                            <IconAlert />
                            <span>{erreurRenvoi}</span>
                        </div>
                    )}

                    <p style={{ fontSize: "0.85rem", color: "var(--ap-text-muted, #6f7488)", textAlign: "center", margin: "18px 0" }}>
                        Vous ne voyez rien ? Vérifiez vos spams, ou renvoyez l'email ci-dessous.
                    </p>

                    {email ? (
                        <button type="button" className="btn btn--primary" onClick={handleRenvoyer} disabled={renvoiEnCours}>
                            {renvoiEnCours ? (
                                <>
                                    <span className="btn__spinner" aria-hidden="true" />
                                    Envoi...
                                </>
                            ) : (
                                "Renvoyer l'email de vérification"
                            )}
                        </button>
                    ) : (
                        <button type="button" className="btn btn--primary" onClick={() => navigate("/connexion")}>
                            Aller à la connexion
                        </button>
                    )}

                    <p className="auth-card__switch">
                        Déjà vérifié ? <Link to="/connexion">Se connecter</Link>
                    </p>

                    <Link to="/" className="auth-card__back">
                        <span aria-hidden="true">←</span> Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}