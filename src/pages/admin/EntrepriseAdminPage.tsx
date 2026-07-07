import { useCallback, useEffect, useState } from "react";
import {
    listerEntreprises,
    supprimerEntreprise,
} from "../../api/entrepriseAdminService";
import type { ProfilRecruteur } from "../../api/entrepriseAdminService";
import "./UserAdminPage.css";
import "./EntrepriseAdminPage.css";

const PAGE_SIZE = 20;

export function EntrepriseAdminPage() {
    const [entreprises, setEntreprises] = useState<ProfilRecruteur[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [recherche, setRecherche] = useState("");
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);
    const [suppressionEnCours, setSuppressionEnCours] = useState<number | null>(null);

    const charger = useCallback(async () => {
        setChargement(true);
        setErreur(null);
        try {
            const resultat = await listerEntreprises(page, PAGE_SIZE, recherche);
            setEntreprises(resultat.entreprises);
            setTotal(resultat.total);
        } catch {
            setErreur("Impossible de charger les entreprises. Réessaie dans un instant.");
        } finally {
            setChargement(false);
        }
    }, [page, recherche]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage, pattern standard
        charger();
    }, [charger]);

    async function handleSupprimer(entreprise: ProfilRecruteur) {
        const confirme = window.confirm(
            `Supprimer définitivement le profil entreprise "${entreprise.nomEntreprise}" ? Le compte recruteur associé ne sera pas supprimé.`
        );
        if (!confirme) return;

        setSuppressionEnCours(entreprise.id);
        try {
            await supprimerEntreprise(entreprise.id);
            setEntreprises((liste) => liste.filter((e) => e.id !== entreprise.id));
            setTotal((t) => t - 1);
        } catch {
            setErreur("La suppression a échoué.");
        } finally {
            setSuppressionEnCours(null);
        }
    }

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <div className="admin-page">
            <div className="admin-page__container">
                <div className="admin-page__head">
                    <div>
                        <h1 className="admin-page__title">Entreprises</h1>
                        <p className="admin-page__subtitle">
                            Profils entreprise créés par les recruteurs de la plateforme.
                        </p>
                    </div>
                </div>

                <div className="admin-toolbar">
                    <input
                        type="search"
                        className="admin-input"
                        placeholder="Rechercher par nom d'entreprise…"
                        value={recherche}
                        onChange={(e) => {
                            setPage(0);
                            setRecherche(e.target.value);
                        }}
                    />
                    <span className="admin-toolbar__count">{total} entreprise(s)</span>
                </div>

                {erreur && <div className="admin-alert">{erreur}</div>}

                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Entreprise</th>
                            <th>Secteur</th>
                            <th>Contact</th>
                            <th>Localisation</th>
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
                        ) : entreprises.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="admin-table__empty">
                                    Aucune entreprise trouvée.
                                </td>
                            </tr>
                        ) : (
                            entreprises.map((e) => (
                                <tr key={e.id}>
                                    <td>
                                        <div className="admin-table__user">
                                            <div className="admin-table__avatar">
                                                {e.nomEntreprise?.slice(0, 2).toUpperCase() || "?"}
                                            </div>
                                            <div>
                                                <div className="admin-table__name">{e.nomEntreprise}</div>
                                                {e.tailleEntreprise && (
                                                    <div className="admin-table__username">{e.tailleEntreprise}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{e.secteurActivite || "—"}</td>
                                    <td>
                                        {e.nomContact ? (
                                            <div>
                                                <div>{e.nomContact}</div>
                                                <div className="admin-table__username">
                                                    {e.emailProfessionnel || e.telephoneEntreprise || ""}
                                                </div>
                                            </div>
                                        ) : (
                                            e.telephoneEntreprise || "—"
                                        )}
                                    </td>
                                    <td>{[e.ville, e.pays].filter(Boolean).join(", ") || "—"}</td>
                                    <td>
                                        <button
                                            className="admin-btn admin-btn--danger"
                                            disabled={suppressionEnCours === e.id}
                                            onClick={() => handleSupprimer(e)}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
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
        </div>
    );
}