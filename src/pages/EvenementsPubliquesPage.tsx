import { useEffect, useState } from "react";
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
                <p className="evenements-vide">Chargement…</p>
            ) : evenements.length === 0 ? (
                <p className="evenements-vide">Aucun événement publié pour le moment.</p>
            ) : (
                <div className="evenements-grid">
                    {evenements.map((e) => (
                        <article className="evenement-card" key={e.id}>
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
                                <h2 className="evenement-card__titre">{e.titre}</h2>
                                <p className="evenement-card__meta">
                                    {formatDate(e.dateEvenement)}
                                    {e.heure ? ` · ${e.heure}` : ""}
                                </p>
                                {e.lieu && <p className="evenement-card__meta">{e.lieu}</p>}
                                {e.description && <p className="evenement-card__desc">{e.description}</p>}
                                {e.organisateur && <p className="evenement-card__organisateur">Organisé par {e.organisateur}</p>}

                                {e.lien && (
                                    <a href={e.lien} target="_blank" rel="noopener noreferrer" className="evenement-card__lien">
                                        En savoir plus →
                                    </a>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}