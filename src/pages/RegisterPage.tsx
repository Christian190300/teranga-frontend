import {type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { register, type RoleUtilisateur } from "../api/authService";

export function RegisterPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const roleInitial: RoleUtilisateur = searchParams.get("role") === "recruteur" ? "RECRUTEUR" : "CANDIDAT";

    const [role, setRole] = useState<RoleUtilisateur>(roleInitial);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Champs entreprise (recruteur uniquement)
    const [nomEntreprise, setNomEntreprise] = useState("");
    const [secteurActivite, setSecteurActivite] = useState("");
    const [descriptionEntreprise, setDescriptionEntreprise] = useState("");
    const [telephoneEntreprise, setTelephoneEntreprise] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

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
            <div className="auth-card">
                <h1>Créer un compte</h1>
                <p className="auth-card__subtitle">Rejoignez Talent Sénégal en tant que :</p>

                <div className="role-toggle">
                    <button type="button" className={role === "CANDIDAT" ? "active" : ""} onClick={() => setRole("CANDIDAT")}>
                        Candidat
                    </button>
                    <button type="button" className={role === "RECRUTEUR" ? "active" : ""} onClick={() => setRole("RECRUTEUR")}>
                        Recruteur
                    </button>
                </div>

                {error && <div className="form-error">{error}</div>}
                {success && <div className="form-success">Compte créé ! Redirection vers la connexion...</div>}

                <form onSubmit={handleSubmit}>
                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="firstName">Prénom</label>
                            <input id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="lastName">Nom</label>
                            <input id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                    </div>

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
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="8 caractères minimum"
                        />
                    </div>

                    {role === "RECRUTEUR" && (
                        <>
                            <div className="field">
                                <label htmlFor="nomEntreprise">Nom de l'entreprise</label>
                                <input
                                    id="nomEntreprise"
                                    required
                                    value={nomEntreprise}
                                    onChange={(e) => setNomEntreprise(e.target.value)}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="secteurActivite">Secteur d'activité</label>
                                <input
                                    id="secteurActivite"
                                    value={secteurActivite}
                                    onChange={(e) => setSecteurActivite(e.target.value)}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="descriptionEntreprise">Description de l'entreprise</label>
                                <textarea
                                    id="descriptionEntreprise"
                                    rows={3}
                                    value={descriptionEntreprise}
                                    onChange={(e) => setDescriptionEntreprise(e.target.value)}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="telephoneEntreprise">Téléphone de l'entreprise</label>
                                <input
                                    id="telephoneEntreprise"
                                    value={telephoneEntreprise}
                                    onChange={(e) => setTelephoneEntreprise(e.target.value)}
                                    placeholder="+221 33 xxx xx xx"
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn--gold" disabled={loading}>
                        {loading ? "Création du compte..." : "Créer mon compte"}
                    </button>
                </form>

                <p className="auth-card__switch">
                    Déjà un compte ? <Link to="/connexion">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}