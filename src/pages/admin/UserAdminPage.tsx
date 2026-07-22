import { useCallback, useEffect, useState } from "react";
import {
    changerRole as apiChangerRole,
    creerUtilisateur,
    definirActivation,
    listerUtilisateurs,
    ROLES_GERES,
    LABELS_ROLES,
} from "../../api/adminUserService";
import type { AdminUtilisateur, CreerUtilisateurAdmin } from "../../api/adminUserService";
import { CreerUtilisateurModal } from "./CreerUtilisateurModal";
import "./UserAdminPage.css";

const PAGE_SIZE = 20;

function initiales(prenom: string, nom: string): string {
    return `${prenom[0] ?? ""}${nom[0] ?? ""}`.toUpperCase() || "?";
}

function IconSearch() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

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
        } catch {
            setErreur("Impossible de charger les utilisateurs. Réessaie dans un instant.");
        } finally {
            setChargement(false);
        }
    }, [page, recherche]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage, pattern standard
        charger();
    }, [charger]);

    async function handleChangerRole(id: string, role: string) {
        const precedent = utilisateurs;
        setUtilisateurs((liste) => liste.map((u) => (u.id === id ? { ...u, roles: [role] } : u)));
        try {
            await apiChangerRole(id, { role });
        } catch {
            setUtilisateurs(precedent);
            setErreur("Le changement de rôle a échoué.");
        }
    }

    async function handleToggleActivation(utilisateur: AdminUtilisateur) {
        const nouveauStatut = !utilisateur.enabled;
        setUtilisateurs((liste) => liste.map((u) => (u.id === utilisateur.id ? { ...u, enabled: nouveauStatut } : u)));
        try {
            await definirActivation(utilisateur.id, { actif: nouveauStatut });
        } catch {
            setUtilisateurs((liste) => liste.map((u) => (u.id === utilisateur.id ? { ...u, enabled: !nouveauStatut } : u)));
            setErreur("Le changement de statut a échoué.");
        }
    }

    async function handleCreer(dto: CreerUtilisateurAdmin) {
        await creerUtilisateur(dto);
        setModalOuvert(false);
        await charger();
    }

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const actifs = utilisateurs.filter((u) => u.enabled).length;

    return (
        <div className="admin-page">
            <div className="admin-page__container">
                <div className="admin-page__head">
                    <div>
                        <h1 className="admin-page__title">Utilisateurs</h1>
                        <p className="admin-page__subtitle">Gère les comptes, les rôles et l'accès à la plateforme.</p>
                    </div>
                    <button className="admin-btn admin-btn--primary" onClick={() => setModalOuvert(true)}>
                        + Ajouter un utilisateur
                    </button>
                </div>

                <div className="admin-stats-row">
                    <div className="admin-stat-pill">
                        <span className="admin-stat-pill__value">{total}</span>
                        <span className="admin-stat-pill__label">Utilisateur(s) au total</span>
                    </div>
                    <div className="admin-stat-pill admin-stat-pill--success">
                        <span className="admin-stat-pill__value">{actifs}</span>
                        <span className="admin-stat-pill__label">Actifs sur cette page</span>
                    </div>
                    <div className="admin-stat-pill admin-stat-pill--danger">
                        <span className="admin-stat-pill__value">{utilisateurs.length - actifs}</span>
                        <span className="admin-stat-pill__label">Bloqués sur cette page</span>
                    </div>
                </div>

                <div className="admin-toolbar">
                    <div className="admin-search">
                        <IconSearch />
                        <input
                            type="search"
                            className="admin-search__input"
                            placeholder="Rechercher par nom ou email…"
                            value={recherche}
                            onChange={(e) => {
                                setPage(0);
                                setRecherche(e.target.value);
                            }}
                        />
                    </div>
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
                                            <div className="admin-table__avatar">{initiales(u.firstName, u.lastName)}</div>
                                            <div>
                                                <div className="admin-table__name">
                                                    {u.firstName} {u.lastName}
                                                </div>
                                                <div className="admin-table__username">@{u.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{u.email}</td>
                                    <td>
                                        <select
                                            className="admin-select"
                                            value={u.roles.find((r) => r.startsWith("ROLE_")) ?? ""}
                                            onChange={(e) => handleChangerRole(u.id, e.target.value)}
                                        >
                                            {ROLES_GERES.map((role) => (
                                                <option key={role} value={role}>
                                                    {LABELS_ROLES[role] ?? role.replace("ROLE_", "")}
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
                    <button className="admin-btn admin-btn--ghost" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                        Précédent
                    </button>
                    <span className="admin-pagination__label">
                        Page {page + 1} / {totalPages}
                    </span>
                    <button className="admin-btn admin-btn--ghost" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
                        Suivant
                    </button>
                </div>
            </div>

            {modalOuvert && <CreerUtilisateurModal onFermer={() => setModalOuvert(false)} onCreer={handleCreer} />}
        </div>
    );
}