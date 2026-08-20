import { useEffect, useMemo, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { obtenirStatistiquesInscriptions } from "../../api/adminUserService";
import type { InscriptionsParPeriode, StatistiqueInscriptionDTO } from "../../api/adminUserService";
import "./InscriptionsUtilisateursChart.css";

type Granularite = "jour" | "mois" | "annee";

const LABELS_GRANULARITE: Record<Granularite, string> = {
    jour: "Par jour",
    mois: "Par mois",
    annee: "Par année",
};

const CLES_MAP: Record<Granularite, keyof InscriptionsParPeriode> = {
    jour: "parJour",
    mois: "parMois",
    annee: "parAnnee",
};

function mapVersTableau(map: Record<string, number>): StatistiquePublicationLike[] {
    return Object.entries(map)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([periode, total]) => ({ periode, total }));
}

type StatistiquePublicationLike = StatistiqueInscriptionDTO;

function formaterPeriode(periode: string, granularite: Granularite): string {
    if (granularite === "annee") return periode;

    if (granularite === "mois") {
        const [annee, mois] = periode.split("-");
        const date = new Date(Number(annee), Number(mois) - 1, 1);
        return date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
    }

    const date = new Date(periode);
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function limiterDonnees(donnees: StatistiqueInscriptionDTO[], granularite: Granularite): StatistiqueInscriptionDTO[] {
    if (granularite === "jour") return donnees.slice(-30);
    if (granularite === "mois") return donnees.slice(-12);
    return donnees;
}

export function InscriptionsUtilisateursChart() {
    const [granularite, setGranularite] = useState<Granularite>("jour");
    const [donnees, setDonnees] = useState<InscriptionsParPeriode | null>(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage, pattern standard
        (async () => {
            setChargement(true);
            setErreur(null);
            try {
                const resultat = await obtenirStatistiquesInscriptions();
                setDonnees(resultat);
            } catch {
                setErreur("Impossible de charger les statistiques d'inscription.");
            } finally {
                setChargement(false);
            }
        })();
    }, []);

    const donneesGraphique = useMemo(() => {
        if (!donnees) return [];
        const brut = mapVersTableau(donnees[CLES_MAP[granularite]]);
        return limiterDonnees(brut, granularite).map((d) => ({
            periode: formaterPeriode(d.periode, granularite),
            total: d.total,
        }));
    }, [donnees, granularite]);

    const totalPeriode = donneesGraphique.reduce((somme, d) => somme + d.total, 0);

    return (
        <section className="inscriptions-chart">
            <div className="inscriptions-chart__header">
                <div>
                    <h2 className="inscriptions-chart__title">Inscriptions utilisateurs</h2>
                    <p className="inscriptions-chart__subtitle">
                        {chargement ? "Chargement…" : `${totalPeriode} inscription(s) sur la période affichée`}
                    </p>
                </div>

                <div className="inscriptions-chart__tabs">
                    {(Object.keys(LABELS_GRANULARITE) as Granularite[]).map((g) => (
                        <button
                            key={g}
                            type="button"
                            className={`inscriptions-chart__tab ${granularite === g ? "inscriptions-chart__tab--actif" : ""}`}
                            onClick={() => setGranularite(g)}
                        >
                            {LABELS_GRANULARITE[g]}
                        </button>
                    ))}
                </div>
            </div>

            {erreur && <div className="inscriptions-chart__erreur">{erreur}</div>}

            {!erreur && (
                <div className="inscriptions-chart__canvas">
                    {chargement ? (
                        <div className="inscriptions-chart__skeleton" />
                    ) : donneesGraphique.length === 0 ? (
                        <p className="inscriptions-chart__vide">Aucune inscription pour l'instant.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={donneesGraphique} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                                <XAxis
                                    dataKey="periode"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                    interval={granularite === "jour" ? 2 : 0}
                                />
                                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={30} />
                                <Tooltip
                                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                                    formatter={(value) => [`${value ?? 0} inscription(s)`, "Inscrits"]}
                                />
                                <Bar dataKey="total" fill="#14294d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            )}
        </section>
    );
}