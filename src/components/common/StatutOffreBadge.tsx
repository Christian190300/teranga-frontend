import type { StatutOffre } from "../../api/offreService";

const LABELS: Record<StatutOffre, string> = {
    BROUILLON: "Brouillon",
    PUBLIEE: "Publiée",
    FERMEE: "Fermée",
    EXPIREE: "Expirée",
};

const CLASSES: Record<StatutOffre, string> = {
    BROUILLON: "statut-badge--brouillon",
    PUBLIEE: "statut-badge--publiee",
    FERMEE: "statut-badge--fermee",
    EXPIREE: "statut-badge--expiree",
};

export function StatutOffreBadge({ statut }: { statut: StatutOffre }) {
    return <span className={`statut-badge ${CLASSES[statut]}`}>{LABELS[statut]}</span>;
}