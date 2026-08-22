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

function tronquer(texte: string, max: number): string {
    if (texte.length <= max) return texte;
    return `${texte.slice(0, max).trimEnd()}…`;
}

export function EvenementsPubliquesPage() {
    const [evenements, setEvenements] = useState<EvenementDTO[]>([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);
    const [evenementSelectionne, setEvenementSelectionne] = useState<EvenementDTO | null>(null);

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

    // Empêche le scroll du body quand le modal est ouvert, et gère la touche Échap
    useEffect(() => {
        if (!evenementSelectionne) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setEvenementSelectionne(null);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [evenementSelectionne]);

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
                    {[0, 1, 2].map((i) => (
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
                                <p className="evenement-card__meta evenement-card__meta--date">
                                    {formatDate(e.dateEvenement)}
                                    {e.heure ? ` · ${e.heure}` : ""}
                                </p>
                                <h2 className="evenement-card__titre">{e.titre}</h2>
                                {e.lieu && <p className="evenement-card__meta">{e.lieu}</p>}
                                {e.description && (
                                    <p className="evenement-card__desc">{tronquer(e.description, 110)}</p>
                                )}

                                <button
                                    type="button"
                                    className="evenement-card__bouton"
                                    onClick={() => setEvenementSelectionne(e)}
                                >
                                    Voir les détails
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {evenementSelectionne && (
                <div
                    className="evenement-modal-overlay"
                    onClick={() => setEvenementSelectionne(null)}
                    role="presentation"
                >
                    <div
                        className="evenement-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="evenement-modal-titre"
                        onClick={(ev) => ev.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="evenement-modal__fermer"
                            onClick={() => setEvenementSelectionne(null)}
                            aria-label="Fermer"
                        >
                            ✕
                        </button>

                        <div className="evenement-modal__scroll">
                            <div className="evenement-modal__media">
                                {evenementSelectionne.imagePresente ? (
                                    <EvenementImage
                                        presente={evenementSelectionne.imagePresente}
                                        chargerUrl={() => obtenirImageEvenementPubliqueUrl(evenementSelectionne.id)}
                                        alt={evenementSelectionne.titre}
                                        className="evenement-modal__image"
                                        placeholderClassName="evenement-modal__image evenement-modal__image--placeholder"
                                    />
                                ) : (
                                    <div className="evenement-modal__image evenement-modal__image--placeholder" />
                                )}
                                <div className="evenement-modal__scrim" />
                                <div className="evenement-modal__media-content">
                                    {evenementSelectionne.type && (
                                        <span className="evenement-modal__type-badge">
                                            {LABELS_TYPE_EVENEMENT[evenementSelectionne.type]}
                                        </span>
                                    )}
                                    <h2 id="evenement-modal-titre" className="evenement-modal__titre">
                                        {evenementSelectionne.titre}
                                    </h2>
                                    <p className="evenement-modal__date">
                                        {formatDate(evenementSelectionne.dateEvenement)}
                                        {evenementSelectionne.heure ? ` · ${evenementSelectionne.heure}` : ""}
                                    </p>
                                </div>
                            </div>

                            <div className="evenement-modal__body">
                                {(evenementSelectionne.lieu || evenementSelectionne.organisateur) && (
                                    <div className="evenement-modal__chips">
                                        {evenementSelectionne.lieu && (
                                            <span className="evenement-modal__chip">
                                                <span className="evenement-modal__chip-label">Lieu</span>
                                                {evenementSelectionne.lieu}
                                            </span>
                                        )}
                                        {evenementSelectionne.organisateur && (
                                            <span className="evenement-modal__chip">
                                                <span className="evenement-modal__chip-label">Organisateur</span>
                                                {evenementSelectionne.organisateur}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {evenementSelectionne.description && (
                                    <p className="evenement-modal__desc">{evenementSelectionne.description}</p>
                                )}
                            </div>
                        </div>

                        {evenementSelectionne.lien && (
                            <div className="evenement-modal__footer">
                                <a
                                    href={evenementSelectionne.lien}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="evenement-modal__lien"
                                >
                                    Voir le site de l'événement →
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}