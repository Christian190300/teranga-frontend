import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { register, type RoleUtilisateur } from "../api/authService";
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

function IconUser() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4.5 20c1.4-4 4.2-6 7.5-6s6.1 2 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
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

function IconBuilding() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="3.5" width="11" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M15 9h5v11.5h-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M7.5 7.5h1.5M7.5 11h1.5M7.5 14.5h1.5M11.5 7.5H13M11.5 11H13M11.5 14.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function IconBriefcase() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="7.5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 12.5h18" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function IconPhone() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6 3.5h2.5l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V16a2.5 2.5 0 0 1-2.5 2.5C10 18.5 5.5 14 5.5 8.5A2.5 2.5 0 0 1 6 3.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconFileText() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 3.5h9l3 3v14H6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M9 12h6M9 15.5h6M9 8.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

function IconCheckCircle() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 12.3l2.6 2.7L16.3 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const featuresCandidat = [
    "Profils vérifiés, candidatures suivies en temps réel",
    "Messagerie directe avec les recruteurs",
    "Accès à des centaines d'offres actives",
];

const featuresRecruteur = [
    "Publiez vos offres en quelques minutes",
    "Accédez à un vivier de talents qualifiés",
    "Suivez vos candidatures depuis un seul tableau de bord",
];

export function RegisterPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const roleInitial: RoleUtilisateur = searchParams.get("role") === "recruteur" ? "RECRUTEUR" : "CANDIDAT";

    const [role, setRole] = useState<RoleUtilisateur>(roleInitial);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Champs entreprise (recruteur uniquement)
    const [nomEntreprise, setNomEntreprise] = useState("");
    const [secteurActivite, setSecteurActivite] = useState("");
    const [descriptionEntreprise, setDescriptionEntreprise] = useState("");
    const [telephoneEntreprise, setTelephoneEntreprise] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const features = role === "RECRUTEUR" ? featuresRecruteur : featuresCandidat;

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await register({
                firstName,
                lastName,
                email,
                password,
                role,
                ...(role === "RECRUTEUR"
                    ? { nomEntreprise, secteurActivite, descriptionEntreprise, telephoneEntreprise }
                    : {}),
            });
            setSuccess(true);
            setTimeout(() => navigate("/connexion"), 1500);
        } catch {
            setError("Impossible de créer le compte. Vérifiez vos informations et réessayez.");
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
                        Rejoignez la communauté
                        <br />
                        des <span>talents</span> et <span>entreprises</span>
                    </h1>

                    <p className="auth-panel__text">
                        Créez votre compte gratuitement et connectez-vous avec les entreprises les
                        plus innovantes et les talents les plus prometteurs du Sénégal.
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
                <div className="auth-card auth-card--wide">
                    <Link to="/" className="auth-card__brand">
                        <LogoMark size={30} />
                        <span>
                            Talent<strong>Sénégal</strong>
                        </span>
                    </Link>

                    <span className="auth-card__eyebrow">Nouveau compte</span>
                    <h1>Créer un compte</h1>
                    <p className="auth-card__subtitle">Rejoignez Talent Sénégal en tant que :</p>

                    <div className="role-toggle" role="tablist">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={role === "CANDIDAT"}
                            className={role === "CANDIDAT" ? "active" : ""}
                            onClick={() => setRole("CANDIDAT")}
                        >
                            Candidat
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={role === "RECRUTEUR"}
                            className={role === "RECRUTEUR" ? "active" : ""}
                            onClick={() => setRole("RECRUTEUR")}
                        >
                            Recruteur
                        </button>
                    </div>

                    {error && (
                        <div className="form-error">
                            <IconAlert />
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="form-success">
                            <IconCheckCircle />
                            <span>Compte créé ! Redirection vers la connexion...</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="field-row">
                            <div className="field">
                                <label htmlFor="firstName">Prénom</label>
                                <div className="input-with-icon">
                                    <span className="input-with-icon__icon">
                                        <IconUser />
                                    </span>
                                    <input
                                        id="firstName"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Aminata"
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label htmlFor="lastName">Nom</label>
                                <div className="input-with-icon">
                                    <span className="input-with-icon__icon">
                                        <IconUser />
                                    </span>
                                    <input
                                        id="lastName"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Diop"
                                    />
                                </div>
                            </div>
                        </div>

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
                            <label htmlFor="password">Mot de passe</label>
                            <div className="input-with-icon">
                                <span className="input-with-icon__icon">
                                    <IconLock />
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                        {role === "RECRUTEUR" && (
                            <>
                                <div className="field-divider">
                                    <span>Informations sur l'entreprise</span>
                                </div>

                                <div className="field">
                                    <label htmlFor="nomEntreprise">Nom de l'entreprise</label>
                                    <div className="input-with-icon">
                                        <span className="input-with-icon__icon">
                                            <IconBuilding />
                                        </span>
                                        <input
                                            id="nomEntreprise"
                                            required
                                            value={nomEntreprise}
                                            onChange={(e) => setNomEntreprise(e.target.value)}
                                            placeholder="Nom de votre entreprise"
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label htmlFor="secteurActivite">Secteur d'activité</label>
                                    <div className="input-with-icon">
                                        <span className="input-with-icon__icon">
                                            <IconBriefcase />
                                        </span>
                                        <input
                                            id="secteurActivite"
                                            value={secteurActivite}
                                            onChange={(e) => setSecteurActivite(e.target.value)}
                                            placeholder="Ex : Technologie, BTP, Finance..."
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label htmlFor="descriptionEntreprise">Description de l'entreprise</label>
                                    <div className="input-with-icon input-with-icon--textarea">
                                        <span className="input-with-icon__icon input-with-icon__icon--top">
                                            <IconFileText />
                                        </span>
                                        <textarea
                                            id="descriptionEntreprise"
                                            rows={3}
                                            value={descriptionEntreprise}
                                            onChange={(e) => setDescriptionEntreprise(e.target.value)}
                                            placeholder="Présentez brièvement votre entreprise..."
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label htmlFor="telephoneEntreprise">Téléphone de l'entreprise</label>
                                    <div className="input-with-icon">
                                        <span className="input-with-icon__icon">
                                            <IconPhone />
                                        </span>
                                        <input
                                            id="telephoneEntreprise"
                                            value={telephoneEntreprise}
                                            onChange={(e) => setTelephoneEntreprise(e.target.value)}
                                            placeholder="+221 33 xxx xx xx"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn btn--primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="btn__spinner" aria-hidden="true" />
                                    Création du compte...
                                </>
                            ) : (
                                <>
                                    Créer mon compte
                                    <span className="btn__arrow" aria-hidden="true">→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="auth-card__switch">
                        Déjà un compte ? <Link to="/connexion">Se connecter</Link>
                    </p>

                    <p className="auth-card__terms">
                        En créant un compte, vous acceptez nos <Link to="/cgu">CGU</Link> et notre{" "}
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