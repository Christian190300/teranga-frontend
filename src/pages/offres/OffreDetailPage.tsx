import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    obtenirOffre,
    LABELS_TYPE_CONTRAT,
    LABELS_NIVEAU_EXPERIENCE,
    LABELS_NIVEAU_ETUDE,
    type OffreDTO,
} from "../../api/offreService";
import { useAuth } from "../../context/AuthContext";
import "./offres.css";

function formatSalaire(offre: OffreDTO): string | null {
    if (!offre.salaireVisible || (!offre.salaireMin && !offre.salaireMax)) return null;
    const devise = offre.devise ?? "FCFA";
    if (offre.salaireMin && offre.salaireMax) return `${offre.salaireMin.toLocaleString()} - ${offre.salaireMax.toLocaleString()} ${devise}`;
    return `${(offre.salaireMin ?? offre.salaireMax)?.toLocaleString()} ${devise}`;
}

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function initiales(nom: string | null): string {
    if (!nom) return "?";
    return nom.slice(0, 2).toUpperCase();
}

export function OffreDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { currentUser } = useAuth();

    const [offre, setOffre] = useState<OffreDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [postulationEnvoyee, setPostulationEnvoyee] = useState(false);
    const [postulationEnCours, setPostulationEnCours] = useState(false);

    useEffect(() => {
        async function charger() {
            setLoading(true);
            try {
                const data = await obtenirOffre(Number(id));
                setOffre(data);
            } catch {
                setError("Cette offre est introuvable ou n'est plus disponible.");
            } finally {
                setLoading(false);
            }
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        charger();
    }, [id]);

    async function handlePostuler() {
        // TODO : brancher sur l'endpoint de candidature une fois le module Candidature prêt.
        setPostulationEnCours(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            setPostulationEnvoyee(true);
        } finally {
            setPostulationEnCours(false);
        }
    }

    if (loading) {
        return <div className="offre-detail__loading">Chargement de l'offre...</div>;
    }

    if (error || !offre) {
        return (
            <div className="offre-detail">
                <div className="offre-detail__error">{error ?? "Offre introuvable."}</div>
            </div>
        );
    }

    const lieu = [offre.ville, offre.region, offre.pays].filter(Boolean).join(", ");
    const salaire = formatSalaire(offre);
    const estCandidat = currentUser?.role === "CANDIDAT";

    return (
        <div className="offre-detail">
            <Link to="/offres" className="offre-detail__back">
                ← Retour aux offres
            </Link>

            <div className="offre-detail__header">
                <div className="offre-detail__top-row">
                    <div>
                        <div className="offre-detail__logo">{initiales(offre.nomEntreprise)}</div>
                        <p className="offre-detail__entreprise">{offre.nomEntreprise ?? "Entreprise"}</p>
                        <h1 className="offre-detail__titre">{offre.titre}</h1>
                        <p className="offre-detail__lieu">{lieu || "Lieu non précisé"}</p>
                    </div>
                </div>
                <div className="offre-detail__tags">
                    <span className="offre-detail__tag offre-detail__tag--gold">{LABELS_TYPE_CONTRAT[offre.typeContrat]}</span>
                    {offre.teletravail && <span className="offre-detail__tag">Télétravail</span>}
                    {offre.hybride && <span className="offre-detail__tag">Hybride</span>}
                    {offre.niveauExperience && <span className="offre-detail__tag">{LABELS_NIVEAU_EXPERIENCE[offre.niveauExperience]}</span>}
                </div>
            </div>

            {offre.description && (
                <div className="offre-detail__section">
                    <p className="offre-detail__section-title">Description du poste</p>
                    <p className="offre-detail__text">{offre.description}</p>
                </div>
            )}

            {offre.missions && offre.missions.length > 0 && (
                <div className="offre-detail__section">
                    <p className="offre-detail__section-title">Missions</p>
                    <ul className="offre-detail__list">
                        {offre.missions.map((m) => (
                            <li key={m}>{m}</li>
                        ))}
                    </ul>
                </div>
            )}

            {(offre.profilRecherche || offre.niveauEtude || offre.experienceMinimum) && (
                <div className="offre-detail__section">
                    <p className="offre-detail__section-title">Profil recherché</p>
                    {offre.profilRecherche && <p className="offre-detail__text" style={{ marginBottom: 16 }}>{offre.profilRecherche}</p>}
                    <div className="offre-detail__facts">
                        {offre.niveauEtude && (
                            <div>
                                <div className="offre-detail__fact-label">Niveau d'étude</div>
                                <div className="offre-detail__fact-value">{LABELS_NIVEAU_ETUDE[offre.niveauEtude]}</div>
                            </div>
                        )}
                        {offre.experienceMinimum !== null && offre.experienceMinimum !== undefined && (
                            <div>
                                <div className="offre-detail__fact-label">Expérience minimum</div>
                                <div className="offre-detail__fact-value">{offre.experienceMinimum} an(s)</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {((offre.competences && offre.competences.length > 0) ||
                (offre.langues && offre.langues.length > 0) ||
                (offre.certifications && offre.certifications.length > 0)) && (
                <div className="offre-detail__section">
                    <p className="offre-detail__section-title">Compétences & langues</p>
                    <div className="offre-detail__chips" style={{ marginBottom: 12 }}>
                        {offre.competences?.map((c) => (
                            <span className="offre-detail__chip" key={c}>
                                {c}
                            </span>
                        ))}
                    </div>
                    <div className="offre-detail__chips">
                        {offre.langues?.map((l) => (
                            <span className="offre-detail__chip" key={l}>
                                {l}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {offre.avantages && offre.avantages.length > 0 && (
                <div className="offre-detail__section">
                    <p className="offre-detail__section-title">Avantages</p>
                    <div className="offre-detail__chips">
                        {offre.avantages.map((a) => (
                            <span className="offre-detail__chip" key={a}>
                                {a}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="offre-detail__section">
                <p className="offre-detail__section-title">Informations complémentaires</p>
                <div className="offre-detail__facts">
                    <div>
                        <div className="offre-detail__fact-label">Nombre de postes</div>
                        <div className="offre-detail__fact-value">{offre.nombrePostes ?? 1}</div>
                    </div>
                    <div>
                        <div className="offre-detail__fact-label">Disponibilité souhaitée</div>
                        <div className="offre-detail__fact-value">{offre.disponibiliteSouhaitee || "Non précisée"}</div>
                    </div>
                    <div>
                        <div className="offre-detail__fact-label">Horaires</div>
                        <div className="offre-detail__fact-value">{offre.horaires || "Non précisés"}</div>
                    </div>
                    <div>
                        <div className="offre-detail__fact-label">Publiée le</div>
                        <div className="offre-detail__fact-value">{formatDate(offre.datePublication)}</div>
                    </div>
                </div>
            </div>

            {estCandidat && offre.statut === "PUBLIEE" && (
                <div className="offre-detail__cta">
                    <div>
                        <div className="offre-detail__fact-value" style={{ marginBottom: 2 }}>
                            {salaire ?? "Salaire non communiqué"}
                        </div>
                        <div className="offre-detail__cta-info">
                            {postulationEnvoyee ? "Candidature envoyée ✓" : "Postulez en un clic"}
                        </div>
                    </div>
                    <button
                        className="btn-gold"
                        onClick={handlePostuler}
                        disabled={postulationEnCours || postulationEnvoyee}
                    >
                        {postulationEnCours ? "Envoi..." : postulationEnvoyee ? "Candidature envoyée" : "Postuler"}
                    </button>
                </div>
            )}
        </div>
    );
}