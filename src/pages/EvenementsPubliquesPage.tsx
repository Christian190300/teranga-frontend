import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    type EvenementDTO,
    LABELS_TYPE_EVENEMENT,
    listerEvenementsPublics,
    obtenirImageEvenementPubliqueUrl,
} from "../api/evenementService";
import { EvenementImage } from "../components/EvenementImage";
import "./EvenementsPubliquesPage.css";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function tronquer(texte: string, max: number): string {
    if (texte.length <= max) return texte;
    return `${texte.slice(0, max).trimEnd()}…`;
}

export function EvenementsPubliquesPage() {
    const [evenements, setEvenements] = useState<EvenementDTO[]>([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage, pattern standard
        (async () => {
            setChargement(true);
            setErreur(null);
            try {
                const resultat = await listerEvenementsPublics();
                setEvenements(resultat);
            } catch {
                setErreur("Impossible de charger les événements pour l'instant.");
            } finally {
                setChargement(false);
            }
        })();
    }, []);

    return (
        <div className="evenements-page">
            <section className="evenements-hero">
                <p className="evenements-hero__eyebrow">Talent Sénégal</p>
                <h1 className="evenements-hero__title">Événements</h1>
                <p className="evenements-hero__subtitle">
                    Cérémonies de remise de diplômes, opportunités de stage et rendez-vous à ne pas manquer.
                </p>
            </section>

            {erreur && <div className="evenements-alert">{erreur}</div>}

            {chargement ? (
                <div className="evenements-grid" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => (
                        <div className="evenement-card evenement-card--skeleton" key={i}>
                            <div className="evenement-card__image evenement-card__image--placeholder" />
                            <div className="evenement-card__body">
                                <div className="skeleton-ligne skeleton-ligne--titre" />
                                <div className="skeleton-ligne skeleton-ligne--meta" />
                                <div className="skeleton-ligne skeleton-ligne--desc" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : evenements.length === 0 ? (
                <p className="evenements-vide">Aucun événement publié pour le moment.</p>
            ) : (
                <div className="evenements-grid">
                    {evenements.map((e) => (
                        <Link to={`/evenements/${e.id}`} className="evenement-card" key={e.id}>
                            <div className="evenement-card__image-wrap">
                                {e.imagePresente ? (
                                    <EvenementImage
                                        presente={e.imagePresente}
                                        chargerUrl={() => obtenirImageEvenementPubliqueUrl(e.id)}
                                        alt={e.titre}
                                        className="evenement-card__image"
                                        placeholderClassName="evenement-card__image evenement-card__image--placeholder"
                                    />
                                ) : (
                                    <div className="evenement-card__image evenement-card__image--placeholder" />
                                )}
                                {e.type && <span className="evenement-card__type">{LABELS_TYPE_EVENEMENT[e.type]}</span>}
                            </div>

                            <div className="evenement-card__body">
                                <p className="evenement-card__meta evenement-card__meta--date">
                                    {formatDate(e.dateEvenement)}
                                    {e.heure ? ` · ${e.heure}` : ""}
                                </p>
                                <h2 className="evenement-card__titre">{e.titre}</h2>
                                {e.lieu && <p className="evenement-card__meta">{e.lieu}</p>}
                                {e.description && (
                                    <p className="evenement-card__desc">{tronquer(e.description, 110)}</p>
                                )}
                                <span className="evenement-card__bouton">Voir les détails</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}