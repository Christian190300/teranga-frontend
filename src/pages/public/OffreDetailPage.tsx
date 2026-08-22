import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    obtenirOffre,
    LABELS_TYPE_CONTRAT,
    enregistrerVueOffre,
    LABELS_NIVEAU_EXPERIENCE,
    LABELS_NIVEAU_ETUDE,
    type OffreDTO,
} from "../../api/offreService";
import { LogoEntreprise } from "../../components/common/LogoEntreprise";
import { CandidatureFormulaire } from "../candidat/CandidatureFormulaire";
import { aDejaPostule } from "../../api/candidatureService";
import { useAuth } from "../../context/AuthContext";
import { getCouleurContrat } from "../offres/offreColors";
import "./offres.css";
import { enregistrerOffreVue } from "../../api/trackingService";

type EtapeCandidature = "idle" | "formulaire" | "succes";

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

function estExpiree(offre: OffreDTO): boolean {
    if (!offre.dateExpiration) return false;
    return new Date(offre.dateExpiration) < new Date();
}

export function OffreDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [offre, setOffre] = useState<OffreDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dejaPostule, setDejaPostule] = useState(false);
    const [etapeCandidature, setEtapeCandidature] = useState<EtapeCandidature>("idle");

    const demandeOuvertureAuto = (location.state as { ouvrirCandidature?: boolean } | null)?.ouvrirCandidature ?? false;

    useEffect(() => {
        async function charger() {
            setLoading(true);
            try {
                const data = await obtenirOffre(Number(id));
                setOffre(data);

                if (currentUser?.role === "CANDIDAT") {
                    const deja = await aDejaPostule(Number(id));
                    setDejaPostule(deja);
                    if (demandeOuvertureAuto && !deja) {
                        setEtapeCandidature("formulaire");
                    }
                }
            } catch {
                setError("Cette offre est introuvable ou n'est plus disponible.");
            } finally {
                setLoading(false);
            }
        }
        charger();
        enregistrerOffreVue(Number(id));
        enregistrerVueOffre(Number(id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, currentUser?.role]);

    function retour() {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/offres");
        }
    }

    function ouvrirFormulaire() {
        if (!currentUser) {
            navigate(`/connexion?redirect=/offres/${offre?.id}`);
            return;
        }
        setEtapeCandidature("formulaire");
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
    const expiree = estExpiree(offre);
    // Le CTA "Postuler" est visible pour les visiteurs non connectés (redirection vers la connexion)
    // et pour les candidats connectés ; jamais pour les recruteurs/admins.
    const peutVoirCta = !currentUser || estCandidat;

    return (
        <div className="offre-detail">
            <button
                onClick={retour}
                className="offre-detail__back"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
                ← Retour aux offres
            </button>

            <div className="offre-detail__header">
                <div className="offre-detail__top-row">
                    <div>
                        <LogoEntreprise
                            recruteurId={offre.recruteurId}
                            logoPresent={offre.logoPresent}
                            nomEntreprise={offre.nomEntreprise}
                            className="offre-detail__logo"
                        />
                        <p className="offre-detail__entreprise">{offre.nomEntreprise || "Entreprise inconnue"}</p>
                        <h1 className="offre-detail__titre">{offre.titre}</h1>
                        <p className="offre-detail__lieu">{lieu || "Lieu non précisé"}</p>
                    </div>
                </div>
                <div className="offre-detail__tags">
                    <span
                        className="offre-detail__tag"
                        style={{ background: getCouleurContrat(offre.typeContrat).bar, color: "white" }}
                    >
                        {LABELS_TYPE_CONTRAT[offre.typeContrat]}
                    </span>
                    {offre.teletravail && <span className="offre-detail__tag">Télétravail</span>}
                    {offre.hybride && <span className="offre-detail__tag">Hybride</span>}
                    {offre.niveauExperience && <span className="offre-detail__tag">{LABELS_NIVEAU_EXPERIENCE[offre.niveauExperience]}</span>}
                    {expiree && (
                        <span className="offre-detail__tag" style={{ background: "#b3261e", color: "white" }}>
                            Expirée
                        </span>
                    )}
                </div>
            </div>

            {estCandidat && etapeCandidature !== "idle" && (
                <div className="offre-detail__section">
                    {etapeCandidature === "formulaire" && (
                        <>
                            <p className="offre-detail__section-title">Votre candidature</p>
                            <CandidatureFormulaire
                                offreId={offre.id}
                                onAnnuler={() => setEtapeCandidature("idle")}
                                onSucces={() => {
                                    setEtapeCandidature("succes");
                                    setDejaPostule(true);
                                }}
                            />
                        </>
                    )}

                    {etapeCandidature === "succes" && (
                        <div className="candidature-form__success">
                            ✓ Votre candidature a bien été envoyée. Vous pouvez suivre son statut dans « Mes candidatures ».
                        </div>
                    )}
                </div>
            )}

            {offre.description && (
                <div className="offre-detail__section">
                    <p className="offre-detail__section-title" style={{ "--section-color": "#378ADD" } as React.CSSProperties}>
                        Description du poste
                    </p>
                    <p className="offre-detail__text">{offre.description}</p>
                </div>
            )}

            {offre.missions && offre.missions.length > 0 && (
                <div className="offre-detail__section">
                    <p className="offre-detail__section-title" style={{ "--section-color": "#1D9E75" } as React.CSSProperties}>
                        Missions
                    </p>
                    <ul className="offre-detail__list">
                        {offre.missions.map((m) => (
                            <li key={m}>{m}</li>
                        ))}
                    </ul>
                </div>
            )}

            {(offre.profilRecherche || offre.niveauEtude || offre.experienceMinimum) && (
                <div className="offre-detail__section">
                    <p className="offre-detail__section-title" style={{ "--section-color": "#7F77DD" } as React.CSSProperties}>
                        Profil recherché
                    </p>
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
                    <p
                        className="offre-detail__section-title"
                        style={{ "--section-color": getCouleurContrat(offre.typeContrat).bar } as React.CSSProperties}
                    >
                        Compétences & langues
                    </p>
                    <div className="offre-detail__chips" style={{ marginBottom: 12 }}>
                        {offre.competences?.map((c) => (
                            <span
                                className="offre-detail__chip"
                                key={c}
                                style={
                                    {
                                        "--chip-bg": getCouleurContrat(offre.typeContrat).bg,
                                        "--chip-text": getCouleurContrat(offre.typeContrat).text,
                                        "--chip-border": getCouleurContrat(offre.typeContrat).bg,
                                    } as React.CSSProperties
                                }
                            >
                                {c}
                            </span>
                        ))}
                    </div>
                    <div className="offre-detail__chips">
                        {offre.langues?.map((l) => (
                            <span
                                className="offre-detail__chip"
                                key={l}
                                style={{ "--chip-bg": "#E1F5EE", "--chip-text": "#085041", "--chip-border": "#9FE1CB" } as React.CSSProperties}
                            >
                                {l}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {offre.avantages && offre.avantages.length > 0 && (
                <div className="offre-detail__section">
                    <p className="offre-detail__section-title" style={{ "--section-color": "#C8951E" } as React.CSSProperties}>
                        Avantages
                    </p>
                    <div className="offre-detail__chips">
                        {offre.avantages.map((a) => (
                            <span
                                className="offre-detail__chip"
                                key={a}
                                style={{ "--chip-bg": "#FAEEDA", "--chip-text": "#633806", "--chip-border": "#FAC775" } as React.CSSProperties}
                            >
                                {a}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="offre-detail__section">
                <p className="offre-detail__section-title" style={{ "--section-color": "#8A8780" } as React.CSSProperties}>
                    Informations complémentaires
                </p>
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
                    {offre.dateExpiration && (
                        <div>
                            <div className="offre-detail__fact-label">Date d'expiration</div>
                            <div className="offre-detail__fact-value" style={expiree ? { color: "#b3261e" } : undefined}>
                                {formatDate(offre.dateExpiration)}
                                {expiree && " (expirée)"}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {peutVoirCta && offre.statut === "PUBLIEE" && etapeCandidature === "idle" && (
                <div className="offre-detail__cta">
                    <div>
                        <div className="offre-detail__fact-value" style={{ marginBottom: 2 }}>
                            {salaire ?? "Salaire non communiqué"}
                        </div>
                        <div className="offre-detail__cta-info">
                            {expiree
                                ? "Cette offre a expiré"
                                : !currentUser
                                    ? "Connectez-vous pour postuler"
                                    : dejaPostule
                                        ? "Candidature envoyée ✓"
                                        : "Postulez en un clic"}
                        </div>
                    </div>
                    <button className="btn-gold" onClick={ouvrirFormulaire} disabled={expiree || dejaPostule}>
                        {expiree ? "Offre expirée" : dejaPostule ? "Candidature envoyée" : "Postuler"}
                    </button>
                </div>
            )}
        </div>
    );
}