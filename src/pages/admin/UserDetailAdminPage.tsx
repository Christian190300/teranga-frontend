import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
    getActiviteUtilisateur,
    getProfilCompletUtilisateur,
    obtenirVideoUtilisateurUrl,
    type ProfilCompletAdminDTO,
    type UserActivityDTO,
} from "../../api/userAdminActivityService";

import "./userDetailAdminPage.css";

// -----------------------------------------------------------------------------
// Icônes
// -----------------------------------------------------------------------------

function IconEye() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="1.6"
            />
        </svg>
    );
}

function IconFile() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 3.5h9l3 3v14H6z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path
                d="M9 12h6M9 15.5h6M9 8.5h3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function IconBriefcase() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="3"
                y="7.5"
                width="18"
                height="12"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5"
                stroke="currentColor"
                strokeWidth="1.6"
            />
        </svg>
    );
}

// -----------------------------------------------------------------------------
// Utilitaires
// -----------------------------------------------------------------------------

function formatDate(iso?: string | null): string {
    if (!iso) {
        return "—";
    }

    return new Date(iso).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function scorePourcent(
    score?: { percentage: number } | number
): number {
    if (score === undefined || score === null) {
        return 0;
    }

    if (typeof score === "number") {
        return score;
    }

    return score.percentage ?? 0;
}

// -----------------------------------------------------------------------------
// Page détail utilisateur
// -----------------------------------------------------------------------------

export function UserDetailAdminPage() {
    const { userId } = useParams<{ userId: string }>();

    const [activite, setActivite] = useState<UserActivityDTO | null>(null);
    const [profil, setProfil] =
        useState<ProfilCompletAdminDTO | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    // -------------------------------------------------------------------------
    // Chargement des données utilisateur
    // -------------------------------------------------------------------------

    useEffect(() => {
        if (!userId) {
            return;
        }

        async function charger() {
            setLoading(true);
            setError(null);

            try {
                const [act, prof] = await Promise.all([
                    getActiviteUtilisateur(userId),
                    getProfilCompletUtilisateur(userId),
                ]);

                setActivite(act);
                setProfil(prof);
            } catch {
                setError(
                    "Impossible de charger les informations de cet utilisateur."
                );
            } finally {
                setLoading(false);
            }
        }

        charger();
    }, [userId]);

    // -------------------------------------------------------------------------
    // Vidéo de présentation
    // -------------------------------------------------------------------------

    const videoStatut = profil?.profilCandidat?.videoStatut;

    useEffect(() => {
        if (!userId || videoStatut !== "DISPONIBLE") return;
        let urlCourante: string | null = null;
        obtenirVideoUtilisateurUrl(userId!).then((url) => {
            urlCourante = url;
            setVideoUrl(url);
        });
        return () => {
            if (urlCourante) URL.revokeObjectURL(urlCourante);
        };
    }, [userId, videoStatut]);

    // -------------------------------------------------------------------------
    // États de chargement
    // -------------------------------------------------------------------------

    if (loading) {
        return (
            <div className="udap-loading">
                Chargement...
            </div>
        );
    }

    if (error || !profil) {
        return (
            <div className="udap-error">
                {error ?? "Utilisateur introuvable."}
            </div>
        );
    }

    // -------------------------------------------------------------------------
    // Score du profil
    // -------------------------------------------------------------------------

    const score =
        profil.typeProfil === "CANDIDAT"
            ? scorePourcent(profil.profilCandidat?.score)
            : null;

    const estCertifie = score !== null && score >= 100;

    // -------------------------------------------------------------------------
    // Rendu
    // -------------------------------------------------------------------------

    return (
        <div className="udap-page">

            {/* -----------------------------------------------------------------
                Retour
            ----------------------------------------------------------------- */}

            <Link
                to="/admin/utilisateurs"
                className="udap-back"
            >
                ← Retour à la liste des utilisateurs
            </Link>

            {/* -----------------------------------------------------------------
                En-tête
            ----------------------------------------------------------------- */}

            <div className="udap-header">
                <div>
                    <span
                        className={`udap-badge udap-badge--${profil.typeProfil.toLowerCase()}`}
                    >
                        {profil.typeProfil === "CANDIDAT"
                            ? "Candidat"
                            : profil.typeProfil === "RECRUTEUR"
                              ? "Recruteur"
                              : "Type inconnu"}
                    </span>

                    <h1>
                        {profil.typeProfil === "RECRUTEUR"
                            ? profil.profilRecruteur?.nomEntreprise ??
                              "Entreprise sans nom"
                            : profil.profilCandidat?.titreProfessionnel ??
                              "Profil candidat"}
                    </h1>

                    <p className="udap-userid">
                        {profil.userId}
                    </p>
                </div>

                {score !== null && (
                    <div
                        className={`udap-score${
    estCertifie
        ? " udap-score--certifie"
        : ""
}`}
                    >
                        {estCertifie && (
                            <span className="udap-score__cert">
                                ✓ Profil certifié
                            </span>
                        )}

                        <span className="udap-score__value">
                            {score}%
                        </span>

                        <span className="udap-score__label">
                            Profil complété
                        </span>
                    </div>
                )}
            </div>

            {/* -----------------------------------------------------------------
                Activité
            ----------------------------------------------------------------- */}

            {activite && (
                <div className="udap-card">
                    <h2>Activité</h2>

                    <div className="udap-stats-row">

                        <div className="udap-stat">
                            <IconEye />

                            <div>
                                <strong>
                                    {activite.nombrePagesVisitees}
                                </strong>

                                <span>
                                    Pages visitées
                                </span>
                            </div>
                        </div>

                        <div className="udap-stat">
                            <IconBriefcase />

                            <div>
                                <strong>
                                    {activite.nombreOffresVues}
                                </strong>

                                <span>
                                    Offres consultées
                                </span>
                            </div>
                        </div>

                        <div className="udap-stat">
                            <IconFile />

                            <div>
                                <strong>
                                    {activite.nombreCandidatures}
                                </strong>

                                <span>
                                    Candidatures envoyées
                                </span>
                            </div>
                        </div>

                    </div>

                    {activite.candidatures.length > 0 && (
                        <>
                            <p className="udap-subtitle">
                                Candidatures récentes
                            </p>

                            <div className="udap-list">
                                {activite.candidatures
                                    .slice(0, 5)
                                    .map((c) => (
                                        <Link
                                            key={c.id}
                                            to={`/offres/${c.offreId}`}
                                            className="udap-list-item"
                                        >
                                            <span>
                                                {c.titreOffre ??
                                                    `Offre #${c.offreId}`}
                                            </span>

                                            <span className="udap-list-item__meta">
                                                {c.statut ?? "—"} ·{" "}
                                                {formatDate(
                                                    c.dateCandidature
                                                )}
                                            </span>
                                        </Link>
                                    ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* -----------------------------------------------------------------
                Profil recruteur
            ----------------------------------------------------------------- */}

            {profil.typeProfil === "RECRUTEUR" &&
                profil.profilRecruteur && (
                    <div className="udap-card">
                        <h2>Fiche entreprise</h2>

                        <dl className="udap-details">
                            <div>
                                <dt>Secteur d'activité</dt>
                                <dd>
                                    {profil.profilRecruteur
                                        .secteurActivite ?? "—"}
                                </dd>
                            </div>

                            <div>
                                <dt>Téléphone</dt>
                                <dd>
                                    {profil.profilRecruteur
                                        .telephoneEntreprise ?? "—"}
                                </dd>
                            </div>
                        </dl>

                        {profil.profilRecruteur
                            .descriptionEntreprise && (
                            <>
                                <p className="udap-subtitle">
                                    Description
                                </p>

                                <p className="udap-text">
                                    {
                                        profil.profilRecruteur
                                            .descriptionEntreprise
                                    }
                                </p>
                            </>
                        )}
                    </div>
                )}

            {/* -----------------------------------------------------------------
                Profil candidat
            ----------------------------------------------------------------- */}

            {profil.typeProfil === "CANDIDAT" &&
                profil.profilCandidat && (
                    <>
                        {/* Coordonnées */}

                        <div className="udap-card">
                            <h2>Coordonnées</h2>

                            <dl className="udap-details">
                                <div>
                                    <dt>Téléphone</dt>
                                    <dd>
                                        {profil.profilCandidat
                                            .telephone ?? "—"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>Ville</dt>
                                    <dd>
                                        {profil.profilCandidat
                                            .ville ?? "—"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>Région</dt>
                                    <dd>
                                        {profil.profilCandidat
                                            .region ?? "—"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>Adresse</dt>
                                    <dd>
                                        {profil.profilCandidat
                                            .adresse ?? "—"}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Profil professionnel */}

                        <div className="udap-card">
                            <h2>Profil professionnel</h2>

                            {profil.profilCandidat.aPropos && (
                                <p className="udap-text">
                                    {profil.profilCandidat.aPropos}
                                </p>
                            )}

                            <dl className="udap-details">
                                <div>
                                    <dt>Niveau d'expérience</dt>
                                    <dd>
                                        {profil.profilCandidat
                                            .niveauExperience ?? "—"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>Années d'expérience</dt>
                                    <dd>
                                        {profil.profilCandidat
                                            .anneesExperience ?? "—"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>Disponibilité</dt>
                                    <dd>
                                        {profil.profilCandidat
                                            .disponibilite ?? "—"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>Niveau d'étude</dt>
                                    <dd>
                                        {profil.profilCandidat
                                            .niveauEtude ?? "—"}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Compétences */}

                        {(profil.profilCandidat.competences?.length ??
                            0) > 0 && (
                            <div className="udap-card">
                                <h2>Compétences</h2>

                                <div className="udap-tags">
                                    {profil.profilCandidat
                                        .competences!.map((competence) => (
                                            <span
                                                key={competence}
                                                className="udap-tag"
                                            >
                                                {competence}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Langues */}

                        {(profil.profilCandidat.langues?.length ??
                            0) > 0 && (
                            <div className="udap-card">
                                <h2>Langues</h2>

                                <div className="udap-tags">
                                    {profil.profilCandidat
                                        .langues!.map((langue) => (
                                            <span
                                                key={langue}
                                                className="udap-tag"
                                            >
                                                {langue}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Formations */}

                        {(profil.profilCandidat.formations?.length ??
                            0) > 0 && (
                            <div className="udap-card">
                                <h2>Formations</h2>

                                <ul className="udap-simple-list">
                                    {profil.profilCandidat
                                        .formations!.map((formation) => (
                                            <li key={formation}>
                                                {formation}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}

                        {/* Certifications */}

                        {(profil.profilCandidat.certifications
                            ?.length ?? 0) > 0 && (
                            <div className="udap-card">
                                <h2>Certifications</h2>

                                <ul className="udap-simple-list">
                                    {profil.profilCandidat
                                        .certifications!.map(
                                            (certification) => (
                                                <li key={certification}>
                                                    {certification}
                                                </li>
                                            )
                                        )}
                                </ul>
                            </div>
                        )}

                        {/* Documents */}

                        <div className="udap-card">
                            <h2>Documents</h2>

                            <div className="udap-documents">

                                <a
                                    className={`udap-doc-btn${
    !profil.profilCandidat.cvPresent
        ? " udap-doc-btn--disabled"
        : ""
}`}
                                    href={
                                        profil.profilCandidat.cvPresent
                                            ? `/api/admin/candidats/${profil.userId}/cv`
: undefined
}
target="_blank"
rel="noreferrer"
    >
    <IconFile />

    {profil.profilCandidat.cvPresent
            ? "Télécharger le CV"
            : "Aucun CV"}
</a>

<a
    className={`udap-doc-btn${
        !profil.profilCandidat
            .lettreMotivationPresente
            ? " udap-doc-btn--disabled"
            : ""
    }`}
    href={
        profil.profilCandidat
            .lettreMotivationPresente
            ? `/api/admin/candidats/${profil.userId}/lettre-motivation`
            : undefined
    }
    target="_blank"
    rel="noreferrer"
>
    <IconFile />

    {profil.profilCandidat
        .lettreMotivationPresente
        ? "Télécharger la lettre"
        : "Aucune lettre"}
</a>

</div>
</div>

{/* Vidéo de présentation */}

{videoStatut &&
videoStatut !== "EN_ATTENTE" && (
    <div className="udap-card">
        <h2>
            Vidéo de présentation
        </h2>

        {videoStatut === "DISPONIBLE" &&
            videoUrl && (
                <>
                    <video
                        src={videoUrl}
                        controls
                        className="udap-video"
                    />

                    {profil.profilCandidat
                        .videoDureeSecondes && (
                        <p className="udap-subtitle">
                            Durée :{" "}
                            {
                                profil
                                    .profilCandidat
                                    .videoDureeSecondes
                            }
                            s
                        </p>
                    )}
                </>
            )}

        {videoStatut === "DISPONIBLE" &&
            !videoUrl && (
                <p className="udap-text">
                    Chargement de la vidéo...
                </p>
            )}

        {videoStatut === "EN_COURS" && (
            <p className="udap-text">
                Traitement en cours...
            </p>
        )}

        {videoStatut === "ECHEC" && (
            <p className="udap-text">
                Échec du traitement de la vidéo.
            </p>
        )}
    </div>
)}

{/* Réseaux sociaux */}

<div className="udap-card">
    <h2>Réseaux</h2>

    <dl className="udap-details">
        <div>
            <dt>LinkedIn</dt>
            <dd>
                {profil.profilCandidat
                    .linkedin ?? "—"}
            </dd>
        </div>

        <div>
            <dt>GitHub</dt>
            <dd>
                {profil.profilCandidat
                    .github ?? "—"}
            </dd>
        </div>

        <div>
            <dt>Portfolio</dt>
            <dd>
                {profil.profilCandidat
                    .portfolio ?? "—"}
            </dd>
        </div>
    </dl>
</div>

{/* Informations du compte */}

<div className="udap-card">
    <h2>Compte</h2>

    <dl className="udap-details">
        <div>
            <dt>Membre depuis</dt>
            <dd>
                {formatDate(
                    profil.profilCandidat
                        .dateCreation
                )}
            </dd>
        </div>

        <div>
            <dt>Dernière mise à jour</dt>
            <dd>
                {formatDate(
                    profil.profilCandidat
                        .dateMaj
                )}
            </dd>
        </div>
    </dl>
</div>
</>
)}
</div>
);
}