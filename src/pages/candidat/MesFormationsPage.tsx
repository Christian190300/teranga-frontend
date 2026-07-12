import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    mesInscriptions,
    mesCertifications,
    telechargerCertificatPdf,
    type InscriptionFormationDTO,
    type CertificationDTO,
} from "../../api/formationPublicService";
import "../public/offres.css";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function MesFormationsPage() {
    const [inscriptions, setInscriptions] = useState<InscriptionFormationDTO[]>([]);
    const [certifications, setCertifications] = useState<CertificationDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [telechargementEnCoursId, setTelechargementEnCoursId] = useState<number | null>(null);

    useEffect(() => {
        charger();
    }, []);

    async function charger() {
        setLoading(true);
        try {
            const [inscriptionsData, certificationsData] = await Promise.all([mesInscriptions(), mesCertifications()]);
            setInscriptions(inscriptionsData);
            setCertifications(certificationsData);
        } catch {
            setError("Impossible de charger vos formations pour le moment.");
        } finally {
            setLoading(false);
        }
    }

    async function handleTelecharger(certification: CertificationDTO) {
        setTelechargementEnCoursId(certification.id);
        try {
            await telechargerCertificatPdf(certification.id, `certificat-${certification.numero}.pdf`);
        } catch {
            setError("Impossible de télécharger ce certificat.");
        } finally {
            setTelechargementEnCoursId(null);
        }
    }

    return (
        <div className="offres-page">
            <div className="offres-page__header">
                <div>
                    <h1 className="offres-page__title">Mes formations</h1>
                    <p className="offres-page__subtitle">Suivez votre progression et retrouvez vos certifications.</p>
                </div>
            </div>

            {error && <div className="offre-message--error">{error}</div>}

            {loading ? (
                <div className="offres-page__loading">Chargement...</div>
            ) : (
                <>
                    {inscriptions.length === 0 ? (
                        <div className="candidature-page__empty">
                            <p style={{ marginBottom: 16 }}>Vous n'êtes inscrit à aucune formation pour le moment.</p>
                            <Link to="/formations" className="btn-primary">
                                Découvrir les formations
                            </Link>
                        </div>
                    ) : (
                        inscriptions.map((inscription) => (
                            <div className="candidature-row" key={inscription.id}>
                                <div className="candidature-row__top">
                                    <div style={{ flex: 1 }}>
                                        <p className="candidature-row__titre">{inscription.formationTitre}</p>
                                        <p className="candidature-row__meta">Inscrit le {formatDate(inscription.dateInscription)}</p>
                                        <div className="lecteur-progress-bar" style={{ marginTop: 10, maxWidth: 260 }}>
                                            <div
                                                className="lecteur-progress-bar__remplissage"
                                                style={{ width: `${inscription.progressionPourcent}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span
                                        className={`statut-badge ${
                                            inscription.statut === "TERMINEE" ? "statut-badge--acceptee" : "statut-badge--envoyee"
                                        }`}
                                    >
                                        {inscription.statut === "TERMINEE" ? "Terminée" : "En cours"} · {inscription.progressionPourcent}%
                                    </span>
                                </div>

                                {inscription.certificationObtenue && (
                                    <p className="formation-tile__deja-inscrit" style={{ marginTop: 10 }}>
                                        🏆 Certification obtenue
                                    </p>
                                )}

                                <div className="candidature-row__actions">
                                    <Link to={`/candidat/formation/${inscription.formationId}`} className="btn-gold">
                                        {inscription.statut === "TERMINEE" ? "Revoir la formation" : "Continuer"}
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}

                    {certifications.length > 0 && (
                        <>
                            <h2 className="offres-page__title" style={{ fontSize: "1.3rem", marginTop: 40 }}>
                                Mes certifications
                            </h2>
                            {certifications.map((certification) => (
                                <div className="candidature-row" key={certification.id}>
                                    <div className="candidature-row__top">
                                        <div>
                                            <p className="candidature-row__titre">{certification.formationTitre}</p>
                                            <p className="candidature-row__meta">
                                                N° {certification.numero} · Obtenue le {formatDate(certification.dateObtention)}
                                            </p>
                                        </div>
                                        <span className="statut-badge statut-badge--acceptee">
                                            {certification.notePourcent}%{certification.mention ? ` · ${certification.mention}` : ""}
                                        </span>
                                    </div>
                                    <div className="candidature-row__actions">
                                        <button
                                            className="btn-secondary"
                                            onClick={() => handleTelecharger(certification)}
                                            disabled={telechargementEnCoursId === certification.id || !certification.pdfPresent}
                                        >
                                            {telechargementEnCoursId === certification.id ? "Téléchargement..." : "📄 Télécharger le PDF"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}
        </div>
    );
}