import { useEffect, useState } from "react";
import { obtenirStatistiquesConnexions } from "../../api/adminUserService";
import type { ConnexionsParPeriode } from "../../api/adminUserService";
import "./ConnexionsUtilisateursCard.css";

type Granularite = "jour" | "mois" | "annee";

const OPTIONS: { valeur: Granularite; label: string }[] = [
    { valeur: "jour", label: "Par jour" },
    { valeur: "mois", label: "Par mois" },
    { valeur: "annee", label: "Par année" },
];

function cleAujourdHui(granularite: Granularite): string {
    const maintenant = new Date();
    const annee = maintenant.getFullYear();
    const mois = String(maintenant.getMonth() + 1).padStart(2, "0");
    const jour = String(maintenant.getDate()).padStart(2, "0");
    if (granularite === "jour") return `${annee}-${mois}-${jour}`;
    if (granularite === "mois") return `${annee}-${mois}`;
    return `${annee}`;
}

function formaterLabel(cle: string, granularite: Granularite): string {
    if (granularite === "jour") {
        return new Date(cle).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    }
    if (granularite === "mois") {
        const [an, m] = cle.split("-");
        return new Date(Number(an), Number(m) - 1, 1).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
    }
    return cle;
}

export function ConnexionsUtilisateursCard() {
    const [donnees, setDonnees] = useState<ConnexionsParPeriode | null>(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);
    const [granularite, setGranularite] = useState<Granularite>("jour");

    useEffect(() => {
        obtenirStatistiquesConnexions()
            .then(setDonnees)
            .catch(() => setErreur("Impossible de charger les statistiques de connexion."))
            .finally(() => setChargement(false));
    }, []);

    const serie = donnees
        ? granularite === "jour"
            ? donnees.parJour
            : granularite === "mois"
                ? donnees.parMois
                : donnees.parAnnee
        : {};

    const entrees = Object.entries(serie).sort(([a], [b]) => a.localeCompare(b));
    const dernieres = entrees.slice(-12);
    const valeurCourante = donnees ? (serie[cleAujourdHui(granularite)] ?? 0) : undefined;
    const maxValeur = Math.max(1, ...dernieres.map(([, v]) => v));

    return (
        <section className="connexions-card">
            <div className="connexions-card__head">
                <div>
                    <h2 className="connexions-card__title">Connexions des utilisateurs</h2>
                    <p className="connexions-card__subtitle">Utilisateurs distincts connectés, par période</p>
                </div>
                <select
                    className="connexions-card__select"
                    value={granularite}
                    onChange={(e) => setGranularite(e.target.value as Granularite)}
                >
                    {OPTIONS.map((o) => (
                        <option key={o.valeur} value={o.valeur}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>

            {erreur && <div className="connexions-card__erreur">{erreur}</div>}

            <div className="connexions-card__kpi">
                <span className="connexions-card__kpi-label">
                    {granularite === "jour" ? "Aujourd'hui" : granularite === "mois" ? "Ce mois-ci" : "Cette année"}
                </span>
                <span className="connexions-card__kpi-value">
                    {chargement || valeurCourante === undefined ? (
                        <span className="connexions-card__skeleton" />
                    ) : (
                        valeurCourante.toLocaleString()
                    )}
                </span>
                <span className="connexions-card__kpi-suffixe">utilisateur{valeurCourante !== 1 ? "s" : ""}</span>
            </div>

            {!chargement && dernieres.length > 0 && (
                <div className="connexions-card__bars">
                    {dernieres.map(([cle, valeur]) => (
                        <div className="connexions-card__bar" key={cle} title={`${formaterLabel(cle, granularite)} : ${valeur}`}>
                            <div className="connexions-card__bar-fill" style={{ height: `${(valeur / maxValeur) * 100}%` }} />
                            <span className="connexions-card__bar-label">{formaterLabel(cle, granularite)}</span>
                        </div>
                    ))}
                </div>
            )}

            {!chargement && dernieres.length === 0 && (
                <p className="connexions-card__vide">Aucune connexion enregistrée pour le moment.</p>
            )}
        </section>
    );
}