import { useState } from "react";
import { ROLES_GERES, LABELS_ROLES } from "../../api/adminUserService";
import type { CreerUtilisateurAdmin } from "../../api/adminUserService";
import "./CreerUtilisateurModal.css";

function IconUser() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4.5 20c1.4-4 4.2-6 7.5-6s6.1 2 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function IconMail() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 6.5l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconLock() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function IconWand() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20l10-10M15.5 4.5l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2ZM19 13.5l.6 1.3 1.3.6-1.3.6-.6 1.3-.6-1.3-1.3-.6 1.3-.6.6-1.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconCandidat() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4.5 20c1.4-4 4.2-6 7.5-6s6.1 2 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function IconRecruteur() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="7.5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function IconAdmin() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3l7 3.5v5c0 4.5-3 8.2-7 9.5-4-1.3-7-5-7-9.5v-5L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const ICONES_ROLE = {
    ROLE_CANDIDAT: IconCandidat,
    ROLE_RECRUTEUR: IconRecruteur,
    ROLE_ADMIN: IconAdmin,
};

function genererMotDePasse(): string {
    const majuscules = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const minuscules = "abcdefghijkmnpqrstuvwxyz";
    const chiffres = "23456789";
    const speciaux = "!@#$%";
    const tout = majuscules + minuscules + chiffres + speciaux;

    let mdp = majuscules[Math.floor(Math.random() * majuscules.length)];
    mdp += minuscules[Math.floor(Math.random() * minuscules.length)];
    mdp += chiffres[Math.floor(Math.random() * chiffres.length)];
    mdp += speciaux[Math.floor(Math.random() * speciaux.length)];
    for (let i = 0; i < 6; i++) {
        mdp += tout[Math.floor(Math.random() * tout.length)];
    }
    return mdp
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
}

interface CreerUtilisateurModalProps {
    onFermer: () => void;
    onCreer: (dto: CreerUtilisateurAdmin) => Promise<void>;
}

export function CreerUtilisateurModal({ onFermer, onCreer }: CreerUtilisateurModalProps) {
    const [dto, setDto] = useState<CreerUtilisateurAdmin>({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        role: ROLES_GERES[0],
    });
    const [showPassword, setShowPassword] = useState(false);
    const [envoi, setEnvoi] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);

    const initiales = `${dto.firstName[0] ?? ""}${dto.lastName[0] ?? ""}`.toUpperCase();

    function handleGenererMotDePasse() {
        setDto((prev) => ({ ...prev, password: genererMotDePasse() }));
        setShowPassword(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setEnvoi(true);
        setErreur(null);
        try {
            await onCreer(dto);
        } catch {
            setErreur("La création a échoué. Vérifie les champs et réessaie.");
        } finally {
            setEnvoi(false);
        }
    }

    return (
        <div className="user-modal__backdrop" onClick={onFermer}>
            <div className="user-modal" onClick={(e) => e.stopPropagation()}>
                <div className="user-modal__header">
                    <div className="user-modal__avatar">{initiales || <IconUser />}</div>
                    <div>
                        <h2 className="user-modal__title">Ajouter un utilisateur</h2>
                        <p className="user-modal__subtitle">Le compte est créé avec un mot de passe temporaire.</p>
                    </div>
                    <button type="button" className="user-modal__close" onClick={onFermer} aria-label="Fermer">
                        ×
                    </button>
                </div>

                <form className="user-form" onSubmit={handleSubmit}>
                    <div className="user-form__section">
                        <p className="user-form__section-title">Identité</p>
                        <div className="user-form__row">
                            <label className="user-form__field">
                                <span>Prénom</span>
                                <div className="user-form__input-icon">
                                    <IconUser />
                                    <input
                                        required
                                        maxLength={50}
                                        value={dto.firstName}
                                        onChange={(e) => setDto({ ...dto, firstName: e.target.value })}
                                        placeholder="Aminata"
                                    />
                                </div>
                            </label>
                            <label className="user-form__field">
                                <span>Nom</span>
                                <div className="user-form__input-icon">
                                    <IconUser />
                                    <input
                                        required
                                        maxLength={50}
                                        value={dto.lastName}
                                        onChange={(e) => setDto({ ...dto, lastName: e.target.value })}
                                        placeholder="Diop"
                                    />
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="user-form__section">
                        <p className="user-form__section-title">Contact</p>
                        <label className="user-form__field">
                            <span>Adresse email</span>
                            <div className="user-form__input-icon">
                                <IconMail />
                                <input
                                    required
                                    type="email"
                                    value={dto.email}
                                    onChange={(e) => setDto({ ...dto, email: e.target.value })}
                                    placeholder="utilisateur@email.com"
                                />
                            </div>
                        </label>
                    </div>

                    <div className="user-form__section">
                        <p className="user-form__section-title">Sécurité</p>
                        <label className="user-form__field">
                            <span>Mot de passe temporaire</span>
                            <div className="user-form__input-icon">
                                <IconLock />
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    minLength={8}
                                    maxLength={100}
                                    value={dto.password}
                                    onChange={(e) => setDto({ ...dto, password: e.target.value })}
                                    placeholder="8 caractères minimum"
                                />
                                <button
                                    type="button"
                                    className="user-form__icon-btn"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Masquer" : "Afficher"}
                                >
                                    {showPassword ? <IconEyeOff /> : <IconEye />}
                                </button>
                            </div>
                        </label>
                        <button type="button" className="user-form__generate" onClick={handleGenererMotDePasse}>
                            <IconWand /> Générer un mot de passe sécurisé
                        </button>
                        <p className="user-form__hint">
                            L'utilisateur devra définir son propre mot de passe lors de sa première connexion.
                        </p>
                    </div>

                    <div className="user-form__section">
                        <p className="user-form__section-title">Rôle</p>
                        <div className="user-form__roles">
                            {ROLES_GERES.map((role) => {
                                const Icone = ICONES_ROLE[role] ?? IconUser;
                                const actif = dto.role === role;
                                return (
                                    <button
                                        type="button"
                                        key={role}
                                        className={`user-role-card${actif ? " user-role-card--active" : ""}`}
                                        onClick={() => setDto({ ...dto, role })}
                                    >
                                        <span className="user-role-card__icon">
                                            <Icone />
                                        </span>
                                        <span className="user-role-card__label">{LABELS_ROLES[role] ?? role}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {erreur && <div className="admin-alert">{erreur}</div>}

                    <div className="user-modal__actions">
                        <button type="button" className="admin-btn admin-btn--ghost" onClick={onFermer}>
                            Annuler
                        </button>
                        <button type="submit" className="admin-btn admin-btn--primary" disabled={envoi}>
                            {envoi ? "Création…" : "Créer l'utilisateur"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}