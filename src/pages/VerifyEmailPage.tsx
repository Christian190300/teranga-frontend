import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifierEmail, renvoyerVerification } from "../api/authService";
import "./authPage.css";

type Statut = "en-cours" | "succes" | "erreur" | "manquant";

function LogoMark({ size = 36 }: { size?: number }) {
    return (
        <span className="logo-mark" style={{ width: size, height: size }}>
            <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8.2A8.2 8.2 0 1 0 20 15.8" stroke="var(--ap-navy)" strokeWidth="2.1" strokeLinecap="round" />
                <path d="M16.2 4.6l.85 1.9 1.9.85-1.9.85-.85 1.9-.85-1.9-1.9-.85 1.9-.85.85-1.9Z" fill="var(--ap-gold)" />
            </svg>
        </span>
    );
}

function IconCheckCircle() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#1e7a3f" strokeWidth="1.6" />
            <path d="M7.5 12.3l3 3.2L16.5 8.5" stroke="#1e7a3f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconAlertCircle() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#b3261e" strokeWidth="1.6" />
            <path d="M12 7.5v5.5" stroke="#b3261e" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="16.3" r="1" fill="#b3261e" />
        </svg>
    );
}

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [statut, setStatut] = useState<Statut>(token ? "en-cours" : "manquant");
    const [messageErreur, setMessageErreur] = useState<string | null>(null);

    const [emailRenvoi, setEmailRenvoi] = useState("");
    const [renvoiEnvoye, setRenvoiEnvoye] = useState(false);
    const [renvoiEnCours, setRenvoiEnCours] = useState(false);

    useEffect(() => {
        if (!token) return;

        verifierEmail(token)
            .then(() => setStatut("succes"))
            .catch((err) => {
                setStatut("erreur");
                setMessageErreur(
                    err?.response?.data?.message ?? "Ce lien est invalide ou a expiré. Demandez-en un nouveau ci-dessous."
                );
            });
    }, [token]);

    async function handleRenvoi(event: React.FormEvent) {
        event.preventDefault();
        setRenvoiEnCours(true);
        try {
            await renvoyerVerification(emailRenvoi);
        } finally {
            setRenvoiEnCours(false);
            setRenvoiEnvoye(true);
        }
    }

    return (
        <div className="auth-page auth-page--centered">
            <div className="auth-panel-form">
                <div className="auth-card">
                    <Link to="/" className="auth-card__brand" style={{ display: "inline-flex" }}>
                        <LogoMark size={30} />
                        <span>
                            Talent<strong>Sénégal</strong>
                        </span>
                    </Link>

                    {statut === "en-cours" && (
                        <div className="verify-state">
                            <span className="verify-state__spinner" aria-hidden="true" />
                            <h1>Vérification en cours...</h1>
                            <p className="auth-card__subtitle">Merci de patienter un instant.</p>
                        </div>
                    )}

                    {statut === "succes" && (
                        <div className="verify-state">
                            <IconCheckCircle />
                            <h1>Adresse email confirmée !</h1>
                            <p className="auth-card__subtitle">
                                Votre compte est maintenant pleinement activé. Vous pouvez vous connecter.
                            </p>
                            <Link to="/connexion" className="btn btn--primary" style={{ marginTop: 8 }}>
                                Se connecter
                                <span className="btn__arrow" aria-hidden="true">→</span>
                            </Link>
                        </div>
                    )}

                    {(statut === "erreur" || statut === "manquant") && (
                        <div className="verify-state">
                            <IconAlertCircle />
                            <h1>{statut === "manquant" ? "Lien incomplet" : "Lien invalide"}</h1>
                            <p className="auth-card__subtitle">
                                {statut === "manquant"
                                    ? "Aucun token de vérification n'a été trouvé dans ce lien."
                                    : messageErreur}
                            </p>

                            {!renvoiEnvoye ? (
                                <form onSubmit={handleRenvoi} className="verify-resend-form">
                                    <div className="field">
                                        <label htmlFor="emailRenvoi">Renvoyer l'email de vérification</label>
                                        <input
                                            id="emailRenvoi"
                                            type="email"
                                            required
                                            value={emailRenvoi}
                                            onChange={(e) => setEmailRenvoi(e.target.value)}
                                            placeholder="votre@email.com"
                                            style={{
                                                border: "1.5px solid var(--ap-line)",
                                                borderRadius: 10,
                                                padding: "13px 14px",
                                                fontSize: "0.95rem",
                                                fontFamily: "var(--ap-font)",
                                            }}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn--primary" disabled={renvoiEnCours}>
                                        {renvoiEnCours ? "Envoi..." : "Renvoyer le lien"}
                                    </button>
                                </form>
                            ) : (
                                <p className="auth-card__subtitle" style={{ marginTop: 8 }}>
                                    Si un compte existe avec cette adresse, un nouvel email vient d'être envoyé.
                                </p>
                            )}
                        </div>
                    )}

                    <Link to="/" className="auth-card__back" style={{ marginTop: 28 }}>
                        <span aria-hidden="true">←</span> Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}