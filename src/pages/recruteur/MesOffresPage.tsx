import { useCallback, useEffect, useState } from "react";
import {
    fermerOffre,
    LABELS_STATUT_OFFRE,
    LABELS_TYPE_CONTRAT,
    listerMesOffres,
    publierOffre,
    supprimerOffre,
} from "../../api/offreService";
import type { OffreDTO } from "../../api/offreService";
import { OffreFormModal } from "./OffreFormModal";
import "./MesOffresPage.css";

type EtatModal = { ouvert: false } | { ouvert: true; offreId?: number };

export function MesOffresPage() {
    const [offres, setOffres] = useState<OffreDTO[]>([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState<string | null>(null);
    const [actionEnCours, setActionEnCours] = useState<number | null>(null);
    const [modal, setModal] = useState<EtatModal>({ ouvert: false });

    const charger = useCallback(async () => {
        setChargement(true);
        setErreur(null);
        try {
            const resultat = await listerMesOffres();
            setOffres(resultat);
        } catch {
            setErreur("Impossible de charger vos offres. Réessaie dans un instant.");
        } finally {
            setChargement(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch au montage, pattern standard
        charger();
    }, [charger]);

    async function handlePublier(offre: OffreDTO) {
        setActionEnCours(offre.id);
        try {
            const maj = await publierOffre(offre.id);
            setOffres((liste) => liste.map((o) => (o.id === maj.id ? maj : o)));
        } catch {
            setErreur("La publication a échoué.");
        } finally {
            setActionEnCours(null);
        }
    }

    async function handleFermer(offre: OffreDTO) {
        setActionEnCours(offre.id);
        try {
            const maj = await fermerOffre(offre.id);
            setOffres((liste) => liste.map((o) => (o.id === maj.id ? maj : o)));
        } catch {
            setErreur("La fermeture a échoué.");
        } finally {
            setActionEnCours(null);
        }
    }

    async function handleSupprimer(offre: OffreDTO) {
        const confirme = window.confirm(`Supprimer définitivement l'offre "${offre.titre}" ?`);
        if (!confirme) return;

        setActionEnCours(offre.id);
        try {
            await supprimerOffre(offre.id);
            setOffres((liste) => liste.filter((o) => o.id !== offre.id));
        } catch {
            setErreur("La suppression a échoué.");
        } finally {
            setActionEnCours(null);
        }
    }

    function handleOffreEnregistree(offre: OffreDTO) {
        setOffres((liste) => {
            const existe = liste.some((o) => o.id === offre.id);
            return existe ? liste.map((o) => (o.id === offre.id ? offre : o)) : [offre, ...liste];
        });
        setModal({ ouvert: false });
    }

    return (
        <div className="offres-page">
            <div className="offres-page__head">
                <div>
                    <h1 className="offres-page__title">Mes offres</h1>
                    <p className="offres-page__subtitle">Gère tes offres d'emploi, de brouillon à publication.</p>
                </div>
                <button className="offres-btn offres-btn--primary" onClick={() => setModal({ ouvert: true })}>
                    + Nouvelle offre
                </button>
            </div>

            {erreur && <div className="offres-alert">{erreur}</div>}

            {chargement ? (
                <div className="offres-empty">Chargement…</div>
            ) : offres.length === 0 ? (
                <div className="offres-empty">
                    <p>Tu n'as encore publié aucune offre.</p>
                    <button className="offres-btn offres-btn--primary" onClick={() => setModal({ ouvert: true })}>
                        Créer ma première offre
                    </button>
                </div>
            ) : (
                <div className="offres-list">
                    {offres.map((offre) => (
                        <div className="offre-card" key={offre.id}>
                            <div className="offre-card__main">
                                <div className="offre-card__top">
                                    <span className={`offre-statut offre-statut--${offre.statut.toLowerCase()}`}>
                                        {LABELS_STATUT_OFFRE[offre.statut]}
                                    </span>
                                    <span className="offre-card__type">{LABELS_TYPE_CONTRAT[offre.typeContrat]}</span>
                                </div>
                                <h3 className="offre-card__titre">{offre.titre}</h3>
                                <p className="offre-card__meta">
                                    {[offre.ville, offre.region, offre.pays].filter(Boolean).join(", ") || "Lieu non précisé"}
                                    {offre.teletravail ? " · Télétravail" : ""}
                                </p>
                            </div>

                            <div className="offre-card__actions">
                                <button
                                    className="offres-btn offres-btn--ghost"
                                    onClick={() => setModal({ ouvert: true, offreId: offre.id })}
                                >
                                    Modifier
                                </button>

                                {(offre.statut === "BROUILLON" || offre.statut === "FERMEE") && (
                                    <button
                                        className="offres-btn offres-btn--gold"
                                        disabled={actionEnCours === offre.id}
                                        onClick={() => handlePublier(offre)}
                                    >
                                        Publier
                                    </button>
                                )}

                                {offre.statut === "PUBLIEE" && (
                                    <button
                                        className="offres-btn offres-btn--ghost"
                                        disabled={actionEnCours === offre.id}
                                        onClick={() => handleFermer(offre)}
                                    >
                                        Fermer
                                    </button>
                                )}

                                <button
                                    className="offres-btn offres-btn--danger"
                                    disabled={actionEnCours === offre.id}
                                    onClick={() => handleSupprimer(offre)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modal.ouvert && (
                <OffreFormModal
                    offreId={modal.offreId}
                    onFermer={() => setModal({ ouvert: false })}
                    onEnregistre={handleOffreEnregistree}
                />
            )}
        </div>
    );
}