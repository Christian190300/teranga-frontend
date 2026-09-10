import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    type EvenementDTO,
    LABELS_TYPE_EVENEMENT,
    obtenirEvenementPublic,
    obtenirImageEvenementPubliqueUrl,
} from "../api/evenementService";
import { EvenementImage } from "../components/EvenementImage";
import "./EvenementsPubliquesPage.css";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function EvenementDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [evenement, setEvenement] = useState<EvenementDTO | null>(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setChargement(true);
        obtenirEvenementPublic(Number(id))
            .then(setEvenement)
            .catch(() => setErreur("Cet événement est introuvable ou n'est plus disponible."))
            .finally(() => setChargement(false));
    }, [id]);

    if (chargement) {
        return <div className="evenement-detail__loading">Chargement...</div>;
    }

    if (erreur || !evenement) {
        return (
            <div className="evenement-detail__loading">
                {erreur ?? "Événement introuvable."}
                <div style={{ marginTop: 16 }}>
                    <Link to="/evenements" className="evenement-detail__retour">
                        ← Tous les événements
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="evenement-detail">
            <Link to="/evenements" className="evenement-detail__retour">
                ← Tous les événements
            </Link>

            <div className="evenement-detail__media">
                {evenement.imagePresente ? (
                    <EvenementImage
                        presente={evenement.imagePresente}
                        chargerUrl={() => obtenirImageEvenementPubliqueUrl(evenement.id)}
                        alt={evenement.titre}
                        className="evenement-detail__image"
                        placeholderClassName="evenement-detail__image evenement-detail__image--placeholder"
                    />
                ) : (
                    <div className="evenement-detail__image evenement-detail__image--placeholder" />
                )}
                <div className="evenement-detail__scrim" />
                <div className="evenement-detail__media-content">
                    {evenement.type && (
                        <span className="evenement-modal__type-badge">{LABELS_TYPE_EVENEMENT[evenement.type]}</span>
                    )}
                    <h1 className="evenement-detail__titre">{evenement.titre}</h1>
                    <p className="evenement-modal__date">
                        {formatDate(evenement.dateEvenement)}
                        {evenement.heure ? ` · ${evenement.heure}` : ""}
                    </p>
                </div>
            </div>

            <div className="evenement-detail__body">
                {(evenement.lieu || evenement.organisateur) && (
                    <div className="evenement-modal__chips">
                        {evenement.lieu && (
                            <span className="evenement-modal__chip">
                                <span className="evenement-modal__chip-label">Lieu</span>
                                {evenement.lieu}
                            </span>
                        )}
                        {evenement.organisateur && (
                            <span className="evenement-modal__chip">
                                <span className="evenement-modal__chip-label">Organisateur</span>
                                {evenement.organisateur}
                            </span>
                        )}
                    </div>
                )}

                {evenement.description && (
                    <div className="evenement-modal__section">
                        <p className="evenement-modal__section-label">À propos</p>
                        {evenement.description
                            .split("\n")
                            .map((ligne) => ligne.trim())
                            .filter((ligne) => ligne.length > 0)
                            .map((ligne, index) => (
                                <p className="evenement-modal__desc" key={index}>
                                    {ligne}
                                </p>
                            ))}
                    </div>
                )}

                {evenement.lien && (
                    <div className="evenement-detail__cta">
                        <a href={evenement.lien} target="_blank" rel="noopener noreferrer" className="evenement-modal__lien">
                            Voir le site de l'événement →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}