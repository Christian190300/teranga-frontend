import { useCallback, useEffect, useState } from "react";
import {
    changerRole as apiChangerRole,
    creerUtilisateur,
    definirActivation,
    listerUtilisateurs,
    ROLES_GERES,
} from "../../api/adminUserService";
import type { AdminUtilisateur, CreerUtilisateurAdmin } from "../../api/adminUserService";
import { IconUsers } from "../../components/home/icons";
import "./UserAdminPage.css";

const PAGE_SIZE = 20;

export function UserAdminPage() {
    const [utilisateurs, setUtilisateurs] = useState<AdminUtilisateur[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [recherche, setRecherche] = useState("");
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);
    const [modalOuvert, setModalOuvert] = useState(false);

    const charger = useCallback(async () => {
        setChargement(true);
        setErreur(null);
        try {
            const resultat = await listerUtilisateurs(page, PAGE_SIZE, recherche);
            setUtilisateurs(resultat.utilisateurs);
            setTotal(resultat.total);
        } catch (e) {
            setErreur("Impossible de charger les utilisateurs. Réessaie dans un instant.");
        } finally {
            setChargement(false);
        }
    }, [page, recherche]);

    useEffect(() => {
        charger();
    }, [charger]);

    async function handleChangerRole(id: string, role: string) {
        const precedent = utilisateurs;
        setUtilisateurs((liste) => liste.map((u) => (u.id === id ? { ...u, roles: [role] } : u)));
        try {
            await apiChangerRole(id, { role });
        } catch (e) {
            setUtilisateurs(precedent);
            setErreur("Le changement de rôle a échoué.");
        }
    }

    async function handleToggleActivation(utilisateur: AdminUtilisateur) {
        const nouveauStatut = !utilisateur.enabled;
        setUtilisateurs((liste) =>
            liste.map((u) => (u.id === utilisateur.id ? { ...u, enabled: nouveauStatut } : u))
        );
        try {
            await definirActivation(utilisateur.id, { actif: nouveauStatut });
        } catch (e) {
            setUtilisateurs((liste) =>
                liste.map((u) => (u.id === utilisateur.id ? { ...u, enabled: !nouveauStatut } : u))
            );
            setErreur("Le changement de statut a échoué.");
        }
    }

    async function handleCreer(dto: CreerUtilisateurAdmin) {
        await creerUtilisateur(dto);
        setModalOuvert(false);
        await charger();
    }

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <div className="admin-page">
            <div className="admin-page__container">
                <div className="admin-page__head">
                    <div>
                        <h1 className="admin-page__title">Utilisateurs</h1>
                        <p className="admin-page__subtitle">
                            Gère les comptes, les rôles et l'accès à la plateforme.
                        </p>
                    </div>
                    <button className="admin-btn admin-btn--primary" onClick={() => setModalOuvert(true)}>
                        + Ajouter un utilisateur
                    </button>
                </div>

                <div className="admin-toolbar">
                    <input
                        type="search"
                        className="admin-input"
                        placeholder="Rechercher par nom ou email…"
                        value={recherche}
                        onChange={(e) => {
                            setPage(0);
                            setRecherche(e.target.value);
                        }}
                    />
                    <span className="admin-toolbar__count">{total} utilisateur(s)</span>
                </div>

                {erreur && <div className="admin-alert">{erreur}</div>}

                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Utilisateur</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Statut</th>
                            <th aria-label="Actions" />
                        </tr>
                        </thead>
                        <tbody>
                        {chargement ? (
                            <tr>
                                <td colSpan={5} className="admin-table__empty">
                                    Chargement…
                                </td>
                            </tr>
                        ) : utilisateurs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="admin-table__empty">
                                    Aucun utilisateur trouvé.
                                </td>
                            </tr>
                        ) : (
                            utilisateurs.map((u) => (
                                <tr key={u.id}>
                                    <td>
                                        <div className="admin-table__user">
                                            <div className="admin-table__avatar">
                                                <IconUsers />
                                            </div>
                                            <div>
                                                <div className="admin-table__name">
                                                    {u.firstName} {u.lastName}
                                                </div>
                                                <div className="admin-table__username">
                                                    @{u.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{u.email}</td>
                                    <td>
                                        <select
                                            className="admin-select"
                                            value={u.roles?.[0] ?? ""}
                                            onChange={(e) => handleChangerRole(u.id, e.target.value)}
                                        >
                                            {ROLES_GERES.map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            className={`admin-status ${u.enabled ? "is-active" : "is-inactive"}`}
                                            onClick={() => handleToggleActivation(u)}
                                        >
                                            <span className="admin-status__dot" />
                                            {u.enabled ? "Actif" : "Bloqué"}
                                        </button>
                                    </td>
                                    <td />
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="admin-pagination">
                    <button
                        className="admin-btn admin-btn--ghost"
                        disabled={page === 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                    >
                        Précédent
                    </button>
                    <span className="admin-pagination__label">
                        Page {page + 1} / {totalPages}
                    </span>
                    <button
                        className="admin-btn admin-btn--ghost"
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Suivant
                    </button>
                </div>
            </div>

            {modalOuvert && (
                <CreerUtilisateurModal onFermer={() => setModalOuvert(false)} onCreer={handleCreer} />
            )}
        </div>
    );
}

function CreerUtilisateurModal({
                                   onFermer,
                                   onCreer,
                               }: {
    onFermer: () => void;
    onCreer: (dto: CreerUtilisateurAdmin) => Promise<void>;
}) {
    const [dto, setDto] = useState<CreerUtilisateurAdmin>({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        role: ROLES_GERES[0],
    });
    const [envoi, setEnvoi] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setEnvoi(true);
        setErreur(null);
        try {
            await onCreer(dto);
        } catch (err) {
            setErreur("La création a échoué. Vérifie les champs et réessaie.");
        } finally {
            setEnvoi(false);
        }
    }

    return (
        <div className="admin-modal__backdrop" onClick={onFermer}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="admin-modal__title">Ajouter un utilisateur</h2>

                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="admin-form__row">
                        <label className="admin-form__field">
                            <span>Prénom</span>
                            <input
                                required
                                maxLength={50}
                                value={dto.firstName}
                                onChange={(e) => setDto({ ...dto, firstName: e.target.value })}
                            />
                        </label>
                        <label className="admin-form__field">
                            <span>Nom</span>
                            <input
                                required
                                maxLength={50}
                                value={dto.lastName}
                                onChange={(e) => setDto({ ...dto, lastName: e.target.value })}
                            />
                        </label>
                    </div>

                    <label className="admin-form__field">
                        <span>Email</span>
                        <input
                            required
                            type="email"
                            value={dto.email}
                            onChange={(e) => setDto({ ...dto, email: e.target.value })}
                        />
                    </label>

                    <label className="admin-form__field">
                        <span>Mot de passe</span>
                        <input
                            required
                            type="password"
                            minLength={8}
                            maxLength={100}
                            value={dto.password}
                            onChange={(e) => setDto({ ...dto, password: e.target.value })}
                        />
                    </label>

                    <label className="admin-form__field">
                        <span>Rôle</span>
                        <select value={dto.role} onChange={(e) => setDto({ ...dto, role: e.target.value })}>
                            {ROLES_GERES.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </label>

                    {erreur && <div className="admin-alert">{erreur}</div>}

                    <div className="admin-modal__actions">
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