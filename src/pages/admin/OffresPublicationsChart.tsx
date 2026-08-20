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
import {
    obtenirStatistiquesPublicationsParJour,
    obtenirStatistiquesPublicationsParMois,
    obtenirStatistiquesPublicationsParAnnee,
} from "../../api/offreService";
import type { StatistiquePublicationDTO } from "../../api/offreService";
import "./OffresPublicationsChart.css";

type Granularite = "jour" | "mois" | "annee";

const LABELS_GRANULARITE: Record<Granularite, string> = {
    jour: "Par jour",
    mois: "Par mois",
    annee: "Par année",
};

/** Formate la période brute ("2026-08-20", "2026-08", "2026") en libellé FR lisible pour l'axe X. */
function formaterPeriode(periode: string, granularite: Granularite): string {
    if (granularite === "annee") return periode;

    if (granularite === "mois") {
        const [annee, mois] = periode.split("-");
        const date = new Date(Number(annee), Number(mois) - 1, 1);
        return date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
    }

    // jour
    const date = new Date(periode);
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

/**
 * Pour la vue "jour", on ne garde que les 30 derniers jours afin de garder
 * un graphique lisible (l'API renvoie tout l'historique).
 */
function limiterDonnees(donnees: StatistiquePublicationDTO[], granularite: Granularite): StatistiquePublicationDTO[] {
    if (granularite === "jour") return donnees.slice(-30);
    if (granularite === "mois") return donnees.slice(-12);
    return donnees;
}

export function OffresPublicationsChart() {
    const [granularite, setGranularite] = useState<Granularite>("jour");
    const [donnees, setDonnees] = useState<Record<Granularite, StatistiquePublicationDTO[] | null>>({
        jour: null,
        mois: null,
        annee: null,
    });
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage
        (async () => {
            setChargement(true);
            setErreur(null);
            try {
                const [jour, mois, annee] = await Promise.all([
                    obtenirStatistiquesPublicationsParJour(),
                    obtenirStatistiquesPublicationsParMois(),
                    obtenirStatistiquesPublicationsParAnnee(),
                ]);
                setDonnees({ jour, mois, annee });
            } catch {
                setErreur("Impossible de charger les statistiques de publication.");
            } finally {
                setChargement(false);
            }
        })();
    }, []);

    const donneesGraphique = useMemo(() => {
        const brut = donnees[granularite] ?? [];
        return limiterDonnees(brut, granularite).map((d) => ({
            periode: formaterPeriode(d.periode, granularite),
            total: d.total,
        }));
    }, [donnees, granularite]);

    const totalPeriode = donneesGraphique.reduce((somme, d) => somme + d.total, 0);

    return (
        <section className="publications-chart">
            <div className="publications-chart__header">
                <div>
                    <h2 className="publications-chart__title">Offres publiées</h2>
                    <p className="publications-chart__subtitle">
                        {chargement ? "Chargement…" : `${totalPeriode} offre(s) sur la période affichée`}
                    </p>
                </div>

                <div className="publications-chart__tabs">
                    {(Object.keys(LABELS_GRANULARITE) as Granularite[]).map((g) => (
                        <button
                            key={g}
                            type="button"
                            className={`publications-chart__tab ${granularite === g ? "publications-chart__tab--actif" : ""}`}
                            onClick={() => setGranularite(g)}
                        >
                            {LABELS_GRANULARITE[g]}
                        </button>
                    ))}
                </div>
            </div>

            {erreur && <div className="publications-chart__erreur">{erreur}</div>}

            {!erreur && (
                <div className="publications-chart__canvas">
                    {chargement ? (
                        <div className="publications-chart__skeleton" />
                    ) : donneesGraphique.length === 0 ? (
                        <p className="publications-chart__vide">Aucune offre publiée pour l'instant.</p>
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
                                    formatter={(value: number) => [`${value} offre(s)`, "Publiées"]}
                                />
                                <Bar dataKey="total" fill="#0b3d2e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            )}
        </section>
    );
}