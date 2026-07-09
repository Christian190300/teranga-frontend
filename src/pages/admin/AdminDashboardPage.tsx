import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { obtenirStatistiquesUtilisateurs } from "../../api/adminUserService";
import type { UtilisateursStatistiques } from "../../api/adminUserService";
import { listerEntreprises } from "../../api/entrepriseAdminService";
import { listerToutesOffresAdmin, LABELS_STATUT_OFFRE } from "../../api/offreService";
import type { SpringPage, OffreDTO, StatutOffre } from "../../api/offreService";
import "./AdminDashboardPage.css";

interface EtatDashboard {
    utilisateurs: UtilisateursStatistiques | null;
    totalEntreprises: number | null;
    offres: SpringPage<OffreDTO> | null;
}

const ORDRE_STATUTS: StatutOffre[] = ["PUBLIEE", "BROUILLON", "FERMEE", "EXPIREE"];

export function AdminDashboardPage() {
    const { currentUser } = useAuth();
    const [etat, setEtat] = useState<EtatDashboard>({ utilisateurs: null, totalEntreprises: null, offres: null });
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage, pattern standard
        (async () => {
            setChargement(true);
            setErreur(null);
            try {
                const [utilisateurs, entreprises, offres] = await Promise.all([
                    obtenirStatistiquesUtilisateurs(),
                    listerEntreprises(0, 1, ""),
                    listerToutesOffresAdmin(0, 500),
                ]);
                setEtat({
                    utilisateurs,
                    totalEntreprises: entreprises.total,
                    offres,
                });
            } catch {
                setErreur("Impossible de charger les statistiques du tableau de bord.");
            } finally {
                setChargement(false);
            }
        })();
    }, []);

    const repartitionOffres = ORDRE_STATUTS.map((statut) => ({
        statut,
        total: etat.offres?.content.filter((o) => o.statut === statut).length ?? 0,
    }));

    const totalOffres = etat.offres?.totalElements ?? 0;
    const maxRepartition = Math.max(1, ...repartitionOffres.map((r) => r.total));

    const heure = new Date().getHours();
    const salutation = heure < 12 ? "Bonjour" : heure < 18 ? "Bon après-midi" : "Bonsoir";

    return (
        <div className="dashboard-page">
            {/* ---------- Bandeau d'accueil ---------- */}
            <section className="dashboard-hero">
                <div className="dashboard-hero__pattern" aria-hidden="true" />
                <div className="dashboard-hero__content">
                    <p className="dashboard-hero__eyebrow">Tableau de bord</p>
                    <h1 className="dashboard-hero__title">
                        {salutation}
                        {currentUser?.firstName ? `, ${currentUser.firstName}` : ""}.
                    </h1>
                    <p className="dashboard-hero__subtitle">
                        Voici un aperçu de l'activité sur Talent Sénégal aujourd'hui.
                    </p>
                </div>
            </section>

            {erreur && <div className="dashboard-alert">{erreur}</div>}

            {/* ---------- Indicateurs clés ---------- */}
            <section className="dashboard-kpis">
                <KpiCard
                    label="Utilisateurs inscrits"
                    valeur={etat.utilisateurs?.total}
                    chargement={chargement}
                    accent="navy"
                    detail={
                        etat.utilisateurs ? `${etat.utilisateurs.actifs} actifs · ${etat.utilisateurs.inactifs} bloqués` : undefined
                    }
                />
                <KpiCard
                    label="Entreprises"
                    valeur={etat.totalEntreprises ?? undefined}
                    chargement={chargement}
                    accent="gold"
                />
                <KpiCard
                    label="Offres publiées"
                    valeur={repartitionOffres.find((r) => r.statut === "PUBLIEE")?.total}
                    chargement={chargement}
                    accent="success"
                    detail={`${totalOffres} offre(s) au total`}
                />
                <KpiCard
                    label="Taux d'activation"
                    valeur={
                        etat.utilisateurs && etat.utilisateurs.total > 0
                            ? Math.round((etat.utilisateurs.actifs / etat.utilisateurs.total) * 100)
                            : undefined
                    }
                    suffixe="%"
                    chargement={chargement}
                    accent="navy"
                />
            </section>

            <div className="dashboard-grid">
                {/* ---------- Répartition des offres ---------- */}
                <section className="dashboard-panel">
                    <h2 className="dashboard-panel__title">Répartition des offres</h2>
                    <p className="dashboard-panel__subtitle">Par statut, tous recruteurs confondus</p>

                    <div className="dashboard-bars">
                        {repartitionOffres.map((r) => (
                            <div className="dashboard-bar" key={r.statut}>
                                <div className="dashboard-bar__head">
                                    <span className={`dashboard-bar__dot dashboard-bar__dot--${r.statut.toLowerCase()}`} />
                                    <span className="dashboard-bar__label">{LABELS_STATUT_OFFRE[r.statut]}</span>
                                    <span className="dashboard-bar__value">{r.total}</span>
                                </div>
                                <div className="dashboard-bar__track">
                                    <div
                                        className={`dashboard-bar__fill dashboard-bar__fill--${r.statut.toLowerCase()}`}
                                        style={{ width: `${(r.total / maxRepartition) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ---------- Actions rapides ---------- */}
                <section className="dashboard-panel">
                    <h2 className="dashboard-panel__title">Actions rapides</h2>
                    <p className="dashboard-panel__subtitle">Accès direct aux espaces de gestion</p>

                    <div className="dashboard-actions">
                        <Link to="/admin/utilisateurs" className="dashboard-action">
                            <span className="dashboard-action__label">Gérer les utilisateurs</span>
                            <span className="dashboard-action__arrow">→</span>
                        </Link>
                        <Link to="/admin/entreprises" className="dashboard-action">
                            <span className="dashboard-action__label">Gérer les entreprises</span>
                            <span className="dashboard-action__arrow">→</span>
                        </Link>
                        <Link to="/admin/offres" className="dashboard-action">
                            <span className="dashboard-action__label">Modérer les offres</span>
                            <span className="dashboard-action__arrow">→</span>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

function KpiCard({
                     label,
                     valeur,
                     detail,
                     suffixe,
                     chargement,
                     accent,
                 }: {
    label: string;
    valeur?: number;
    detail?: string;
    suffixe?: string;
    chargement: boolean;
    accent: "navy" | "gold" | "success";
}) {
    return (
        <div className={`dashboard-kpi dashboard-kpi--${accent}`}>
            <p className="dashboard-kpi__label">{label}</p>
            <p className="dashboard-kpi__value">
                {chargement || valeur === undefined ? (
                    <span className="dashboard-kpi__skeleton" />
                ) : (
                    <>
                        {valeur.toLocaleString()}
                        {suffixe}
                    </>
                )}
            </p>
            {detail && !chargement && <p className="dashboard-kpi__detail">{detail}</p>}
        </div>
    );
}