import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { obtenirStatistiquesUtilisateurs, obtenirStatistiquesVues } from "../../api/adminUserService";
import type { UtilisateursStatistiques, VuesSiteParPeriode } from "../../api/adminUserService";
import { listerEntreprises } from "../../api/entrepriseAdminService";
import { listerToutesOffresAdmin, LABELS_STATUT_OFFRE } from "../../api/offreService";
import type { SpringPage, OffreDTO, StatutOffre } from "../../api/offreService";
import "./AdminDashboardPage.css";
import { OffresPublicationsChart } from "../admin/OffresPublicationsChart";
import { InscriptionsUtilisateursChart } from "../admin/InscriptionsUtilisateursChart";
import { ConnexionsUtilisateursCard } from "../admin/ConnexionsUtilisateursCard";

interface EtatDashboard {
    utilisateurs: UtilisateursStatistiques | null;
    totalEntreprises: number | null;
    offres: SpringPage<OffreDTO> | null;
    vues: VuesSiteParPeriode | null;
}

type GranulariteVues = "jour" | "mois" | "annee";

const ORDRE_STATUTS: StatutOffre[] = ["PUBLIEE", "BROUILLON", "FERMEE", "EXPIREE"];

const OPTIONS_PERIODE: { valeur: GranulariteVues; label: string }[] = [
    { valeur: "jour", label: "Par jour" },
    { valeur: "mois", label: "Par mois" },
    { valeur: "annee", label: "Par année" },
];

const LABELS_GRANULARITE: Record<GranulariteVues, string> = {
    jour: "Aujourd'hui",
    mois: "Ce mois-ci",
    annee: "Cette année",
};

function cleAujourdHui(granularite: GranulariteVues): string {
    const maintenant = new Date();
    const annee = maintenant.getFullYear();
    const mois = String(maintenant.getMonth() + 1).padStart(2, "0");
    const jour = String(maintenant.getDate()).padStart(2, "0");
    if (granularite === "jour") return `${annee}-${mois}-${jour}`;
    if (granularite === "mois") return `${annee}-${mois}`;
    return `${annee}`;
}

export function AdminDashboardPage() {
    const { currentUser } = useAuth();
    const [etat, setEtat] = useState<EtatDashboard>({
        utilisateurs: null,
        totalEntreprises: null,
        offres: null,
        vues: null,
    });
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);
    const [granulariteVues, setGranulariteVues] = useState<GranulariteVues>("jour");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage, pattern standard
        (async () => {
            setChargement(true);
            setErreur(null);
            try {
                const [utilisateurs, entreprises, offres, vues] = await Promise.all([
                    obtenirStatistiquesUtilisateurs(),
                    listerEntreprises(0, 1, ""),
                    listerToutesOffresAdmin(0, 500),
                    obtenirStatistiquesVues(),
                ]);
                setEtat({
                    utilisateurs,
                    totalEntreprises: entreprises.total,
                    offres,
                    vues,
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

    const valeurVuesPeriode = etat.vues
        ? (granulariteVues === "jour"
        ? etat.vues.parJour[cleAujourdHui("jour")]
        : granulariteVues === "mois"
            ? etat.vues.parMois[cleAujourdHui("mois")]
            : etat.vues.parAnnee[cleAujourdHui("annee")]) ?? 0
        : undefined;

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
                <KpiCard
                    label="Vues du site"
                    valeur={valeurVuesPeriode}
                    chargement={chargement}
                    accent="gold"
                    detail={etat.vues ? `${etat.vues.total.toLocaleString()} au total` : undefined}
                    periodeSelecteur={{
                        valeur: granulariteVues,
                        onChange: setGranulariteVues,
                        labelActuel: LABELS_GRANULARITE[granulariteVues],
                    }}
                />
            </section>
            <br/>
            <br/>
            <br/>

            {/* ---------- Inscriptions utilisateurs dans le temps (jour / mois / année) ---------- */}
            <InscriptionsUtilisateursChart />
            <br/>
            <br/>
            <br/>

            {/* ---------- Connexions utilisateurs dans le temps (jour / mois / année) ---------- */}
            <ConnexionsUtilisateursCard />
            <br/>
            <br/>
            <br/>

            {/* ---------- Offres publiées dans le temps (jour / mois / année) ---------- */}
            <OffresPublicationsChart />

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

interface PeriodeSelecteur {
    valeur: GranulariteVues;
    onChange: (v: GranulariteVues) => void;
    labelActuel: string;
}

function IconCalendarSmall() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
            <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function KpiCard({
                     label,
                     valeur,
                     detail,
                     suffixe,
                     chargement,
                     accent,
                     periodeSelecteur,
                 }: {
    label: string;
    valeur?: number;
    detail?: string;
    suffixe?: string;
    chargement: boolean;
    accent: "navy" | "gold" | "success";
    periodeSelecteur?: PeriodeSelecteur;
}) {
    const [ouvert, setOuvert] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ouvert) return;
        function handleClickDehors(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOuvert(false);
        }
        document.addEventListener("mousedown", handleClickDehors);
        return () => document.removeEventListener("mousedown", handleClickDehors);
    }, [ouvert]);

    return (
        <div className={`dashboard-kpi dashboard-kpi--${accent}`}>
            <div className="dashboard-kpi__head">
                <p className="dashboard-kpi__label">{label}</p>

                {periodeSelecteur && (
                    <div className="dashboard-kpi__periode" ref={ref}>
                        <button
                            type="button"
                            className="dashboard-kpi__periode-btn"
                            onClick={() => setOuvert((v) => !v)}
                            aria-label="Changer la période"
                            aria-expanded={ouvert}
                        >
                            <IconCalendarSmall />
                        </button>
                        {ouvert && (
                            <div className="dashboard-kpi__periode-menu">
                                {OPTIONS_PERIODE.map((o) => (
                                    <button
                                        key={o.valeur}
                                        type="button"
                                        className={`dashboard-kpi__periode-item${o.valeur === periodeSelecteur.valeur ? " active" : ""}`}
                                        onClick={() => {
                                            periodeSelecteur.onChange(o.valeur);
                                            setOuvert(false);
                                        }}
                                    >
                                        {o.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

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
            {periodeSelecteur && !chargement && (
                <p className="dashboard-kpi__detail">
                    {periodeSelecteur.labelActuel}
                    {detail ? ` · ${detail}` : ""}
                </p>
            )}
            {!periodeSelecteur && detail && !chargement && <p className="dashboard-kpi__detail">{detail}</p>}
        </div>
    );
}