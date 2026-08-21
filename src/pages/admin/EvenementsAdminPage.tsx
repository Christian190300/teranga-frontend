import { useCallback, useEffect, useState } from "react";
import {
    type EvenementDTO,
    type EvenementFormPayload,
    type StatutEvenement,
    LABELS_STATUT_EVENEMENT,
    LABELS_TYPE_EVENEMENT,
    changerStatutEvenement,
    creerEvenement,
    listerEvenementsAdmin,
    modifierEvenement,
    supprimerEvenement,
} from "../../api/evenementService";
import { EvenementFormModal } from "../admin/EvenementFormModal";
import "./UserAdminPage.css";
import "./EvenementsAdminPage.css";

function classeStatut(statut: StatutEvenement): string {
    return `statut-badge statut-badge--${statut.toLowerCase()}`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function EvenementsAdminPage() {
    const [evenements, setEvenements] = useState<EvenementDTO[]>([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);
    const [modalOuvert, setModalOuvert] = useState(false);
    const [evenementEnEdition, setEvenementEnEdition] = useState<EvenementDTO | null>(null);

    const charger = useCallback(async () => {
        setChargement(true);
        setErreur(null);
        try {
            const resultat = await listerEvenementsAdmin();
            setEvenements(resultat);
        } catch {
            setErreur("Impossible de charger les événements.");
        } finally {
            setChargement(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage, pattern standard
        charger();
    }, [charger]);

    function ouvrirCreation() {
        setEvenementEnEdition(null);
        setModalOuvert(true);
    }

    function ouvrirEdition(e: EvenementDTO) {
        setEvenementEnEdition(e);
        setModalOuvert(true);
    }

    async function handleEnregistrer(payload: EvenementFormPayload) {
        if (evenementEnEdition) {
            await modifierEvenement(evenementEnEdition.id, payload);
        } else {
            await creerEvenement(payload);
        }
        setModalOuvert(false);
        await charger();
    }

    async function handleChangerStatut(id: number, statut: StatutEvenement) {
        try {
            await changerStatutEvenement(id, statut);
            await charger();
        } catch {
            setErreur("Impossible de changer le statut de cet événement.");
        }
    }

    async function handleSupprimer(id: number) {
        if (!window.confirm("Supprimer définitivement cet événement ?")) return;
        try {
            await supprimerEvenement(id);
            await charger();
        } catch {
            setErreur("Impossible de supprimer cet événement.");
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-page__container">
                <div className="admin-page__head">
                    <div>
                        <h1 className="admin-page__title">Événements</h1>
                        <p className="admin-page__subtitle">Créer, publier et gérer les événements affichés sur la plateforme.</p>
                    </div>
                    <button type="button" className="admin-btn admin-btn--primary" onClick={ouvrirCreation}>
                        + Créer un événement
                    </button>
                </div>

                {erreur && <div className="admin-alert">{erreur}</div>}

                {chargement ? (
                    <div className="admin-table-wrap">
                        <div className="admin-table__empty" style={{ padding: 40 }}>
                            Chargement…
                        </div>
                    </div>
                ) : evenements.length === 0 ? (
                    <div className="admin-table-wrap">
                        <div className="admin-table__empty" style={{ padding: 40 }}>
                            Aucun événement pour le moment.
                        </div>
                    </div>
                ) : (
                    <div className="evenement-admin-list">
                        {evenements.map((e) => (
                            <div className="evenement-admin-card" key={e.id}>
                                {e.imageUrl && <img src={e.imageUrl} alt={e.titre} className="evenement-admin-card__image" />}
                                <div className="evenement-admin-card__body">
                                    <div className="evenement-admin-card__head">
                                        <h3 className="evenement-admin-card__titre">{e.titre}</h3>
                                        <span className={classeStatut(e.statut)}>{LABELS_STATUT_EVENEMENT[e.statut]}</span>
                                    </div>
                                    <p className="evenement-admin-card__meta">
                                        {formatDate(e.dateEvenement)} {e.heure ? `à ${e.heure}` : ""} {e.lieu ? `· ${e.lieu}` : ""}
                                    </p>
                                    <p className="evenement-admin-card__meta">
                                        {e.type ? LABELS_TYPE_EVENEMENT[e.type] : ""} {e.organisateur ? `· ${e.organisateur}` : ""}
                                    </p>
                                    {e.description && <p className="evenement-admin-card__desc">{e.description}</p>}

                                    <div className="evenement-admin-card__actions">
                                        <button type="button" className="candidature-row__btn" onClick={() => ouvrirEdition(e)}>
                                            Modifier
                                        </button>
                                        {e.statut !== "PUBLIEE" && (
                                            <button
                                                type="button"
                                                className="candidature-row__btn"
                                                onClick={() => handleChangerStatut(e.id, "PUBLIEE")}
                                            >
                                                Publier
                                            </button>
                                        )}
                                        {e.statut === "PUBLIEE" && (
                                            <button
                                                type="button"
                                                className="candidature-row__btn"
                                                onClick={() => handleChangerStatut(e.id, "ARCHIVEE")}
                                            >
                                                Archiver
                                            </button>
                                        )}
                                        {e.statut === "ARCHIVEE" && (
                                            <button
                                                type="button"
                                                className="candidature-row__btn"
                                                onClick={() => handleChangerStatut(e.id, "BROUILLON")}
                                            >
                                                Repasser en brouillon
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="candidature-row__btn candidature-row__btn--danger"
                                            onClick={() => handleSupprimer(e.id)}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {modalOuvert && (
                <EvenementFormModal
                    evenement={evenementEnEdition}
                    onFermer={() => setModalOuvert(false)}
                    onEnregistrer={handleEnregistrer}
                />
            )}
        </div>
    );
}